import assert from "node:assert/strict";
import test from "node:test";
import { AGENT_TOOL_SCOPES } from "@dmfaster/sdk";
import { projectConnectionStatus } from "../src/connection-view.ts";
import { hostedConnectionSchema } from "../src/presentation-schemas.ts";
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
    blockedTools: [],
    grantUrl: "https://app.dmfaster.com/settings",
    toolsView: "full",
  });
});
