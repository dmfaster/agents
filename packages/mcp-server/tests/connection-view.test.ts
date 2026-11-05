import assert from "node:assert/strict";
import test from "node:test";
import { AGENT_TOOL_SCOPES } from "@dmfaster/sdk";
import { projectConnectionStatus } from "../src/connection-view.ts";
import { hostedConnectionSchema } from "../src/connection-schemas.ts";
test("connection default stays under 2 KiB and names/full are explicit", () => {
  const scopes = [...new Set(Object.values(AGENT_TOOL_SCOPES).flat())];
  const full = {
    status: "authenticated",
    transport: "https",
    baseUrl: "https://app.dmfaster.com",
    user: { id: "fixture", name: "Fixture" },
    workspace: { id: "fixture", name: "Fixture" },
    credential: { id: "fake_credential", scopes, expiresAt: "2027-10-23T00:00:00Z" },
    agent: { id: "agt_fixture", name: "Fixture agent", status: "active" },
    scopeEligibleTools: ["example"],
    scopeEligibleMcpTools: ["example"],
    authorizationNote: "Per-action permissions still apply.",
    readiness: {
      calendar: { connected: true },
      gmail: Array.from({ length: 100 }, () => ({ canSend: true })),
      browserWorkers: { online: 1 },
    },
  };
  const summary = projectConnectionStatus(full);
  assert.equal(summary.toolsView, "summary");
  assert.equal("scopeEligibleTools" in summary, false);
  assert.equal("readiness" in summary, false);
  assert.ok(Buffer.byteLength(JSON.stringify(summary)) <= 2048);
  assert.equal(hostedConnectionSchema.safeParse(summary).success, true);
  const names = projectConnectionStatus(full, "names");
  assert.ok(Array.isArray(names.scopeEligibleMcpTools));
  assert.equal("scopeEligibleTools" in names, false);
  assert.deepEqual(projectConnectionStatus(full, "full"), {
    ...full,
    availabilityBasis: summary.availabilityBasis,
    availabilityNote: summary.availabilityNote,
    blockedTools: [],
    grantUrl: "https://app.dmfaster.com/settings",
    toolsView: "full",
  });
});

test("summary bounds feature blockers; names and full explain them without claiming scope readiness", () => {
  const status = {
    status: "authenticated",
    credential: { scopes: [] },
    toolBlockers: { work_queue_list: { code: "feature_disabled", nextAction: "Contact support" } },
  };
  const summary = projectConnectionStatus(status);
  assert.equal(summary.availabilityBasis, "granted_scopes_only");
  assert.equal(summary.knownToolBlockerCount, 1);
  assert.equal("toolBlockers" in summary, false);
  assert.deepEqual(projectConnectionStatus(status, "names").toolBlockers, status.toolBlockers);
  assert.deepEqual(projectConnectionStatus(status, "full").toolBlockers, status.toolBlockers);
});

test("limited-scope summaries stay bounded while names retains exact missing-scope details", () => {
  for (const scopes of [[], ["workspace:read"], ["sending:read"]]) {
    const status = {
      status: "authenticated",
      credential: { scopes },
      scopeBlockedTools: Array.from({ length: 500 }, () => ({
        tool: "fixture",
        missingScopes: ["fixture:read"],
      })),
    };
    const summary = projectConnectionStatus(status);
    assert.ok(
      Buffer.byteLength(JSON.stringify(summary)) < 2048,
      `Summary grew for scopes ${scopes.join()}`,
    );
    assert.equal("blockedTools" in summary, false);
    assert.equal("scopeBlockedTools" in summary, false);
    const names = projectConnectionStatus(status, "names");
    assert.ok(Array.isArray(names.blockedTools));
    assert.equal(names.blockedTools.length, (summary.tools as { blocked: number }).blocked);
    assert.ok(
      names.blockedTools.every((tool: { requiredScope: string }) => tool.requiredScope.length),
    );
  }
});

test("sender read failures remain unknown rather than reporting Gmail as not ready", () => {
  const status = { status: "authenticated", credential: { scopes: ["sending:read"] } };
  const unavailable = projectConnectionStatus({
    ...status,
    readiness: {
      gmail: [],
      calendar: null,
      sms: null,
      browserWorkers: null,
      unavailable: [{ tool: "senders.inspect", reason: "read_unavailable" }],
    },
  });
  assert.equal(
    (unavailable.readinessSummary as { gmailCanSend: boolean | null }).gmailCanSend,
    null,
  );
  const empty = projectConnectionStatus({ ...status, readiness: { gmail: [], unavailable: [] } });
  assert.equal((empty.readinessSummary as { gmailCanSend: boolean }).gmailCanSend, false);
});
