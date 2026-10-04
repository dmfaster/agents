import assert from "node:assert/strict";
import test from "node:test";
import {
  createPreviewReader,
  previewPayload,
  isPreviewRequestAllowed,
} from "../tools/preview-workspace-host.mjs";
import { createComposerSearch, previewSearchUrl } from "../tools/search-workspace-preview.mjs";

test("live preview delegates typed company reads and blocks writes, research spending and unknown fields", async () => {
  const calls = [];
  const read = await createPreviewReader({
    async invoke(tool, input) {
      calls.push({ tool, input });
      return { ok: true };
    },
  });
  await read("companies_search", {
    filters: { countries: ["FI"], activeOnly: true },
    pageSize: 20,
  });
  await read("company_inspect", { country: "FI", businessId: "1234567-8" });
  assert.deepEqual(
    calls.map((call) => call.tool),
    ["companies.search", "company.inspect"],
  );
  for (const name of ["campaign_launch", "companies_list_prepare", "companies_evidence_start"])
    await assert.rejects(
      read(name, {}),
      /only company search, profile and saved evidence result reads/,
    );
  await assert.rejects(
    read("companies_search", { filters: { countries: ["FI"], invented: true } }),
  );
  assert.equal(calls.length, 2);
});

test("composer result receipts preserve original identities and reject nonexact or unrelated data", () => {
  const result = {
    tool: "companies.search",
    ok: true,
    data: {
      companies: [],
      total: 0,
      totalExact: true,
      filters: { countries: ["FI"], employeeMin: "10" },
      expectedRevision: "revision",
      querySignature: "query",
      page: 1,
      pageSize: 20,
      hasNextPage: false,
    },
  };
  const payload = previewPayload({ structuredContent: result });
  assert.strictEqual(payload.result, result);
  assert.deepEqual(payload.filters, result.data.filters);
  assert.throws(
    () => previewPayload({ ...result, data: { ...result.data, totalExact: false } }),
    /exact count/,
  );
  assert.throws(
    () => previewPayload({ ...result, data: { ...result.data, total: NaN } }),
    /exact count/,
  );
  assert.throws(() => previewPayload({ ...result, tool: "company.inspect" }), /companies.search/);
  assert.throws(
    () => previewPayload({ ...result, data: { ...result.data, expectedRevision: null } }),
    /identities/,
  );
});

test("live preview rejects foreign origins and rebinding hosts before any authenticated read", () => {
  const request = (method, host, origin) => ({ method, headers: { host, origin } });
  assert.equal(isPreviewRequestAllowed(request("GET", "127.0.0.1:1234"), 1234), true);
  assert.equal(
    isPreviewRequestAllowed(request("POST", "127.0.0.1:1234", "http://127.0.0.1:1234"), 1234),
    true,
  );
  assert.equal(
    isPreviewRequestAllowed(request("POST", "127.0.0.1:1234", "https://foreign.test"), 1234),
    false,
  );
  assert.equal(isPreviewRequestAllowed(request("POST", "127.0.0.1:1234"), 1234), false);
  assert.equal(isPreviewRequestAllowed(request("GET", "foreign.test:1234"), 1234), false);
});

test("reviewing against an older API retries only the optional list projection and remembers compatibility", async () => {
  const inputs: unknown[] = [];
  const read = await createPreviewReader({
    async invoke(_tool, input) {
      inputs.push(input);
      return "projection" in input
        ? { ok: false, error: { code: "invalid_input", message: 'Unrecognized key: "projection"' } }
        : { ok: true };
    },
  });
  const filters = { countries: ["FI"], industryCodes: ["CONSTRUCTION"], employeeMin: "10" };
  await read("companies_search", { filters, projection: "list", pageSize: 20 });
  await read("companies_search", { filters, projection: "list", pageSize: 20 });
  assert.equal(inputs.length, 3);
  assert.deepEqual(inputs[1], { filters, pageSize: 20 });
  assert.deepEqual(inputs[2], inputs[1]);
});

test("company search errors never drop criteria or retry unrelated validation failures", async () => {
  let calls = 0;
  const read = await createPreviewReader({
    async invoke() {
      calls++;
      return { ok: false, error: { code: "invalid_input", message: "unsupported industry" } };
    },
  });
  await read("companies_search", { filters: { countries: ["FI"] }, projection: "list" });
  assert.equal(calls, 1);
});

test("older API transport errors retry only the unsupported presentation field", async () => {
  const inputs: unknown[] = [];
  const read = await createPreviewReader({
    async invoke(_tool, input) {
      inputs.push(input);
      if ("projection" in input)
        throw Object.assign(new Error('Unrecognized key: "projection"'), { code: "invalid_input" });
      return { ok: true };
    },
  });
  const filters = { countries: ["FI"], industryCodes: ["CONSTRUCTION"] };
  await read("companies_search", { filters, projection: "list" });
  assert.deepEqual(inputs[1], { filters });
});

test("legacy generic transport validation retries once with all filters intact", async () => {
  const calls: unknown[] = [];
  const read = await createPreviewReader({
    async invoke(_tool, input) {
      calls.push(input);
      if ("projection" in input)
        throw Object.assign(new Error("The agent tool input is invalid."), {
          code: "invalid_request",
        });
      return { ok: true };
    },
  });
  const filters = { countries: ["FI"], industryCodes: ["CONSTRUCTION"], employeeMin: "10" };
  await read("companies_search", { filters, projection: "list", pageSize: 20 });
  assert.deepEqual(calls[1], { filters, pageSize: 20 });
});

test("composer searches publish exact official receipts immediately and ignore superseded responses", async () => {
  const resolvers: Array<(value: unknown) => void> = [];
  const published: unknown[] = [];
  const inputs: unknown[] = [];
  const search = createComposerSearch(
    (_name, input) => {
      inputs.push(input);
      return new Promise((resolve) => resolvers.push(resolve));
    },
    async (payload) => {
      published.push(payload);
    },
  );
  const first = search({ filters: { countries: ["FI"], industryCodes: ["CONSTRUCTION"] } });
  const second = search({ filters: { countries: ["FI"], employeeMin: "20" } });
  const result = (name: string) => ({
    structuredContent: {
      tool: "companies.search",
      ok: true,
      durationMs: 12,
      data: {
        companies: [{ country: "FI", businessId: "1234567-8", name }],
        total: 32711,
        totalExact: true,
        expectedRevision: "revision",
        querySignature: "query",
        filters: { countries: ["FI"] },
        page: 1,
        pageSize: 20,
        hasNextPage: true,
      },
    },
  });
  resolvers[1](result("Latest result"));
  assert.equal((await second).published, true);
  resolvers[0](result("Late old result"));
  assert.equal((await first).published, false);
  assert.equal(published.length, 1);
  assert.equal(published[0].result.data.companies[0].name, "Latest result");
  assert.equal(inputs[0].projection, "list");
});

test("the composer search command accepts only the intended loopback review server", () => {
  assert.equal(
    previewSearchUrl("http://127.0.0.1:58698/").href,
    "http://127.0.0.1:58698/preview/search",
  );
  for (const url of [
    "https://127.0.0.1:58698/",
    "http://localhost:58698/",
    "http://remote.test:58698/",
    "http://127.0.0.1/",
    "http://user:password@127.0.0.1:58698/",
    "http://127.0.0.1:58698/?token=value",
  ])
    assert.throws(() => previewSearchUrl(url));
});
