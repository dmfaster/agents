import assert from "node:assert/strict";
import { createInterface } from "node:readline";
import { PassThrough } from "node:stream";
import test from "node:test";

import type { AgentToolInputMap, AgentToolName, AgentToolResult } from "@dmfaster/sdk";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";

import { MCP_SERVER_INSTRUCTIONS, serveDmfasterStdio } from "../src/server.ts";
import { MCP_TOOL_NAMES, type AgentInvoker } from "../src/tools.ts";
import {
  CAMPAIGN_WORKSPACE_RESOURCE_URI,
  LEGACY_CAMPAIGN_WORKSPACE_RESOURCE_URI,
  PREVIOUS_CAMPAIGN_WORKSPACE_RESOURCE_URI,
  MCP_APP_RESOURCE_MIME_TYPE,
} from "../src/campaign-workspace.ts";

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
  const handle = serveDmfasterStdio(
    client,
    {
      transport: new StdioServerTransport(input, output),
    },
    {
      env: { DMFASTER_API_URL: "https://app.dmfaster.test" },
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
    },
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

test("mention resource templates reach the current domain client with decoded identities", async (t) => {
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  let allowed = true;
  const client: AgentInvoker = {
    async invoke(tool, input) {
      calls.push({ tool, input });
      const receipt = result(tool);
      receipt.ok = allowed;
      receipt.data = allowed
        ? {
            list: {
              listId: "list/one%two",
              name: "Current list",
              updatedAt: "2026-10-01",
              total: 1,
            },
            usernames: ["one"],
            nextOffset: null,
            membership: null,
          }
        : null;
      return receipt;
    },
  };
  const wire = createWire(client);
  t.after(() => wire.close());
  const uri = "dmfaster://lists/list%2Fone%25two";
  wire.send({
    jsonrpc: "2.0",
    id: 1,
    method: "resources/read",
    params: { uri, _meta: modernEnvelope },
  });
  const response = await wire.receive();
  assert.equal(response.error, undefined);
  const contents = (response.result as JsonObject).contents as Array<JsonObject>;
  assert.equal(contents[0]?.uri, uri);
  assert.equal(JSON.parse(String(contents[0]?.text)).contextOnly, true);
  assert.deepEqual(calls, [{ tool: "list.inspect", input: { listId: "list/one%two", limit: 25 } }]);
  allowed = false;
  wire.send({
    jsonrpc: "2.0",
    id: 2,
    method: "resources/read",
    params: { uri, _meta: modernEnvelope },
  });
  const denied = await wire.receive();
  assert.ok(denied.error);
  assert.equal(calls.length, 2);
});

const campaignState = {
  profile: {
    version: 1 as const,
    businessName: "Example Analytics",
    websiteUrl: "https://example.test",
    businessDescription: "Revenue analytics for B2B software companies.",
    offer: "A revenue analytics workspace",
    customerOutcome: "Find pipeline gaps and improve conversion.",
    differentiators: ["Fast setup"],
    proofPoints: ["Used by revenue teams"],
    preferredTone: "Direct and useful",
    preferredLanguages: ["English"],
    defaultCountries: ["FI" as const],
    excludedCompanyTraits: [],
  },
  brief: {
    version: 1 as const,
    objective: "Book a discovery call",
    offer: "A revenue analytics workspace",
    targetDescription: "Finnish B2B software companies",
    countries: ["FI" as const],
    industryCodes: ["62010"],
    decisionMakerRoles: ["Head of Sales"],
    companySize: {
      employeeMin: 10,
      employeeMax: 250,
      revenueMinEur: null,
      revenueMaxEur: null,
    },
    requestedSignals: [],
    exclusions: [],
    callToAction: "Open to a 15-minute review?",
    requestedChannels: ["instagram" as const],
    messageLanguage: "English",
    tone: "Direct and useful",
    dailyVolume: 20,
    deliverySettings: {
      dailyCap: 20,
      windowStart: "09:00",
      windowEnd: "16:00",
      weekdays: 31,
      timezone: "Europe/Helsinki",
      confirmed: true,
    },
    outreachMessages: [
      {
        channels: ["instagram" as const],
        subject: "",
        body: "Hi — would a quick revenue pipeline review be useful?",
        origin: "user" as const,
      },
    ],
  },
};

test("serves the stateless MCP 2026-07-28 protocol over stdio", async (context) => {
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  const wire = createWire(fakeClient(calls));
  context.after(() => wire.close());

  wire.send({
    jsonrpc: "2.0",
    id: 1,
    method: "server/discover",
    params: { _meta: modernEnvelope },
  });
  const discover = await wire.receive();
  assert.deepEqual((discover.result as JsonObject).supportedVersions, ["2026-07-28"]);
  assert.equal((discover.result as JsonObject).instructions, MCP_SERVER_INSTRUCTIONS);

  wire.send({
    jsonrpc: "2.0",
    id: 2,
    method: "tools/list",
    params: { _meta: modernEnvelope },
  });
  const listed = await wire.receive();
  const tools = (listed.result as JsonObject).tools as Array<JsonObject>;
  assert.deepEqual(
    tools.map((tool) => tool.name),
    MCP_TOOL_NAMES,
  );
  for (const tool of tools.filter(
    (candidate) =>
      ![
        "connection_status",
        "campaign_workspace",
        "companies_workspace",
        "workspace_open",
      ].includes(String(candidate.name)),
  )) {
    const outputSchema = tool.outputSchema as JsonObject;
    assert.equal(outputSchema.type, "object", `${tool.name} must advertise a result schema`);
    assert.ok(outputSchema.properties, `${tool.name} must describe its result fields`);
  }
  for (const tool of tools)
    assert.ok(tool.outputSchema, `${tool.name} must advertise a result schema`);
  assert.equal(
    (tools.find((tool) => tool.name === "campaign_launch")?._meta as JsonObject)[
      "openai/widgetAccessible"
    ],
    false,
  );
  assert.equal(
    (tools.find((tool) => tool.name === "campaign_prepare")?._meta as JsonObject)[
      "openai/widgetAccessible"
    ],
    true,
  );
  const workspaceTool = tools.find((tool) => tool.name === "campaign_workspace");
  assert.ok(workspaceTool);
  assert.equal(
    ((workspaceTool._meta as JsonObject).ui as JsonObject).resourceUri,
    CAMPAIGN_WORKSPACE_RESOURCE_URI,
  );
  assert.equal(
    (workspaceTool._meta as JsonObject)["openai/outputTemplate"],
    CAMPAIGN_WORKSPACE_RESOURCE_URI,
  );

  wire.send({
    jsonrpc: "2.0",
    id: 3,
    method: "tools/call",
    params: {
      name: "workspace_briefing",
      arguments: {},
      _meta: modernEnvelope,
    },
  });
  const called = await wire.receive();
  assert.equal((called.result as JsonObject).isError, undefined);
  assert.deepEqual(calls, [{ tool: "workspace.briefing", input: {} }]);

  wire.send({
    jsonrpc: "2.0",
    id: 31,
    method: "tools/call",
    params: { name: "connection_status", arguments: {}, _meta: modernEnvelope },
  });
  const connection = await wire.receive();
  assert.equal(
    ((connection.result as JsonObject).structuredContent as JsonObject).status,
    "not_authenticated",
  );

  wire.send({
    jsonrpc: "2.0",
    id: 4,
    method: "resources/list",
    params: { _meta: modernEnvelope },
  });
  const resourcesResponse = await wire.receive();
  const resources = (resourcesResponse.result as JsonObject).resources as Array<JsonObject>;
  assert.deepEqual(
    resources.map((resource) => resource.uri),
    [
      CAMPAIGN_WORKSPACE_RESOURCE_URI,
      PREVIOUS_CAMPAIGN_WORKSPACE_RESOURCE_URI,
      LEGACY_CAMPAIGN_WORKSPACE_RESOURCE_URI,
    ],
  );
  assert.equal(resources[0]?.mimeType, MCP_APP_RESOURCE_MIME_TYPE);

  const mentionsTool = tools.find((tool) => tool.name === "workspace_mentions");
  assert.ok(mentionsTool);
  assert.deepEqual((mentionsTool._meta as JsonObject)["openai/extensions"], {
    "mentions/search": {},
  });
  assert.deepEqual(((mentionsTool._meta as JsonObject).ui as JsonObject).visibility, ["app"]);
  wire.send({
    jsonrpc: "2.0",
    id: 41,
    method: "resources/templates/list",
    params: { _meta: modernEnvelope },
  });
  const templatesResponse = await wire.receive();
  const templates = (templatesResponse.result as JsonObject).resourceTemplates as Array<JsonObject>;
  assert.deepEqual(
    templates.map((template) => template.uriTemplate),
    [
      "dmfaster://companies/{country}/{businessId}",
      "dmfaster://lists/{listId}",
      "dmfaster://company-lists/{listId}",
    ],
  );

  wire.send({
    jsonrpc: "2.0",
    id: 5,
    method: "resources/read",
    params: { uri: CAMPAIGN_WORKSPACE_RESOURCE_URI, _meta: modernEnvelope },
  });
  const resourceResponse = await wire.receive();
  const contents = (resourceResponse.result as JsonObject).contents as Array<JsonObject>;
  assert.equal(contents[0]?.mimeType, MCP_APP_RESOURCE_MIME_TYPE);
  assert.match(String(contents[0]?.text), /ui\/initialize/u);
  assert.match(String(contents[0]?.text), /campaign_prepare/u);
  assert.equal(
    ((contents[0]?._meta as JsonObject).ui as JsonObject).domain,
    "https://app.dmfaster.com",
  );
  wire.send({
    jsonrpc: "2.0",
    id: 51,
    method: "resources/read",
    params: { uri: LEGACY_CAMPAIGN_WORKSPACE_RESOURCE_URI, _meta: modernEnvelope },
  });
  const legacyResource = await wire.receive();
  const legacyContents = (legacyResource.result as JsonObject).contents as Array<JsonObject>;
  assert.equal(legacyContents[0]?.uri, LEGACY_CAMPAIGN_WORKSPACE_RESOURCE_URI);
  assert.equal(legacyContents[0]?.text, contents[0]?.text);

  wire.send({
    jsonrpc: "2.0",
    id: 6,
    method: "tools/call",
    params: {
      name: "campaign_workspace",
      arguments: { state: campaignState },
      _meta: modernEnvelope,
    },
  });
  const presented = await wire.receive();
  const presentation = (presented.result as JsonObject).structuredContent as JsonObject;
  assert.equal(presentation.view, "dmfaster.campaign_workspace");
  assert.deepEqual(presentation.state, campaignState);
  assert.deepEqual(calls, [{ tool: "workspace.briefing", input: {} }]);
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

for (const name of ["workspace_open", "companies_workspace", "campaign_workspace"]) {
  test(`${name} opens with empty arguments and reads only the authenticated first page`, async (context) => {
    const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
    const wire = createWire(fakeClient(calls));
    context.after(() => wire.close());
    wire.send({ jsonrpc: "2.0", id: 1, method: "tools/list", params: { _meta: modernEnvelope } });
    const listed = (await wire.receive()).result as JsonObject;
    const tool = (listed.tools as JsonObject[]).find((item) => item.name === name)!;
    assert.deepEqual((tool._meta as JsonObject)["openai/ui"], {
      entrypoints: [{ type: name === "workspace_open" ? "global" : "thread" }],
    });
    assert.ok(!((tool.inputSchema as JsonObject).required as string[] | undefined)?.length);
    wire.send({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: { name, arguments: {}, _meta: modernEnvelope },
    });
    const opened = (await wire.receive()).result as JsonObject;
    assert.equal(opened.isError, undefined);
    assert.equal((opened.structuredContent as JsonObject).view, "dmfaster.workspace");
    assert.deepEqual(
      calls,
      name === "campaign_workspace"
        ? [{ tool: "campaigns.list", input: { limit: 20 } }]
        : [
            {
              tool: "companies.search",
              input: { filters: { countries: ["FI"], activeOnly: true }, pageSize: 20 },
            },
          ],
    );
  });
}

test("company presentation preserves complex filters and domain reads stay headless and app-callable", async (context) => {
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  const wire = createWire(fakeClient(calls));
  context.after(() => wire.close());
  wire.send({ jsonrpc: "2.0", id: 1, method: "tools/list", params: { _meta: modernEnvelope } });
  const tools = ((await wire.receive()).result as JsonObject).tools as JsonObject[];
  for (const name of ["companies_filters", "companies_search", "company_inspect"]) {
    const meta = tools.find((item) => item.name === name)!._meta as JsonObject;
    assert.equal(meta["openai/widgetAccessible"], true);
    assert.equal(meta["openai/outputTemplate"], undefined);
    assert.deepEqual((meta.ui as JsonObject).visibility, ["model", "app"]);
  }
  for (const name of ["companies_fit_start", "companies_list_prepare", "campaign_launch"]) {
    assert.equal(
      (tools.find((item) => item.name === name)!._meta as JsonObject)["openai/widgetAccessible"],
      false,
    );
  }
  const filters = {
    countries: ["FI", "SE"],
    activeOnly: true,
    technologies: ["shopify"],
    hasWebsite: true,
    employeeMin: "2",
    industryCodeSelections: [{ classification: "TOL", version: "2025", codes: ["62010"] }],
  };
  wire.send({
    jsonrpc: "2.0",
    id: 2,
    method: "tools/call",
    params: {
      name: "companies_workspace",
      arguments: { filters, pageSize: 5 },
      _meta: modernEnvelope,
    },
  });
  const response = (await wire.receive()).result as JsonObject;
  assert.equal(response.isError, undefined);
  assert.equal((response.structuredContent as JsonObject).section, "companies");
  assert.deepEqual(calls, [{ tool: "companies.search", input: { filters, pageSize: 5 } }]);
});

test("saved campaign entrypoint delegates exact identity and preserves read failures", async (context) => {
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  const wire = createWire({
    async invoke(tool, input) {
      calls.push({ tool, input });
      throw new Error("Campaign access denied");
    },
  });
  context.after(() => wire.close());
  wire.send({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "campaign_workspace",
      arguments: { campaignId: "campaign_owned_123" },
      _meta: modernEnvelope,
    },
  });
  const opened = (await wire.receive()).result as JsonObject;
  assert.equal(opened.isError, true);
  assert.deepEqual(calls, [
    { tool: "campaign.inspect", input: { campaignId: "campaign_owned_123" } },
  ]);
  const payload = opened.structuredContent as JsonObject;
  assert.equal((payload.result as JsonObject).ok, false);
  assert.match(JSON.stringify(payload), /Campaign access denied/);
});
