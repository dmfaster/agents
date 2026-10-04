import { readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";
import {
  buildProspectingRequest,
  createInstagramIcpPlan,
  decideProspect,
  digest,
  imageManifest,
  PROSPECTING_VERSION,
  normalizeSavedProfile,
  splitForProfile,
  validateImages,
  validateSpec,
  validateProviderFailure,
  type ProfileEvidence,
  type ProspectingImage,
  type ProspectingModel,
  type TargetSpec,
} from "@dmfaster/sdk/instagram-prospecting";
import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

/** Explicit private research configuration. Never inferred from customer authentication. */
export type InstagramEvaluationDataset = { id: string; label: string; directory: string };
export type InstagramEvaluationConfig = { datasets: InstagramEvaluationDataset[] };
const criterionSchema = z
  .object({
    id: z.string().regex(/^[a-z][a-z0-9_]{0,39}$/),
    statement: z.string().min(1).max(2000),
    basis: z.enum(["text", "visual"]),
    role: z.enum(["required", "preferred"]),
    unknown: z.enum(["review", "exclude"]),
    literalRule: z
      .union([
        z
          .object({
            kind: z.literal("follower_count"),
            min: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER).optional(),
            max: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER).optional(),
          })
          .strict(),
        z
          .object({
            kind: z.enum(["privacy", "verification"]),
            equals: z.boolean(),
          })
          .strict(),
      ])
      .optional(),
  })
  .strict();
export const instagramIcpInputSchema = z
  .object({
    query: z.string().min(1).max(4000),
    criteria: z.array(criterionSchema).min(1).max(16).optional(),
    threshold: z.number().min(0.5).max(1).optional(),
    evidenceThreshold: z.number().min(0.5).max(1).optional(),
  })
  .strict();
export const instagramTargetSchema = instagramIcpInputSchema.extend({
  criteria: z.array(criterionSchema).min(1).max(16),
  threshold: z.number().min(0.5).max(1),
  evidenceSchema: z.literal("profile-v2").optional(),
});
export const instagramImageManifestSchema = z
  .object({
    kind: z.enum(["avatar", "post"]),
    content_type: z.enum(["image/png", "image/jpeg", "image/webp"]),
    sha256: z.string().regex(/^[a-f0-9]{64}$/),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  })
  .strict();
const judgmentSchema = z
  .object({
    judgment: z.enum(["supports", "contradicts", "unknown"]),
    probabilities: z
      .object({
        supports: z.number().min(0).max(1),
        contradicts: z.number().min(0).max(1),
        unknown: z.number().min(0).max(1),
      })
      .strict(),
    evidence: z.string(),
    evidenceProbability: z.number().min(0).max(1),
  })
  .strict();
const identitySchema = z
  .object({
    profileId: z.string(),
    username: z.string(),
    instagramUrl: z.string(),
    split: z.enum(["development", "holdout"]),
    observedAt: z.string(),
  })
  .strict();
const packetSchema = identitySchema.extend({
  requestHash: z.string(),
  evidenceHash: z.string(),
  policyHash: z.string(),
  imageCount: z.number().int().min(0).max(4),
});
export const instagramEvaluationOutputSchemas = {
  plan: z
    .object({
      spec: instagramTargetSchema,
      planId: z.string(),
      decomposition: z.enum(["host_supplied", "whole_query"]),
      questionsPerProfile: z.number().int(),
      warnings: z.array(z.string()),
    })
    .strict(),
  datasets: z
    .object({
      datasets: z.array(
        z
          .object({
            datasetId: z.string(),
            label: z.string(),
            revision: z.string(),
            spec: instagramTargetSchema,
            totalProfiles: z.number().int(),
            withBiography: z.number().int(),
            withSavedImages: z.number().int(),
            development: z.number().int(),
            holdout: z.number().int(),
          })
          .strict(),
      ),
    })
    .strict(),
  evaluate: z
    .object({
      stage: z.literal("private_evaluation"),
      datasetId: z.string(),
      revision: z.string(),
      spec: instagramTargetSchema,
      policyHash: z.string(),
      totalProfiles: z.number().int(),
      offset: z.number().int(),
      scanned: z.number().int(),
      counts: z
        .object({
          accept: z.number().int(),
          exclude: z.number().int(),
          review: z.number().int(),
          pending: z.number().int(),
        })
        .strict(),
      results: z.array(
        z.union([
          identitySchema.extend({
            status: z.literal("pending"),
            reason: z.string(),
            requestHash: z.string().optional(),
            evidenceHash: z.string().optional(),
            policyHash: z.string().optional(),
            imageCount: z.number().int().optional(),
          }),
          packetSchema.extend({
            status: z.enum(["accept", "exclude", "review"]),
            reasons: z.array(z.string()),
            criteria: z.record(z.string(), judgmentSchema),
            literalChecks: z
              .record(
                z.string(),
                z
                  .object({
                    field: z.enum(["followerCount", "isPrivate", "isVerified"]),
                    value: z.union([z.number().int().nonnegative(), z.boolean(), z.null()]),
                    judgment: z.enum(["supports", "contradicts", "unknown"]),
                  })
                  .strict(),
              )
              .optional(),
            preferenceScore: z.number().nullable(),
            evidence: z.record(
              z.string(),
              z
                .object({
                  source: z.string(),
                  value: z.string().nullable(),
                  image: instagramImageManifestSchema.nullable(),
                })
                .strict(),
            ),
            recordedAt: z.string(),
            rawJudgmentsReused: z.literal(true),
          }),
        ]),
      ),
      nextCursor: z.string().nullable(),
      inferenceCalls: z.literal(0),
      customerCreditsSpent: z.literal(0),
      note: z.string(),
    })
    .strict(),
};
export const instagramEvaluateInputSchema = z
  .object({
    datasetId: z.string().regex(/^[a-z][a-z0-9_-]{0,63}$/),
    spec: instagramTargetSchema.optional(),
    model: z.enum(["clef", "clef-flash", "jev-1.13.0"]).default("clef"),
    mode: z.enum(["prepare", "replay"]).default("prepare"),
    limit: z.number().int().min(1).max(50).default(20),
    cursor: z.string().max(2000).optional(),
  })
  .strict();

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw Error("invalid_dataset");
  return value as Record<string, unknown>;
}
export function instagramEvaluationConfigFromEnv(
  env: NodeJS.ProcessEnv,
): InstagramEvaluationConfig | undefined {
  const source = env.DMFASTER_INSTAGRAM_EVALUATION_DATASETS;
  if (!source) return undefined;
  const datasets = z
    .array(
      z
        .object({
          id: z.string().regex(/^[a-z][a-z0-9_-]{0,63}$/),
          label: z.string().min(1).max(120),
          directory: z.string().refine(path.isAbsolute),
        })
        .strict(),
    )
    .min(1)
    .max(30)
    .parse(JSON.parse(source));
  if (new Set(datasets.map((d) => d.id)).size !== datasets.length) throw Error("duplicate_dataset");
  return { datasets };
}

/** Fixed file names under a trusted dataset root; reject symlinks escaping it. */
async function readJson(
  root: string,
  relative: string,
  maxBytes = 20 * 1024 ** 2,
): Promise<unknown> {
  const canonicalRoot = await realpath(root);
  const file = await realpath(path.join(canonicalRoot, relative));
  if (!file.startsWith(`${canonicalRoot}${path.sep}`)) throw Error("dataset_path_escape");
  const metadata = await stat(file);
  if (!metadata.isFile() || metadata.size > maxBytes) throw Error("dataset_file_too_large");
  const bytes = await readFile(file);
  if (bytes.length > maxBytes) throw Error("dataset_file_too_large");
  return JSON.parse(bytes.toString("utf8"));
}
type DatasetRow = {
  profile: ProfileEvidence;
  split: "development" | "holdout";
  imageManifest: ReturnType<typeof imageManifest>[];
};
async function loadDataset(dataset: InstagramEvaluationDataset) {
  const raw = await readJson(dataset.directory, "review-queue.json");
  if (!Array.isArray(raw) || raw.length > 5000) throw Error("invalid_dataset");
  const ids = new Set<string>(),
    usernames = new Set<string>();
  const rows: DatasetRow[] = raw.map((value) => {
    const row = object(value),
      p = object(row.profile);
    const profile = normalizeSavedProfile(p);
    if (ids.has(profile.id) || usernames.has(profile.username))
      throw Error("duplicate_dataset_profile");
    ids.add(profile.id);
    usernames.add(profile.username);
    const imageManifest = z
      .array(instagramImageManifestSchema)
      .max(4)
      .parse(row.imageManifest ?? []);
    // Ignore persisted labels, screening hints, and split metadata. Identity assigns the split.
    return { profile, imageManifest, split: splitForProfile(profile.id) };
  });
  return { rows, revision: digest(rows) };
}
async function loadImages(dataset: InstagramEvaluationDataset, row: DatasetRow) {
  const images: ProspectingImage[] = [];
  for (const manifest of row.imageManifest) {
    let raw: unknown;
    try {
      raw = await readJson(dataset.directory, `images/${manifest.sha256}.json`, 6 * 1024 ** 2);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT" || manifest.kind !== "avatar")
        throw error;
      raw = await readJson(
        dataset.directory,
        `images/${row.profile.id}-${digest({ url: row.profile.avatarUrl, observedAt: row.profile.observedAt })}.json`,
        6 * 1024 ** 2,
      );
    }
    const image = raw as ProspectingImage;
    if (JSON.stringify(imageManifest(image)) !== JSON.stringify(manifest))
      throw Error("image_manifest_mismatch");
    images.push(image);
  }
  validateImages(images);
  return images;
}
function missing(error: unknown) {
  return (error as NodeJS.ErrnoException).code === "ENOENT";
}
function cursorFor(
  datasetId: string,
  revision: string,
  policyHash: string,
  model: ProspectingModel,
  offset: number,
) {
  return Buffer.from(JSON.stringify({ datasetId, revision, policyHash, model, offset })).toString(
    "base64url",
  );
}

export function createInstagramEvaluationService(config: InstagramEvaluationConfig) {
  // Validation also applies to programmatic consumers.
  const validated = instagramEvaluationConfigFromEnv({
    DMFASTER_INSTAGRAM_EVALUATION_DATASETS: JSON.stringify(config.datasets),
  })!;
  const datasetFor = (id: string) => {
    const dataset = validated.datasets.find((d) => d.id === id);
    if (!dataset) throw Error("unknown_dataset");
    return dataset;
  };
  return {
    plan(input: z.input<typeof instagramIcpInputSchema>) {
      const value = instagramIcpInputSchema.parse(input);
      return createInstagramIcpPlan({
        query: value.query,
        ...(value.criteria === undefined
          ? {}
          : {
              criteria: validateSpec({
                query: value.query,
                criteria: value.criteria,
                threshold: value.threshold ?? 0.9,
                evidenceSchema: "profile-v2",
              }).criteria,
            }),
        ...(value.threshold === undefined ? {} : { threshold: value.threshold }),
        ...(value.evidenceThreshold === undefined
          ? {}
          : { evidenceThreshold: value.evidenceThreshold }),
      });
    },
    async datasets() {
      return Promise.all(
        validated.datasets.map(async (dataset) => {
          const { rows, revision } = await loadDataset(dataset);
          const spec = validateSpec(await readJson(dataset.directory, "target-spec.json"));
          return {
            datasetId: dataset.id,
            label: dataset.label,
            revision,
            spec,
            totalProfiles: rows.length,
            withBiography: rows.filter((r) => r.profile.biography).length,
            withSavedImages: rows.filter((r) => r.imageManifest.length).length,
            development: rows.filter((r) => r.split === "development").length,
            holdout: rows.filter((r) => r.split === "holdout").length,
          };
        }),
      );
    },
    async inspect(input: { datasetId: string; revision: string; profileId: string }) {
      const value = z
        .object({
          datasetId: z.string().regex(/^[a-z][a-z0-9_-]{0,63}$/),
          revision: z.string().regex(/^[a-f0-9]{64}$/),
          profileId: z.string().regex(/^\d{1,30}$/),
        })
        .strict()
        .parse(input);
      const dataset = datasetFor(value.datasetId);
      const { rows, revision } = await loadDataset(dataset);
      if (revision !== value.revision) throw Error("stale_evaluation_revision");
      const row = rows.find((r) => r.profile.id === value.profileId);
      if (!row) throw Error("unknown_dataset_profile");
      // Enforce the same evidence byte limit before exposing a detail packet.
      const spec = validateSpec(await readJson(dataset.directory, "target-spec.json"));
      buildProspectingRequest(spec, row.profile, "clef");
      let images: ProspectingImage[] = [];
      let imageAvailability: "available" | "missing" = "available";
      try {
        images = await loadImages(dataset, row);
      } catch (error) {
        if (!missing(error)) throw error;
        imageAvailability = "missing";
      }
      const { avatarUrl: _remoteUrl, ...profile } = row.profile;
      return {
        datasetId: dataset.id,
        revision,
        profileId: profile.id,
        profile,
        split: row.split,
        imageManifest: row.imageManifest,
        imageAvailability,
        // The adapter puts original saved bytes in tool metadata, outside model context.
        images,
        inferenceCalls: 0 as const,
        customerCreditsSpent: 0 as const,
      };
    },
    async evaluate(input: z.input<typeof instagramEvaluateInputSchema>) {
      const value = instagramEvaluateInputSchema.parse(input);
      const dataset = datasetFor(value.datasetId);
      const { rows, revision } = await loadDataset(dataset);
      const spec = validateSpec(
        value.spec ?? (await readJson(dataset.directory, "target-spec.json")),
      );
      const policyHash = digest({ version: PROSPECTING_VERSION, spec });
      let offset = 0;
      if (value.cursor) {
        const cursor = z
          .object({
            datasetId: z.string(),
            revision: z.string(),
            policyHash: z.string(),
            model: z.string(),
            offset: z.number().int().min(0).max(rows.length),
          })
          .strict()
          .parse(JSON.parse(Buffer.from(value.cursor, "base64url").toString("utf8")));
        if (
          cursor.datasetId !== dataset.id ||
          cursor.revision !== revision ||
          cursor.policyHash !== policyHash ||
          cursor.model !== value.model
        )
          throw Error("stale_evaluation_cursor");
        offset = cursor.offset;
      }
      const results = [];
      for (const row of rows.slice(offset, offset + value.limit)) {
        const summary = {
          profileId: row.profile.id,
          username: row.profile.username,
          instagramUrl: `https://www.instagram.com/${row.profile.username}/`,
          split: row.split,
          observedAt: row.profile.observedAt,
        };
        let images: ProspectingImage[];
        try {
          images = await loadImages(dataset, row);
        } catch (error) {
          if (!missing(error)) throw error;
          results.push({ ...summary, status: "pending" as const, reason: "saved_image_missing" });
          continue;
        }
        const packet = buildProspectingRequest(spec, row.profile, value.model, images);
        const prepared = {
          ...summary,
          requestHash: packet.requestHash,
          evidenceHash: packet.evidenceHash,
          policyHash: packet.policyHash,
          imageCount: images.length,
        };
        if (value.mode === "prepare") {
          results.push({
            ...prepared,
            status: "pending" as const,
            reason: "prepared_no_inference",
          });
          continue;
        }
        let archive: Record<string, unknown>;
        try {
          archive = object(
            await readJson(dataset.directory, `responses/${packet.requestHash}.json`),
          );
        } catch (error) {
          if (!missing(error)) throw error;
          let reason = "no_exact_recorded_response";
          try {
            const failure = validateProviderFailure(
              await readJson(dataset.directory, `responses/${packet.requestHash}.failure.json`),
              { requestHash: packet.requestHash, profileId: row.profile.id },
            );
            reason = failure.reason;
          } catch (error) {
            if (!missing(error)) throw error;
          }
          results.push({
            ...prepared,
            status: "pending" as const,
            reason,
          });
          continue;
        }
        if (
          archive.version !== 1 ||
          archive.profileId !== row.profile.id ||
          typeof archive.recordedAt !== "string" ||
          archive.requestHash !== packet.requestHash ||
          JSON.stringify(archive.request) !== JSON.stringify(packet.request)
        )
          throw Error("archive_request_mismatch");
        const decision = decideProspect(spec, packet.request, archive.output);
        const sources = object(object(packet.request.state).sources);
        const evidence = Object.fromEntries(
          Object.entries(decision.criteria).map(([id, judgment]) => [
            id,
            {
              source: judgment.evidence,
              value:
                typeof sources[judgment.evidence] === "string" ? sources[judgment.evidence] : null,
              image: /^image_\d$/.test(judgment.evidence)
                ? (row.imageManifest[Number(judgment.evidence.slice(6))] ?? null)
                : null,
            },
          ]),
        );
        results.push({
          ...prepared,
          ...decision,
          evidence,
          recordedAt: archive.recordedAt,
          rawJudgmentsReused: true,
        });
      }
      const next = offset + results.length;
      return {
        stage: "private_evaluation" as const,
        datasetId: dataset.id,
        revision,
        spec,
        policyHash,
        totalProfiles: rows.length,
        offset,
        scanned: results.length,
        counts: {
          accept: results.filter((r) => r.status === "accept").length,
          exclude: results.filter((r) => r.status === "exclude").length,
          review: results.filter((r) => r.status === "review").length,
          pending: results.filter((r) => r.status === "pending").length,
        },
        results,
        nextCursor:
          next < rows.length
            ? cursorFor(dataset.id, revision, policyHash, value.model, next)
            : null,
        inferenceCalls: 0,
        customerCreditsSpent: 0,
        note: "Counts describe this page. Cached probabilities are experimental; literalChecks are separate code decisions over observed metadata. Pending includes missing responses and recorded provider failures, never poor-fit judgments. No live extraction, saved-list mutation or sending occurs.",
      };
    },
  };
}

export function registerInstagramEvaluation(server: McpServer, config: InstagramEvaluationConfig) {
  const service = createInstagramEvaluationService(config);
  const register = <T extends z.ZodObject>(
    name: string,
    title: string,
    description: string,
    schema: T,
    outputSchema: z.ZodType,
    run: (input: z.output<T>) => unknown | Promise<unknown>,
    summarize?: (data: unknown) => string,
  ) => {
    server.registerTool(
      name,
      {
        title,
        description,
        inputSchema: schema as z.ZodType,
        outputSchema,
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
      },
      async (input) => {
        try {
          const data = outputSchema.parse(await run(schema.parse(input)));
          return {
            content: [
              { type: "text" as const, text: summarize ? summarize(data) : JSON.stringify(data) },
            ],
            structuredContent: data as Record<string, unknown>,
          };
        } catch (error) {
          // Never disclose local file paths or source content in errors.
          const message =
            error instanceof Error && /^[a-z_]+$/.test(error.message)
              ? error.message
              : "instagram_evaluation_failed";
          return { isError: true, content: [{ type: "text" as const, text: message }] };
        }
      },
    );
  };
  register(
    "instagram_icp_plan",
    "Prepare an Instagram ICP",
    "Private research: translate the user's description into independently testable criteria, preserving their constraints. The MCP assistant supplies criteria; Clef supplies judgments, not generated plans. Unknown evidence needs an explicit review/exclude policy. No inference or provider work.",
    instagramIcpInputSchema,
    instagramEvaluationOutputSchemas.plan,
    (input) => service.plan(input),
  );
  register(
    "instagram_evaluation_datasets",
    "Inspect private Instagram evaluation datasets",
    "Read exact profile and evidence counts for explicitly configured private research datasets. These are offline copies, not a live customer list. No provider requests or credits.",
    z.object({}).strict(),
    instagramEvaluationOutputSchemas.datasets,
    async () => ({ datasets: await service.datasets() }),
  );
  register(
    "instagram_profiles_evaluate",
    "Evaluate saved Instagram profiles",
    "Prepare a page or replay exact recorded Clef/JeV judgments for a named private research dataset. Supply a new ICP spec to retarget; changed questions require new recorded judgments and return pending. Omit spec to replay the dataset's frozen plan. Echo nextCursor unchanged. Threshold changes reuse judgments. Returns page-level matches, exclusions, review and pending counts; never starts paid work, changes customer lists, or sends messages.",
    instagramEvaluateInputSchema,
    instagramEvaluationOutputSchemas.evaluate,
    (input) => service.evaluate(input),
    (data) => {
      const result = data as Awaited<ReturnType<typeof service.evaluate>>;
      return `${result.scanned} profiles on this page of ${result.totalProfiles}: ${result.counts.accept} matches, ${result.counts.exclude} exclusions, ${result.counts.review} for review, ${result.counts.pending} pending inference. ${result.nextCursor ? "More profiles available; follow nextCursor." : "End of dataset."} Private evaluation; zero live inference calls or customer credits.`;
    },
  );
  return service;
}

export type InstagramEvaluationService = ReturnType<typeof createInstagramEvaluationService>;
export type InstagramEvaluationPage = z.infer<typeof instagramEvaluationOutputSchemas.evaluate>;
