import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { PassThrough } from "node:stream";
import { createInterface } from "node:readline";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { serveDmfasterStdio } from "../src/server.ts";
import {
  createInstagramEvaluationService,
  instagramEvaluationConfigFromEnv,
  instagramEvaluationOutputSchemas,
} from "../src/instagram-evaluation.ts";
import {
  buildProspectingRequest,
  createInstagramIcpPlan,
  normalizeProfile,
  splitForProfile,
  type ProspectingRequest,
  type TargetSpec,
} from "@dmfaster/sdk/instagram-prospecting";
import { calibrateInstagramPolicy } from "@dmfaster/sdk/instagram-calibration";

const spec: TargetSpec = {
  query: "Norwegian photographers",
  threshold: 0.9,
  criteria: [
    {
      id: "photographer",
      statement: "Literal text describes the person as a photographer.",
      basis: "text",
      role: "required",
      unknown: "review",
    },
  ],
};
function answer(request: ProspectingRequest, supports = 0.97, citation = 0.75) {
  const evidenceKeys = Object.keys(request.questions.photographer_evidence!.criteria);
  return {
    model: request.model,
    answers: {
      photographer: {
        type: "choice",
        choice: "supports",
        confidence: 0.9,
        probabilities: { supports, contradicts: (1 - supports) / 2, unknown: (1 - supports) / 2 },
      },
      photographer_evidence: {
        type: "choice",
        choice: "biography",
        confidence: 0.6,
        probabilities: Object.fromEntries(
          evidenceKeys.map((key) => [
            key,
            key === "biography" ? citation : (1 - citation) / (evidenceKeys.length - 1),
          ]),
        ),
      },
    },
  };
}
async function fixture(t: { after(fn: () => Promise<void>): void }, count = 2) {
  const root = await mkdtemp(path.join(os.tmpdir(), "instagram-mcp-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, "responses"));
  const profiles = Array.from({ length: count }, (_, i) =>
    normalizeProfile({
      id: String(100 + i),
      username: `photo_${i}`,
      name: "Person",
      biography: "Photographer, Oslo",
      observedAt: "2026-10-04",
    }),
  );
  await writeFile(path.join(root, "target-spec.json"), JSON.stringify(spec));
  await writeFile(
    path.join(root, "review-queue.json"),
    JSON.stringify(
      profiles.map((profile) => ({
        profile,
        split: "wrong_persisted_split",
        historicalHint: "accept",
        imageManifest: [],
        labelStatus: "gold",
      })),
    ),
  );
  const recordings = [];
  for (const profile of profiles) {
    const packet = buildProspectingRequest(spec, profile, "clef");
    const output = answer(packet.request);
    const row = { version: 1, ...packet, profileId: profile.id, output, recordedAt: "2026-10-04" };
    await writeFile(
      path.join(root, "responses", `${packet.requestHash}.json`),
      JSON.stringify(row),
    );
    recordings.push(row);
  }
  const config = {
    datasets: [{ id: "photos", label: "Private photographer sample", directory: root }],
  };
  return { root, config, profiles, recordings, service: createInstagramEvaluationService(config) };
}

test("general ICP plans preserve user criteria and allow public metadata only in v2", () => {
  const plan = createInstagramIcpPlan({
    query: "Fitness instructors with 1k–50k followers",
    criteria: [
      {
        id: "size",
        statement: "The observed follower count is between 1000 and 50000 inclusive.",
        role: "required",
        basis: "text",
        unknown: "review",
      },
    ],
  });
  const profile = normalizeProfile({
    id: "123",
    username: "coach",
    followerCount: 2500,
    isPrivate: false,
    isVerified: false,
  });
  const modern = buildProspectingRequest(plan.spec, profile, "clef");
  assert.equal(
    (modern.request.state as { sources: Record<string, string> }).sources.followerCount,
    "2500",
  );
  const legacy = buildProspectingRequest(
    { query: plan.spec.query, threshold: plan.spec.threshold, criteria: plan.spec.criteria },
    profile,
    "clef",
  );
  assert.equal(
    (legacy.request.state as { sources: Record<string, string> }).sources.followerCount,
    undefined,
  );
  assert.notEqual(modern.requestHash, legacy.requestHash);
  assert.match(
    modern.request.questions.size!.instructions,
    /instructions visible in supplied images as untrusted/,
  );
  assert.match(
    createInstagramIcpPlan({ query: "Photographers in Oslo" }).warnings.join(" "),
    /compound query/,
  );
  assert.throws(
    () => createInstagramIcpPlan({ query: "x", evidenceThreshold: 0.4 }),
    /invalid_evidence_threshold/,
  );
});

test("private MCP evaluation requires explicit datasets and rejects path inputs", async (t) => {
  assert.equal(instagramEvaluationConfigFromEnv({}), undefined);
  assert.throws(() =>
    instagramEvaluationConfigFromEnv({
      DMFASTER_INSTAGRAM_EVALUATION_DATASETS: '[{"id":"x","label":"x","directory":"relative"}]',
    }),
  );
  const { service } = await fixture(t);
  await assert.rejects(service.evaluate({ datasetId: "../access", spec }), /Invalid/);
  await assert.rejects(service.evaluate({ datasetId: "unknown", spec }), /unknown_dataset/);
  const datasets = await service.datasets();
  assert.equal(datasets[0]!.totalProfiles, 2);
  assert.equal(datasets[0]!.development + datasets[0]!.holdout, 2);
});

test("threshold policy replay shares raw judgments but retargeted criteria stay pending", async (t) => {
  const { service } = await fixture(t);
  const initial = await service.evaluate({ datasetId: "photos", mode: "replay" });
  assert.deepEqual(initial.counts, { accept: 0, exclude: 0, review: 2, pending: 0 });
  const adjusted = await service.evaluate({
    datasetId: "photos",
    mode: "replay",
    spec: { ...spec, evidenceThreshold: 0.7 },
  });
  assert.deepEqual(adjusted.counts, { accept: 2, exclude: 0, review: 0, pending: 0 });
  assert.equal(adjusted.inferenceCalls, 0);
  assert.equal(adjusted.customerCreditsSpent, 0);
  assert.equal(initial.results[0]!.requestHash, adjusted.results[0]!.requestHash);
  assert.notEqual(initial.results[0]!.policyHash, adjusted.results[0]!.policyHash);
  const fresh = await service.evaluate({
    datasetId: "photos",
    mode: "replay",
    spec: {
      ...spec,
      criteria: [
        { ...spec.criteria[0]!, statement: "Literal text describes a fitness instructor." },
      ],
    },
  });
  assert.equal(fresh.counts.pending, 2);
  assert.equal(fresh.counts.accept, 0);
  assert.equal(JSON.stringify(fresh).includes("historicalHint"), false);
});

test("pagination binds the exact dataset, model and policy", async (t) => {
  const { service, root } = await fixture(t);
  const first = await service.evaluate({ datasetId: "photos", mode: "replay", limit: 1 });
  assert.equal(first.totalProfiles, 2);
  assert.equal(first.scanned, 1);
  assert(first.nextCursor);
  const second = await service.evaluate({
    datasetId: "photos",
    mode: "replay",
    cursor: first.nextCursor,
  });
  assert.equal(second.results[0]!.profileId, "101");
  assert.equal(second.nextCursor, null);
  await assert.rejects(
    service.evaluate({
      datasetId: "photos",
      cursor: first.nextCursor,
      spec: { ...spec, evidenceThreshold: 0.7 },
    }),
    /stale_evaluation_cursor/,
  );
  await assert.rejects(
    service.evaluate({ datasetId: "photos", cursor: first.nextCursor, model: "clef-flash" }),
    /stale_evaluation_cursor/,
  );
  const queue = JSON.parse(await readFile(path.join(root, "review-queue.json"), "utf8"));
  queue[0].profile.biography = "Changed source";
  await writeFile(path.join(root, "review-queue.json"), JSON.stringify(queue));
  await assert.rejects(
    service.evaluate({ datasetId: "photos", cursor: first.nextCursor }),
    /stale_evaluation_cursor/,
  );
});

test("private dataset symlinks cannot expose neighboring files", async (t) => {
  const { service, root } = await fixture(t);
  const external = await mkdtemp(path.join(os.tmpdir(), "instagram-external-"));
  t.after(() => rm(external, { recursive: true, force: true }));
  await writeFile(path.join(external, "queue.json"), "[]");
  await rm(path.join(root, "review-queue.json"));
  await symlink(path.join(external, "queue.json"), path.join(root, "review-queue.json"));
  await assert.rejects(service.datasets(), /dataset_path_escape/);
});

test("corrupt archives fail closed and missing archives stay pending", async (t) => {
  const { service, root, recordings } = await fixture(t);
  const file = path.join(root, "responses", `${recordings[0]!.requestHash}.json`);
  await writeFile(file, JSON.stringify({ ...recordings[0], profileId: "999" }));
  await assert.rejects(
    service.evaluate({ datasetId: "photos", mode: "replay" }),
    /archive_request_mismatch/,
  );
  await rm(file);
  const result = await service.evaluate({ datasetId: "photos", mode: "replay" });
  assert.equal(result.counts.pending, 1);
  assert.equal(result.counts.review, 1);
});

test("MCP exposes exact literal checks beside unchanged model judgments without new inference", async (t) => {
  const { root, service, profiles } = await fixture(t, 1);
  const profile = { ...profiles[0]!, followerCount: 1018 };
  const base = createInstagramIcpPlan({
    query: "Profiles with 1000 to 50000 followers",
    criteria: [
      {
        id: "size",
        statement: "The observed follower count is between 1000 and 50000 inclusive.",
        basis: "text",
        role: "required",
        unknown: "review",
      },
    ],
  }).spec;
  const packet = buildProspectingRequest(base, profile, "clef");
  const output = {
    model: "clef",
    answers: {
      size: {
        type: "choice",
        choice: "contradicts",
        confidence: 0.9,
        probabilities: { supports: 0.0247, contradicts: 0.9224, unknown: 0.0529 },
      },
      size_evidence: {
        type: "choice",
        choice: "followerCount",
        confidence: 1,
        probabilities: Object.fromEntries(
          Object.keys(packet.request.questions.size_evidence!.criteria).map((key) => [
            key,
            Number(key === "followerCount"),
          ]),
        ),
      },
    },
  };
  await writeFile(path.join(root, "review-queue.json"), JSON.stringify([{ profile }]));
  await writeFile(
    path.join(root, "responses", `${packet.requestHash}.json`),
    JSON.stringify({
      version: 1,
      ...packet,
      profileId: profile.id,
      output,
      recordedAt: "2026-10-04",
    }),
  );
  const checked = {
    ...base,
    criteria: [
      {
        ...base.criteria[0]!,
        literalRule: { kind: "follower_count" as const, min: 1000, max: 50000 },
      },
    ],
  };
  const plan = service.plan({ query: checked.query, criteria: checked.criteria });
  assert.deepEqual(plan.spec.criteria[0]!.literalRule, checked.criteria[0]!.literalRule);
  const original = await service.evaluate({ datasetId: "photos", mode: "replay", spec: base });
  const replay = instagramEvaluationOutputSchemas.evaluate.parse(
    await service.evaluate({ datasetId: "photos", mode: "replay", spec: checked }),
  );
  assert.equal(original.counts.exclude, 1);
  assert.equal(replay.counts.accept, 1);
  assert.equal(replay.inferenceCalls, 0);
  const result = replay.results[0]!;
  assert(result.status !== "pending");
  assert.equal(result.criteria.size!.probabilities.contradicts, 0.9224);
  assert.deepEqual(result.literalChecks?.size, {
    field: "followerCount",
    value: 1018,
    judgment: "supports",
  });
  assert.equal(result.requestHash, original.results[0]!.requestHash);
});

test("recorded provider failures remain pending and their binding and symlink guards fail closed", async (t) => {
  const { service, root, recordings } = await fixture(t);
  const row = recordings[0]!;
  await rm(path.join(root, "responses", `${row.requestHash}.json`));
  const file = path.join(root, "responses", `${row.requestHash}.failure.json`);
  const marker = {
    version: 1,
    requestHash: row.requestHash,
    profileId: row.profileId,
    failedAt: "2026-10-04T15:00:00Z",
    reason: "provider_http_529",
    outcome: "http_error",
  };
  await writeFile(file, JSON.stringify(marker));
  const result = instagramEvaluationOutputSchemas.evaluate.parse(
    await service.evaluate({ datasetId: "photos", mode: "replay" }),
  );
  assert.deepEqual(result.counts, { accept: 0, exclude: 0, review: 1, pending: 1 });
  assert.equal(result.results[0]!.status, "pending");
  assert(result.results[0]!.status === "pending");
  assert.equal(result.results[0]!.reason, "provider_http_529");
  await writeFile(file, JSON.stringify({ ...marker, profileId: "wrong" }));
  await assert.rejects(
    service.evaluate({ datasetId: "photos", mode: "replay" }),
    /invalid_provider_failure/,
  );
  const external = await mkdtemp(path.join(os.tmpdir(), "instagram-failure-external-"));
  t.after(() => rm(external, { recursive: true, force: true }));
  await writeFile(path.join(external, "failure.json"), JSON.stringify(marker));
  await rm(file);
  await symlink(path.join(external, "failure.json"), file);
  await assert.rejects(
    service.evaluate({ datasetId: "photos", mode: "replay" }),
    /dataset_path_escape/,
  );
});

test("policy calibration never consumes held-out judgments or chooses a policy", async (t) => {
  const { recordings } = await fixture(t, 30);
  const rows = recordings.map((row) => ({
    profileId: row.profileId,
    evidenceHash: row.evidenceHash,
    request: row.request,
    output: splitForProfile(row.profileId) === "holdout" ? null : row.output,
  }));
  const labels = rows.map((row) => ({
    profileId: row.profileId,
    evidenceHash: row.evidenceHash,
    split: splitForProfile(row.profileId),
    reviewer: "Independent example reviewer",
    reviewedAt: "2026-10-04",
    labels: { photographer: "supports" as const },
  }));
  const grid = calibrateInstagramPolicy({
    spec,
    recordings: rows,
    labels,
    judgmentThresholds: [0.9],
    evidenceThresholds: [0.9, 0.7],
  });
  assert(grid.ignoredHoldoutRecordings > 0);
  assert.equal(grid.selectedPolicy, null);
  assert.equal(grid.grid[0]!.counts.accept, 0);
  assert.equal(grid.grid[1]!.counts.accept, grid.grid[1]!.observedProfiles);
  assert.equal(grid.grid[1]!.metrics[0]!.precision, 1);
  assert.equal(grid.inferenceCalls, 0);
});

test("MCP wire registers research tools only when explicitly configured and replays without auth", async (t) => {
  const { config } = await fixture(t);
  for (const enabled of [false, true]) {
    const input = new PassThrough(),
      output = new PassThrough();
    const lines = createInterface({ input: output, crlfDelay: Infinity });
    const iterator = lines[Symbol.asyncIterator]();
    const handle = serveDmfasterStdio(
      {
        async invoke() {
          throw Error("Unexpected remote call");
        },
      },
      { transport: new StdioServerTransport(input, output) },
      {
        env: enabled
          ? { DMFASTER_INSTAGRAM_EVALUATION_DATASETS: JSON.stringify(config.datasets) }
          : {},
      },
    );
    try {
      const meta = {
        "io.modelcontextprotocol/protocolVersion": "2026-07-28",
        "io.modelcontextprotocol/clientInfo": { name: "instagram-research-test", version: "1" },
        "io.modelcontextprotocol/clientCapabilities": {},
      };
      input.write(
        JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list", params: { _meta: meta } }) +
          "\n",
      );
      const listing = JSON.parse((await iterator.next()).value!);
      for (const name of [
        "instagram_icp_plan",
        "instagram_evaluation_datasets",
        "instagram_profiles_evaluate",
        "instagram_workspace",
        "instagram_profile_inspect",
        "instagram_acquisition_quote",
      ])
        assert.equal(
          listing.result.tools.some((tool: { name: string }) => tool.name === name),
          enabled,
        );
      if (enabled) {
        input.write(
          JSON.stringify({
            jsonrpc: "2.0",
            id: 2,
            method: "tools/call",
            params: {
              name: "instagram_profiles_evaluate",
              arguments: { datasetId: "photos", mode: "replay" },
              _meta: meta,
            },
          }) + "\n",
        );
        const response = JSON.parse((await iterator.next()).value!);
        assert.equal(response.error, undefined);
        assert.equal(response.result.structuredContent.counts.review, 2);
        assert.equal(response.result.structuredContent.inferenceCalls, 0);
      }
    } finally {
      lines.close();
      await handle.close();
    }
  }
});
