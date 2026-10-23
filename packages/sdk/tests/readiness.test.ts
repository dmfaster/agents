import assert from "node:assert/strict";
import test from "node:test";
import { inspectAgentReadiness } from "../src/readiness.ts";
import type { AgentToolResult } from "../src/contracts.ts";

const now = Date.parse("2026-10-23T08:00:00Z");
const expiresAt = "2026-10-30T08:00:00Z";
test("connection readiness reports disconnected integrations, setup links and worker staleness", async () => {
  const calls: string[] = [];
  const result = await inspectAgentReadiness({
    scopes: ["calendar:read", "sending:read"],
    isOwner: true,
    expiresAt,
    now,
    read: async (tool) => {
      calls.push(tool);
      return {
        ok: true,
        data:
          tool === "calendar.status"
            ? { connected: false, setupUrl: "https://example.test/calendar" }
            : {
                mailboxes: [
                  { id: "mail-1", provider: "gmail", canSend: false, needsReauthorization: true },
                ],
                browserProfiles: [
                  { online: true },
                  { online: false, lastSeenAt: "2026-09-28 10:00:00+00" },
                ],
                sms: { available: true, enabled: false, configured: true },
                browserSetupUrl: "https://example.test/browsers",
              },
        artifacts: [
          { service: "gmail", mailboxId: "mail-1", setupUrl: "https://example.test/gmail" },
        ],
      } as AgentToolResult;
    },
  });
  assert.deepEqual(calls.sort(), ["calendar.status", "senders.inspect"]);
  assert.equal(result.expiresInDays, 7);
  assert.equal(result.readiness.calendar?.connected, false);
  assert.equal(result.readiness.gmail[0].setupUrl, "https://example.test/gmail");
  assert.equal(result.readiness.gmail[0].needsReauthorization, true);
  assert.equal(result.readiness.browserWorkers?.staleSince, "2026-09-28T10:00:00.000Z");
  assert.equal(result.readiness.browserWorkers?.online, 1);
  assert.deepEqual(result.readiness.unavailable, []);
});

test("readiness never probes ungranted scopes or treats a failed read as healthy", async () => {
  for (const isOwner of [false, true]) {
    const result = await inspectAgentReadiness({
      scopes: [],
      isOwner,
      expiresAt,
      now,
      read: async () => {
        throw Error("must not call");
      },
    });
    assert.equal(result.readiness.calendar, null);
    assert.equal(result.readiness.browserWorkers, null);
    assert.equal(result.readiness.unavailable.length, 2);
    assert.equal(
      result.readiness.unavailable[0].reason,
      isOwner ? "insufficient_scope" : "owner_required",
    );
  }
  const failed = await inspectAgentReadiness({
    scopes: ["calendar:read"],
    isOwner: true,
    expiresAt: null,
    now,
    read: async () => {
      throw Error("private provider failure");
    },
  });
  assert.equal(failed.expiresInDays, null);
  assert.equal(failed.readiness.calendar, null);
  assert.doesNotMatch(JSON.stringify(failed), /private provider failure/);
});
