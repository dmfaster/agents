#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));

export function localTypecheckInvocation(
  args,
  { cwd = process.cwd(), platform = process.platform, arch = process.arch } = {},
) {
  let project = "tsconfig.json";
  if (args.length) {
    if (args.length !== 2 || !["-p", "--project"].includes(args[0]) || !args[1])
      throw new Error("Usage: typecheck:local [--project <tsconfig.json>]");
    project = args[1];
  }
  let config = path.resolve(cwd, project);
  if (statSync(config).isDirectory()) config = path.join(config, "tsconfig.json");
  const supported =
    (platform === "darwin" && arch === "arm64") ||
    (platform === "linux" && ["arm64", "x64"].includes(arch));
  // The pinned tsrs release has no Windows or Intel macOS binary. Keep local
  // checks usable there without treating a compiler crash as a successful fallback.
  const compiler = supported ? "tsrs" : "typescript";
  const manifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
  const packageRoot = path.join(root, "node_modules", compiler);
  const installed = JSON.parse(readFileSync(path.join(packageRoot, "package.json"), "utf8"));
  if (installed.version !== manifest.devDependencies[compiler])
    throw new Error(`Run pnpm install --frozen-lockfile; ${compiler} must match its exact pin.`);
  const binary = compiler === "tsrs" ? "tsrs" : "tsc";
  const cache = path.join(
    path.dirname(config),
    ".cache/typecheck-local",
    compiler,
    `${path.basename(config)}.tsbuildinfo`,
  );
  return {
    compiler,
    version: installed.version,
    fallback: !supported,
    cache,
    command: process.execPath,
    args: [
      path.join(packageRoot, installed.bin[binary]),
      "--project",
      config,
      "--noEmit",
      "--pretty",
      "false",
      "--incremental",
      "--tsBuildInfoFile",
      cache,
    ],
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const invocation = localTypecheckInvocation(process.argv.slice(2));
    mkdirSync(path.dirname(invocation.cache), { recursive: true });
    console.log(
      `Local typecheck: ${invocation.compiler} ${invocation.version}${invocation.fallback ? " (tsrs unavailable on this platform)" : ""}; development evidence only.`,
    );
    const env = { ...process.env };
    delete env.TSRS_BINARY;
    delete env.TSRS_LIB_PATH;
    const result = spawnSync(invocation.command, invocation.args, { env, stdio: "inherit" });
    if (result.error) throw result.error;
    process.exitCode = result.status ?? 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
