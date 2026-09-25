import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  CredentialStoreUnavailableError,
  DEFAULT_DMFASTER_API_URL,
  type CredentialStore,
} from "@dmfaster/local-auth";

import {
  createLocalMcpClient,
  inspectMcpConnection,
  resolveMcpClientOptions,
} from "../src/server.ts";

function generatedToken() {
  return `dmf_pat_${randomBytes(32).toString("hex")}`;
}

function unusedHome() {
  return join(tmpdir(), `dmfaster-mcp-${randomBytes(8).toString("hex")}`);
}

test("MCP resolves the same OS credential and production default as the CLI", async () => {
  const token = generatedToken();
  const accounts: string[] = [];
  const store: CredentialStore = {
    kind: "macos-keychain",
    async get(baseUrl) {
      accounts.push(baseUrl);
      return token;
    },
    async set() {},
    async delete() {},
  };

  const options = await resolveMcpClientOptions(
    {},
    {
      homeDirectory: unusedHome(),
      credentialStore: store,
    },
  );

  assert.equal(options.baseUrl, DEFAULT_DMFASTER_API_URL);
  assert.equal(options.token, token);
  assert.deepEqual(accounts, [DEFAULT_DMFASTER_API_URL]);
});

test("MCP gives DMFASTER_TOKEN precedence without reading the OS credential store", async () => {
  const token = generatedToken();
  let reads = 0;
  const store: CredentialStore = {
    kind: "macos-keychain",
    async get() {
      reads += 1;
      return null;
    },
    async set() {},
    async delete() {},
  };

  const options = await resolveMcpClientOptions(
    {
      DMFASTER_TOKEN: token,
      DMFASTER_API_URL: "https://app.dmfaster.test",
      DMFASTER_TIMEOUT_MS: "20000",
    },
    {
      homeDirectory: unusedHome(),
      credentialStore: store,
    },
  );

  assert.equal(options.baseUrl, "https://app.dmfaster.test");
  assert.equal(options.token, token);
  assert.equal(options.timeoutMs, 20_000);
  assert.equal(reads, 0);
});

test("MCP fails closed with actionable guidance when no secure store is available", async () => {
  const store: CredentialStore = {
    kind: "unsupported",
    async get() {
      throw new CredentialStoreUnavailableError(
        "Secure storage unavailable. Set DMFASTER_TOKEN; no plaintext fallback is used.",
      );
    },
    async set() {},
    async delete() {},
  };

  await assert.rejects(
    resolveMcpClientOptions({}, { homeDirectory: unusedHome(), credentialStore: store }),
    /DMFASTER_TOKEN.*plaintext fallback/,
  );
});

test("MCP remains discoverable without login and uses a new credential without restart", async () => {
  let token: string | null = null;
  const observed: string[] = [];
  const store: CredentialStore = {
    kind: "macos-keychain",
    async get() {
      return token;
    },
    async set() {},
    async delete() {},
  };
  const env = { DMFASTER_API_URL: "https://app.dmfaster.test" };
  const fetch = async (_url: string | URL | Request, init?: RequestInit) => {
    observed.push(new Headers(init?.headers).get("authorization") || "");
    return Response.json({
      version: 1,
      tool: "workspace.briefing",
      policy: { effect: "read", approval: "none", exposure: "public_api" },
      ok: true,
      generatedAt: "2026-09-24T12:00:00.000Z",
      durationMs: 1,
      evidence: [],
      consistency: { status: "verified", checks: [] },
      data: {},
      artifacts: [],
      error: null,
    });
  };
  const client = createLocalMcpClient(env, { credentialStore: store, fetch });
  await assert.rejects(client.invoke("workspace.briefing", {}), /auth login/);
  const disconnected = await inspectMcpConnection(env, { credentialStore: store });
  assert.equal(disconnected.status, "not_authenticated");
  assert.equal(observed.length, 0);

  token = generatedToken();
  const result = await client.invoke("workspace.briefing", {});
  assert.equal(result.ok, true);
  assert.deepEqual(observed, [`Bearer ${token}`]);

  token = null;
  await assert.rejects(client.invoke("workspace.briefing", {}), /auth login/);
});

test("connection status distinguishes scope eligibility from final authorization", async () => {
  const token = generatedToken();
  const status = await inspectMcpConnection(
    { DMFASTER_API_URL: "https://app.dmfaster.test", DMFASTER_TOKEN: token },
    {
      homeDirectory: unusedHome(),
      fetch: async () =>
        Response.json({
          authenticated: true,
          credential: {
            id: "agent_cred_read",
            name: "Read only",
            client: "DM Faster CLI",
            scopes: [
              "workspace:read",
              "campaigns:read",
              "sending:read",
              "inbox:read",
              "pipeline:read",
            ],
            expiresAt: "2026-10-24T12:00:00.000Z",
          },
          workspace: { id: "workspace_one", name: "One" },
          user: { id: "user_one", name: "Owner" },
        }),
    },
  );
  assert.equal(status.status, "authenticated");
  if (status.status !== "authenticated") return;
  assert.ok(status.scopeEligibleTools.some((entry) => entry.tool === "conversations.list"));
  assert.ok(
    status.scopeBlockedTools.some(
      (entry) =>
        entry.tool === "campaign.launch" && entry.missingScopes.includes("campaigns:launch"),
    ),
  );
  assert.match(status.authorizationNote, /plan/);
  assert.equal(JSON.stringify(status).includes(token), false);
});
