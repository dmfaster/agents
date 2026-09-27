#!/usr/bin/env node

import { runCli } from "./cli.ts";

const args = process.argv.slice(2);
if (args.includes("--until-complete")) {
  const controller = new AbortController();
  const interrupt = () => controller.abort();
  process.once("SIGINT", interrupt);
  process.once("SIGTERM", interrupt);
  try {
    process.exitCode = await runCli(args, { signal: controller.signal });
  } finally {
    process.removeListener("SIGINT", interrupt);
    process.removeListener("SIGTERM", interrupt);
  }
} else process.exitCode = await runCli(args);
