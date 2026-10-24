// Generated from packages/public-api/openapi.yaml. Run npm run generate:agent-api.
import { z } from "zod";
export const ResourceIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(new RegExp(".*\\S.*"))
  .describe("A resource identifier returned by DM Faster. Never guess an identifier from a name.");
export const ResourceVersionSchema = z
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
export const AnalyticsSummaryInputSchema = z
  .object({
    scope: z.union([
      z.literal("today"),
      z.literal("last_24_hours"),
      z.literal("campaign_to_date"),
      z.literal("range"),
    ]),
    campaign: ResourceIdSchema.describe(
      "Optional campaign identifier or exact campaign name.",
    ).optional(),
    from: ResourceVersionSchema.optional(),
    to: ResourceVersionSchema.optional(),
    groupBy: z
      .array(
        z.union([
          z.literal("day"),
          z.literal("week"),
          z.literal("channel"),
          z.literal("campaign"),
          z.literal("actor"),
          z.literal("variant"),
        ]),
      )
      .max(6)
      .optional(),
    timezone: z.string().max(100).optional(),
    include: z
      .array(z.union([z.literal("canonical"), z.literal("legacy"), z.literal("definitions")]))
      .max(3)
      .optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const WorkspaceBriefingInputSchema = z
  .object({
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const OptionalCampaignInputSchema = z
  .object({
    campaignId: ResourceIdSchema.describe(
      "Omit to use the selected, active, or most recent campaign.",
    ).optional(),
    include: z
      .array(z.union([z.literal("legacy")]))
      .max(1)
      .optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CampaignInspectInputSchema = OptionalCampaignInputSchema;
export const CampaignCopyInspectInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
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
    cursor: z.string().min(1).max(6000).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
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
        z.literal("meeting_proposed_time"),
        z.literal("asks_pricing"),
        z.literal("not_now"),
        z.literal("wrong_person"),
        z.literal("not_interested"),
        z.literal("opt_out"),
        z.literal("acknowledgement"),
        z.literal("unclear"),
      ])
      .describe(
        "Exact stored intent; unlike the app label filter, opt_out does not include not_interested or not_now.",
      )
      .optional(),
    channel: InboxChannelSchema.optional(),
    mailboxId: ResourceIdSchema.optional(),
    campaignId: ResourceIdSchema.optional(),
    query: z.string().min(1).max(120).optional(),
    updatedAfter: ResourceVersionSchema.optional(),
    includeAutomaticResponses: z.boolean().optional(),
    cursor: z.string().min(1).max(2000).optional(),
    limit: z.number().int().min(1).max(60).optional(),
    meetingStatus: z
      .union([z.literal("none"), z.literal("booked"), z.literal("held"), z.literal("no_show")])
      .optional(),
    followupDue: z.boolean().optional(),
    include: z
      .array(z.union([z.literal("legacy")]))
      .max(1)
      .optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const ConversationInspectInputSchema = z
  .object({
    conversationId: ResourceIdSchema,
    cursor: z.string().min(1).max(2000).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const ConversationUpdateInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
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
        z.literal("meeting_proposed_time"),
        z.literal("asks_pricing"),
        z.literal("not_now"),
        z.literal("wrong_person"),
        z.literal("not_interested"),
        z.literal("opt_out"),
        z.literal("acknowledgement"),
        z.literal("unclear"),
      ])
      .optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const ReplyTemplateVariablesSchema = z
  .object({
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
    idempotencyKey: z.string().min(8).max(160).regex(new RegExp("^[a-zA-Z0-9_-]+$")),
    templateId: ResourceIdSchema.optional(),
    variables: ReplyTemplateVariablesSchema.optional(),
    ownerApproved: z
      .boolean()
      .describe(
        "For 2.1 clients only: the owner explicitly approved this exact free text and conversation. Otherwise save a draft.",
      )
      .optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const ConversationReplyInspectInputSchema = z
  .object({
    idempotencyKey: z.string().min(8).max(160).regex(new RegExp("^[a-zA-Z0-9_-]+$")),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CampaignMessagesDraftListInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    afterId: ResourceIdSchema.optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const IdempotencyKeySchema = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(new RegExp("^[A-Za-z0-9._:-]{1,160}$"));
export const CampaignMessagesDraftUpdateInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    expectedCampaignUpdatedAt: ResourceVersionSchema,
    expectedListUpdatedAt: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    edits: z
      .array(
        z
          .object({
            targetHandle: z.string().min(1).max(180),
            channel: z.union([z.literal("instagram"), z.literal("facebook")]),
            message: z.union([z.string().min(1).max(1000).regex(new RegExp("\\S")), z.null()]),
          })
          .strict(),
      )
      .min(1)
      .max(100),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CampaignMessagesListInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    expectedRunId: ResourceIdSchema.optional(),
    channels: z
      .array(z.union([z.literal("instagram"), z.literal("facebook"), z.literal("linkedin")]))
      .min(1)
      .max(3)
      .optional(),
    jobIds: z.array(ResourceIdSchema).min(1).max(100).optional(),
    afterJobId: ResourceIdSchema.optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CampaignMessagesUpdateInputSchema = z
  .object({
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
            channel: z.union([
              z.literal("instagram"),
              z.literal("facebook"),
              z.literal("linkedin"),
            ]),
            expectedJobUpdatedAt: ResourceVersionSchema,
            message: z
              .union([
                z
                  .string()
                  .min(1)
                  .max(2000)
                  .regex(new RegExp("\\S"))
                  .describe(
                    "Exact recipient copy, preserving whitespace and Unicode. Null removes the override and restores current campaign or sequence copy.",
                  ),
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
    campaignId: ResourceIdSchema,
    view: z.union([z.literal("upcoming"), z.literal("done")]).optional(),
    cursor: z.string().min(1).max(512).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CampaignFollowupsCancelInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    expectedCampaignUpdatedAt: ResourceVersionSchema,
    jobIds: z.array(ResourceIdSchema).min(1).max(50),
    idempotencyKey: z.string().min(8).max(160).regex(new RegExp("^[a-zA-Z0-9._:-]+$")),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CampaignOutcomesListInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    cursor: z.string().min(1).max(512).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const DeliveryTestPrepareInputSchema = z
  .object({
    channel: z.union([z.literal("email"), z.literal("sms")]),
    to: z.string().trim().min(3).max(254),
    mailboxId: ResourceIdSchema.optional(),
    recipientConsentConfirmed: z.literal(true),
    idempotencyKey: z.string().max(160).regex(new RegExp("^[A-Za-z0-9._:-]{1,160}$")),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const DeliveryTestSendInputSchema = z
  .object({
    testId: z.string().regex(new RegExp("^delivery_test_[a-f0-9]{64}$")),
    reviewDigest: z.string().regex(new RegExp("^[a-f0-9]{64}$")),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const DeliveryTestInspectInputSchema = z
  .object({
    testId: z.string().regex(new RegExp("^delivery_test_[a-f0-9]{64}$")),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const HistoryListInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    cursor: z.string().min(1).max(512).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    search: z.string().min(3).max(120).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
    campaignId: ResourceIdSchema.optional(),
    stage: PipelineStageSchema.optional(),
    limit: z.number().int().min(1).max(100).optional(),
    cursor: z.string().min(1).max(4000).optional(),
    query: z.string().min(1).max(120).optional(),
    entityKey: z.string().min(1).max(320).optional(),
    stages: z
      .array(
        z.union([
          z.literal("contacted"),
          z.literal("replied"),
          z.literal("call_booked"),
          z.literal("meeting_held"),
          z.literal("no_show"),
          z.literal("closed"),
          z.literal("won"),
          z.literal("lost"),
        ]),
      )
      .min(1)
      .max(8)
      .optional(),
    include: z
      .array(z.union([z.literal("legacy")]))
      .max(1)
      .optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
    closedOutcome: z.union([z.literal("won"), z.literal("lost")]).optional(),
    lostReason: z.string().max(2000).optional(),
    expectedUpdatedAt: ResourceVersionSchema.optional(),
    idempotencyKey: IdempotencyKeySchema.optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const PipelineNoteListInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    entityKey: z.string().min(1).max(320),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const PipelineNoteAddInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    entityKey: z.string().min(1).max(320),
    body: z.string().min(1).max(2000),
    idempotencyKey: z.string().min(8).max(160).regex(new RegExp("^[a-zA-Z0-9._:-]+$")),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CompanyTimelineInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    companyOutreachId: ResourceIdSchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
export const CampaignValidateInputSchema = z
  .object({
    state: AgentCampaignStateSchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const AudiencePreviewInputSchema = z
  .object({
    state: AgentCampaignStateSchema,
    sampleSize: z.number().int().min(1).max(25).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const ListsListInputSchema = z
  .object({
    query: z.string().min(1).max(120).optional(),
    limit: z.number().int().min(1).max(25).optional(),
    offset: z.number().int().min(0).max(1000000).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const ListInspectInputSchema = z
  .object({
    listId: ResourceIdSchema,
    username: z.string().min(1).max(64).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    offset: z.number().int().min(0).max(1000000).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const ListTargetRemoveInputSchema = z
  .object({
    listId: ResourceIdSchema,
    username: z.string().min(1).max(64),
    expectedListUpdatedAt: ResourceVersionSchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CampaignDraftPrepareInputSchema = z
  .object({
    channel: z
      .union([
        z.literal("instagram"),
        z.literal("facebook"),
        z.literal("linkedin"),
        z.literal("gmail"),
        z.literal("sms"),
      ])
      .describe(
        "Single-channel shorthand. Supply this or channels for company lists; defaults to Instagram for username lists.",
      )
      .optional(),
    channels: z
      .array(
        z.union([
          z.literal("instagram"),
          z.literal("facebook"),
          z.literal("linkedin"),
          z.literal("gmail"),
          z.literal("sms"),
        ]),
      )
      .min(1)
      .max(5)
      .describe("Channels on one campaign. Mutually exclusive with channel.")
      .optional(),
    gmailSubject: z
      .string()
      .min(1)
      .max(500)
      .describe(
        "Email subject shared by all messageVariants, which become the email body variants.",
      )
      .optional(),
    gmailRecipientConsentConfirmed: z
      .literal(true)
      .describe("Explicit user confirmation of recipient permission, required for email.")
      .optional(),
    mailboxIds: z.array(ResourceIdSchema).min(1).max(8).optional(),
    smsBody: z
      .string()
      .min(1)
      .max(1600)
      .describe("Separate SMS message, required when SMS is selected.")
      .optional(),
    linkedinInviteNote: z
      .string()
      .max(300)
      .describe(
        "Separate LinkedIn invitation note, required when LinkedIn is combined with another channel.",
      )
      .optional(),
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
      .describe("Exact sum of selected channelCounts, not the number of distinct companies."),
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CampaignPrepareInputSchema = ListPrepareInputSchema;
export const CampaignActionPreflightInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CampaignActionInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    idempotencyKey: IdempotencyKeySchema,
    authorizationId: z.string().regex(new RegExp("^agent_action_[a-f0-9]{32}$")),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CompanyFiltersInputSchema = z
  .object({
    countries: z.array(SupportedCountrySchema).min(1).max(32),
    states: z.array(z.string().max(80)).max(32).optional(),
    citySearch: z.string().max(120).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CompanySuggestionsInputSchema = z
  .object({
    query: z.string().min(2).max(120),
    countries: z.array(SupportedCountrySchema).min(1).max(32),
    limit: z.number().int().min(1).max(10).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
    websiteFacts: z
      .array(z.union([z.literal("b2c"), z.literal("b2b"), z.literal("saas")]))
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
    hiringTitleQuery: z
      .string()
      .max(120)
      .describe(
        "Literal case-insensitive title substring on the same verified open employer posting. Implies hasActiveHiring. Finland only.",
      )
      .optional(),
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
    "Every filter supported by the Companies app. Numeric bounds use decimal strings, dates YYYY-MM-DD; empty values disable filters. Call companies.filters for country-specific options. Saved website classifications are positive-only with non-exhaustive coverage and currently Finnish; absent classifications do not imply a negative. Unsupported or discarded criteria are rejected.",
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
    expectedRevision: z
      .string()
      .max(1024)
      .describe(
        "Echo the complete opaque revision returned by the first search page, including any website-classification identity. Never truncate it.",
      )
      .optional(),
    querySignature: z.string().max(200).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const WorkspaceCompanyKnowledgeInputSchema = z
  .object({
    query: z.string().max(200).optional(),
    facets: z
      .array(
        z.union([
          z.literal("offers_software"),
          z.literal("offers_saas_b2b"),
          z.literal("offers_it_services"),
          z.literal("offers_marketing"),
          z.literal("offers_consulting"),
          z.literal("offers_accounting"),
          z.literal("offers_legal"),
          z.literal("offers_recruitment"),
          z.literal("offers_training"),
          z.literal("offers_engineering"),
          z.literal("offers_industrial_services"),
          z.literal("offers_construction"),
          z.literal("offers_property_services"),
          z.literal("offers_logistics"),
          z.literal("offers_manufactured_goods"),
          z.literal("offers_wholesale"),
          z.literal("offers_machinery"),
          z.literal("offers_food"),
          z.literal("offers_healthcare"),
          z.literal("offers_finance"),
          z.literal("offers_energy"),
          z.literal("offers_hospitality"),
          z.literal("role_manufacturer"),
          z.literal("role_reseller"),
          z.literal("role_service_provider"),
          z.literal("buyer_business"),
          z.literal("buyer_consumer"),
          z.literal("buyer_public_sector"),
          z.literal("buyer_manufacturing"),
          z.literal("buyer_construction"),
          z.literal("buyer_property"),
          z.literal("buyer_retail"),
          z.literal("buyer_healthcare"),
          z.literal("buyer_hospitality"),
          z.literal("buyer_logistics"),
          z.literal("buyer_technology"),
          z.literal("buyer_finance"),
          z.literal("buyer_energy"),
          z.literal("buyer_education"),
          z.literal("buyer_agriculture"),
        ]),
      )
      .max(40)
      .optional(),
    page: z.number().int().min(1).max(10000).optional(),
    pageSize: z.number().int().min(1).max(100).optional(),
    expectedRevision: z.string().min(64).max(64).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CompanyKnowledgeInputSchema = z
  .object({
    country: z.union([z.literal("FI")]),
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
    expectedKnowledgeRevision: z
      .string()
      .regex(new RegExp("^[a-f0-9]{64}$"))
      .describe("Pin subsequent source pages to the knowledgeRevision returned by the first read.")
      .optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
    factExpansion: z
      .union([z.literal("requested_only"), z.literal("general")])
      .describe(
        "Binary mode only. New runs default to requested_only and ask only uncached requested criteria; general explicitly adds reusable standard offering/buyer questions to the same call on complete sources. Existing omitted-policy keys recover their original general run. Cached requested answers never trigger extra inference. Country and other deterministic filters are checked in code.",
      )
      .optional(),
    filters: CompanySearchFiltersSchema.optional(),
    maxAgeDays: z.number().int().min(1).max(90).optional(),
    idempotencyKey: z.string().min(1).max(100),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
        "Set false for progress-only polling without fetching company rows or quotations. Omitted or true preserves the first result page. Use companies.evidence.results to inspect matches.",
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
    view: z.union([z.literal("matches"), z.literal("unresolved"), z.literal("all")]).optional(),
  })
  .strict();
export const CompanyEvidenceCancelInputSchema = z
  .object({ runId: z.string().min(36).max(36), expectedRevision: z.string().min(64).max(64) })
  .strict();
export const CompanyInspectInputSchema = z
  .object({
    country: SupportedCountrySchema,
    businessId: z.string().min(1).max(192),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CompanyListInspectInputSchema = z
  .object({
    listId: ResourceIdSchema,
    offset: z.number().int().min(0).max(1000000).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    expectedUpdatedAt: z.string().max(160).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CampaignOperationInspectInputSchema = z
  .object({
    campaignId: z.string().min(1).max(160),
    commandId: z.string().min(1).max(160).regex(new RegExp("^[A-Za-z0-9._:-]+$")),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const InstagramPacingInspectInputSchema = z
  .object({
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
    groupBy: z
      .union([z.literal("rendered_text"), z.literal("template_variation")])
      .describe(
        "Defaults to rendered_text. template_variation requires campaignId and returns variationPerformance with immutable templates and seven-day mature cohorts.",
      )
      .optional(),
    channel: z
      .union([
        z.literal("instagram"),
        z.literal("facebook"),
        z.literal("linkedin"),
        z.literal("gmail"),
        z.literal("sms"),
      ])
      .describe("Optional channel filter for template_variation only.")
      .optional(),
    campaignId: ResourceIdSchema.optional(),
    from: z.string().min(20).max(40),
    to: z.string().min(20).max(40),
    limit: z.number().int().min(1).max(25).optional(),
    offset: z.number().int().min(0).max(1000000).optional(),
    include: z
      .array(z.union([z.literal("legacy")]))
      .max(1)
      .optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CalendarStatusInputSchema = z
  .object({
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
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
    calendarId: z
      .string()
      .min(1)
      .max(500)
      .describe(
        "Calendar owned by the connected Google account. Defaults to primary; calendar_status reports discoverable calendars.",
      )
      .optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CalendarMeetingBookInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
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
      .max(20)
      .optional(),
    conference: z
      .union([
        z.literal("google_meet"),
        z.literal("teams"),
        z.literal("phone"),
        z.literal("in_person"),
        z.literal("custom_url"),
      ])
      .optional(),
    customUrl: z.string().max(2000).regex(new RegExp("^https://")).optional(),
    attendeePhone: z.string().max(40).optional(),
    calendarId: z
      .string()
      .min(1)
      .max(500)
      .describe(
        "Calendar owned by the connected Google account. Defaults to primary; calendar_status reports discoverable calendars.",
      )
      .optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CallsListInputSchema = z
  .object({
    offset: z.number().int().min(0).max(1000000).optional(),
    limit: z.number().int().min(1).max(50).optional(),
    cursor: z.string().max(2000).optional(),
    lifecycle: z
      .union([
        z.literal("scheduled"),
        z.literal("awaiting_outcome"),
        z.literal("completed"),
        z.literal("no_show"),
        z.literal("cancelled"),
        z.literal("rescheduled"),
      ])
      .optional(),
    awaitingOutcome: z.boolean().optional(),
    from: ResourceVersionSchema.optional(),
    to: ResourceVersionSchema.optional(),
    hasTranscript: z.boolean().optional(),
    outcomeProposed: z.boolean().optional(),
    linkState: z.union([z.literal("linked"), z.literal("unlinked")]).optional(),
    source: z.string().min(1).max(200).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CallInspectInputSchema = z
  .object({
    meetingId: ResourceIdSchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
    include: z
      .array(z.union([z.literal("speakers")]))
      .max(1)
      .optional(),
  })
  .strict();
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const InstagramExtractionInspectInputSchema = z
  .object({
    jobId: ResourceIdSchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const InstagramExtractionResultsInputSchema = z
  .object({
    jobId: ResourceIdSchema,
    cursor: z.string().min(1).max(30).regex(new RegExp("^[A-Za-z0-9._]+$")).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const InstagramPurchasesListInputSchema = z
  .object({
    cursor: ResourceIdSchema.optional(),
    limit: z.number().int().min(1).max(20).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const InstagramPurchasesInspectInputSchema = z
  .object({
    orderId: ResourceIdSchema,
    cursor: ResourceIdSchema.optional(),
    limit: z.number().int().min(1).max(20).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const InstagramPurchasesResultsInputSchema = z
  .object({
    orderId: ResourceIdSchema,
    jobId: ResourceIdSchema,
    cursor: z.string().min(1).max(30).regex(new RegExp("^[A-Za-z0-9._]+$")).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const LeadsStatusInputSchema = z
  .object({
    cursor: z.string().trim().min(1).max(1000).optional(),
    limit: z.number().int().min(1).max(50).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const LeadExtractionStartInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const LeadExtractionInspectInputSchema = z
  .object({
    jobId: ResourceIdSchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const LeadExtractionRefreshInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    jobId: ResourceIdSchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const LeadExtractionContinueInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    jobId: ResourceIdSchema,
    count: z.number().int().min(1).max(2147483647).optional(),
    idempotencyKey: z.string().trim().min(1).max(160).regex(new RegExp("^[A-Za-z0-9._:-]{1,160}$")),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const LeadEnrichmentPreviewInputSchema = z
  .object({
    listId: ResourceIdSchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const LeadEnrichmentStartInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    listId: ResourceIdSchema,
    maxCredits: z.number().int().min(0).max(2147483647).optional(),
    idempotencyKey: z.string().trim().min(1).max(160).regex(new RegExp("^[A-Za-z0-9._:-]{1,160}$")),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const LeadEnrichmentInspectInputSchema = z
  .object({
    jobId: ResourceIdSchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const InstagramProspectStartInputSchema = z.intersection(
  InstagramProspectInputSchema,
  z
    .object({
      idempotencyKey: z.string().min(1).max(120),
      runId: z
        .string()
        .min(1)
        .max(100)
        .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
        .optional(),
    })
    .strict(),
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
export const AgentSalesEventTypeSchema = z.union([
  z.literal("call.stats.ready"),
  z.literal("call.stats.updated"),
  z.literal("call.coaching.flagged"),
  z.literal("call.attendance.detected"),
  z.literal("call.insight.failed"),
  z.literal("call.bot.scheduled"),
  z.literal("call.bot.cancelled"),
  z.literal("call.bot.joined"),
  z.literal("call.bot.failed"),
  z.literal("call.recording.ready"),
  z.literal("call.recording.stopped"),
  z.literal("call.transcript.ready"),
  z.literal("call.analysis.ready"),
  z.literal("call.deleted"),
  z.literal("recorder.cap.reached"),
  z.literal("recorder.health.degraded"),
  z.literal("inbox.message.received"),
  z.literal("inbox.auto_reply.received"),
  z.literal("conversation.intent.changed"),
  z.literal("conversation.changed"),
  z.literal("conversation.followup.due"),
  z.literal("followup.cancelled_by_reply"),
  z.literal("meeting.booked"),
  z.literal("meeting.rescheduled"),
  z.literal("meeting.cancelled"),
  z.literal("meeting.no_show"),
  z.literal("meeting.outcome.recorded"),
  z.literal("contact.opted_out"),
  z.literal("campaign.state.changed"),
  z.literal("sender.unhealthy"),
  z.literal("reply.approval.requested"),
  z.literal("reply.approval.decided"),
  z.literal("credential.expiring"),
  z.literal("webhook.test"),
  z.literal("sender.recovered"),
  z.literal("calendar.connected"),
  z.literal("calendar.disconnected"),
  z.literal("agent.paused"),
  z.literal("agent.resumed"),
  z.literal("credential.rotated"),
  z.literal("message.sent"),
  z.literal("message.delivery.failed"),
  z.literal("message.bounced"),
  z.literal("reaction.received"),
  z.literal("system_event.received"),
  z.literal("conversation.assigned"),
  z.literal("conversation.takeover.started"),
  z.literal("conversation.takeover.ended"),
  z.literal("work_item.created"),
  z.literal("work_item.updated"),
  z.literal("work_queue.rebuilt"),
  z.literal("meeting.reminder.due"),
  z.literal("meeting.ended"),
  z.literal("booking_link.opened"),
  z.literal("booking_link.used"),
  z.literal("booking_link.expired"),
  z.literal("suppression.added"),
  z.literal("suppression.removed"),
  z.literal("agent.lagging"),
  z.literal("agent.stale"),
  z.literal("budget.threshold_reached"),
  z.literal("kill_switch.changed"),
  z.literal("webhook.delivery.failed"),
  z.literal("metrics.recomputed"),
]);
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
      .array(z.union([z.literal("message"), z.literal("conversation"), z.literal("campaign")]))
      .max(3)
      .optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const ConversationsChangesInputSchema = z
  .object({
    cursor: z.string().min(1).max(1000).optional(),
    types: z
      .array(
        z.union([
          z.literal("message"),
          z.literal("intent"),
          z.literal("status"),
          z.literal("meeting"),
        ]),
      )
      .min(1)
      .max(4)
      .optional(),
    limit: z.number().int().min(1).max(100).optional(),
    after: z.string().max(1000).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const SuppressionsListInputSchema = z
  .object({
    query: z.string().min(1).max(120).optional(),
    cursor: z.string().min(1).max(1000).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const SuppressionEntryInputSchema = z
  .object({
    type: z.union([
      z.literal("company"),
      z.literal("phone"),
      z.literal("email"),
      z.literal("instagram"),
      z.literal("facebook"),
      z.literal("linkedin"),
      z.literal("domain"),
    ]),
    value: z.string().min(1).max(500),
    reason: z.string().min(1).max(500),
    source: z.union([z.literal("prospect_request"), z.literal("owner"), z.literal("agent")]),
  })
  .strict();
export const SuppressionsAddInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    entries: z.array(SuppressionEntryInputSchema).min(1).max(100),
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const SuppressionsRemoveInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    id: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    reason: z.string().min(1).max(500),
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const WorkspaceSandboxCreateInputSchema = z
  .object({
    name: z.string().min(1).max(100),
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const SandboxSeedInputSchema = z
  .object({
    preset: z.literal("appointment_setter_v1"),
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const SandboxInboundSimulateInputSchema = z
  .object({
    conversationId: z.string().min(1).max(160).optional(),
    campaignId: z.string().min(1).max(160).optional(),
    channel: z.union([
      z.literal("instagram"),
      z.literal("facebook"),
      z.literal("linkedin"),
      z.literal("gmail"),
      z.literal("sms"),
    ]),
    text: z.string().min(1).max(16000),
    kind: z.union([z.literal("human"), z.literal("auto_reply"), z.literal("reaction")]),
    at: ResourceVersionSchema.optional(),
    expectedUpdatedAt: ResourceVersionSchema.optional(),
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const SandboxClockAdvanceInputSchema = z
  .object({
    minutes: z.number().int().min(1).max(525600),
    expectedUpdatedAt: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CallOutcomeSetInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    meetingId: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    attendance: z.union([
      z.literal("held"),
      z.literal("no_show"),
      z.literal("rescheduled"),
      z.literal("cancelled"),
    ]),
    result: z
      .union([
        z.literal("trial_started"),
        z.literal("won"),
        z.literal("lost"),
        z.literal("follow_up"),
        z.literal("not_a_fit"),
      ])
      .optional(),
    lostReason: z.string().max(2000).optional(),
    valueEur: z.number().min(0).max(999999999999.99).optional(),
    note: z.string().max(5000).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const MeetingUnlinkInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    meetingId: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const WebhookHeadersSchema = z
  .record(
    z
      .string()
      .max(66)
      .regex(
        new RegExp(
          "^(?:[Aa][Uu][Tt][Hh][Oo][Rr][Ii][Zz][Aa][Tt][Ii][Oo][Nn]|[Xx]-[A-Za-z0-9-]{1,64})$",
        ),
      ),
    z.string().max(2048).regex(new RegExp("^[^\\r\\n\\u0000]*$")),
  )
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
      .array(
        z.union([
          z.literal("agent"),
          z.literal("human"),
          z.literal("system"),
          z.literal("automation"),
        ]),
      )
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
    ordering: z.union([z.literal("strict"), z.literal("per_key")]).optional(),
    payload: z.union([z.literal("thin"), z.literal("standard"), z.literal("full")]).optional(),
    dryRun: z.boolean().optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const WebhooksListInputSchema = z
  .object({
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
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
    ordering: z.union([z.literal("strict"), z.literal("per_key")]).optional(),
    payload: z.union([z.literal("thin"), z.literal("standard"), z.literal("full")]).optional(),
    dryRun: z.boolean().optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const WebhooksDeleteInputSchema = z
  .object({
    id: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    dryRun: z.boolean().optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const WebhooksTestInputSchema = z
  .object({
    id: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    dryRun: z.boolean().optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const PipelineReconcileInputSchema = z
  .object({
    campaignId: ResourceIdSchema.optional(),
    dryRun: z.boolean().optional(),
    idempotencyKey: IdempotencyKeySchema.optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const WorkspaceAgentSalesGetInputSchema = z
  .object({
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const WorkspaceAgentSalesUpdateInputSchema = z
  .object({
    enabled: z.boolean(),
    autoClose: z.boolean(),
    autoSuppress: z.boolean(),
    suppressCompany: z.boolean(),
    expectedUpdatedAt: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const SandboxProviderUpdateInputSchema = z
  .object({
    provider: z.union([
      z.literal("calendar"),
      z.literal("gmail"),
      z.literal("sms"),
      z.literal("browser"),
    ]),
    connected: z.boolean(),
    expectedUpdatedAt: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const ReplyTemplatesListInputSchema = z
  .object({
    cursor: z.string().min(1).max(1000).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const ReplyTemplateSchema = z
  .object({
    name: z.string().min(1).max(120),
    language: z.union([z.literal("fi"), z.literal("en")]),
    channels: z
      .array(
        z.union([
          z.literal("instagram"),
          z.literal("facebook"),
          z.literal("linkedin"),
          z.literal("gmail"),
          z.literal("sms"),
        ]),
      )
      .max(5),
    intents: z.array(z.string().min(1).max(80)).max(30),
    body: z.string().min(1).max(10000),
    maxLength: z.number().int().min(1).max(10000),
  })
  .strict();
export const ReplyTemplatesCreateInputSchema = z
  .object({
    template: ReplyTemplateSchema,
    expectedRevision: z.literal(0),
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const ReplyTemplatesUpdateInputSchema = z
  .object({
    id: ResourceIdSchema,
    template: ReplyTemplateSchema,
    expectedRevision: z.number().int().min(0),
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const ReplyTemplatesDeleteInputSchema = z
  .object({
    id: ResourceIdSchema,
    expectedRevision: z.number().int().min(0),
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const ReplyPolicyGetInputSchema = z
  .object({
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const ReplyPolicySchema = z
  .object({
    enabled: z.boolean(),
    allowedIntents: z.array(z.string().min(1).max(80)).max(30),
    allowedChannels: z
      .array(
        z.union([
          z.literal("instagram"),
          z.literal("facebook"),
          z.literal("linkedin"),
          z.literal("gmail"),
          z.literal("sms"),
        ]),
      )
      .max(5),
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
    policy: ReplyPolicySchema,
    expectedRevision: z.number().int().min(0),
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const ReplyApprovalsListInputSchema = z
  .object({
    cursor: z.string().min(1).max(1000).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    status: z
      .union([z.literal("pending"), z.literal("approved"), z.literal("rejected")])
      .optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const ConversationDraftSaveInputSchema = z
  .object({
    conversationId: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    text: z.string().min(1).max(10000).optional(),
    templateId: ResourceIdSchema.optional(),
    variables: ReplyTemplateVariablesSchema.optional(),
    rationale: z.string().min(1).max(2000).optional(),
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
    type: z.union([
      z.literal("reply"),
      z.literal("nudge"),
      z.literal("send_info"),
      z.literal("rebook"),
      z.literal("call"),
    ]),
    note: z.string().min(1).max(2000).optional(),
    owner: ResourceIdSchema.optional(),
    autoSend: FollowupAutoSendSchema.optional(),
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const ConversationFollowupClearInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    conversationId: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const FollowupsDueInputSchema = z
  .object({
    cursor: z.string().min(1).max(1000).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    before: ResourceVersionSchema.optional(),
    owner: ResourceIdSchema.optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const ConversationsBulkUpdateInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    items: z.array(ConversationUpdateInputSchema).min(1).max(50),
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const PipelineBoardInputSchema = z
  .object({
    campaignIds: z.array(ResourceIdSchema).max(100).optional(),
    limitPerStage: z.number().int().min(1).max(20).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CalendarBookingLinkCreateInputSchema = z
  .object({
    conversationId: ResourceIdSchema,
    expectedConversationUpdatedAt: ResourceVersionSchema,
    durations: z.array(z.number().int().min(15).max(120)).min(1).max(4),
    window: z.object({ from: ResourceVersionSchema, to: ResourceVersionSchema }).strict(),
    timezone: z.string().min(1).max(80),
    conference: z.union([
      z.literal("google_meet"),
      z.literal("teams"),
      z.literal("phone"),
      z.literal("in_person"),
      z.literal("custom_url"),
    ]),
    customUrl: z.string().max(2000).regex(new RegExp("^https://")).optional(),
    maxUses: z.literal(1),
    expiresAt: ResourceVersionSchema,
    language: z.union([z.literal("fi"), z.literal("en")]),
    idempotencyKey: IdempotencyKeySchema,
    calendarId: z
      .string()
      .min(1)
      .max(500)
      .describe(
        "Calendar owned by the connected Google account. Defaults to primary; calendar_status reports discoverable calendars.",
      )
      .optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CalendarMeetingRescheduleInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    meetingId: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    start: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
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
                channel: z.union([
                  z.literal("inherit"),
                  z.literal("instagram"),
                  z.literal("facebook"),
                  z.literal("linkedin"),
                  z.literal("gmail"),
                  z.literal("sms"),
                ]),
                fallbackChannel: z.union([
                  z.literal("none"),
                  z.literal("instagram"),
                  z.literal("facebook"),
                  z.literal("linkedin"),
                  z.literal("gmail"),
                  z.literal("sms"),
                ]),
                subject: z.string().max(500).optional(),
                variants: z.array(z.string().min(1).max(10000)).min(1).max(4),
                smsBody: z.string().min(1).max(1600).optional(),
              })
              .strict(),
          )
          .max(3),
      })
      .strict(),
    applyTo: z.union([z.literal("future_only"), z.literal("contacted_no_reply")]),
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CampaignVariantsConfigureInputSchema = z
  .object({
    dryRun: z.boolean().optional(),
    campaignId: ResourceIdSchema,
    expectedCampaignUpdatedAt: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    channel: z.union([z.literal("social"), z.literal("gmail"), z.literal("sms")]),
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
        metric: z.union([
          z.literal("reply_rate"),
          z.literal("positive_reply_rate"),
          z.literal("booking_rate"),
        ]),
        rule: z.union([z.literal("bayesian_95"), z.literal("manual")]),
      })
      .strict(),
    prospectTimezone: z.string().min(1).max(100).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const RecorderSettingsGetInputSchema = z
  .object({
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const RecorderSettingsSchema = z
  .object({
    mode: z.union([
      z.literal("all"),
      z.literal("hosted_by_me"),
      z.literal("external_attendees"),
      z.literal("dmfaster_booked_only"),
      z.literal("off"),
    ]),
    consent: z.boolean(),
    consentNoticeVersion: z.string().min(1).max(100),
    consentNotice: z.string().min(1).max(2000),
    excludeTitleKeywords: z.array(z.string().max(200)).max(100),
    excludeDomains: z.array(z.string().max(200)).max(100),
    excludeEmails: z.array(z.string().max(254)).max(100),
    minDurationMinutes: z.number().int().min(1).max(240),
    maxDurationMinutes: z.number().int().min(1).max(240),
    botName: z.string().min(1).max(60),
    language: z.union([z.literal("auto"), z.literal("fi"), z.literal("en")]),
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const RecorderBotsListInputSchema = z
  .object({
    from: ResourceVersionSchema.optional(),
    to: ResourceVersionSchema.optional(),
    status: z
      .union([
        z.literal("scheduled"),
        z.literal("joining"),
        z.literal("in_call"),
        z.literal("done"),
        z.literal("failed"),
        z.literal("cancelled"),
      ])
      .optional(),
    cursor: z.string().max(2000).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CallTranscriptGetInputSchema = z
  .object({
    meetingId: ResourceIdSchema,
    cursor: z.string().max(2000).optional(),
    fromMs: z.number().int().min(0).optional(),
    toMs: z.number().int().min(0).optional(),
    speaker: z.string().max(200).optional(),
    format: z
      .union([z.literal("compact"), z.literal("segments")])
      .describe(
        "Complete timestamped text by default (up to 512 KiB); segments selects paged structured output. Compact text preserves every word.",
      )
      .optional(),
    mode: z.union([z.literal("full"), z.literal("compact")]).optional(),
    limit: z.number().int().min(1).max(200).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CallRecordingGetInputSchema = z
  .object({
    meetingId: ResourceIdSchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CallTranscriptsGetInputSchema = z
  .object({
    meetingIds: z.array(ResourceIdSchema).min(1).max(10),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const ReadinessCheckInputSchema = z
  .object({
    for: z.union([
      z.literal("reply"),
      z.literal("book"),
      z.literal("followups"),
      z.literal("send:sms"),
      z.literal("send:gmail"),
      z.literal("send:instagram"),
      z.literal("send:facebook"),
      z.literal("send:linkedin"),
    ]),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const SenderRetireInputSchema = z
  .object({
    workerId: ResourceIdSchema,
    reason: z.string().min(1).max(1000),
    expectedUpdatedAt: ResourceVersionSchema,
    dryRun: z.boolean().optional(),
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const SenderUnretireInputSchema = z
  .object({
    workerId: ResourceIdSchema,
    reason: z.string().min(1).max(1000),
    expectedUpdatedAt: ResourceVersionSchema,
    dryRun: z.boolean().optional(),
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const AttributionCheckInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const CampaignReengagementPrepareInputSchema = z
  .object({
    campaignId: ResourceIdSchema,
    expectedCampaignUpdatedAt: ResourceVersionSchema,
    name: z.string().min(1).max(120),
    channel: z.union([
      z.literal("instagram"),
      z.literal("facebook"),
      z.literal("linkedin"),
      z.literal("gmail"),
      z.literal("sms"),
    ]),
    maxAgeDays: z.number().int().min(1).max(3650).optional(),
    expectedAudienceFingerprint: z.string().max(64).optional(),
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const AgentsListInputSchema = z
  .object({
    limit: z.number().int().min(1).max(100).optional(),
    afterId: ResourceIdSchema.optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const AgentInspectInputSchema = z
  .object({
    agentId: ResourceIdSchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const AgentCreateRequestInputSchema = z
  .object({
    name: z.string().min(1).max(100),
    kind: z.union([
      z.literal("setter"),
      z.literal("prospector"),
      z.literal("analyst"),
      z.literal("custom"),
    ]),
    runtime: z.string().max(200).optional(),
    scopes: z
      .array(
        z.union([
          z.literal("workspace:read"),
          z.literal("campaigns:read"),
          z.literal("sending:read"),
          z.literal("inbox:read"),
          z.literal("inbox:write"),
          z.literal("pipeline:read"),
          z.literal("pipeline:write"),
          z.literal("audiences:read"),
          z.literal("campaigns:write"),
          z.literal("campaigns:launch"),
          z.literal("campaigns:control"),
          z.literal("calendar:read"),
          z.literal("calendar:write"),
          z.literal("calls:read"),
          z.literal("events:read"),
          z.literal("leads:read"),
          z.literal("leads:write"),
          z.literal("sending:test"),
          z.literal("suppressions:write"),
          z.literal("sandbox:write"),
          z.literal("calls:write"),
          z.literal("webhooks:write"),
          z.literal("policy:write"),
          z.literal("calls:transcripts:read"),
          z.literal("calls:media:read"),
          z.literal("calls:record"),
          z.literal("sending:write"),
          z.literal("calls:stats:read"),
        ]),
      )
      .min(1)
      .max(29),
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const AgentPauseInputSchema = z
  .object({
    agentId: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const AgentResumeInputSchema = z
  .object({
    agentId: ResourceIdSchema,
    expectedUpdatedAt: ResourceVersionSchema,
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const EventConsumersListInputSchema = z
  .object({
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const EventConsumersCreateInputSchema = z
  .object({
    name: z.string().min(1).max(100),
    startAt: z.union([z.literal("head"), z.literal("retention_floor")]).optional(),
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const EventsAckInputSchema = z
  .object({
    consumerId: ResourceIdSchema,
    throughSequence: z.number().int().min(0).max(9007199254740991),
    expectedVersion: z.number().int().min(1),
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const EventsSnapshotInputSchema = z
  .object({
    after: z.string().max(1000).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const WebhookDeliveriesListInputSchema = z
  .object({
    webhookId: ResourceIdSchema,
    status: z
      .union([z.literal("pending"), z.literal("delivered"), z.literal("failed"), z.literal("dead")])
      .optional(),
    cursor: z.string().max(1000).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const ClassificationFeedbackInputSchema = z
  .object({
    messageId: ResourceIdSchema.optional(),
    conversationId: ResourceIdSchema.optional(),
    correctIntent: z.union([
      z.literal("meeting_intent"),
      z.literal("meeting_proposed_time"),
      z.literal("asks_pricing"),
      z.literal("information_requested"),
      z.literal("not_now"),
      z.literal("not_interested"),
      z.literal("wrong_person"),
      z.literal("opt_out"),
      z.literal("interested"),
      z.literal("acknowledgement"),
      z.literal("unclear"),
    ]),
    correctMessageType: z
      .union([
        z.literal("text"),
        z.literal("reaction"),
        z.literal("system_event"),
        z.literal("attachment"),
        z.literal("auto_reply"),
      ])
      .optional(),
    note: z.string().min(1).max(1000),
    expectedUpdatedAt: ResourceVersionSchema,
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const ClassificationQualityInputSchema = z
  .object({
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const ClassificationBackfillPlanInputSchema = z
  .object({
    afterId: ResourceIdSchema.optional(),
    limit: z.number().int().min(1).max(500).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const WorkQueueListInputSchema = z
  .object({
    types: z.array(z.string().max(60)).max(16).optional(),
    minPriority: z.number().int().min(0).max(100).optional(),
    campaignIds: z.array(ResourceIdSchema).max(100).optional(),
    assignee: z.union([z.literal("me"), z.literal("unassigned"), z.literal("any")]).optional(),
    view: z.union([z.literal("compact"), z.literal("standard")]).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    cursor: z.string().max(1000).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const WorkItemClaimInputSchema = z
  .object({
    id: ResourceIdSchema,
    expectedVersion: z.string().min(1).max(100),
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    leaseSeconds: z.number().int().min(1).max(3600).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const WorkItemReleaseInputSchema = z
  .object({
    id: ResourceIdSchema,
    expectedVersion: z.string().min(1).max(100),
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const WorkQueueConfigGetInputSchema = z
  .object({
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const MetricsReconcileInputSchema = z
  .object({
    scope: z.union([z.literal("workspace"), z.literal("campaign"), z.literal("range")]).optional(),
    campaign: ResourceIdSchema.optional(),
    from: ResourceVersionSchema.optional(),
    to: ResourceVersionSchema.optional(),
    timezone: z.string().max(100).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const AgentHeartbeatInputSchema = z
  .object({
    responseMode: z
      .union([z.literal("compact"), z.literal("full")])
      .describe(
        "Defaults to compact. Success acknowledgement is at most 300 bytes including the MCP result. Full retains the standard diagnostic envelope. Failures retain actionable errors.",
      )
      .optional(),
    agentId: ResourceIdSchema,
    status: z.union([z.literal("idle"), z.literal("working"), z.literal("degraded")]),
    consumerLagSeq: z.number().int().min(0).max(9007199254740991).optional(),
    note: z.string().max(500).optional(),
    dryRun: z.boolean().optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const AgentRunStartInputSchema = z
  .object({
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    trigger: z.union([z.literal("schedule"), z.literal("webhook"), z.literal("manual")]),
    triggerRef: z.string().max(500).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const AgentRunEndInputSchema = z
  .object({
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    runId: ResourceIdSchema,
    summary: z.string().max(2000),
    outcome: z.union([z.literal("completed"), z.literal("failed"), z.literal("cancelled")]),
  })
  .strict();
export const AgentRunsListInputSchema = z
  .object({
    agentId: ResourceIdSchema.optional(),
    before: ResourceIdSchema.optional(),
    limit: z.number().int().min(1).max(100).optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const AgentRunInspectInputSchema = z
  .object({
    runId: ResourceIdSchema,
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
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const WorkspaceResumeInputSchema = z
  .object({
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    expectedVersion: z.number().int().min(0),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const ChannelHaltInputSchema = z
  .object({
    dryRun: z.boolean(),
    idempotencyKey: IdempotencyKeySchema,
    expectedVersion: z.number().int().min(0),
    channel: z.union([
      z.literal("instagram"),
      z.literal("facebook"),
      z.literal("linkedin"),
      z.literal("gmail"),
      z.literal("sms"),
    ]),
    halted: z.boolean(),
    reason: z.string().min(1).max(500),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const WorkspaceAutomationInspectInputSchema = z
  .object({
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const AgentFeedbackSubmitInputSchema = z
  .object({
    category: z.union([
      z.literal("bug"),
      z.literal("missing_capability"),
      z.literal("confusing_behavior"),
      z.literal("performance"),
      z.literal("improvement"),
    ]),
    summary: z
      .string()
      .trim()
      .min(1)
      .max(240)
      .regex(new RegExp(".*\\S.*"))
      .describe("One concrete problem or improvement."),
    task: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .regex(new RegExp(".*\\S.*"))
      .describe("The task being attempted, without customer data.")
      .optional(),
    observed: z
      .string()
      .trim()
      .min(1)
      .max(2000)
      .regex(new RegExp(".*\\S.*"))
      .describe("What actually happened; omit private transcripts and raw tool payloads.")
      .optional(),
    expected: z
      .string()
      .trim()
      .min(1)
      .max(2000)
      .regex(new RegExp(".*\\S.*"))
      .describe("What should happen instead.")
      .optional(),
    suggestion: z
      .string()
      .trim()
      .min(1)
      .max(2000)
      .regex(new RegExp(".*\\S.*"))
      .describe("Optional proposed improvement; distinguish speculation from observed behavior.")
      .optional(),
    toolName: z
      .string()
      .trim()
      .min(1)
      .max(120)
      .regex(new RegExp(".*\\S.*"))
      .describe(
        "Affected MCP or API tool name, if known. Unknown names are allowed for missing tools.",
      )
      .optional(),
    requestId: z
      .string()
      .trim()
      .min(1)
      .max(128)
      .regex(new RegExp(".*\\S.*"))
      .describe("Optional request reference already returned by DM Faster; do not invent one.")
      .optional(),
    impact: z.union([z.literal("blocked"), z.literal("workaround"), z.literal("minor")]).optional(),
    idempotencyKey: IdempotencyKeySchema,
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const AgentFeedbackListInputSchema = z
  .object({
    limit: z.number().int().min(1).max(25).optional(),
    before: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .regex(new RegExp(".*\\S.*"))
      .describe("Use nextCursor from the previous page, unchanged.")
      .optional(),
    runId: z
      .string()
      .min(1)
      .max(100)
      .describe("Optional run correlation. Also accepted as X-DMFaster-Run-Id.")
      .optional(),
  })
  .strict();
export const EntityResolveInputSchema = z
  .object({
    identity: z
      .object({
        type: z.union([
          z.literal("phone"),
          z.literal("email"),
          z.literal("instagram"),
          z.literal("facebook"),
          z.literal("linkedin"),
          z.literal("website_form"),
          z.literal("domain"),
          z.literal("business_id"),
          z.literal("company_outreach"),
        ]),
        value: z.string().min(1).max(500),
      })
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
      .object({
        type: z.union([
          z.literal("phone"),
          z.literal("email"),
          z.literal("instagram"),
          z.literal("facebook"),
          z.literal("linkedin"),
          z.literal("website_form"),
          z.literal("domain"),
          z.literal("business_id"),
          z.literal("company_outreach"),
        ]),
        value: z.string().min(1).max(500),
      })
      .strict(),
    name: z.string().min(1).max(200),
    identities: z
      .array(
        z
          .object({
            type: z.union([
              z.literal("phone"),
              z.literal("email"),
              z.literal("instagram"),
              z.literal("facebook"),
              z.literal("linkedin"),
              z.literal("website_form"),
              z.literal("domain"),
              z.literal("business_id"),
              z.literal("company_outreach"),
            ]),
            value: z.string().min(1).max(500),
          })
          .strict(),
      )
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
      .object({
        type: z.union([
          z.literal("phone"),
          z.literal("email"),
          z.literal("instagram"),
          z.literal("facebook"),
          z.literal("linkedin"),
          z.literal("website_form"),
          z.literal("domain"),
          z.literal("business_id"),
          z.literal("company_outreach"),
        ]),
        value: z.string().min(1).max(500),
      })
      .strict(),
    name: z.string().min(1).max(200),
    identities: z
      .array(
        z
          .object({
            type: z.union([
              z.literal("phone"),
              z.literal("email"),
              z.literal("instagram"),
              z.literal("facebook"),
              z.literal("linkedin"),
              z.literal("website_form"),
              z.literal("domain"),
              z.literal("business_id"),
              z.literal("company_outreach"),
            ]),
            value: z.string().min(1).max(500),
          })
          .strict(),
      )
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
export const CallAnalyticsQueryInputSchema = z
  .object({
    from: z.string().min(20).max(40),
    to: z.string().min(20).max(40),
    groupBy: z.union([
      z.literal("rep"),
      z.literal("agent"),
      z.literal("outcome"),
      z.literal("campaign"),
      z.literal("week"),
      z.literal("month"),
      z.literal("meetingSource"),
      z.literal("language"),
    ]),
    metrics: z
      .array(
        z.union([
          z.literal("talkRatioTeam"),
          z.literal("longestMonologueTeam"),
          z.literal("questionsByTeam"),
          z.literal("questionsByExternal"),
          z.literal("interruptionsByTeam"),
          z.literal("durationMs"),
          z.literal("silenceShare"),
          z.literal("callsRecorded"),
          z.literal("callsWithStats"),
          z.literal("heldRate"),
        ]),
      )
      .min(1)
      .max(10),
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
export const CallOutcomeConfirmInputSchema = z
  .object({
    meetingId: ResourceIdSchema,
    outcome: z.union([
      z.literal("meeting_held"),
      z.literal("no_show"),
      z.literal("won"),
      z.literal("lost"),
      z.literal("follow_up"),
      z.literal("rescheduled"),
    ]),
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
export const CallInsightReviewInputSchema = z
  .object({
    meetingId: ResourceIdSchema,
    insightId: ResourceIdSchema,
    action: z.union([z.literal("approve"), z.literal("reject")]),
    selectedSections: z
      .array(
        z.union([
          z.literal("summary"),
          z.literal("painPoints"),
          z.literal("objections"),
          z.literal("decisionProcess"),
          z.literal("commitments"),
          z.literal("nextSteps"),
          z.literal("crmNoteDraft"),
        ]),
      )
      .min(1)
      .max(7)
      .optional(),
    feedback: z.string().max(2000).optional(),
    expectedVersion: ResourceVersionSchema,
    idempotencyKey: z.string().min(1).max(120),
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
    record: z.union([z.literal("on"), z.literal("off")]),
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
    language: z.union([z.literal("auto"), z.literal("fi"), z.literal("en")]).optional(),
    idempotencyKey: IdempotencyKeySchema,
    dryRun: z.boolean().optional(),
    runId: z.string().max(100).optional(),
  })
  .strict();
export const RecorderJoinGetInputSchema = z.object({ requestId: ResourceIdSchema }).strict();
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
    scope: z.union([
      z.literal("media"),
      z.literal("transcript"),
      z.literal("analysis"),
      z.literal("all"),
    ]),
    expectedVersion: ResourceVersionSchema,
    idempotencyKey: IdempotencyKeySchema,
    dryRun: z.boolean().optional(),
    runId: z.string().max(100).optional(),
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
} as const;
