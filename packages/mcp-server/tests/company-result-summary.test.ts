import assert from "node:assert/strict";
import test from "node:test";
import type { AgentToolResult } from "@dmfaster/sdk";
import { companyResultSummary } from "../src/company-result-summary.ts";
test("company text retains the complete structured response for text-only clients", () => {
  const result = {
    tool: "companies.search",
    ok: true,
    data: {
      total: 2,
      totalExact: true,
      companies: [{ country: "FI", businessId: "1019543-8", name: "Fixture" }],
      querySignature: "query",
      expectedRevision: "revision",
      nextCursor: "next",
    },
  } as unknown as AgentToolResult;
  assert.deepEqual(JSON.parse(companyResultSummary(result)!), result);
  const error = {
    ...result,
    ok: false,
    data: null,
    error: { code: "unavailable", message: "Retry later" },
  } as unknown as AgentToolResult;
  assert.deepEqual(JSON.parse(companyResultSummary(error)!), error);
  assert.equal(companyResultSummary({ ...result, tool: "campaign.prepare" }), null);
});
