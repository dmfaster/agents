#!/usr/bin/env node

import { validateAgentPackageReport } from "./check-agent-package-contents.mjs";
import assert from "node:assert/strict";
import { parse } from "yaml";
import { spawn, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageNames = [
  "@dmfaster/local-auth",
  "@dmfaster/sdk",
  "@dmfaster/cli",
  "@dmfaster/mcp-server",
];
const mcpClientPackage = "@modelcontextprotocol/client@2.0.0";
const releaseVersion = JSON.parse(
  readFileSync(path.join(repoRoot, "packages", "local-auth", "package.json"), "utf8"),
).version;
// Compare the installed artifact against the source contract, including additions.
const sourceContract = parse(
  readFileSync(path.join(repoRoot, "packages/public-api/openapi.yaml"), "utf8"),
);
const expectedTools = [
  ...Object.entries(sourceContract.paths)
    .filter(
      ([path, methods]) =>
        path.startsWith("/api/v1/agent/tools/") &&
        !methods.post["x-dmfaster-deprecated"]?.successor,
    )
    .map(([, methods]) => methods.post["x-dmfaster-mcp"].name),
  "connection_status",
  "tools_discover",
  "tools_call",
  "tools_read",
  "tools_write",
];
const temporaryRoot = mkdtempSync(path.join(tmpdir(), "dmfaster-agent-packages-"));
const artifactDirectory = path.join(temporaryRoot, "artifacts");
const projectDirectory = path.join(temporaryRoot, "consumer");

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || repoRoot,
    encoding: "utf8",
    env: options.env || process.env,
    timeout: options.timeout || 120_000,
  });
  if (result.status !== 0) {
    throw new Error(
      [
        `${command} ${args.join(" ")} failed with exit code ${result.status}.`,
        result.stdout.trim(),
        result.stderr.trim(),
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }
  return result;
}

function runAsync(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd || repoRoot,
      env: options.env || process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    let settled = false;
    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill("SIGTERM");
      reject(new Error(`${command} ${args.join(" ")} timed out.`));
    }, options.timeout || 120_000);
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      reject(error);
    });
    child.on("close", (status) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (status !== 0) {
        reject(
          new Error(
            [
              `${command} ${args.join(" ")} failed with exit code ${status}.`,
              stdout.trim(),
              stderr.trim(),
            ]
              .filter(Boolean)
              .join("\n"),
          ),
        );
        return;
      }
      resolve({ status, stdout, stderr });
    });
  });
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      server.off("error", reject);
      resolve();
    });
  });
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

try {
  mkdirSync(artifactDirectory);
  mkdirSync(projectDirectory);
  writeFileSync(
    path.join(projectDirectory, "package.json"),
    `${JSON.stringify({ name: "dmfaster-packed-install-smoke", private: true, type: "module" }, null, 2)}\n`,
    "utf8",
  );

  const tarballs = [];
  for (const packageName of packageNames) {
    const result = run("npm", [
      "pack",
      "--json",
      "--workspace",
      packageName,
      "--pack-destination",
      artifactDirectory,
    ]);
    const report = JSON.parse(result.stdout)[0];
    validateAgentPackageReport(packageName, report);
    if (packageName === "@dmfaster/mcp-server")
      assert.doesNotMatch(
        report.files.map((file) => file.path).join("\n"),
        /campaign-workspace|instagram-workspace-assets|workspace-mentions|outreach-details/,
        "The packed headless server must not retain old presentation bundles",
      );
    assert.ok(report?.filename, `npm pack did not return an artifact for ${packageName}`);
    tarballs.push(path.join(artifactDirectory, report.filename));
  }

  run(
    "npm",
    [
      "install",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      "--package-lock=false",
      mcpClientPackage,
      ...tarballs,
    ],
    { cwd: projectDirectory },
  );

  for (const packageName of packageNames) {
    const installedManifest = JSON.parse(
      readFileSync(
        path.join(projectDirectory, "node_modules", ...packageName.split("/"), "package.json"),
        "utf8",
      ),
    );
    assert.equal(
      installedManifest.version,
      releaseVersion,
      `${packageName} installed at an unexpected version`,
    );
  }

  const cli = path.join(projectDirectory, "node_modules", ".bin", "dmfaster");
  const help = run(cli, ["--help"], { cwd: projectDirectory });
  assert.ok(help.stdout.includes(`DM Faster CLI ${releaseVersion}`));
  assert.match(help.stdout, /Campaign controls:/u);
  assert.match(
    help.stdout,
    /Full access includes direct\s+campaign control on explicit user instructions/u,
  );
  assert.match(
    help.stdout,
    /auth upgrade.*to replace a stored credential without disconnecting first/su,
  );

  const cliToken = `dmf_pat_${"1".repeat(64)}`;
  const cliRequests = [];
  const cliApi = createServer((request, response) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      cliRequests.push({
        method: request.method,
        url: request.url,
        authorization: request.headers.authorization,
        contentType: request.headers["content-type"],
        body,
      });
      response.writeHead(200, { "content-type": "application/json" });
      response.end(
        JSON.stringify({
          version: 1,
          tool: request.url.endsWith("list.import") ? "list.import" : "workspace.briefing",
          policy: {
            effect: request.url.endsWith("list.import") ? "draft" : "read",
            approval: "none",
            exposure: "public_api",
          },
          ok: true,
          generatedAt: "2026-08-02T12:00:00.000Z",
          durationMs: 1,
          evidence: [],
          consistency: { status: "verified", checks: ["packed_cli_fallback"] },
          data: { summary: "Disposable packed CLI fallback passed." },
          artifacts: [],
          error: null,
        }),
      );
    });
  });
  await listen(cliApi);
  try {
    const address = cliApi.address();
    assert.ok(address && typeof address === "object");
    const briefing = await runAsync(cli, ["--json", "workspace", "briefing"], {
      cwd: projectDirectory,
      env: {
        ...process.env,
        DMFASTER_API_URL: `http://127.0.0.1:${address.port}`,
        DMFASTER_TOKEN: cliToken,
      },
    });
    assert.equal(briefing.stderr, "");
    assert.doesNotMatch(`${briefing.stdout}${briefing.stderr}`, new RegExp(cliToken, "u"));
    const result = JSON.parse(briefing.stdout);
    assert.equal(result.tool, "workspace.briefing");
    assert.equal(result.ok, true);
    assert.deepEqual(cliRequests, [
      {
        method: "POST",
        url: "/api/v1/agent/tools/workspace.briefing",
        authorization: `Bearer ${cliToken}`,
        contentType: "application/json",
        body: "{}",
      },
    ]);
    const importFile = path.join(projectDirectory, "coaches.csv");
    writeFileSync(importFile, '\uFEFFusername\r\n"@Coach.FI"\r\nsecond_coach\r\ncoach.fi\r\n');
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const imported = await runAsync(
        cli,
        ["list", "import", "--name", "Coaches", "--file", importFile, "--json"],
        {
          cwd: projectDirectory,
          env: {
            ...process.env,
            DMFASTER_API_URL: `http://127.0.0.1:${address.port}`,
            DMFASTER_TOKEN: cliToken,
          },
        },
      );
      assert.equal(JSON.parse(imported.stdout).tool, "list.import");
      assert.doesNotMatch(imported.stdout + imported.stderr, new RegExp(cliToken, "u"));
    }
    const importedBody = JSON.parse(cliRequests[1].body);
    assert.equal(cliRequests[1].url, "/api/v1/agent/tools/list.import");
    assert.equal(cliRequests[1].authorization, `Bearer ${cliToken}`);
    assert.deepEqual(importedBody.usernames, ["coach.fi", "second_coach", "coach.fi"]);
    assert.equal(importedBody.name, "Coaches");
    assert.match(importedBody.idempotencyKey, /^instagram-import:[a-f0-9]{64}$/);
    assert.deepEqual(JSON.parse(cliRequests[2].body), importedBody);
  } finally {
    await close(cliApi);
  }

  const requireFromConsumer = createRequire(path.join(projectDirectory, "package.json"));
  const clientModule = await import(
    pathToFileURL(requireFromConsumer.resolve("@modelcontextprotocol/client")).href
  );
  const transportModule = await import(
    pathToFileURL(requireFromConsumer.resolve("@modelcontextprotocol/client/stdio")).href
  );
  const mcpServerBinary = path.join(
    projectDirectory,
    "node_modules",
    "@dmfaster",
    "mcp-server",
    "dist",
    "bin.js",
  );
  const client = new clientModule.Client(
    { name: "packed-install-smoke", version: releaseVersion },
    { versionNegotiation: { mode: { pin: "2026-07-28" } } },
  );
  const transport = new transportModule.StdioClientTransport({
    command: process.execPath,
    args: [mcpServerBinary],
    env: {
      ...process.env,
      DMFASTER_API_URL: "http://127.0.0.1:9",
      DMFASTER_MCP_PROFILE: "full",
      DMFASTER_TOKEN: `dmf_pat_${"0".repeat(64)}`,
    },
  });
  try {
    await client.connect(transport);
    assert.equal(
      client.getProtocolEra(),
      "modern",
      "the packed MCP server must negotiate the MCP 2026-07-28 protocol",
    );
    assert.equal(client.getNegotiatedProtocolVersion(), "2026-07-28");
    const listed = await client.listTools();
    assert.deepEqual(
      listed.tools.map((tool) => tool.name).sort(),
      [...expectedTools].sort(),
      "the packed full catalog must expose current domain tools; deprecated names remain dispatched by tools_call",
    );
    for (const tool of listed.tools.filter((candidate) => candidate.name !== "connection_status")) {
      if (["tools_discover", "tools_call", "tools_read", "tools_write"].includes(tool.name))
        assert.equal(tool.outputSchema?.type, "object");
      else assert.equal(tool.outputSchema, undefined, `${tool.name} keeps discovery compact`);
    }
    for (const tool of listed.tools) {
      assert.equal(tool._meta?.ui, undefined);
      assert.equal(tool._meta?.["openai/widgetAccessible"], undefined);
      assert.equal(tool._meta?.["openai/outputTemplate"], undefined);
    }

    // The published headless server advertises domain operations, not retired UI adapters.
    assert.equal(
      listed.tools.some((tool) => tool.name === "campaign_workspace"),
      false,
    );
    assert.equal(
      listed.tools.some((tool) => tool.name === "companies_workspace"),
      false,
    );
  } finally {
    await client.close();
  }

  process.stdout.write(
    "Packed SDK, auth, CLI, and MCP artifacts install cleanly; CLI fallback briefing and MCP 2026-07-28 domain tools, connection status passed.\n",
  );
} finally {
  const expectedPrefix = path.join(tmpdir(), "dmfaster-agent-packages-");
  if (!temporaryRoot.startsWith(expectedPrefix)) {
    throw new Error(`Refusing to clean an unexpected temporary path: ${temporaryRoot}`);
  }
  rmSync(temporaryRoot, { recursive: true, force: true });
}
