import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import test from "node:test";

import {
  AGENT_TOOL_POLICIES,
  type AgentToolInputMap,
  type AgentToolName,
  type AgentToolResult,
} from "@dmfaster/sdk";
import { DmfasterHttpError } from "@dmfaster/sdk";

import { runCli, type CliContext } from "../src/cli.ts";

function output() {
  let value = "";
  return {
    stream: {
      write(chunk: string) {
        value += chunk;
      },
    },
    read: () => value,
  };
}

function generatedToken() {
  return `dmf_pat_${randomBytes(32).toString("hex")}`;
}

function authIdentity() {
  return {
    authenticated: true,
    credential: {
      id: `agent_cred_${randomBytes(8).toString("hex")}`,
      name: "DM Faster CLI",
      client: "DM Faster CLI",
      scopes: ["workspace:read"],
      expiresAt: "2026-08-28T12:00:00.000Z",
    },
    workspace: { id: "workspace_123", name: "Workspace" },
    user: { id: "user_123", name: "User" },
  };
}

function configuredContext(calls: Array<{ tool: AgentToolName; input: unknown }>): CliContext {
  const token = generatedToken();
  return {
    resolveConfig: async () => ({
      baseUrl: "https://app.dmfaster.test",
      baseUrlSource: "default",
      token,
      tokenSource: "DMFASTER_TOKEN",
      credentialStoreError: null,
      configPath: "/tmp/dmfaster-test-config.json",
    }),
    fetch: async () => Response.json(authIdentity()),
    createClient: () => ({
      async invoke<Name extends AgentToolName>(tool: Name, input: AgentToolInputMap[Name]) {
        calls.push({ tool, input });
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
        } satisfies AgentToolResult;
      },
    }),
  };
}

test("prints useful help without requiring configuration", async () => {
  const stdout = output();
  const exitCode = await runCli(["--help"], { stdout: stdout.stream });
  assert.equal(exitCode, 0);
  assert.match(stdout.read(), /workspace briefing/);
  assert.match(stdout.read(), /Agent quick start/);
  assert.match(stdout.read(), /setup\.resume/);
  assert.match(stdout.read(), /DMFASTER_TOKEN/);
});

test("describes one command with its generated input schema without authentication", async () => {
  const stdout = output();
  assert.equal(await runCli(["describe", "companies", "search"], { stdout: stdout.stream }), 0);
  const description = JSON.parse(stdout.read());
  assert.equal(description.tool, "companies.search");
  assert.equal(description.mcpTool, "companies_search");
  assert.deepEqual(description.scopes, ["audiences:read"]);
  assert.equal(description.inputSchema.$ref, "#/$defs/CompanySearchInput");
  assert.equal(description.inputSchema.$defs.CompanySearchInput.type, "object");

  const help = output();
  assert.equal(await runCli(["companies", "search", "--help"], { stdout: help.stream }), 0);
  assert.match(help.read(), /companies search --input FILE/);
  assert.match(help.read(), /Required scopes: audiences:read/);
});

test("doctor reports runtime, workspace scope eligibility, and setup actions without exposing tokens", async () => {
  const ready = output();
  const context = configuredContext([]);
  assert.equal(await runCli(["doctor", "--json"], { ...context, stdout: ready.stream }), 0);
  const report = JSON.parse(ready.read());
  assert.equal(report.status, "ready");
  assert.equal(report.supportedMcpProtocol, "2026-07-28");
  assert.ok(report.authentication.scopeEligibleTools.includes("workspace.briefing"));
  assert.ok(!report.authentication.scopeEligibleTools.includes("campaign.launch"));
  const token = (await context.resolveConfig!()).token;
  assert.ok(token);
  assert.equal(ready.read().includes(token), false);

  const disconnected = output();
  const noTokenContext: CliContext = {
    resolveConfig: async () => ({
      baseUrl: "https://app.dmfaster.test",
      baseUrlSource: "default",
      token: null,
      tokenSource: null,
      credentialStoreError: "Unlock the secure keyring.",
      configPath: "/tmp/dmfaster-test-config.json",
    }),
    stdout: disconnected.stream,
  };
  assert.equal(await runCli(["doctor"], noTokenContext), 1);
  const setup = JSON.parse(disconnected.read());
  assert.equal(setup.status, "action_required");
  assert.ok(setup.actions.some((action: string) => action.includes("auth login")));
  assert.ok(setup.actions.some((action: string) => action.includes("keyring")));
});

test("JSON mode reports usage failures with a stable error code and exit status", async () => {
  const stderr = output();
  const exitCode = await runCli(["campaigns", "list", "--limit", "0", "--json"], {
    ...configuredContext([]),
    stderr: stderr.stream,
  });
  assert.equal(exitCode, 2);
  assert.deepEqual(JSON.parse(stderr.read()), {
    error: { code: "usage_error", message: "--limit must be from 1 to 25." },
  });
});

test("reads a bounded tool input from standard input", async () => {
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  const stdin = async function* () {
    yield '{"countries":';
    yield '["FI"]}';
  };
  assert.equal(
    await runCli(["companies", "filters", "--input", "-"], {
      ...configuredContext(calls),
      stdin: stdin(),
      stdout: output().stream,
    }),
    0,
  );
  assert.deepEqual(calls, [{ tool: "companies.filters", input: { countries: ["FI"] } }]);

  const stderr = output();
  assert.equal(
    await runCli(["companies", "filters", "--input", "-"], {
      ...configuredContext([]),
      stdin: (async function* () {
        yield "x".repeat(64_001);
      })(),
      stderr: stderr.stream,
    }),
    2,
  );
  assert.match(stderr.read(), /Standard input cannot exceed 64000 bytes/);
});

test("inbox CLI commands forward exact conversation filters and message cursors", async () => {
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  const inputs = [
    { command: ["conversations", "list"], input: { filter: "needs_reply", limit: 20 } },
    {
      command: ["conversation", "inspect"],
      input: { conversationId: "conversation-1", cursor: "opaque-page" },
    },
  ];
  for (const item of inputs) {
    assert.equal(
      await runCli([...item.command, "--input", "-"], {
        ...configuredContext(calls),
        stdout: output().stream,
        stdin: (async function* () {
          yield JSON.stringify(item.input);
        })(),
      }),
      0,
    );
  }
  assert.equal(
    await runCli(
      [
        "conversations",
        "list",
        "--filter",
        "unread",
        "--channel",
        "linkedin",
        "--campaign-id",
        "campaign_1",
        "--limit",
        "25",
        "--include-automatic-responses",
      ],
      { ...configuredContext(calls), stdout: output().stream },
    ),
    0,
  );
  assert.equal(
    await runCli(
      ["conversation", "inspect", "conversation_1", "--cursor", "next_page", "--limit", "40"],
      { ...configuredContext(calls), stdout: output().stream },
    ),
    0,
  );
  assert.deepEqual(calls.at(-2), {
    tool: "conversations.list",
    input: {
      filter: "unread",
      channel: "linkedin",
      campaignId: "campaign_1",
      limit: 25,
      includeAutomaticResponses: true,
    },
  });
  assert.deepEqual(calls.at(-1), {
    tool: "conversation.inspect",
    input: { conversationId: "conversation_1", cursor: "next_page", limit: 40 },
  });
  assert.deepEqual(calls.slice(0, 2), [
    { tool: "conversations.list", input: inputs[0]!.input },
    { tool: "conversation.inspect", input: inputs[1]!.input },
  ]);
});

test("company-centric CLI commands forward the full filter and inspection inputs", async () => {
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  const filters = {
    filters: {
      countries: ["FI"],
      technologies: ["shopify"],
      fundingSources: ["business_finland"],
      metaAdsMinimumEuReach: "10000",
      hasWebsite: false,
    },
    pageSize: 100,
  };
  for (const [command, input] of [
    [["companies", "search"], filters],
    [["company", "inspect"], { country: "FI", businessId: "1234567-8" }],
    [["companies", "filters"], { countries: ["FI"] }],
  ] as const) {
    const result = await runCli([...command, "--input", "input.json"], {
      ...configuredContext(calls),
      stdout: output().stream,
      readTextFile: async () => JSON.stringify(input),
    });
    assert.equal(result, 0);
  }
  assert.deepEqual(
    calls.map((call) => call.tool),
    ["companies.search", "company.inspect", "companies.filters"],
  );
  assert.deepEqual(calls[0]!.input, filters);
});

test("reports local authentication status without printing the token", async () => {
  const stdout = output();
  const exitCode = await runCli(["auth", "status"], {
    ...configuredContext([]),
    stdout: stdout.stream,
  });
  assert.equal(exitCode, 0);
  assert.match(stdout.read(), /"status": "authenticated"/);
  assert.match(stdout.read(), /"verifiedRemotely": true/);
  assert.doesNotMatch(stdout.read(), /dmf_pat_/);
});

test("gives an actionable error when an API command has no token", async () => {
  const stderr = output();
  const exitCode = await runCli(["workspace", "briefing"], {
    stderr: stderr.stream,
    resolveConfig: async () => ({
      baseUrl: "https://app.dmfaster.test",
      baseUrlSource: "default",
      token: null,
      tokenSource: null,
      credentialStoreError: null,
      configPath: "/tmp/dmfaster/config.json",
    }),
  });
  assert.equal(exitCode, 2);
  assert.match(stderr.read(), /DMFASTER_TOKEN/);
  assert.match(stderr.read(), /dmfaster auth login/);
});

test("maps workspace-read CLI arguments to the public tool contract", async () => {
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  const stdout = output();
  const exitCode = await runCli(
    ["replies", "list", "campaign_123", "--limit", "7", "--query", "Visio"],
    { ...configuredContext(calls), stdout: stdout.stream },
  );
  assert.equal(exitCode, 0);
  assert.deepEqual(calls, [
    {
      tool: "replies.list",
      input: { campaignId: "campaign_123", limit: 7, query: "Visio" },
    },
  ]);
  assert.match(stdout.read(), /"tool": "replies.list"/);

  assert.equal(
    await runCli(
      [
        "campaigns",
        "list",
        "--status",
        "running",
        "--query",
        "Spring",
        "--channel",
        "INSTAGRAM",
        "--limit",
        "25",
        "--cursor",
        "abc_123",
      ],
      configuredContext(calls),
    ),
    0,
  );
  assert.deepEqual(calls[1], {
    tool: "campaigns.list",
    input: {
      status: "Running",
      query: "Spring",
      channel: "instagram",
      limit: 25,
      cursor: "abc_123",
    },
  });
});

test("requires an explicit analytics scope and forwards an optional campaign", async () => {
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  const stderr = output();
  assert.equal(
    await runCli(["analytics", "summary", "--campaign", "campaign_123"], {
      ...configuredContext(calls),
      stderr: stderr.stream,
    }),
    2,
  );
  assert.match(stderr.read(), /requires --scope/u);
  assert.deepEqual(calls, []);

  assert.equal(
    await runCli(
      ["analytics", "summary", "--scope", "today", "--campaign", "campaign_123"],
      configuredContext(calls),
    ),
    0,
  );
  assert.deepEqual(calls, [
    {
      tool: "analytics.summary",
      input: { scope: "today", campaign: "campaign_123" },
    },
  ]);
});

test("loads stateless campaign input from a bounded JSON file", async () => {
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  const state = { profile: { version: 1 }, brief: { version: 1 } };
  const reviewedAudience = {
    querySignature: `4:${"a".repeat(32)}`,
    dataFreshness: { engine: "search_facts", revision: "FI:r1" },
  };
  const exitCode = await runCli(
    [
      "campaign",
      "prepare",
      "--state",
      "/tmp/plan.json",
      "--reviewed-audience",
      "/tmp/audience-preview.json",
      "--idempotency-key",
      "campaign:prepare:1",
    ],
    {
      ...configuredContext(calls),
      readTextFile: async (path) => {
        if (path === "/tmp/plan.json") return JSON.stringify({ state });
        if (path === "/tmp/audience-preview.json") {
          return JSON.stringify({ data: { data: { reviewedAudience } } });
        }
        throw new Error(`Unexpected path: ${path}`);
      },
    },
  );
  assert.equal(exitCode, 0);
  assert.deepEqual(calls, [
    {
      tool: "campaign.prepare",
      input: { state, idempotencyKey: "campaign:prepare:1", reviewedAudience },
    },
  ]);
});

test("accepts campaign state from standard input and rejects two stdin sources", async () => {
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  const state = { profile: { version: 1 }, brief: { version: 1 } };
  assert.equal(
    await runCli(["campaign", "validate", "--state", "-"], {
      ...configuredContext(calls),
      stdin: (async function* () {
        yield JSON.stringify({ state });
      })(),
      stdout: output().stream,
    }),
    0,
  );
  assert.deepEqual(calls, [{ tool: "campaign.validate", input: { state } }]);

  const stderr = output();
  assert.equal(
    await runCli(["campaign", "prepare", "--state", "-", "--reviewed-audience", "-"], {
      ...configuredContext([]),
      stderr: stderr.stream,
    }),
    2,
  );
  assert.match(stderr.read(), /either --state or --reviewed-audience/);
});

test("requires an explicitly saved and reviewed audience preview before preparation", async () => {
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  const stderr = output();
  const exitCode = await runCli(["campaign", "prepare", "--state", "/tmp/plan.json"], {
    ...configuredContext(calls),
    stderr: stderr.stream,
    readTextFile: async () =>
      JSON.stringify({
        state: { profile: { version: 1 }, brief: { version: 1 } },
      }),
  });

  assert.equal(exitCode, 2);
  assert.deepEqual(calls, []);
  assert.match(stderr.read(), /--reviewed-audience PREVIEW_JSON is required/u);
});

test("requires matching preflight fields for campaign actions", async () => {
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  const authorizationId = `agent_action_${"a".repeat(32)}`;
  const exitCode = await runCli(
    [
      "campaign",
      "launch",
      "campaign_123",
      "--idempotency-key",
      "launch:campaign_123:1",
      "--authorization-id",
      authorizationId,
    ],
    configuredContext(calls),
  );
  assert.equal(exitCode, 0);
  assert.deepEqual(calls, [
    {
      tool: "campaign.launch",
      input: {
        campaignId: "campaign_123",
        idempotencyKey: "launch:campaign_123:1",
        authorizationId,
      },
    },
  ]);
});

test("maps company timeline identifiers to the public tool contract", async () => {
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  const stdout = output();
  const exitCode = await runCli(["company", "timeline", "campaign_123", "outreach_456"], {
    ...configuredContext(calls),
    stdout: stdout.stream,
  });
  assert.equal(exitCode, 0);
  assert.deepEqual(calls, [
    {
      tool: "company.timeline",
      input: { campaignId: "campaign_123", companyOutreachId: "outreach_456" },
    },
  ]);
  assert.match(stdout.read(), /"tool": "company.timeline"/);
});

test("rejects an explicitly empty optional campaign identifier", async () => {
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  const stderr = output();
  const exitCode = await runCli(["campaign", "inspect", "   "], {
    ...configuredContext(calls),
    stderr: stderr.stream,
  });

  assert.equal(exitCode, 2);
  assert.deepEqual(calls, []);
  assert.match(stderr.read(), /Campaign identifiers cannot be empty/);
});

test("prints typed retry metadata from SDK transport failures", async () => {
  const stderr = output();
  const exitCode = await runCli(["--json", "workspace", "briefing"], {
    ...configuredContext([]),
    stderr: stderr.stream,
    createClient: () => ({
      async invoke() {
        throw new DmfasterHttpError({
          message: "Too many agent tool requests.",
          status: 429,
          responseBody: null,
          code: "rate_limited",
          retryable: true,
          requestId: "req_cli_123",
          retryAfterSeconds: 90,
        });
      },
    }),
  });

  assert.equal(exitCode, 1);
  assert.deepEqual(JSON.parse(stderr.read()), {
    error: {
      code: "rate_limited",
      message: "Too many agent tool requests.",
      retryable: true,
      requestId: "req_cli_123",
      retryAfterSeconds: 90,
      status: 429,
    },
  });
});

test("list import forwards the reviewed CSV with a stable retry key", async () => {
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  for (const file of [
    "\uFEFFusername\n@Coach.FI\nsecond\ncoach.fi",
    "username\nsecond\ncoach.fi",
  ]) {
    assert.equal(
      await runCli(
        ["list", "import", "--name", "Finland Coaches", "--file", "coaches.csv", "--json"],
        {
          ...configuredContext(calls),
          readTextFile: async () => file,
        },
      ),
      0,
    );
  }
  assert.equal(calls[0]?.tool, "list.import");
  const first = calls[0]?.input as AgentToolInputMap["list.import"];
  const second = calls[1]?.input as AgentToolInputMap["list.import"];
  assert.deepEqual(first.usernames, ["coach.fi", "second", "coach.fi"]);
  assert.equal(first.idempotencyKey, second.idempotencyKey);
  assert.equal(first.name, "Finland Coaches");
});

test("list import rejects malformed files/options before invoking the API", async () => {
  for (const args of [
    [],
    ["--name", "Coaches"],
    ["--name", "Coaches", "--file", "file", "--idempotency-key", "bad key"],
    ["--name", "Coaches", "--file", "file"],
    ["--name", "Coaches", "--file", "file", "--name", "Again"],
  ]) {
    const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
    const stderr = output();
    assert.equal(
      await runCli(["list", "import", ...args], {
        ...configuredContext(calls),
        stderr: stderr.stream,
        readTextFile: async () => "valid\ninvalid username",
      }),
      2,
    );
    assert.deepEqual(calls, []);
  }
});

test("saved-list CLI supports exact membership, removal, and a draft with untouched Finnish copy", async () => {
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  const expectedListUpdatedAt = "2026-09-08T12:00:00.000Z";
  const draft = {
    listId: "coaches",
    expectedListUpdatedAt,
    expectedTargetCount: 2,
    name: "Valmentajat",
    messageVariants: [
      "Pystytkö ottamaan lisää valmennettavia?\n\nOnko sulla aikaa meetille?",
      "Toinen versio",
    ],
    dailyCap: 40,
    pacingSeconds: 30,
    onlyNewChats: true,
    skipPreviouslyMessaged: true,
    idempotencyKey: "coaches:1",
  };
  const context = { ...configuredContext(calls), readTextFile: async () => JSON.stringify(draft) };
  for (const args of [
    ["lists", "list", "--query", "Coaches", "--limit", "10"],
    ["list", "inspect", "coaches", "--username", "@PT.J.JYLHA", "--offset", "100"],
    [
      "list",
      "target",
      "remove",
      "coaches",
      "--username",
      "pt.j.jylha",
      "--expected-version",
      expectedListUpdatedAt,
    ],
    ["campaign", "draft", "prepare", "--input", "draft.json"],
  ])
    assert.equal(await runCli([...args, "--json"], context), 0);
  assert.deepEqual(
    calls.map((call) => call.tool),
    ["lists.list", "list.inspect", "list.target.remove", "campaign.draft.prepare"],
  );
  assert.deepEqual(calls[1]?.input, { listId: "coaches", username: "pt.j.jylha", offset: 100 });
  assert.deepEqual(calls[3]?.input, draft);
});

test("saved-list CLI rejects malformed options and activation payloads without calling the API", async () => {
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  const context = {
    ...configuredContext(calls),
    readTextFile: async () => JSON.stringify({ enabled: true }),
  };
  for (const args of [
    ["lists", "list", "--limit", "1.5"],
    ["lists", "list", "--offset", "-1"],
    ["lists", "list", "--limit", "10", "--limit", "2"],
    ["list", "inspect", "coaches", "--username", "pt..j"],
    ["list", "target", "remove", "coaches", "--username", "pt.j.jylha"],
    ["campaign", "draft", "prepare", "--input", "draft.json"],
    ["campaign", "draft", "prepare", "--input", "draft.json", "--launch", "true"],
  ])
    assert.notEqual(await runCli([...args, "--json"], context), 0);
  assert.equal(calls.length, 0);
});

test("draft update CLI preserves the campaign ID and patch and rejects activation", async () => {
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  const input = {
    campaignId: "existing",
    expectedCampaignUpdatedAt: "2026-09-08T12:00:00.000Z",
    updates: { dailyCap: 60, messageVariants: ["Hei!\n\nOnko sulla aikaa meetille?"] },
  };
  const context = { ...configuredContext(calls), readTextFile: async () => JSON.stringify(input) };
  assert.equal(
    await runCli(["campaign", "draft", "update", "--input", "update.json", "--json"], context),
    0,
  );
  assert.deepEqual(calls, [{ tool: "campaign.draft.update", input }]);
  for (const updates of [{}, { enabled: true }, { dailyCap: 61 }, { targetListId: "other" }]) {
    assert.equal(
      await runCli(["campaign", "draft", "update", "--input", "update.json"], {
        ...context,
        readTextFile: async () => JSON.stringify({ ...input, updates }),
      }),
      2,
    );
  }
  assert.equal(calls.length, 1);
});

test("campaign operation wait returns the acknowledged result or a resumable timeout", async (t) => {
  t.mock.timers.enable({ apis: ["Date"], now: 1_000_000 });
  for (const finishes of [true, false]) {
    const stdout = output(),
      stderr = output();
    const context = configuredContext([]);
    let polls = 0;
    context.createClient = () => ({
      async invoke(tool) {
        polls++;
        return {
          version: 1,
          tool,
          policy: AGENT_TOOL_POLICIES[tool],
          ok: true,
          generatedAt: new Date().toISOString(),
          durationMs: 0,
          evidence: [],
          consistency: { status: "verified", checks: [] },
          artifacts: [],
          error: null,
          data: {
            campaignId: "campaign-a",
            commandId: "launch-a",
            state: finishes && polls > 1 ? "sender_acknowledged" : "awaiting_sender",
          },
        } as AgentToolResult;
      },
    });
    const code = await runCli(
      ["campaign", "operation", "inspect", "--input", "operation.json", "--wait", "2"],
      {
        ...context,
        stdout: stdout.stream,
        stderr: stderr.stream,
        readTextFile: async () =>
          JSON.stringify({ campaignId: "campaign-a", commandId: "launch-a" }),
        sleep: async () => undefined,
      },
    );
    assert.equal(code, finishes ? 0 : 1);
    assert.equal(polls, 2);
    assert.equal(
      JSON.parse(stdout.read()).data.state,
      finishes ? "sender_acknowledged" : "awaiting_sender",
    );
    if (!finishes) assert.match(stderr.read(), /same campaignId and commandId/);
  }
});
