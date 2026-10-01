import assert from "node:assert/strict";
import test from "node:test";
import { DmfasterHttpError, type AgentToolName, type AgentToolResult } from "@dmfaster/sdk";
import { searchWorkspaceMentions, readWorkspaceMention } from "../src/workspace-mentions.ts";
import type { AgentInvoker } from "../src/tools.ts";

function fixture() {
  const calls: Array<{ tool: AgentToolName; input: unknown }> = [];
  const data: Partial<Record<AgentToolName, unknown>> = {
    "lists.list": {
      lists: [
        { listId: "prospects/one%two", name: "Saved prospects", isCompanyLeadList: false },
        { listId: "companies-one", name: "Company shortlist", isCompanyLeadList: true },
      ],
      total: 2,
      nextOffset: null,
    },
    "companies.suggest": {
      query: "example",
      suggestions: [{ country: "AE", businessId: "business/one%two", name: "Example Company" }],
    },
    "company.inspect": {
      profile: { country: "AE", businessId: "business/one%two", name: "Current company" },
    },
    "list.inspect": {
      list: { listId: "prospects/one%two", total: 40 },
      usernames: ["one"],
      nextOffset: 25,
    },
    "companies.list.inspect": {
      listId: "companies-one",
      companies: [],
      total: 0,
      nextOffset: null,
    },
  };
  let denied = false;
  const client: AgentInvoker = {
    async invoke(tool, input) {
      calls.push({ tool, input });
      return {
        version: 1,
        tool,
        ok: !denied,
        policy: { effect: "read", approval: "none", exposure: "public_api" },
        generatedAt: new Date().toISOString(),
        durationMs: 1,
        evidence: [],
        consistency: { status: "verified", checks: [] },
        artifacts: [],
        data: denied ? null : data[tool],
        error: denied
          ? { code: "owner_required", message: "PRIVATE provider body", retryable: false }
          : null,
      } as AgentToolResult;
    },
  };
  return {
    client,
    calls,
    data,
    deny: () => {
      denied = true;
    },
  };
}

test("mention suggestions cover countries and both saved-list kinds without model prose or mutations", async () => {
  const f = fixture();
  const result = await searchWorkspaceMentions(f.client, "  example  ");
  assert.deepEqual(result.content, []);
  assert.deepEqual(
    result.structuredContent.items.map((item) => item.uri),
    [
      "dmfaster://lists/prospects%2Fone%25two",
      "dmfaster://company-lists/companies-one",
      "dmfaster://companies/AE/business%2Fone%25two",
    ],
  );
  assert.deepEqual(
    f.calls.map((call) => call.tool),
    ["lists.list", "companies.suggest"],
  );
  assert.deepEqual(f.calls[0]?.input, { query: "example", limit: 10 });
  const companyInput = f.calls[1]?.input as { countries: string[]; query: string; limit: number };
  assert.equal(companyInput.query, "example");
  assert.ok(companyInput.countries.includes("AE") && companyInput.countries.includes("FI"));
  assert.equal(companyInput.limit, 10);
});

test("empty and one-letter queries do not launch broad company searches", async () => {
  for (const query of ["", " a "]) {
    const f = fixture();
    await searchWorkspaceMentions(f.client, query);
    assert.deepEqual(
      f.calls.map((call) => call.tool),
      ["lists.list"],
    );
  }
});

test("suggestions respect granted scopes and keep accessible lists if company lookup is unavailable", async () => {
  const f = fixture();
  const auth = {
    resourceMetadataUrl: "https://example.test/mcp",
    grantedScopes: ["campaigns:read"],
  };
  await searchWorkspaceMentions(f.client, "example", auth);
  assert.deepEqual(
    f.calls.map((call) => call.tool),
    ["lists.list"],
  );
  f.calls.length = 0;
  f.data["companies.suggest"] = null;
  const result = await searchWorkspaceMentions(f.client, "example");
  assert.equal(result.structuredContent.items.length, 2);
  assert.equal(JSON.stringify(result).includes('"total"'), false);
  assert.deepEqual(result._meta, { "dmfaster/mentionSourcesUnavailable": ["companies"] });
});

test("an expired connection is challenged instead of silently returning empty suggestions", async () => {
  const f = fixture();
  f.client.invoke = async () => {
    throw new DmfasterHttpError({ status: 401, message: "Expired", responseBody: {} });
  };
  await assert.rejects(searchWorkspaceMentions(f.client, "example"), DmfasterHttpError);
});

test("resource reads decode identity once, retain pagination, and recheck access on every read", async () => {
  const f = fixture();
  const suggestions = await searchWorkspaceMentions(f.client, "example");
  f.calls.length = 0;
  const uris = suggestions.structuredContent.items.map((item) => new URL(item.uri));
  const list = await readWorkspaceMention(f.client, uris[0]!);
  await readWorkspaceMention(f.client, uris[1]!);
  await readWorkspaceMention(f.client, uris[2]!);
  assert.deepEqual(f.calls, [
    { tool: "list.inspect", input: { listId: "prospects/one%two", limit: 25 } },
    { tool: "companies.list.inspect", input: { listId: "companies-one", limit: 25 } },
    { tool: "company.inspect", input: { country: "AE", businessId: "business/one%two" } },
  ]);
  const context = JSON.parse(list.contents[0]!.text);
  assert.equal(context.result.data.nextOffset, 25);
  assert.equal(context.contextOnly, true);
  assert.equal(context.requiresUserInstructionForActions, true);
  f.deny();
  await assert.rejects(readWorkspaceMention(f.client, uris[0]!), /no longer have access/);
});

test("malformed and unsupported resources never reach a workspace domain service", async () => {
  const f = fixture();
  for (const uri of [
    "dmfaster://companies/XX/one",
    "dmfaster://lists/",
    "dmfaster://lists/one?token=secret",
    "dmfaster://lists/one#other",
    "dmfaster://user@lists/one",
    "https://lists/one",
  ])
    await assert.rejects(readWorkspaceMention(f.client, new URL(uri)));
  assert.deepEqual(f.calls, []);
});
