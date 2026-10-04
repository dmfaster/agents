import assert from "node:assert/strict";
import { test } from "node:test";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import type { McpServer } from "@modelcontextprotocol/server";
import type { AgentToolResult } from "@dmfaster/sdk";
import {
  normalizeProfile,
  buildProspectingRequest,
  imageManifest,
} from "@dmfaster/sdk/instagram-prospecting";
import {
  createInstagramEvaluationService,
  type InstagramEvaluationPage,
} from "../src/instagram-evaluation.ts";
import {
  registerInstagramWorkspace,
  instagramWorkspaceOutputSchema,
  INSTAGRAM_WORKSPACE_RESOURCE_URI,
} from "../src/instagram-workspace.ts";
import {
  instagramShortlist,
  instagramShortlistCsv,
  mergeInstagramPage,
  instagramCounts,
} from "../ui/instagram-data.ts";
import type { AgentInvoker } from "../src/tools.ts";

const spec = {
  query: "Photographers",
  threshold: 0.9,
  criteria: [
    {
      id: "photo",
      statement: "Literal text identifies a photographer.",
      basis: "text" as const,
      role: "required" as const,
      unknown: "review" as const,
    },
  ],
};
async function fixture(t: { after(fn: () => Promise<void>): void }, client?: AgentInvoker) {
  const directory = await mkdtemp(path.join(os.tmpdir(), "instagram-workspace-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(path.join(directory, "responses"));
  await mkdir(path.join(directory, "images"));
  const profile = normalizeProfile({
    id: "123",
    username: "photo",
    name: "Example",
    biography: "Photographer",
    followerCount: 1018,
    avatarUrl: "https://scontent.cdninstagram.com/example",
    historicalHint: "accept",
  });
  const bytes = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jW1sAAAAASUVORK5CYII=",
    "base64",
  );
  const image = {
    kind: "avatar" as const,
    content_type: "image/png" as const,
    base64: bytes.toString("base64"),
    sha256: createHash("sha256").update(bytes).digest("hex"),
    width: 1,
    height: 1,
  };
  await writeFile(path.join(directory, "target-spec.json"), JSON.stringify(spec));
  await writeFile(
    path.join(directory, "review-queue.json"),
    JSON.stringify([{ profile, imageManifest: [imageManifest(image)], historicalHint: "accept" }]),
  );
  await writeFile(path.join(directory, "images", `${image.sha256}.json`), JSON.stringify(image));
  const service = createInstagramEvaluationService({
    datasets: [{ id: "photos", label: "Saved photographers", directory }],
  });
  const tools = new Map<
    string,
    { options: Record<string, unknown>; call: (input: unknown) => Promise<unknown> }
  >();
  const resources = new Map<
    string,
    { options: Record<string, unknown>; read: () => Promise<unknown> }
  >();
  registerInstagramWorkspace(
    {
      registerTool(
        name: string,
        options: Record<string, unknown>,
        call: (input: unknown) => Promise<unknown>,
      ) {
        tools.set(name, { options, call });
      },
      registerResource(
        _name: string,
        uri: string,
        options: Record<string, unknown>,
        read: () => Promise<unknown>,
      ) {
        resources.set(uri, { options, read });
      },
    } as unknown as McpServer,
    service,
    client ?? {
      async invoke() {
        throw Error("Unexpected authenticated read");
      },
    },
  );
  return { directory, profile, image, tools, resources, service };
}
test("the MCP App opens exact named snapshots and offers identical headless data without defaulting to an audience", async (t) => {
  const { tools, resources, service } = await fixture(t);
  const open = tools.get("instagram_workspace")!;
  const browse = (await open.call({})) as { structuredContent: unknown };
  const payload = instagramWorkspaceOutputSchema.parse(browse.structuredContent);
  assert.equal(payload.evaluation, null);
  assert.equal(payload.datasets[0]!.totalProfiles, 1);
  const result = (await open.call({ datasetId: "photos" })) as {
    structuredContent: { evaluation: unknown };
  };
  assert.deepEqual(
    result.structuredContent.evaluation,
    await service.evaluate({ datasetId: "photos", mode: "replay" }),
  );
  assert.equal(
    (open.options._meta as { ui: { resourceUri: string } }).ui.resourceUri,
    INSTAGRAM_WORKSPACE_RESOURCE_URI,
  );
  const resource = (await resources.get(INSTAGRAM_WORKSPACE_RESOURCE_URI)!.read()) as {
    contents: {
      mimeType: string;
      text: string;
      _meta: { ui: { csp: { connectDomains: string[] } } };
    }[];
  };
  assert.equal(resource.contents[0]!.mimeType, "text/html;profile=mcp-app");
  assert.deepEqual(resource.contents[0]!._meta.ui.csp.connectDomains, []);
  assert(resource.contents[0]!.text.includes("Instagram prospecting"));
  assert(!resource.contents[0]!.text.includes("node:fs"));
});
test("profile details preserve original fields and images only in metadata and fence changed evidence", async (t) => {
  const { tools, service, image, directory } = await fixture(t);
  const revision = (await service.datasets())[0]!.revision;
  const inspect = tools.get("instagram_profile_inspect")!;
  const result = (await inspect.call({ datasetId: "photos", revision, profileId: "123" })) as {
    structuredContent: Record<string, unknown>;
    _meta: { instagramImages: { url: string }[] };
  };
  const profile = result.structuredContent.profile as Record<string, unknown>;
  assert.equal(profile.biography, "Photographer");
  assert(!("historicalHint" in profile));
  assert(!("avatarUrl" in profile));
  assert(!JSON.stringify(result.structuredContent).includes(image.base64));
  assert.equal(result._meta.instagramImages[0]!.url, `data:image/png;base64,${image.base64}`);
  const queue = JSON.parse(await readFile(path.join(directory, "review-queue.json"), "utf8"));
  queue[0].profile.biography = "Changed";
  await writeFile(path.join(directory, "review-queue.json"), JSON.stringify(queue));
  const stale = (await inspect.call({ datasetId: "photos", revision, profileId: "123" })) as {
    isError: boolean;
    content: { text: string }[];
  };
  assert.equal(stale.isError, true);
  assert.equal(stale.content[0]!.text, "stale_evaluation_revision");
});
test("missing saved images remain unavailable and detail reads never fall back to fetching", async (t) => {
  const { service, image, directory } = await fixture(t);
  await rm(path.join(directory, "images", `${image.sha256}.json`));
  const result = await service.inspect({
    datasetId: "photos",
    revision: (await service.datasets())[0]!.revision,
    profileId: "123",
  });
  assert.equal(result.imageAvailability, "missing");
  assert.deepEqual(result.images, []);
});
function quoteReceipt(ok = true): AgentToolResult {
  return {
    version: 1,
    tool: "leads.extract.quote",
    policy: { effect: "read", approval: "none", exposure: "public_api" },
    ok,
    generatedAt: "2026-10-04T16:00:00Z",
    durationMs: 1,
    evidence: [],
    consistency: { status: "verified", checks: ["exact_credit_balance"] },
    artifacts: [],
    data: ok
      ? {
          status: "blocked",
          message: "1000 requested; 400 credits remain.",
          credits: null,
          requiredCredits: 1000,
          jobId: null,
          extraction: null,
          enrichment: null,
          estimatedCredits: 1000,
          recentExtractions: [],
          nextCursor: null,
          pollAfterMs: null,
          nextAction: "buy_credits",
          purchaseUrl: "https://app.example.test/credits",
        }
      : null,
    error: ok
      ? null
      : {
          code: "workspace_access_denied",
          message: "Workspace permission required",
          retryable: false,
        },
  } as unknown as AgentToolResult;
}
test("acquisition quotes use only the existing authenticated quote and preserve exact credit blocks", async (t) => {
  const calls: unknown[] = [];
  const quote = quoteReceipt();
  const { tools } = await fixture(t, {
    async invoke(tool, input) {
      calls.push({ tool, input });
      return quote;
    },
  });
  const tool = tools.get("instagram_acquisition_quote")!;
  const source = { type: "followers", identifier: "niche_source", count: 1000 };
  const result = (await tool.call({ spec, source })) as {
    isError?: boolean;
    structuredContent: { quote: AgentToolResult; qualificationCostQuoted: boolean };
  };
  assert.equal(result.isError, undefined);
  assert.deepEqual(calls, [{ tool: "leads.extract.quote", input: source }]);
  assert.deepEqual(result.structuredContent.quote, quote);
  assert.equal(result.structuredContent.qualificationCostQuoted, false);
  const invalid = (await tool.call({
    spec,
    source: { ...source, idempotencyKey: "do-not-start" },
  })) as { isError: boolean };
  assert.equal(invalid.isError, true);
  assert.equal(calls.length, 1);
});
test("acquisition quote authorization failures remain failures rather than a fabricated quote", async (t) => {
  const quote = quoteReceipt(false);
  const { tools } = await fixture(t, {
    async invoke() {
      return quote;
    },
  });
  const result = (await tools
    .get("instagram_acquisition_quote")!
    .call({ spec, source: { type: "followers", identifier: "source", count: 1000 } })) as {
    isError: boolean;
    structuredContent: { quote: AgentToolResult };
  };
  assert.equal(result.isError, true);
  assert.deepEqual(result.structuredContent.quote, quote);
});
function page(offset = 0): InstagramEvaluationPage {
  return {
    stage: "private_evaluation",
    datasetId: "photos",
    revision: "a".repeat(64),
    policyHash: "b".repeat(64),
    spec,
    totalProfiles: 4,
    offset,
    scanned: 2,
    counts: { accept: 1, review: 1, exclude: 0, pending: 0 },
    results: [
      {
        profileId: String(offset + 1),
        username: `photo_${offset + 1}`,
        instagramUrl: "",
        split: "development",
        observedAt: "2026-10-04",
        requestHash: "c".repeat(64),
        evidenceHash: "d".repeat(64),
        policyHash: "b".repeat(64),
        imageCount: 0,
        status: "accept",
        reasons: [],
        criteria: {},
        preferenceScore: null,
        evidence: {},
        recordedAt: "2026-10-04",
        rawJudgmentsReused: true,
      },
      {
        profileId: String(offset + 2),
        username: `photo_${offset + 2}`,
        instagramUrl: "",
        split: "development",
        observedAt: "=HOSTILE()",
        requestHash: "e".repeat(64),
        evidenceHash: "f".repeat(64),
        policyHash: "b".repeat(64),
        imageCount: 0,
        status: "review",
        reasons: ["unknown evidence"],
        criteria: {},
        preferenceScore: null,
        evidence: {},
        recordedAt: "2026-10-04",
        rawJudgmentsReused: true,
      },
    ],
    nextCursor: offset === 0 ? "cursor" : null,
    inferenceCalls: 0,
    customerCreditsSpent: 0,
    note: "Private",
  };
}
test("pagination aggregates exact loaded counts and rejects changed policies, overlaps and skipped pages", () => {
  const first = mergeInstagramPage(null, page());
  const second = mergeInstagramPage(first, page(2));
  assert.deepEqual(instagramCounts(second.rows), { accept: 2, review: 2, exclude: 0, pending: 0 });
  assert.throws(
    () => mergeInstagramPage(first, { ...page(2), policyHash: "e".repeat(64) }),
    /stale/,
  );
  assert.throws(() => mergeInstagramPage(first, page()), /stale/);
  assert.throws(() => mergeInstagramPage(null, page(2)), /first/);
  assert.throws(
    () =>
      mergeInstagramPage(first, {
        ...page(2),
        counts: { accept: 0, review: 2, exclude: 0, pending: 0 },
      }),
    /inexact/,
  );
});
test("shortlist export preserves review status, neutralizes formulas and refuses excluded or pending selections", () => {
  const rows = page().results;
  const selected = instagramShortlist(rows, new Set(["1", "2"]));
  const csv = instagramShortlistCsv(selected);
  assert(csv.includes('"review","true"'));
  assert(csv.includes('"\'=HOSTILE()"'));
  assert(csv.includes("https://www.instagram.com/photo_1/"));
  assert.throws(() => instagramShortlist(rows, new Set(["missing"])), /invalid_shortlist/);
  assert.throws(
    () =>
      instagramShortlist(
        [{ ...rows[0]!, status: "exclude" } as (typeof rows)[number]],
        new Set(["1"]),
      ),
    /invalid_shortlist/,
  );
});
