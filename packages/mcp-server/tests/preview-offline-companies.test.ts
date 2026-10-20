import assert from "node:assert/strict";
import { request } from "node:http";
import { test } from "node:test";
import { createOfflineCompanyPreview } from "../tools/preview-offline-companies.mjs";

const initialPayload = {
  version: 1,
  view: "dmfaster.workspace",
  section: "companies",
  result: {
    tool: "companies.search",
    ok: true,
    data: {
      total: 2,
      totalExact: true,
      expectedRevision: "initial-revision",
      querySignature: "initial-query",
      companies: [{ businessId: "offline-1", name: "Local Company" }],
      filters: { countries: ["FI"] },
    },
  },
};

test("offline company preview exposes indexed count and Finnish disclosure", async (t) => {
  const preview = createOfflineCompanyPreview({ read: async () => ({}), initialPayload });
  const base = await preview.listen();
  t.after(() => preview.close());

  const state = await fetch(`${base}preview/state`).then((response) => response.json());
  assert.equal(state.offlineCandidateIndex.totalKind, "indexed_candidates");
  assert.equal(state.offlineCandidateIndex.isLiveMarketTotal, false);
  assert.equal(state.result.data.totalScope, "offline_index_candidates");
  const html = await fetch(`${base}?locale=fi-FI`).then((response) => response.text());
  assert.match(html, /Paikallinen ehdokasindeksi · Ei julkaistu/u);
  assert.doesNotMatch(html, /Demo data/u);
  assert.equal((await fetch(`${base}demo`)).status, 404);
});

test("offline preview forwards only company reads and rejects writes without calling read", async (t) => {
  const calls: Array<{ name: string; args: unknown }> = [];
  const preview = createOfflineCompanyPreview({
    initialPayload,
    read: async (name, args) => {
      calls.push({ name, args });
      return {
        structuredContent: {
          ok: true,
          tool: name === "companies_search" ? "companies.search" : name,
          data: {
            companies: [],
            total: 0,
            totalExact: true,
            expectedRevision: "local-revision",
            querySignature: "local-query",
          },
        },
      };
    },
  });
  const base = await preview.listen();
  t.after(() => preview.close());
  const origin = new URL(base).origin;
  const before = await fetch(`${base}preview/state`).then((response) => response.json());

  const page = await fetch(`${base}preview/read`, {
    method: "POST",
    headers: { "content-type": "application/json", origin },
    body: JSON.stringify({ name: "companies_search", arguments: { page: 2, pageSize: 20 } }),
  });
  assert.equal(page.status, 200);
  assert.deepEqual(calls, [{ name: "companies_search", args: { page: 2, pageSize: 20 } }]);
  assert.deepEqual(await fetch(`${base}preview/state`).then((response) => response.json()), before);
  await fetch(`${base}preview/read`, {
    method: "POST",
    headers: { "content-type": "application/json", origin },
    body: JSON.stringify({ name: "companies_search", arguments: { page: 3, pageSize: 20 } }),
  });
  assert.equal(calls.length, 2);
  assert.deepEqual(await fetch(`${base}preview/state`).then((response) => response.json()), before);

  const write = await fetch(`${base}preview/read`, {
    method: "POST",
    headers: { "content-type": "application/json", origin },
    body: JSON.stringify({ name: "campaign_draft_prepare", arguments: {} }),
  }).then((response) => response.json());
  assert.equal(write.isError, true);
  assert.match(write.structuredContent.error.message, /cannot change a workspace/u);
  assert.equal(calls.length, 2);

  const profile = await fetch(`${base}preview/read`, {
    method: "POST",
    headers: { "content-type": "application/json", origin },
    body: JSON.stringify({ name: "company_inspect", arguments: { businessId: "offline-1" } }),
  });
  assert.equal(profile.status, 200);
  assert.equal(calls.length, 3);
});

test("offline preview enforces loopback host and same-origin POST", async (t) => {
  const preview = createOfflineCompanyPreview({ read: async () => ({}), initialPayload });
  const base = await preview.listen();
  t.after(() => preview.close());
  const endpoint = new URL("preview/read", base);

  const foreignOrigin = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://evil.test" },
    body: JSON.stringify({ name: "companies_search", arguments: {} }),
  });
  assert.equal(foreignOrigin.status, 403);

  const foreignHost = await new Promise<number>((resolve, reject) => {
    const outgoing = request(
      endpoint,
      { method: "GET", headers: { host: "evil.test" } },
      (response) => {
        response.resume();
        response.on("end", () => resolve(response.statusCode));
      },
    );
    outgoing.on("error", reject);
    outgoing.end();
  });
  assert.equal(foreignHost, 403);
});
