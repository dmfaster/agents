#!/usr/bin/env node
import { createServer } from "node:http";
import { readFileSync, watch } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { writeFile, rename, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { createComposerSearch } from "./search-workspace-preview.mjs";
import { CAMPAIGN_WORKSPACE_HTML } from "../src/campaign-workspace-html.ts";
import { initial, installCompanyHost, rows } from "../browser-tests/companies-fixture.mjs";
import {
  createPreviewReader,
  previewPayload,
  isPreviewRequestAllowed,
  installLivePreviewHost,
} from "./preview-workspace-host.mjs";

const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== "--live-results"))
  throw new Error("Use --live-results FILE with an official company-search receipt.");
const resultsPath = args.length ? resolve(args[1]) : null;
let current = resultsPath ? previewPayload(JSON.parse(readFileSync(resultsPath, "utf8"))) : null;
let readCompany;
if (resultsPath) {
  const { createLocalMcpClient, inspectMcpConnection } = await import("../src/server.ts");
  const connection = await inspectMcpConnection(process.env);
  if (connection.status !== "authenticated")
    throw new Error(connection.actionRequired || "Sign in using the official DM Faster CLI first.");
  if (!connection.credential.scopes.includes("audiences:read"))
    throw new Error("The existing local connection needs company-read access.");
  readCompany = await createPreviewReader(createLocalMcpClient());
  console.log("Official agent reads connected to " + connection.workspace.name + ".");
}
const events = new Set();
let persistence = Promise.resolve();
let ownedWrites = 0;
const publish = (next) => {
  if (JSON.stringify(next) === JSON.stringify(current)) return;
  current = next;
  for (const response of events) response.write("data: " + JSON.stringify(current) + "\n\n");
};
const composerSearch = readCompany
  ? createComposerSearch(readCompany, async (payload) => {
      // Show the result as soon as the official read completes. Preserve the
      // receipt atomically so reconnects and later review see the same evidence.
      publish(payload);
      ownedWrites++;
      persistence = persistence
        .catch(() => {})
        .then(async () => {
          const temporary = resultsPath + ".pending-" + randomUUID();
          try {
            await writeFile(temporary, JSON.stringify(payload), { mode: 0o600 });
            await rename(temporary, resultsPath);
          } finally {
            await unlink(temporary).catch((error) => {
              if (error.code !== "ENOENT") throw error;
            });
            ownedWrites--;
          }
        });
      await persistence;
    })
  : null;
const json = (response, status, value) => {
  response
    .writeHead(status, {
      "content-type": "application/json",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    })
    .end(JSON.stringify(value));
};
const server = createServer(async (request, response) => {
  const port = server.address().port;
  if (!isPreviewRequestAllowed(request, port)) {
    response.writeHead(403).end();
    return;
  }
  const url = new URL(request.url, "http://127.0.0.1");
  if (resultsPath && request.method === "GET" && url.pathname === "/preview/state") {
    json(response, 200, current);
    return;
  }
  if (resultsPath && request.method === "GET" && url.pathname === "/preview/events") {
    response.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-store" });
    events.add(response);
    response.write("data: " + JSON.stringify(current) + "\n\n");
    request.on("close", () => events.delete(response));
    return;
  }
  if (
    readCompany &&
    request.method === "POST" &&
    (url.pathname === "/preview/read" || url.pathname === "/preview/search")
  ) {
    try {
      if (!request.headers["content-type"]?.startsWith("application/json"))
        throw new Error("Expected a JSON read request.");
      let bytes = 0;
      const chunks = [];
      for await (const chunk of request) {
        bytes += chunk.length;
        if (bytes > 1024 * 1024) throw new Error("Preview request is too large.");
        chunks.push(chunk);
      }
      const input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      const result =
        url.pathname === "/preview/search"
          ? await composerSearch(input)
          : await readCompany(input.name, input.arguments);
      json(response, 200, result);
    } catch (error) {
      json(response, 400, {
        isError: true,
        structuredContent: {
          ok: false,
          error: { message: error instanceof Error ? error.message : "Preview read failed." },
        },
      });
    }
    return;
  }
  if (request.method !== "GET" || url.pathname !== "/") {
    response.writeHead(404).end();
    return;
  }
  const theme = url.searchParams.get("theme") === "dark" ? "dark" : "light";
  const options = { hostContext: { theme } };
  const fixture = JSON.stringify({ payload: initial(), rows, options }).replaceAll("<", "\\u003c");
  const script = resultsPath
    ? `(${installLivePreviewHost.toString()})(${JSON.stringify({ theme })});`
    : `(${installCompanyHost.toString()})(${fixture});`;
  const html = CAMPAIGN_WORKSPACE_HTML.replace("</head>", `<script>${script}</script></head>`);
  response
    .writeHead(200, {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    })
    .end(html);
});
server.listen(0, "127.0.0.1", () => {
  console.log(`Native Companies preview: http://127.0.0.1:${server.address().port}/`);
  console.log(
    resultsPath
      ? "Chat search receipts update this view. Profile and page reads use the official agent client; workspace mutations and research spending are blocked."
      : "Disposable fixture data only; no account, database, writes or research credits.",
  );
});
let resultsWatcher;
let publishScheduled = false;
if (resultsPath)
  resultsWatcher = watch(dirname(resultsPath), (_, filename) => {
    if (ownedWrites) return;
    if (filename && filename.toString() !== basename(resultsPath)) return;
    if (publishScheduled) return;
    publishScheduled = true;
    setImmediate(() => {
      publishScheduled = false;
      try {
        const next = previewPayload(JSON.parse(readFileSync(resultsPath, "utf8")));
        publish(next);
      } catch {
        console.error(
          "Ignored an invalid or incomplete search receipt; retained the previous view.",
        );
      }
    });
  });
const shutdown = () => {
  resultsWatcher?.close();
  for (const response of events) response.end();
  server.close();
};
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, shutdown);
