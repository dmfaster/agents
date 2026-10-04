import assert from "node:assert/strict";
import { before, after, test } from "node:test";
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { CAMPAIGN_WORKSPACE_HTML } from "../src/campaign-workspace-html.ts";
import { initial, evidenceInitial, installCompanyHost, rows } from "./companies-fixture.mjs";

const require = createRequire(new URL("../../../site/package.json", import.meta.url));
const { chromium, expect } = require("@playwright/test");
let browser;
before(async () => {
  browser = await chromium.launch({ headless: true });
});
after(async () => {
  await browser?.close();
});
async function open(t, options = {}, payload = initial(), fixtureRows = rows) {
  const page = await browser.newPage({ viewport: { width: 1040, height: 850 } });
  t.after(() => page.close());
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  t.after(() => assert.deepEqual(errors, []));
  await page.addInitScript(installCompanyHost, { payload, rows: fixtureRows, options });
  await page.route("https://dmfaster-ui.test/", (route) =>
    route.fulfill({ contentType: "text/html", body: CAMPAIGN_WORKSPACE_HTML }),
  );
  await page.goto("https://dmfaster-ui.test/");
  await expect(page.getByRole("heading", { name: "Companies", exact: true })).toBeVisible();
  return page;
}
const calls = (page) => page.evaluate(() => window.__calls);
const artifacts = new URL("../../../outputs/native-agent-prospecting/", import.meta.url);

for (const [country, businessId, visible] of [
  ["FI", "1234567-8", true],
  ["US", "opaqueRecordKey", false],
  ["GB", "1234567-8", false],
  ["FI", "opaqueRecordKey", false],
]) {
  test(`company profile registration number presentation: ${country}/${visible}`, async (t) => {
    const fixture = [{ ...rows[0], country, businessId, industryLabel: "", websiteUrl: "" }];
    const payload = initial({ countries: [country], activeOnly: true });
    payload.result.data.companies = fixture;
    const page = await open(t, {}, payload, fixture);
    await expect(page.locator(".company-row-link")).not.toContainText("opaqueRecordKey");
    await page.getByRole("button", { name: /Nordic Studio/ }).click();
    await expect(page.getByText("Nordic Studio helps teams", { exact: false })).toBeVisible();
    const profile = page.getByRole("region", { name: "Company overview" });
    await expect(profile.getByText("Finnish business ID", { exact: true })).toHaveCount(
      visible ? 1 : 0,
    );
    await expect(profile.getByText(businessId, { exact: true })).toHaveCount(visible ? 1 : 0);
  });
}

test("initial companies render without repeated reads; local navigation stays immediate with a held profile", async (t) => {
  const page = await open(t, { holdProfiles: true });
  await expect(page.getByText("41 companies", { exact: true })).toBeVisible();
  assert.deepEqual(await calls(page), []);
  await page.getByRole("button", { name: /Nordic Studio/ }).click();
  await expect(page.getByRole("heading", { name: "Nordic Studio", exact: true })).toBeVisible();
  await expect(page.getByText("Loading full profile…", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Close company details" })).toBeEnabled();
  await page.getByRole("button", { name: "Close company details" }).click();
  await expect(page.getByRole("button", { name: "Refresh", exact: true })).toBeEnabled();
  assert.equal((await calls(page)).length, 1);
  await page.getByRole("button", { name: /Helsinki Craft/ }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () => window.__pending.filter((call) => call.name === "company_inspect").length,
      ),
    )
    .toBe(2);
  await page.evaluate(() => window.__release("company_inspect", 0));
  await expect(page.getByRole("heading", { name: "Helsinki Craft", exact: true })).toBeVisible();
  await expect(page.getByText("Loading full profile…", { exact: true })).toBeVisible();
  await page.evaluate(() => window.__release("company_inspect", 0));
  await expect(page.getByText("Helsinki Craft helps teams", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Close company details" }).click();
  await page.getByRole("button", { name: /Helsinki Craft/ }).click();
  await expect(page.getByText("Helsinki Craft helps teams", { exact: false })).toBeVisible();
  assert.equal(
    (await calls(page)).length,
    2,
    "reopening a completed profile must not repeat the read",
  );
});

test("chat search results replace the view without editable controls or stale page responses", async (t) => {
  const page = await open(t, { holdSearch: true });
  await expect(page.getByRole("textbox", { name: "Search companies" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Filters", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(page.getByText("Counting matches…", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Use this search in chat" })).toBeDisabled();
  await expect
    .poll(async () => (await calls(page)).filter((call) => call.name === "companies_search").length)
    .toBe(1);
  const next = initial({ countries: ["FI"], activeOnly: true, q: "Helsinki" });
  Object.assign(next.result.data, {
    companies: [rows[1]],
    total: 1,
    hasNextPage: false,
    nextCursor: null,
    querySignature: "query:Helsinki",
  });
  await page.evaluate(
    (payload) =>
      window.postMessage(
        {
          jsonrpc: "2.0",
          method: "ui/notifications/tool-result",
          params: { structuredContent: payload },
        },
        "*",
      ),
    next,
  );
  await expect(page.getByText("1 company", { exact: true })).toBeVisible();
  await page.evaluate(() => window.__release("companies_search", 0));
  await expect(page.getByRole("button", { name: /Helsinki Craft/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Nordic Studio/ })).toHaveCount(0);
  await expect(page.getByLabel("Search criteria")).toContainText("Helsinki");
  assert.equal((await calls(page)).length, 1, "receiving a chat result must not repeat its search");
});

test("a new chat search closes the old drawer and fences an unfinished profile", async (t) => {
  const page = await open(t, { holdProfiles: true });
  await page.getByRole("checkbox", { name: "Select Nordic Studio", exact: true }).check();
  await page.getByRole("button", { name: /Nordic Studio/ }).click();
  await expect.poll(async () => (await calls(page)).length).toBe(1);
  const next = initial({ countries: ["FI"], activeOnly: true, q: "Helsinki" });
  Object.assign(next.result.data, { companies: [rows[1]], total: 1, hasNextPage: false });
  await page.evaluate(
    (payload) =>
      window.postMessage(
        {
          jsonrpc: "2.0",
          method: "ui/notifications/tool-result",
          params: { structuredContent: payload },
        },
        "*",
      ),
    next,
  );
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByText("1 company", { exact: true })).toBeVisible();
  await page.evaluate(() => window.__release("company_inspect"));
  await expect(page.getByRole("button", { name: /Helsinki Craft/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Nordic Studio/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Use this search in chat" })).toBeVisible();
  assert.equal((await calls(page)).length, 1);
});

test("stable pagination echoes both identities and returning to the first page reuses its read", async (t) => {
  const page = await open(t);
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(page.getByRole("button", { name: /Last company/ })).toBeVisible();
  assert.deepEqual(await calls(page), [
    {
      name: "companies_search",
      arguments: {
        filters: { countries: ["FI"], activeOnly: true },
        pageSize: 3,
        page: 2,
        cursor: "opaque-next-company",
        projection: "list",
        expectedRevision: "FI:revision-1",
        querySignature: "query-fi-v1",
      },
    },
  ]);
  await page.getByRole("button", { name: "First page" }).click();
  await expect(page.getByRole("button", { name: /Nordic Studio/ })).toBeVisible();
  assert.equal((await calls(page)).length, 1);
});

test("numbered API pages without an opaque cursor retain both search identities", async (t) => {
  const payload = initial();
  delete payload.result.data.nextCursor;
  const page = await open(t, {}, payload);
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(page.getByRole("button", { name: /Last company/ })).toBeVisible();
  assert.deepEqual(await calls(page), [
    {
      name: "companies_search",
      arguments: {
        filters: { countries: ["FI"], activeOnly: true },
        pageSize: 3,
        page: 2,
        expectedRevision: "FI:revision-1",
        projection: "list",
        querySignature: "query-fi-v1",
      },
    },
  ]);
});

test("unavailable exact counts and changed snapshots block total-dependent actions", async (t) => {
  const page = await open(t, { approximate: true });
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await expect(page.getByText("Exact count unavailable", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Use this search in chat" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Next page" })).toBeDisabled();
  await expect(page.getByText("41 companies", { exact: true })).toHaveCount(0);
  const changed = await open(t, { changedRevision: true });
  await changed.getByRole("button", { name: "Next page" }).click();
  await expect(changed.getByRole("alert")).toContainText("inventory changed");
});

test("composer criteria stay read-only and selected rows share the full search context without writes", async (t) => {
  const filters = {
    countries: ["FI", "SE"],
    activeOnly: true,
    industryCodeSelections: [{ classification: "TOL", version: "2025", codes: ["62010"] }],
    fundingFromYear: "2024",
  };
  const page = await open(t, {}, initial(filters));
  await expect(page.getByLabel("Search criteria")).toContainText("FI · SE");
  await expect(page.getByLabel("Search criteria").getByRole("button")).toHaveCount(0);
  await expect(page.getByRole("textbox")).toHaveCount(0);
  await expect(page.getByRole("combobox")).toHaveCount(0);
  await page.getByRole("checkbox", { name: "Select Nordic Studio", exact: true }).check();
  await page.getByRole("button", { name: "Discuss selected (1)", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Added to chat context");
  const contexts = await page.evaluate(() => window.__contexts);
  assert.equal(contexts[0].structuredContent.total, 41);
  assert.equal(contexts[0].structuredContent.totalExact, true);
  assert.equal(contexts[0].structuredContent.selectedCompanies[0].businessId, "demo-1");
  assert.deepEqual(contexts[0].structuredContent.filters, filters);
  assert.match(contexts[0].content[0].text, /not authorization to save, spend research credits/);
  assert.deepEqual(await calls(page), []);
});

test("switching sections preserves the company search and filters without another read", async (t) => {
  const page = await open(t);
  await page.getByRole("button", { name: "Campaigns", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Campaigns", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Companies", exact: true }).click();
  await expect(page.getByText("41 companies", { exact: true })).toBeVisible();
  assert.deepEqual(
    (await calls(page)).map((call) => call.name),
    ["campaigns_list"],
  );
});

test("denied initial searches retain their requested market and criteria for retry", async (t) => {
  const filters = { countries: ["SE"], activeOnly: true, employeeMin: "10" };
  const page = await open(
    t,
    {},
    {
      version: 1,
      view: "dmfaster.workspace",
      section: "companies",
      filters,
      result: { ok: false, error: { message: "Company access denied" } },
    },
  );
  await expect(page.getByRole("alert")).toContainText("Company access denied");
  assert.deepEqual(await calls(page), []);
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await expect(page.getByText("41 companies", { exact: true })).toBeVisible();
  assert.deepEqual((await calls(page))[0].arguments.filters, filters);
});

test("company websites use the host link bridge inside a native sandbox", async (t) => {
  const page = await open(t, { supportLinks: true });
  await page.getByRole("button", { name: /Nordic Studio/ }).click();
  await expect(page.getByRole("heading", { name: "Nordic Studio", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "nordic.example.test", exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.__links.length)).toBe(1);
  assert.deepEqual(await page.evaluate(() => window.__links), [
    { url: "https://nordic.example.test/" },
  ]);
  assert.deepEqual(
    (await calls(page)).map((call) => call.name),
    ["company_inspect"],
  );
});

test("host theme, compact layouts, focus and immediate profile paint", async (t) => {
  const timings = [];
  for (const theme of ["light", "dark"]) {
    const page = await open(t, { holdProfiles: true, hostContext: { theme } });
    mkdirSync(artifacts, { recursive: true });
    await page.screenshot({
      path: new URL(`companies-${theme}-desktop.png`, artifacts).pathname,
      fullPage: true,
    });
    await page.setViewportSize({ width: 444, height: 780 });
    await page.screenshot({
      path: new URL(`companies-${theme}-panel.png`, artifacts).pathname,
      fullPage: true,
    });
    await page.setViewportSize({ width: 375, height: 740 });
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true,
    );
    await expect(page.getByRole("textbox", { name: "Search companies" })).toHaveCount(0);
    await page.getByRole("button", { name: /Nordic Studio/ }).focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    assert.equal(
      await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle),
      "solid",
    );
    const ms = await page.evaluate(async () => {
      const start = performance.now();
      document.querySelector(".company-row-link").click();
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (document.querySelector(".company-drawer h2").textContent !== "Nordic Studio")
        throw new Error("Profile did not paint immediately");
      return performance.now() - start;
    });
    assert.ok(ms < 200, `local profile paint ${ms}ms exceeded 200ms`);
    timings.push({ theme, localProfilePaintMs: ms, fullProfileHeld: true });
    await page.screenshot({
      path: new URL(`profile-${theme}-summary.png`, artifacts).pathname,
      fullPage: true,
      animations: "disabled",
    });
    await expect
      .poll(
        async () => (await calls(page)).filter((call) => call.name === "company_inspect").length,
      )
      .toBe(1);
    await page.evaluate(() => window.__release("company_inspect"));
    await expect(page.getByText("Nordic Studio helps teams", { exact: false })).toBeVisible();
    await page.screenshot({
      path: new URL(`profile-${theme}-complete.png`, artifacts).pathname,
      fullPage: true,
      animations: "disabled",
    });
  }
  writeFileSync(
    new URL("interaction-timings.json", artifacts),
    JSON.stringify(timings, null, 2) + "\n",
  );
});

test("compact logo rows keep selection and filters while a modal drawer traps focus and closes", async (t) => {
  const page = await open(t, { holdProfiles: true });
  await page.route("https://www.google.com/s2/favicons?**", (route) =>
    route.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" rx="6" fill="#2563eb"/></svg>',
    }),
  );
  await page.reload();
  const row = page.locator(".company-table tbody tr").first();
  const image = row.locator(".company-logo img");
  await expect(image).toHaveAttribute("src", /domain_url=https%3A%2F%2Fnordic\.example\.test/);
  await expect.poll(() => image.evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
  assert.ok((await row.boundingBox()).height <= 52, "desktop rows should stay compact");
  await page.getByRole("checkbox", { name: "Select Nordic Studio", exact: true }).check();
  await page.getByRole("button", { name: /Nordic Studio/ }).click();
  const drawer = page.getByRole("dialog", { name: "Company details" });
  await expect(drawer).toBeVisible();
  assert.equal(await page.locator(".company-table tbody tr").count(), 3);
  assert.equal(await drawer.evaluate((dialog) => dialog.contains(document.activeElement)), true);
  await page.keyboard.press("Shift+Tab");
  await expect(drawer.getByRole("button", { name: "Use this company in chat" })).toBeFocused();
  for (let index = 0; index < 8; index += 1) {
    await page.keyboard.press("Tab");
    assert.equal(await drawer.evaluate((dialog) => dialog.contains(document.activeElement)), true);
  }
  await page.keyboard.press("Escape");
  await expect(drawer).toHaveCount(0);
  await expect(
    page.getByRole("checkbox", { name: "Select Nordic Studio", exact: true }),
  ).toBeChecked();
  await expect(page.getByRole("button", { name: /Nordic Studio/ })).toBeFocused();
  await expect(page.getByText("41 companies", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Helsinki Craft/ }).click();
  await expect.poll(async () => (await calls(page)).length).toBe(2);
  await page.mouse.click(20, 250);
  await expect(drawer).toHaveCount(0);
  assert.deepEqual(
    (await calls(page)).map((call) => call.name),
    ["company_inspect", "company_inspect"],
  );
});

test("missing or failed logo images use initials without exposing arbitrary image hosts", async (t) => {
  const fixture = rows.map((row, index) => ({
    ...row,
    logoUrl: "https://untrusted-image.example.test/tracker",
    ...(index === 1 ? { websiteUrl: "javascript:alert(1)" } : {}),
  }));
  const payload = initial();
  payload.result.data.companies = fixture;
  const page = await open(t, {}, payload, fixture);
  await page.route("https://www.google.com/s2/favicons?**", (route) => route.abort());
  await page.reload();
  await expect(page.locator(".company-logo img")).toHaveCount(0);
  await expect(page.locator(".company-logo").first()).toHaveText("NS");
  assert.equal(await page.locator('img[src*="untrusted-image"]').count(), 0);
});

test("saved evidence renders accepted and unresolved assessments without an inventory read or market total", async (t) => {
  const page = await open(t, {}, evidenceInitial());
  await expect(page.getByText("1 accepted match so far", { exact: true })).toBeVisible();
  await expect(page.getByText(/Market total unavailable/)).toBeVisible();
  await expect(page.getByRole("status")).toContainText(
    "2 of 10 eligible companies checked · 1 unresolved",
  );
  await expect(page.getByText("Accepted match", { exact: true })).toBeVisible();
  await expect(page.getByText("Needs review", { exact: true })).toBeVisible();
  await expect(page.getByRole("textbox")).toHaveCount(0);
  assert.deepEqual(await calls(page), []);
  await page.getByRole("button", { name: "Use this search in chat" }).click();
  await expect.poll(() => page.evaluate(() => window.__contexts.length)).toBe(1);
  const context = await page.evaluate(() => window.__contexts[0].structuredContent);
  assert.equal(context.total, null);
  assert.equal(context.totalExact, false);
  assert.equal(context.authorizesMutations, false);
  assert.deepEqual(context.criteria, evidenceInitial().result.data.appliedCriteria);
  assert.equal(context.progress.confirmedMatches, 1);
});

test("saved evidence drawer shows literal original quotes immediately and shares bounded profile reads", async (t) => {
  const payload = evidenceInitial();
  const original =
    '<img src=x onerror="window.__injected=true"> Tarjoamme yrityksille omaa ohjelmaa.';
  payload.result.data.companies[0].passages[0].text = original;
  payload.result.data.companies[0].criteria[0].evidence[0].text = original;
  const page = await open(t, { holdProfiles: true, supportLinks: true }, payload);
  await page.getByRole("button", { name: /Nordic Studio/ }).click();
  const drawer = page.getByRole("dialog", { name: "Company details" });
  await expect(drawer.getByRole("heading", { name: "Saved website evidence" })).toBeVisible();
  await expect(drawer.locator("blockquote")).toHaveText(original);
  await expect(drawer.getByText("Loading full profile…", { exact: true })).toBeVisible();
  assert.equal(await page.evaluate(() => window.__injected), undefined);
  await drawer.getByRole("link", { name: "Source page" }).click();
  await expect.poll(() => page.evaluate(() => window.__links.length)).toBe(1);
  assert.deepEqual(await page.evaluate(() => window.__links), [
    { url: "https://nordic.example.test/tuote" },
  ]);
  await drawer.getByRole("button", { name: "Close company details" }).click();
  await page.getByRole("button", { name: /Nordic Studio/ }).click();
  assert.equal((await calls(page)).length, 1, "a pending profile read is shared on reopening");
  await page.evaluate(() => window.__release("company_inspect"));
  await expect(drawer.getByText("Nordic Studio helps teams", { exact: false })).toBeVisible();
  await drawer.getByRole("button", { name: "Use this company in chat" }).click();
  await expect.poll(() => page.evaluate(() => window.__contexts.length)).toBe(1);
  const selection = await page.evaluate(() => window.__contexts[0].structuredContent);
  assert.equal(selection.companies[0].criteria[0].evidence[0].text, original);
  assert.equal(selection.profile.profile.name, "Nordic Studio");
  assert.equal(selection.total, null);
  await drawer.getByRole("button", { name: "Close company details" }).click();
  await page.getByRole("button", { name: /Nordic Studio/ }).click();
  assert.equal((await calls(page)).length, 1, "a settled profile is reused within its view TTL");
  await drawer.getByRole("button", { name: "Refresh profile" }).click();
  await expect.poll(async () => (await calls(page)).length).toBe(2);
});

test("saved evidence paging keeps the pinned run and can wait for later matches without advancing a scan", async (t) => {
  const payload = evidenceInitial();
  const next = structuredClone(payload.result.data);
  Object.assign(next, {
    companies: [],
    hasNextPage: false,
    awaitingMoreResults: true,
    nextCursor: "sequence:2",
  });
  const page = await open(t, { evidenceNext: next }, payload);
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(page.getByRole("heading", { name: "Waiting for matching evidence" })).toBeVisible();
  await page.getByRole("button", { name: "Check for more results" }).click();
  await expect.poll(async () => (await calls(page)).length).toBe(2);
  const reads = await calls(page);
  assert.equal(reads.length, 2);
  for (const read of reads)
    assert.deepEqual(read, {
      name: "companies_evidence_results",
      arguments: {
        runId: payload.result.data.runId,
        expectedRevision: payload.result.data.expectedRevision,
        view: "all",
        pageSize: 20,
        cursor: "sequence:2",
      },
    });
  await expect(page.getByText(/Market total unavailable/)).toBeVisible();
});

test("new chat evidence results fence delayed page and profile responses", async (t) => {
  const payload = evidenceInitial();
  const page = await open(t, { holdProfiles: true, holdEvidence: true }, payload);
  await page.getByRole("button", { name: /Nordic Studio/ }).click();
  await expect.poll(async () => (await calls(page)).length).toBe(1);
  await page.getByRole("button", { name: "Close company details" }).click();
  await page.getByRole("button", { name: "Next page" }).click();
  await expect.poll(async () => (await calls(page)).length).toBe(2);
  const next = evidenceInitial();
  next.result.data.runId = "00000000-0000-4000-8000-000000000002";
  next.result.data.query = "Construction suppliers";
  next.result.data.querySignature = "d".repeat(64);
  next.result.data.companies = [next.result.data.companies[1]];
  next.result.data.hasNextPage = false;
  await page.evaluate(
    (payload) =>
      window.postMessage(
        {
          jsonrpc: "2.0",
          method: "ui/notifications/tool-result",
          params: { structuredContent: payload },
        },
        "*",
      ),
    next,
  );
  await expect(page.getByLabel("Search criteria")).toContainText("Construction suppliers");
  await page.evaluate(() => {
    window.__release("companies_evidence_results");
    window.__release("company_inspect");
  });
  await expect(page.getByRole("button", { name: /Nordic Studio/ })).toHaveCount(0);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: /Helsinki Craft/ }).click();
  await expect.poll(async () => (await calls(page)).length).toBe(3);
  await page.evaluate(() => window.__release("company_inspect"));
  await expect(page.getByText("Helsinki Craft helps teams", { exact: false })).toBeVisible();
});

test("changed evidence revisions and invalid exact progress block result actions", async (t) => {
  const page = await open(t, { changedEvidenceRevision: true }, evidenceInitial());
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(page.getByRole("alert")).toContainText("evidence run changed");
  await expect(page.getByRole("button", { name: "Use this search in chat" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Next page" })).toBeDisabled();
  const malformed = evidenceInitial();
  malformed.result.data.progress.confirmedMatches = -1;
  const invalid = await open(t, {}, malformed);
  await expect(invalid.getByRole("alert")).toContainText(
    "exact evidence processing progress is unavailable",
  );
  await expect(invalid.getByRole("table")).toHaveCount(0);
  assert.deepEqual(await calls(invalid), []);
});
