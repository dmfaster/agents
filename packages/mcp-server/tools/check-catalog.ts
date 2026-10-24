import assert from "node:assert/strict";
import { PassThrough } from "node:stream";
import { createInterface } from "node:readline";
import { serveStdio, StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { createDmfasterMcpCore } from "../src/core.ts";
export async function measureAgentCatalog() {
  const reports = [];
  for (const scenario of [
    { catalogProfile: "compact" },
    { catalogProfile: "full" },
    {
      catalogProfile: "compact",
      grantedScopes: [] as string[],
      hostedAuth: { grantedScopes: [], resourceMetadataUrl: "https://example.test/oauth/resource" },
    },
  ] as const) {
    const { catalogProfile } = scenario;
    const input = new PassThrough(),
      output = new PassThrough();
    const lines = createInterface({ input: output, crlfDelay: Infinity });
    const iterator = lines[Symbol.asyncIterator]();
    const server = createDmfasterMcpCore({
      catalogProfile,
      ...("hostedAuth" in scenario ? { hostedAuth: scenario.hostedAuth } : {}),
      client: {
        async invoke() {
          throw Error("Catalog inspection must not invoke a provider");
        },
      },
      hostedConnection: async () => ({}),
    });
    server.server.onerror = (error) => console.error(error);
    const handle = serveStdio(() => server, { transport: new StdioServerTransport(input, output) });
    try {
      input.write(
        JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "tools/list",
          params: {
            _meta: {
              "io.modelcontextprotocol/protocolVersion": "2026-07-28",
              "io.modelcontextprotocol/clientInfo": { name: "catalog-check", version: "2.6.1" },
              "io.modelcontextprotocol/clientCapabilities": {},
            },
          },
        }) + "\n",
      );
      let next = await iterator.next();
      while (!next.done && JSON.parse(next.value!).id !== 1) next = await iterator.next();
      assert.equal(next.done, false);
      const result = JSON.parse(next.value!).result;
      assert.ok(Array.isArray(result?.tools), `MCP tools/list result required: ${next.value}`);
      const bytes = Buffer.byteLength(JSON.stringify(result));
      const report = {
        profile: "grantedScopes" in scenario ? "compact-no-scopes" : catalogProfile,
        tools: result.tools.length,
        bytes,
        estimatedTokens: Math.ceil(bytes / 4),
      };
      reports.push(report);
      if (catalogProfile === "compact")
        assert.ok(bytes <= 100000, `Catalog exceeds 100KB: ${bytes}`);
      assert.ok(!result.tools.some((t: { name: string }) => t.name === "workspace_open"));
      const descriptions = result.tools.map((t: { description: string }) => t.description);
      assert.equal(
        new Set(descriptions).size,
        descriptions.length,
        "Tool descriptions must be unique",
      );
      assert.ok(
        descriptions.every((d: string) => d.length <= 300),
        "Tool descriptions <=300 chars",
      );
      if (catalogProfile === "compact" && !("grantedScopes" in scenario)) {
        for (const [index, name] of [
          "companies_search",
          "audience_preview",
          "prospecting_preview",
        ].entries()) {
          assert.ok(
            result.tools.some((t: { name: string }) => t.name === name),
            `${name} must be directly callable`,
          );
          input.write(
            JSON.stringify({
              jsonrpc: "2.0",
              id: 10 + index,
              method: "tools/call",
              params: {
                name,
                arguments: {},
                _meta: {
                  "io.modelcontextprotocol/protocolVersion": "2026-07-28",
                  "io.modelcontextprotocol/clientInfo": { name: "catalog-check", version: "2.6.1" },
                  "io.modelcontextprotocol/clientCapabilities": {},
                },
              },
            }) + "\n",
          );
          let call = await iterator.next();
          while (!call.done && JSON.parse(call.value!).id !== 10 + index)
            call = await iterator.next();
          assert.equal(call.done, false);
          assert.doesNotMatch(call.value!, /tool.*not found|unknown tool/i);
          const response = JSON.parse(call.value!);
          assert.ok(
            response.result?.isError || response.error,
            "An invalid input or fake provider must be refused, never dispatched externally",
          );
        }
      }
      if ("grantedScopes" in scenario)
        assert.deepEqual(result.tools.map((t: { name: string }) => t.name).sort(), [
          "connection_status",
          "tools_call",
          "tools_discover",
        ]);
    } finally {
      lines.close();
      await handle.close();
    }
  }
  return reports;
}
if (process.argv[1]?.endsWith("check-catalog.ts"))
  console.log(JSON.stringify(await measureAgentCatalog()));
