import { createServer } from "node:http";
import { CAMPAIGN_WORKSPACE_HTML } from "../src/campaign-workspace-html.ts";
import { installLivePreviewHost, isPreviewRequestAllowed } from "./preview-workspace-host.mjs";

const allowedReads = new Set(["companies_search", "company_inspect"]);
const blockedMessage =
  "This local candidate preview supports company search and profile reads only. It cannot change a workspace or run campaign actions.";

function offlinePayload(value) {
  const payload = structuredClone(value);
  const result = payload.result;
  validateSearchResult(result);
  payload.offlineCandidateIndex = {
    origin: "saved_local_index",
    totalKind: "indexed_candidates",
    isLiveMarketTotal: false,
  };
  if (result?.data && Number.isSafeInteger(result.data.total)) {
    result.data.totalScope = "offline_index_candidates";
    result.data.totalIsLiveMarketCount = false;
  }
  return payload;
}

function validateSearchResult(result) {
  if (result?.tool !== "companies.search" || result.ok !== true) return;
  const data = result.data;
  if (
    data?.totalExact !== true ||
    !Number.isSafeInteger(data.total) ||
    data.total < 0 ||
    !Array.isArray(data.companies) ||
    data.companies.length > 100 ||
    typeof data.expectedRevision !== "string" ||
    !data.expectedRevision ||
    typeof data.querySignature !== "string" ||
    !data.querySignature
  )
    throw new Error("Offline candidate results need an exact indexed count and query identity.");
}

function errorResult(message) {
  return {
    isError: true,
    structuredContent: {
      ok: false,
      error: { message },
    },
  };
}

function localizedBanner(locale) {
  return /^fi(?:-|$)/iu.test(locale)
    ? "Paikallinen ehdokasindeksi · Ei julkaistu"
    : "Local candidate index · Not published";
}

function pageHtml(theme, locale) {
  const script = `(${installLivePreviewHost.toString()})(${JSON.stringify({ theme })});`;
  const localizedHtml = ["fi", "fi-FI", "en", "en-US"].includes(locale)
    ? CAMPAIGN_WORKSPACE_HTML.replace("<html>", `<html lang="${locale}">`)
    : CAMPAIGN_WORKSPACE_HTML;
  const banner = `<div role="status" aria-label="Offline candidate data" style="position:sticky;top:0;z-index:9999;padding:5px 12px;text-align:center;background:#f4f4f5;color:#52525b;border-bottom:1px solid #e4e4e7;font:12px system-ui">${localizedBanner(locale)}</div>`;
  return localizedHtml
    .replace("</head>", `<script>${script}</script></head>`)
    .replace("<body>", `<body>${banner}`);
}

/**
 * Creates a loopback-only preview backed by a caller-owned offline index.
 * `initialPayload` and search reads use the workspace result envelope. `read`
 * receives only companies_search/company_inspect and the original typed args.
 */
export function createOfflineCompanyPreview({ read, initialPayload }) {
  if (typeof read !== "function") throw new TypeError("read must be a function");
  if (!initialPayload || typeof initialPayload !== "object")
    throw new TypeError("initialPayload must be a workspace-compatible payload");

  let current = offlinePayload(initialPayload);
  const events = new Set();
  const server = createServer(async (request, response) => {
    const port = server.address()?.port;
    if (!port || !isPreviewRequestAllowed(request, port)) {
      response.writeHead(403).end();
      return;
    }
    const url = new URL(request.url, "http://127.0.0.1");
    if (request.method === "GET" && url.pathname === "/preview/state") {
      response.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
      response.end(JSON.stringify(current));
      return;
    }
    if (request.method === "GET" && url.pathname === "/preview/events") {
      response.writeHead(200, {
        "content-type": "text/event-stream",
        "cache-control": "no-store",
        connection: "keep-alive",
      });
      events.add(response);
      response.write(`data: ${JSON.stringify(current)}\n\n`);
      request.on("close", () => events.delete(response));
      return;
    }
    if (request.method === "GET" && url.pathname === "/") {
      const locale = ["fi", "fi-FI", "en", "en-US"].includes(url.searchParams.get("locale"))
        ? url.searchParams.get("locale")
        : "en";
      const theme = url.searchParams.get("theme") === "dark" ? "dark" : "light";
      response.writeHead(200, {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      });
      response.end(pageHtml(theme, locale));
      return;
    }
    if (request.method !== "POST" || url.pathname !== "/preview/read") {
      response.writeHead(404).end();
      return;
    }
    try {
      if (!request.headers["content-type"]?.startsWith("application/json"))
        throw new Error("Expected a JSON company read request.");
      let bytes = 0;
      const chunks = [];
      for await (const chunk of request) {
        bytes += chunk.length;
        if (bytes > 1024 * 1024) throw new Error("Preview request is too large.");
        chunks.push(chunk);
      }
      const input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      if (!allowedReads.has(input?.name)) {
        response.writeHead(200, { "content-type": "application/json" });
        response.end(JSON.stringify(errorResult(blockedMessage)));
        return;
      }
      if (!input.arguments || typeof input.arguments !== "object" || Array.isArray(input.arguments))
        throw new Error("Company reads need typed arguments.");
      const result = await read(input.name, input.arguments);
      if (input.name === "companies_search") validateSearchResult(result?.structuredContent);
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify(result));
    } catch (error) {
      response.writeHead(400, { "content-type": "application/json" });
      response.end(
        JSON.stringify(
          errorResult(error instanceof Error ? error.message : "Company read failed."),
        ),
      );
    }
  });

  return {
    server,
    listen(port = 0) {
      return new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(port, "127.0.0.1", () => {
          server.off("error", reject);
          resolve(`http://127.0.0.1:${server.address().port}/`);
        });
      });
    },
    close() {
      return new Promise((resolve, reject) => {
        for (const event of events) event.end();
        events.clear();
        server.close((error) => (error ? reject(error) : resolve()));
      });
    },
  };
}
