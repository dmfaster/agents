import assert from "node:assert/strict";
import { createInterface } from "node:readline";
import { PassThrough } from "node:stream";
import test from "node:test";

import {
  AGENT_TOOL_DEFINITIONS,
  type AgentToolInputMap,
  type AgentToolName,
  type AgentToolResult,
} from "@dmfaster/sdk";
import { serveStdio, StdioServerTransport } from "@modelcontextprotocol/server/stdio";

import { MCP_SERVER_INSTRUCTIONS, createDmfasterMcpServer } from "../src/server.ts";
import { MCP_TOOL_NAMES, type AgentInvoker } from "../src/tools.ts";
import { evidenceInitial } from "./fixtures/company-evidence.mjs";

type JsonObject = Record<string, unknown>;

function result(tool: AgentToolName): AgentToolResult {
  return {
    version: 1,
    tool,
    policy: { effect: "read", approval: "none", exposure: "public_api" },
    ok: true,
    generatedAt: "2026-08-02T12:00:00.000Z",
    durationMs: 1,
    evidence: [],
    consistency: { status: "verified", checks: [] },
    data: null,
    artifacts: [],
    error: null,
  };
}

function fakeClient(calls: Array<{ tool: AgentToolName; input: unknown }>): AgentInvoker {
  return {
    async invoke<Name extends AgentToolName>(tool: Name, input: AgentToolInputMap[Name]) {
      calls.push({ tool, input });
      return result(tool);
    },
  };
}

function createWire(client: AgentInvoker) {
  const input = new PassThrough();
  const output = new PassThrough();
  const lines = createInterface({ input: output, crlfDelay: Infinity });
  const iterator = lines[Symbol.asyncIterator]();
  const handle = serveStdio(
    () =>
      createDmfasterMcpServer({
        client,
        env: { DMFASTER_API_URL: "https://app.dmfaster.test", DMFASTER_MCP_PROFILE: "full" },
        auth: {
          credentialStore: {
            kind: "macos-keychain",
            async get() {
              return null;
            },
            async set() {},
            async delete() {},
          },
        },
      }),
    { transport: new StdioServerTransport(input, output), legacy: "reject" },
  );

  return {
    send(message: JsonObject) {
      input.write(`${JSON.stringify(message)}\n`);
    },
    async receive(): Promise<JsonObject> {
      const next = await iterator.next();
      assert.equal(next.done, false, "MCP transport closed before sending a response");
      return JSON.parse(next.value) as JsonObject;
    },
    async close() {
      lines.close();
      await handle.close();
    },
  };
}

const modernEnvelope = {
  "io.modelcontextprotocol/protocolVersion": "2026-07-28",
  "io.modelcontextprotocol/clientInfo": { name: "dmfaster-test", version: "1.1.0" },
  "io.modelcontextprotocol/clientCapabilities": {},
};

test("all evidence lifecycle tools preserve full results for structured and text-only MCP clients", async (t) => {
  const data = evidenceInitial().result.data;
  const client: AgentInvoker = {
    async invoke(tool) {
      return { ...result(tool), data } as AgentToolResult;
    },
  };
  const wire = createWire(client);
  t.after(() => wire.close());
  const handles = { runId: data.runId, expectedRevision: data.expectedRevision };
  const cases = [
    {
      name: "companies_evidence_start",
      tool: "companies.evidence.start",
      input: {
        country: "FI",
        query: "Finnish SaaS companies",
        evaluationMode: "binary",
        idempotencyKey: "compact-mcp-lifecycle-test",
        criteria: [
          {
            id: "saas",
            statement: "Does this company offer its own SaaS product?",
            requirement: "advertised",
            retrievalTerms: [],
          },
        ],
      },
    },
    {
      name: "companies_evidence_advance",
      tool: "companies.evidence.advance",
      input: { ...handles, batchSize: 1 },
    },
    { name: "companies_evidence_status", tool: "companies.evidence.status", input: handles },
    { name: "companies_evidence_results", tool: "companies.evidence.results", input: handles },
    { name: "companies_evidence_cancel", tool: "companies.evidence.cancel", input: handles },
  ] as const;
  for (const [index, entry] of cases.entries()) {
    wire.send({
      jsonrpc: "2.0",
      id: index + 1,
      method: "tools/call",
      params: { name: entry.name, arguments: entry.input, _meta: modernEnvelope },
    });
    const response = await wire.receive();
    assert.equal(response.error, undefined);
    const received = response.result as JsonObject;
    assert.deepEqual(received.structuredContent, { ...result(entry.tool), data });
    const content = received.content as { type: string; text: string }[];
    assert.equal(content.length, 1);
    assert.deepEqual(JSON.parse(content[0]!.text), received.structuredContent);
  }
});

test("progress-only evidence status forwards the typed flag and distinguishes omitted rows from no matches", async (t) => {
  const data = {
    ...evidenceInitial().result.data,
    companies: [],
    companiesIncluded: false as const,
  };
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  const client: AgentInvoker = {
    async invoke(tool, input) {
      calls.push({ tool, input });
      return { ...result(tool), data } as AgentToolResult;
    },
  };
  const wire = createWire(client);
  t.after(() => wire.close());
  const input = {
    runId: data.runId,
    expectedRevision: data.expectedRevision,
    includeCompanies: false,
  };
  wire.send({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: { name: "companies_evidence_status", arguments: input, _meta: modernEnvelope },
  });
  const response = await wire.receive();
  assert.equal(response.error, undefined);
  assert.deepEqual(calls, [{ tool: "companies.evidence.status", input }]);
  const received = response.result as JsonObject;
  assert.deepEqual(received.structuredContent, { ...result("companies.evidence.status"), data });
  const content = received.content as { text: string }[];
  assert.deepEqual(JSON.parse(content[0]!.text), received.structuredContent);
  assert.equal(data.companiesIncluded, false);
});

test("serves headless domain tools and docs over the stateless MCP wire", async (context) => {
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  const wire = createWire(fakeClient(calls));
  context.after(() => wire.close());
  wire.send({
    jsonrpc: "2.0",
    id: 1,
    method: "server/discover",
    params: { _meta: modernEnvelope },
  });
  const discover = (await wire.receive()).result as JsonObject;
  assert.deepEqual(discover.supportedVersions, ["2026-07-28"]);
  assert.equal(discover.instructions, MCP_SERVER_INSTRUCTIONS);
  assert.ok(MCP_SERVER_INSTRUCTIONS.length <= 512);
  assert.equal((discover.capabilities as JsonObject).extensions, undefined);
  wire.send({ jsonrpc: "2.0", id: 2, method: "tools/list", params: { _meta: modernEnvelope } });
  const tools = ((await wire.receive()).result as JsonObject).tools as JsonObject[];
  const hidden = new Set<string>(
    Object.values(AGENT_TOOL_DEFINITIONS)
      .filter(
        (definition) =>
          "deprecatedSuccessor" in definition.mcp && definition.mcp.deprecatedSuccessor,
      )
      .map((definition) => definition.mcp.name),
  );
  assert.deepEqual(
    tools.map((tool) => tool.name).sort(),
    MCP_TOOL_NAMES.filter((name) => !hidden.has(name)).sort(),
  );
  for (const tool of tools) {
    assert.equal((tool._meta as JsonObject | undefined)?.ui, undefined);
    assert.equal((tool._meta as JsonObject | undefined)?.["openai/outputTemplate"], undefined);
  }
  assert.equal(tools.find((tool) => tool.name === "senders_inspect")?.outputSchema, undefined);
  // Deprecated names remain available through the scoped domain dispatcher.
  wire.send({
    jsonrpc: "2.0",
    id: 3,
    method: "tools/call",
    params: {
      name: "tools_call",
      arguments: { tool: "workspace_briefing", input: {} },
      _meta: modernEnvelope,
    },
  });
  assert.equal(((await wire.receive()).result as JsonObject).isError, undefined);
  assert.deepEqual(calls, [{ tool: "workspace.briefing", input: {} }]);
  wire.send({
    jsonrpc: "2.0",
    id: 4,
    method: "tools/call",
    params: { name: "connection_status", arguments: {}, _meta: modernEnvelope },
  });
  assert.equal(
    (((await wire.receive()).result as JsonObject).structuredContent as JsonObject).status,
    "not_authenticated",
  );
  wire.send({ jsonrpc: "2.0", id: 5, method: "resources/list", params: { _meta: modernEnvelope } });
  const resources = ((await wire.receive()).result as JsonObject).resources as JsonObject[];
  assert.deepEqual(
    resources.map((resource) => resource.uri),
    ["dmfaster://docs/agents"],
  );
  wire.send({
    jsonrpc: "2.0",
    id: 6,
    method: "tools/call",
    params: { name: "campaign_workspace", arguments: {}, _meta: modernEnvelope },
  });
  const retired = await wire.receive();
  assert.ok(retired.error || (retired.result as JsonObject)?.isError);
  assert.equal(calls.length, 1);
});

test("rejects the 2025 initialize flow and remains available for stateless MCP", async (context) => {
  const wire = createWire(fakeClient([]));
  context.after(() => wire.close());

  wire.send({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2025-11-25",
      capabilities: {},
      clientInfo: { name: "dmfaster-legacy-test", version: "1.1.0" },
    },
  });
  const rejected = await wire.receive();
  assert.match(String((rejected.error as JsonObject).message), /unsupported protocol version/i);
  assert.deepEqual(((rejected.error as JsonObject).data as JsonObject).supported, ["2026-07-28"]);

  wire.send({
    jsonrpc: "2.0",
    id: 2,
    method: "server/discover",
    params: { _meta: modernEnvelope },
  });
  const discovered = await wire.receive();
  assert.deepEqual((discovered.result as JsonObject).supportedVersions, ["2026-07-28"]);
});

test(
  "MCP cancellation reaches the domain adapter and leaves the connection usable",
  { timeout: 5000 },
  async (t) => {
    let started!: () => void, observed!: () => void;
    const entered = new Promise<void>((resolve) => {
      started = resolve;
    });
    const aborted = new Promise<void>((resolve) => {
      observed = resolve;
    });
    const wire = createWire({
      async invoke(tool, _input, options) {
        if (tool === "workspace.briefing") {
          assert.ok(options?.signal);
          started();
          await new Promise<void>((resolve) =>
            options.signal!.addEventListener(
              "abort",
              () => {
                observed();
                resolve();
              },
              { once: true },
            ),
          );
        }
        return result(tool);
      },
    });
    t.after(() => wire.close());
    wire.send({
      jsonrpc: "2.0",
      id: 900,
      method: "tools/call",
      params: {
        name: "tools_call",
        arguments: { tool: "workspace_briefing", input: {} },
        _meta: modernEnvelope,
      },
    });
    await entered;
    wire.send({
      jsonrpc: "2.0",
      method: "notifications/cancelled",
      params: { requestId: 900, reason: "stop" },
    });
    await aborted;
    wire.send({
      jsonrpc: "2.0",
      id: 901,
      method: "tools/call",
      params: { name: "connection_status", arguments: {}, _meta: modernEnvelope },
    });
    let reply;
    do {
      reply = await wire.receive();
    } while (reply.id !== 901);
    assert.equal((reply.result as JsonObject).isError, undefined);
  },
);

test("heartbeat fits in 300 bytes over the actual MCP wire and full diagnostics remain available", async (t) => {
  const { AGENT_TOOL_POLICIES, AGENT_CONTRACT_VERSION } = await import("@dmfaster/sdk");
  const data = {
    agentId: "agt_sandbox",
    status: "working",
    at: "2026-10-23T20:00:00.000Z",
    nextInSeconds: 900,
    dryRun: false,
  };
  const wire = createWire({
    async invoke(tool) {
      return {
        ...result(tool),
        policy: AGENT_TOOL_POLICIES[tool],
        serverTime: data.at,
        contractVersion: AGENT_CONTRACT_VERSION,
        data,
      };
    },
  });
  t.after(() => wire.close());
  wire.send({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "agent_heartbeat",
      arguments: { agentId: data.agentId, status: "working" },
      _meta: modernEnvelope,
    },
  });
  const response = await wire.receive();
  assert.equal(response.error, undefined);
  const bytes = Buffer.byteLength(JSON.stringify(response));
  t.diagnostic(`Heartbeat JSON-RPC response: ${bytes} bytes`);
  assert.ok(bytes <= 300, JSON.stringify(response));
  const ack = response.result as JsonObject;
  assert.deepEqual(ack.content, []);
  assert.equal((ack.structuredContent as JsonObject).ok, true);
  wire.send({
    jsonrpc: "2.0",
    id: 2,
    method: "tools/call",
    params: {
      name: "agent_heartbeat",
      arguments: { agentId: data.agentId, status: "working", responseMode: "full" },
      _meta: modernEnvelope,
    },
  });
  const full = await wire.receive();
  assert.equal(full.error, undefined);
  assert.equal(
    ((full.result as JsonObject).structuredContent as JsonObject).tool,
    "agent.heartbeat",
  );
});

test("compact dispatch reports invalid input before invoking the domain adapter", async (t) => {
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  const wire = createWire(fakeClient(calls));
  t.after(() => wire.close());
  wire.send({
    jsonrpc: "2.0",
    id: 950,
    method: "tools/call",
    params: {
      name: "tools_call",
      arguments: {
        tool: "companies_search",
        input: { filters: { country: "FI", unsupportedTest: true } },
      },
      _meta: modernEnvelope,
    },
  });
  const response = await wire.receive();
  const payload = response.result as {
    isError: boolean;
    structuredContent: { error: { code: string; message: string } };
  };
  assert.equal(payload.isError, true);
  assert.equal(payload.structuredContent.error.code, "invalid_input");
  assert.match(payload.structuredContent.error.message, /tools_discover/);
  assert.match(payload.structuredContent.error.message, /No action was executed/);
  assert.equal(calls.length, 0);
});

test("dispatchers advertise accurate effects and reject mismatched tools before execution", async (t) => {
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  const wire = createWire(fakeClient(calls));
  t.after(() => wire.close());
  wire.send({ jsonrpc: "2.0", id: 960, method: "tools/list", params: { _meta: modernEnvelope } });
  const catalog = (await wire.receive()).result as {
    tools: Array<{
      name: string;
      annotations: { readOnlyHint: boolean; destructiveHint: boolean };
    }>;
  };
  assert.equal(
    catalog.tools.find((tool) => tool.name === "tools_read")?.annotations.readOnlyHint,
    true,
  );
  assert.equal(
    catalog.tools.find((tool) => tool.name === "tools_write")?.annotations.destructiveHint,
    false,
  );
  assert.equal(
    catalog.tools.find((tool) => tool.name === "tools_call")?.annotations.destructiveHint,
    true,
  );
  for (const [name, tool] of [
    ["tools_read", "campaign_launch"],
    ["tools_write", "campaign_launch"],
    ["tools_write", "companies_search"],
  ]) {
    wire.send({
      jsonrpc: "2.0",
      id: 961,
      method: "tools/call",
      params: { name, arguments: { tool, input: {} }, _meta: modernEnvelope },
    });
    const response = (await wire.receive()).result as {
      isError: boolean;
      structuredContent: { error: { message: string } };
    };
    assert.equal(response.isError, true);
    assert.match(response.structuredContent.error.message, /requires tools_/);
  }
  assert.equal(calls.length, 0);
  wire.send({
    jsonrpc: "2.0",
    id: 962,
    method: "tools/call",
    params: {
      name: "tools_read",
      arguments: { tool: "companies_search", input: { filters: { country: "FI" } } },
      _meta: modernEnvelope,
    },
  });
  await wire.receive();
  assert.equal(calls.length, 1);
});
