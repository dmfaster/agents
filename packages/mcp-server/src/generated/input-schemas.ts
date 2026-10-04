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
export const TargetChannelSchema = z.union([
  z.literal("instagram"),
  z.literal("facebook"),
  z.literal("linkedin"),
  z.literal("gmail"),
  z.literal("sms"),
]);
export const CampaignsListInputSchema = z
  .object({
    status: CampaignStatusSchema.optional(),
    query: z.string().min(1).max(120).describe("Case-insensitive campaign name search.").optional(),
    channel: TargetChannelSchema.optional(),
    limit: z.number().int().min(1).max(25).optional(),
    cursor: z
      .string()
      .min(1)
      .max(500)
      .describe("Opaque nextCursor returned by the preceding page.")
      .optional(),
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
export const CampaignCopyInspectInputSchema = z.object({ campaignId: ResourceIdSchema }).strict();
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
export const InboxChannelSchema = z.union([
  z.literal("instagram"),
  z.literal("facebook"),
  z.literal("linkedin"),
  z.literal("gmail"),
  z.literal("outlook"),
  z.literal("email"),
  z.literal("sms"),
]);
export const ConversationsListInputSchema = z
  .object({
    filter: z
      .union([
        z.literal("all"),
        z.literal("needs_reply"),
        z.literal("waiting"),
        z.literal("unread"),
        z.literal("snoozed"),
        z.literal("closed"),
      ])
      .optional(),
    interest: z
      .union([
        z.literal("positive"),
        z.literal("neutral"),
        z.literal("negative"),
        z.literal("needs_review"),
      ])
      .optional(),
    intent: z
      .union([
        z.literal("interested"),
        z.literal("information_requested"),
        z.literal("meeting_intent"),
        z.literal("not_now"),
        z.literal("wrong_person"),
        z.literal("not_interested"),
        z.literal("opt_out"),
        z.literal("acknowledgement"),
        z.literal("unclear"),
      ])
      .optional(),
    channel: InboxChannelSchema.optional(),
    mailboxId: ResourceIdSchema.optional(),
    campaignId: ResourceIdSchema.optional(),
    query: z.string().min(1).max(120).optional(),
    includeAutomaticResponses: z.boolean().optional(),
    cursor: z.string().min(1).max(2000).optional(),
    limit: z.number().int().min(1).max(60).optional(),
  })
  .strict();
export const ConversationInspectInputSchema = z
  .object({
    conversationId: ResourceIdSchema,
    cursor: z.string().min(1).max(2000).optional(),
    limit: z.number().int().min(1).max(100).optional(),
  })
  .strict();
export const ResourceVersionSchema = z
  .string()
  .min(20)
  .max(27)
  .regex(new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d{1,6})?Z$"));
export const ConversationUpdateInputSchema = z
  .object({
    conversationId: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    action: z.union([
      z.literal("mark_read"),
      z.literal("mark_unread"),
      z.literal("close"),
      z.literal("reopen"),
      z.literal("snooze"),
      z.literal("unsnooze"),
      z.literal("assign_to_me"),
      z.literal("unassign"),
      z.literal("set_interest"),
    ]),
    snoozedUntil: ResourceVersionSchema.optional(),
    interestLevel: z
      .union([z.literal("positive"), z.literal("neutral"), z.literal("negative")])
      .optional(),
    interestIntent: z
      .union([
        z.literal("interested"),
        z.literal("information_requested"),
        z.literal("meeting_intent"),
        z.literal("not_now"),
        z.literal("wrong_person"),
        z.literal("not_interested"),
        z.literal("opt_out"),
        z.literal("acknowledgement"),
        z.literal("unclear"),
      ])
      .optional(),
  })
  .strict();
export const ConversationReplyInputSchema = z
  .object({
    conversationId: ResourceIdSchema,
    expectedLastInboundAt: ResourceVersionSchema,
    expectedLastMessageAt: ResourceVersionSchema,
    text: z.string().min(1).max(10000),
    idempotencyKey: z.string().min(8).max(160).regex(new RegExp("^[a-zA-Z0-9_-]+$")),
  })
  .strict();
export const ConversationReplyInspectInputSchema = z
  .object({ idempotencyKey: z.string().min(8).max(160).regex(new RegExp("^[a-zA-Z0-9_-]+$")) })
  .strict();
export const CampaignFollowupsListInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    view: z.union([z.literal("upcoming"), z.literal("done")]).optional(),
    cursor: z.string().min(1).max(512).optional(),
  })
  .strict();
export const CampaignFollowupsCancelInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    expectedCampaignUpdatedAt: ResourceVersionSchema,
    jobIds: z.array(ResourceIdSchema).min(1).max(50),
    idempotencyKey: z.string().min(8).max(160).regex(new RegExp("^[a-zA-Z0-9._:-]+$")),
  })
  .strict();
export const CampaignOutcomesListInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    cursor: z.string().min(1).max(512).optional(),
    limit: z.number().int().min(1).max(100).optional(),
  })
  .strict();
export const HistoryListInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    cursor: z.string().min(1).max(512).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    search: z.string().min(3).max(120).optional(),
  })
  .strict();
export const PipelineInspectInputSchema = OptionalCampaignInputSchema;
export const PipelineStageSchema = z.union([
  z.literal("contacted"),
  z.literal("replied"),
  z.literal("call_booked"),
  z.literal("closed"),
]);
export const PipelineCardsListInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    stage: PipelineStageSchema,
    limit: z.number().int().min(1).max(15).optional(),
    cursor: z.string().min(1).max(4000).optional(),
    query: z.string().min(1).max(120).optional(),
    entityKey: z.string().min(1).max(320).optional(),
  })
  .strict();
export const PipelineStageUpdateInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    entityKey: z.string().min(1).max(320),
    stageKey: z.string().min(1).max(500),
    expectedStage: PipelineStageSchema,
    stage: PipelineStageSchema,
  })
  .strict();
export const PipelineNoteListInputSchema = z
  .object({ campaignId: ResourceIdSchema, entityKey: z.string().min(1).max(320) })
  .strict();
export const PipelineNoteAddInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    entityKey: z.string().min(1).max(320),
    body: z.string().min(1).max(2000),
    idempotencyKey: z.string().min(8).max(160).regex(new RegExp("^[a-zA-Z0-9._:-]+$")),
  })
  .strict();
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
export const CampaignFollowUpStepInputSchema = z
  .object({
    delayDays: z.number().int().min(1).max(30),
    channel: z.union([
      z.literal("inherit"),
      z.literal("instagram"),
      z.literal("facebook"),
      z.literal("linkedin"),
      z.literal("gmail"),
    ]),
    fallbackChannel: z
      .union([
        z.literal("none"),
        z.literal("instagram"),
        z.literal("facebook"),
        z.literal("linkedin"),
        z.literal("gmail"),
      ])
      .optional(),
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
        linkedinInviteMode: z
          .union([z.literal("invite_only"), z.literal("invite_with_note")])
          .optional(),
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
export const CompanySuggestionsInputSchema = z
  .object({
    query: z.string().min(2).max(120),
    countries: z.array(SupportedCountrySchema).min(1).max(32),
    limit: z.number().int().min(1).max(10).optional(),
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
    technologies: z
      .array(z.string().max(80))
      .max(40)
      .describe(
        "Match any selected technology within each technology subsection and every selected subsection. Country picker options require at least 50 active companies; explicit saved criteria remain executable.",
      )
      .optional(),
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
    projection: z
      .union([z.literal("list"), z.literal("rich")])
      .describe(
        "List returns the compact app row and flat primary contact fields. Rich preserves contact arrays and is the default. Full profiles remain available through company.inspect.",
      )
      .optional(),
    page: z.number().int().min(1).max(10000).optional(),
    pageSize: z.number().int().min(1).max(100).optional(),
    cursor: z.string().max(1000).optional(),
    expectedRevision: z.string().max(200).optional(),
    querySignature: z.string().max(200).optional(),
  })
  .strict();
export const WebsiteEvidenceCriterionSchema = z
  .object({
    id: z.string().min(1).max(60),
    statement: z.string().min(1).max(800),
    requirement: z.union([z.literal("advertised"), z.literal("any_support")]),
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
    country: z.union([z.literal("FI")]),
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
  })
  .strict();
export const CompanyKnowledgeInputSchema = z
  .object({
    country: z.union([z.literal("FI")]),
    businessId: z.string().min(1).max(192),
    maxAgeDays: z.number().int().min(1).max(90).optional(),
  })
  .strict();
export const CompanyEvidenceStartInputSchema = z
  .object({
    country: z.union([z.literal("FI")]),
    query: z.string().min(1).max(1500),
    criteria: z.array(WebsiteEvidenceCriterionSchema).min(1).max(4),
    evaluationMode: z
      .union([z.literal("binary"), z.literal("passage")])
      .describe(
        "Binary evaluates related website sections together in one compact request per company. Passage preserves separate relationship statuses and explicit-denial merging. Omission preserves passage behavior.",
      )
      .optional(),
    filters: CompanySearchFiltersSchema.optional(),
    maxAgeDays: z.number().int().min(1).max(90).optional(),
    idempotencyKey: z.string().min(1).max(100),
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
  .object({ runId: z.string().min(36).max(36), expectedRevision: z.string().min(64).max(64) })
  .strict();
export const CompanyEvidenceResultsInputSchema = z
  .object({
    runId: z.string().min(36).max(36),
    expectedRevision: z.string().min(64).max(64),
    cursor: z.string().min(1).max(200).optional(),
    pageSize: z.number().int().min(1).max(20).optional(),
    view: z.union([z.literal("matches"), z.literal("unresolved"), z.literal("all")]).optional(),
  })
  .strict();
export const CompanyEvidenceCancelInputSchema = z
  .object({ runId: z.string().min(36).max(36), expectedRevision: z.string().min(64).max(64) })
  .strict();
export const CompanyInspectInputSchema = z
  .object({ country: SupportedCountrySchema, businessId: z.string().min(1).max(192) })
  .strict();
export const CompanyFitStartInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    listId: ResourceIdSchema,
    expectedCampaignUpdatedAt: z.string().min(20).max(40),
    expectedListUpdatedAt: z.string().min(20).max(40),
    expectedTotal: z.number().int().min(1).max(25000),
    expectedTargetCount: z.number().int().min(0).max(125000),
    offer: z
      .string()
      .min(20)
      .max(500)
      .describe("What B2B appointment-setting service is being sold to these companies."),
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
  })
  .strict();
export const CompanyFitAdvanceInputSchema = z
  .object({ runId: ResourceIdSchema, limit: z.number().int().min(1).max(16).optional() })
  .strict();
export const CompanyFitResultsInputSchema = z
  .object({
    runId: ResourceIdSchema,
    tier: z
      .union([z.literal("strong"), z.literal("possible"), z.literal("poor"), z.literal("unknown")])
      .optional(),
    offset: z.number().int().min(0).max(1000000).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    sort: z.union([z.literal("priority"), z.literal("audience")]).optional(),
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
export const CompanyListRefineInputSchema = z
  .object({
    listId: ResourceIdSchema,
    campaignId: ResourceIdSchema,
    expectedListUpdatedAt: z.string().min(20).max(40),
    expectedCampaignUpdatedAt: z.string().min(20).max(40),
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
    reviewedSelectionDigest: z
      .string()
      .min(64)
      .max(64)
      .describe("Echo selectionDigest from the matching dry run when apply is true.")
      .optional(),
    apply: z
      .boolean()
      .describe(
        "False previews exact removals without a write. True applies the same reviewed selection to the disabled draft list.",
      ),
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
export const InstagramPacingInspectInputSchema = z.object({}).strict();
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
    expectedRevision: z.union([
      z
        .string()
        .regex(
          new RegExp(
            "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[1-8][a-fA-F0-9]{3}-[89abAB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}$",
          ),
        ),
      z.null(),
    ]),
    idempotencyKey: z.string().min(1).max(160).regex(new RegExp("^[A-Za-z0-9._:-]+$")),
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
  })
  .strict();
export const CompanyFitStatusInputSchema = z.object({ runId: ResourceIdSchema }).strict();
export const CompanyFitCancelInputSchema = z.object({ runId: ResourceIdSchema }).strict();
export const CompanyFitRunCursorSchema = z
  .object({ createdAt: z.string().min(20).max(40), id: ResourceIdSchema })
  .strict();
export const CompanyFitRunsListInputSchema = z
  .object({
    campaignId: ResourceIdSchema.optional(),
    limit: z.number().int().min(1).max(25).optional(),
    before: CompanyFitRunCursorSchema.optional(),
  })
  .strict();
export const CompanyFitRunInputSchema = z
  .object({ runId: ResourceIdSchema, limit: z.number().int().min(1).max(8).optional() })
  .strict();
export const CompanyFitCohortInputSchema = z
  .object({
    runId: ResourceIdSchema,
    expectedVersion: z.string().min(64).max(64),
    take: z.number().int().min(1).max(1000),
    minimumPriority: z.number().int().min(1).max(100).optional(),
  })
  .strict();
export const CopyPerformanceInputSchema = z
  .object({
    campaignId: ResourceIdSchema.optional(),
    from: z.string().min(20).max(40),
    to: z.string().min(20).max(40),
    limit: z.number().int().min(1).max(25).optional(),
    offset: z.number().int().min(0).max(1000000).optional(),
  })
  .strict();
export const CalendarStatusInputSchema = z.object({}).strict();
export const CalendarAvailabilityInputSchema = z
  .object({
    from: z.string().min(20).max(40),
    to: z.string().min(20).max(40),
    timezone: z.string().min(1).max(80),
    durationMinutes: z.union([
      z.literal(15),
      z.literal(30),
      z.literal(45),
      z.literal(60),
      z.literal(90),
      z.literal(120),
    ]),
    limit: z.number().int().min(1).max(100).optional(),
  })
  .strict();
export const CalendarMeetingBookInputSchema = z
  .object({
    conversationId: ResourceIdSchema,
    expectedConversationUpdatedAt: z.string().min(20).max(40),
    idempotencyKey: z.string().min(8).max(120).regex(new RegExp("^[a-zA-Z0-9_-]{8,120}$")),
    title: z.string().min(1).max(200),
    start: z.string().min(20).max(40),
    timezone: z.string().min(1).max(80),
    durationMinutes: z.union([
      z.literal(15),
      z.literal(30),
      z.literal(45),
      z.literal(60),
      z.literal(90),
      z.literal(120),
    ]),
    attendees: z
      .array(z.string().min(3).max(320).regex(new RegExp("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")))
      .min(1)
      .max(20),
  })
  .strict();
export const CallsListInputSchema = z
  .object({
    offset: z.number().int().min(0).max(1000000).optional(),
    limit: z.number().int().min(1).max(50).optional(),
  })
  .strict();
export const CallInspectInputSchema = z.object({ meetingId: ResourceIdSchema }).strict();
export const InstagramExtractionQuoteInputSchema = z
  .object({
    username: z.string().trim().min(1).max(31).regex(new RegExp("^@?[A-Za-z0-9._]{1,30}$")),
    type: z.union([
      z.literal("followers"),
      z.literal("following"),
      z.literal("likers"),
      z.literal("commenters"),
    ]),
    count: z.number().int().min(1).max(2147483647),
    currency: z.union([z.literal("USD"), z.literal("EUR")]).optional(),
    postUrl: z.string().trim().min(1).max(300).optional(),
  })
  .strict();
export const InstagramExtractionStartInputSchema = z
  .object({
    username: z.string().trim().min(1).max(31).regex(new RegExp("^@?[A-Za-z0-9._]{1,30}$")),
    type: z.union([
      z.literal("followers"),
      z.literal("following"),
      z.literal("likers"),
      z.literal("commenters"),
    ]),
    count: z.number().int().min(1).max(2147483647),
    currency: z.union([z.literal("USD"), z.literal("EUR")]).optional(),
    postUrl: z.string().trim().min(1).max(300).optional(),
    idempotencyKey: z.string().trim().min(1).max(160).regex(new RegExp("^[A-Za-z0-9._:-]{1,160}$")),
  })
  .strict();
export const InstagramExtractionInspectInputSchema = z.object({ jobId: ResourceIdSchema }).strict();
export const InstagramExtractionResultsInputSchema = z
  .object({
    jobId: ResourceIdSchema,
    cursor: z.string().min(1).max(30).regex(new RegExp("^[A-Za-z0-9._]+$")).optional(),
    limit: z.number().int().min(1).max(100).optional(),
  })
  .strict();
export const LeadsStatusInputSchema = z
  .object({
    cursor: z.string().trim().min(1).max(1000).optional(),
    limit: z.number().int().min(1).max(50).optional(),
  })
  .strict();
export const LeadExtractionQuoteInputSchema = z
  .object({
    type: z.union([
      z.literal("followers"),
      z.literal("following"),
      z.literal("likers"),
      z.literal("commenters"),
    ]),
    identifier: z.string().trim().min(1).max(300),
    count: z.number().int().min(1).max(2147483647).optional(),
    postUrls: z.array(z.string().trim().min(1).max(300)).min(1).optional(),
    priority: z.union([z.literal("high"), z.literal("normal"), z.literal("low")]).optional(),
    feedType: z.union([z.literal("top"), z.literal("recent")]).optional(),
  })
  .strict();
export const LeadExtractionStartInputSchema = z
  .object({
    type: z.union([
      z.literal("followers"),
      z.literal("following"),
      z.literal("likers"),
      z.literal("commenters"),
    ]),
    identifier: z.string().trim().min(1).max(300),
    count: z.number().int().min(1).max(2147483647).optional(),
    postUrls: z.array(z.string().trim().min(1).max(300)).min(1).optional(),
    priority: z.union([z.literal("high"), z.literal("normal"), z.literal("low")]).optional(),
    feedType: z.union([z.literal("top"), z.literal("recent")]).optional(),
    idempotencyKey: z.string().trim().min(1).max(160).regex(new RegExp("^[A-Za-z0-9._:-]{1,160}$")),
  })
  .strict();
export const LeadExtractionInspectInputSchema = z.object({ jobId: ResourceIdSchema }).strict();
export const LeadExtractionRefreshInputSchema = z.object({ jobId: ResourceIdSchema }).strict();
export const LeadExtractionContinueInputSchema = z
  .object({
    jobId: ResourceIdSchema,
    count: z.number().int().min(1).max(2147483647).optional(),
    idempotencyKey: z.string().trim().min(1).max(160).regex(new RegExp("^[A-Za-z0-9._:-]{1,160}$")),
  })
  .strict();
export const LeadEnrichmentPreviewInputSchema = z.object({ listId: ResourceIdSchema }).strict();
export const LeadEnrichmentStartInputSchema = z
  .object({
    listId: ResourceIdSchema,
    maxCredits: z.number().int().min(0).max(2147483647).optional(),
    idempotencyKey: z.string().trim().min(1).max(160).regex(new RegExp("^[A-Za-z0-9._:-]{1,160}$")),
  })
  .strict();
export const LeadEnrichmentInspectInputSchema = z.object({ jobId: ResourceIdSchema }).strict();
export const InstagramProspectCriterionSchema = z
  .object({
    id: z.string().min(1).max(40).regex(new RegExp("^[a-z][a-z0-9_]{0,39}$")),
    statement: z.string().min(1).max(1000),
    basis: z.union([z.literal("text"), z.literal("visual")]),
    role: z.union([z.literal("required"), z.literal("preferred")]),
    unknown: z.union([z.literal("review"), z.literal("exclude")]),
    literalRule: z
      .union([
        z
          .object({
            kind: z.literal("follower_count"),
            min: z.number().int().min(0).optional(),
            max: z.number().int().min(0).optional(),
          })
          .strict(),
        z
          .object({
            kind: z.union([z.literal("privacy"), z.literal("verification")]),
            equals: z.boolean(),
          })
          .strict(),
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
            z
              .object({
                kind: z.union([z.literal("privacy"), z.literal("verification")]),
                equals: z.boolean(),
              })
              .strict(),
          ].filter((candidate) => candidate.safeParse(value).success).length === 1,
        "Expected exactly one schema match",
      )
      .optional(),
  })
  .strict();
export const InstagramProspectSourceSchema = z
  .object({
    type: z.union([
      z.literal("followers"),
      z.literal("following"),
      z.literal("likers"),
      z.literal("commenters"),
    ]),
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
    media: z.union([z.literal("none"), z.literal("avatar"), z.literal("recent_posts")]).optional(),
    model: z.union([z.literal("clef"), z.literal("clef-flash")]).optional(),
    includeReview: z.boolean().optional(),
    excludePreviouslyContacted: z.boolean().optional(),
    name: z.string().min(1).max(100).optional(),
  })
  .strict();
export const InstagramProspectStartInputSchema = z.intersection(
  InstagramProspectInputSchema,
  z.object({ idempotencyKey: z.string().min(1).max(120) }).strict(),
);
export const InstagramProspectRunInputSchema = z
  .object({ runId: z.string().min(1).max(100) })
  .strict();
export const InstagramProspectResultsInputSchema = z
  .object({
    runId: z.string().min(1).max(100),
    status: z
      .union([
        z.literal("pending"),
        z.literal("accept"),
        z.literal("review"),
        z.literal("exclude"),
        z.literal("suppressed"),
      ])
      .optional(),
    cursor: z.string().max(2000).optional(),
    limit: z.number().int().min(1).max(100).optional(),
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
  "campaign.followups.list": CampaignFollowupsListInputSchema,
  "campaign.followups.cancel": CampaignFollowupsCancelInputSchema,
  "campaign.outcomes.list": CampaignOutcomesListInputSchema,
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
  "companies.search": CompanySearchInputSchema,
  "companies.evidence.search": CompanyEvidenceSearchInputSchema,
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
} as const;
