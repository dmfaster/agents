#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { localTypecheckInvocation } from "./typecheck-local.mjs";

// Share exact-pin validation and platform selection, never local cache arguments.
export function releaseCompilerInvocation(args, options) {
  const emit = args[0] === "--emit";
  const invocation = localTypecheckInvocation(emit ? args.slice(1) : args, options);
  return {
    ...invocation,
    cache: null,
    emit,
    args: [
      ...invocation.args.slice(0, 3),
      ...(emit ? [] : ["--noEmit"]),
      "--pretty",
      "false",
      "--incremental",
      "false",
    ],
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const invocation = releaseCompilerInvocation(process.argv.slice(2));
    console.log(
      `Release ${invocation.emit ? "emit" : "typecheck"}: ${invocation.compiler} ${invocation.version}${invocation.fallback ? " (tsrs unavailable on this platform)" : ""}; incremental caches disabled.`,
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
