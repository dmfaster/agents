#!/usr/bin/env node

import { existsSync } from "node:fs";
import { parse } from "yaml";
import { compileAgentContract } from "./lib/agent-contract-generation.mjs";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EXPECTED_OPENAPI_TYPESCRIPT_VERSION = "7.13.0";
const GENERATE_COMMAND = "npm run generate:agent-api";
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contractPath = path.join(rootDir, "packages", "public-api", "openapi.yaml");
const outputPath = path.join(rootDir, "packages", "sdk", "src", "generated", "api.ts");
const check = process.argv.includes("--check");
const unknownArguments = process.argv.slice(2).filter((argument) => argument !== "--check");

if (unknownArguments.length > 0) {
  process.stderr.write(
    `Unknown argument${unknownArguments.length === 1 ? "" : "s"}: ${unknownArguments.join(" ")}\n`,
  );
  process.exit(2);
}

function runOpenapiTypescript(arguments_) {
  const binary = path.join(
    rootDir,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "openapi-typescript.cmd" : "openapi-typescript",
  );
  const result = spawnSync(binary, arguments_, {
    cwd: rootDir,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  if (result.error?.code === "ENOENT") {
    throw new Error(
      `openapi-typescript is not installed. Install the root dependencies (expected ${EXPECTED_OPENAPI_TYPESCRIPT_VERSION}).`,
    );
  }
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || result.stdout.trim() || "openapi-typescript failed.");
  }
  return result.stdout.trim();
}

const version = runOpenapiTypescript(["--version"]);
if (
  !new RegExp(`(^|\\D)${EXPECTED_OPENAPI_TYPESCRIPT_VERSION.replaceAll(".", "\\.")}($|\\D)`).test(
    version,
  )
) {
  throw new Error(
    `Expected openapi-typescript ${EXPECTED_OPENAPI_TYPESCRIPT_VERSION}, received ${version || "an unknown version"}.`,
  );
}

const temporaryDirectory = await mkdtemp(path.join(tmpdir(), "dmfaster-public-api-"));
const temporaryOutput = path.join(temporaryDirectory, "api.ts");

try {
  runOpenapiTypescript([contractPath, "--output", temporaryOutput, "--alphabetize"]);
  const generated = await readFile(temporaryOutput, "utf8");

  const contract = parse(await readFile(contractPath, "utf8"));
  const artifacts = compileAgentContract(contract, {
    includeServer: existsSync(path.join(rootDir, "site", "package.json")),
  });
  for (const [relativePath, source] of artifacts) {
    const formattedPath = path.join(temporaryDirectory, path.basename(relativePath));
    await writeFile(formattedPath, source);
    const formatting = spawnSync(
      path.join(rootDir, "node_modules", ".bin", "oxfmt"),
      ["--config", path.join(rootDir, ".oxfmtrc.json"), formattedPath],
      { encoding: "utf8" },
    );
    if (formatting.status !== 0)
      throw new Error(formatting.stderr || "Generated artifact formatting failed");
    const content = await readFile(formattedPath, "utf8");
    const destination = path.join(rootDir, relativePath);
    if (check) {
      if ((await readFile(destination, "utf8").catch(() => "")) !== content) {
        process.stderr.write(`Generated ${relativePath} is stale. Run ${GENERATE_COMMAND}.\n`);
        process.exitCode = 1;
      }
    } else {
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, content);
    }
  }

  if (check) {
    const existing = await readFile(outputPath, "utf8").catch(() => "");
    if (existing !== generated) {
      process.stderr.write(`Generated public API types are stale. Run ${GENERATE_COMMAND}.\n`);
      process.exitCode = 1;
    } else {
      process.stdout.write("Generated public API types are up to date.\n");
    }
  } else {
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, generated);
    process.stdout.write(`Generated ${path.relative(rootDir, outputPath)}.\n`);
  }
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
