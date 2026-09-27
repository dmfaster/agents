import assert from "node:assert/strict";
import test from "node:test";
import {
  runCompanyFitReview,
  collectCompanyFitResults,
  DmfasterSdkError,
  AGENT_TOOL_POLICIES,
  type AgentToolName,
} from "../src/index.ts";
const progress = (complete: number, total = 2) => ({
  runId: "fit_test",
  campaignId: "c",
  listId: "l",
  status: "ready" as const,
  total,
  complete,
  pending: total - complete,
  processing: 0,
  strong: complete,
  possible: 0,
  poor: 0,
  unknown: 0,
  readyForProposal: complete === total,
  version: "a".repeat(64),
  maxPages: 2,
  pollAfterMs: 250,
  expiresAt: "2026-10-27T00:00:00.000Z",
});
const result = (tool: AgentToolName, data: unknown) => ({
  version: 1 as const,
  tool,
  policy: AGENT_TOOL_POLICIES[tool],
  ok: true,
  generatedAt: "2026-09-27T00:00:00.000Z",
  durationMs: 1,
  evidence: [],
  consistency: { status: "verified" as const, checks: [] },
  data,
  artifacts: [],
  error: null,
});

test("review resumes the same run after an interrupted response without reinitializing it", async () => {
  let at = 0,
    calls = 0;
  const identities: string[] = [];
  const client = {
    async invoke(tool: AgentToolName, input: { runId?: string }) {
      identities.push(input.runId || "");
      if (++calls === 1) throw new DmfasterSdkError("Connection lost", "network_error");
      return result(tool, { progress: progress(calls - 1), processed: 1, stopReason: "budget" });
    },
  };
  const saved = await runCompanyFitReview(client, "fit_test", {
    now: () => at,
    sleep: async (ms) => {
      at += ms;
    },
  });
  assert.equal(saved.stopReason, "complete");
  assert.deepEqual(identities, ["fit_test", "fit_test", "fit_test"]);
});

test("permanent errors are not retried and corrupt exact counts stop the coordinator", async () => {
  let calls = 0;
  await assert.rejects(
    runCompanyFitReview(
      {
        async invoke() {
          calls++;
          throw new DmfasterSdkError("No scope", "insufficient_scope");
        },
      },
      "fit_test",
    ),
    /No scope/,
  );
  assert.equal(calls, 1);
  await assert.rejects(
    runCompanyFitReview(
      {
        async invoke(tool) {
          return result(tool, { progress: { ...progress(1), pending: 7 } });
        },
      },
      "fit_test",
    ),
    /exact saved counts/,
  );
});

test("bounded retries stop recurring network failures", async () => {
  let calls = 0;
  await assert.rejects(
    runCompanyFitReview(
      {
        async invoke() {
          calls++;
          throw new DmfasterSdkError("Offline", "network_error");
        },
      },
      "fit_test",
      { maxRetries: 2, sleep: async () => {} },
    ),
    /Offline/,
  );
  assert.equal(calls, 3);
});

test("export reconciles every identity and rejects duplicated pages or changed evidence versions", async () => {
  const item = (id: string) => ({
    country: "FI",
    businessId: id,
    status: "complete",
    tier: "strong",
    priority: 90,
    evidence: [],
  });
  let calls = 0;
  const client = {
    async invoke(tool: AgentToolName, input: unknown) {
      if (tool === "companies.fit.status") return result(tool, { progress: progress(2) });
      const offset = (input as { offset: number }).offset;
      calls++;
      return result(tool, {
        progress: progress(2),
        progressVersion: "a".repeat(64),
        totalMatching: 2,
        items: [item(String(offset))],
        nextOffset: offset === 0 ? 1 : null,
      });
    },
  };
  const output = await collectCompanyFitResults(client, "fit_test");
  assert.equal(output.items.length, 2);
  assert.equal(calls, 2);
  await assert.rejects(
    collectCompanyFitResults(
      {
        async invoke(tool) {
          return tool === "companies.fit.status"
            ? result(tool, { progress: progress(2) })
            : result(tool, {
                progress: progress(2),
                progressVersion: "a".repeat(64),
                totalMatching: 2,
                items: [item("same"), item("same")],
                nextOffset: null,
              });
        },
      },
      "fit_test",
    ),
    /duplicated/,
  );
  await assert.rejects(
    collectCompanyFitResults(
      {
        async invoke(tool) {
          return tool === "companies.fit.status"
            ? result(tool, { progress: progress(2) })
            : result(tool, {
                progress: { ...progress(2), version: "b".repeat(64) },
                progressVersion: "b".repeat(64),
                totalMatching: 2,
                items: [item("1")],
                nextOffset: null,
              });
        },
      },
      "fit_test",
    ),
    /review changed/,
  );
});

test("export rejects a different run identity and an invalid page instead of writing partial data", async () => {
  await assert.rejects(
    collectCompanyFitResults(
      {
        async invoke(tool) {
          return result(tool, { progress: { ...progress(2), runId: "other" } });
        },
      },
      "fit_test",
    ),
    /identity/,
  );
  await assert.rejects(
    collectCompanyFitResults(
      {
        async invoke(tool) {
          return tool === "companies.fit.status"
            ? result(tool, { progress: progress(2) })
            : result(tool, {
                progress: progress(2),
                progressVersion: "a".repeat(64),
                totalMatching: 2,
                items: null,
                nextOffset: null,
              });
        },
      },
      "fit_test",
    ),
    /page is incomplete/,
  );
});
