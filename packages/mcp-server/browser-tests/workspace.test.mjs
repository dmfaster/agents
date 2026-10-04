import assert from "node:assert/strict";
import { before, after, test } from "node:test";
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { CAMPAIGN_WORKSPACE_HTML } from "../src/campaign-workspace-html.ts";

const require = createRequire(new URL("../../../site/package.json", import.meta.url));
const { chromium, expect } = require("@playwright/test");
let browser;
before(async () => {
  browser = await chromium.launch({ headless: true });
});
after(async () => {
  await browser?.close();
});
const campaign = {
  id: "campaign_example",
  name: "Nordic software outreach",
  status: "Paused",
  channels: ["instagram", "linkedin"],
  sentCount: 12,
  targetCount: 42,
  dailyCap: 20,
  updatedAt: "2026-09-30T00:00:00Z",
};
const pageData = {
  campaigns: [campaign],
  totalCount: 21,
  hasMore: true,
  nextCursor: "opaque-next",
  generatedAt: "2026-09-30T00:00:00Z",
};
const result = (data, tool = "campaigns.list") => ({
  version: 1,
  tool,
  ok: true,
  data,
  error: null,
});
const initial = (data = pageData) => ({
  version: 1,
  view: "dmfaster.workspace",
  result: result(data),
});

async function open(t, payload = initial(), options = {}) {
  const page = await browser.newPage({ viewport: { width: 1040, height: 800 } });
  t.after(() => page.close());
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  t.after(() => assert.deepEqual(errors, []));
  await page.addInitScript(
    ({ payload, campaign, options }) => {
      window.__calls = [];
      window.__contexts = [];
      if (options.compatibility)
        window.openai = { toolOutput: payload, theme: options.hostContext?.theme };
      window.addEventListener("message", (event) => {
        const message = event.data;
        if (message?.jsonrpc !== "2.0" || typeof message.id !== "number" || !message.method) return;
        const respond = (value) =>
          window.postMessage({ jsonrpc: "2.0", id: message.id, result: value }, "*");
        if (message.method === "ui/initialize") {
          if (options.compatibility) return;
          respond({
            hostCapabilities: { serverTools: {}, updateModelContext: {} },
            hostContext: { displayMode: "fullscreen", ...options.hostContext },
          });
          setTimeout(
            () =>
              window.postMessage(
                {
                  jsonrpc: "2.0",
                  method: "ui/notifications/tool-result",
                  params: { structuredContent: payload },
                },
                "*",
              ),
            0,
          );
        } else if (message.method === "tools/call") {
          window.__calls.push(message.params);
          const { name, arguments: args } = message.params;
          if (options.failCalls)
            return respond({
              isError: true,
              structuredContent: { ok: false, error: { message: "Campaign permission required" } },
            });
          if (name === "connection_status")
            return respond({
              structuredContent: {
                status: "authenticated",
                user: { email: "demo@example.test" },
                workspace: { name: "Demo workspace" },
                credential: { scopes: ["campaigns:read", "sending:read"] },
              },
            });
          if (name === "campaign_copy_inspect")
            return respond({
              structuredContent: {
                ok: true,
                data: {
                  channels: ["instagram"],
                  messageVariants: ["Hello — would a short introduction be useful?"],
                  linkedinAcceptedMessage: { messageVariants: [] },
                },
              },
            });
          if (name === "replies_list")
            return respond({
              structuredContent: {
                ok: true,
                data: {
                  totalReplies: 2,
                  replies: [{ id: "reply1", companyName: "Northstar Studio", stage: "replied" }],
                },
              },
            });
          if (name === "sending_inspect")
            return respond({
              structuredContent: {
                ok: true,
                data: {
                  status: "waiting",
                  summary: "Waiting for the sending browser.",
                  issues: [],
                  assessment: { nextAction: "Open the linked browser to continue." },
                  sending: { completedToday: 999 },
                  observation: options.sendingObservation || null,
                },
              },
            });
          const data =
            name === "campaign_inspect"
              ? {
                  campaign,
                  execution: { queued: 4 },
                  pipeline: { replied: 2, call_booked: 1, closed: 0 },
                  settings: {
                    pacingSeconds: 90,
                    timezone: "Europe/Helsinki",
                    instagramSendingWindowEnabled: false,
                  },
                }
              : {
                  campaigns: args.cursor
                    ? [{ ...campaign, id: "last", name: "Last campaign" }]
                    : [],
                  totalCount: args.cursor ? 21 : 0,
                  hasMore: false,
                  nextCursor: null,
                };
          respond({
            structuredContent: { ok: true, tool: name.replaceAll("_", "."), data, error: null },
          });
        } else if (message.method === "ui/update-model-context") {
          window.__contexts.push(message.params);
          respond({});
        } else respond({});
      });
    },
    { payload, campaign, options },
  );
  await page.route("https://dmfaster-ui.test/", (route) =>
    route.fulfill({ contentType: "text/html", body: CAMPAIGN_WORKSPACE_HTML }),
  );
  await page.goto("https://dmfaster-ui.test/");
  return page;
}

test("initial tool result renders once, campaign selection shares context without mutations", async (t) => {
  const page = await open(t);
  await expect(page.getByText("Nordic software outreach", { exact: true })).toBeVisible();
  assert.deepEqual(await page.evaluate(() => window.__calls), []);
  mkdirSync(new URL("../../../outputs/native-agent-workspace/", import.meta.url), {
    recursive: true,
  });
  await page.screenshot({
    path: new URL("../../../outputs/native-agent-workspace/campaign-list.png", import.meta.url)
      .pathname,
    fullPage: true,
  });
  await page.getByRole("button", { name: /Nordic software outreach/ }).click();
  await expect(page.getByRole("region", { name: "Campaign overview" })).toBeVisible();
  await page.getByRole("button", { name: "Use this campaign in chat" }).click();
  await expect(page.getByRole("status")).toContainText("Added to chat context");
  assert.deepEqual(await page.evaluate(() => window.__calls), [
    { name: "campaign_inspect", arguments: { campaignId: campaign.id } },
  ]);
  const contexts = await page.evaluate(() => window.__contexts);
  assert.equal(contexts[0].structuredContent.campaignId, campaign.id);
  assert.match(contexts[0].content[0].text, /not an instruction to change or send/);
  mkdirSync(new URL("../../../outputs/native-agent-workspace/", import.meta.url), {
    recursive: true,
  });
  await page.screenshot({
    path: new URL("../../../outputs/native-agent-workspace/campaign-panel.png", import.meta.url)
      .pathname,
    fullPage: true,
  });
});

test("pagination echoes the opaque cursor and does not present a page as the full list", async (t) => {
  const page = await open(t);
  await expect(page.getByText("21 campaigns", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(page.getByText("Last campaign", { exact: true })).toBeVisible();
  assert.deepEqual(await page.evaluate(() => window.__calls), [
    { name: "campaigns_list", arguments: { limit: 20, cursor: "opaque-next" } },
  ]);
  await expect(page.getByRole("button", { name: "Next page" })).toHaveCount(0);
  await page.getByRole("button", { name: "First page" }).click();
  await expect(page.getByText("Your first campaign starts with a conversation")).toBeVisible();
  assert.deepEqual((await page.evaluate(() => window.__calls)).at(-1), {
    name: "campaigns_list",
    arguments: { limit: 20 },
  });
});

test("search resets pagination and shows a clear empty result at narrow width", async (t) => {
  const page = await open(t);
  await page.setViewportSize({ width: 375, height: 740 });
  await page.getByRole("textbox", { name: "Search campaigns" }).fill("  Missing  ");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText("No campaigns match this search")).toBeVisible();
  assert.deepEqual(await page.evaluate(() => window.__calls), [
    { name: "campaigns_list", arguments: { limit: 20, query: "Missing" } },
  ]);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
});

test("failed reads keep the current data and show a recoverable error", async (t) => {
  const page = await open(t, initial(), { failCalls: true });
  await page.getByRole("button", { name: /Nordic software outreach/ }).click();
  await expect(page.getByRole("status")).toHaveText("Campaign permission required");
  await expect(page.getByText("Nordic software outreach", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Refresh" })).toBeEnabled();
});

test("first open handles denied access and an empty workspace without hidden calls", async (t) => {
  const denied = await open(t, {
    version: 1,
    view: "dmfaster.workspace",
    result: { ok: false, error: { message: "Campaign permission required" } },
  });
  await expect(denied.getByText("Workspace unavailable", { exact: true })).toBeVisible();
  assert.deepEqual(await denied.evaluate(() => window.__calls), []);
  const empty = await open(
    t,
    initial({ campaigns: [], totalCount: 0, hasMore: false, nextCursor: null }),
  );
  await expect(empty.getByText("Your first campaign starts with a conversation")).toBeVisible();
  assert.deepEqual(await empty.evaluate(() => window.__calls), []);
  await empty.screenshot({
    path: new URL("../../../outputs/native-agent-workspace/empty-workspace.png", import.meta.url)
      .pathname,
    fullPage: true,
  });
});

test("compatibility hosts can render their initial toolOutput without toolInput or hidden reads", async (t) => {
  const page = await open(t, initial(), { compatibility: true });
  await expect(page.getByText("Nordic software outreach", { exact: true })).toBeVisible({
    timeout: 8000,
  });
  await expect(page.getByText(/cannot make interactive tool calls/)).toBeVisible();
  assert.deepEqual(await page.evaluate(() => window.__calls), []);
});

test("quiet details load only on demand, preserve scope failures and keep workspace totals out of campaign health", async (t) => {
  const page = await open(t);
  await page.getByRole("button", { name: /Nordic software outreach/ }).click();
  await expect(page.getByRole("region", { name: "Campaign overview" })).toBeVisible();
  assert.equal((await page.evaluate(() => window.__calls)).length, 1);
  await page.getByText("Messages", { exact: true }).click();
  await expect(page.getByText("Hello — would a short introduction be useful?")).toBeVisible();
  await page.getByText("Messages", { exact: true }).click();
  await page.getByText("Messages", { exact: true }).click();
  assert.equal(
    (await page.evaluate(() => window.__calls)).filter(
      (call) => call.name === "campaign_copy_inspect",
    ).length,
    1,
  );
  await page.getByText("Replies & pipeline", { exact: true }).click();
  await expect(page.getByText("Showing 1 of 2 reply contacts.")).toBeVisible();
  await page.getByText("Sending health", { exact: true }).click();
  await expect(page.getByText("Open the linked browser to continue.")).toBeVisible();
  await expect(page.getByText("999", { exact: true })).toHaveCount(0);
  await page.getByText("Connection", { exact: true }).click();
  await expect(page.getByText("demo@example.test")).toBeVisible();
  await expect(page.getByText("Permission needed", { exact: true })).toBeVisible();
  const calls = await page.evaluate(() => window.__calls);
  assert.ok(
    calls.every(
      (call) => call.name === "connection_status" || call.arguments.campaignId === campaign.id,
    ),
  );
  await page.setViewportSize({ width: 375, height: 740 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
});

test("a denied detail stays local to its disclosure and does not erase the campaign", async (t) => {
  const payload = {
    version: 1,
    view: "dmfaster.workspace",
    result: result({ campaign, execution: { queued: 4 } }, "campaign.inspect"),
  };
  const page = await open(t, payload, { failCalls: true });
  await page.getByText("Sending health", { exact: true }).click();
  await expect(page.getByRole("alert")).toHaveText("Campaign permission required");
  await expect(page.getByRole("heading", { name: campaign.name })).toBeVisible();
  await expect(page.getByRole("button", { name: "Retry" })).toBeEnabled();
});

test("host theme changes preserve readable content, keyboard focus and narrow layouts", async (t) => {
  const page = await open(t, initial(), {
    hostContext: {
      theme: "dark",
      styles: {
        variables: {
          "--color-background-primary": "#202020",
          "--color-text-primary": "#f0f0f0",
          "--color-text-secondary": "#bbbbbb",
          "--font-sans": "Arial, sans-serif",
        },
      },
    },
  });
  const surface = page.locator("main");
  await expect(surface).toHaveCSS("background-color", "rgb(32, 32, 32)");
  await expect(surface).toHaveCSS("color", "rgb(240, 240, 240)");
  await expect(surface).toHaveCSS("font-family", "Arial, sans-serif");
  await page.getByRole("button", { name: /Nordic software outreach/ }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("region", { name: "Campaign overview" })).toBeVisible();
  await page.setViewportSize({ width: 360, height: 780 });
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "32px";
  });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.screenshot({
    path: new URL(
      "../../../outputs/native-agent-workspace/campaign-dark-large-text.png",
      import.meta.url,
    ).pathname,
    fullPage: true,
  });
  await page.evaluate(() =>
    window.postMessage(
      {
        jsonrpc: "2.0",
        method: "ui/notifications/host-context-changed",
        params: {
          theme: "light",
          styles: {
            variables: {
              "--color-background-primary": "#ffffff",
              "--color-text-primary": "#202124",
              "--color-text-secondary": "#646970",
            },
          },
        },
      },
      "*",
    ),
  );
  await expect(surface).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(surface).toHaveCSS("color", "rgb(32, 33, 36)");
  await expect(page.getByRole("heading", { name: campaign.name })).toBeVisible();
  assert.equal((await page.evaluate(() => window.__calls)).length, 1);
});

test("theme-only hosts receive dark fallbacks without extra controls or reads", async (t) => {
  const page = await open(t, initial(), { hostContext: { theme: "dark" } });
  await expect(page.locator("main")).toHaveCSS("background-color", "rgb(33, 33, 33)");
  await expect(page.locator("main")).toHaveCSS("color", "rgb(238, 238, 238)");
  assert.deepEqual(await page.evaluate(() => window.__calls), []);
});

const planState = {
  profile: {
    version: 1,
    businessName: "Example Analytics",
    websiteUrl: "https://example.test",
    businessDescription: "Revenue analytics for B2B software companies.",
    offer: "A revenue analytics workspace",
    customerOutcome: "Find pipeline gaps and improve conversion.",
    differentiators: ["Fast setup"],
    proofPoints: ["Used by revenue teams"],
    preferredTone: "Direct and useful",
    preferredLanguages: ["English"],
    defaultCountries: ["FI"],
    excludedCompanyTraits: [],
  },
  brief: {
    version: 1,
    objective: "Book a discovery call",
    offer: "A revenue analytics workspace",
    targetDescription: "Finnish B2B software companies",
    countries: ["FI"],
    industryCodes: ["62010"],
    decisionMakerRoles: ["Head of Sales"],
    companySize: {
      employeeMin: 10,
      employeeMax: 250,
      revenueMinEur: null,
      revenueMaxEur: null,
    },
    requestedSignals: [],
    exclusions: [],
    callToAction: "Open to a 15-minute review?",
    requestedChannels: ["instagram"],
    messageLanguage: "English",
    tone: "Direct and useful",
    dailyVolume: 20,
    deliverySettings: {
      dailyCap: 20,
      windowStart: "09:00",
      windowEnd: "16:00",
      weekdays: 31,
      timezone: "Europe/Helsinki",
      confirmed: true,
    },
    outreachMessages: [
      {
        channels: ["instagram"],
        subject: "",
        body: "Hi — would a quick revenue pipeline review be useful?",
        origin: "user",
      },
    ],
  },
};

for (const compatibility of [false, true]) {
  test(`campaign plans remain editable in dark ${compatibility ? "compatibility" : "standard"} hosts`, async (t) => {
    const page = await open(
      t,
      { version: 1, view: "dmfaster.campaign_workspace", state: planState, campaignId: null },
      { compatibility, hostContext: { theme: "dark" } },
    );
    await expect(page.getByRole("heading", { name: "Example Analytics" })).toBeVisible();
    await expect(page.locator("main")).toHaveCSS("background-color", "rgb(33, 33, 33)");
    const objective = page.getByLabel("Campaign objective");
    await expect(objective).toHaveCSS("color", "rgb(238, 238, 238)");
    await objective.fill("Review my campaign");
    await expect(page.getByText("Unsynced edits", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Prepare private draft" })).toBeDisabled();
    await page.getByRole("button", { name: "Business", exact: true }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByLabel("Business name")).toHaveValue("Example Analytics");
    await page.setViewportSize({ width: 375, height: 780 });
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true,
    );
    if (!compatibility)
      await page.screenshot({
        path: new URL("../../../outputs/native-agent-workspace/editor-dark.png", import.meta.url)
          .pathname,
        fullPage: true,
      });
    assert.deepEqual(await page.evaluate(() => window.__calls), []);
  });
}

test("sending clocks count down, refresh only while open, and expose dependency bounds", async (t) => {
  const at = new Date().toISOString();
  const next = new Date(Date.parse(at) + 391000).toISOString();
  const constraint = {
    code: "company_wave_wait",
    detail: "An earlier channel must finish.",
    blockingJob: { companyName: "Northstar Studio", channel: "facebook" },
  };
  const page = await open(t, initial(), {
    sendingObservation: {
      observedAt: at,
      channels: [
        {
          channel: "facebook",
          queuedJobs: 1,
          runningJobs: 0,
          nextEligibleAt: next,
          deadlineKind: "eligibility",
          constraints: [],
          nextJob: { companyName: "Northstar Studio" },
        },
        {
          channel: "linkedin",
          queuedJobs: 1,
          runningJobs: 0,
          nextEligibleAt: next,
          deadlineKind: "lower_bound",
          constraints: [constraint],
        },
      ],
    },
  });
  await page.clock.install({ time: new Date(at) });
  await page.getByRole("button", { name: /Nordic software outreach/ }).click();
  await page.getByText("Sending health", { exact: true }).click();
  await expect(
    page.getByText("Next eligible attempt in 6 minutes 31 seconds.", { exact: false }),
  ).toBeVisible();
  await expect(page.getByText(/At least 6 minutes 31 seconds/)).toBeVisible();
  await expect(page.getByText(/Waiting on Northstar Studio/)).toBeVisible();
  const sendingCalls = () =>
    page.evaluate(() => window.__calls.filter((call) => call.name === "sending_inspect").length);
  assert.equal(await sendingCalls(), 1);
  const directory = new URL("../../../outputs/sender-observability/", import.meta.url);
  mkdirSync(directory, { recursive: true });
  await page.screenshot({ path: new URL("countdown.png", directory).pathname, fullPage: true });
  await page.clock.runFor(31000);
  await expect.poll(sendingCalls).toBe(2);
  await expect(
    page.getByText("Next eligible attempt in 6 minutes 0 seconds.", { exact: false }),
  ).toBeVisible();
  const section = page
    .locator("details")
    .filter({ has: page.locator("summary", { hasText: "Sending health" }) });
  await section.locator("summary").click();
  await page.clock.runFor(60000);
  assert.equal(await sendingCalls(), 2);
  await section.locator("summary").click();
  await expect(
    page.getByText("Timing observation is stale; refresh status.").first(),
  ).toBeVisible();
  await page.screenshot({
    path: new URL("stale-observation.png", directory).pathname,
    fullPage: true,
  });
});
