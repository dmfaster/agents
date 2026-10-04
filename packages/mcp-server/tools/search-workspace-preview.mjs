#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { previewPayload } from "./preview-workspace-host.mjs";

export function createComposerSearch(read, publish) {
  let generation = 0;
  return async (input) => {
    const current = ++generation;
    const started = performance.now();
    if (input.evidenceRun && input.filters) throw new Error("An evidence run owns its filters.");
    const response = input.evidenceRun
      ? await read("companies_evidence_results", {
          ...input.evidenceRun,
          pageSize: input.pageSize ?? 20,
        })
      : await read("companies_search", {
          ...input,
          projection: input.projection ?? "list",
        });
    const requestMs = Math.round(performance.now() - started);
    const payload = previewPayload({
      view: "dmfaster.workspace",
      filters: input.filters,
      result: response.structuredContent,
    });
    const published = current === generation;
    if (published) await publish(payload);
    const result = payload.result;
    return {
      ok: result.ok,
      published,
      requestMs,
      publishMs: Math.round(performance.now() - started) - requestMs,
      serviceMs: result.durationMs,
      ...(result.ok
        ? {
            total: result.data.total,
            returned: result.data.companies.length,
            ...(input.evidenceRun
              ? {
                  runId: result.data.runId,
                  confirmedMatches: result.data.progress.confirmedMatches,
                  totalExact: false,
                  totalStatus: "unavailable",
                }
              : { projection: result.data.projection ?? "rich" }),
          }
        : { error: result.error }),
    };
  };
}

export function previewSearchUrl(value) {
  const url = new URL(value);
  if (
    url.protocol !== "http:" ||
    url.hostname !== "127.0.0.1" ||
    !url.port ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/"
  )
    throw new Error("The search preview must be an explicit loopback URL.");
  return new URL("/preview/search", url);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.length !== 4 || args[0] !== "--preview" || args[2] !== "--input")
    throw new Error("Use --preview URL --input FILE with typed company-search JSON.");
  const url = previewSearchUrl(args[1]);
  const input = JSON.parse(await readFile(resolve(args[3]), "utf8"));
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", origin: url.origin },
    body: JSON.stringify(input),
    signal: AbortSignal.timeout(30_000),
  });
  const summary = await response.json();
  console.log(JSON.stringify(summary));
  if (!response.ok || !summary.ok) process.exitCode = 1;
}
