import assert from "node:assert/strict";
import { before, after, test } from "node:test";
import { createRequire } from "node:module";
import { readFile, mkdir } from "node:fs/promises";
import { INSTAGRAM_WORKSPACE_HTML } from "../src/instagram-workspace-html.ts";
import { initial, evaluation, installInstagramHost, png } from "./instagram-fixture.mjs";
const require = createRequire(new URL("../../../site/package.json", import.meta.url));
const { chromium, expect } = require("@playwright/test");
let browser;
before(async () => {
  browser = await chromium.launch({ headless: true });
});
after(async () => {
  await browser?.close();
});
async function open(t, options = {}) {
  const page = await browser.newPage({
    viewport: options.mobile ? { width: 390, height: 844 } : { width: 1100, height: 900 },
  });
  t.after(() => page.close());
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  t.after(() => assert.deepEqual(errors, []));
  await page.addInitScript(installInstagramHost, {
    payload: initial(),
    options,
    png,
    second: evaluation(4),
  });
  await page.route("https://instagram-ui.test/", (r) =>
    r.fulfill({ contentType: "text/html", body: INSTAGRAM_WORKSPACE_HTML }),
  );
  await page.goto("https://instagram-ui.test/");
  await expect(
    page.getByRole("heading", { name: "Instagram prospecting", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("4 loaded of 6 saved profiles", { exact: false })).toBeVisible();
  return page;
}
const calls = (page) => page.evaluate(() => window.__calls);
test("initial receipt renders without repeated reads; exports preserve review and exclude pending/negative cases", async (t) => {
  const page = await open(t);
  assert.deepEqual(await calls(page), []);
  await expect(
    page.getByRole("button", { name: "Provisional matches 1", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("checkbox", { name: "Include creator_3" })).toBeDisabled();
  await expect(page.getByRole("checkbox", { name: "Include creator_4" })).toBeDisabled();
  await page.getByRole("button", { name: "Select loaded matches" }).click();
  await page.getByRole("checkbox", { name: "Include creator_2" }).check();
  await expect(page.getByText("2 selected · 1 require review", { exact: true })).toBeVisible();
  const downloading = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export shortlist CSV" }).click();
  const download = await downloading;
  const csv = await readFile(await download.path(), "utf8");
  assert(csv.includes('"review","true"'));
  assert(csv.includes('"\'=HOSTILE()"'));
  assert(!csv.includes("creator_3"));
  assert(!csv.includes("creator_4"));
  assert.deepEqual(await calls(page), []);
});
test("pagination counts only loaded profiles and carries the exact policy and cursor", async (t) => {
  const page = await open(t);
  await page.getByRole("button", { name: "Load next page" }).click();
  await expect(page.getByText("6 loaded of 6 saved profiles", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Provisional matches 2", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Load next page" })).toBeDisabled();
  const recorded = await calls(page);
  assert.equal(recorded.length, 1);
  assert.equal(recorded[0].name, "instagram_profiles_evaluate");
  assert.equal(recorded[0].args.cursor, "next");
  assert.equal(recorded[0].args.spec.query, initial().evaluation.spec.query);
});
test("profile evidence renders literal hostile text and original cached pixels without external requests", async (t) => {
  const page = await open(t);
  const requests = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.getByRole("button", { name: "@creator_1", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Example creator 1", exact: true })).toBeVisible();
  await expect(page.locator(".profile-biography")).toContainText("<img src=x");
  await expect(page.getByRole("img", { name: "Original saved image 1" })).toBeVisible();
  assert.equal(await page.evaluate(() => window.__injected), undefined);
  assert.deepEqual(requests, []);
  assert.deepEqual(
    (await calls(page)).map((c) => c.name),
    ["instagram_profile_inspect"],
  );
  await page.getByRole("button", { name: "Open Instagram profile" }).click();
  await expect
    .poll(() => page.evaluate(() => window.__links))
    .toEqual(["https://www.instagram.com/creator_1/"]);
});
test("late page results cannot replace a new chat policy and clear selections on refinement", async (t) => {
  const page = await open(t, { holdMore: true });
  await page.getByRole("button", { name: "Select loaded matches" }).click();
  await page.getByRole("button", { name: "Load next page" }).click();
  await expect.poll(() => page.evaluate(() => window.__pending.length)).toBe(1);
  const next = initial({
    policyHash: "f".repeat(64),
    spec: { ...initial().evaluation.spec, query: "A new user-defined ICP" },
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
  await expect(page.getByText("0 selected · 0 require review", { exact: true })).toBeVisible();
  await page.evaluate(() => window.__release("instagram_profiles_evaluate"));
  await expect(page.getByText("4 loaded of 6 saved profiles", { exact: false })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Describe your Instagram ICP" })).toHaveValue(
    "A new user-defined ICP",
  );
});
test("closing a held profile fences its late result", async (t) => {
  const page = await open(t, { holdProfiles: true });
  await page.getByRole("button", { name: "@creator_1", exact: true }).click();
  await expect(page.getByText("Loading original evidence…", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Close profile evidence" }).click();
  await page.evaluate(() => window.__release("instagram_profile_inspect"));
  await expect(page.getByRole("region", { name: "Profile evidence" })).toHaveCount(0);
});
test("brief sharing and acquisition quotes never call paid start or qualification tools", async (t) => {
  const page = await open(t);
  await page
    .getByRole("textbox", { name: "Describe your Instagram ICP" })
    .fill("Freelance tattoo artists in Copenhagen");
  await page.getByRole("button", { name: "Share ICP with chat" }).click();
  await expect(page.getByText("ICP shared with chat.", { exact: true })).toBeVisible();
  const contexts = await page.evaluate(() => window.__contexts);
  assert.equal(contexts[0].structuredContent.query, "Freelance tattoo artists in Copenhagen");
  await page.getByRole("textbox", { name: "Instagram account", exact: true }).fill("small_course");
  await page.getByRole("button", { name: "Preview extraction credits" }).click();
  await expect(
    page.getByText("Enrichment and qualification costs are separate.", { exact: false }),
  ).toBeVisible();
  const recorded = await calls(page);
  assert.deepEqual(
    recorded.map((c) => c.name),
    ["instagram_acquisition_quote"],
  );
  assert.equal(recorded[0].args.source.count, 1000);
  assert.equal(recorded[0].args.spec.query, initial().evaluation.spec.query);
  await page.getByRole("textbox", { name: "Instagram account", exact: true }).fill("new_source");
  await expect(
    page.getByText("Enrichment and qualification costs are separate.", { exact: false }),
  ).toHaveCount(0);
});
test("permission failures remain visible with no replacement extraction", async (t) => {
  const page = await open(t, { failQuote: true });
  await page.getByRole("textbox", { name: "Instagram account", exact: true }).fill("small_course");
  await page.getByRole("button", { name: "Preview extraction credits" }).click();
  await expect(page.getByRole("alert")).toHaveText("Workspace permission required");
  assert.deepEqual(
    (await calls(page)).map((c) => c.name),
    ["instagram_acquisition_quote"],
  );
});
test("mobile dark view keeps exact counts and profile controls usable", async (t) => {
  const page = await open(t, { mobile: true, theme: "dark" });
  await expect(page.getByRole("button", { name: "Pending 1", exact: true })).toBeVisible();
  assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), "dark");
  await page.getByRole("button", { name: "Review 1", exact: true }).click();
  await expect(page.getByRole("button", { name: "@creator_2", exact: true })).toBeVisible();
  const directory = new URL("../../../outputs/instagram-workspace-preview/", import.meta.url);
  await mkdir(directory, { recursive: true });
  await page.screenshot({
    path: new URL("synthetic-mobile-dark.png", directory).pathname,
    fullPage: true,
  });
});
