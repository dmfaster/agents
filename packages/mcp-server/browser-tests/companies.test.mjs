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
  const page = await browser.newPage({
    viewport: { width: 1040, height: 850 },
    locale: options.browserLocale || "en-US",
  });
  t.after(() => page.close());
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  t.after(() => assert.deepEqual(errors, []));
  await page.addInitScript(installCompanyHost, { payload, rows: fixtureRows, options });
  await page.route("https://dmfaster-ui.test/", (route) =>
    route.fulfill({ contentType: "text/html", body: CAMPAIGN_WORKSPACE_HTML }),
  );
  await page.goto("https://dmfaster-ui.test/");
  await expect(page.locator(".company-workflow")).toBeVisible();
  return page;
}
const calls = (page) => page.evaluate(() => window.__calls);
const workspaceContext = (page) =>
  page.evaluate(
    () =>
      window.__contexts
        .filter((c) => c.structuredContent.type === "dmfaster.workspace_context")
        .at(-1)?.structuredContent,
  );

test("automatic context shares exact query-wide selection without extra reads or chat turns", async (t) => {
  const payload = initial();
  payload.result.data.total = 100000;
  const page = await open(t, {}, payload);
  await expect
    .poll(async () => (await workspaceContext(page))?.audience?.selectedCount)
    .toBe(100000);
  const context = await workspaceContext(page);
  assert.equal(context.audience.mode, "all_matching_except_exclusions");
  assert.equal(context.audience.selectedCompanies, undefined);
  assert.equal(context.audience.visibleCompanies.length, 3);
  assert.equal(context.audience.expectedRevision, payload.result.data.expectedRevision);
  assert.equal(context.audience.totalExact, true);
  await page.getByRole("checkbox", { name: "Select Nordic Studio", exact: true }).uncheck();
  await expect
    .poll(async () => (await workspaceContext(page))?.audience?.selectedCount)
    .toBe(99999);
  assert.equal((await workspaceContext(page)).audience.excludedCompanyKeys.length, 1);
  assert.deepEqual(await calls(page), []);
  assert.deepEqual(await page.evaluate(() => window.__messages), []);
});

test("automatic context preserves evidence uncertainty and focused company identity", async (t) => {
  const page = await open(t, {}, evidenceInitial());
  await expect.poll(async () => (await workspaceContext(page))?.audience?.selectedCount).toBe(1);
  const context = await workspaceContext(page);
  assert.equal(context.audience.total, null);
  assert.equal(context.audience.totalExact, false);
  assert.equal(context.audience.mode, "confirmed_matches_except_exclusions");
  assert.equal(context.audience.progress.unresolvedCompanies, 1);
  await page.getByRole("button", { name: /Nordic Studio/ }).click();
  await expect
    .poll(async () => (await workspaceContext(page))?.focusedCompany?.profileStatus)
    .toBe("loaded");
  assert.equal((await workspaceContext(page)).focusedCompany.businessId, "demo-1");
  await page.getByRole("button", { name: "Close company details" }).click();
  await expect
    .poll(async () => Boolean((await workspaceContext(page))?.focusedCompany))
    .toBe(false);
  assert.deepEqual(
    (await calls(page)).map((c) => c.name),
    ["company_inspect"],
  );
});

test("automatic context honors host dismissal until the user changes selection", async (t) => {
  const page = await open(t);
  await expect.poll(async () => (await workspaceContext(page))?.audience?.selectedCount).toBe(41);
  const count = await page.evaluate(() => window.__contexts.length);
  await page.evaluate(() => {
    window.postMessage(
      {
        jsonrpc: "2.0",
        method: "ui/notifications/host-context-changed",
        params: { "openai/modelContext": null },
      },
      "*",
    );
    window.postMessage(
      {
        jsonrpc: "2.0",
        method: "ui/notifications/host-context-changed",
        params: { theme: "dark" },
      },
      "*",
    );
  });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.waitForTimeout(350);
  assert.equal(await page.evaluate(() => window.__contexts.length), count);
  await page.getByRole("checkbox", { name: "Select Nordic Studio", exact: true }).uncheck();
  await expect.poll(async () => (await workspaceContext(page))?.audience?.selectedCount).toBe(40);
  assert.deepEqual(await page.evaluate(() => window.__messages), []);
});

test("automatic context never falls back to sending a message on unsupported hosts", async (t) => {
  const page = await open(t, { noModelContext: true });
  await selectOnly(page, "Nordic Studio");
  await page.waitForTimeout(350);
  assert.deepEqual(await page.evaluate(() => window.__contexts), []);
  assert.deepEqual(await page.evaluate(() => window.__messages), []);
  assert.deepEqual(await calls(page), []);
});

test("automatic context includes edited copy and channels without creating a campaign", async (t) => {
  const page = await open(t, { outreach: true });
  await selectOnly(page, "Nordic Studio");
  await page.getByRole("button", { name: /Message$/ }).click();
  await page.getByLabel("Message", { exact: true }).fill("Hello from the selected audience");
  await page.getByRole("checkbox", { name: "Facebook", exact: true }).check();
  await expect
    .poll(async () => (await workspaceContext(page))?.outreach?.message)
    .toBe("Hello from the selected audience");
  const context = await workspaceContext(page);
  assert.deepEqual(context.outreach.channels, ["instagram", "facebook"]);
  assert.equal(context.workflow.step, "message");
  assert.equal(context.outreach.status, "editing");
  assert.equal(context.outreach.startAuthorized, false);
  assert.deepEqual(
    (await calls(page)).map((call) => call.name),
    ["senders_inspect"],
  );
  assert.deepEqual(await page.evaluate(() => window.__messages), []);
});
const artifacts = new URL("../../../outputs/native-agent-prospecting/", import.meta.url);

test("excluding one company from 51 makes the exact 50-company selection usable", async (t) => {
  const all = Array.from({ length: 51 }, (_, i) => ({
    ...rows[0],
    businessId: `company-${i}`,
    name: `Company ${i}`,
  }));
  const payload = initial();
  Object.assign(payload.result.data, {
    companies: all,
    total: 51,
    pageSize: 51,
    hasNextPage: false,
    nextCursor: null,
  });
  const page = await open(t, {}, payload, all);
  await expect(page.getByRole("button", { name: /Message$/ })).toBeDisabled();
  await page.getByRole("checkbox", { name: "Select Company 0", exact: true }).uncheck();
  await expect(page.getByRole("button", { name: /Message$/ })).toBeEnabled();
  await page.getByRole("button", { name: /Message$/ }).click();
  await expect.poll(async () => (await workspaceContext(page))?.outreach?.companyCount).toBe(50);
  assert.deepEqual(
    (await calls(page)).map((call) => call.name),
    ["senders_inspect"],
  );
});

for (const width of [390, 1040])
  for (const theme of ["light", "dark"]) {
    test(`shortlist form stays usable at ${width}px in ${theme}`, async (t) => {
      const page = await open(t, { outreach: true, hostContext: { theme } });
      await page.setViewportSize({ width, height: 850 });
      await selectOnly(page, "Nordic Studio");
      await page.getByRole("button", { name: "Save shortlist", exact: true }).click();
      await page.getByLabel("Shortlist name", { exact: true }).fill("B2B partners");
      await expect(
        page.getByRole("button", { name: "Save selected companies", exact: true }),
      ).toBeEnabled();
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      mkdirSync(artifacts, { recursive: true });
      await page.screenshot({
        path: new URL(`shortlist-${width}-${theme}.png`, artifacts).pathname,
        fullPage: true,
      });
      await page.getByLabel("Shortlist name", { exact: true }).press("Enter");
      await expect(page.getByRole("status")).toContainText("B2B partners");
      assert.equal((await calls(page)).filter((c) => c.name.startsWith("campaign_")).length, 0);
    });
  }

test("research shortlist saves the exact selection without a campaign and reopens saved contacts", async (t) => {
  const page = await open(t, { outreach: true });
  await selectOnly(page, "Nordic Studio");
  await page.getByRole("button", { name: "Save shortlist", exact: true }).click();
  await page.getByLabel("Shortlist name", { exact: true }).fill("Nordic partners");
  await page.getByRole("button", { name: "Save selected companies", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Saved 1 companies to Nordic partners.");
  assert.deepEqual(
    (await calls(page)).map((c) => c.name),
    ["company_inspect", "companies_list_prepare"],
  );
  const request = (await calls(page))[1].arguments;
  assert.equal(request.companies.length, 1);
  assert.equal(request.companies[0].businessId, "demo-1");
  await page.getByRole("button", { name: "Open saved shortlist", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Nordic partners", exact: true })).toBeVisible();
  await expect
    .poll(async () => (await workspaceContext(page))?.audience?.source)
    .toBe("saved_company_list");
  assert.equal((await workspaceContext(page)).audience.listId, "list-selected");
  assert.equal((await calls(page)).filter((c) => c.name.startsWith("campaign_")).length, 0);
});

test("uncertain shortlist saves retain the exact request, freeze editing and recover without duplicate writes", async (t) => {
  const page = await open(t, { outreach: true, uncertainList: true });
  await selectOnly(page, "Nordic Studio");
  await page.getByRole("button", { name: "Save shortlist", exact: true }).click();
  await page.getByLabel("Shortlist name", { exact: true }).fill("Recovery");
  await page.getByRole("button", { name: "Save selected companies", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Response unavailable");
  await expect(page.getByLabel("Shortlist name", { exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: /Message$/ })).toBeDisabled();
  await page.getByRole("button", { name: "Retry save", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Saved 1 companies to Recovery.");
  const saves = (await calls(page)).filter((c) => c.name === "companies_list_prepare");
  assert.equal(saves.length, 2);
  assert.deepEqual(saves[0].arguments, saves[1].arguments);
  assert.equal((await calls(page)).filter((c) => c.name === "company_inspect").length, 1);
});

test("a changed chat search during shortlist inspection cannot save the old or new selection", async (t) => {
  const page = await open(t, { outreach: true, holdProfiles: true });
  await selectOnly(page, "Nordic Studio");
  await page.getByRole("button", { name: "Save shortlist", exact: true }).click();
  await page.getByLabel("Shortlist name", { exact: true }).fill("Changed selection");
  await page.getByRole("button", { name: "Save selected companies", exact: true }).click();
  await expect.poll(async () => (await calls(page)).length).toBe(1);
  const next = initial();
  next.result.data.querySignature = "new-search";
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
  await expect
    .poll(async () => (await workspaceContext(page))?.audience?.querySignature)
    .toBe("new-search");
  await page.evaluate(() => window.__release("company_inspect", 0));
  await expect(page.getByRole("alert")).toContainText("selection changed");
  assert.equal((await calls(page)).filter((c) => c.name === "companies_list_prepare").length, 0);
});

test("a rejected shortlist save explains permissions and unlocks editing", async (t) => {
  const page = await open(t, { outreach: true, listFailureCode: "insufficient_scope" });
  await selectOnly(page, "Nordic Studio");
  await page.getByRole("button", { name: "Save shortlist", exact: true }).click();
  await page.getByLabel("Shortlist name", { exact: true }).fill("Permission check");
  await page.getByRole("button", { name: "Save selected companies", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Reconnect DM Faster");
  await expect(page.getByLabel("Shortlist name", { exact: true })).toBeEnabled();
  await expect(page.getByRole("button", { name: "Cancel", exact: true })).toBeEnabled();
  await expect.poll(async () => (await workspaceContext(page))?.shortlist?.status).toBe("editing");
  await page.getByLabel("Shortlist name", { exact: true }).fill("Approved shortlist");
  await page.getByRole("button", { name: "Save selected companies", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Saved 1 companies to Approved shortlist.");
  const saves = (await calls(page)).filter((c) => c.name === "companies_list_prepare");
  assert.equal(saves.length, 2);
  assert.notEqual(saves[0].arguments.idempotencyKey, saves[1].arguments.idempotencyKey);
  assert.equal((await calls(page)).filter((c) => c.name === "company_inspect").length, 2);
});

test("permission rejection after an uncertain shortlist keeps the original request frozen", async (t) => {
  const page = await open(t, {
    outreach: true,
    uncertainList: true,
    listFailureCode: "insufficient_scope",
  });
  await selectOnly(page, "Nordic Studio");
  await page.getByRole("button", { name: "Save shortlist", exact: true }).click();
  await page.getByLabel("Shortlist name", { exact: true }).fill("Recovery");
  await page.getByRole("button", { name: "Save selected companies", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Response unavailable");
  await page.getByRole("button", { name: "Retry save", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Reconnect DM Faster");
  await expect(page.getByLabel("Shortlist name", { exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Cancel", exact: true })).toBeDisabled();
  await expect
    .poll(async () => (await workspaceContext(page))?.shortlist?.recovery?.tool)
    .toBe("companies_list_prepare");
  await page.getByRole("button", { name: "Retry save", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Saved 1 companies to Recovery.");
  const saves = (await calls(page)).filter((c) => c.name === "companies_list_prepare");
  assert.equal(saves.length, 3);
  assert.deepEqual(saves[0].arguments, saves[1].arguments);
  assert.deepEqual(saves[0].arguments, saves[2].arguments);
});

test("saved shortlist paging pins the list version and fails closed on edited lists", async (t) => {
  const saved = {
    listId: "saved-list",
    name: "Agency shortlist",
    total: 21,
    expectedUpdatedAt: "2026-10-08T00:00:00.000Z",
    companies: Array.from({ length: 21 }, (_, i) => ({
      profileId: `enterprise-company:fi:demo-${i + 1}`,
      name: `Agency ${i + 1}`,
      externalUrl: "https://example.test",
      emailAddress: "owner@example.test",
    })),
    nextOffset: 20,
  };
  const payload = {
    ...initial(),
    savedListId: saved.listId,
    savedListPageSize: 20,
    result: {
      ...initial().result,
      tool: "companies.list.inspect",
      data: { ...saved, companies: saved.companies.slice(0, 20) },
    },
  };
  const page = await open(t, { savedListData: saved }, payload);
  await expect(page.getByRole("heading", { name: saved.name })).toBeVisible();
  await page.getByRole("button", { name: "Next page", exact: true }).click();
  await expect(page.getByRole("button", { name: /Agency 21/ })).toBeVisible();
  assert.deepEqual(await calls(page), [
    {
      name: "companies_list_inspect",
      arguments: {
        listId: saved.listId,
        limit: 20,
        offset: 20,
        expectedUpdatedAt: saved.expectedUpdatedAt,
      },
    },
  ]);
  await page.getByRole("button", { name: "First page", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Agency 1 example.test", exact: true }),
  ).toBeVisible();
  assert.equal((await calls(page)).length, 1);
  const changed = await open(t, { savedListData: saved, changedList: true }, payload);
  await changed.getByRole("button", { name: "Next page", exact: true }).click();
  await expect(changed.getByRole("alert")).toBeVisible();
  await expect(changed.getByRole("button", { name: /Message$/ })).toBeDisabled();
  await expect(changed.getByRole("button", { name: "Save shortlist", exact: true })).toBeDisabled();
});

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
    await expect(profile.getByText("Business ID", { exact: true })).toHaveCount(visible ? 1 : 0);
    await expect(profile.getByText(businessId, { exact: true })).toHaveCount(visible ? 1 : 0);
  });
}

async function selectOnly(page, name) {
  await page.getByRole("button", { name: "Select companies", exact: true }).click();
  await page.getByRole("radio", { name: "Clear selection", exact: true }).check();
  await page.getByRole("button", { name: "Apply", exact: true }).click();
  await page.getByRole("checkbox", { name: `Select ${name}`, exact: true }).check();
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
  await expect(page.getByRole("button", { name: "Refresh", exact: true })).toHaveCount(0);
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
  await expect(page.getByRole("button", { name: "Use this search in chat" })).toHaveCount(0);
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
  await selectOnly(page, "Nordic Studio");
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
  await expect(page.getByRole("button", { name: "Use this search in chat" })).toHaveCount(0);
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
  await page.getByRole("button", { name: "Next page", exact: true }).click();
  await expect(page.getByText("Exact count unavailable", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Use this search in chat" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Next page" })).toBeDisabled();
  await expect(page.getByRole("button", { name: /Message$/ })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Save shortlist", exact: true })).toBeDisabled();
  await expect(page.getByText("41 companies", { exact: true })).toHaveCount(0);
  const changed = await open(t, { changedRevision: true });
  await changed.getByRole("button", { name: "Next page" }).click();
  await expect(changed.getByRole("alert")).toContainText("inventory changed");
});

test("changed totals in a pinned search fail closed and a fresh retry clears old exclusions", async (t) => {
  const page = await open(t, { changedTotal: true });
  await page.getByRole("checkbox", { name: "Select Nordic Studio", exact: true }).uncheck();
  await page.getByRole("button", { name: "Next page", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("inventory changed");
  await expect(page.getByRole("button", { name: /Message$/ })).toBeDisabled();
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await expect(
    page.getByRole("checkbox", { name: "Select Nordic Studio", exact: true }),
  ).toBeChecked();
  await expect.poll(async () => (await workspaceContext(page))?.audience?.selectedCount).toBe(40);
  assert.deepEqual((await workspaceContext(page)).audience.excludedCompanyKeys, []);
});

test("composer criteria and row selections sync silently without redundant chat actions", async (t) => {
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
  await selectOnly(page, "Nordic Studio");
  await expect(page.getByRole("button", { name: /Discuss selected|Write message/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Message$/ })).toBeEnabled();
  assert.deepEqual(await page.evaluate(() => window.__messages), []);
  assert.deepEqual(await calls(page), []);
});

test("switching sections preserves the company search and filters without another read", async (t) => {
  const page = await open(t);
  await page.getByRole("button", { name: /Campaigns$/, exact: false }).click();
  await expect(page.getByRole("region", { name: "Campaigns", exact: true })).toBeAttached();
  await page.getByRole("button", { name: /Audience$/, exact: false }).click();
  await expect(page.getByText("41 companies", { exact: true })).toBeVisible();
  assert.deepEqual(
    (await calls(page)).map((call) => call.name),
    ["campaigns_list"],
  );
});

for (const width of [390, 1040]) {
  test(`company and campaign navigation stays aligned at ${width}px`, async (t) => {
    const page = await open(t);
    await page.setViewportSize({ width, height: 850 });
    const bounds = async () => {
      const nav = page.locator(".workflow-progress:visible");
      const tabs = await nav.boundingBox();
      const content = await page
        .locator("main.native-workspace:visible .workspace-shell")
        .boundingBox();
      assert.ok(tabs.y + tabs.height <= content.y, "navigation stays above content");
      return { tabs, contentX: content.x };
    };
    const companies = await bounds();
    await page.getByRole("button", { name: /Campaigns$/, exact: false }).click();
    await expect(page.getByRole("region", { name: "Campaigns", exact: true })).toBeAttached();
    await expect(page.getByRole("button", { name: "Refresh", exact: true })).toHaveCount(0);
    assert.deepEqual(
      await bounds(),
      companies,
      "switching sections must not move the navigation or title",
    );
    await page.getByRole("button", { name: /Audience$/, exact: false }).click();
    await expect(page.getByText("41 companies", { exact: true })).toBeVisible();
    assert.deepEqual(await bounds(), companies);
    assert.deepEqual(
      (await calls(page)).map((call) => call.name),
      ["campaigns_list"],
    );
    if (width === 390) {
      mkdirSync(artifacts, { recursive: true });
      await page.screenshot({ path: new URL("companies-navigation.png", artifacts).pathname });
    }
  });
}

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
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await expect(page.getByText("41 companies", { exact: true })).toBeVisible();
  assert.deepEqual((await calls(page))[0].arguments.filters, filters);
});

test("company websites use the host link bridge inside a native sandbox", async (t) => {
  const page = await open(t, { supportLinks: true });
  await page.getByRole("button", { name: /Nordic Studio/ }).click();
  await expect(page.getByRole("heading", { name: "Nordic Studio", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Website", exact: true }).click();
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
  await selectOnly(page, "Nordic Studio");
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
  await page.getByRole("button", { name: "Select companies", exact: true }).click();
  await expect(page.getByRole("radio", { name: "All results", exact: true })).toBeDisabled();
  assert.deepEqual(await page.evaluate(() => window.__messages), []);
});

test("saved evidence drawer hides internal evidence while preserving bounded profile reads", async (t) => {
  const payload = evidenceInitial();
  const original =
    '<img src=x onerror="window.__injected=true"> Tarjoamme yrityksille omaa ohjelmaa.';
  payload.result.data.companies[0].passages[0].text = original;
  payload.result.data.companies[0].criteria[0].evidence[0].text = original;
  const page = await open(t, { holdProfiles: true, supportLinks: true }, payload);
  await page.getByRole("button", { name: /Nordic Studio/ }).click();
  const drawer = page.getByRole("dialog", { name: "Company details" });
  await expect(drawer.getByRole("heading", { name: "Saved website evidence" })).toHaveCount(0);
  await expect(drawer.getByText(original, { exact: true })).toHaveCount(0);
  await expect(drawer.locator(".company-evidence-sources")).toHaveCount(0);
  await expect(drawer.getByText("Loading full profile…", { exact: true })).toBeVisible();
  assert.equal(await page.evaluate(() => window.__injected), undefined);
  await drawer.getByRole("button", { name: "Close company details" }).click();
  await page.getByRole("button", { name: /Nordic Studio/ }).click();
  assert.equal((await calls(page)).length, 1, "a pending profile read is shared on reopening");
  await page.evaluate(() => window.__release("company_inspect"));
  await expect(drawer.getByText("Nordic Studio helps teams", { exact: false })).toBeVisible();
  await drawer.getByRole("button", { name: "Use this company in chat" }).click();
  await expect
    .poll(() =>
      page.evaluate(() => window.__contexts.filter((c) => c.structuredContent.profile).length),
    )
    .toBe(1);
  const selection = await page.evaluate(
    () => window.__contexts.find((c) => c.structuredContent.profile).structuredContent,
  );
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
  await expect(page.getByRole("button", { name: "Use this search in chat" })).toHaveCount(0);
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

test("sidebar keeps compact company and evidence rows without horizontal scrolling", async (t) => {
  const page = await open(t);
  for (const width of [320, 390, 680]) {
    await page.setViewportSize({ width, height: 780 });
    const first = page.locator(".company-table tbody tr").first();
    await expect(first.getByLabel("Revenue €2.4M")).toBeVisible();
    await expect(first.getByLabel("18 employees")).toBeVisible();
    assert.ok((await first.boundingBox()).height <= 64);
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true,
    );
  }
  const evidence = await open(t, {}, evidenceInitial());
  await evidence.setViewportSize({ width: 320, height: 740 });
  await expect(evidence.locator(".company-evidence-excerpt")).toHaveCount(0);
  assert.ok((await evidence.locator(".company-table tbody tr").first().boundingBox()).height <= 64);
  await expect(evidence.locator(".company-row-link .company-logo").first()).toBeVisible();
  await expect(evidence.getByText("Accepted match", { exact: true })).toBeVisible();
  assert.equal(
    await evidence.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    true,
  );
  assert.deepEqual(await calls(evidence), []);
});

test("drawer exposes app-style financials and saved contacts while unknown values stay unknown", async (t) => {
  const page = await open(t, {
    profileOverrides: { employeeCount: null, netIncomeEur: 0, revenueGrowthPercent: -3.2 },
  });
  await page.setViewportSize({ width: 320, height: 740 });
  await page.getByRole("button", { name: /Nordic Studio/ }).click();
  const drawer = page.getByRole("dialog");
  await expect(
    drawer.locator(".company-main-person").getByText("Alex Example", { exact: true }),
  ).toBeVisible();
  await expect(drawer.getByText("WordPress", { exact: true })).toBeVisible();
  const metrics = drawer.getByLabel("Key financials");
  await expect(metrics).toContainText("Net income€0");
  await expect(metrics).toContainText("Growth-3.2%");
  await expect(metrics).toContainText("Employees—");
  assert.equal(
    await drawer.evaluate((element) => element.scrollWidth <= element.clientWidth),
    true,
  );
  await expect(drawer.getByRole("table", { name: "Reported financial history" })).toBeVisible();
  await drawer.getByRole("button", { name: "Use this company in chat" }).click();
  await expect
    .poll(() =>
      page.evaluate(() => window.__contexts.filter((c) => c.structuredContent.profile).length),
    )
    .toBe(1);
  assert.equal(
    await page.evaluate(
      () =>
        window.__contexts.find((c) => c.structuredContent.profile).structuredContent.profile.profile
          .netIncomeEur,
    ),
    0,
  );
  assert.deepEqual(
    (await calls(page)).map((c) => c.name),
    ["company_inspect"],
  );
});

test("inline hosts expand for details without delaying the summary or blocking on refusal", async (t) => {
  for (const denyExpansion of [false, true]) {
    const page = await open(t, {
      holdProfiles: true,
      denyExpansion,
      hostContext: { displayMode: "inline", availableDisplayModes: ["inline", "fullscreen"] },
    });
    await page.getByRole("button", { name: /Nordic Studio/ }).click();
    await expect(
      page.getByRole("dialog").getByRole("heading", { name: "Nordic Studio" }),
    ).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => window.__displayModes))
      .toEqual([{ mode: "fullscreen" }]);
    await expect(page.getByText("Loading full profile…", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Close company details" }).click();
    await expect(page.getByRole("button", { name: /Nordic Studio/ })).toBeFocused();
  }
});

test("shared app funding and advertising details preserve source records and expand without another read", async (t) => {
  const page = await open(t, {
    profileOverrides: {
      registrationDate: "2017-10-01",
      technologies: ["joomla", "shopify"],
      publicFunding: {
        eventCount: 2,
        latestEventDate: "2025-12-08",
        recentEvents: [],
        sources: [
          {
            source: "tem",
            eventCount: 2,
            latestEventDate: "2025-12-08",
            grantedEur: 12000,
            paidEur: 8000,
          },
        ],
      },
      advertising: {
        google: {
          status: "recent",
          creativeCount: 161,
          impressionRange: { lowerBound: 1800000, upperBound: 2200000 },
          firstShown: "2023-03-01",
          lastShown: "2026-08-26",
          formats: ["TEXT", "IMAGE"],
          topics: [],
          advertiserNames: ["Nordic Studio"],
          evidenceUrl: "https://adstransparency.google.com/advertiser/example",
          audienceSelectionApproaches: { demographicInfo: ["CRITERIA_USED"] },
        },
        meta: null,
      },
    },
  });
  await page.getByRole("button", { name: /Nordic Studio/ }).click();
  const drawer = page.getByRole("dialog");
  await expect(drawer.getByText("10/01/2017", { exact: true })).toBeVisible();
  const funding = drawer.getByRole("button", {
    name: /Public funding.*1 sources with funding records/,
  });
  await expect(funding).toHaveAttribute("aria-expanded", "false");
  await funding.click();
  await expect(funding).toHaveAttribute("aria-expanded", "true");
  await expect(drawer.getByText("TEM enterprise aid", { exact: true })).toBeVisible();
  await expect(drawer.getByText("€12,000", { exact: true })).toBeVisible();
  await expect(drawer.getByText("€8,000", { exact: true })).toBeVisible();
  await expect(drawer.getByText("1.8M–2.2M", { exact: true })).toBeVisible();
  await expect(drawer.getByText("Demographics", { exact: true })).toBeVisible();
  await expect(drawer.getByText("Joomla", { exact: true })).toBeVisible();
  assert.equal((await calls(page)).length, 1, "expansion reuses the inspected profile");
  assert.equal(
    await drawer.locator(".company-drawer-actions").count(),
    0,
    "chat actions must not occupy a sticky footer absent from the app",
  );
});

test("Companies locale follows the host and switches without new reads or lost drawer state", async (t) => {
  const payload = initial();
  payload.result.data.total = 12345;
  const page = await open(t, { locale: "fi-FI", expectedHeading: "Yritykset" }, payload);
  await expect(page.getByText("12 345 yritystä", { exact: true })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Henkilöstö", exact: true })).toBeAttached();
  await page.getByRole("checkbox", { name: "Valitse Nordic Studio" }).check();
  await page.getByRole("button", { name: /Nordic Studio/ }).click();
  const drawer = page.getByRole("dialog", { name: "Yrityksen tiedot" });
  await expect(drawer.getByText("Taloustiedot", { exact: true })).toBeVisible();
  await expect(drawer.getByText("Nordic Studio helps teams", { exact: false })).toBeVisible();
  const before = await calls(page);
  await page.evaluate(() => {
    document.documentElement.lang = "en-GB";
  });
  await expect(page.getByRole("dialog", { name: "Company details" })).toBeVisible();
  await expect(page.getByText("Financials", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Close company details" }).click();
  await expect(page.getByRole("checkbox", { name: "Select Nordic Studio" })).toBeChecked();
  await expect(page.getByText("12,345 companies", { exact: true })).toBeVisible();
  assert.deepEqual(await calls(page), before, "locale changes must not repeat tool reads");
});

for (const options of [
  { browserLocale: "fi-FI", expectedHeading: "Yritykset" },
  { compatibilityLocale: "fi", expectedHeading: "Yritykset" },
  { locale: "sv-SE", browserLocale: "fi-FI", expectedHeading: "Companies" },
]) {
  test(`Companies locale fallback ${JSON.stringify(options)}`, async (t) => {
    const page = await open(t, options);
    await expect(
      page.getByRole("region", { name: options.expectedHeading, exact: true }),
    ).toBeVisible();
    assert.deepEqual(await calls(page), []);
  });
}

test("Finnish evidence locale hides internal sources and preserves partial-count meaning", async (t) => {
  const page = await open(t, { locale: "fi-FI", expectedHeading: "Yritykset" }, evidenceInitial());
  await expect(
    page.getByText("Markkinan kokonaismäärä ei ole saatavilla", { exact: false }),
  ).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Yritys", exact: true })).toBeAttached();
  await page.locator(".company-row-link").first().click();
  await expect(
    page.getByRole("heading", { name: "Tallennettu verkkosivun lähdeaineisto" }),
  ).toHaveCount(0);
  const original = evidenceInitial().result.data.companies[0];
  const quote = [...original.criteria.flatMap((c) => c.evidence), ...original.passages][0];
  await expect(page.locator("blockquote").filter({ hasText: quote.text })).toHaveCount(0);
});

async function composeOutreach(t, options = {}, payload = initial()) {
  const page = await open(t, { outreach: true, ...options }, payload);
  await selectOnly(page, "Nordic Studio");
  await page.getByRole("button", { name: /Message$/ }).click();
  await page
    .getByLabel("Message", { exact: true })
    .fill("Hello, may I share an idea for your business?");
  await page.getByRole("button", { name: "Review campaign", exact: true }).click();
  await expect(
    page.getByRole(
      options.noRoutes ? "alert" : "button",
      options.noRoutes ? {} : { name: "Start campaign", exact: true },
    ),
  ).toBeVisible();
  return page;
}
test("selected companies reach a disabled draft and launch only after the explicit start click", async (t) => {
  const page = await composeOutreach(t);
  assert.equal(
    (await calls(page)).some((c) => c.name === "campaign_launch"),
    false,
  );
  await expect(page.getByRole("button", { name: "Start campaign", exact: true })).toBeVisible();
  assert.equal(
    (await calls(page)).some((c) => c.name === "campaign_launch_preflight"),
    false,
  );
  await page.getByRole("button", { name: "Start campaign", exact: true }).click();
  await expect(page.getByRole("region", { name: "Campaigns", exact: true })).toBeAttached();
  const recorded = await calls(page);
  assert.deepEqual(recorded.find((c) => c.name === "companies_list_prepare").arguments.companies, [
    { country: "FI", businessId: "demo-1", expectedRevision: "a".repeat(64) },
  ]);
  assert.equal(
    recorded.find((c) => c.name === "campaign_draft_prepare").arguments.expectedAudienceCount,
    1,
  );
  assert.equal(recorded.filter((c) => c.name === "campaign_launch").length, 1);
});
for (const option of ["setupRequired", "approvalRequired", "changedDraft"]) {
  test(`outreach blocks launch when ${option}`, async (t) => {
    const page = await composeOutreach(t, { [option]: true });
    await page.getByRole("button", { name: "Start campaign", exact: true }).click();
    await expect(page.getByRole("button", { name: "Start campaign", exact: true })).toBeEnabled();
    assert.equal(
      (await calls(page)).some((c) => c.name === "campaign_launch"),
      false,
    );
  });
}
test("outreach retains the exact launch authorization after a lost response", async (t) => {
  const page = await composeOutreach(t, { uncertainLaunch: true });
  await page.getByRole("button", { name: "Start campaign", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Response unavailable");
  await expect(
    page
      .getByRole("navigation", { name: "Campaign steps" })
      .getByRole("button", { name: /Audience$/ }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Check launch result", exact: true }).click();
  await expect(page.getByRole("region", { name: "Campaigns", exact: true })).toBeAttached();
  const attempts = (await calls(page)).filter((c) => c.name === "campaign_launch");
  assert.equal(attempts.length, 2);
  assert.deepEqual(attempts[0].arguments, attempts[1].arguments);
  assert.equal((await calls(page)).filter((c) => c.name === "campaign_launch_preflight").length, 1);
});
test("outreach cannot prepare when no selected company has a route", async (t) => {
  const page = await composeOutreach(t, { noRoutes: true });
  await expect(page.getByRole("alert")).toContainText("No selected company has a contact");
  await expect(page.getByRole("button", { name: "Start campaign", exact: true })).toHaveCount(0);
  assert.equal(
    (await calls(page)).some((c) => c.name === "campaign_draft_prepare"),
    false,
  );
});

test("outreach works from saved evidence results without expanding the audience", async (t) => {
  const page = await composeOutreach(t, {}, evidenceInitial());
  await expect(page.getByRole("button", { name: "Start campaign", exact: true })).toBeVisible();
  assert.equal(
    (await calls(page)).find((c) => c.name === "companies_list_prepare").arguments.companies.length,
    1,
  );
});
test("outreach Finnish labels retain user copy and stay compact", async (t) => {
  const page = await open(t, { outreach: true, locale: "fi-FI", expectedHeading: "Yritykset" });
  await page.setViewportSize({ width: 390, height: 850 });
  await page.getByRole("button", { name: "Valitse yritykset", exact: true }).click();
  await page.getByRole("radio", { name: "Tyhjennä valinta", exact: true }).check();
  await page.getByRole("button", { name: "Valitse", exact: true }).click();
  await page.getByRole("checkbox").first().check();
  await page.getByRole("button", { name: /Viesti$/ }).click();
  await page.getByLabel("Viesti", { exact: true }).fill("Hei, saanko kertoa ideasta?");
  await page.getByRole("button", { name: "Tarkista kampanja", exact: true }).click();
  await page.locator(".outreach-audience summary").click();
  await expect(page.getByText(/nordic.studio/)).toBeVisible();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  mkdirSync(artifacts, { recursive: true });
  await page.screenshot({
    path: new URL("outreach-finnish.png", artifacts).pathname,
    fullPage: true,
  });
});

test("outreach editing changes the message and channel while retaining the selected audience", async (t) => {
  const page = await composeOutreach(t);
  await page.getByRole("button", { name: "Edit message or channel", exact: true }).click();
  await page.getByRole("checkbox", { name: "Facebook", exact: true }).check();
  await page.getByLabel("Message", { exact: true }).fill("A revised message.");
  await page.getByRole("button", { name: "Review campaign", exact: true }).click();
  await expect(page.getByRole("button", { name: "Start campaign", exact: true })).toBeVisible();
  await expect(page.locator("blockquote")).toHaveText(["A revised message.", "A revised message."]);
  const recorded = await calls(page);
  assert.equal(recorded.filter((c) => c.name === "companies_list_prepare").length, 1);
  const drafts = recorded.filter((c) => c.name === "campaign_draft_prepare");
  assert.equal(drafts.length, 2);
  assert.deepEqual(drafts[1].arguments.channels, ["instagram", "facebook"]);
  assert.equal(drafts[0].arguments.listId, drafts[1].arguments.listId);
  assert.notEqual(drafts[0].arguments.idempotencyKey, drafts[1].arguments.idempotencyKey);
  assert.equal(
    recorded.some((c) => c.name === "campaign_launch"),
    false,
  );
});
for (const uncertain of ["uncertainList", "uncertainDraft"]) {
  test(`outreach review recovers ${uncertain} with the same request`, async (t) => {
    const page = await open(t, { outreach: true, [uncertain]: true });
    await selectOnly(page, "Nordic Studio");
    await page.getByRole("button", { name: /Message$/ }).click();
    await page.getByLabel("Message", { exact: true }).fill("Please keep this exact message.");
    await page.getByRole("button", { name: "Review campaign", exact: true }).click();
    await expect(page.getByRole("alert")).toContainText("Response unavailable");
    await expect(page.getByLabel("Message", { exact: true })).toBeDisabled();
    await page.getByRole("button", { name: "Review campaign", exact: true }).click();
    await expect(page.getByRole("button", { name: "Start campaign", exact: true })).toBeVisible();
    const recorded = await calls(page);
    const attempts = recorded.filter(
      (c) =>
        c.name ===
        (uncertain === "uncertainList" ? "companies_list_prepare" : "campaign_draft_prepare"),
    );
    assert.equal(attempts.length, 2);
    assert.deepEqual(attempts[0].arguments, attempts[1].arguments);
    assert.equal(
      recorded.some((c) => c.name === "campaign_launch"),
      false,
    );
  });
}

for (const stage of ["list", "draft"]) {
  for (const uncertain of [false, true]) {
    test(`outreach permission recovery at ${stage}, previously uncertain=${uncertain}`, async (t) => {
      const page = await open(t, {
        outreach: true,
        [`${stage}FailureCode`]: "insufficient_scope",
        [stage === "list" ? "uncertainList" : "uncertainDraft"]: uncertain,
      });
      await selectOnly(page, "Nordic Studio");
      await page.getByRole("button", { name: /Message$/ }).click();
      await page.getByLabel("Message", { exact: true }).fill("Keep this test draft disabled.");
      const review = page.getByRole("button", { name: "Review campaign", exact: true });
      await review.click();
      if (uncertain) {
        await expect(page.getByRole("alert")).toContainText("Response unavailable");
        await review.click();
      }
      await expect(page.getByRole("alert")).toContainText("Reconnect DM Faster");
      if (uncertain) {
        await expect(page.getByLabel("Message", { exact: true })).toBeDisabled();
        await expect
          .poll(async () => (await workspaceContext(page))?.outreach?.status)
          .toBe("save_unverified");
      } else {
        await expect(page.getByLabel("Message", { exact: true })).toBeEnabled();
        await expect(page.getByRole("button", { name: /Audience$/ })).toBeEnabled();
        await page.getByLabel("Message", { exact: true }).fill("An edited disabled test draft.");
      }
      await review.click();
      await expect(page.getByRole("button", { name: "Start campaign", exact: true })).toBeVisible();
      const tool = stage === "list" ? "companies_list_prepare" : "campaign_draft_prepare";
      const attempts = (await calls(page)).filter((c) => c.name === tool);
      assert.equal(attempts.length, uncertain ? 3 : 2);
      if (uncertain) {
        assert.deepEqual(attempts[0].arguments, attempts[1].arguments);
        assert.deepEqual(attempts[0].arguments, attempts[2].arguments);
      }
      assert.equal(
        (await calls(page)).some((c) => c.name === "campaign_launch"),
        false,
      );
    });
  }
}

test("outreach cannot prepare a draft from a different saved company with the same count", async (t) => {
  const page = await open(t, { outreach: true, changedSavedIdentity: true });
  await selectOnly(page, "Nordic Studio");
  await page.getByRole("button", { name: /Message$/ }).click();
  await page.getByLabel("Message", { exact: true }).fill("Private test draft.");
  await page.getByRole("button", { name: "Review campaign", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("saved shortlist could not be verified");
  await expect(page.getByLabel("Message", { exact: true })).toBeDisabled();
  assert.equal(
    (await calls(page)).some((c) => c.name === "campaign_draft_prepare"),
    false,
  );
});

test("outreach channel cards support keyboard choice and a narrow dark sidebar", async (t) => {
  const page = await open(t, { outreach: true, hostContext: { theme: "dark" } });
  await page.setViewportSize({ width: 320, height: 820 });
  await selectOnly(page, "Nordic Studio");
  await page.getByRole("button", { name: /Message$/ }).click();
  await page.getByRole("checkbox", { name: "Instagram", exact: true }).focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Space");
  await expect(page.getByRole("checkbox", { name: "Facebook", exact: true })).toBeChecked();
  await page.getByLabel("Message", { exact: true }).fill("A short message.");
  await expect(page.getByRole("button", { name: "Review campaign", exact: true })).toBeEnabled();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.screenshot({
    path: new URL("outreach-dark-narrow.png", artifacts).pathname,
    fullPage: true,
  });
});

test("one workflow keeps the audience, message and reviewed draft across backward steps", async (t) => {
  const page = await composeOutreach(t);
  const nav = page.getByRole("navigation", { name: "Campaign steps" });
  await expect(nav.getByRole("button")).toHaveCount(4);
  await nav.getByRole("button", { name: /Audience$/ }).click();
  await expect(
    page.getByRole("checkbox", { name: "Select Nordic Studio", exact: true }),
  ).toBeChecked();
  await nav.getByRole("button", { name: /Message$/ }).click();
  await expect(page.getByLabel("Message", { exact: true })).toHaveValue(
    "Hello, may I share an idea for your business?",
  );
  await nav.getByRole("button", { name: /Review$/ }).click();
  await expect(page.getByRole("button", { name: "Start campaign", exact: true })).toBeVisible();
  assert.equal((await calls(page)).filter((c) => c.name === "campaign_draft_prepare").length, 1);
  await nav.getByRole("button", { name: /Audience$/ }).click();
  await page.getByRole("checkbox", { name: "Select Helsinki Craft", exact: true }).check();
  await expect(nav.getByRole("button", { name: /Review$/ })).toBeDisabled();
  await nav.getByRole("button", { name: /Message$/ }).click();
  await expect(page.getByLabel("Message", { exact: true })).toHaveValue(
    "Hello, may I share an idea for your business?",
  );
  await page.getByRole("button", { name: "Review campaign", exact: true }).click();
  await expect(page.getByRole("button", { name: "Start campaign", exact: true })).toBeVisible();
  assert.equal(
    (await calls(page)).filter((c) => c.name === "campaign_draft_prepare").at(-1).arguments
      .expectedAudienceCount,
    2,
  );
  await page.getByRole("button", { name: "Start campaign", exact: true }).click();
  await expect(page.getByRole("region", { name: "Campaigns", exact: true })).toBeAttached();
  await expect(nav.getByRole("button", { name: /Campaigns$/ })).toHaveAttribute(
    "aria-current",
    "step",
  );
  assert.equal((await calls(page)).filter((c) => c.name === "campaigns_list").length, 1);
});
test("channel selection has one border with keyboard focus still visible", async (t) => {
  const page = await open(t, { outreach: true });
  await selectOnly(page, "Nordic Studio");
  await page.getByRole("button", { name: /Message$/ }).click();
  const radio = page.getByRole("checkbox", { name: "Facebook", exact: true });
  await radio.click();
  assert.equal(await radio.evaluate((el) => getComputedStyle(el).outlineStyle), "none");
  assert.equal(
    await radio.evaluate((el) => getComputedStyle(el.parentElement).outlineStyle),
    "none",
  );
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(radio).toBeFocused();
});

for (const uncertainLaunch of [false, true]) {
  test(`multiple channels share one draft and preserve separate LinkedIn copy, lost response=${uncertainLaunch}`, async (t) => {
    const page = await open(t, { outreach: true, uncertainLaunch });
    await selectOnly(page, "Nordic Studio");
    await page.getByRole("button", { name: /Message$/ }).click();
    await page.getByRole("checkbox", { name: "Facebook", exact: true }).check();
    await page.getByRole("checkbox", { name: "LinkedIn invitation", exact: true }).check();
    await page.getByLabel("Message", { exact: true }).fill("Shared direct message");
    await expect(page.getByRole("button", { name: "Review campaign", exact: true })).toBeDisabled();
    await page.getByLabel("Invitation note", { exact: true }).fill("A separate connection note");
    assert.equal(
      await page
        .getByLabel("Message", { exact: true })
        .evaluate((el) => getComputedStyle(el).resize),
      "none",
    );
    await page.getByRole("button", { name: "Review campaign", exact: true }).click();
    await expect(page.getByRole("button", { name: "Start campaign", exact: true })).toBeVisible();
    await expect(page.locator("blockquote")).toHaveText([
      "Shared direct message",
      "Shared direct message",
      "A separate connection note",
    ]);
    const draftCalls = (await calls(page)).filter((c) => c.name === "campaign_draft_prepare");
    assert.equal(draftCalls.length, 1);
    assert.deepEqual(draftCalls[0].arguments.channels, ["instagram", "facebook", "linkedin"]);
    assert.equal(draftCalls[0].arguments.expectedTargetCount, 3);
    assert.equal(draftCalls[0].arguments.expectedAudienceCount, 1);
    assert.equal(draftCalls[0].arguments.linkedinInviteNote, "A separate connection note");
    await page.getByRole("button", { name: "Start campaign", exact: true }).click();
    if (uncertainLaunch) {
      await expect(page.getByRole("alert")).toContainText("Response unavailable");
      await page.getByRole("button", { name: "Check launch result", exact: true }).click();
    }
    await expect(page.getByRole("region", { name: "Campaigns", exact: true })).toBeAttached();
    const launches = (await calls(page)).filter((c) => c.name === "campaign_launch");
    assert.equal(launches.length, uncertainLaunch ? 2 : 1);
    if (uncertainLaunch) assert.deepEqual(launches[0].arguments, launches[1].arguments);
  });
}
test("no selected channel blocks review and channel toggles retain copy", async (t) => {
  const page = await open(t, { outreach: true });
  await selectOnly(page, "Nordic Studio");
  await page.getByRole("button", { name: /Message$/ }).click();
  await page.getByLabel("Message", { exact: true }).fill("Keep this copy");
  await page.getByRole("checkbox", { name: "Instagram", exact: true }).uncheck();
  await expect(page.getByRole("button", { name: "Review campaign", exact: true })).toBeDisabled();
  await page.getByRole("checkbox", { name: "Facebook", exact: true }).check();
  await expect(page.getByLabel("Message", { exact: true })).toHaveValue("Keep this copy");
  await expect(page.getByRole("button", { name: "Review campaign", exact: true })).toBeEnabled();
});

test("bulk selection spans pages with exact frozen identity and continues through Message", async (t) => {
  const page = await open(t, { bulkSelection: true, outreach: true });
  await page.getByRole("button", { name: "Select companies", exact: true }).click();
  await page.getByRole("radio", { name: "All results (41)", exact: true }).check();
  await page.getByRole("button", { name: "Apply", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: /Message$/ }).click();
  await expect(page.getByText("41 selected companies", { exact: true })).toBeVisible();
  const search = (await calls(page)).find((call) => call.name === "companies_search");
  assert.equal(search.arguments.expectedRevision, "FI:revision-1");
  assert.equal(search.arguments.querySignature, "query-fi-v1");
  assert.equal(search.arguments.cursor, "opaque-next-company");
  assert.equal(search.arguments.page, 2);
  assert.equal(search.arguments.pageSize, 3);
  assert.ok(
    (await calls(page)).every((call) =>
      ["companies_search", "senders_inspect"].includes(call.name),
    ),
  );
  await page.getByRole("button", { name: /Audience$/ }).click();
  await page.getByRole("button", { name: "Select companies", exact: true }).click();
  await page.getByRole("radio", { name: "Clear selection", exact: true }).check();
  await page.getByRole("button", { name: "Apply", exact: true }).click();
  await expect(page.getByRole("button", { name: /Message$/ })).toBeDisabled();
});

test("custom selection loads an exact number and invalid quantities cannot apply", async (t) => {
  const page = await open(t, { bulkSelection: true });
  await page.getByRole("button", { name: "Select companies", exact: true }).click();
  await page.getByRole("spinbutton", { name: "Number of companies" }).fill("42");
  await expect(page.getByRole("button", { name: "Apply", exact: true })).toBeDisabled();
  await page.getByRole("spinbutton", { name: "Number of companies" }).fill("5");
  await page.getByRole("button", { name: "Apply", exact: true }).click();
  await page.getByRole("button", { name: /Message$/ }).click();
  await expect(page.getByText("5 selected companies", { exact: true })).toBeVisible();
});

for (const options of [{ changedRevision: true, bulkSelection: true }, {}]) {
  test(`bulk selection rejects changed or incomplete results without replacing selection ${JSON.stringify(options)}`, async (t) => {
    const page = await open(t, options);
    await selectOnly(page, "Nordic Studio");
    await page.getByRole("button", { name: "Select companies", exact: true }).click();
    await page.getByRole("spinbutton", { name: "Number of companies" }).fill("41");
    await page.getByRole("button", { name: "Apply", exact: true }).click();
    await expect(page.getByRole("alert")).toContainText(
      options.changedRevision ? "results changed" : "selection has not changed",
    );
    await page.getByRole("button", { name: "Cancel", exact: true }).click();
    await expect(
      page.getByRole("checkbox", { name: "Select Nordic Studio", exact: true }),
    ).toBeChecked();
    await expect(
      page.getByRole("checkbox", { name: "Select Helsinki Craft", exact: true }),
    ).not.toBeChecked();
  });
}

test("select all respects the campaign limit; page selection and keyboard dismissal need no reads", async (t) => {
  const payload = initial();
  payload.result.data.total = 1000;
  const page = await open(t, {}, payload);
  await page.getByRole("button", { name: "Select companies", exact: true }).click();
  await expect(page.getByRole("radio", { name: "All results (1000)", exact: true })).toBeEnabled();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Select companies", exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Select companies", exact: true }).click();
  await page.getByRole("radio", { name: "This page (3)", exact: true }).check();
  await page.getByRole("button", { name: "Apply", exact: true }).click();
  assert.deepEqual(await calls(page), []);
  await expect(
    page.getByRole("checkbox", { name: "Select Helsinki Craft", exact: true }),
  ).toBeChecked();
});

test("message focus uses one composer border and no inner ring or resize handle", async (t) => {
  const page = await open(t);
  await selectOnly(page, "Nordic Studio");
  await page.getByRole("button", { name: /Message$/ }).click();
  const textarea = page.locator(".outreach-composer textarea");
  await textarea.focus();
  const style = await textarea.evaluate((el) => {
    const s = getComputedStyle(el);
    return {
      shadow: s.boxShadow,
      border: s.borderBottomWidth,
      outline: s.outlineStyle,
      resize: s.resize,
      display: s.display,
    };
  });
  assert.deepEqual(style, {
    shadow: "none",
    border: "0px",
    outline: "none",
    resize: "none",
    display: "block",
  });
});

test("custom selection also supports numbered pages without a cursor", async (t) => {
  const payload = initial();
  delete payload.result.data.nextCursor;
  const page = await open(t, { bulkSelection: true, numberedBulk: true }, payload);
  await page.getByRole("button", { name: "Select companies", exact: true }).click();
  await page.getByRole("spinbutton", { name: "Number of companies" }).fill("7");
  await page.getByRole("button", { name: "Apply", exact: true }).click();
  await page.getByRole("button", { name: /Message$/ }).click();
  await expect(page.getByText("7 selected companies", { exact: true })).toBeVisible();
  assert.deepEqual(
    (await calls(page))
      .filter((call) => call.name === "companies_search")
      .map((call) => call.arguments.page),
    [2, 3],
  );
});

test("query results start fully selected without hidden reads and resolve across pages on Message", async (t) => {
  const page = await open(t, { bulkSelection: true });
  for (const name of rows.map((row) => row.name))
    await expect(page.getByRole("checkbox", { name: `Select ${name}`, exact: true })).toBeChecked();
  assert.deepEqual(await calls(page), []);
  await page.getByRole("checkbox", { name: "Select Helsinki Craft", exact: true }).uncheck();
  await page.getByRole("button", { name: /Message$/ }).click();
  await expect(page.getByText("40 selected companies", { exact: true })).toBeVisible();
  assert.ok(
    (await calls(page)).every((call) =>
      ["companies_search", "senders_inspect"].includes(call.name),
    ),
  );
  await page.getByRole("button", { name: /Audience$/ }).click();
  await expect(
    page.getByRole("checkbox", { name: "Select Helsinki Craft", exact: true }),
  ).not.toBeChecked();
  await page.getByRole("button", { name: "Next page", exact: true }).click();
  await expect(
    page.getByRole("checkbox", { name: "Select Demo company 4", exact: true }),
  ).toBeChecked();
});

test("large queries stay entirely selected but cannot silently launch only their first 50 companies", async (t) => {
  const payload = initial();
  payload.result.data.total = 100000;
  const page = await open(t, {}, payload);
  await expect(
    page.getByRole("checkbox", { name: "Select Nordic Studio", exact: true }),
  ).toBeChecked();
  await expect(
    page.getByText("All 100000 companies selected. Choose up to 50 to continue."),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Message$/ })).toBeDisabled();
  assert.deepEqual(await calls(page), []);
  await selectOnly(page, "Nordic Studio");
  await expect(page.getByRole("button", { name: /Message$/ })).toBeEnabled();
  await page.getByRole("button", { name: "Select companies", exact: true }).click();
  await page.getByRole("radio", { name: "All results (100000)", exact: true }).check();
  await page.getByRole("button", { name: "Apply", exact: true }).click();
  await expect(page.getByRole("button", { name: /Message$/ })).toBeDisabled();
  assert.deepEqual(await calls(page), []);
});

test("saved evidence defaults only accepted matches and never treats unresolved companies as matches", async (t) => {
  const page = await open(t, {}, evidenceInitial());
  const companies = evidenceInitial().result.data.companies;
  for (const company of companies) {
    const checkbox = page.getByRole("checkbox", { name: `Select ${company.name}`, exact: true });
    if (company.matches) await expect(checkbox).toBeChecked();
    else await expect(checkbox).not.toBeChecked();
  }
  assert.deepEqual(await calls(page), []);
  await page.getByRole("button", { name: /Message$/ }).click();
  await expect(page.getByText("1 selected companies", { exact: true })).toBeVisible();
  const call = (await calls(page)).find((call) => call.name === "companies_evidence_results");
  assert.equal(call.arguments.view, "matches");
});

test("evidence Message resolves 25 accepted companies through API-sized cursor pages", async (t) => {
  const payload = evidenceInitial();
  const data = payload.result.data;
  const companies = Array.from({ length: 25 }, (_, i) => ({
    ...data.companies[0],
    businessId: `evidence-${i}`,
    name: `Evidence company ${i}`,
  }));
  data.view = "matches";
  data.progress.confirmedMatches = 25;
  data.companies = companies.slice(0, 20);
  data.nextCursor = "evidence-page-2";
  const next = {
    ...data,
    companies: companies.slice(20),
    hasNextPage: false,
    nextCursor: "evidence-end",
  };
  const page = await open(t, { evidenceNext: next }, payload);
  await page.getByRole("button", { name: /Message$/ }).click();
  await expect(page.getByText("25 selected companies", { exact: true })).toBeVisible();
  const reads = (await calls(page)).filter((call) => call.name === "companies_evidence_results");
  assert.equal(reads.length, 2);
  assert.deepEqual(
    reads.map((call) => call.arguments.cursor),
    [undefined, "evidence-page-2"],
  );
  for (const { arguments: args } of reads) {
    assert.ok(args.pageSize <= 20);
    assert.equal(args.expectedRevision, data.expectedRevision);
    assert.equal(args.runId, data.runId);
    assert.equal(args.view, "matches");
  }
});

test("a new query replaces default selection and fences an unfinished audience read", async (t) => {
  const page = await open(t, { bulkSelection: true, holdSearch: true });
  await page.getByRole("checkbox", { name: "Select Helsinki Craft", exact: true }).uncheck();
  await page.getByRole("button", { name: /Message$/ }).click();
  await expect(page.getByText("Loading selected companies…", { exact: true })).toBeVisible();
  await expect.poll(async () => (await calls(page)).length).toBe(1);
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
  await expect(
    page.getByRole("checkbox", { name: "Select Helsinki Craft", exact: true }),
  ).toBeChecked();
  await expect(page.getByRole("button", { name: /Audience$/ })).toHaveAttribute(
    "aria-current",
    "step",
  );
  await page.getByRole("button", { name: /Message$/ }).click();
  await expect(page.getByText("1 selected companies", { exact: true })).toBeVisible();
  await expect
    .poll(async () => (await calls(page)).map((call) => call.name))
    .toEqual(["companies_search", "senders_inspect"]);
});

for (const payload of [initial(), evidenceInitial()]) {
  test(`company rows omit the visual header and select-all checkbox, with custom selection on the count: ${payload.result.tool}`, async (t) => {
    const page = await open(t, {}, payload);
    for (const width of [390, 1040]) {
      await page.setViewportSize({ width, height: 850 });
      assert.equal(
        await page
          .locator(".company-table-labels")
          .evaluate((el) => el.getBoundingClientRect().height),
        0,
      );
      await expect(
        page
          .locator(".company-results-bar")
          .getByRole("button", { name: "Select companies", exact: true }),
      ).toBeVisible();
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        true,
      );
    }
    await expect(
      page.locator(".company-results-bar input[type=checkbox], .company-selection-button svg"),
    ).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Select companies", exact: true })).toHaveText(
      payload.result.tool === "companies.search" ? "41 companies" : "1 accepted match so far",
    );
    await page.getByRole("button", { name: "Select companies", exact: true }).click();
    await expect(page.getByRole("radio", { name: "Clear selection", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Cancel", exact: true }).click();
    assert.deepEqual(await calls(page), []);
  });
}

test("message variations preserve all four exact copies through context, review and multichannel draft", async (t) => {
  const page = await open(t, { outreach: true });
  await selectOnly(page, "Nordic Studio");
  await page.getByRole("button", { name: /Message$/ }).click();
  await page.getByLabel("Facebook", { exact: true }).check();
  await page.getByLabel("LinkedIn invitation", { exact: true }).check();
  await page.getByLabel("Invitation note", { exact: true }).fill("Separate invitation");
  const copies = ["First version", "Second version", "Third version", "Fourth version"];
  await page.getByLabel("Message", { exact: true }).fill(copies[0]);
  for (let i = 1; i < 4; i++) {
    await page.getByRole("button", { name: "Add variation", exact: true }).click();
    await expect(page.getByRole("button", { name: "Review campaign", exact: true })).toBeDisabled();
    await page.getByLabel(`Message ${i + 1}`, { exact: true }).fill(copies[i]);
  }
  await expect(page.getByRole("button", { name: "Add variation", exact: true })).toHaveCount(0);
  await expect
    .poll(async () => (await workspaceContext(page))?.outreach?.messageVariants)
    .toEqual(copies);
  await page.getByRole("button", { name: "Review campaign", exact: true }).click();
  await expect(page.getByRole("button", { name: "Start campaign", exact: true })).toBeVisible();
  await expect(page.locator("blockquote")).toHaveText([
    ...copies,
    ...copies,
    "Separate invitation",
  ]);
  let recorded = await calls(page);
  assert.deepEqual(
    recorded.find((c) => c.name === "campaign_draft_prepare").arguments.messageVariants,
    copies,
  );
  assert.equal(
    recorded.some((c) => c.name === "campaign_launch"),
    false,
  );
  await page.getByRole("button", { name: "Edit message or channel", exact: true }).click();
  await page.getByRole("button", { name: "Remove variation 2", exact: true }).click();
  await expect(page.getByLabel("Message 2", { exact: true })).toHaveValue(copies[2]);
  await expect(page.getByLabel("Message 3", { exact: true })).toHaveValue(copies[3]);
  await page.getByLabel("Message 2", { exact: true }).fill("Revised second version");
  await page.getByRole("button", { name: "Review campaign", exact: true }).click();
  await expect(page.getByRole("button", { name: "Start campaign", exact: true })).toBeVisible();
  recorded = (await calls(page)).filter((c) => c.name === "campaign_draft_prepare");
  assert.deepEqual(recorded[1].arguments.messageVariants, [
    copies[0],
    "Revised second version",
    copies[3],
  ]);
  assert.notEqual(recorded[1].arguments.idempotencyKey, recorded[0].arguments.idempotencyKey);
});

test("message variations cannot silently accept a reordered server draft", async (t) => {
  const page = await open(t, { outreach: true, changedVariation: true });
  await selectOnly(page, "Nordic Studio");
  await page.getByRole("button", { name: /Message$/ }).click();
  await page.getByLabel("Message", { exact: true }).fill("First");
  await page.getByRole("button", { name: "Add variation", exact: true }).click();
  await page.getByLabel("Message 2", { exact: true }).fill("Second");
  await page.getByRole("button", { name: "Review campaign", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("draft did not match");
  await expect(page.getByRole("button", { name: "Start campaign", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Add variation", exact: true })).toBeDisabled();
  assert.equal(
    (await calls(page)).some((c) => c.name === "campaign_launch"),
    false,
  );
});

test("message variations keep the separate LinkedIn-only note and recover the same draft request", async (t) => {
  const page = await open(t, { outreach: true, uncertainDraft: true });
  await selectOnly(page, "Nordic Studio");
  await page.getByRole("button", { name: /Message$/ }).click();
  await page.getByLabel("Message", { exact: true }).fill("Saved social copy");
  await page.getByRole("button", { name: "Add variation", exact: true }).click();
  await page.getByLabel("Message 2", { exact: true }).fill("Alternative social copy");
  await page.getByLabel("Instagram", { exact: true }).uncheck();
  await page.getByLabel("LinkedIn invitation", { exact: true }).check();
  await expect(page.getByRole("button", { name: "Add variation", exact: true })).toHaveCount(0);
  await page.getByLabel("Invitation note", { exact: true }).fill("Invitation only");
  await page.getByLabel("Instagram", { exact: true }).check();
  await expect(page.getByLabel("Message 2", { exact: true })).toHaveValue(
    "Alternative social copy",
  );
  await page.getByRole("button", { name: "Review campaign", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Response unavailable");
  await expect(
    page.getByRole("button", { name: "Remove variation 2", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Review campaign", exact: true }).click();
  await expect(page.getByRole("button", { name: "Start campaign", exact: true })).toBeVisible();
  const attempts = (await calls(page)).filter((c) => c.name === "campaign_draft_prepare");
  assert.deepEqual(attempts[0].arguments, attempts[1].arguments);
  assert.deepEqual(attempts[0].arguments.messageVariants, [
    "Saved social copy",
    "Alternative social copy",
  ]);
  assert.equal(attempts[0].arguments.linkedinInviteNote, "Invitation only");
});

test("message variation controls stay compact and localized in Finnish", async (t) => {
  const page = await open(t, { outreach: true, bulkSelection: true, locale: "fi-FI" });
  await page.setViewportSize({ width: 380, height: 850 });
  await page.getByRole("button", { name: /Viesti$/ }).click();
  await page.getByLabel("Viesti", { exact: true }).fill("Ensimmäinen viesti");
  await page.getByRole("button", { name: "Lisää variaatio", exact: true }).click();
  await page.getByLabel("Viesti 2", { exact: true }).fill("Toinen viesti");
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    true,
  );
  await page.getByRole("button", { name: "Poista variaatio 2", exact: true }).click();
  await expect(page.getByLabel("Viesti", { exact: true })).toHaveValue("Ensimmäinen viesti");
  await expect(page.getByRole("button", { name: /Poista variaatio/ })).toHaveCount(0);
});

for (const options of [
  {},
  { emailSetup: true, mailboxPaused: true, smsSetup: true, smsDisabled: true },
]) {
  test(`outreach hides channels without usable workspace setup ${JSON.stringify(options)}`, async (t) => {
    const page = await open(t, { outreach: true, ...options });
    await selectOnly(page, "Nordic Studio");
    await page.getByRole("button", { name: /Message$/ }).click();
    await expect
      .poll(
        async () => (await calls(page)).filter((call) => call.name === "senders_inspect").length,
      )
      .toBe(1);
    await expect(page.getByText("Checking email and SMS setup…")).toHaveCount(0);
    await expect(page.getByRole("checkbox", { name: "Email", exact: true })).toHaveCount(0);
    await expect(page.getByRole("checkbox", { name: "SMS", exact: true })).toHaveCount(0);
  });
}

for (const mode of ["gmail", "sms", "both"]) {
  test(`outreach reviews and starts configured ${mode} with exact sender and recipients`, async (t) => {
    const smsBody = "S".repeat(1600);
    const page = await open(t, {
      outreach: true,
      emailSetup: true,
      smsSetup: true,
      uncertainDraft: true,
      hostContext: { theme: "dark" },
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await selectOnly(page, "Nordic Studio");
    await page.getByRole("button", { name: /Message$/ }).click();
    await page.getByRole("checkbox", { name: "Instagram", exact: true }).uncheck();
    if (mode !== "sms") {
      await page.getByRole("checkbox", { name: "Email", exact: true }).check();
      await page.getByLabel("Send email from").selectOption("mailbox-one");
      await expect(page.getByLabel("Send email from").locator("option")).toHaveCount(2);
      await page.getByLabel("Email subject").fill("An idea for your team");
      await page
        .getByLabel("Message", { exact: true })
        .fill("Email message for the selected company");
      await expect(
        page.getByRole("button", { name: "Review campaign", exact: true }),
      ).toBeDisabled();
      await page.getByLabel("I have permission to email these recipients.").check();
    }
    if (mode !== "gmail") {
      await page.getByRole("checkbox", { name: "SMS", exact: true }).check();
      await expect(page.getByLabel("SMS message", { exact: true })).toHaveAttribute(
        "maxlength",
        "1600",
      );
      await page.getByLabel("SMS message", { exact: true }).fill(smsBody);
      await expect(page.getByText("1600/1600", { exact: true })).toBeVisible();
    }
    if (mode === "both")
      await page.screenshot({
        path: new URL("outreach-email-sms-composer-dark-phone.png", artifacts).pathname,
        fullPage: true,
      });
    await page.getByRole("button", { name: "Review campaign", exact: true }).click();
    await expect(page.getByRole("alert")).toContainText("Response unavailable");
    await page.getByRole("button", { name: "Review campaign", exact: true }).click();
    await expect(page.getByRole("button", { name: "Start campaign", exact: true })).toBeVisible();
    const attempts = (await calls(page)).filter((call) => call.name === "campaign_draft_prepare");
    assert.equal(attempts.length, 2);
    assert.deepEqual(attempts[0].arguments, attempts[1].arguments);
    const draft = attempts[0].arguments;
    assert.deepEqual(draft.channels, mode === "both" ? ["gmail", "sms"] : [mode]);
    assert.equal(draft.expectedTargetCount, mode === "both" ? 2 : 1);
    if (mode !== "sms") {
      assert.deepEqual(draft.mailboxIds, ["mailbox-one"]);
      assert.equal(draft.gmailSubject, "An idea for your team");
      assert.equal(draft.gmailRecipientConsentConfirmed, true);
      await expect(page.getByRole("region", { name: "Email", exact: true })).toContainText(
        "sender@example.com",
      );
    }
    if (mode !== "gmail") {
      assert.equal(draft.smsBody, smsBody);
      await expect(page.getByRole("region", { name: "SMS", exact: true })).toContainText(smsBody);
    }
    if (mode === "sms") assert.deepEqual(draft.messageVariants, [smsBody]);
    await page.locator(".outreach-audience summary").click();
    if (mode !== "sms")
      await expect(page.locator(".outreach-audience")).toContainText("recipient@example.com");
    if (mode !== "gmail")
      await expect(page.locator(".outreach-audience")).toContainText("+358409876543");
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true,
    );
    if (mode === "both")
      await page.screenshot({
        path: new URL("outreach-email-sms-dark-phone.png", artifacts).pathname,
        fullPage: true,
      });
    assert.equal(
      (await calls(page)).some((call) => call.name === "campaign_launch"),
      false,
    );
    await page.getByRole("button", { name: "Start campaign", exact: true }).click();
    await expect(page.getByRole("region", { name: "Campaigns", exact: true })).toBeAttached();
    assert.equal((await calls(page)).filter((call) => call.name === "campaign_launch").length, 1);
  });
}

test("outreach retries failed sender inspection without preparing outreach", async (t) => {
  const page = await open(t, {
    outreach: true,
    emailSetup: true,
    smsSetup: true,
    sendersError: true,
  });
  await selectOnly(page, "Nordic Studio");
  await page.getByRole("button", { name: /Message$/ }).click();
  await expect(page.getByText("Could not check email and SMS setup.")).toBeVisible();
  await page.getByRole("button", { name: "Retry channel setup" }).click();
  await expect(page.getByRole("checkbox", { name: "Email", exact: true })).toBeVisible();
  await expect(page.getByRole("checkbox", { name: "SMS", exact: true })).toBeVisible();
  assert.deepEqual(
    (await calls(page)).map((call) => call.name),
    ["senders_inspect", "senders_inspect"],
  );
});

for (const mode of ["missingChannelCounts", "changedSender", "noSmsRoutes"]) {
  test(`outreach blocks ${mode} for configured channels`, async (t) => {
    const page = await open(t, { outreach: true, emailSetup: true, smsSetup: true, [mode]: true });
    await selectOnly(page, "Nordic Studio");
    await page.getByRole("button", { name: /Message$/ }).click();
    await page.getByRole("checkbox", { name: "Instagram", exact: true }).uncheck();
    if (mode === "noSmsRoutes") {
      await page.getByRole("checkbox", { name: "SMS", exact: true }).check();
      await page.getByLabel("SMS message", { exact: true }).fill("Hello");
    } else {
      await page.getByRole("checkbox", { name: "Email", exact: true }).check();
      await page.getByLabel("Send email from").selectOption("mailbox-one");
      await page.getByLabel("Email subject").fill("Hello");
      await page.getByLabel("Message", { exact: true }).fill("Hello");
      await page.getByLabel("I have permission to email these recipients.").check();
    }
    await page.getByRole("button", { name: "Review campaign", exact: true }).click();
    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page.getByRole("button", { name: "Start campaign", exact: true })).toHaveCount(0);
  });
}

test("editable company chat drafts stay in the composer and safe areas follow host changes", async (t) => {
  const page = await open(t, {
    draftMessages: true,
    hostContext: {
      platform: "desktop",
      safeAreaInsets: { top: 12, right: 8, bottom: 72, left: 8 },
    },
  });
  await page.getByRole("button", { name: /Nordic Studio/ }).click();
  await page.getByRole("button", { name: "Draft chat request", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Chat draft ready");
  const messages = await page.evaluate(() => window.__messages);
  assert.equal(messages.length, 1);
  assert.deepEqual(messages[0]._meta, { "openai/message": { target: "active", send: false } });
  assert.match(messages[0].content[1].uri, /^dmfaster:\/\/companies\/FI\//);
  assert((await calls(page)).every((call) => call.name === "company_inspect"));
  assert.equal(await page.evaluate(() => getComputedStyle(document.body).paddingBottom), "72px");
  await page.evaluate(() =>
    window.postMessage(
      {
        jsonrpc: "2.0",
        method: "ui/notifications/host-context-changed",
        params: { safeAreaInsets: { top: 0, right: 0, bottom: 0, left: 0 } },
      },
      "*",
    ),
  );
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.body).paddingBottom))
    .toBe("0px");
});
test("mobile hosts expose context sharing without an immediate-send draft substitute", async (t) => {
  const page = await open(t, { draftMessages: true, hostContext: { platform: "mobile" } });
  await page.getByRole("button", { name: /Nordic Studio/ }).click();
  await expect(page.getByRole("button", { name: "Draft chat request", exact: true })).toHaveCount(
    0,
  );
  await page.getByRole("button", { name: "Use this company in chat", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Added to chat context");
  assert.deepEqual(await page.evaluate(() => window.__messages), []);
});

for (const theme of ["light", "dark"]) {
  for (const [width, height] of [
    [375, 812],
    [768, 1024],
    [1440, 900],
  ]) {
    test(`MCP chat draft layout ${theme} ${width}`, async (t) => {
      const page = await open(t, {
        draftMessages: true,
        hostContext: {
          theme,
          platform: "desktop",
          safeAreaInsets: { top: 12, right: 8, bottom: 72, left: 8 },
        },
      });
      await page.setViewportSize({ width, height });
      await page.getByRole("button", { name: /Nordic Studio/ }).click();
      const draft = page.getByRole("button", { name: "Draft chat request", exact: true });
      await draft.scrollIntoViewIfNeeded();
      await expect(draft).toBeVisible();
      const box = await page.getByRole("dialog", { name: "Company details" }).boundingBox();
      assert(box.x >= 8 - 1 && box.x + box.width <= width - 8 + 1);
      assert(box.y >= 12 - 1 && box.y + box.height <= height - 72 + 1);
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),
        false,
      );
      const directory = new URL("../../../.local-ci/mcp-guidance-upgrades/", import.meta.url);
      mkdirSync(directory, { recursive: true });
      await page.screenshot({ path: new URL(`draft-${theme}-${width}.png`, directory).pathname });
    });
  }
}
