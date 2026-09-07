// Generated from packages/public-api/openapi.yaml. Run npm run generate:agent-api.
import { z } from "zod";
export const ResourceIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(new RegExp(".*\\S.*"))
  .describe("A resource identifier returned by DM Faster. Never guess an identifier from a name.");
export const AnalyticsSummaryInputSchema = z
  .object({
    scope: z.union([z.literal("today"), z.literal("last_24_hours"), z.literal("campaign_to_date")]),
    campaign: ResourceIdSchema.describe(
      "Optional campaign identifier or exact campaign name.",
    ).optional(),
  })
  .strict();
export const WorkspaceBriefingInputSchema = z.object({}).strict();
export const CampaignStatusSchema = z.union([
  z.literal("Draft"),
  z.literal("Queued"),
  z.literal("Running"),
  z.literal("Paused"),
  z.literal("Cooldown"),
  z.literal("Completed"),
]);
export const CampaignsListInputSchema = z
  .object({
    status: CampaignStatusSchema.optional(),
    limit: z.number().int().min(1).max(25).optional(),
  })
  .strict();
export const OptionalCampaignInputSchema = z
  .object({
    campaignId: ResourceIdSchema.describe(
      "Omit to use the selected, active, or most recent campaign.",
    ).optional(),
  })
  .strict();
export const CampaignInspectInputSchema = OptionalCampaignInputSchema;
export const SendingInspectInputSchema = OptionalCampaignInputSchema;
export const RepliesListInputSchema = z
  .object({
    campaignId: ResourceIdSchema.optional(),
    limit: z.number().int().min(1).max(20).optional(),
    query: z
      .string()
      .min(1)
      .max(120)
      .regex(new RegExp(".*\\S.*"))
      .describe("Optional case-insensitive reply search text.")
      .optional(),
  })
  .strict();
export const PipelineInspectInputSchema = OptionalCampaignInputSchema;
export const CompanyTimelineInputSchema = z
  .object({ campaignId: ResourceIdSchema, companyOutreachId: ResourceIdSchema })
  .strict();
export const TolVersionSchema = z.union([z.literal("2008"), z.literal("2025")]);
export const IndustryLookupInputSchema = z
  .object({
    query: z.string().min(1).max(800).regex(new RegExp(".*\\S.*")),
    version: z
      .union([TolVersionSchema, z.null()])
      .refine(
        (value) =>
          [TolVersionSchema, z.null()].filter((candidate) => candidate.safeParse(value).success)
            .length === 1,
        "Expected exactly one schema match",
      )
      .optional(),
    language: z.union([z.literal("en"), z.literal("fi")]).optional(),
  })
  .strict();
export const SupportedCountrySchema = z.union([
  z.literal("FI"),
  z.literal("NO"),
  z.literal("EE"),
  z.literal("SE"),
  z.literal("DK"),
  z.literal("UK"),
  z.literal("IE"),
  z.literal("AE"),
  z.literal("AT"),
  z.literal("BE"),
  z.literal("CA"),
  z.literal("NL"),
  z.literal("NZ"),
  z.literal("ES"),
  z.literal("FR"),
  z.literal("HK"),
  z.literal("IL"),
  z.literal("LV"),
  z.literal("LT"),
  z.literal("IT"),
  z.literal("CH"),
  z.literal("PT"),
  z.literal("SA"),
  z.literal("SG"),
  z.literal("IS"),
  z.literal("AU"),
  z.literal("DE"),
  z.literal("US"),
  z.literal("ZA"),
]);
export const AgentBusinessProfileSchema = z
  .object({
    version: z.literal(1),
    businessName: z.string(),
    websiteUrl: z.string(),
    businessDescription: z.string(),
    offer: z.string(),
    customerOutcome: z.string(),
    differentiators: z.array(z.string()),
    proofPoints: z.array(z.string()),
    preferredTone: z.string(),
    preferredLanguages: z.array(z.string()),
    defaultCountries: z.array(SupportedCountrySchema),
    excludedCompanyTraits: z.array(z.string()),
  })
  .strict();
export const AgentIndustryCodeSelectionSchema = z
  .object({
    classification: z.literal("TOL"),
    version: TolVersionSchema,
    codes: z.array(z.string().max(5)).max(64),
  })
  .strict();
export const AgentIndustryClarificationOptionSchema = z
  .object({
    id: z.string().max(80),
    label: z.string().max(180),
    selections: z.array(AgentIndustryCodeSelectionSchema).max(2),
  })
  .strict();
export const AgentIndustryResolutionSchema = z
  .object({
    status: z.union([
      z.literal("resolved"),
      z.literal("needs_clarification"),
      z.literal("unsupported"),
    ]),
    sourceText: z.string().max(800),
    resolvedLabel: z.string().max(240),
    primaryVersion: TolVersionSchema,
    selections: z.array(AgentIndustryCodeSelectionSchema).max(2),
    question: z.string().max(500),
    options: z.array(AgentIndustryClarificationOptionSchema).max(3),
    evidence: z.array(z.string().max(120)).max(12),
  })
  .strict();
export const AgentCompanySizeSchema = z
  .object({
    employeeMin: z
      .union([z.number(), z.null()])
      .refine(
        (value) =>
          [z.number(), z.null()].filter((candidate) => candidate.safeParse(value).success)
            .length === 1,
        "Expected exactly one schema match",
      ),
    employeeMax: z
      .union([z.number(), z.null()])
      .refine(
        (value) =>
          [z.number(), z.null()].filter((candidate) => candidate.safeParse(value).success)
            .length === 1,
        "Expected exactly one schema match",
      ),
    revenueMinEur: z
      .union([z.number(), z.null()])
      .refine(
        (value) =>
          [z.number(), z.null()].filter((candidate) => candidate.safeParse(value).success)
            .length === 1,
        "Expected exactly one schema match",
      ),
    revenueMaxEur: z
      .union([z.number(), z.null()])
      .refine(
        (value) =>
          [z.number(), z.null()].filter((candidate) => candidate.safeParse(value).success)
            .length === 1,
        "Expected exactly one schema match",
      ),
  })
  .strict();
export const AgentMetaAdsFilterSchema = z
  .object({
    minimumEuReach: z
      .union([z.number().int().min(0).max(100000000), z.null()])
      .refine(
        (value) =>
          [z.number().int().min(0).max(100000000), z.null()].filter(
            (candidate) => candidate.safeParse(value).success,
          ).length === 1,
        "Expected exactly one schema match",
      ),
    targetAge: z
      .union([z.number().int().min(13).max(65), z.null()])
      .refine(
        (value) =>
          [z.number().int().min(13).max(65), z.null()].filter(
            (candidate) => candidate.safeParse(value).success,
          ).length === 1,
        "Expected exactly one schema match",
      ),
    targetGender: z
      .union([z.union([z.literal("all"), z.literal("men"), z.literal("women")]), z.null()])
      .refine(
        (value) =>
          [z.union([z.literal("all"), z.literal("men"), z.literal("women")]), z.null()].filter(
            (candidate) => candidate.safeParse(value).success,
          ).length === 1,
        "Expected exactly one schema match",
      ),
    targetLocation: z.string().max(80),
    includeUncorroborated: z.boolean(),
  })
  .strict();
export const AgentSignalCriterionSchema = z
  .object({
    key: z.union([
      z.literal("recent_funding"),
      z.literal("active_hiring"),
      z.literal("leadership_change"),
      z.literal("technology_usage"),
      z.literal("content_activity"),
      z.literal("purchase_intent"),
    ]),
    required: z.boolean(),
    description: z.string(),
  })
  .strict();
export const TargetChannelSchema = z.union([
  z.literal("instagram"),
  z.literal("facebook"),
  z.literal("linkedin"),
  z.literal("gmail"),
]);
export const AgentCampaignDeliverySettingsSchema = z
  .object({
    dailyCap: z
      .union([z.number(), z.null()])
      .refine(
        (value) =>
          [z.number(), z.null()].filter((candidate) => candidate.safeParse(value).success)
            .length === 1,
        "Expected exactly one schema match",
      ),
    windowStart: z.string(),
    windowEnd: z.string(),
    weekdays: z.number().int().min(1).max(127),
    timezone: z.string(),
    confirmed: z.boolean(),
  })
  .strict();
export const AgentOutreachMessageSchema = z
  .object({
    channels: z.array(TargetChannelSchema),
    subject: z.string(),
    body: z.string(),
    origin: z.union([
      z.literal("user"),
      z.literal("user_requested_generation"),
      z.literal("agent_draft"),
      z.literal("user_approved_generation"),
    ]),
  })
  .strict();
export const AgentCampaignBriefSchema = z
  .object({
    version: z.literal(1),
    objective: z.string(),
    offer: z.string(),
    targetDescription: z.string(),
    countries: z.array(SupportedCountrySchema),
    cities: z.array(z.string().min(1).max(80)).max(32).optional(),
    industryCodes: z.array(z.string()),
    industryResolution: AgentIndustryResolutionSchema.optional(),
    decisionMakerRoles: z.array(z.string()),
    companySize: AgentCompanySizeSchema,
    googleAdsActivityWindow: z
      .union([
        z.union([
          z.literal("last_30_days"),
          z.literal("last_90_days"),
          z.literal("last_12_months"),
        ]),
        z.null(),
      ])
      .refine(
        (value) =>
          [
            z.union([
              z.literal("last_30_days"),
              z.literal("last_90_days"),
              z.literal("last_12_months"),
            ]),
            z.null(),
          ].filter((candidate) => candidate.safeParse(value).success).length === 1,
        "Expected exactly one schema match",
      )
      .optional(),
    metaAdsFilter: z
      .union([AgentMetaAdsFilterSchema, z.null()])
      .refine(
        (value) =>
          [AgentMetaAdsFilterSchema, z.null()].filter(
            (candidate) => candidate.safeParse(value).success,
          ).length === 1,
        "Expected exactly one schema match",
      )
      .optional(),
    requestedSignals: z.array(AgentSignalCriterionSchema),
    exclusions: z.array(z.string()),
    excludePreviouslyContacted: z
      .boolean()
      .describe(
        "Exclude companies already contacted in this workspace. The exact preview and prepare call must use the same setting.",
      )
      .optional(),
    unsupportedCriteria: z.array(z.string().max(160)).max(8).optional(),
    callToAction: z.string(),
    requestedChannels: z.array(TargetChannelSchema),
    messageLanguage: z.string(),
    tone: z.string(),
    dailyVolume: z
      .union([z.number(), z.null()])
      .refine(
        (value) =>
          [z.number(), z.null()].filter((candidate) => candidate.safeParse(value).success)
            .length === 1,
        "Expected exactly one schema match",
      ),
    deliverySettings: AgentCampaignDeliverySettingsSchema,
    outreachMessages: z.array(AgentOutreachMessageSchema),
  })
  .strict();
export const AgentCampaignStateSchema = z
  .object({ profile: AgentBusinessProfileSchema, brief: AgentCampaignBriefSchema })
  .strict()
  .refine(
    (value) => JSON.stringify(value).length <= 32000,
    "Input exceeds its serialized size limit",
  )
  .describe(
    "Complete stateless campaign state. Send the latest returned or user-confirmed state on every planning call.",
  );
export const CampaignValidateInputSchema = z.object({ state: AgentCampaignStateSchema }).strict();
export const AudiencePreviewInputSchema = z
  .object({
    state: AgentCampaignStateSchema,
    sampleSize: z.number().int().min(1).max(25).optional(),
  })
  .strict();
export const IdempotencyKeySchema = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(new RegExp("^[A-Za-z0-9._:-]{1,160}$"));
export const ListImportInputSchema = z
  .object({
    name: z.string().min(1).max(120),
    usernames: z
      .array(z.string().min(1).max(64))
      .min(1)
      .max(1000)
      .describe(
        "Instagram handles; whitespace and a leading @ are removed and case is normalized. Invalid handles reject the whole import.",
      ),
    idempotencyKey: IdempotencyKeySchema,
  })
  .strict();
export const ReviewedAudienceSchema = z
  .object({
    querySignature: z.string().min(1).max(200).regex(new RegExp(".*\\S.*")),
    dataFreshness: z
      .object({
        engine: z.literal("search_facts"),
        revision: z.string().min(1).max(200).regex(new RegExp(".*\\S.*")),
      })
      .strict(),
    excludePreviouslyContacted: z.boolean().optional(),
  })
  .strict()
  .describe(
    "Server-issued identity from the exact audience preview. Echo this object unchanged when preparing a private list or campaign; clients must not derive it.",
  );
export const ListPrepareInputSchema = z
  .object({
    state: AgentCampaignStateSchema,
    sampleSize: z.number().int().min(1).max(25).optional(),
    idempotencyKey: IdempotencyKeySchema.optional(),
    reviewedAudience: ReviewedAudienceSchema,
  })
  .strict();
export const CampaignPrepareInputSchema = ListPrepareInputSchema;
export const CampaignActionPreflightInputSchema = z
  .object({ campaignId: ResourceIdSchema, idempotencyKey: IdempotencyKeySchema })
  .strict();
export const CampaignActionInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    idempotencyKey: IdempotencyKeySchema,
    authorizationId: z.string().regex(new RegExp("^agent_action_[a-f0-9]{32}$")),
  })
  .strict();
export const AGENT_INPUT_SCHEMAS = {
  "analytics.summary": AnalyticsSummaryInputSchema,
  "workspace.briefing": WorkspaceBriefingInputSchema,
  "campaigns.list": CampaignsListInputSchema,
  "campaign.inspect": CampaignInspectInputSchema,
  "sending.inspect": SendingInspectInputSchema,
  "replies.list": RepliesListInputSchema,
  "pipeline.inspect": PipelineInspectInputSchema,
  "company.timeline": CompanyTimelineInputSchema,
  "industry.lookup": IndustryLookupInputSchema,
  "campaign.validate": CampaignValidateInputSchema,
  "audience.preview": AudiencePreviewInputSchema,
  "list.import": ListImportInputSchema,
  "list.prepare": ListPrepareInputSchema,
  "campaign.prepare": CampaignPrepareInputSchema,
  "campaign.launch.preflight": CampaignActionPreflightInputSchema,
  "campaign.launch": CampaignActionInputSchema,
  "campaign.pause.preflight": CampaignActionPreflightInputSchema,
  "campaign.pause": CampaignActionInputSchema,
} as const;
