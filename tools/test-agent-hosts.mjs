#!/usr/bin/env node
// Opt-in host exercise with loopback fixtures and no customer/provider credentials.
import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AGENT_TOOL_POLICIES } from "../packages/sdk/dist/index.js";
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = mkdtempSync(path.join(tmpdir(), "dmf-agent-host-fixture-"));
const token = "dmf_pat_" + randomBytes(32).toString("hex"),
  visited = [];
let complete = 0;
const progress = () => ({
  runId: "fit_host_fixture",
  campaignId: "campaign_fixture",
  listId: "list_fixture",
  status: "ready",
  total: 1,
  complete,
  pending: 1 - complete,
  processing: 0,
  strong: complete,
  possible: 0,
  poor: 0,
  unknown: 0,
  readyForProposal: complete === 1,
  version: "a".repeat(64),
  maxPages: 2,
  pollAfterMs: 250,
  expiresAt: "2030-01-01T00:00:00.000Z",
});
const server = createServer((request, response) => {
  response.setHeader("Content-Type", "application/json");
  if (request.headers.authorization !== "Bearer " + token) {
    response.statusCode = 401;
    response.end("{}");
    return;
  }
  const tool = request.url.split("/tools/")[1];
  visited.push(tool);
  let data;
  if (tool === "companies.fit.run") {
    complete = 1;
    data = { progress: progress(), processed: 1, stopReason: "complete" };
  } else if (tool === "companies.fit.status") data = { progress: progress() };
  else if (tool === "companies.fit.results")
    data = {
      progress: (({
        version: _version,
        maxPages: _pages,
        pollAfterMs: _poll,
        expiresAt: _expiry,
        ...basic
      }) => basic)(progress()),
      progressVersion: "a".repeat(64),
      totalMatching: 1,
      nextOffset: null,
      items: [
        {
          ordinal: 0,
          country: "FI",
          businessId: "fixture-company",
          companyName: "Fixture company",
          websiteUrl: "https://example.test/",
          status: "complete",
          tier: "strong",
          priority: 90,
          reason: "Synthetic fixture only",
          modelVersion: "fixture",
          checkedAt: new Date().toISOString(),
          evidence: [],
        },
      ],
    };
  else {
    response.statusCode = 400;
    response.end("{}");
    return;
  }
  response.end(
    JSON.stringify({
      version: 1,
      tool,
      policy: AGENT_TOOL_POLICIES[tool],
      ok: true,
      generatedAt: new Date().toISOString(),
      durationMs: 1,
      evidence: [],
      consistency: { status: "verified", checks: ["synthetic_fixture"] },
      data,
      artifacts: [],
      error: null,
    }),
  );
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = "http://127.0.0.1:" + server.address().port;
writeFileSync(path.join(root, "run.json"), JSON.stringify({ runId: "fit_host_fixture", limit: 1 }));
writeFileSync(
  path.join(root, "schema.json"),
  JSON.stringify({
    type: "object",
    additionalProperties: false,
    required: ["reviewComplete", "exportedCompanies", "liveActionsTaken"],
    properties: {
      reviewComplete: { type: "boolean" },
      exportedCompanies: { type: "integer" },
      liveActionsTaken: { type: "boolean" },
    },
  }),
);
writeFileSync(
  path.join(root, "fixture-cli.mjs"),
  "process.env.DMFASTER_API_URL=" +
    JSON.stringify(base) +
    ";process.env.DMFASTER_TOKEN=" +
    JSON.stringify(token) +
    ";const {runCli}=await import(" +
    JSON.stringify(path.join(repo, "packages/cli/dist/cli.js")) +
    ");process.exitCode=await runCli(process.argv.slice(2));",
);
const prompt =
  "This is an explicit interface test with synthetic loopback data. Use only the provided fixture and no installed live connector. Run node " +
  path.join(root, "fixture-cli.mjs") +
  " companies fit run --input run.json --until-complete, then node " +
  path.join(root, "fixture-cli.mjs") +
  " companies fit export fit_host_fixture --output complete.json. Inspect complete.json. Report reviewComplete, exportedCompanies and liveActionsTaken (false). No real workspace or provider action is authorized. If MCP has an unsupported handshake, use this CLI fallback. Do not research the source checkout or use other connectors. The token is a disposable fixture value.";
const report = {
  packageVersion: JSON.parse(readFileSync(path.join(repo, "packages/cli/package.json"), "utf8"))
    .version,
  fixture: "loopback synthetic review",
  hosts: [],
};
try {
  const binary = process.env.DMF_TEST_CODEX_BINARY || "codex";
  const cv = spawnSync(binary, ["--version"], { encoding: "utf8" });
  if (cv.status !== 0)
    report.hosts.push({ host: "Codex", status: "unverified", reason: "Binary unavailable" });
  else {
    const args = [
      "exec",
      "--ephemeral",
      "--ignore-user-config",
      "--ignore-rules",
      "--skip-git-repo-check",
      "--sandbox",
      "workspace-write",
      "-c",
      "sandbox_workspace_write.network_access=true",
      "-c",
      "approval_policy=never",
      "--output-schema",
      "schema.json",
      "--output-last-message",
      "receipt.json",
      "--json",
      "-c",
      "mcp_servers.dmf_fixture.command=node",
      "-c",
      "mcp_servers.dmf_fixture.args=" +
        JSON.stringify([path.join(repo, "packages/mcp-server/dist/bin.js")]),
      "-c",
      "mcp_servers.dmf_fixture.env.DMFASTER_API_URL=" + JSON.stringify(base),
      "-c",
      "mcp_servers.dmf_fixture.env.DMFASTER_TOKEN=" + JSON.stringify(token),
      prompt,
    ];
    const result = await new Promise((resolve, reject) => {
      const child = spawn(binary, args, {
        cwd: root,
        env: { ...process.env, DMFASTER_API_URL: base, DMFASTER_TOKEN: token },
        stdio: ["ignore", "pipe", "pipe"],
      });
      let logs = "";
      const timer = setTimeout(() => child.kill("SIGTERM"), 120000);
      child.stdout.on("data", (c) => (logs += c));
      child.stderr.on("data", (c) => (logs += c));
      child.on("error", (e) => {
        clearTimeout(timer);
        reject(e);
      });
      child.on("close", (code) => {
        clearTimeout(timer);
        resolve({ code, logs });
      });
    });
    if (result.code !== 0)
      throw Error("Codex fixture invocation failed (exit " + result.code + ").");
    if (!visited.includes("companies.fit.results")) {
      const events = result.logs.split("\n").flatMap((line) => {
        try {
          const event = JSON.parse(line);
          return event.item?.type === "command_execution"
            ? [
                {
                  command: event.item.command,
                  exitCode: event.item.exit_code,
                  output: String(event.item.aggregated_output || "").slice(0, 800),
                },
              ]
            : [];
        } catch {
          return [];
        }
      });
      console.log(JSON.stringify({ host: "Codex", status: "failed", visited, events }, null, 2));
    }
    const receipt = JSON.parse(readFileSync(path.join(root, "receipt.json"), "utf8")),
      exported = JSON.parse(readFileSync(path.join(root, "complete.json"), "utf8"));
    assert.equal(receipt.reviewComplete, true);
    assert.equal(receipt.exportedCompanies, 1);
    assert.equal(receipt.liveActionsTaken, false);
    assert.equal(exported.items.length, 1);
    assert.equal(exported.progress.runId, "fit_host_fixture");
    for (const name of ["companies.fit.run", "companies.fit.status", "companies.fit.results"])
      assert.ok(visited.includes(name));
    report.hosts.push({
      host: "Codex",
      version: cv.stdout.trim(),
      status: "passed",
      transport: /unsupported|2025-11-25|2025-06-18/i.test(result.logs)
        ? "CLI fallback after incompatible MCP handshake"
        : "CLI workflow",
      exportedCompanies: 1,
      liveActionsTaken: false,
    });
  }
  const claude = spawnSync("claude", ["--version"], { encoding: "utf8" });
  report.hosts.push({
    host: "Claude Code",
    status: "unverified",
    reason:
      claude.status === 0
        ? "Installed host requires its fixture invocation before claiming compatibility"
        : "Binary unavailable",
  });
  console.log(JSON.stringify(report, null, 2));
} finally {
  await new Promise((resolve) => server.close(resolve));
  rmSync(root, { recursive: true, force: true });
}
