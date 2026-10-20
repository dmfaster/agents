import assert from "node:assert/strict";
import test from "node:test";
import {
  checkedSelection,
  inspectShortlist,
  verifiedShortlist,
} from "../ui/company-shortlist-data.ts";
import { savedCompanyRow, savedListPage } from "../ui/company-saved-list.ts";
import {
  companiesWorkspaceInputSchema,
  registerCampaignWorkspace,
} from "../src/campaign-workspace.ts";
import { evidenceInitial } from "../browser-tests/companies-fixture.mjs";
import { workspaceOutputSchema } from "../src/presentation-schemas.ts";
import type { CompanyRow } from "../ui/companies-data.ts";
import { mutationRejected, readData } from "../ui/companies-data.ts";
import type { ShortlistRequest } from "../ui/company-shortlist-data.ts";

const rows: CompanyRow[] = [
  { country: "FI", businessId: "1234567-8", name: "Example" },
  { country: "US", businessId: "opaque:company", name: "Other" },
];
const savedRows = rows.map((row) => ({
  profileId: `enterprise-company:${row.country.toLowerCase()}:${row.businessId}`,
  name: row.name,
  externalUrl: "https://example.test",
  phoneNumber: "+358401234567",
}));
const saved = {
  listId: "saved-fi",
  name: "Shortlist",
  total: 2,
  expectedUpdatedAt: "2026-10-08T10:00:00.000Z",
  companies: savedRows,
  nextOffset: null,
};

test("permission recovery follows OAuth challenges and never infers a rejected write from a timeout", () => {
  const denied = {
    isError: true,
    structuredContent: { error: { code: "insufficient_scope", message: "Owner access required." } },
  };
  assert.equal(mutationRejected(denied, []), true);
  assert.throws(() => readData(denied), /Owner access required/);
  assert.throws(
    () =>
      readData({
        ...denied,
        _meta: {
          "mcp/www_authenticate": ['Bearer error="insufficient_scope", scope="campaigns:write"'],
        },
      }),
    /Reconnect DM Faster.*approve the permissions/,
  );
  assert.throws(
    () =>
      readData({
        ...denied,
        _meta: {
          "mcp/www_authenticate": ['Bearer error="invalid_token"'],
        },
      }),
    /renew access/,
  );
  for (const code of [
    "mcp_tool_failed",
    "internal_error",
    "service_unavailable",
    "idempotency_conflict",
    "",
  ]) {
    assert.equal(
      mutationRejected({ isError: true, structuredContent: { error: { code } } }, []),
      false,
    );
  }
  assert.equal(
    mutationRejected({ ok: false, error: { code: "company_changed" } }, ["company_changed"]),
    true,
  );
  assert.equal(
    mutationRejected({ ok: true, data: {}, error: { code: "company_changed" } }, [
      "company_changed",
    ]),
    false,
  );
});

test("shortlist reads preserve opaque identities, saved contacts and exact pagination", () => {
  assert.equal(savedCompanyRow(savedRows[1]!).businessId, "opaque:company");
  assert.equal(savedCompanyRow(savedRows[0]!).phoneNumber, "+358401234567");
  const page = savedListPage(saved);
  assert.equal(page.total, 2);
  assert.equal(page.expectedRevision, saved.expectedUpdatedAt);
  assert.equal(page.savedListId, saved.listId);
  assert.equal(page.hasNextPage, false);
  for (const change of [
    { total: 3 },
    { total: 1.2 },
    { expectedUpdatedAt: "" },
    { nextOffset: 20 },
    { companies: [savedRows[0], savedRows[0]] },
    { companies: [{ ...savedRows[0], profileId: "not-a-company" }, savedRows[1]] },
  ])
    assert.throws(() => savedListPage({ ...saved, ...change } as typeof saved));
  assert.equal(
    savedListPage({ ...saved, total: 21, companies: savedRows, nextOffset: 2 }, 0, 2).nextCursor,
    "2",
  );
});

test("shortlist preparation inspects only the exact bounded selection and preserves revisions", async () => {
  const calls: unknown[] = [];
  let active = 0,
    peak = 0;
  const request = await inspectShortlist(
    {
      async callTool(name, args) {
        calls.push({ name, args });
        peak = Math.max(peak, ++active);
        await new Promise((resolve) => setTimeout(resolve, 1));
        active--;
        return {
          structuredContent: { ok: true, data: { profile: args, revision: "a".repeat(64) } },
        };
      },
    },
    rows,
    " Shortlist ",
  );
  assert.equal(request.name, "Shortlist");
  assert.equal(calls.length, 2);
  assert(peak <= 4);
  assert.deepEqual(
    request.companies,
    rows.map(({ country, businessId }) => ({
      country,
      businessId,
      expectedRevision: "a".repeat(64),
    })),
  );
  assert.match(request.idempotencyKey, /^ui:/);
  assert.throws(() => checkedSelection([rows[0]!, rows[0]!], 2));
  assert.throws(() => checkedSelection(rows, 51));
  assert.throws(() => checkedSelection([], 0));
});

test("changed selections and mismatched profile identities cannot reach a save request", async () => {
  let current = true;
  await assert.rejects(
    inspectShortlist(
      {
        async callTool(_name, args) {
          current = false;
          return { ok: true, data: { profile: args, revision: "a".repeat(64) } };
        },
      },
      rows,
      "Shortlist",
      () => current,
    ),
    /selection changed/,
  );
  await assert.rejects(
    inspectShortlist(
      {
        async callTool() {
          return { ok: true, data: { profile: rows[1], revision: "a".repeat(64) } };
        },
      },
      [rows[0]!],
      "Shortlist",
    ),
    /details changed/,
  );
});

test("saved receipts must match every selected identity, name, count and version", () => {
  const request: ShortlistRequest = {
    name: saved.name,
    idempotencyKey: "test-key",
    companies: rows.map(({ country, businessId }) => ({
      country,
      businessId,
      expectedRevision: "a".repeat(64),
    })),
  };
  const data = { ...saved, created: true, replayed: false };
  assert.equal(verifiedShortlist({ ok: true, data }, request), data);
  for (const change of [
    { total: 1 },
    { name: "Other list" },
    { expectedUpdatedAt: "" },
    { companies: [savedRows[0], savedRows[0]] },
  ])
    assert.throws(() => verifiedShortlist({ ok: true, data: { ...data, ...change } }, request));
});

test("opening saved lists uses only the authenticated list adapter and rejects mixed audiences", async () => {
  const registry = new Map<
    string,
    { options: any; call: (input: any, ctx: { mcpReq: { signal: AbortSignal } }) => Promise<any> }
  >();
  const calls: unknown[] = [];
  const result = { ...evidenceInitial().result, tool: "companies.list.inspect", data: saved };
  registerCampaignWorkspace(
    {
      registerResource() {},
      registerTool(name: string, options: any, call: any) {
        registry.set(name, { options, call });
      },
    } as any,
    {
      async invoke(tool: unknown, input: unknown) {
        calls.push({ tool, input });
        return result;
      },
    } as any,
    () => {
      throw Error("Unexpected failure");
    },
  );
  const args = companiesWorkspaceInputSchema.parse({
    savedList: { listId: saved.listId, expectedUpdatedAt: saved.expectedUpdatedAt },
  });
  const response = await registry
    .get("companies_workspace")!
    .call(args, { mcpReq: { signal: new AbortController().signal } });
  assert.deepEqual(calls, [
    { tool: "companies.list.inspect", input: { ...args.savedList, limit: 20 } },
  ]);
  assert.equal(response.structuredContent.savedListId, saved.listId);
  assert.equal(response.structuredContent.filters, undefined);
  assert(workspaceOutputSchema.safeParse(response.structuredContent).success);
  for (const extra of [
    { filters: { countries: ["FI"] } },
    { evidenceRun: { runId: "run", expectedRevision: "a".repeat(64) } },
  ])
    assert.equal(companiesWorkspaceInputSchema.safeParse({ ...args, ...extra }).success, false);
  assert.equal(
    registry.get("workspace_open")!.options.inputSchema.safeParse({ ...args, section: "campaigns" })
      .success,
    false,
  );
});
