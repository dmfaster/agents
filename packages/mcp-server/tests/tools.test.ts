import assert from "node:assert/strict";
import test from "node:test";

import {
  AGENT_TOOL_POLICIES,
  type AgentToolInputMap,
  type AgentToolName,
  type AgentToolResult,
} from "@dmfaster/sdk";
import { DmfasterHttpError } from "@dmfaster/sdk";

import {
  MCP_AGENT_TOOL_NAMES,
  createAgentToolDefinitions,
  registerAgentToolDefinitions,
  type AgentInvoker,
  type AgentToolDefinition,
} from "../src/tools.ts";
import { toolFailure } from "../src/server.ts";

function result(tool: AgentToolName): AgentToolResult {
  return {
    version: 1,
    tool,
    policy: AGENT_TOOL_POLICIES[tool],
    ok: true,
    generatedAt: "2026-07-29T12:00:00.000Z",
    durationMs: 1,
    evidence: [],
    consistency: { status: "verified", checks: [] },
    data: {},
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

const reviewedAudience = {
  querySignature: `4:${"a".repeat(32)}`,
  dataFreshness: { engine: "search_facts" as const, revision: "FI:r1" },
};

test("registers the complete Agent 1.0 surface with honest MCP safety hints", () => {
  const definitions: AgentToolDefinition[] = [];
  registerAgentToolDefinitions(
    { register: (definition) => definitions.push(definition) },
    fakeClient([]),
  );

  assert.deepEqual(
    definitions.map((definition) => definition.name),
    MCP_AGENT_TOOL_NAMES,
  );
  for (const definition of definitions.slice(0, 11)) {
    assert.deepEqual(definition.annotations, {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    });
  }
  for (const name of [
    "list_import",
    "list_prepare",
    "campaign_prepare",
    "campaign_launch_preflight",
    "campaign_pause_preflight",
    "campaign_pause",
  ]) {
    assert.deepEqual(definitions.find((definition) => definition.name === name)?.annotations, {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    });
  }
  assert.deepEqual(
    definitions.find((definition) => definition.name === "campaign_launch")?.annotations,
    {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: true,
    },
  );
});

test("maps MCP tool names and validated inputs onto SDK calls", async () => {
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  const definitions: AgentToolDefinition[] = [];
  registerAgentToolDefinitions(
    { register: (definition) => definitions.push(definition) },
    fakeClient(calls),
  );

  const analytics = definitions.find((definition) => definition.name === "analytics_summary");
  const replies = definitions.find((definition) => definition.name === "replies_list");
  const timeline = definitions.find((definition) => definition.name === "company_timeline");
  const preflight = definitions.find(
    (definition) => definition.name === "campaign_launch_preflight",
  );
  const launch = definitions.find((definition) => definition.name === "campaign_launch");
  const prepare = definitions.find((definition) => definition.name === "campaign_prepare");
  assert.ok(analytics);
  assert.ok(replies);
  assert.ok(timeline);
  assert.ok(preflight);
  assert.ok(launch);
  assert.ok(prepare);
  assert.match(preflight.description, /setup_required/u);
  assert.match(preflight.description, /setup\.resume/u);
  assert.match(launch.description, /browser_worker_required/u);

  await analytics.call({ scope: "today", campaign: "campaign_123" });
  await replies.call({ campaignId: "campaign_123", limit: 4, query: "Visio" });
  await timeline.call({ campaignId: "campaign_123", companyOutreachId: "outreach_456" });
  await preflight.call({ campaignId: "campaign_123", idempotencyKey: "launch:campaign_123:1" });
  await launch.call({
    campaignId: "campaign_123",
    idempotencyKey: "launch:campaign_123:1",
    authorizationId: `agent_action_${"a".repeat(32)}`,
  });
  await prepare.call({
    state: campaignState,
    idempotencyKey: "prepare:campaign:1",
    reviewedAudience,
  });

  assert.deepEqual(calls, [
    {
      tool: "analytics.summary",
      input: { scope: "today", campaign: "campaign_123" },
    },
    {
      tool: "replies.list",
      input: { campaignId: "campaign_123", limit: 4, query: "Visio" },
    },
    {
      tool: "company.timeline",
      input: { campaignId: "campaign_123", companyOutreachId: "outreach_456" },
    },
    {
      tool: "campaign.launch.preflight",
      input: { campaignId: "campaign_123", idempotencyKey: "launch:campaign_123:1" },
    },
    {
      tool: "campaign.launch",
      input: {
        campaignId: "campaign_123",
        idempotencyKey: "launch:campaign_123:1",
        authorizationId: `agent_action_${"a".repeat(32)}`,
      },
    },
    {
      tool: "campaign.prepare",
      input: {
        state: campaignState,
        idempotencyKey: "prepare:campaign:1",
        reviewedAudience,
      },
    },
  ]);
});

test("requires a server-issued reviewed audience before private preparation", async () => {
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  const definitions: AgentToolDefinition[] = [];
  registerAgentToolDefinitions(
    { register: (definition) => definitions.push(definition) },
    fakeClient(calls),
  );
  const prepare = definitions.find((definition) => definition.name === "campaign_prepare");
  assert.ok(prepare);

  await assert.rejects(
    prepare.call({ state: campaignState, idempotencyKey: "prepare:campaign:1" }),
  );
  assert.deepEqual(calls, []);
});

test("rejects unknown input fields before calling the SDK", async () => {
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  const definitions: AgentToolDefinition[] = [];
  registerAgentToolDefinitions(
    { register: (definition) => definitions.push(definition) },
    fakeClient(calls),
  );
  const briefing = definitions.find((definition) => definition.name === "workspace_briefing");
  assert.ok(briefing);

  await assert.rejects(briefing.call({ approved: true }), /Unrecognized key/);
  assert.deepEqual(calls, []);
});

test("preserves the SDK transport retry contract in MCP failures", () => {
  const failure = toolFailure(
    new DmfasterHttpError({
      message: "Too many agent tool requests.",
      status: 429,
      responseBody: null,
      code: "rate_limited",
      retryable: true,
      requestId: "req_mcp_123",
      retryAfterSeconds: 120,
      details: { bucket: "workspace" },
    }),
  );

  assert.deepEqual(failure.structuredContent, {
    error: {
      code: "rate_limited",
      message: "Too many agent tool requests.",
      retryable: true,
      requestId: "req_mcp_123",
      retryAfterSeconds: 120,
      details: { bucket: "workspace" },
      status: 429,
    },
  });
  assert.equal(failure.isError, true);
});

test("generated schemas preserve strict inputs, campaign size and action authorization bounds", () => {
  const definitions = createAgentToolDefinitions(fakeClient([]));
  const schema = (name: string) =>
    definitions.find((definition) => definition.name === name)!.inputSchema;
  assert.equal(
    schema("list_import").safeParse({ name: "Coaches", usernames: [], idempotencyKey: "valid" })
      .success,
    false,
  );
  assert.equal(
    schema("list_import").safeParse({
      name: "Coaches",
      usernames: ["coach"],
      idempotencyKey: "valid",
      workspaceId: "someone_else",
    }).success,
    false,
  );
  assert.equal(
    schema("campaign_launch").safeParse({
      campaignId: "campaign",
      idempotencyKey: "key",
      approved: true,
    }).success,
    false,
  );
  assert.equal(
    schema("campaign_launch").safeParse({
      campaignId: "campaign",
      idempotencyKey: "key",
      authorizationId: "invented",
    }).success,
    false,
  );
  assert.equal(
    schema("campaign_validate").safeParse({
      state: {
        ...campaignState,
        profile: { ...campaignState.profile, businessDescription: "x".repeat(32001) },
      },
    }).success,
    false,
  );
  assert.equal(schema("campaigns_list").safeParse({ limit: 26 }).success, false);
  assert.deepEqual(schema("campaign_inspect").parse({ campaignId: " campaign_123 " }), {
    campaignId: "campaign_123",
  });
});

test("saved-list tools describe target removal honestly and reject draft activation fields", () => {
  const definitions: AgentToolDefinition[] = [];
  registerAgentToolDefinitions(
    { register: (definition) => definitions.push(definition) },
    fakeClient([]),
  );
  for (const name of ["lists_list", "list_inspect"])
    assert.equal(definitions.find((tool) => tool.name === name)?.annotations.readOnlyHint, true);
  assert.deepEqual(definitions.find((tool) => tool.name === "list_target_remove")?.annotations, {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  });
  assert.deepEqual(
    definitions.find((tool) => tool.name === "campaign_draft_prepare")?.annotations,
    { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  );
  const schema = definitions.find((tool) => tool.name === "campaign_draft_prepare")!.inputSchema;
  const draft = {
    listId: "coaches",
    expectedListUpdatedAt: "2026-09-08T12:00:00.000Z",
    expectedTargetCount: 2,
    name: "Coaches",
    messageVariants: ["Hello"],
    dailyCap: 40,
    pacingSeconds: 30,
    onlyNewChats: true,
    skipPreviouslyMessaged: true,
    idempotencyKey: "coaches:1",
  };
  assert.equal(schema.safeParse(draft).success, true);
  for (const invalid of [
    { enabled: true },
    { instagramSendingWindowEnabled: true },
    { messageVariants: ["1", "2", "3", "4", "5"] },
    { expectedTargetCount: 0 },
  ])
    assert.equal(schema.safeParse({ ...draft, ...invalid }).success, false);
});

test("draft update MCP requires a version and bounded nonempty patch, never activation", () => {
  const definitions: AgentToolDefinition[] = [];
  registerAgentToolDefinitions(
    { register: (definition) => definitions.push(definition) },
    fakeClient([]),
  );
  const tool = definitions.find((item) => item.name === "campaign_draft_update")!;
  assert.equal(tool.annotations.readOnlyHint, false);
  const input = {
    campaignId: "existing",
    expectedCampaignUpdatedAt: "2026-09-08T12:00:00.000Z",
    updates: { dailyCap: 60 },
  };
  assert.deepEqual(tool.inputSchema.parse(input), input);
  for (const updates of [{}, { enabled: true }, { dailyCap: 61 }, { targetListId: "other" }])
    assert.equal(tool.inputSchema.safeParse({ ...input, updates }).success, false);
  assert.equal(
    tool.inputSchema.safeParse({ ...input, expectedCampaignUpdatedAt: undefined }).success,
    false,
  );
});
