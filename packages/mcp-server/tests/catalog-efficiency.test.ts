import assert from "node:assert/strict";
import test from "node:test";
import { createMcpHandler } from "@modelcontextprotocol/server";
import {
  AGENT_TOOL_POLICIES,
  AGENT_TOOL_DEFINITIONS,
  AGENT_TOOL_SCOPES,
  DmfasterHttpError,
  type AgentToolResult,
} from "@dmfaster/sdk";
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

test("an empty tools_discover query returns the start-here tools in order", async () => {
  const handler = createMcpHandler(
    () =>
      createDmfasterMcpCore({
        catalogProfile: "compact",
        client: {
          invoke: async () => {
            throw Error("No execution during discovery");
          },
        },
      }),
    { responseMode: "json" },
  );
  try {
    const response = await handler.fetch(
      request("tools/call", { name: "tools_discover", arguments: {} }),
    );
    const payload = await response.json();
    assert.equal(payload.error, undefined);
    assert.deepEqual(
      payload.result.structuredContent.items.map((item: { name: string }) => item.name),
      [
        "prospect_query",
        "industry_lookup",
        "company_inspect",
        "prospecting_preview",
        "campaign_draft_plan",
        "conversations_list",
        "conversation_inspect",
        "work_queue_list",
      ],
    );
    assert.equal(
      payload.result.structuredContent.items[0].useWhen,
      "Turn a plain-language ICP into an exact company count.",
    );
    const listed = await handler.fetch(request("tools/list"));
    const catalog = await listed.json();
    const names = catalog.result.tools.map((tool: { name: string }) => tool.name);
    for (const name of ["company_inspect", "conversations_list", "conversation_inspect"])
      assert.equal(names.includes(name), true, name);
    assert.equal(names.includes("replies_list"), false);
    assert.match(
      catalog.result.tools.find((tool: { name: string }) => tool.name === "conversation_inspect")
        .description,
      /does not mark it read/i,
    );
  } finally {
    await handler.close();
  }
});

test("intent words rank the inbox and ICP tools ahead of incidental matches", async () => {
  const handler = createMcpHandler(
    () =>
      createDmfasterMcpCore({
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
    for (const [query, first] of [
      ["reply", "conversations_list"],
      ["inbox", "conversations_list"],
      ["ICP", "prospect_query"],
      ["prospects", "prospect_query"],
      ["lead", "prospect_query"],
      ["combine two lead lists", "list_merge"],
      ["merge lists", "list_merge"],
      ["replies_list", "conversations_list"],
      ["reply to lead draft", "conversation_draft_save"],
      ["draft a reply", "conversation_draft_save"],
      ["find Finnish software companies to contact", "prospect_query"],
      ["show me unread messages", "conversations_list"],
      ["check connected senders", "senders_inspect"],
      ["pause a running campaign", "campaign_pause_preflight"],
      ["find my remaining credits", "leads_status"],
      ["credits", "leads_status"],
      ["how many lead credits do I have left", "leads_status"],
      ["search for Shopify stores", "prospect_query"],
      ["find companies that use Facebook ads", "companies_search"],
      ["find companies that replied", "conversations_list"],
    ] as const) {
      const response = await handler.fetch(
        request("tools/call", { name: "tools_discover", arguments: { query, limit: 3 } }),
      );
      const payload = await response.json();
      assert.equal(payload.error, undefined, query);
      assert.equal(payload.result.structuredContent.items[0].name, first, query);
    }
    const deprecated = await handler.fetch(
      request("tools/call", { name: "tools_discover", arguments: { query: "replies_list" } }),
    );
    const body = await deprecated.json();
    assert.match(body.result.structuredContent.items[0].description, /Replaces deprecated/);
  } finally {
    await handler.close();
  }
});

test("tools_discover ranks an exact tool name first", async () => {
  const handler = createMcpHandler(
    () =>
      createDmfasterMcpCore({
        catalogProfile: "compact",
        client: {
          invoke: async () => {
            throw Error("No execution during discovery");
          },
        },
      }),
    { responseMode: "json" },
  );
  try {
    for (const [query, expected] of [
      ["company_inspect", "company_inspect"],
      ["company.inspect", "company_inspect"],
      ["workspace briefing", "workspace_briefing"],
      ["workspace_briefing", "workspace_briefing"],
    ]) {
      const response = await handler.fetch(
        request("tools/call", { name: "tools_discover", arguments: { query, limit: 3 } }),
      );
      const payload = await response.json();
      assert.equal(payload.error, undefined);
      assert.equal(payload.result.structuredContent.items[0].name, expected, query);
    }
  } finally {
    await handler.close();
  }
});

test("a misspelled tool is unknown_tool with a suggestion, not a missing scope", async () => {
  const handler = createMcpHandler(
    () =>
      createDmfasterMcpCore({
        catalogProfile: "compact",
        client: {
          invoke: async () => {
            throw Error("Unknown tools must not execute");
          },
        },
      }),
    { responseMode: "json" },
  );
  try {
    const response = await handler.fetch(
      request("tools/call", {
        name: "tools_call",
        arguments: { tool: "compny_inspect", input: {} },
      }),
    );
    const payload = await response.json();
    const body = payload.result.structuredContent.error;
    assert.equal(body.code, "unknown_tool");
    assert.equal(body.retryable, false);
    assert.equal(body.suggestions.includes("company_inspect"), true);
    assert.doesNotMatch(body.message, /missing scope/i);
    assert.doesNotMatch(body.nextAction, /idempotency/i);
  } finally {
    await handler.close();
  }
});

test("input validation errors stay short instead of dumping every enum value", async () => {
  const handler = createMcpHandler(
    () =>
      createDmfasterMcpCore({
        catalogProfile: "full",
        client: {
          invoke: async () => {
            throw Error("Invalid input must not execute");
          },
        },
      }),
    { responseMode: "json" },
  );
  try {
    const response = await handler.fetch(
      request("tools/call", {
        name: "company_inspect",
        arguments: { country: "XX", businessId: "1234567-8" },
      }),
    );
    const text = JSON.stringify(await response.json());
    assert.match(text, /country/);
    assert.doesNotMatch(text, /expected one of/);
    assert.ok(text.length < 900, `${text.length} bytes: ${text.slice(0, 300)}`);
  } finally {
    await handler.close();
  }
});

test("discovery explains current blockers, excludes them from start-here and refreshes changes", async () => {
  let disabled = true;
  const handler = createMcpHandler(
    () =>
      createDmfasterMcpCore({
        client: {
          invoke: async () => {
            throw Error("Discovery must not execute tools");
          },
        },
        toolBlockers: async () =>
          disabled
            ? { work_queue_list: { code: "feature_disabled", nextAction: "Contact support" } }
            : {},
      }),
    { responseMode: "json" },
  );
  try {
    const discover = async (query?: string) => {
      const response = await handler.fetch(
        request("tools/call", { name: "tools_discover", arguments: { query } }),
      );
      return (await response.json()).result.structuredContent.items as Array<{
        name: string;
        blocker?: { code: string };
      }>;
    };
    assert.equal(
      (await discover()).some((item) => item.name === "work_queue_list"),
      false,
    );
    assert.equal((await discover("work_queue_list"))[0]?.blocker?.code, "feature_disabled");
    disabled = false;
    assert.equal(
      (await discover()).some((item) => item.name === "work_queue_list"),
      true,
    );
    assert.equal((await discover("work_queue_list"))[0]?.blocker, undefined);
  } finally {
    await handler.close();
  }
});

test("discovery pages schema results without repeating or losing matches", async () => {
  const handler = createMcpHandler(
    () =>
      createDmfasterMcpCore({
        client: {
          invoke: async () => {
            throw Error("Discovery must not execute tools");
          },
        },
        hostedAuth: {
          resourceMetadataUrl: "https://app.dmfaster.test/.well-known/oauth-protected-resource/mcp",
          grantedScopes: [...new Set(Object.values(AGENT_TOOL_SCOPES).flat())],
        },
      }),
    { responseMode: "json" },
  );
  try {
    const discover = async (offset: number) =>
      (
        await (
          await handler.fetch(
            request("tools/call", {
              name: "tools_discover",
              arguments: { query: "campaign", includeSchema: true, limit: 30, offset },
            }),
          )
        ).json()
      ).result.structuredContent;
    const seen = new Set<string>();
    let offset = 0,
      total = 0;
    for (let page = 0; page < 100; page++) {
      const result = await discover(offset);
      if (!page) total = result.total;
      assert.equal(result.total, total);
      assert.ok(result.items.length <= 3);
      for (const item of result.items) {
        assert.ok(item.inputSchema);
        assert.equal(seen.has(item.name), false);
        seen.add(item.name);
      }
      assert.equal(result.hasMore, seen.size < total);
      if (!result.hasMore) {
        assert.equal(result.nextOffset, null);
        break;
      }
      assert.equal(result.nextOffset, offset + result.items.length);
      offset = result.nextOffset;
    }
    assert.ok(total > 3);
    assert.equal(seen.size, total);
    const exhausted = await discover(total + 1);
    assert.deepEqual(exhausted.items, []);
    assert.equal(exhausted.hasMore, false);
    assert.equal(exhausted.nextOffset, null);
    const invalid = await (
      await handler.fetch(
        request("tools/call", { name: "tools_discover", arguments: { offset: -1 } }),
      )
    ).json();
    assert.ok(invalid.error || invalid.result.isError);
  } finally {
    await handler.close();
  }
});

test("tools_call reports exact missing permission without executing or granting access", async () => {
  const handler = createMcpHandler(
    () =>
      createDmfasterMcpCore({
        hostedAuth: {
          resourceMetadataUrl: "https://app.dmfaster.test/.well-known/oauth-protected-resource/mcp",
          grantedScopes: ["workspace:read"],
        },
        client: {
          invoke: async () => {
            throw Error("Missing-scope tools must not execute");
          },
        },
      }),
    { responseMode: "json" },
  );
  try {
    const payload = await (
      await handler.fetch(
        request("tools/call", {
          name: "tools_call",
          arguments: { tool: "senders_inspect", input: {} },
        }),
      )
    ).json();
    assert.equal(payload.result.isError, true);
    assert.equal(payload.result.structuredContent.error.code, "insufficient_scope");
    assert.equal(payload.result.structuredContent.error.requiredScope, "sending:read");
    assert.match(payload.result._meta["mcp/www_authenticate"][0], /scope="sending:read"/);
  } finally {
    await handler.close();
  }
});

for (const status of [401, 403])
  test(`tools_call preserves the same recovery metadata as named tools (${status})`, async () => {
    const handler = createMcpHandler(
      () =>
        createDmfasterMcpCore({
          catalogProfile: "full",
          hostedAuth: {
            resourceMetadataUrl:
              "https://app.dmfaster.test/.well-known/oauth-protected-resource/mcp",
            grantedScopes: ["sending:read"],
          },
          resultMetadata: () => ({ trace: "fixture" }),
          client: {
            invoke: async () => {
              throw new DmfasterHttpError({
                status,
                code: status === 401 ? "unauthorized" : "insufficient_scope",
                message: "Fixture denial",
                responseBody: {},
                requestId: "req_fixture",
              });
            },
          },
        }),
      { responseMode: "json" },
    );
    try {
      const named = await (
        await handler.fetch(request("tools/call", { name: "senders_inspect", arguments: {} }))
      ).json();
      const generic = await (
        await handler.fetch(
          request("tools/call", {
            name: "tools_call",
            arguments: { tool: "senders_inspect", input: {} },
          }),
        )
      ).json();
      assert.deepEqual(generic.result, named.result);
      assert.equal(generic.result._meta.trace, "fixture");
      if (status === 401)
        assert.match(generic.result._meta["mcp/www_authenticate"][0], /invalid_token/);
      else
        assert.equal(
          generic.result._meta["mcp/www_authenticate"],
          undefined,
          "Role denial must not cause a reconnection loop",
        );
    } finally {
      await handler.close();
    }
  });

test("discovery pagination stays within the current connection scopes", async () => {
  const handler = createMcpHandler(
    () =>
      createDmfasterMcpCore({
        hostedAuth: {
          resourceMetadataUrl: "https://app.dmfaster.test/.well-known/oauth-protected-resource/mcp",
          grantedScopes: ["sending:read"],
        },
        client: {
          invoke: async () => {
            throw Error("Discovery cannot execute");
          },
        },
      }),
    { responseMode: "json" },
  );
  try {
    const allowed = new Set(
      Object.entries(AGENT_TOOL_DEFINITIONS)
        .filter(([name]) =>
          AGENT_TOOL_SCOPES[name as keyof typeof AGENT_TOOL_SCOPES].every(
            (scope) => scope === "sending:read",
          ),
        )
        .map(([, definition]) => definition.mcp.name),
    );
    for (const offset of [0, 1, 2, 3]) {
      const payload = await (
        await handler.fetch(
          request("tools/call", {
            name: "tools_discover",
            arguments: { query: "sending", limit: 1, offset },
          }),
        )
      ).json();
      for (const item of payload.result.structuredContent.items) assert.ok(allowed.has(item.name));
    }
  } finally {
    await handler.close();
  }
});

test("tools_call preserves successful diagnostics and explains direct-only helpers", async () => {
  const result: AgentToolResult = {
    version: 1,
    tool: "senders.inspect",
    policy: AGENT_TOOL_POLICIES["senders.inspect"],
    ok: true,
    generatedAt: "2026-11-01T00:00:00Z",
    serverTime: "2026-11-01T00:00:00Z",
    durationMs: 1,
    evidence: [],
    consistency: { status: "verified", checks: [] },
    data: {
      generatedAt: "2026-11-01T00:00:00Z",
      browserSetupUrl: "https://app.dmfaster.com/settings",
      browserProfiles: [],
      mailboxes: [],
      sms: { available: false, configured: false, enabled: false, phoneNumber: "" },
    },
    artifacts: [],
    error: null,
  };
  let executions = 0;
  const handler = createMcpHandler(
    () =>
      createDmfasterMcpCore({
        catalogProfile: "full",
        resultMetadata: () => ({ trace: "fixture" }),
        client: {
          invoke: async () => {
            executions++;
            return result;
          },
        },
      }),
    { responseMode: "json" },
  );
  try {
    const named = await (
      await handler.fetch(request("tools/call", { name: "senders_inspect", arguments: {} }))
    ).json();
    const generic = await (
      await handler.fetch(
        request("tools/call", {
          name: "tools_call",
          arguments: { tool: "senders_inspect", input: {} },
        }),
      )
    ).json();
    assert.equal(named.result.isError, undefined);
    assert.deepEqual(generic.result, named.result);
    assert.equal(generic.result._meta.trace, "fixture");
    for (const tool of ["connection_status", "tools_discover", "tools_call"]) {
      const payload = await (
        await handler.fetch(
          request("tools/call", { name: "tools_call", arguments: { tool, input: {} } }),
        )
      ).json();
      assert.equal(payload.result.structuredContent.error.code, "invalid_input");
      assert.match(payload.result.structuredContent.error.message, /directly by name/);
    }
    assert.equal(executions, 2);
  } finally {
    await handler.close();
  }
});
