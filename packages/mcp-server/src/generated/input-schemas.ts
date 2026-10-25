// Generated from packages/public-api/openapi.yaml. Run npm run generate:agent-api.
import { z } from "zod";
const SharedInput1Schema = z
  .enum(["today", "last_24_hours", "campaign_to_date", "range"])
  .describe("Defaults to range over the last 30 days ending now when omitted.");
const SharedInput2Schema = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(new RegExp(".*\\S.*"))
  .describe("A resource identifier returned by DM Faster. Never guess an identifier from a name.");
export const ResourceIdSchema = SharedInput2Schema;
const SharedInput3Schema = z
  .string()
  .min(20)
  .max(32)
  .regex(
    new RegExp(
      "^\\d{4}-\\d{2}-\\d{2}[T ]\\d{2}:\\d{2}:\\d{2}(?:\\.\\d{1,6})?(?:Z|[+-]\\d{2}(?::?\\d{2})?)$",
    ),
  )
  .describe(
    "UTC resource version. Legacy PostgreSQL timestamps with an explicit offset remain accepted during the 2.x deprecation window.",
  );
export const ResourceVersionSchema = SharedInput3Schema;
const SharedInput4Schema = z
  .string()
  .min(1)
  .max(100)
  .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.");
export const AnalyticsSummaryInputSchema = z
  .object({
    scope: SharedInput1Schema.optional(),
    campaign: ResourceIdSchema.describe(
      "Optional campaign identifier or exact campaign name.",
    ).optional(),
    from: ResourceVersionSchema.optional(),
    to: ResourceVersionSchema.optional(),
    groupBy: z
      .array(z.enum(["day", "week", "channel", "campaign", "actor", "variant"]))
      .max(6)
      .optional(),
    timezone: z.string().max(100).optional(),
    include: z
      .array(z.enum(["canonical", "legacy", "metrics", "definitions"]))
      .max(3)
      .optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const WorkspaceBriefingInputSchema = z
  .object({
    include: z
      .array(z.enum(["metrics", "legacy"]))
      .max(1)
      .optional(),
    from: ResourceVersionSchema.optional(),
    to: ResourceVersionSchema.optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
const SharedInput5Schema = z.enum([
  "Draft",
  "Queued",
  "Running",
  "Paused",
  "Cooldown",
  "Completed",
]);
export const CampaignStatusSchema = SharedInput5Schema;
export const TargetChannelSchema = z.enum(["instagram", "facebook", "linkedin", "gmail", "sms"]);
const SharedInput6Schema = z
  .string()
  .min(1)
  .max(500)
  .describe("Opaque nextCursor returned by the preceding page.");
export const CampaignsListInputSchema = z
  .object({
    status: CampaignStatusSchema.optional(),
    query: z.string().min(1).max(120).describe("Case-insensitive campaign name search.").optional(),
    channel: TargetChannelSchema.optional(),
    limit: z.number().int().min(1).max(25).optional(),
    cursor: SharedInput6Schema.optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const OptionalCampaignInputSchema = z
  .object({
    campaignId: ResourceIdSchema.describe(
      "Omit to use the selected, active, or most recent campaign.",
    ).optional(),
    include: z
      .array(z.enum(["legacy", "metrics"]))
      .max(1)
      .optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CampaignInspectInputSchema = OptionalCampaignInputSchema;
export const CampaignCopyInspectInputSchema = z
  .object({ campaignId: ResourceIdSchema, runId: SharedInput4Schema.optional() })
  .strict();
export const SendingInspectInputSchema = OptionalCampaignInputSchema;
const SharedInput7Schema = z
  .string()
  .min(1)
  .max(120)
  .regex(new RegExp(".*\\S.*"))
  .describe("Optional case-insensitive reply search text.");
export const RepliesListInputSchema = z
  .object({
    campaignId: ResourceIdSchema.optional(),
    limit: z.number().int().min(1).max(20).optional(),
    query: SharedInput7Schema.optional(),
    cursor: z.string().min(1).max(6000).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
const SharedInput8Schema = z
  .enum(["compact", "full"])
  .describe(
    "Compact returns conversation identity, reply state and a bounded latest-message preview. Full returns full context. When omitted, view and fields control the response.",
  );
const SharedInput9Schema = z.enum([
  "id",
  "channel",
  "targetName",
  "needsReply",
  "lastMessageAt",
  "lastInboundAt",
  "interestIntent",
  "lastMessageText",
]);
const SharedInput10Schema = z.enum([
  "all",
  "needs_reply",
  "waiting",
  "unread",
  "snoozed",
  "closed",
]);
const SharedInput11Schema = z
  .enum([
    "interested",
    "information_requested",
    "meeting_intent",
    "meeting_proposed_time",
    "asks_pricing",
    "not_now",
    "wrong_person",
    "not_interested",
    "opt_out",
    "acknowledgement",
    "unclear",
  ])
  .describe(
    "Exact stored intent; unlike the app label filter, opt_out does not include not_interested or not_now.",
  );
const SharedInput12Schema = z.enum([
  "instagram",
  "facebook",
  "linkedin",
  "gmail",
  "outlook",
  "email",
  "sms",
]);
export const InboxChannelSchema = SharedInput12Schema;
export const ConversationsListInputSchema = z
  .object({
    responseMode: SharedInput8Schema.optional(),
    from: ResourceVersionSchema.optional(),
    to: ResourceVersionSchema.optional(),
    fields: z
      .array(SharedInput9Schema)
      .max(8)
      .describe("Select compact conversation fields; id and channel are always retained.")
      .optional(),
    view: z.enum(["compact", "standard", "full", "summary"]).optional(),
    filter: SharedInput10Schema.optional(),
    interest: z.enum(["positive", "neutral", "negative", "needs_review"]).optional(),
    intent: SharedInput11Schema.optional(),
    channel: InboxChannelSchema.optional(),
    mailboxId: ResourceIdSchema.optional(),
    campaignId: ResourceIdSchema.optional(),
    query: z.string().min(1).max(120).optional(),
    updatedAfter: ResourceVersionSchema.optional(),
    includeAutomaticResponses: z.boolean().optional(),
    cursor: z.string().min(1).max(2000).optional(),
    limit: z.number().int().min(1).max(60).optional(),
    meetingStatus: z.enum(["none", "booked", "held", "no_show"]).optional(),
    followupDue: z.boolean().optional(),
    include: z
      .array(z.enum(["legacy", "metrics"]))
      .max(1)
      .optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const ConversationInspectInputSchema = z
  .object({
    conversationId: ResourceIdSchema,
    cursor: z.string().min(1).max(2000).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
const SharedInput13Schema = z.enum([
  "mark_read",
  "mark_unread",
  "close",
  "reopen",
  "snooze",
  "unsnooze",
  "assign_to_me",
  "unassign",
  "set_interest",
]);
const SharedInput14Schema = z.enum([
  "interested",
  "information_requested",
  "meeting_intent",
  "meeting_proposed_time",
  "asks_pricing",
  "not_now",
  "wrong_person",
  "not_interested",
  "opt_out",
  "acknowledgement",
  "unclear",
]);
export const ConversationUpdateInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    conversationId: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    action: SharedInput13Schema,
    snoozedUntil: ResourceVersionSchema.optional(),
    interestLevel: z.enum(["positive", "neutral", "negative"]).optional(),
    interestIntent: SharedInput14Schema.optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const IdempotencyKeySchema = z
  .string()
  .trim()
  .min(8)
  .max(160)
  .regex(new RegExp("^[A-Za-z0-9._:-]{8,160}$"));
export const ReplyTemplateVariablesSchema = z
  .object({
    lastName: z.string().max(500).optional(),
    fullName: z.string().max(500).optional(),
    name: z.string().max(500).optional(),
    firstName: z.string().max(500).optional(),
    companyName: z.string().max(500).optional(),
    slotLink: z.string().max(500).optional(),
    slot1: z.string().max(500).optional(),
    slot2: z.string().max(500).optional(),
    ownerName: z.string().max(500).optional(),
  })
  .strict();
export const ConversationReplyInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    conversationId: ResourceIdSchema,
    expectedLastInboundAt: ResourceVersionSchema,
    expectedLastMessageAt: ResourceVersionSchema,
    text: z.string().min(1).max(10000).optional(),
    idempotencyKey: IdempotencyKeySchema,
    templateId: ResourceIdSchema.optional(),
    variables: ReplyTemplateVariablesSchema.optional(),
    ownerApproved: z
      .boolean()
      .describe(
        "For 2.1 clients only: the owner explicitly approved this exact free text and conversation. Otherwise save a draft.",
      )
      .optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const ConversationReplyInspectInputSchema = z
  .object({ idempotencyKey: IdempotencyKeySchema, runId: SharedInput4Schema.optional() })
  .strict();
export const CampaignMessagesDraftListInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    afterId: ResourceIdSchema.optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CampaignMessagesDraftUpdateInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    campaignId: ResourceIdSchema,
    expectedCampaignUpdatedAt: ResourceVersionSchema,
    expectedListUpdatedAt: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    edits: z
      .array(
        z
          .object({
            targetHandle: z.string().min(1).max(180),
            channel: z.enum(["instagram", "facebook"]),
            message: z.union([z.string().min(1).max(1000).regex(new RegExp("\\S")), z.null()]),
          })
          .strict(),
      )
      .min(1)
      .max(100),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CampaignMessagesListInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    expectedRunId: ResourceIdSchema.optional(),
    channels: z
      .array(z.enum(["instagram", "facebook", "linkedin"]))
      .min(1)
      .max(3)
      .optional(),
    jobIds: z.array(ResourceIdSchema).min(1).max(100).optional(),
    afterJobId: ResourceIdSchema.optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
const SharedInput15Schema = z
  .string()
  .min(1)
  .max(2000)
  .regex(new RegExp("\\S"))
  .describe(
    "Exact recipient copy, preserving whitespace and Unicode. Null removes the override and restores current campaign or sequence copy.",
  );
export const CampaignMessagesUpdateInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    campaignId: ResourceIdSchema,
    runId: ResourceIdSchema,
    expectedCampaignUpdatedAt: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    edits: z
      .array(
        z
          .object({
            jobId: ResourceIdSchema,
            targetHandle: z.string().min(1).max(180),
            channel: z.enum(["instagram", "facebook", "linkedin"]),
            expectedJobUpdatedAt: ResourceVersionSchema,
            message: z
              .union([
                SharedInput15Schema,
                z
                  .null()
                  .describe(
                    "Exact recipient copy, preserving whitespace and Unicode. Null removes the override and restores current campaign or sequence copy.",
                  ),
              ])
              .describe(
                "Exact recipient copy, preserving whitespace and Unicode. Null removes the override and restores current campaign or sequence copy.",
              ),
          })
          .strict(),
      )
      .min(1)
      .max(100),
  })
  .strict();
export const CampaignFollowupsListInputSchema = z
  .object({
    limit: z.number().int().min(1).max(100).optional(),
    campaignId: ResourceIdSchema,
    view: z.enum(["upcoming", "done"]).optional(),
    cursor: z.string().min(1).max(512).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CampaignFollowupsCancelInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    campaignId: ResourceIdSchema,
    expectedCampaignUpdatedAt: ResourceVersionSchema,
    jobIds: z.array(ResourceIdSchema).min(1).max(50),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CampaignOutcomesListInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    cursor: z.string().min(1).max(512).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const DeliveryTestPrepareInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    channel: z.enum(["email", "sms"]),
    to: z.string().trim().min(3).max(254),
    mailboxId: ResourceIdSchema.optional(),
    recipientConsentConfirmed: z.literal(true),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const DeliveryTestSendInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    testId: z.string().regex(new RegExp("^delivery_test_[a-f0-9]{64}$")),
    reviewDigest: z.string().regex(new RegExp("^[a-f0-9]{64}$")),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const DeliveryTestInspectInputSchema = z
  .object({
    testId: z.string().regex(new RegExp("^delivery_test_[a-f0-9]{64}$")),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const HistoryListInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    cursor: z.string().min(1).max(512).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    search: z.string().min(3).max(120).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const PipelineInspectInputSchema = OptionalCampaignInputSchema;
export const PipelineStageSchema = z.enum(["contacted", "replied", "call_booked", "closed"]);
const SharedInput16Schema = z.enum([
  "contacted",
  "replied",
  "call_booked",
  "meeting_held",
  "no_show",
  "closed",
  "won",
  "lost",
]);
export const PipelineCardsListInputSchema = z
  .object({
    campaignId: ResourceIdSchema.optional(),
    stage: PipelineStageSchema.optional(),
    limit: z.number().int().min(1).max(100).optional(),
    cursor: z.string().min(1).max(4000).optional(),
    query: z.string().min(1).max(120).optional(),
    entityKey: z.string().min(1).max(320).optional(),
    stages: z.array(SharedInput16Schema).min(1).max(8).optional(),
    include: z
      .array(z.enum(["legacy", "metrics"]))
      .max(1)
      .optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const PipelineStageUpdateInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    campaignId: ResourceIdSchema,
    entityKey: z.string().min(1).max(320),
    stageKey: z.string().min(1).max(500),
    expectedStage: PipelineStageSchema,
    stage: PipelineStageSchema,
    closedOutcome: z.enum(["won", "lost"]).optional(),
    lostReason: z.string().max(2000).optional(),
    expectedUpdatedAt: ResourceVersionSchema.optional(),
    idempotencyKey: IdempotencyKeySchema.optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const PipelineNoteListInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    entityKey: z.string().min(1).max(320),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const PipelineNoteAddInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    campaignId: ResourceIdSchema,
    entityKey: z.string().min(1).max(320),
    body: z.string().min(1).max(2000),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CompanyTimelineInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    companyOutreachId: ResourceIdSchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
const SharedInput17Schema = z.enum([
  "FI",
  "NO",
  "EE",
  "SE",
  "DK",
  "UK",
  "IE",
  "AE",
  "AT",
  "BE",
  "CA",
  "NL",
  "NZ",
  "ES",
  "FR",
  "HK",
  "IL",
  "LV",
  "LT",
  "IT",
  "CH",
  "PT",
  "SA",
  "SG",
  "IS",
  "AU",
  "DE",
  "US",
  "ZA",
]);
export const SupportedCountrySchema = SharedInput17Schema;
export const TolVersionSchema = z.enum(["2008", "2025"]);
export const IndustryLookupInputSchema = z
  .object({
    countries: z.array(SupportedCountrySchema).min(1).max(1).optional(),
    country: SupportedCountrySchema.optional(),
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
    language: z.enum(["en", "fi", "sv"]).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
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
    companyCount: z.number().int().min(0).optional(),
    country: SupportedCountrySchema.optional(),
    id: z.string().max(80),
    label: z.string().max(180),
    selections: z.array(AgentIndustryCodeSelectionSchema).max(2),
  })
  .strict();
export const AgentIndustryResolutionSchema = z
  .object({
    status: z.enum(["resolved", "needs_clarification", "unsupported"]),
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
      .union([z.enum(["all", "men", "women"]), z.null()])
      .refine(
        (value) =>
          [z.enum(["all", "men", "women"]), z.null()].filter(
            (candidate) => candidate.safeParse(value).success,
          ).length === 1,
        "Expected exactly one schema match",
      ),
    targetLocation: z.string().max(80),
    includeUncorroborated: z.boolean(),
  })
  .strict();
const SharedInput18Schema = z.enum([
  "recent_funding",
  "active_hiring",
  "leadership_change",
  "technology_usage",
  "content_activity",
  "purchase_intent",
]);
export const AgentSignalCriterionSchema = z
  .object({ key: SharedInput18Schema, required: z.boolean(), description: z.string() })
  .strict();
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
const SharedInput19Schema = z.enum([
  "user",
  "user_requested_generation",
  "agent_draft",
  "user_approved_generation",
]);
export const AgentOutreachMessageSchema = z
  .object({
    channels: z.array(TargetChannelSchema),
    subject: z.string(),
    body: z.string(),
    origin: SharedInput19Schema,
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
      .union([z.enum(["last_30_days", "last_90_days", "last_12_months"]), z.null()])
      .refine(
        (value) =>
          [z.enum(["last_30_days", "last_90_days", "last_12_months"]), z.null()].filter(
            (candidate) => candidate.safeParse(value).success,
          ).length === 1,
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
const SharedInput20Schema = z
  .enum(["whole", "page"])
  .describe("Drafts default to whole; previews default to page.");
export const ProspectingAudiencePageSchema = z
  .object({
    scope: SharedInput20Schema.optional(),
    offset: z.number().int().min(0).max(10000000).describe("Defaults to 0.").optional(),
    limit: z.number().int().min(1).max(500).describe("Defaults to 500.").optional(),
  })
  .strict()
  .describe(
    "Inventory scope. Drafts default to scope whole, every eligible company in a complete inventory up to 5,000. scope page keeps a bounded window; follow nextOffset and use a new idempotencyKey per draft page.",
  );
const SharedInput21Schema = z
  .string()
  .max(120)
  .describe(
    "Literal case-insensitive title substring on the same verified open employer posting. Implies hasActiveHiring. Finland only.",
  );
const SharedInput22Schema = z.union([
  z.literal(null),
  z.literal("last_30_days"),
  z.literal("last_90_days"),
  z.literal("last_12_months"),
]);
export const CompanySearchFiltersSchema = z
  .object({
    country: SupportedCountrySchema.optional(),
    countries: z.array(SupportedCountrySchema).min(1).max(32).optional(),
    q: z.string().max(120).optional(),
    industryCodes: z.array(z.string().max(80)).max(8).optional(),
    industryCodeSelections: z
      .array(
        z
          .object({
            classification: z.literal("TOL"),
            version: z.enum(["2008", "2025"]),
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
    technologies: z
      .array(z.string().max(80))
      .max(40)
      .describe(
        "Match any selected technology within each technology subsection and every selected subsection. Country picker options require at least 50 active companies; explicit saved criteria remain executable.",
      )
      .optional(),
    websiteFacts: z
      .array(z.enum(["b2c", "b2b", "saas"]))
      .max(3)
      .describe(
        "Positive-only saved Finnish website classifications with non-exhaustive coverage. Multiple selected facts must all match. b2c is a provisional consumer-targeting candidate; b2b and saas are independently scored positive candidates. Omission applies no website-fact restriction; absence is not a negative classification. Available only for Finnish audiences.",
      )
      .optional(),
    hasExhibitionParticipation: z.boolean().optional(),
    exhibitionEventKeys: z.array(z.string().max(160)).max(32).optional(),
    exhibitionMinEditions: z.string().max(8).optional(),
    hasActiveHiring: z
      .boolean()
      .describe(
        "Require verified open employer job postings in Finland. False removes this requirement; it does not mean not hiring. Unavailable or stale recruitment publications fail closed.",
      )
      .optional(),
    hiringTitleQuery: SharedInput21Schema.optional(),
    hasPublicFunding: z.boolean().optional(),
    fundingSources: z.array(z.string().max(40)).max(5).optional(),
    fundingFromYear: z.string().max(4).optional(),
    googleAdsActivityWindow: SharedInput22Schema.optional(),
    metaAdsActiveOnly: z.boolean().optional(),
    metaAdsMinimumEuReach: z.string().max(10).optional(),
    metaAdsTargetAge: z.string().max(3).optional(),
    metaAdsTargetGender: z.enum(["", "all", "men", "women"]).optional(),
    metaAdsTargetLocation: z.string().max(80).optional(),
    metaAdsIncludeUncorroborated: z.boolean().optional(),
    hasWebsite: z.boolean().optional(),
    activeOnly: z.boolean().optional(),
    includeUnknownSize: z
      .boolean()
      .describe(
        "Keep companies whose employee count is unknown when a size bound is supplied. Default true, the same rule as prospect_query; matchedKnown and matchedIncludingUnknown are reported.",
      )
      .optional(),
    includeUnknownRevenue: z
      .boolean()
      .describe(
        "Keep companies without a published revenue when a revenue bound is supplied. Default true, the same rule as prospect_query; unknownRevenue is reported.",
      )
      .optional(),
  })
  .strict()
  .describe(
    "Every filter supported by the Companies app. Numeric bounds use decimal strings, dates YYYY-MM-DD; empty values disable filters. Call companies_filters for country-specific options. Saved website classifications are positive-only with non-exhaustive coverage and currently Finnish; absent classifications do not imply a negative. Unsupported or discarded criteria are rejected.",
  );
const SharedInput23Schema = z
  .string()
  .max(80)
  .describe(
    "Empty uses a neutral greeting when no person's name exists. Null leaves those targets unresolved.",
  );
const SharedInput24Schema = z.enum(["instagram", "facebook", "linkedin", "gmail", "email", "sms"]);
export const ProspectingCopySchema = z
  .object({
    variables: z
      .object({
        ownerName: z.string().max(500).optional(),
        slotLink: z.string().max(500).optional(),
        slot1: z.string().max(500).optional(),
        slot2: z.string().max(500).optional(),
        firstNameFallback: z
          .union([
            SharedInput23Schema,
            z
              .null()
              .describe(
                "Empty uses a neutral greeting when no person's name exists. Null leaves those targets unresolved.",
              ),
          ])
          .describe(
            "Empty uses a neutral greeting when no person's name exists. Null leaves those targets unresolved.",
          )
          .optional(),
      })
      .strict()
      .optional(),
    messages: z
      .array(
        z
          .object({
            channel: SharedInput24Schema,
            subject: z.string().max(500).optional(),
            body: z.string().min(1).max(1600),
          })
          .strict(),
      )
      .min(1)
      .max(20),
    followups: z
      .array(
        z
          .object({
            channel: SharedInput24Schema,
            subject: z.string().max(500).optional(),
            body: z.string().min(1).max(1600),
            delayDays: z.number().int().min(1).max(30),
          })
          .strict(),
      )
      .max(15)
      .optional(),
  })
  .strict();
export const ProspectingPlanSchema = z
  .object({
    audiencePage: ProspectingAudiencePageSchema.optional(),
    name: z.string().min(1).max(120),
    listName: z.string().min(1).max(120).optional(),
    filters: CompanySearchFiltersSchema,
    excludePreviouslyContacted: z.boolean().optional(),
    copy: ProspectingCopySchema,
    mailboxIds: z.array(z.string().min(1).max(160)).max(8).optional(),
    dailyCap: z.number().int().min(1).max(60).optional(),
    pacingSeconds: z.number().int().min(12).max(3600).optional(),
    window: z
      .object({
        timezone: z.string().min(1).max(80),
        startMinute: z.number().int().min(0).max(1380),
        endMinute: z.number().int().min(60).max(1440),
        weekdays: z.number().int().min(1).max(127).optional(),
      })
      .strict()
      .optional(),
    labels: z.array(z.literal("agent_test")).max(1).optional(),
  })
  .strict();
export const CampaignValidateInputSchema = z
  .object({
    state: AgentCampaignStateSchema.optional(),
    runId: SharedInput4Schema.optional(),
    plan: ProspectingPlanSchema.optional(),
    approvalId: z.string().min(1).max(160).optional(),
  })
  .strict();
const SharedInput25Schema = z.enum([
  "never",
  "contacted",
  "replied",
  "booked",
  "closed",
  "suppressed",
  "contacted_no_reply_older_than_90d",
]);
export const AudiencePreviewInputSchema = z
  .object({
    state: AgentCampaignStateSchema.optional(),
    sampleSize: z.number().int().min(1).max(25).optional(),
    runId: SharedInput4Schema.optional(),
    filters: CompanySearchFiltersSchema.optional(),
    channels: z
      .array(z.enum(["instagram", "facebook", "linkedin", "gmail", "sms"]))
      .max(5)
      .optional(),
    contactStatus: z.array(SharedInput25Schema).max(7).optional(),
    excludePreviouslyContacted: z.boolean().optional(),
  })
  .strict();
export const ListsListInputSchema = z
  .object({
    query: z.string().min(1).max(120).optional(),
    isCompanyLeadList: z
      .boolean()
      .describe("Return only company lead lists (true) or only profile lists (false).")
      .optional(),
    limit: z.number().int().min(1).max(25).optional(),
    offset: z.number().int().min(0).max(1000000).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const ListInspectInputSchema = z
  .object({
    listId: ResourceIdSchema,
    username: z.string().min(1).max(64).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    offset: z.number().int().min(0).max(1000000).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const ListTargetRemoveInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    listId: ResourceIdSchema,
    username: z.string().min(1).max(64),
    expectedListUpdatedAt: ResourceVersionSchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
const SharedInput26Schema = z
  .enum(["instagram", "facebook", "linkedin", "gmail", "sms"])
  .describe(
    "Single-channel shorthand. Supply this or channels for company lists; defaults to Instagram for username lists.",
  );
const SharedInput27Schema = z
  .string()
  .min(1)
  .max(500)
  .describe("Email subject shared by all messageVariants, which become the email body variants.");
const SharedInput28Schema = z
  .string()
  .min(1)
  .max(1600)
  .describe("Separate SMS message, required when SMS is selected.");
const SharedInput29Schema = z
  .string()
  .max(300)
  .describe(
    "Separate LinkedIn invitation note, required when LinkedIn is combined with another channel.",
  );
export const CampaignDraftPrepareInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    channel: SharedInput26Schema.optional(),
    channels: z
      .array(z.enum(["instagram", "facebook", "linkedin", "gmail", "sms"]))
      .min(1)
      .max(5)
      .describe("Channels on one campaign. Mutually exclusive with channel.")
      .optional(),
    gmailSubject: SharedInput27Schema.optional(),
    gmailRecipientConsentConfirmed: z
      .literal(true)
      .describe("Explicit user confirmation of recipient permission, required for email.")
      .optional(),
    mailboxIds: z.array(ResourceIdSchema).min(1).max(8).optional(),
    smsBody: SharedInput28Schema.optional(),
    linkedinInviteNote: SharedInput29Schema.optional(),
    expectedAudienceCount: z
      .number()
      .int()
      .min(1)
      .describe("Required exact company count for a company list.")
      .optional(),
    listId: ResourceIdSchema,
    expectedListUpdatedAt: ResourceVersionSchema,
    expectedTargetCount: z
      .number()
      .int()
      .min(1)
      .describe("Exact sum of selected channelCounts, not the number of distinct companies.")
      .optional(),
    name: z.string().min(1).max(120),
    messageVariants: z
      .array(z.string().min(1).max(1600))
      .min(1)
      .max(4)
      .describe(
        "Up to 1000 characters per variant, or 1600 for SMS-only drafts. SMS sends the separate smsBody.",
      ),
    dailyCap: z.number().int().min(1).max(60),
    pacingSeconds: z.number().int().min(12).max(3600),
    onlyNewChats: z.literal(true),
    skipPreviouslyMessaged: z.literal(true),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CampaignFollowUpStepInputSchema = z
  .object({
    delayDays: z.number().int().min(1).max(30),
    channel: z.enum(["inherit", "instagram", "facebook", "linkedin", "gmail"]),
    fallbackChannel: z.enum(["none", "instagram", "facebook", "linkedin", "gmail"]).optional(),
    subject: z.string().max(500).optional(),
    variants: z.array(z.string().min(1).max(1000)).min(1).max(4),
  })
  .strict();
export const CampaignFollowUpSequenceInputSchema = z
  .object({ enabled: z.boolean(), steps: z.array(CampaignFollowUpStepInputSchema).max(3) })
  .strict();
export const LinkedinFollowUpSequenceInputSchema = z
  .object({ enabled: z.boolean(), steps: z.array(CampaignFollowUpStepInputSchema).max(2) })
  .strict();
export const CampaignDraftUpdateInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    campaignId: ResourceIdSchema,
    expectedCampaignUpdatedAt: ResourceVersionSchema,
    updates: z
      .object({
        name: z.string().min(1).max(120).optional(),
        description: z.string().max(1000).optional(),
        messageVariants: z.array(z.string().min(1).max(1000)).min(1).max(4).optional(),
        instagramEnabled: z.boolean().optional(),
        facebookEnabled: z.boolean().optional(),
        linkedinEnabled: z.boolean().optional(),
        linkedinInviteMode: z.enum(["invite_only", "invite_with_note"]).optional(),
        linkedinInviteNote: z.string().max(300).optional(),
        followUpSequence: CampaignFollowUpSequenceInputSchema.describe(
          "Shared social follow-ups, or the accepted-message sequence for a LinkedIn-only campaign.",
        ).optional(),
        linkedinFollowUpSequence: LinkedinFollowUpSequenceInputSchema.describe(
          "For a mixed-channel campaign, step 1 is the message sent as soon as acceptance is verified, including an already-connected prospect. The required delayDays on step 1 does not delay that first message. Step 2, if present, uses its delayDays. A known human reply on another channel suppresses unsent LinkedIn steps.",
        ).optional(),
        dailyCap: z.number().int().min(1).max(60).optional(),
        pacingSeconds: z.number().int().min(12).max(3600).optional(),
        instagramSendingWindowEnabled: z.boolean().optional(),
        instagramSendingWindowStartMinute: z.number().int().min(0).max(1380).optional(),
        instagramSendingWindowEndMinute: z.number().int().min(60).max(1440).optional(),
        instagramSendingWindowWeekdays: z.number().int().min(1).max(127).optional(),
      })
      .strict()
      .refine((value) => Object.keys(value).length >= 1, "Provide at least 1 properties"),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const ListImportInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    name: z.string().min(1).max(120),
    usernames: z
      .array(z.string().min(1).max(64))
      .min(1)
      .max(1000)
      .describe(
        "Instagram handles; whitespace and a leading @ are removed and case is normalized. Invalid handles reject the whole import.",
      ),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
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
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    state: AgentCampaignStateSchema,
    sampleSize: z.number().int().min(1).max(25).optional(),
    idempotencyKey: IdempotencyKeySchema.optional(),
    reviewedAudience: ReviewedAudienceSchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CampaignPrepareInputSchema = ListPrepareInputSchema;
export const CampaignActionPreflightInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    campaignId: ResourceIdSchema,
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CampaignActionInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    campaignId: ResourceIdSchema,
    idempotencyKey: IdempotencyKeySchema,
    authorizationId: z.string().regex(new RegExp("^agent_action_[a-f0-9]{32}$")),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
const SharedInput30Schema = z.enum([
  "filterFields",
  "defaults",
  "availability",
  "metadata",
  "technologies",
  "fundingSources",
  "restrictions",
]);
export const CompanyFiltersInputSchema = z
  .object({
    country: SupportedCountrySchema.optional(),
    sections: z.array(SharedInput30Schema).max(8).optional(),
    view: z.enum(["compact", "standard", "full", "summary"]).optional(),
    countries: z.array(SupportedCountrySchema).min(1).max(32).optional(),
    states: z.array(z.string().max(80)).max(32).optional(),
    citySearch: z.string().max(120).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CompanySuggestionsInputSchema = z
  .object({
    country: SupportedCountrySchema.optional(),
    query: z.string().min(2).max(120),
    countries: z.array(SupportedCountrySchema).min(1).max(32).optional(),
    limit: z.number().int().min(1).max(10).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
const SharedInput31Schema = z.enum([
  "none",
  "any",
  "linkedin",
  "email",
  "instagram",
  "facebook",
  "sms",
]);
export const ProspectQueryInputSchema = z
  .object({
    country: SupportedCountrySchema.optional(),
    icp: z.string().max(500).optional(),
    industries: z.array(z.string().min(1).max(80)).max(8).optional(),
    regions: z.array(z.string().max(80)).max(19).optional(),
    cities: z.array(z.string().max(80)).max(32).optional(),
    employees: z
      .object({
        min: z.number().int().min(0).max(1000000).optional(),
        max: z.number().int().min(0).max(1000000).optional(),
        unknown: z.enum(["include", "exclude", "only"]).optional(),
      })
      .strict()
      .optional(),
    revenueEur: z
      .object({
        min: z.number().int().min(0).optional(),
        max: z.number().int().min(0).optional(),
        unknown: z.enum(["include", "exclude"]).optional(),
      })
      .strict()
      .optional(),
    technologies: z.array(z.string().max(40)).max(8).optional(),
    websiteFacts: z
      .array(z.enum(["b2c", "b2b", "saas"]))
      .max(3)
      .optional(),
    evidence: z.enum(["annotate", "require", "include_evidence_only"]).optional(),
    fundingPublic: z.boolean().optional(),
    fundingFromYear: z.string().min(4).max(4).regex(new RegExp("^20[0-9]{2}$")).optional(),
    googleAds: z.enum(["last_30_days", "last_90_days", "last_12_months"]).optional(),
    requireChannel: SharedInput31Schema.optional(),
    excludePreviouslyContacted: z.boolean().optional(),
    activeOnly: z.boolean().optional(),
    format: z.enum(["rows", "columns", "count"]).optional(),
    pageSize: z.number().int().min(1).max(1000).optional(),
    cursor: z.string().max(12000).optional(),
    querySignature: z.string().max(12000).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict()
  .describe(
    "Plain-language icp and explicit fields. Explicit fields override the phrase. A cursor or querySignature alone reruns the saved ICP. runId may be a server id run_… or any correlation token of letters, numbers, dot, underscore, colon or hyphen.",
  );
const SharedInput32Schema = z
  .enum(["list", "rich"])
  .describe(
    "List returns the compact app row and flat primary contact fields. Rich preserves contact arrays and is the default. Full profiles remain available through company_inspect.",
  );
const SharedInput33Schema = z
  .string()
  .max(1024)
  .describe(
    "Echo the complete opaque revision returned by the first search page, including any website-classification identity. Never truncate it.",
  );
export const CompanySearchInputSchema = z
  .object({
    limit: z.number().int().min(1).max(100).optional(),
    filters: CompanySearchFiltersSchema,
    projection: SharedInput32Schema.optional(),
    page: z.number().int().min(1).max(10000).optional(),
    pageSize: z.number().int().min(1).max(100).optional(),
    cursor: z.string().max(1000).optional(),
    expectedRevision: SharedInput33Schema.optional(),
    querySignature: z.string().max(200).optional(),
    runId: SharedInput4Schema.optional(),
    contactStatus: z.array(SharedInput25Schema).max(7).optional(),
    excludePreviouslyContacted: z.boolean().optional(),
  })
  .strict();
export const WebsiteEvidenceCriterionSchema = z
  .object({
    id: z.string().min(1).max(60),
    statement: z.string().min(1).max(800),
    requirement: z.enum(["advertised", "any_support"]),
    retrievalTerms: z
      .array(z.string().min(1).max(100))
      .min(0)
      .max(12)
      .describe(
        "Optional source-language hints for complete scans; use an empty array for binary website judgments without keyword gates. Fast shortlist previews still require retrieval terms.",
      ),
    retrievalGroups: z
      .array(z.array(z.string().min(1).max(100)).min(1).max(12))
      .min(2)
      .max(4)
      .describe(
        "Optional required concept groups for precise retrieval. Synonyms are ORed within each group; all groups must occur in one original heading/passage context. For relationships split across passages, omit groups and broaden retrievalTerms explicitly. JEV still verifies the complete criterion.",
      )
      .optional(),
  })
  .strict();
export const CompanyEvidenceSearchInputSchema = z
  .object({
    country: z.enum(["FI"]),
    query: z.string().min(1).max(1500),
    criteria: z.array(WebsiteEvidenceCriterionSchema).min(1).max(4),
    filters: CompanySearchFiltersSchema.describe(
      "Optional deterministic Companies app filters, applied before text candidate limits. Country must remain FI. Numeric and registry constraints use company data, not website judgments.",
    ).optional(),
    includePassages: z
      .boolean()
      .describe(
        "Include up to six full original retrieval contexts per company. By default verified quotes are returned with each judgment, and unknown-only companies retain one original context for inspection.",
      )
      .optional(),
    candidateLimit: z.number().int().min(1).max(30).optional(),
    pageSize: z.number().int().min(1).max(20).optional(),
    maxAgeDays: z.number().int().min(1).max(90).optional(),
    cursor: z.string().min(1).max(200).optional(),
    expectedRevision: z.string().min(1).max(200).optional(),
    querySignature: z.string().min(1).max(200).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
const SharedInput34Schema = z.enum([
  "offers_software",
  "offers_saas_b2b",
  "offers_it_services",
  "offers_marketing",
  "offers_consulting",
  "offers_accounting",
  "offers_legal",
  "offers_recruitment",
  "offers_training",
  "offers_engineering",
  "offers_industrial_services",
  "offers_construction",
  "offers_property_services",
  "offers_logistics",
  "offers_manufactured_goods",
  "offers_wholesale",
  "offers_machinery",
  "offers_food",
  "offers_healthcare",
  "offers_finance",
  "offers_energy",
  "offers_hospitality",
  "role_manufacturer",
  "role_reseller",
  "role_service_provider",
  "buyer_business",
  "buyer_consumer",
  "buyer_public_sector",
  "buyer_manufacturing",
  "buyer_construction",
  "buyer_property",
  "buyer_retail",
  "buyer_healthcare",
  "buyer_hospitality",
  "buyer_logistics",
  "buyer_technology",
  "buyer_finance",
  "buyer_energy",
  "buyer_education",
  "buyer_agriculture",
]);
export const WorkspaceCompanyKnowledgeInputSchema = z
  .object({
    query: z.string().max(200).optional(),
    facets: z.array(SharedInput34Schema).max(40).optional(),
    page: z.number().int().min(1).max(10000).optional(),
    pageSize: z.number().int().min(1).max(100).optional(),
    expectedRevision: z.string().min(64).max(64).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
const SharedInput35Schema = z
  .string()
  .regex(new RegExp("^[a-f0-9]{64}$"))
  .describe("Pin subsequent source pages to the knowledgeRevision returned by the first read.");
export const CompanyKnowledgeInputSchema = z
  .object({
    country: z.enum(["FI"]),
    businessId: z.string().min(1).max(192),
    maxAgeDays: z.number().int().min(1).max(90).optional(),
    sourcePage: z
      .number()
      .int()
      .min(1)
      .max(500)
      .describe("Page of original saved website passages; defaults to 1.")
      .optional(),
    sourcePageSize: z
      .number()
      .int()
      .min(1)
      .max(20)
      .describe("Original passages per page; defaults to 10.")
      .optional(),
    expectedKnowledgeRevision: SharedInput35Schema.optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
const SharedInput36Schema = z
  .enum(["binary", "passage"])
  .describe(
    "Binary evaluates related website sections together in one compact request per company. Passage preserves separate relationship statuses and explicit-denial merging. Omission preserves passage behavior.",
  );
const SharedInput37Schema = z
  .enum(["requested_only", "general"])
  .describe(
    "Binary mode only. New runs default to requested_only and ask only uncached requested criteria; general explicitly adds reusable standard offering/buyer questions to the same call on complete sources. Existing omitted-policy keys recover their original general run. Cached requested answers never trigger extra inference. Country and other deterministic filters are checked in code.",
  );
export const CompanyEvidenceStartInputSchema = z
  .object({
    country: z.enum(["FI"]),
    query: z.string().min(1).max(1500),
    criteria: z.array(WebsiteEvidenceCriterionSchema).min(1).max(4),
    evaluationMode: SharedInput36Schema.optional(),
    factExpansion: SharedInput37Schema.optional(),
    filters: CompanySearchFiltersSchema.optional(),
    maxAgeDays: z.number().int().min(1).max(90).optional(),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CompanyEvidenceAdvanceInputSchema = z
  .object({
    runId: z.string().min(36).max(36),
    expectedRevision: z.string().min(64).max(64),
    batchSize: z.number().int().min(1).max(16).optional(),
  })
  .strict();
export const CompanyEvidenceStatusInputSchema = z
  .object({
    runId: z.string().min(36).max(36),
    expectedRevision: z.string().min(64).max(64),
    includeCompanies: z
      .boolean()
      .describe(
        "Set false for progress-only polling without fetching company rows or quotations. Omitted or true preserves the first result page. Use companies_evidence_results to inspect matches.",
      )
      .optional(),
  })
  .strict();
export const CompanyEvidenceResultsInputSchema = z
  .object({
    runId: z.string().min(36).max(36),
    expectedRevision: z.string().min(64).max(64),
    cursor: z.string().min(1).max(200).optional(),
    pageSize: z.number().int().min(1).max(20).optional(),
    view: z.enum(["matches", "unresolved", "all"]).optional(),
  })
  .strict();
export const CompanyEvidenceCancelInputSchema = z
  .object({ runId: z.string().min(36).max(36), expectedRevision: z.string().min(64).max(64) })
  .strict();
export const CompanyInspectInputSchema = z
  .object({
    companyKey: z.string().min(4).max(200).regex(new RegExp("^[A-Za-z]{2}:.+$")).optional(),
    companyKeys: z
      .array(z.string().min(4).max(200).regex(new RegExp("^[A-Za-z]{2}:.+$")))
      .min(1)
      .max(10)
      .optional(),
    country: SupportedCountrySchema.optional(),
    businessId: z.string().min(1).max(192).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict()
  .describe(
    "Supply companyKey as returned by prospect_query or prospecting_preview (for example FI:0198452-3), companyKeys for up to 10 companies, or country plus businessId.",
  );
const SharedInput38Schema = z
  .string()
  .min(20)
  .max(500)
  .describe("What B2B appointment-setting service is being sold to these companies.");
export const CompanyFitStartInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    campaignId: ResourceIdSchema,
    listId: ResourceIdSchema,
    expectedCampaignUpdatedAt: ResourceVersionSchema,
    expectedListUpdatedAt: ResourceVersionSchema,
    expectedTotal: z.number().int().min(1).max(25000),
    expectedTargetCount: z.number().int().min(0).max(125000),
    offer: SharedInput38Schema,
    refreshEvidence: z
      .boolean()
      .describe("Ignore recent evidence from the same workspace and fetch websites anew.")
      .optional(),
    idempotencyKey: IdempotencyKeySchema,
    maxPages: z
      .number()
      .int()
      .min(2)
      .max(5)
      .describe(
        "Maximum official website pages per company, excluding robots; defaults to 2. Each company has a 20-second fetch budget.",
      )
      .optional(),
    unknownsFromRunId: ResourceIdSchema.describe(
      "Review only unknowns from this completed, recent run; carry forward its other assessments only for the same offer, website and exact audience.",
    ).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CompanyFitAdvanceInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    runId: ResourceIdSchema,
    limit: z.number().int().min(1).max(16).optional(),
  })
  .strict();
export const CompanyFitResultsInputSchema = z
  .object({
    runId: ResourceIdSchema,
    tier: z.enum(["strong", "possible", "poor", "unknown"]).optional(),
    offset: z.number().int().min(0).max(1000000).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    sort: z.enum(["priority", "audience"]).optional(),
    expectedComplete: z
      .number()
      .int()
      .min(0)
      .max(25000)
      .describe(
        "Echo progress.complete from the first page when continuing so advancing runs cannot shift pages.",
      )
      .optional(),
    expectedVersion: z.string().min(64).max(64).optional(),
    includeEvidence: z
      .boolean()
      .describe(
        "Defaults to true. False returns compact fit reasons with empty evidence arrays; fetch full evidence before an audience review.",
      )
      .optional(),
  })
  .strict();
export const CompanyFitProposalInputSchema = z.object({ runId: ResourceIdSchema }).strict();
export const CompanyListPrepareInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    name: z.string().min(1).max(120),
    companies: z
      .array(
        z
          .object({
            country: SupportedCountrySchema,
            businessId: z.string().min(1).max(192),
            expectedRevision: z.string().min(64).max(64),
            selectedLinkedinUrl: z.string().min(1).max(500).optional(),
            selectedEmailAddress: z.string().min(1).max(320).optional(),
            selectedPhoneNumber: z.string().min(1).max(80).optional(),
          })
          .strict(),
      )
      .min(1)
      .max(50),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CompanyListInspectInputSchema = z
  .object({
    view: z.enum(["compact", "standard", "full"]).optional(),
    fields: z.array(z.string().max(80)).max(30).optional(),
    listId: ResourceIdSchema,
    offset: z.number().int().min(0).max(1000000).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    expectedUpdatedAt: z.string().max(160).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
const SharedInput39Schema = z
  .string()
  .min(64)
  .max(64)
  .describe("Echo selectionDigest from the matching dry run when apply is true.");
export const CompanyListRefineInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    listId: ResourceIdSchema,
    campaignId: ResourceIdSchema,
    expectedListUpdatedAt: ResourceVersionSchema,
    expectedCampaignUpdatedAt: ResourceVersionSchema,
    expectedTotal: z.number().int().min(1).max(25000),
    expectedTargetCount: z.number().int().min(0).max(125000),
    excludeCompanies: z
      .array(
        z
          .object({ country: SupportedCountrySchema, businessId: z.string().min(1).max(192) })
          .strict(),
      )
      .min(0)
      .max(1000),
    includeCompanies: z
      .array(
        z
          .object({
            country: SupportedCountrySchema,
            businessId: z.string().min(1).max(192),
            expectedRevision: z.string().min(64).max(64),
            selectedLinkedinUrl: z.string().min(1).max(500).optional(),
            selectedEmailAddress: z.string().min(1).max(320).optional(),
            selectedPhoneNumber: z.string().min(1).max(80).optional(),
          })
          .strict(),
      )
      .min(1)
      .max(50)
      .describe(
        "Inspected companies to add or refresh. Existing identities are refreshed with the selected decision-maker routes.",
      )
      .optional(),
    expectedRemaining: z.number().int().min(1).max(25000),
    expectedRemainingTargetCount: z.number().int().min(1).max(125000),
    idempotencyKey: IdempotencyKeySchema,
    reviewedSelectionDigest: SharedInput39Schema.optional(),
    apply: z
      .boolean()
      .describe(
        "False previews exact removals without a write. True applies the same reviewed selection to the disabled draft list.",
      ),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CampaignOperationInspectInputSchema = z
  .object({
    campaignId: z.string().min(1).max(160),
    commandId: z.string().min(1).max(160).regex(new RegExp("^[A-Za-z0-9._:-]+$")),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CampaignDeliveryInspectInputSchema = z
  .object({
    contactPolicyReport: z
      .boolean()
      .describe(
        "Read-only pre-enable impact report for the current page of unsent jobs. No flags or jobs change.",
      )
      .optional(),
    afterJobId: z.string().max(160).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    campaignId: z.string().min(1).max(160),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CampaignDeliveryUpdateInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    campaignId: z.string().min(1).max(160),
    expectedRevision: z.string().regex(new RegExp("^[a-f0-9]{64}$")),
    idempotencyKey: IdempotencyKeySchema,
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
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const InstagramPacingInspectInputSchema = z
  .object({ runId: SharedInput4Schema.optional() })
  .strict();
const SharedInput40Schema = z
  .string()
  .regex(
    new RegExp(
      "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[1-8][a-fA-F0-9]{3}-[89abAB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}$",
    ),
  );
export const InstagramPacingPolicySchema = z
  .object({
    gapMinSeconds: z.number().int().min(12).max(3600),
    gapMaxSeconds: z.number().int().min(12).max(3600),
  })
  .strict()
  .describe(
    "Minimum must be less than or equal to maximum; seconds between outgoing Instagram messages.",
  );
export const InstagramPacingUpdateInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    expectedRevision: z.union([SharedInput40Schema, z.null()]),
    idempotencyKey: IdempotencyKeySchema,
    reason: z.string().min(3).max(500),
    policy: z
      .union([InstagramPacingPolicySchema, z.null()])
      .refine(
        (value) =>
          [InstagramPacingPolicySchema, z.null()].filter(
            (candidate) => candidate.safeParse(value).success,
          ).length === 1,
        "Expected exactly one schema match",
      ),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CompanyFitStatusInputSchema = z.object({ runId: ResourceIdSchema }).strict();
export const CompanyFitCancelInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    runId: ResourceIdSchema,
  })
  .strict();
export const CompanyFitRunCursorSchema = z
  .object({ createdAt: z.string().min(20).max(40), id: ResourceIdSchema })
  .strict();
export const CompanyFitRunsListInputSchema = z
  .object({
    campaignId: ResourceIdSchema.optional(),
    limit: z.number().int().min(1).max(25).optional(),
    before: CompanyFitRunCursorSchema.optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CompanyFitRunInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    runId: ResourceIdSchema,
    limit: z.number().int().min(1).max(8).optional(),
  })
  .strict();
export const CompanyFitCohortInputSchema = z
  .object({
    runId: ResourceIdSchema,
    expectedVersion: z.string().min(64).max(64),
    take: z.number().int().min(1).max(1000),
    minimumPriority: z.number().int().min(1).max(100).optional(),
  })
  .strict();
const SharedInput41Schema = z
  .enum(["rendered_text", "template_variation"])
  .describe(
    "Defaults to rendered_text. template_variation requires campaignId and returns variationPerformance with immutable templates and seven-day mature cohorts.",
  );
const SharedInput42Schema = z
  .enum(["instagram", "facebook", "linkedin", "gmail", "sms"])
  .describe("Optional channel filter for template_variation only.");
export const CopyPerformanceInputSchema = z
  .object({
    groupBy: SharedInput41Schema.optional(),
    channel: SharedInput42Schema.optional(),
    campaignId: ResourceIdSchema.optional(),
    from: ResourceVersionSchema,
    to: ResourceVersionSchema,
    limit: z.number().int().min(1).max(25).optional(),
    offset: z.number().int().min(0).max(1000000).optional(),
    include: z
      .array(z.enum(["legacy", "metrics"]))
      .max(1)
      .optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CalendarStatusInputSchema = z
  .object({ runId: SharedInput4Schema.optional() })
  .strict();
const SharedInput43Schema = z
  .string()
  .min(1)
  .max(80)
  .describe("IANA timezone. Defaults to the workspace timezone.");
const SharedInput44Schema = z.union([
  z.literal(15),
  z.literal(30),
  z.literal(45),
  z.literal(60),
  z.literal(90),
  z.literal(120),
]);
const SharedInput45Schema = z
  .string()
  .min(1)
  .max(500)
  .describe(
    "Calendar owned by the connected Google account. Defaults to primary; calendar_status reports discoverable calendars.",
  );
export const CalendarAvailabilityInputSchema = z
  .object({
    from: ResourceVersionSchema,
    to: ResourceVersionSchema,
    timezone: SharedInput43Schema.optional(),
    durationMinutes: SharedInput44Schema,
    limit: z.number().int().min(1).max(100).optional(),
    calendarId: SharedInput45Schema.optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CalendarMeetingBookInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    conversationId: ResourceIdSchema,
    expectedConversationUpdatedAt: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    title: z.string().min(1).max(200),
    start: ResourceVersionSchema,
    timezone: z.string().min(1).max(80),
    durationMinutes: SharedInput44Schema,
    attendees: z
      .array(z.string().min(3).max(320).regex(new RegExp("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")))
      .min(1)
      .max(20)
      .optional(),
    conference: z.enum(["google_meet", "teams", "phone", "in_person", "custom_url"]).optional(),
    customUrl: z.string().max(2000).regex(new RegExp("^https://")).optional(),
    attendeePhone: z.string().max(40).optional(),
    calendarId: SharedInput45Schema.optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
const SharedInput46Schema = z.enum([
  "scheduled",
  "awaiting_outcome",
  "completed",
  "no_show",
  "cancelled",
  "rescheduled",
]);
export const CallsListInputSchema = z
  .object({
    offset: z.number().int().min(0).max(1000000).optional(),
    limit: z.number().int().min(1).max(50).optional(),
    cursor: z.string().max(2000).optional(),
    lifecycle: SharedInput46Schema.optional(),
    awaitingOutcome: z.boolean().optional(),
    from: ResourceVersionSchema.optional(),
    to: ResourceVersionSchema.optional(),
    hasTranscript: z.boolean().optional(),
    outcomeProposed: z.boolean().optional(),
    linkState: z.enum(["linked", "unlinked"]).optional(),
    source: z.string().min(1).max(200).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CallInspectInputSchema = z
  .object({
    meetingId: ResourceIdSchema,
    runId: SharedInput4Schema.optional(),
    include: z
      .array(z.enum(["speakers"]))
      .max(1)
      .optional(),
  })
  .strict();
export const InstagramExtractionQuoteInputSchema = z
  .object({
    username: z.string().trim().min(1).max(31).regex(new RegExp("^@?[A-Za-z0-9._]{1,30}$")),
    type: z.enum(["followers", "following", "likers", "commenters"]),
    count: z.number().int().min(1).max(2147483647),
    currency: z.enum(["USD", "EUR"]).optional(),
    postUrl: z.string().trim().min(1).max(300).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const InstagramExtractionStartInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    username: z.string().trim().min(1).max(31).regex(new RegExp("^@?[A-Za-z0-9._]{1,30}$")),
    type: z.enum(["followers", "following", "likers", "commenters"]),
    count: z.number().int().min(1).max(2147483647),
    currency: z.enum(["USD", "EUR"]).optional(),
    postUrl: z.string().trim().min(1).max(300).optional(),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const InstagramExtractionInspectInputSchema = z
  .object({ jobId: ResourceIdSchema, runId: SharedInput4Schema.optional() })
  .strict();
export const InstagramExtractionResultsInputSchema = z
  .object({
    jobId: ResourceIdSchema,
    cursor: z.string().min(1).max(30).regex(new RegExp("^[A-Za-z0-9._]+$")).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const InstagramPurchasesListInputSchema = z
  .object({
    cursor: ResourceIdSchema.optional(),
    limit: z.number().int().min(1).max(20).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const InstagramPurchasesInspectInputSchema = z
  .object({
    orderId: ResourceIdSchema,
    cursor: ResourceIdSchema.optional(),
    limit: z.number().int().min(1).max(20).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const InstagramPurchasesResultsInputSchema = z
  .object({
    orderId: ResourceIdSchema,
    jobId: ResourceIdSchema,
    cursor: z.string().min(1).max(30).regex(new RegExp("^[A-Za-z0-9._]+$")).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const LeadsStatusInputSchema = z
  .object({
    cursor: z.string().trim().min(1).max(1000).optional(),
    limit: z.number().int().min(1).max(50).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const LeadExtractionQuoteInputSchema = z
  .object({
    type: z.enum(["followers", "following", "likers", "commenters"]),
    identifier: z.string().trim().min(1).max(300),
    count: z.number().int().min(1).max(2147483647).optional(),
    postUrls: z.array(z.string().trim().min(1).max(300)).min(1).optional(),
    priority: z.enum(["high", "normal", "low"]).optional(),
    feedType: z.enum(["top", "recent"]).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const LeadExtractionStartInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    type: z.enum(["followers", "following", "likers", "commenters"]),
    identifier: z.string().trim().min(1).max(300),
    count: z.number().int().min(1).max(2147483647).optional(),
    postUrls: z.array(z.string().trim().min(1).max(300)).min(1).optional(),
    priority: z.enum(["high", "normal", "low"]).optional(),
    feedType: z.enum(["top", "recent"]).optional(),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const LeadExtractionInspectInputSchema = z
  .object({ jobId: ResourceIdSchema, runId: SharedInput4Schema.optional() })
  .strict();
export const LeadExtractionRefreshInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    jobId: ResourceIdSchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const LeadExtractionContinueInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    jobId: ResourceIdSchema,
    count: z.number().int().min(1).max(2147483647).optional(),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const LeadEnrichmentPreviewInputSchema = z
  .object({ listId: ResourceIdSchema, runId: SharedInput4Schema.optional() })
  .strict();
export const LeadEnrichmentStartInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    listId: ResourceIdSchema,
    maxCredits: z.number().int().min(0).max(2147483647).optional(),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const LeadEnrichmentInspectInputSchema = z
  .object({ jobId: ResourceIdSchema, runId: SharedInput4Schema.optional() })
  .strict();
export const InstagramProspectCriterionSchema = z
  .object({
    id: z.string().min(1).max(40).regex(new RegExp("^[a-z][a-z0-9_]{0,39}$")),
    statement: z.string().min(1).max(1000),
    basis: z.enum(["text", "visual"]),
    role: z.enum(["required", "preferred"]),
    unknown: z.enum(["review", "exclude"]),
    literalRule: z
      .union([
        z
          .object({
            kind: z.literal("follower_count"),
            min: z.number().int().min(0).optional(),
            max: z.number().int().min(0).optional(),
          })
          .strict(),
        z.object({ kind: z.enum(["privacy", "verification"]), equals: z.boolean() }).strict(),
      ])
      .refine(
        (value) =>
          [
            z
              .object({
                kind: z.literal("follower_count"),
                min: z.number().int().min(0).optional(),
                max: z.number().int().min(0).optional(),
              })
              .strict(),
            z.object({ kind: z.enum(["privacy", "verification"]), equals: z.boolean() }).strict(),
          ].filter((candidate) => candidate.safeParse(value).success).length === 1,
        "Expected exactly one schema match",
      )
      .optional(),
  })
  .strict();
export const InstagramProspectSourceSchema = z
  .object({
    type: z.enum(["followers", "following", "likers", "commenters"]),
    identifier: z.string().min(1).max(2048),
    count: z.number().int().min(1).max(1000).optional(),
  })
  .strict();
export const InstagramProspectInputSchema = z
  .object({
    query: z.string().min(1).max(4000),
    criteria: z.array(InstagramProspectCriterionSchema).min(1).max(12).optional(),
    threshold: z.number().min(0.5).max(1).optional(),
    evidenceThreshold: z.number().min(0.5).max(1).optional(),
    sourceListIds: z.array(z.string().min(1).max(200)).max(10).optional(),
    sources: z.array(InstagramProspectSourceSchema).max(10).optional(),
    searchQueries: z.array(z.string().min(1).max(120)).min(1).max(5).optional(),
    targetCount: z.number().int().min(1).max(1000).optional(),
    maxCandidates: z.number().int().min(1).max(1000).optional(),
    maxCredits: z.number().int().min(1).max(100000).optional(),
    maxModelCalls: z.number().int().min(1).max(1000).optional(),
    media: z.enum(["none", "avatar", "recent_posts"]).optional(),
    model: z.enum(["clef", "clef-flash"]).optional(),
    includeReview: z.boolean().optional(),
    excludePreviouslyContacted: z.boolean().optional(),
    name: z.string().min(1).max(100).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const InstagramProspectStartInputSchema = z
  .object({
    query: z.string().min(1).max(4000),
    criteria: z.array(InstagramProspectCriterionSchema).min(1).max(12).optional(),
    threshold: z.number().min(0.5).max(1).optional(),
    evidenceThreshold: z.number().min(0.5).max(1).optional(),
    sourceListIds: z.array(z.string().min(1).max(200)).max(10).optional(),
    sources: z.array(InstagramProspectSourceSchema).max(10).optional(),
    searchQueries: z.array(z.string().min(1).max(120)).min(1).max(5).optional(),
    targetCount: z.number().int().min(1).max(1000).optional(),
    maxCandidates: z.number().int().min(1).max(1000).optional(),
    maxCredits: z.number().int().min(1).max(100000).optional(),
    maxModelCalls: z.number().int().min(1).max(1000).optional(),
    media: z.enum(["none", "avatar", "recent_posts"]).optional(),
    model: z.enum(["clef", "clef-flash"]).optional(),
    includeReview: z.boolean().optional(),
    excludePreviouslyContacted: z.boolean().optional(),
    name: z.string().min(1).max(100).optional(),
    runId: SharedInput4Schema.optional(),
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    idempotencyKey: IdempotencyKeySchema,
  })
  .strict();
export const InstagramProspectRunInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    runId: z.string().min(1).max(100),
  })
  .strict();
export const InstagramProspectResultsInputSchema = z
  .object({
    runId: z.string().min(1).max(100),
    status: z.enum(["pending", "accept", "review", "exclude", "suppressed"]).optional(),
    cursor: z.string().max(2000).optional(),
    limit: z.number().int().min(1).max(100).optional(),
  })
  .strict();
const SharedInput47Schema = z.enum([
  "call.stats.ready",
  "call.stats.updated",
  "call.coaching.flagged",
  "call.attendance.detected",
  "call.insight.failed",
  "call.bot.scheduled",
  "call.bot.cancelled",
  "call.bot.joined",
  "call.bot.failed",
  "call.recording.ready",
  "call.recording.stopped",
  "call.transcript.ready",
  "call.analysis.ready",
  "call.deleted",
  "recorder.cap.reached",
  "recorder.health.degraded",
  "inbox.message.received",
  "inbox.auto_reply.received",
  "conversation.intent.changed",
  "conversation.changed",
  "conversation.followup.due",
  "followup.cancelled_by_reply",
  "meeting.booked",
  "meeting.rescheduled",
  "meeting.cancelled",
  "meeting.no_show",
  "meeting.outcome.recorded",
  "contact.opted_out",
  "campaign.state.changed",
  "sender.unhealthy",
  "reply.approval.requested",
  "copy.approval_requested",
  "commitment.done",
  "commitment.overdue",
  "commitment.due",
  "commitment.created",
  "copy.approval_approved",
  "copy.approval_rejected",
  "reply.approval.decided",
  "credential.expiring",
  "webhook.test",
  "sender.recovered",
  "calendar.connected",
  "calendar.disconnected",
  "agent.paused",
  "agent.resumed",
  "credential.rotated",
  "message.sent",
  "message.delivery.failed",
  "message.bounced",
  "reaction.received",
  "system_event.received",
  "conversation.assigned",
  "conversation.takeover.started",
  "conversation.takeover.ended",
  "work_item.created",
  "work_item.updated",
  "work_queue.rebuilt",
  "meeting.reminder.due",
  "meeting.ended",
  "booking_link.opened",
  "booking_link.used",
  "booking_link.expired",
  "suppression.added",
  "suppression.removed",
  "agent.lagging",
  "agent.stale",
  "budget.threshold_reached",
  "kill_switch.changed",
  "webhook.delivery.failed",
  "metrics.recomputed",
]);
export const AgentSalesEventTypeSchema = SharedInput47Schema;
export const EventsListInputSchema = z
  .object({
    after: z
      .union([z.string().min(1).max(1000), z.number().int().min(0)])
      .refine(
        (value) =>
          [z.string().min(1).max(1000), z.number().int().min(0)].filter(
            (candidate) => candidate.safeParse(value).success,
          ).length === 1,
        "Expected exactly one schema match",
      )
      .optional(),
    types: z.array(AgentSalesEventTypeSchema).min(1).max(17).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    consumerId: ResourceIdSchema.optional(),
    waitSeconds: z.number().int().min(0).max(30).optional(),
    expand: z
      .array(z.enum(["message", "conversation", "campaign"]))
      .max(3)
      .optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const ConversationsChangesInputSchema = z
  .object({
    since: ResourceVersionSchema.describe(
      "Bounded bootstrap of retained conversation changes since this instant; continue with the returned cursor.",
    ).optional(),
    cursor: z.string().min(1).max(1000).optional(),
    types: z
      .array(z.enum(["message", "intent", "status", "meeting"]))
      .min(1)
      .max(4)
      .optional(),
    limit: z.number().int().min(1).max(100).optional(),
    after: z.string().max(1000).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const SuppressionsListInputSchema = z
  .object({
    query: z.string().min(1).max(120).optional(),
    cursor: z.string().min(1).max(1000).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
const SharedInput48Schema = z.enum([
  "company",
  "phone",
  "email",
  "instagram",
  "facebook",
  "linkedin",
  "domain",
]);
export const SuppressionEntryInputSchema = z
  .object({
    type: SharedInput48Schema,
    value: z.string().min(1).max(500),
    reason: z.string().min(1).max(500),
    source: z.enum(["prospect_request", "owner", "agent"]),
  })
  .strict();
export const SuppressionsAddInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    entries: z.array(SuppressionEntryInputSchema).min(1).max(100),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const SuppressionsRemoveInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    id: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    reason: z.string().min(1).max(500),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const WorkspaceSandboxCreateInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    name: z.string().min(1).max(100),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const SandboxSeedInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    preset: z.literal("appointment_setter_v1"),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const SandboxInboundSimulateInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    conversationId: z.string().min(1).max(160).optional(),
    campaignId: z.string().min(1).max(160).optional(),
    channel: z.enum(["instagram", "facebook", "linkedin", "gmail", "sms"]),
    text: z.string().min(1).max(16000),
    kind: z.enum(["human", "auto_reply", "reaction"]),
    at: ResourceVersionSchema.optional(),
    expectedUpdatedAt: ResourceVersionSchema.optional(),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const SandboxClockAdvanceInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    minutes: z.number().int().min(1).max(525600),
    expectedUpdatedAt: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CallOutcomeSetInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    meetingId: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    attendance: z.enum(["held", "no_show", "rescheduled", "cancelled"]),
    result: z.enum(["trial_started", "won", "lost", "follow_up", "not_a_fit"]).optional(),
    lostReason: z.string().max(2000).optional(),
    valueEur: z.number().min(0).max(999999999999.99).optional(),
    note: z.string().max(5000).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const MeetingLinkInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    meetingId: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    conversationId: ResourceIdSchema.optional(),
    companyOutreachId: ResourceIdSchema.optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const MeetingUnlinkInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    meetingId: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
const SharedInput49Schema = z
  .string()
  .max(66)
  .regex(
    new RegExp(
      "^(?:[Aa][Uu][Tt][Hh][Oo][Rr][Ii][Zz][Aa][Tt][Ii][Oo][Nn]|[Xx]-[A-Za-z0-9-]{1,64})$",
    ),
  );
export const WebhookHeadersSchema = z
  .record(SharedInput49Schema, z.string().max(2048).regex(new RegExp("^[^\\r\\n\\u0000]*$")))
  .refine((value) => Object.keys(value).length <= 5, "Provide at most 5 properties");
export const WebhookFiltersSchema = z
  .object({
    campaignIds: z.array(z.string().min(1).max(160)).max(100).optional(),
    channels: z.array(z.string().min(1).max(30)).max(10).optional(),
    intents: z.array(z.string().min(1).max(80)).max(30).optional(),
    minIntentConfidence: z.number().min(0).max(1).optional(),
    excludeAutomatic: z.boolean().optional(),
    excludeReactions: z.boolean().optional(),
    actorTypes: z
      .array(z.enum(["agent", "human", "system", "automation"]))
      .max(4)
      .optional(),
    agentIds: z.array(z.string().min(1).max(160)).max(100).optional(),
  })
  .strict();
export const WebhooksCreateInputSchema = z
  .object({
    url: z.string().max(2048),
    events: z.array(AgentSalesEventTypeSchema).min(1).max(30),
    description: z.string().max(1000).optional(),
    idempotencyKey: IdempotencyKeySchema,
    headers: WebhookHeadersSchema.optional(),
    secret: z.string().min(32).max(100).optional(),
    filters: WebhookFiltersSchema.optional(),
    ordering: z.enum(["strict", "per_key"]).optional(),
    payload: z.enum(["thin", "standard", "full"]).optional(),
    dryRun: z.boolean().optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const WebhooksListInputSchema = z.object({ runId: SharedInput4Schema.optional() }).strict();
export const WebhooksUpdateInputSchema = z
  .object({
    id: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    url: z.string().max(2048).optional(),
    events: z.array(AgentSalesEventTypeSchema).min(1).max(30).optional(),
    description: z.string().max(1000).optional(),
    enabled: z.boolean().optional(),
    headers: WebhookHeadersSchema.optional(),
    secret: z.string().min(32).max(100).optional(),
    filters: WebhookFiltersSchema.optional(),
    ordering: z.enum(["strict", "per_key"]).optional(),
    payload: z.enum(["thin", "standard", "full"]).optional(),
    dryRun: z.boolean().optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const WebhooksDeleteInputSchema = z
  .object({
    id: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    dryRun: z.boolean().optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const WebhooksTestInputSchema = z
  .object({
    id: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    dryRun: z.boolean().optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const WebhooksReplayInputSchema = z
  .object({
    id: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    after: z
      .union([z.string().max(1000), z.number().int().min(0)])
      .refine(
        (value) =>
          [z.string().max(1000), z.number().int().min(0)].filter(
            (candidate) => candidate.safeParse(value).success,
          ).length === 1,
        "Expected exactly one schema match",
      )
      .optional(),
    dryRun: z.boolean().optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const MeetingsUnlinkedListInputSchema = z
  .object({
    includeIdentitySuggestions: z
      .boolean()
      .describe(
        "Read-only current identity matches, including historical calls. Never applies links.",
      )
      .optional(),
    cursor: z.string().max(2000).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const PipelineReconcileInputSchema = z
  .object({
    campaignId: ResourceIdSchema.optional(),
    dryRun: z.boolean().optional(),
    idempotencyKey: IdempotencyKeySchema.optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const WorkspaceAgentSalesGetInputSchema = z
  .object({ runId: SharedInput4Schema.optional() })
  .strict();
export const WorkspaceAgentSalesUpdateInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    enabled: z.boolean(),
    autoClose: z.boolean(),
    autoSuppress: z.boolean(),
    suppressCompany: z.boolean(),
    expectedUpdatedAt: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const SandboxProviderUpdateInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    provider: z.enum(["calendar", "gmail", "sms", "browser"]),
    connected: z.boolean(),
    expectedUpdatedAt: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const ReplyTemplatesListInputSchema = z
  .object({
    cursor: z.string().min(1).max(1000).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const ReplyTemplateSchema = z
  .object({
    name: z.string().min(1).max(120),
    language: z.enum(["fi", "en"]),
    channels: z.array(z.enum(["instagram", "facebook", "linkedin", "gmail", "sms"])).max(5),
    intents: z.array(z.string().min(1).max(80)).max(30),
    body: z.string().min(1).max(10000),
    maxLength: z.number().int().min(1).max(10000),
  })
  .strict();
export const ReplyTemplatesCreateInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    template: ReplyTemplateSchema,
    expectedRevision: z.literal(0),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const ReplyTemplatesUpdateInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    id: ResourceIdSchema,
    template: ReplyTemplateSchema,
    expectedRevision: z.number().int().min(0),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const ReplyTemplatesDeleteInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    id: ResourceIdSchema,
    expectedRevision: z.number().int().min(0),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const ReplyPolicyGetInputSchema = z
  .object({ runId: SharedInput4Schema.optional() })
  .strict();
export const ReplyPolicySchema = z
  .object({
    enabled: z.boolean(),
    allowedIntents: z.array(z.string().min(1).max(80)).max(30),
    allowedChannels: z.array(z.enum(["instagram", "facebook", "linkedin", "gmail", "sms"])).max(5),
    allowedTemplateIds: z.array(ResourceIdSchema).max(100),
    freeTextAllowed: z.literal(false),
    excludeIfOptOut: z.literal(true),
    hours: z
      .object({
        tz: z.string().min(1).max(80),
        start: z.string().regex(new RegExp("^(?:[01]\\d|2[0-3]):[0-5]\\d$")),
        end: z.string().regex(new RegExp("^(?:[01]\\d|2[0-3]):[0-5]\\d$")),
        weekdays: z.array(z.number().int().min(1).max(7)).max(7),
      })
      .strict(),
    maxAutoRepliesPerDay: z.number().int().min(1).max(1000),
    maxPerConversationPerDay: z.number().int().min(1).max(20),
    requireApprovalIfConfidenceBelow: z.number().min(0).max(1),
  })
  .strict();
export const ReplyPolicyUpdateInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    policy: ReplyPolicySchema,
    expectedRevision: z.number().int().min(0),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const ReplyApprovalsListInputSchema = z
  .object({
    view: z.enum(["compact", "standard", "full"]).optional(),
    fields: z.array(z.string().max(80)).max(30).optional(),
    cursor: z.string().min(1).max(1000).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    status: z.enum(["pending", "approved", "rejected"]).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const ConversationDraftSaveInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    conversationId: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    text: z.string().min(1).max(10000).optional(),
    templateId: ResourceIdSchema.optional(),
    variables: ReplyTemplateVariablesSchema.optional(),
    rationale: z.string().min(1).max(2000).optional(),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const FollowupAutoSendSchema = z
  .object({ templateId: ResourceIdSchema, variables: ReplyTemplateVariablesSchema.optional() })
  .strict();
export const ConversationFollowupSetInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    conversationId: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    at: ResourceVersionSchema,
    type: z.enum(["reply", "nudge", "send_info", "rebook", "call"]),
    note: z.string().min(1).max(2000).optional(),
    owner: ResourceIdSchema.optional(),
    autoSend: FollowupAutoSendSchema.optional(),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const ConversationFollowupClearInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    conversationId: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const FollowupsDueInputSchema = z
  .object({
    cursor: z.string().min(1).max(1000).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    before: ResourceVersionSchema.optional(),
    owner: ResourceIdSchema.optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const ConversationsBulkUpdateInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    items: z.array(ConversationUpdateInputSchema).min(1).max(50),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const PipelineBoardInputSchema = z
  .object({
    include: z
      .array(z.enum(["metrics", "legacy"]))
      .max(1)
      .optional(),
    view: z.enum(["compact", "standard", "full"]).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    cursor: z.string().max(4000).optional(),
    campaignIds: z.array(ResourceIdSchema).max(100).optional(),
    limitPerStage: z.number().int().min(1).max(20).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CalendarBookingLinkCreateInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    conversationId: ResourceIdSchema,
    expectedConversationUpdatedAt: ResourceVersionSchema,
    durations: z.array(z.number().int().min(15).max(120)).min(1).max(4),
    window: z.object({ from: ResourceVersionSchema, to: ResourceVersionSchema }).strict(),
    timezone: z.string().min(1).max(80),
    conference: z.enum(["google_meet", "teams", "phone", "in_person", "custom_url"]),
    customUrl: z.string().max(2000).regex(new RegExp("^https://")).optional(),
    maxUses: z.literal(1),
    expiresAt: ResourceVersionSchema,
    language: z.enum(["fi", "en"]),
    idempotencyKey: IdempotencyKeySchema,
    calendarId: SharedInput45Schema.optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CalendarMeetingRescheduleInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    meetingId: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    start: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CalendarMeetingCancelInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    meetingId: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    reason: z.string().min(1).max(2000),
    notifyAttendees: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
const SharedInput50Schema = z.enum([
  "inherit",
  "instagram",
  "facebook",
  "linkedin",
  "gmail",
  "sms",
]);
const SharedInput51Schema = z.enum(["none", "instagram", "facebook", "linkedin", "gmail", "sms"]);
export const CampaignFollowupsConfigureInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    expectedCampaignUpdatedAt: ResourceVersionSchema,
    sequence: z
      .object({
        enabled: z.boolean(),
        steps: z
          .array(
            z
              .object({
                delayDays: z.number().int().min(1).max(30),
                channel: SharedInput50Schema,
                fallbackChannel: SharedInput51Schema,
                subject: z.string().max(500).optional(),
                variants: z.array(z.string().min(1).max(10000)).min(1).max(4),
                smsBody: z.string().min(1).max(1600).optional(),
              })
              .strict(),
          )
          .max(3),
      })
      .strict(),
    applyTo: z.enum(["future_only", "contacted_no_reply"]),
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    maxAgeDays: z
      .number()
      .int()
      .min(1)
      .max(3650)
      .describe(
        "Default 30. Older recipients are excluded from follow-up and returned as re-engagement candidates; no historical live apply.",
      )
      .optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CampaignVariantsConfigureInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    campaignId: ResourceIdSchema,
    expectedCampaignUpdatedAt: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    channel: z.enum(["social", "gmail", "sms"]),
    variants: z
      .array(
        z
          .object({
            id: ResourceIdSchema,
            body: z.string().min(1).max(10000),
            subject: z.string().max(500).optional(),
            weight: z.number().min(0).max(10000),
          })
          .strict(),
      )
      .min(2)
      .max(4),
    minSamplePerVariant: z.number().int().min(10).max(100000),
    promote: z
      .object({
        metric: z.enum(["reply_rate", "positive_reply_rate", "booking_rate"]),
        rule: z.enum(["bayesian_95", "manual"]),
      })
      .strict(),
    prospectTimezone: z.string().min(1).max(100).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const RecorderSettingsGetInputSchema = z
  .object({ runId: SharedInput4Schema.optional() })
  .strict();
const SharedInput52Schema = z.enum([
  "all",
  "hosted_by_me",
  "external_attendees",
  "dmfaster_booked_only",
  "off",
]);
export const RecorderSettingsSchema = z
  .object({
    mode: SharedInput52Schema,
    consent: z.boolean(),
    consentNoticeVersion: z.string().min(1).max(100),
    consentNotice: z.string().min(1).max(2000),
    excludeTitleKeywords: z.array(z.string().max(200)).max(100),
    excludeDomains: z.array(z.string().max(200)).max(100),
    excludeEmails: z.array(z.string().max(254)).max(100),
    minDurationMinutes: z.number().int().min(1).max(240),
    maxDurationMinutes: z.number().int().min(1).max(240),
    botName: z.string().min(1).max(60),
    language: z.enum(["auto", "fi", "en"]),
    redactPii: z.boolean(),
    analyzeNewCalls: z.boolean(),
    monthlyBotMinutes: z.number().int().min(0).max(100000),
    monthlyTranscriptionMinutes: z.number().int().min(0).max(100000),
    ownDomains: z.array(z.string().min(3).max(253)).max(20).optional(),
    coachingThresholds: z
      .object({
        talkRatioBps: z.number().int().min(1).max(10000),
        monologueMs: z.number().int().min(1000).max(3600000),
        questionsPer30m: z.number().int().min(0).max(100),
        interruptionMultiple: z.number().int().min(1).max(20),
      })
      .strict()
      .optional(),
  })
  .strict();
export const RecorderSettingsUpdateInputSchema = z
  .object({
    settings: RecorderSettingsSchema,
    expectedVersion: z.number().int().min(0),
    dryRun: z.boolean().optional(),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
const SharedInput53Schema = z.enum([
  "scheduled",
  "joining",
  "in_call",
  "done",
  "failed",
  "cancelled",
]);
export const RecorderBotsListInputSchema = z
  .object({
    from: ResourceVersionSchema.optional(),
    to: ResourceVersionSchema.optional(),
    status: SharedInput53Schema.optional(),
    cursor: z.string().max(2000).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
const SharedInput54Schema = z
  .enum(["compact", "segments"])
  .describe(
    "Complete timestamped text by default (up to 512 KiB); segments selects paged structured output. Compact text preserves every word.",
  );
export const CallTranscriptGetInputSchema = z
  .object({
    meetingId: ResourceIdSchema,
    cursor: z.string().max(2000).optional(),
    fromMs: z.number().int().min(0).optional(),
    toMs: z.number().int().min(0).optional(),
    speaker: z.string().max(200).optional(),
    format: SharedInput54Schema.optional(),
    mode: z.enum(["full", "compact"]).optional(),
    limit: z.number().int().min(1).max(200).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CallRecordingGetInputSchema = z
  .object({ meetingId: ResourceIdSchema, runId: SharedInput4Schema.optional() })
  .strict();
export const CallTranscriptsGetInputSchema = z
  .object({
    meetingIds: z.array(ResourceIdSchema).min(1).max(10),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CallTranscriptsSearchInputSchema = z
  .object({
    query: z.string().min(2).max(200),
    from: ResourceVersionSchema.optional(),
    to: ResourceVersionSchema.optional(),
    companyId: ResourceIdSchema.optional(),
    speaker: z.string().max(200).optional(),
    limit: z.number().int().min(1).max(50).optional(),
    cursor: z.string().max(2000).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
const SharedInput55Schema = z.enum([
  "reply",
  "book",
  "followups",
  "send:sms",
  "send:gmail",
  "send:instagram",
  "send:facebook",
  "send:linkedin",
  "launch",
]);
export const ReadinessCheckInputSchema = z
  .object({
    for: SharedInput55Schema,
    runId: SharedInput4Schema.optional(),
    campaignId: z.string().min(1).max(200).optional(),
  })
  .strict();
export const SenderRetireInputSchema = z
  .object({
    workerId: ResourceIdSchema,
    reason: z.string().min(1).max(1000),
    expectedUpdatedAt: ResourceVersionSchema,
    dryRun: z.boolean().optional(),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const SenderUnretireInputSchema = z
  .object({
    workerId: ResourceIdSchema,
    reason: z.string().min(1).max(1000),
    expectedUpdatedAt: ResourceVersionSchema,
    dryRun: z.boolean().optional(),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const AttributionCheckInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    from: ResourceVersionSchema.describe(
      "Window start. Defaults to seven days before to; the window is at most 92 days.",
    ).optional(),
    to: ResourceVersionSchema.describe("Exclusive window end. Defaults to now.").optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const CampaignReengagementPrepareInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    expectedCampaignUpdatedAt: ResourceVersionSchema,
    name: z.string().min(1).max(120),
    channel: z.enum(["instagram", "facebook", "linkedin", "gmail", "sms"]),
    maxAgeDays: z.number().int().min(1).max(3650).optional(),
    expectedAudienceFingerprint: z.string().max(64).optional(),
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const AgentsListInputSchema = z
  .object({
    limit: z.number().int().min(1).max(100).optional(),
    afterId: ResourceIdSchema.optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const AgentInspectInputSchema = z
  .object({ agentId: ResourceIdSchema, runId: SharedInput4Schema.optional() })
  .strict();
const SharedInput56Schema = z.enum([
  "workspace:read",
  "campaigns:read",
  "sending:read",
  "inbox:read",
  "inbox:write",
  "pipeline:read",
  "pipeline:write",
  "audiences:read",
  "campaigns:write",
  "campaigns:launch",
  "campaigns:control",
  "calendar:read",
  "calendar:write",
  "calls:read",
  "events:read",
  "leads:read",
  "leads:write",
  "sending:test",
  "suppressions:write",
  "sandbox:write",
  "calls:write",
  "webhooks:write",
  "policy:write",
  "calls:transcripts:read",
  "calls:media:read",
  "calls:record",
  "sending:write",
  "calls:stats:read",
]);
export const AgentCreateRequestInputSchema = z
  .object({
    name: z.string().min(1).max(100),
    kind: z.enum(["setter", "prospector", "analyst", "custom"]),
    runtime: z.string().max(200).optional(),
    scopes: z.array(SharedInput56Schema).min(1).max(29),
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const AgentPauseInputSchema = z
  .object({
    agentId: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const AgentResumeInputSchema = z
  .object({
    agentId: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const AgentCredentialRotateInputSchema = z
  .object({
    agentId: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    graceDays: z.number().int().min(0).max(30).optional(),
    expiresInDays: z.number().int().min(30).max(365).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const EventConsumersListInputSchema = z
  .object({ runId: SharedInput4Schema.optional() })
  .strict();
export const EventConsumersCreateInputSchema = z
  .object({
    name: z.string().min(1).max(100),
    startAt: z.enum(["head", "retention_floor"]).optional(),
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const EventsAckInputSchema = z
  .object({
    consumerId: ResourceIdSchema,
    throughSequence: z.number().int().min(0).max(9007199254740991),
    expectedVersion: z.number().int().min(1),
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const EventsSnapshotInputSchema = z
  .object({
    after: z.string().max(1000).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const WebhookDeliveriesListInputSchema = z
  .object({
    webhookId: ResourceIdSchema,
    status: z.enum(["pending", "delivered", "failed", "dead"]).optional(),
    cursor: z.string().max(1000).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const WebhooksDlqReplayInputSchema = z
  .object({
    webhookId: ResourceIdSchema,
    deliveryIds: z.array(ResourceIdSchema).min(1).max(100).optional(),
    since: z.string().max(40).optional(),
    expectedUpdatedAt: ResourceVersionSchema,
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
const SharedInput57Schema = z.enum([
  "meeting_intent",
  "meeting_proposed_time",
  "asks_pricing",
  "information_requested",
  "not_now",
  "not_interested",
  "wrong_person",
  "opt_out",
  "interested",
  "acknowledgement",
  "unclear",
]);
const SharedInput58Schema = z.enum([
  "text",
  "reaction",
  "system_event",
  "attachment",
  "auto_reply",
]);
export const ClassificationFeedbackInputSchema = z
  .object({
    messageId: ResourceIdSchema.optional(),
    conversationId: ResourceIdSchema.optional(),
    correctIntent: SharedInput57Schema,
    correctMessageType: SharedInput58Schema.optional(),
    note: z.string().min(1).max(1000),
    expectedUpdatedAt: ResourceVersionSchema,
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const ClassificationQualityInputSchema = z
  .object({ runId: SharedInput4Schema.optional() })
  .strict();
export const ClassificationBackfillPlanInputSchema = z
  .object({
    afterId: ResourceIdSchema.optional(),
    limit: z.number().int().min(1).max(500).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
const SharedInput59Schema = z
  .enum(["compact", "standard"])
  .describe(
    "Compact is the default and omits full person, company and explanation context while retaining IDs, claim and version fences. Use standard for the full work item.",
  );
export const WorkQueueListInputSchema = z
  .object({
    types: z.array(z.string().max(60)).max(16).optional(),
    minPriority: z.number().int().min(0).max(100).optional(),
    campaignIds: z.array(ResourceIdSchema).max(100).optional(),
    assignee: z.enum(["me", "unassigned", "any"]).optional(),
    view: SharedInput59Schema.optional(),
    limit: z.number().int().min(1).max(100).optional(),
    cursor: z.string().max(1000).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const WorkItemClaimInputSchema = z
  .object({
    id: ResourceIdSchema,
    expectedVersion: z.string().min(1).max(100),
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    leaseSeconds: z.number().int().min(1).max(3600).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const WorkItemReleaseInputSchema = z
  .object({
    id: ResourceIdSchema,
    expectedVersion: z.string().min(1).max(100),
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const WorkItemSnoozeInputSchema = z
  .object({
    id: ResourceIdSchema,
    expectedVersion: z.string().min(1).max(100),
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    until: z.string().min(1).max(40),
    reason: z.string().min(1).max(500),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const WorkItemCompleteInputSchema = z
  .object({
    id: ResourceIdSchema,
    expectedVersion: z.string().min(1).max(100),
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    outcome: z.string().min(1).max(500),
    receiptIds: z.array(ResourceIdSchema).max(20).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const WorkQueueConfigGetInputSchema = z
  .object({ runId: SharedInput4Schema.optional() })
  .strict();
export const WorkQueueConfigUpdateInputSchema = z
  .object({
    expectedVersion: z.number().int().min(0),
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    settings: z
      .object({
        stalePositiveDays: z.number().int().min(1).max(90).optional(),
        slaBusinessHours: z.number().int().min(1).max(168).optional(),
        businessStartHour: z.number().int().min(0).max(23).optional(),
        businessEndHour: z.number().int().min(1).max(24).optional(),
        ageWeight: z.number().min(0).max(10).optional(),
        campaignWeights: z
          .array(
            z
              .object({ campaignId: ResourceIdSchema, weight: z.number().min(-20).max(20) })
              .strict(),
          )
          .max(100)
          .optional(),
      })
      .strict(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const MetricsReconcileInputSchema = z
  .object({
    scope: z.enum(["workspace", "campaign", "range"]).optional(),
    campaign: ResourceIdSchema.optional(),
    from: ResourceVersionSchema.optional(),
    to: ResourceVersionSchema.optional(),
    timezone: z.string().max(100).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
const SharedInput60Schema = z
  .enum(["compact", "full"])
  .describe(
    "Defaults to compact. Success acknowledgement is at most 300 bytes including the MCP result. Full retains the standard diagnostic envelope. Failures retain actionable errors.",
  );
export const AgentHeartbeatInputSchema = z
  .object({
    responseMode: SharedInput60Schema.optional(),
    agentId: ResourceIdSchema,
    status: z.enum(["idle", "working", "degraded"]),
    consumerLagSeq: z.number().int().min(0).max(9007199254740991).optional(),
    note: z.string().max(500).optional(),
    dryRun: z.boolean().optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const AgentRunStartInputSchema = z
  .object({
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    trigger: z.enum(["schedule", "webhook", "manual"]),
    triggerRef: z.string().max(500).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const AgentRunEndInputSchema = z
  .object({
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    runId: ResourceIdSchema,
    summary: z.string().max(2000),
    outcome: z.enum(["completed", "failed", "cancelled"]),
  })
  .strict();
export const AgentRunsListInputSchema = z
  .object({
    agentId: ResourceIdSchema.optional(),
    before: ResourceIdSchema.optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const AgentRunInspectInputSchema = z
  .object({
    agentRunId: ResourceIdSchema.optional(),
    view: z.enum(["compact", "standard", "full", "summary"]).optional(),
    runId: ResourceIdSchema.optional(),
    afterSeq: z.number().int().min(0).max(9007199254740991).optional(),
    limit: z.number().int().min(1).max(200).optional(),
  })
  .strict();
export const WorkspaceHaltInputSchema = z
  .object({
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    expectedVersion: z.number().int().min(0),
    haltEverything: z.boolean().optional(),
    reason: z.string().min(1).max(500),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const WorkspaceResumeInputSchema = z
  .object({
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    expectedVersion: z.number().int().min(0),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const ChannelHaltInputSchema = z
  .object({
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    expectedVersion: z.number().int().min(0),
    channel: z.enum(["instagram", "facebook", "linkedin", "gmail", "sms"]),
    halted: z.boolean(),
    reason: z.string().min(1).max(500),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const WorkspaceAutomationInspectInputSchema = z
  .object({ runId: SharedInput4Schema.optional() })
  .strict();
const SharedInput61Schema = z.enum([
  "bug",
  "missing_capability",
  "confusing_behavior",
  "performance",
  "improvement",
]);
const SharedInput62Schema = z
  .string()
  .trim()
  .min(1)
  .max(240)
  .regex(new RegExp(".*\\S.*"))
  .describe("One concrete problem or improvement.");
const SharedInput63Schema = z
  .string()
  .trim()
  .min(1)
  .max(1000)
  .regex(new RegExp(".*\\S.*"))
  .describe("The task being attempted, without customer data.");
const SharedInput64Schema = z
  .string()
  .trim()
  .min(1)
  .max(2000)
  .regex(new RegExp(".*\\S.*"))
  .describe("What actually happened; omit private transcripts and raw tool payloads.");
const SharedInput65Schema = z
  .string()
  .trim()
  .min(1)
  .max(2000)
  .regex(new RegExp(".*\\S.*"))
  .describe("What should happen instead.");
const SharedInput66Schema = z
  .string()
  .trim()
  .min(1)
  .max(2000)
  .regex(new RegExp(".*\\S.*"))
  .describe("Optional proposed improvement; distinguish speculation from observed behavior.");
const SharedInput67Schema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(new RegExp(".*\\S.*"))
  .describe(
    "Affected MCP or API tool name, if known. Unknown names are allowed for missing tools.",
  );
const SharedInput68Schema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(new RegExp(".*\\S.*"))
  .describe("Optional request reference already returned by DM Faster; do not invent one.");
export const AgentFeedbackSubmitInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    category: SharedInput61Schema,
    summary: SharedInput62Schema,
    task: SharedInput63Schema.optional(),
    observed: SharedInput64Schema.optional(),
    expected: SharedInput65Schema.optional(),
    suggestion: SharedInput66Schema.optional(),
    toolName: SharedInput67Schema.optional(),
    requestId: SharedInput68Schema.optional(),
    impact: z.enum(["blocked", "workaround", "minor"]).optional(),
    idempotencyKey: IdempotencyKeySchema,
    runId: SharedInput4Schema.optional(),
  })
  .strict();
const SharedInput69Schema = z
  .string()
  .trim()
  .min(1)
  .max(100)
  .regex(new RegExp(".*\\S.*"))
  .describe("Use nextCursor from the previous page, unchanged.");
export const AgentFeedbackListInputSchema = z
  .object({
    limit: z.number().int().min(1).max(25).optional(),
    before: SharedInput69Schema.optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
const SharedInput70Schema = z.enum([
  "phone",
  "email",
  "instagram",
  "facebook",
  "linkedin",
  "website_form",
  "domain",
  "business_id",
  "company_outreach",
]);
export const EntityResolveInputSchema = z
  .object({
    identity: z
      .object({ type: SharedInput70Schema, value: z.string().min(1).max(500) })
      .strict()
      .optional(),
    conversationId: ResourceIdSchema.optional(),
    meetingId: ResourceIdSchema.optional(),
    runId: ResourceIdSchema.optional(),
  })
  .strict();
export const EntitiesGetInputSchema = z
  .object({ ids: z.array(ResourceIdSchema).min(1).max(100), runId: ResourceIdSchema.optional() })
  .strict();
export const PeopleUpsertInputSchema = z
  .object({
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    runId: ResourceIdSchema.optional(),
    matchingIdentity: z
      .object({ type: SharedInput70Schema, value: z.string().min(1).max(500) })
      .strict(),
    name: z.string().min(1).max(200),
    identities: z
      .array(z.object({ type: SharedInput70Schema, value: z.string().min(1).max(500) }).strict())
      .max(49)
      .optional(),
    companyId: ResourceIdSchema.optional(),
    role: z.string().max(200).optional(),
    country: z.string().regex(new RegExp("^[A-Z]{2}$")).optional(),
    timezone: z.string().max(80).optional(),
    nameVariants: z.array(z.string().min(1).max(200)).max(20).optional(),
    source: z.string().min(1).max(120),
    expectedVersion: z.number().int().min(0),
  })
  .strict();
export const CompaniesUpsertInputSchema = z
  .object({
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    runId: ResourceIdSchema.optional(),
    matchingIdentity: z
      .object({ type: SharedInput70Schema, value: z.string().min(1).max(500) })
      .strict(),
    name: z.string().min(1).max(200),
    identities: z
      .array(z.object({ type: SharedInput70Schema, value: z.string().min(1).max(500) }).strict())
      .max(49)
      .optional(),
    companyId: ResourceIdSchema.optional(),
    role: z.string().max(200).optional(),
    country: z.string().regex(new RegExp("^[A-Z]{2}$")).optional(),
    timezone: z.string().max(80).optional(),
    nameVariants: z.array(z.string().min(1).max(200)).max(20).optional(),
    source: z.string().min(1).max(120),
    expectedVersion: z.number().int().min(0),
  })
  .strict();
export const EntityMergeInputSchema = z
  .object({
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    runId: ResourceIdSchema.optional(),
    sourceId: ResourceIdSchema,
    targetId: ResourceIdSchema,
    sourceVersion: z.number().int().min(0),
    targetVersion: z.number().int().min(0),
  })
  .strict();
export const EntitySplitInputSchema = z
  .object({
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    runId: ResourceIdSchema.optional(),
    changeId: ResourceIdSchema,
    sourceVersion: z.number().int().min(0),
    targetVersion: z.number().int().min(0),
  })
  .strict();
export const BudgetStatusInputSchema = z
  .object({ agentId: ResourceIdSchema.optional(), runId: ResourceIdSchema.optional() })
  .strict();
export const CallStatsGetInputSchema = z
  .object({
    meetingId: ResourceIdSchema.optional(),
    meetingIds: z.array(ResourceIdSchema).min(1).max(50).optional(),
    includeSpeakers: z.boolean().optional(),
  })
  .strict();
export const CallCoachingGetInputSchema = z.object({ meetingId: ResourceIdSchema }).strict();
const SharedInput71Schema = z.enum([
  "rep",
  "agent",
  "outcome",
  "campaign",
  "week",
  "month",
  "meetingSource",
  "language",
]);
const SharedInput72Schema = z.enum([
  "talkRatioTeam",
  "longestMonologueTeam",
  "questionsByTeam",
  "questionsByExternal",
  "interruptionsByTeam",
  "durationMs",
  "silenceShare",
  "callsRecorded",
  "callsWithStats",
  "heldRate",
]);
export const CallAnalyticsQueryInputSchema = z
  .object({
    from: ResourceVersionSchema,
    to: ResourceVersionSchema,
    groupBy: SharedInput71Schema,
    metrics: z.array(SharedInput72Schema).min(1).max(10),
    filters: z
      .object({
        repUserId: ResourceIdSchema.optional(),
        agentId: ResourceIdSchema.optional(),
        campaignId: ResourceIdSchema.optional(),
        outcome: z.string().max(40).optional(),
        minCoverageBps: z.number().int().min(0).max(10000).optional(),
      })
      .strict()
      .optional(),
    cursor: z.string().max(2000).optional(),
  })
  .strict();
export const CallInsightGetInputSchema = z
  .object({ meetingId: ResourceIdSchema, runId: z.string().max(100).optional() })
  .strict();
export const CallAccessListInputSchema = z
  .object({
    meetingId: ResourceIdSchema,
    cursor: z.string().max(1500).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: z.string().max(100).optional(),
  })
  .strict();
export const CallAuditListInputSchema = z
  .object({
    meetingId: ResourceIdSchema,
    cursor: z.string().max(1500).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: z.string().max(100).optional(),
  })
  .strict();
export const CallActivityGetInputSchema = z
  .object({
    meetingId: ResourceIdSchema,
    cursor: z.string().max(1500).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: z.string().max(100).optional(),
  })
  .strict();
export const CallAnalysisGetInputSchema = z
  .object({ meetingId: ResourceIdSchema, runId: z.string().max(100).optional() })
  .strict();
const SharedInput73Schema = z.enum([
  "meeting_held",
  "no_show",
  "won",
  "lost",
  "follow_up",
  "rescheduled",
]);
export const CallOutcomeConfirmInputSchema = z
  .object({
    meetingId: ResourceIdSchema,
    outcome: SharedInput73Schema,
    lostReason: z.string().max(500).optional(),
    notes: z.string().max(2000).optional(),
    fromAnalysisVersion: z.string().regex(new RegExp("^[a-f0-9]{64}$")),
    expectedVersion: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    dryRun: z.boolean().optional(),
    runId: z.string().max(100).optional(),
  })
  .strict();
export const CallAttendanceGetInputSchema = z
  .object({
    meetingId: ResourceIdSchema,
    cursor: z.string().max(1500).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: z.string().max(100).optional(),
  })
  .strict();
const SharedInput74Schema = z.enum([
  "summary",
  "painPoints",
  "objections",
  "decisionProcess",
  "commitments",
  "nextSteps",
  "crmNoteDraft",
]);
export const CallInsightReviewInputSchema = z
  .object({
    meetingId: ResourceIdSchema,
    insightId: ResourceIdSchema,
    action: z.enum(["approve", "reject"]),
    selectedSections: z.array(SharedInput74Schema).min(1).max(7).optional(),
    feedback: z.string().max(2000).optional(),
    expectedVersion: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    dryRun: z.boolean().optional(),
    runId: z.string().max(100).optional(),
  })
  .strict();
export const RecorderEventOverrideGetInputSchema = z
  .object({
    calendarId: ResourceIdSchema,
    eventId: ResourceIdSchema,
    allInstances: z.boolean().optional(),
  })
  .strict();
export const RecorderEventOverrideUpdateInputSchema = z
  .object({
    calendarId: ResourceIdSchema,
    eventId: ResourceIdSchema,
    allInstances: z.boolean().optional(),
    record: z.enum(["on", "off"]),
    expectedVersion: z.number().int().min(0),
    idempotencyKey: IdempotencyKeySchema,
    dryRun: z.boolean().optional(),
    runId: z.string().max(100).optional(),
  })
  .strict();
export const CallBotCancelInputSchema = z
  .object({
    meetingId: ResourceIdSchema.optional(),
    botId: ResourceIdSchema.optional(),
    expectedVersion: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    dryRun: z.boolean().optional(),
    runId: z.string().max(100).optional(),
  })
  .strict();
export const CallBotRemoveInputSchema = z
  .object({
    meetingId: ResourceIdSchema.optional(),
    botId: ResourceIdSchema.optional(),
    expectedVersion: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    dryRun: z.boolean().optional(),
    runId: z.string().max(100).optional(),
  })
  .strict();
export const CallRecordingStopInputSchema = z
  .object({
    meetingId: ResourceIdSchema.optional(),
    botId: ResourceIdSchema.optional(),
    expectedVersion: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    dryRun: z.boolean().optional(),
    runId: z.string().max(100).optional(),
  })
  .strict();
export const RecorderStatusInputSchema = z
  .object({
    timezone: z.string().min(1).max(100).optional(),
    upcomingLimit: z.number().int().min(1).max(50).optional(),
  })
  .strict();
export const CallBotJoinInputSchema = z
  .object({
    meetingUrl: z.string().min(1).max(8000),
    title: z.string().max(500).optional(),
    joinAt: ResourceVersionSchema.optional(),
    durationMinutes: z.number().int().min(1).max(240).optional(),
    language: z.enum(["auto", "fi", "en"]).optional(),
    idempotencyKey: IdempotencyKeySchema,
    dryRun: z.boolean().optional(),
    runId: z.string().max(100).optional(),
  })
  .strict();
export const RecorderJoinGetInputSchema = z
  .object({ requestId: ResourceIdSchema.optional(), meetingId: ResourceIdSchema.optional() })
  .strict()
  .describe(
    "Supply requestId, or meetingId for the latest request of a meeting (state none when there is no request).",
  );
export const CallParticipantWithdrawalReportInputSchema = z
  .object({
    meetingId: ResourceIdSchema,
    speakerId: ResourceIdSchema,
    idempotencyKey: IdempotencyKeySchema,
    dryRun: z.boolean().optional(),
    runId: z.string().max(100).optional(),
    transcriptVersion: z.number().int().min(1),
    expectedVersion: ResourceVersionSchema,
  })
  .strict();
export const CallDeleteInputSchema = z
  .object({
    meetingId: ResourceIdSchema,
    scope: z.enum(["media", "transcript", "analysis", "all"]),
    expectedVersion: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    dryRun: z.boolean().optional(),
    runId: z.string().max(100).optional(),
  })
  .strict();
export const CopyApprovalRequestInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    plan: ProspectingPlanSchema.optional(),
    idempotencyKey: IdempotencyKeySchema,
    campaignId: z.string().min(1).max(160).optional(),
  })
  .strict();
export const CampaignDraftPlanInputSchema = z
  .object({
    plan: ProspectingPlanSchema.optional(),
    approvalId: z.string().min(1).max(160).optional(),
    dryRun: z.boolean().optional(),
    idempotencyKey: IdempotencyKeySchema.optional(),
  })
  .strict();
export const CampaignDraftReadinessInputSchema = z
  .object({ campaignId: z.string().min(1).max(160) })
  .strict();
export const ProspectingPreviewInputSchema = z
  .object({
    audiencePage: ProspectingAudiencePageSchema.optional(),
    filters: CompanySearchFiltersSchema,
    channels: z
      .array(z.enum(["instagram", "facebook", "linkedin", "gmail", "sms"]))
      .max(5)
      .optional(),
    excludePreviouslyContacted: z.boolean().optional(),
    contactStatus: z.array(SharedInput25Schema).max(7).optional(),
    sampleSize: z.number().int().min(1).max(50).optional(),
    offset: z.number().int().min(0).max(25000).optional(),
    expectedRevision: z.string().min(1).max(1024).optional(),
    querySignature: z.string().min(1).max(200).optional(),
  })
  .strict();
const SharedInput75Schema = z
  .string()
  .regex(new RegExp("^look_[a-f0-9]{32}$"))
  .describe(
    "Poll a job using this connection; omit seed when polling. Results recheck current contact and suppression eligibility.",
  );
const SharedInput76Schema = z
  .enum(["async", "sync"])
  .describe("Defaults to async with jobId and pollAfterMs. Sync retains the bounded legacy read.");
export const CompaniesLookalikeInputSchema = z
  .object({
    jobId: SharedInput75Schema.optional(),
    execution: SharedInput76Schema.optional(),
    countries: z.array(SupportedCountrySchema).min(1).max(1).optional(),
    seed: z
      .object({
        companyKeys: z.array(z.string().min(1).max(240)).min(1).max(500).optional(),
        pipelineStages: z
          .array(z.enum(["call_booked", "meeting_held", "won"]))
          .min(1)
          .max(3)
          .optional(),
      })
      .strict()
      .optional(),
    country: SupportedCountrySchema.optional(),
    limit: z.number().int().min(1).max(50).optional(),
    cursor: z.string().min(1).max(1000).optional(),
  })
  .strict();
export const CommitmentsProposeInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    meetingId: z.string().min(1).max(160),
    cursor: z.string().min(1).max(2000).optional(),
    timezone: z.string().min(1).max(80).optional(),
    idempotencyKey: IdempotencyKeySchema,
  })
  .strict();
const SharedInput77Schema = z.enum([
  "proposed",
  "confirmed",
  "due",
  "done",
  "cancelled",
  "overdue",
]);
const SharedInput78Schema = z
  .string()
  .regex(new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d{1,6})?Z$"));
export const CommitmentsListInputSchema = z
  .object({
    status: SharedInput77Schema.optional(),
    dueBefore: SharedInput78Schema.optional(),
    ownerSide: z.enum(["us", "prospect"]).optional(),
    pipelineCardId: z.string().min(1).max(240).optional(),
    cursor: z.string().min(1).max(2000).optional(),
    limit: z.number().int().min(1).max(50).optional(),
  })
  .strict();
export const CommitmentUpdateInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    id: z.string().min(1).max(160),
    expectedUpdatedAt: SharedInput78Schema,
    status: z.enum(["confirmed", "done", "cancelled"]),
    dueAt: SharedInput78Schema.optional(),
    idempotencyKey: IdempotencyKeySchema,
  })
  .strict();
export const CommitmentConfirmBatchInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    items: z
      .array(
        z
          .object({
            id: z.string().min(1).max(160),
            expectedUpdatedAt: SharedInput78Schema,
            dueAt: SharedInput78Schema.optional(),
          })
          .strict(),
      )
      .min(1)
      .max(50),
    idempotencyKey: IdempotencyKeySchema,
  })
  .strict();
export const CommitmentReminderDraftInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    id: z.string().min(1).max(160),
    text: z.string().min(1).max(1000),
    expectedConversationUpdatedAt: SharedInput78Schema,
    idempotencyKey: IdempotencyKeySchema,
  })
  .strict();
export const ListRenameInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    listId: z.string().min(1).max(160),
    name: z.string().min(1).max(120),
    expectedUpdatedAt: SharedInput78Schema,
  })
  .strict();
export const ListArchiveInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    listId: z.string().min(1).max(160),
    expectedUpdatedAt: SharedInput78Schema,
  })
  .strict();
export const CampaignDraftArchiveInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    campaignId: z.string().min(1).max(160),
    expectedUpdatedAt: SharedInput78Schema,
  })
  .strict();
export const CopyApprovalInspectInputSchema = z
  .object({ approvalId: z.string().min(1).max(160) })
  .strict();
export const CopyApprovalCancelInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    approvalId: z.string().min(1).max(160),
    idempotencyKey: IdempotencyKeySchema,
  })
  .strict();
export const ApprovalCancelInputSchema = z
  .object({
    dryRun: z
      .boolean()
      .describe(
        "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      )
      .optional(),
    approvalId: z.string().min(1).max(160),
    idempotencyKey: IdempotencyKeySchema,
    expectedRevision: z.number().int().min(1),
    reason: z.string().min(1).max(500),
  })
  .strict();
export const ApprovalsListInputSchema = z
  .object({
    cursor: z.string().min(1).max(1000).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    status: z.enum(["pending", "approved", "rejected"]).optional(),
    runId: SharedInput4Schema.optional(),
  })
  .strict();
export const AGENT_INPUT_SCHEMAS = {
  "analytics.summary": AnalyticsSummaryInputSchema,
  "workspace.briefing": WorkspaceBriefingInputSchema,
  "campaigns.list": CampaignsListInputSchema,
  "campaign.inspect": CampaignInspectInputSchema,
  "campaign.copy.inspect": CampaignCopyInspectInputSchema,
  "sending.inspect": SendingInspectInputSchema,
  "replies.list": RepliesListInputSchema,
  "conversations.list": ConversationsListInputSchema,
  "conversation.inspect": ConversationInspectInputSchema,
  "conversation.update": ConversationUpdateInputSchema,
  "conversation.reply": ConversationReplyInputSchema,
  "conversation.reply.inspect": ConversationReplyInspectInputSchema,
  "campaign.messages.draft.list": CampaignMessagesDraftListInputSchema,
  "campaign.messages.draft.update": CampaignMessagesDraftUpdateInputSchema,
  "campaign.messages.list": CampaignMessagesListInputSchema,
  "campaign.messages.update": CampaignMessagesUpdateInputSchema,
  "campaign.followups.list": CampaignFollowupsListInputSchema,
  "campaign.followups.cancel": CampaignFollowupsCancelInputSchema,
  "campaign.outcomes.list": CampaignOutcomesListInputSchema,
  "sending.test.prepare": DeliveryTestPrepareInputSchema,
  "sending.test.send": DeliveryTestSendInputSchema,
  "sending.test.inspect": DeliveryTestInspectInputSchema,
  "senders.inspect": WorkspaceBriefingInputSchema,
  "history.list": HistoryListInputSchema,
  "pipeline.inspect": PipelineInspectInputSchema,
  "pipeline.cards.list": PipelineCardsListInputSchema,
  "pipeline.stage.update": PipelineStageUpdateInputSchema,
  "pipeline.note.list": PipelineNoteListInputSchema,
  "pipeline.note.add": PipelineNoteAddInputSchema,
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
  "companies.suggest": CompanySuggestionsInputSchema,
  "prospect.query": ProspectQueryInputSchema,
  "companies.search": CompanySearchInputSchema,
  "companies.evidence.search": CompanyEvidenceSearchInputSchema,
  "companies.knowledge.search": WorkspaceCompanyKnowledgeInputSchema,
  "companies.knowledge": CompanyKnowledgeInputSchema,
  "companies.evidence.start": CompanyEvidenceStartInputSchema,
  "companies.evidence.advance": CompanyEvidenceAdvanceInputSchema,
  "companies.evidence.status": CompanyEvidenceStatusInputSchema,
  "companies.evidence.results": CompanyEvidenceResultsInputSchema,
  "companies.evidence.cancel": CompanyEvidenceCancelInputSchema,
  "company.inspect": CompanyInspectInputSchema,
  "companies.fit.start": CompanyFitStartInputSchema,
  "companies.fit.advance": CompanyFitAdvanceInputSchema,
  "companies.fit.results": CompanyFitResultsInputSchema,
  "companies.fit.proposal": CompanyFitProposalInputSchema,
  "companies.list.prepare": CompanyListPrepareInputSchema,
  "companies.list.inspect": CompanyListInspectInputSchema,
  "companies.list.refine": CompanyListRefineInputSchema,
  "campaign.operation.inspect": CampaignOperationInspectInputSchema,
  "campaign.delivery.inspect": CampaignDeliveryInspectInputSchema,
  "campaign.delivery.update": CampaignDeliveryUpdateInputSchema,
  "sending.instagram.pacing.inspect": InstagramPacingInspectInputSchema,
  "sending.instagram.pacing.update": InstagramPacingUpdateInputSchema,
  "companies.fit.status": CompanyFitStatusInputSchema,
  "companies.fit.cancel": CompanyFitCancelInputSchema,
  "companies.fit.runs.list": CompanyFitRunsListInputSchema,
  "companies.fit.run": CompanyFitRunInputSchema,
  "companies.fit.cohort": CompanyFitCohortInputSchema,
  "copy.performance": CopyPerformanceInputSchema,
  "calendar.status": CalendarStatusInputSchema,
  "calendar.availability": CalendarAvailabilityInputSchema,
  "calendar.meeting.book": CalendarMeetingBookInputSchema,
  "calls.list": CallsListInputSchema,
  "call.inspect": CallInspectInputSchema,
  "instagram.extract.quote": InstagramExtractionQuoteInputSchema,
  "instagram.extract.start": InstagramExtractionStartInputSchema,
  "instagram.extract.inspect": InstagramExtractionInspectInputSchema,
  "instagram.extract.results": InstagramExtractionResultsInputSchema,
  "instagram.purchases.list": InstagramPurchasesListInputSchema,
  "instagram.purchases.inspect": InstagramPurchasesInspectInputSchema,
  "instagram.purchases.results": InstagramPurchasesResultsInputSchema,
  "leads.status": LeadsStatusInputSchema,
  "leads.extract.quote": LeadExtractionQuoteInputSchema,
  "leads.extract.start": LeadExtractionStartInputSchema,
  "leads.extract.inspect": LeadExtractionInspectInputSchema,
  "leads.extract.refresh": LeadExtractionRefreshInputSchema,
  "leads.extract.continue": LeadExtractionContinueInputSchema,
  "leads.enrich.preview": LeadEnrichmentPreviewInputSchema,
  "leads.enrich.start": LeadEnrichmentStartInputSchema,
  "leads.enrich.inspect": LeadEnrichmentInspectInputSchema,
  "leads.prospect.quote": InstagramProspectInputSchema,
  "leads.prospect.start": InstagramProspectStartInputSchema,
  "leads.prospect.inspect": InstagramProspectRunInputSchema,
  "leads.prospect.results": InstagramProspectResultsInputSchema,
  "leads.prospect.advance": InstagramProspectRunInputSchema,
  "leads.prospect.cancel": InstagramProspectRunInputSchema,
  "events.list": EventsListInputSchema,
  "conversations.changes": ConversationsChangesInputSchema,
  "suppressions.list": SuppressionsListInputSchema,
  "suppressions.add": SuppressionsAddInputSchema,
  "suppressions.remove": SuppressionsRemoveInputSchema,
  "workspace.sandbox.create": WorkspaceSandboxCreateInputSchema,
  "sandbox.seed": SandboxSeedInputSchema,
  "sandbox.inbound.simulate": SandboxInboundSimulateInputSchema,
  "sandbox.clock.advance": SandboxClockAdvanceInputSchema,
  "call.outcome.set": CallOutcomeSetInputSchema,
  "meeting.link": MeetingLinkInputSchema,
  "meeting.unlink": MeetingUnlinkInputSchema,
  "webhooks.create": WebhooksCreateInputSchema,
  "webhooks.list": WebhooksListInputSchema,
  "webhooks.update": WebhooksUpdateInputSchema,
  "webhooks.delete": WebhooksDeleteInputSchema,
  "webhooks.test": WebhooksTestInputSchema,
  "webhooks.replay": WebhooksReplayInputSchema,
  "meetings.unlinked.list": MeetingsUnlinkedListInputSchema,
  "pipeline.reconcile": PipelineReconcileInputSchema,
  "workspace.agent_sales.get": WorkspaceAgentSalesGetInputSchema,
  "workspace.agent_sales.update": WorkspaceAgentSalesUpdateInputSchema,
  "sandbox.provider.update": SandboxProviderUpdateInputSchema,
  "reply.templates.list": ReplyTemplatesListInputSchema,
  "reply.templates.create": ReplyTemplatesCreateInputSchema,
  "reply.templates.update": ReplyTemplatesUpdateInputSchema,
  "reply.templates.delete": ReplyTemplatesDeleteInputSchema,
  "reply.policy.get": ReplyPolicyGetInputSchema,
  "reply.policy.update": ReplyPolicyUpdateInputSchema,
  "reply.approvals.list": ReplyApprovalsListInputSchema,
  "conversation.draft.save": ConversationDraftSaveInputSchema,
  "conversation.followup.set": ConversationFollowupSetInputSchema,
  "conversation.followup.clear": ConversationFollowupClearInputSchema,
  "followups.due": FollowupsDueInputSchema,
  "conversations.bulk.update": ConversationsBulkUpdateInputSchema,
  "pipeline.board": PipelineBoardInputSchema,
  "calendar.booking.link.create": CalendarBookingLinkCreateInputSchema,
  "calendar.meeting.reschedule": CalendarMeetingRescheduleInputSchema,
  "calendar.meeting.cancel": CalendarMeetingCancelInputSchema,
  "campaign.followups.configure": CampaignFollowupsConfigureInputSchema,
  "campaign.variants.configure": CampaignVariantsConfigureInputSchema,
  "recorder.settings.get": RecorderSettingsGetInputSchema,
  "recorder.settings.update": RecorderSettingsUpdateInputSchema,
  "recorder.bots.list": RecorderBotsListInputSchema,
  "call.transcript.get": CallTranscriptGetInputSchema,
  "call.recording.get": CallRecordingGetInputSchema,
  "call.transcripts.get": CallTranscriptsGetInputSchema,
  "call.transcripts.search": CallTranscriptsSearchInputSchema,
  "readiness.check": ReadinessCheckInputSchema,
  "sender.retire": SenderRetireInputSchema,
  "sender.unretire": SenderUnretireInputSchema,
  "attribution.check": AttributionCheckInputSchema,
  "campaign.reengagement.prepare": CampaignReengagementPrepareInputSchema,
  "agents.list": AgentsListInputSchema,
  "agent.inspect": AgentInspectInputSchema,
  "agent.create.request": AgentCreateRequestInputSchema,
  "agent.pause": AgentPauseInputSchema,
  "agent.resume": AgentResumeInputSchema,
  "agent.credential.rotate": AgentCredentialRotateInputSchema,
  "event_consumers.list": EventConsumersListInputSchema,
  "event_consumers.create": EventConsumersCreateInputSchema,
  "events.ack": EventsAckInputSchema,
  "events.snapshot": EventsSnapshotInputSchema,
  "webhook.deliveries.list": WebhookDeliveriesListInputSchema,
  "webhooks.dlq.replay": WebhooksDlqReplayInputSchema,
  "classification.feedback": ClassificationFeedbackInputSchema,
  "classification.quality": ClassificationQualityInputSchema,
  "classification.backfill.plan": ClassificationBackfillPlanInputSchema,
  "work_queue.list": WorkQueueListInputSchema,
  "work_item.claim": WorkItemClaimInputSchema,
  "work_item.release": WorkItemReleaseInputSchema,
  "work_item.snooze": WorkItemSnoozeInputSchema,
  "work_item.complete": WorkItemCompleteInputSchema,
  "work_queue.config.get": WorkQueueConfigGetInputSchema,
  "work_queue.config.update": WorkQueueConfigUpdateInputSchema,
  "metrics.reconcile": MetricsReconcileInputSchema,
  "agent.heartbeat": AgentHeartbeatInputSchema,
  "agent.run.start": AgentRunStartInputSchema,
  "agent.run.end": AgentRunEndInputSchema,
  "agent.runs.list": AgentRunsListInputSchema,
  "agent.run.inspect": AgentRunInspectInputSchema,
  "workspace.halt": WorkspaceHaltInputSchema,
  "workspace.resume": WorkspaceResumeInputSchema,
  "channel.halt": ChannelHaltInputSchema,
  "workspace.automation.inspect": WorkspaceAutomationInspectInputSchema,
  "feedback.submit": AgentFeedbackSubmitInputSchema,
  "feedback.list": AgentFeedbackListInputSchema,
  "entity.resolve": EntityResolveInputSchema,
  "entities.get": EntitiesGetInputSchema,
  "people.upsert": PeopleUpsertInputSchema,
  "companies.upsert": CompaniesUpsertInputSchema,
  "entity.merge": EntityMergeInputSchema,
  "entity.split": EntitySplitInputSchema,
  "budget.status": BudgetStatusInputSchema,
  "call.stats.get": CallStatsGetInputSchema,
  "call.coaching.get": CallCoachingGetInputSchema,
  "call.analytics.query": CallAnalyticsQueryInputSchema,
  "call.insight.get": CallInsightGetInputSchema,
  "call.access.list": CallAccessListInputSchema,
  "call.audit.list": CallAuditListInputSchema,
  "call.activity.get": CallActivityGetInputSchema,
  "call.analysis.get": CallAnalysisGetInputSchema,
  "call.outcome.confirm": CallOutcomeConfirmInputSchema,
  "call.attendance.get": CallAttendanceGetInputSchema,
  "call.insight.review": CallInsightReviewInputSchema,
  "recorder.event.override.get": RecorderEventOverrideGetInputSchema,
  "recorder.event.override.update": RecorderEventOverrideUpdateInputSchema,
  "call.bot.cancel": CallBotCancelInputSchema,
  "call.bot.remove": CallBotRemoveInputSchema,
  "call.recording.stop": CallRecordingStopInputSchema,
  "recorder.status": RecorderStatusInputSchema,
  "call.bot.join": CallBotJoinInputSchema,
  "recorder.join.get": RecorderJoinGetInputSchema,
  "call.participant.withdrawal.report": CallParticipantWithdrawalReportInputSchema,
  "call.delete": CallDeleteInputSchema,
  "copy.approval.request": CopyApprovalRequestInputSchema,
  "campaign.draft.plan": CampaignDraftPlanInputSchema,
  "campaign.draft.readiness": CampaignDraftReadinessInputSchema,
  "prospecting.preview": ProspectingPreviewInputSchema,
  "companies.lookalike": CompaniesLookalikeInputSchema,
  "commitments.propose": CommitmentsProposeInputSchema,
  "commitments.list": CommitmentsListInputSchema,
  "commitment.update": CommitmentUpdateInputSchema,
  "commitment.confirm.batch": CommitmentConfirmBatchInputSchema,
  "commitment.reminder.draft": CommitmentReminderDraftInputSchema,
  "list.rename": ListRenameInputSchema,
  "list.archive": ListArchiveInputSchema,
  "campaign.draft.archive": CampaignDraftArchiveInputSchema,
  "copy.approval.inspect": CopyApprovalInspectInputSchema,
  "copy.approval.cancel": CopyApprovalCancelInputSchema,
  "approval.cancel": ApprovalCancelInputSchema,
  "approvals.list": ApprovalsListInputSchema,
} as const;
