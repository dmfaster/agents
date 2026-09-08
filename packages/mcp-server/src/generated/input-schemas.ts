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
export const ListsListInputSchema = z
  .object({
    query: z.string().min(1).max(120).optional(),
    limit: z.number().int().min(1).max(25).optional(),
    offset: z.number().int().min(0).max(1000000).optional(),
  })
  .strict();
export const ListInspectInputSchema = z
  .object({
    listId: ResourceIdSchema,
    username: z.string().min(1).max(64).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    offset: z.number().int().min(0).max(1000000).optional(),
  })
  .strict();
export const ResourceVersionSchema = z
  .string()
  .min(20)
  .max(27)
  .regex(new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d{1,6})?Z$"));
export const ListTargetRemoveInputSchema = z
  .object({
    listId: ResourceIdSchema,
    username: z.string().min(1).max(64),
    expectedListUpdatedAt: ResourceVersionSchema,
  })
  .strict();
export const IdempotencyKeySchema = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(new RegExp("^[A-Za-z0-9._:-]{1,160}$"));
export const CampaignDraftPrepareInputSchema = z
  .object({
    listId: ResourceIdSchema,
    expectedListUpdatedAt: ResourceVersionSchema,
    expectedTargetCount: z.number().int().min(1),
    name: z.string().min(1).max(120),
    messageVariants: z.array(z.string().min(1).max(1000)).min(1).max(4),
    dailyCap: z.number().int().min(1).max(60),
    pacingSeconds: z.number().int().min(12).max(3600),
    onlyNewChats: z.literal(true),
    skipPreviouslyMessaged: z.literal(true),
    idempotencyKey: IdempotencyKeySchema,
  })
  .strict();
export const CampaignDraftUpdateInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    expectedCampaignUpdatedAt: ResourceVersionSchema,
    updates: z
      .object({
        name: z.string().min(1).max(120).optional(),
        messageVariants: z.array(z.string().min(1).max(1000)).min(1).max(4).optional(),
        dailyCap: z.number().int().min(1).max(60).optional(),
        pacingSeconds: z.number().int().min(12).max(3600).optional(),
        instagramSendingWindowEnabled: z.boolean().optional(),
        instagramSendingWindowStartMinute: z.number().int().min(0).max(1380).optional(),
        instagramSendingWindowEndMinute: z.number().int().min(60).max(1440).optional(),
        instagramSendingWindowWeekdays: z.number().int().min(1).max(127).optional(),
      })
      .strict()
      .refine((value) => Object.keys(value).length >= 1, "Provide at least 1 properties"),
  })
  .strict();
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
export const CompanyFiltersInputSchema = z
  .object({
    countries: z.array(SupportedCountrySchema).min(1).max(32),
    states: z.array(z.string().max(80)).max(32).optional(),
    citySearch: z.string().max(120).optional(),
  })
  .strict();
export const CompanySearchFiltersSchema = z
  .object({
    country: SupportedCountrySchema.optional(),
    countries: z.array(SupportedCountrySchema).min(1).max(32),
    q: z.string().max(120).optional(),
    industryCodes: z.array(z.string().max(80)).max(8).optional(),
    industryCodeSelections: z
      .array(
        z
          .object({
            classification: z.literal("TOL"),
            version: z.union([z.literal("2008"), z.literal("2025")]),
            codes: z.array(z.string().max(5)).max(64),
          })
          .strict(),
      )
      .max(2)
      .optional(),
    tolCodes: z.array(z.string().max(80)).max(8).optional(),
    companyForm: z.string().max(4096).optional(),
    states: z.array(z.string().max(80)).max(32).optional(),
    cities: z.array(z.string().max(80)).max(32).optional(),
    registrationDateEnabled: z.boolean().optional(),
    registrationDateStart: z.string().max(10).optional(),
    registrationDateEnd: z.string().max(10).optional(),
    businessIdRegistrationStart: z.string().max(10).optional(),
    businessIdRegistrationEnd: z.string().max(10).optional(),
    revenueMinEur: z.string().max(16).optional(),
    revenueMaxEur: z.string().max(16).optional(),
    employeeRanges: z.array(z.string().max(80)).max(32).optional(),
    employeeMin: z.string().max(10).optional(),
    employeeMax: z.string().max(10).optional(),
    technologies: z.array(z.string().max(80)).max(40).optional(),
    hasExhibitionParticipation: z.boolean().optional(),
    exhibitionEventKeys: z.array(z.string().max(160)).max(32).optional(),
    exhibitionMinEditions: z.string().max(8).optional(),
    hasPublicFunding: z.boolean().optional(),
    fundingSources: z.array(z.string().max(40)).max(5).optional(),
    fundingFromYear: z.string().max(4).optional(),
    googleAdsActivityWindow: z
      .union([
        z.literal(null),
        z.literal("last_30_days"),
        z.literal("last_90_days"),
        z.literal("last_12_months"),
      ])
      .optional(),
    metaAdsActiveOnly: z.boolean().optional(),
    metaAdsMinimumEuReach: z.string().max(10).optional(),
    metaAdsTargetAge: z.string().max(3).optional(),
    metaAdsTargetGender: z
      .union([z.literal(""), z.literal("all"), z.literal("men"), z.literal("women")])
      .optional(),
    metaAdsTargetLocation: z.string().max(80).optional(),
    metaAdsIncludeUncorroborated: z.boolean().optional(),
    hasWebsite: z.boolean().optional(),
    activeOnly: z.boolean().optional(),
  })
  .strict()
  .describe(
    "Every filter supported by the Companies app. Numeric bounds use decimal strings, dates YYYY-MM-DD; empty values disable filters. Call companies.filters for country-specific options. Unsupported or discarded criteria are rejected.",
  );
export const CompanySearchInputSchema = z
  .object({
    filters: CompanySearchFiltersSchema,
    page: z.number().int().min(1).max(10000).optional(),
    pageSize: z.number().int().min(1).max(100).optional(),
    cursor: z.string().max(1000).optional(),
    expectedRevision: z.string().max(200).optional(),
    querySignature: z.string().max(200).optional(),
  })
  .strict();
export const CompanyInspectInputSchema = z
  .object({ country: SupportedCountrySchema, businessId: z.string().min(1).max(192) })
  .strict();
export const CompanyListPrepareInputSchema = z
  .object({
    name: z.string().min(1).max(120),
    companies: z
      .array(
        z
          .object({
            country: SupportedCountrySchema,
            businessId: z.string().min(1).max(192),
            expectedRevision: z.string().min(64).max(64),
          })
          .strict(),
      )
      .min(1)
      .max(50),
    idempotencyKey: IdempotencyKeySchema,
  })
  .strict();
export const CompanyListInspectInputSchema = z
  .object({
    listId: ResourceIdSchema,
    offset: z.number().int().min(0).max(1000000).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    expectedUpdatedAt: z.string().max(160).optional(),
  })
  .strict();
export const CampaignOperationInspectInputSchema = z
  .object({
    campaignId: z.string().min(1).max(160),
    commandId: z.string().min(1).max(160).regex(new RegExp("^[A-Za-z0-9._:-]+$")),
  })
  .strict();
export const CampaignDeliveryInspectInputSchema = z
  .object({ campaignId: z.string().min(1).max(160) })
  .strict();
export const CampaignDeliveryUpdateInputSchema = z
  .object({
    campaignId: z.string().min(1).max(160),
    expectedRevision: z.string().regex(new RegExp("^[a-f0-9]{64}$")),
    idempotencyKey: z.string().min(1).max(160).regex(new RegExp("^[A-Za-z0-9._:-]+$")),
    patch: z
      .object({
        dailyCap: z.number().int().min(1).max(2147483647).optional(),
        pacingSeconds: z.number().int().min(12).max(3600).optional(),
        instagramSendingWindowEnabled: z.boolean().optional(),
        instagramSendingWindowStartMinute: z.number().int().min(0).max(1380).optional(),
        instagramSendingWindowEndMinute: z.number().int().min(60).max(1440).optional(),
        instagramSendingWindowWeekdays: z.number().int().min(1).max(127).optional(),
      })
      .strict()
      .refine((value) => Object.keys(value).length >= 1, "Provide at least 1 properties"),
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
  "lists.list": ListsListInputSchema,
  "list.inspect": ListInspectInputSchema,
  "list.target.remove": ListTargetRemoveInputSchema,
  "campaign.draft.prepare": CampaignDraftPrepareInputSchema,
  "campaign.draft.update": CampaignDraftUpdateInputSchema,
  "list.import": ListImportInputSchema,
  "list.prepare": ListPrepareInputSchema,
  "campaign.prepare": CampaignPrepareInputSchema,
  "campaign.launch.preflight": CampaignActionPreflightInputSchema,
  "campaign.launch": CampaignActionInputSchema,
  "campaign.pause.preflight": CampaignActionPreflightInputSchema,
  "campaign.pause": CampaignActionInputSchema,
  "companies.filters": CompanyFiltersInputSchema,
  "companies.search": CompanySearchInputSchema,
  "company.inspect": CompanyInspectInputSchema,
  "companies.list.prepare": CompanyListPrepareInputSchema,
  "companies.list.inspect": CompanyListInspectInputSchema,
  "campaign.operation.inspect": CampaignOperationInspectInputSchema,
  "campaign.delivery.inspect": CampaignDeliveryInspectInputSchema,
  "campaign.delivery.update": CampaignDeliveryUpdateInputSchema,
} as const;
