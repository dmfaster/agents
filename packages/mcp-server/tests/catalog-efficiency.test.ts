import assert from "node:assert/strict";
import test from "node:test";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { AGENT_TOOL_POLICIES, type AgentToolResult } from "@dmfaster/sdk";
import { createDmfasterMcpCore } from "../src/core.ts";

function request(method: string, params: Record<string, unknown> = {}) {
  return new Request("http://localhost/mcp", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
      "mcp-protocol-version": "2026-07-28",
      "mcp-method": method,
      ...(params.name ? { "mcp-name": String(params.name) } : {}),
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method,
      params: {
        ...params,
        _meta: {
          "io.modelcontextprotocol/protocolVersion": "2026-07-28",
          "io.modelcontextprotocol/clientInfo": { name: "test", version: "1" },
          "io.modelcontextprotocol/clientCapabilities": {},
        },
      },
    }),
  });
}

for (const fullOutputSchemas of [false, true]) {
  test(`catalog output schemas are opt-in (${fullOutputSchemas})`, async () => {
    const handler = createMcpHandler(
      () =>
        createDmfasterMcpCore({
          fullOutputSchemas,
          catalogProfile: "full",
          client: {
            invoke: async () => {
              throw Error("No execution during discovery");
            },
          },
        }),
      { responseMode: "json" },
    );
    try {
      const response = await handler.fetch(request("tools/list"));
      const payload = await response.json();
      assert.equal(payload.error, undefined);
      const bytes = Buffer.byteLength(JSON.stringify(payload));
      if (!fullOutputSchemas) assert.ok(bytes < 600_000, `tools/list was ${bytes} bytes`);
      const sender = payload.result.tools.find(
        (tool: { name: string }) => tool.name === "senders_inspect",
      );
      assert.equal(Boolean(sender.outputSchema), fullOutputSchemas);
    } finally {
      await handler.close();
    }
  });
}

for (const fullOutputSchemas of [false, true])
  test(`senders_inspect {} preserves successful structured content (full schemas: ${fullOutputSchemas})`, async () => {
    const result = {
      version: 1,
      tool: "senders.inspect",
      policy: AGENT_TOOL_POLICIES["senders.inspect"],
      ok: true,
      generatedAt: "2026-10-24T00:00:00Z",
      serverTime: "2026-10-24T00:00:00Z",
      durationMs: 1,
      evidence: [],
      consistency: { status: "verified", checks: [] },
      data: {
        generatedAt: "2026-10-24T00:00:00Z",
        browserSetupUrl: "https://dmfaster.com/app/settings",
        browserProfiles: [],
        mailboxes: [],
        sms: { available: false, configured: false, enabled: false, phoneNumber: "" },
      },
      artifacts: [],
      error: null,
    } as unknown as AgentToolResult;
    const handler = createMcpHandler(
      () =>
        createDmfasterMcpCore({
          fullOutputSchemas,
          catalogProfile: "full",
          client: {
            invoke: async (tool, input) => {
              assert.equal(tool, "senders.inspect");
              assert.deepEqual(input, {});
              return result;
            },
          },
        }),
      { responseMode: "json" },
    );
    try {
      const payload = await (
        await handler.fetch(request("tools/call", { name: "senders_inspect", arguments: {} }))
      ).json();
      assert.equal(payload.error, undefined);
      assert.equal(payload.result.isError, undefined, JSON.stringify(payload));
      assert.deepEqual(payload.result.structuredContent, result);
    } finally {
      await handler.close();
    }
  });

test("companies_search accepts supported country filters over the MCP wire", async () => {
  const invoked: unknown[] = [];
  const handler = createMcpHandler(
    () =>
      createDmfasterMcpCore({
        catalogProfile: "full",
        client: {
          invoke: async (tool, input) => {
            assert.equal(tool, "companies.search");
            invoked.push(input);
            throw Error("Offline schema validation probe");
          },
        },
      }),
    { responseMode: "json" },
  );
  try {
    for (const country of ["FI", "UK", "SE", "US"]) {
      const input = { filters: { countries: [country] } };
      await handler.fetch(request("tools/call", { name: "companies_search", arguments: input }));
      assert.deepEqual(invoked.at(-1), input);
    }
    assert.equal(invoked.length, 4);
    await handler.fetch(
      request("tools/call", {
        name: "companies_search",
        arguments: { filters: { countries: ["ZZ"] } },
      }),
    );
    assert.equal(invoked.length, 4, "Unsupported countries must fail before dispatch");
  } finally {
    await handler.close();
  }
});
