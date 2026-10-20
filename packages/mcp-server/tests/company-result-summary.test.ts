import assert from "node:assert/strict";
import test from "node:test";
import type { AgentToolResult } from "@dmfaster/sdk";
import { companyResultSummary } from "../src/company-result-summary.ts";
import { ReadCache } from "../ui/read-cache.ts";

test("profile summaries keep the opaque lookup key only in structured data", () => {
  const result = {
    tool: "company.inspect",
    ok: true,
    data: { profile: { name: "Sample Company", country: "US", businessId: "opaqueRecordKey" } },
  } as unknown as AgentToolResult;
  assert.equal(
    companyResultSummary(result),
    "Profile for Sample Company (US). Review dated financial history alongside headline figures and verify current contact roles before selection. Website contacts have source URLs but unassigned person ownership. Full evidence and revision are in structuredContent.",
  );
  assert.equal(
    (result.data as { profile: { businessId: string } }).profile.businessId,
    "opaqueRecordKey",
  );
});

test("company text summaries carry exact counts without duplicating the complete structured data", () => {
  const result = {
    tool: "companies.search",
    ok: true,
    data: { total: 649, totalExact: true, page: 1, companies: [{ name: "Full company evidence" }] },
  } as unknown as AgentToolResult;
  assert.match(companyResultSummary(result)!, /649 companies match/);
  assert.match(companyResultSummary(result)!, /saved filters/);
  assert.match(
    companyResultSummary(result)!,
    /Offering fit and current contact roles still need qualification/,
  );
  assert.doesNotMatch(companyResultSummary(result)!, /Full company evidence/);
  assert.match(
    companyResultSummary({ ...result, data: { ...(result.data as object), totalExact: false } })!,
    /exact company count is unavailable/,
  );
  assert.equal(companyResultSummary({ ...result, tool: "campaign.prepare" }), null);
});

test("shortlist summaries separate saved counts from market coverage and do not repeat contact data", () => {
  const result = {
    tool: "companies.list.inspect",
    ok: true,
    data: {
      name: "Selected partners",
      total: 21,
      companies: [{ emailAddress: "private@example.test" }],
    },
  } as unknown as AgentToolResult;
  assert.match(companyResultSummary(result)!, /contains 21 companies; this page includes 1/);
  assert.match(companyResultSummary(result)!, /snapshots, not verified deliverability/);
  assert.doesNotMatch(companyResultSummary(result)!, /private@example/);
  assert.match(
    companyResultSummary({ ...result, data: { ...(result.data as object), total: -1 } })!,
    /unavailable/,
  );
});

test("view-local reads deduplicate pending work, honor fresh reads, and retry failed calls", async () => {
  const cache = new ReadCache(2);
  let calls = 0;
  let resolve!: (value: number) => void;
  const load = () => {
    calls += 1;
    return new Promise<number>((done) => {
      resolve = done;
    });
  };
  const first = cache.read("FI:company:revision", load);
  assert.equal(cache.read("FI:company:revision", load), first);
  await Promise.resolve();
  resolve(7);
  assert.equal(await first, 7);
  assert.equal(await cache.read("FI:company:revision", load), 7);
  assert.equal(calls, 1);
  const fresh = cache.read("FI:company:revision", load, true);
  await Promise.resolve();
  resolve(8);
  assert.equal(await fresh, 8);
  assert.equal(calls, 2);
  const fail = () => Promise.reject(new Error("permission denied"));
  await assert.rejects(cache.read("failed", fail), /permission denied/);
  assert.equal(await cache.read("failed", () => Promise.resolve(9)), 9);
  assert.equal(cache.peek("SE:company:revision"), undefined);
});

test("read cache expires and bounds settled values while keeping existing pending reads", async () => {
  const cache = new ReadCache(1, 0);
  cache.seed("old", 1);
  assert.equal(cache.peek("old"), undefined);
  let resolve!: (value: number) => void;
  const first = cache.read(
    "pending",
    () =>
      new Promise<number>((done) => {
        resolve = done;
      }),
  );
  await Promise.resolve();
  assert.equal(await cache.read("overflow", () => Promise.resolve(2)), 2);
  assert.equal(cache.peek("overflow"), undefined);
  assert.equal(
    cache.read("pending", () => Promise.resolve(3)),
    first,
  );
  resolve(4);
  assert.equal(await first, 4);
});
