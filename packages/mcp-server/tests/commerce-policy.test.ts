import assert from "node:assert/strict";
import test from "node:test";
import { AGENT_TOOL_POLICIES, type AgentToolName, type AgentToolResult } from "@dmfaster/sdk";
import {
  mcpCommerceClient,
  mcpCommerceResult,
  MCP_ENTITLEMENT_INFO_URL,
} from "../src/commerce-policy.ts";
import { AGENT_OUTPUT_SCHEMAS } from "../src/generated/output-schemas.ts";
import { createAgentToolDefinitions } from "../src/tools.ts";

function result(tool: AgentToolName, data: unknown): AgentToolResult {
  return {
    version: 1,
    tool,
    policy: AGENT_TOOL_POLICIES[tool],
    ok: true,
    generatedAt: "2026-10-06T20:00:00.000Z",
    durationMs: 1,
    evidence: [],
    consistency: { status: "verified", checks: [] },
    data,
    artifacts: [],
    error: null,
  };
}

test("unfunded extraction is a schema-valid entitlement error without a digital checkout offer", () => {
  const original = result("instagram.extract.quote", {
    status: "payment_required",
    amountCents: 1999,
    purchaseUrl: "https://app.dmfaster.com/instagram-extractor?count=1000",
    checkoutAvailable: true,
  });
  const projected = mcpCommerceResult(original);
  assert.equal(projected.ok, false);
  assert.equal(projected.error?.code, "entitlement_required");
  assert.equal(projected.data, null);
  assert.equal(AGENT_OUTPUT_SCHEMAS["instagram.extract.quote"].safeParse(projected).success, true);
  assert.doesNotMatch(JSON.stringify(projected), /amountCents|purchaseUrl|checkoutAvailable/);
  assert.equal((original.data as Record<string, unknown>).amountCents, 1999);
});

test("blocked stored jobs keep exact credits and job identity without upgrade instructions", () => {
  for (const nextAction of ["buy_credits", "enable_billing"]) {
    const source = result("leads.extract.inspect", {
      status: "blocked",
      jobId: "lead_request_saved",
      nextAction,
      message: "Buy credits to continue",
      requiredCredits: 200,
      credits: { remaining: 10, purchaseUrl: "https://app.dmfaster.com/find-leads" },
      purchaseUrl: "https://app.dmfaster.com/find-leads",
    });
    const projected = mcpCommerceResult(source).data as any;
    assert.equal(projected.jobId, "lead_request_saved");
    assert.equal(projected.requiredCredits, 200);
    assert.equal(projected.credits.remaining, 10);
    assert.equal(projected.nextAction, "none");
    assert.equal(projected.credits.purchaseUrl, MCP_ENTITLEMENT_INFO_URL);
    assert.equal(projected.purchaseUrl, MCP_ENTITLEMENT_INFO_URL);
    assert.doesNotMatch(projected.message, /Buy credits/);
  }
});

test("prepaid work, existing purchase reads and user-authored messages remain usable", async () => {
  const original = result("instagram.extract.quote", {
    status: "ready",
    amountCents: 0,
    availableProfiles: 200,
    checkoutAvailable: false,
    purchaseUrl: "https://app.dmfaster.com/instagram-extractor",
  });
  let calls = 0;
  const client = mcpCommerceClient({
    async invoke() {
      calls++;
      return original;
    },
  });
  const answer = await client.invoke("instagram.extract.quote", {
    username: "example",
    type: "followers",
    count: 100,
  });
  assert.equal(calls, 1);
  assert.equal(answer.ok, true);
  assert.equal((answer.data as any).availableProfiles, 200);
  assert.equal((answer.data as any).purchaseUrl, MCP_ENTITLEMENT_INFO_URL);
  for (const tool of ["instagram.purchases.results", "campaign.copy.inspect"] as const) {
    const saved = result(tool, { message: "Buy credits", purchaseUrl: "https://example.test" });
    assert.equal(mcpCommerceResult(saved), saved);
  }
});

test("insufficient-capacity failures and advertised quote description contain no purchase instructions", () => {
  const source = {
    ...result("instagram.extract.start", null),
    ok: false,
    error: {
      code: "insufficient_account_capacity",
      message: "Checkout at https://app.dmfaster.com/instagram-extractor",
      retryable: false,
    },
  };
  assert.doesNotMatch(mcpCommerceResult(source).error!.message, /https:|Checkout/);
  const quote = createAgentToolDefinitions({
    async invoke() {
      return source;
    },
  }).find((t) => t.name === "instagram_extract_quote")!;
  assert.match(quote.description, /existing prepaid capacity/);
  assert.doesNotMatch(quote.description, /human checkout URL|standalone price/);
});
