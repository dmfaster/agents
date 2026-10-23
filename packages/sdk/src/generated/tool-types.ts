// Generated from packages/public-api/openapi.yaml. Run npm run generate:agent-api.
import type { operations } from "./api.ts";
export type AgentToolInputMap = {
  "analytics.summary": operations["analyticsSummary"]["requestBody"]["content"]["application/json"];
  "workspace.briefing": operations["workspaceBriefing"]["requestBody"]["content"]["application/json"];
  "campaigns.list": operations["campaignsList"]["requestBody"]["content"]["application/json"];
  "campaign.inspect": operations["campaignInspect"]["requestBody"]["content"]["application/json"];
  "campaign.copy.inspect": operations["campaignCopyInspect"]["requestBody"]["content"]["application/json"];
  "sending.inspect": operations["sendingInspect"]["requestBody"]["content"]["application/json"];
  "replies.list": operations["repliesList"]["requestBody"]["content"]["application/json"];
  "conversations.list": operations["conversationsList"]["requestBody"]["content"]["application/json"];
  "conversation.inspect": operations["conversationInspect"]["requestBody"]["content"]["application/json"];
  "conversation.update": operations["conversationUpdate"]["requestBody"]["content"]["application/json"];
  "conversation.reply": operations["conversationReply"]["requestBody"]["content"]["application/json"];
  "conversation.reply.inspect": operations["conversationReplyInspect"]["requestBody"]["content"]["application/json"];
  "campaign.messages.draft.list": operations["campaignMessagesDraftList"]["requestBody"]["content"]["application/json"];
  "campaign.messages.draft.update": operations["campaignMessagesDraftUpdate"]["requestBody"]["content"]["application/json"];
  "campaign.messages.list": operations["campaignMessagesList"]["requestBody"]["content"]["application/json"];
  "campaign.messages.update": operations["campaignMessagesUpdate"]["requestBody"]["content"]["application/json"];
  "campaign.followups.list": operations["campaignFollowupsList"]["requestBody"]["content"]["application/json"];
  "campaign.followups.cancel": operations["campaignFollowupsCancel"]["requestBody"]["content"]["application/json"];
  "campaign.outcomes.list": operations["campaignOutcomesList"]["requestBody"]["content"]["application/json"];
  "sending.test.prepare": operations["deliveryTestPrepare"]["requestBody"]["content"]["application/json"];
  "sending.test.send": operations["deliveryTestSend"]["requestBody"]["content"]["application/json"];
  "sending.test.inspect": operations["deliveryTestInspect"]["requestBody"]["content"]["application/json"];
  "senders.inspect": operations["sendersInspect"]["requestBody"]["content"]["application/json"];
  "history.list": operations["historyList"]["requestBody"]["content"]["application/json"];
  "pipeline.inspect": operations["pipelineInspect"]["requestBody"]["content"]["application/json"];
  "pipeline.cards.list": operations["pipelineCardsList"]["requestBody"]["content"]["application/json"];
  "pipeline.stage.update": operations["pipelineStageUpdate"]["requestBody"]["content"]["application/json"];
  "pipeline.note.list": operations["pipelineNoteList"]["requestBody"]["content"]["application/json"];
  "pipeline.note.add": operations["pipelineNoteAdd"]["requestBody"]["content"]["application/json"];
  "company.timeline": operations["companyTimeline"]["requestBody"]["content"]["application/json"];
  "industry.lookup": operations["industryLookup"]["requestBody"]["content"]["application/json"];
  "campaign.validate": operations["campaignValidate"]["requestBody"]["content"]["application/json"];
  "audience.preview": operations["audiencePreview"]["requestBody"]["content"]["application/json"];
  "lists.list": operations["listsList"]["requestBody"]["content"]["application/json"];
  "list.inspect": operations["listInspect"]["requestBody"]["content"]["application/json"];
  "list.target.remove": operations["listTargetRemove"]["requestBody"]["content"]["application/json"];
  "campaign.draft.prepare": operations["campaignDraftPrepare"]["requestBody"]["content"]["application/json"];
  "campaign.draft.update": operations["campaignDraftUpdate"]["requestBody"]["content"]["application/json"];
  "list.import": operations["listImport"]["requestBody"]["content"]["application/json"];
  "list.prepare": operations["listPrepare"]["requestBody"]["content"]["application/json"];
  "campaign.prepare": operations["campaignPrepare"]["requestBody"]["content"]["application/json"];
  "campaign.launch.preflight": operations["campaignLaunchPreflight"]["requestBody"]["content"]["application/json"];
  "campaign.launch": operations["campaignLaunch"]["requestBody"]["content"]["application/json"];
  "campaign.pause.preflight": operations["campaignPausePreflight"]["requestBody"]["content"]["application/json"];
  "campaign.pause": operations["campaignPause"]["requestBody"]["content"]["application/json"];
  "companies.filters": operations["companyFilters"]["requestBody"]["content"]["application/json"];
  "companies.suggest": operations["companySuggestions"]["requestBody"]["content"]["application/json"];
  "companies.search": operations["companySearch"]["requestBody"]["content"]["application/json"];
  "companies.evidence.search": operations["companyEvidenceSearch"]["requestBody"]["content"]["application/json"];
  "companies.knowledge.search": operations["companyKnowledgeSearch"]["requestBody"]["content"]["application/json"];
  "companies.knowledge": operations["companyKnowledge"]["requestBody"]["content"]["application/json"];
  "companies.evidence.start": operations["companyEvidenceStart"]["requestBody"]["content"]["application/json"];
  "companies.evidence.advance": operations["companyEvidenceAdvance"]["requestBody"]["content"]["application/json"];
  "companies.evidence.status": operations["companyEvidenceStatus"]["requestBody"]["content"]["application/json"];
  "companies.evidence.results": operations["companyEvidenceResults"]["requestBody"]["content"]["application/json"];
  "companies.evidence.cancel": operations["companyEvidenceCancel"]["requestBody"]["content"]["application/json"];
  "company.inspect": operations["companyInspect"]["requestBody"]["content"]["application/json"];
  "companies.fit.start": operations["companyFitStart"]["requestBody"]["content"]["application/json"];
  "companies.fit.advance": operations["companyFitAdvance"]["requestBody"]["content"]["application/json"];
  "companies.fit.results": operations["companyFitResults"]["requestBody"]["content"]["application/json"];
  "companies.fit.proposal": operations["companyFitProposal"]["requestBody"]["content"]["application/json"];
  "companies.list.prepare": operations["companyListPrepare"]["requestBody"]["content"]["application/json"];
  "companies.list.inspect": operations["companyListInspect"]["requestBody"]["content"]["application/json"];
  "companies.list.refine": operations["companyListRefine"]["requestBody"]["content"]["application/json"];
  "campaign.operation.inspect": operations["campaignOperationInspect"]["requestBody"]["content"]["application/json"];
  "campaign.delivery.inspect": operations["campaignDeliveryInspect"]["requestBody"]["content"]["application/json"];
  "campaign.delivery.update": operations["campaignDeliveryUpdate"]["requestBody"]["content"]["application/json"];
  "sending.instagram.pacing.inspect": operations["instagramPacingInspect"]["requestBody"]["content"]["application/json"];
  "sending.instagram.pacing.update": operations["instagramPacingUpdate"]["requestBody"]["content"]["application/json"];
  "companies.fit.status": operations["companyFitStatus"]["requestBody"]["content"]["application/json"];
  "companies.fit.cancel": operations["companyFitCancel"]["requestBody"]["content"]["application/json"];
  "companies.fit.runs.list": operations["companyFitRunsList"]["requestBody"]["content"]["application/json"];
  "companies.fit.run": operations["companyFitRun"]["requestBody"]["content"]["application/json"];
  "companies.fit.cohort": operations["companyFitCohort"]["requestBody"]["content"]["application/json"];
  "copy.performance": operations["copyPerformance"]["requestBody"]["content"]["application/json"];
  "calendar.status": operations["calendarStatus"]["requestBody"]["content"]["application/json"];
  "calendar.availability": operations["calendarAvailability"]["requestBody"]["content"]["application/json"];
  "calendar.meeting.book": operations["calendarMeetingBook"]["requestBody"]["content"]["application/json"];
  "calls.list": operations["callsList"]["requestBody"]["content"]["application/json"];
  "call.inspect": operations["callInspect"]["requestBody"]["content"]["application/json"];
  "instagram.extract.quote": operations["instagramExtractionQuote"]["requestBody"]["content"]["application/json"];
  "instagram.extract.start": operations["instagramExtractionStart"]["requestBody"]["content"]["application/json"];
  "instagram.extract.inspect": operations["instagramExtractionInspect"]["requestBody"]["content"]["application/json"];
  "instagram.extract.results": operations["instagramExtractionResults"]["requestBody"]["content"]["application/json"];
  "instagram.purchases.list": operations["instagramPurchasesList"]["requestBody"]["content"]["application/json"];
  "instagram.purchases.inspect": operations["instagramPurchasesInspect"]["requestBody"]["content"]["application/json"];
  "instagram.purchases.results": operations["instagramPurchasesResults"]["requestBody"]["content"]["application/json"];
  "leads.status": operations["leadsStatus"]["requestBody"]["content"]["application/json"];
  "leads.extract.quote": operations["leadExtractionQuote"]["requestBody"]["content"]["application/json"];
  "leads.extract.start": operations["leadExtractionStart"]["requestBody"]["content"]["application/json"];
  "leads.extract.inspect": operations["leadExtractionInspect"]["requestBody"]["content"]["application/json"];
  "leads.extract.refresh": operations["leadExtractionRefresh"]["requestBody"]["content"]["application/json"];
  "leads.extract.continue": operations["leadExtractionContinue"]["requestBody"]["content"]["application/json"];
  "leads.enrich.preview": operations["leadEnrichmentPreview"]["requestBody"]["content"]["application/json"];
  "leads.enrich.start": operations["leadEnrichmentStart"]["requestBody"]["content"]["application/json"];
  "leads.enrich.inspect": operations["leadEnrichmentInspect"]["requestBody"]["content"]["application/json"];
  "leads.prospect.quote": operations["instagramProspectQuote"]["requestBody"]["content"]["application/json"];
  "leads.prospect.start": operations["instagramProspectStart"]["requestBody"]["content"]["application/json"];
  "leads.prospect.inspect": operations["instagramProspectInspect"]["requestBody"]["content"]["application/json"];
  "leads.prospect.results": operations["instagramProspectResults"]["requestBody"]["content"]["application/json"];
  "leads.prospect.advance": operations["instagramProspectAdvance"]["requestBody"]["content"]["application/json"];
  "leads.prospect.cancel": operations["instagramProspectCancel"]["requestBody"]["content"]["application/json"];
  "events.list": operations["eventsList"]["requestBody"]["content"]["application/json"];
  "conversations.changes": operations["conversationsChanges"]["requestBody"]["content"]["application/json"];
  "suppressions.list": operations["suppressionsList"]["requestBody"]["content"]["application/json"];
  "suppressions.add": operations["suppressionsAdd"]["requestBody"]["content"]["application/json"];
  "suppressions.remove": operations["suppressionsRemove"]["requestBody"]["content"]["application/json"];
  "workspace.sandbox.create": operations["workspaceSandboxCreate"]["requestBody"]["content"]["application/json"];
  "sandbox.seed": operations["sandboxSeed"]["requestBody"]["content"]["application/json"];
  "sandbox.inbound.simulate": operations["sandboxInboundSimulate"]["requestBody"]["content"]["application/json"];
  "sandbox.clock.advance": operations["sandboxClockAdvance"]["requestBody"]["content"]["application/json"];
  "call.outcome.set": operations["callOutcomeSet"]["requestBody"]["content"]["application/json"];
  "meeting.link": operations["meetingLink"]["requestBody"]["content"]["application/json"];
  "meeting.unlink": operations["meetingUnlink"]["requestBody"]["content"]["application/json"];
  "webhooks.create": operations["webhooksCreate"]["requestBody"]["content"]["application/json"];
  "webhooks.list": operations["webhooksList"]["requestBody"]["content"]["application/json"];
  "webhooks.update": operations["webhooksUpdate"]["requestBody"]["content"]["application/json"];
  "webhooks.delete": operations["webhooksDelete"]["requestBody"]["content"]["application/json"];
  "webhooks.test": operations["webhooksTest"]["requestBody"]["content"]["application/json"];
  "webhooks.replay": operations["webhooksReplay"]["requestBody"]["content"]["application/json"];
  "meetings.unlinked.list": operations["meetingsUnlinkedList"]["requestBody"]["content"]["application/json"];
  "pipeline.reconcile": operations["pipelineReconcile"]["requestBody"]["content"]["application/json"];
  "workspace.agent_sales.get": operations["workspaceAgentSalesGet"]["requestBody"]["content"]["application/json"];
  "workspace.agent_sales.update": operations["workspaceAgentSalesUpdate"]["requestBody"]["content"]["application/json"];
  "sandbox.provider.update": operations["sandboxProviderUpdate"]["requestBody"]["content"]["application/json"];
};
export type AgentToolDataMap = {
  "analytics.summary": NonNullable<
    operations["analyticsSummary"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "workspace.briefing": NonNullable<
    operations["workspaceBriefing"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "campaigns.list": NonNullable<
    operations["campaignsList"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "campaign.inspect": NonNullable<
    operations["campaignInspect"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "campaign.copy.inspect": NonNullable<
    operations["campaignCopyInspect"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "sending.inspect": NonNullable<
    operations["sendingInspect"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "replies.list": NonNullable<
    operations["repliesList"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "conversations.list": NonNullable<
    operations["conversationsList"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "conversation.inspect": NonNullable<
    operations["conversationInspect"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "conversation.update": NonNullable<
    operations["conversationUpdate"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "conversation.reply": NonNullable<
    operations["conversationReply"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "conversation.reply.inspect": NonNullable<
    operations["conversationReplyInspect"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "campaign.messages.draft.list": NonNullable<
    operations["campaignMessagesDraftList"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "campaign.messages.draft.update": NonNullable<
    operations["campaignMessagesDraftUpdate"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "campaign.messages.list": NonNullable<
    operations["campaignMessagesList"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "campaign.messages.update": NonNullable<
    operations["campaignMessagesUpdate"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "campaign.followups.list": NonNullable<
    operations["campaignFollowupsList"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "campaign.followups.cancel": NonNullable<
    operations["campaignFollowupsCancel"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "campaign.outcomes.list": NonNullable<
    operations["campaignOutcomesList"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "sending.test.prepare": NonNullable<
    operations["deliveryTestPrepare"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "sending.test.send": NonNullable<
    operations["deliveryTestSend"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "sending.test.inspect": NonNullable<
    operations["deliveryTestInspect"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "senders.inspect": NonNullable<
    operations["sendersInspect"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "history.list": NonNullable<
    operations["historyList"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "pipeline.inspect": NonNullable<
    operations["pipelineInspect"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "pipeline.cards.list": NonNullable<
    operations["pipelineCardsList"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "pipeline.stage.update": NonNullable<
    operations["pipelineStageUpdate"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "pipeline.note.list": NonNullable<
    operations["pipelineNoteList"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "pipeline.note.add": NonNullable<
    operations["pipelineNoteAdd"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "company.timeline": NonNullable<
    operations["companyTimeline"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "industry.lookup": NonNullable<
    operations["industryLookup"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "campaign.validate": NonNullable<
    operations["campaignValidate"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "audience.preview": NonNullable<
    operations["audiencePreview"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "lists.list": NonNullable<
    operations["listsList"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "list.inspect": NonNullable<
    operations["listInspect"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "list.target.remove": NonNullable<
    operations["listTargetRemove"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "campaign.draft.prepare": NonNullable<
    operations["campaignDraftPrepare"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "campaign.draft.update": NonNullable<
    operations["campaignDraftUpdate"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "list.import": NonNullable<
    operations["listImport"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "list.prepare": NonNullable<
    operations["listPrepare"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "campaign.prepare": NonNullable<
    operations["campaignPrepare"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "campaign.launch.preflight": NonNullable<
    operations["campaignLaunchPreflight"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "campaign.launch": NonNullable<
    operations["campaignLaunch"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "campaign.pause.preflight": NonNullable<
    operations["campaignPausePreflight"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "campaign.pause": NonNullable<
    operations["campaignPause"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "companies.filters": NonNullable<
    operations["companyFilters"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "companies.suggest": NonNullable<
    operations["companySuggestions"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "companies.search": NonNullable<
    operations["companySearch"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "companies.evidence.search": NonNullable<
    operations["companyEvidenceSearch"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "companies.knowledge.search": NonNullable<
    operations["companyKnowledgeSearch"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "companies.knowledge": NonNullable<
    operations["companyKnowledge"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "companies.evidence.start": NonNullable<
    operations["companyEvidenceStart"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "companies.evidence.advance": NonNullable<
    operations["companyEvidenceAdvance"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "companies.evidence.status": NonNullable<
    operations["companyEvidenceStatus"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "companies.evidence.results": NonNullable<
    operations["companyEvidenceResults"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "companies.evidence.cancel": NonNullable<
    operations["companyEvidenceCancel"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "company.inspect": NonNullable<
    operations["companyInspect"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "companies.fit.start": NonNullable<
    operations["companyFitStart"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "companies.fit.advance": NonNullable<
    operations["companyFitAdvance"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "companies.fit.results": NonNullable<
    operations["companyFitResults"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "companies.fit.proposal": NonNullable<
    operations["companyFitProposal"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "companies.list.prepare": NonNullable<
    operations["companyListPrepare"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "companies.list.inspect": NonNullable<
    operations["companyListInspect"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "companies.list.refine": NonNullable<
    operations["companyListRefine"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "campaign.operation.inspect": NonNullable<
    operations["campaignOperationInspect"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "campaign.delivery.inspect": NonNullable<
    operations["campaignDeliveryInspect"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "campaign.delivery.update": NonNullable<
    operations["campaignDeliveryUpdate"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "sending.instagram.pacing.inspect": NonNullable<
    operations["instagramPacingInspect"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "sending.instagram.pacing.update": NonNullable<
    operations["instagramPacingUpdate"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "companies.fit.status": NonNullable<
    operations["companyFitStatus"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "companies.fit.cancel": NonNullable<
    operations["companyFitCancel"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "companies.fit.runs.list": NonNullable<
    operations["companyFitRunsList"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "companies.fit.run": NonNullable<
    operations["companyFitRun"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "companies.fit.cohort": NonNullable<
    operations["companyFitCohort"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "copy.performance": NonNullable<
    operations["copyPerformance"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "calendar.status": NonNullable<
    operations["calendarStatus"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "calendar.availability": NonNullable<
    operations["calendarAvailability"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "calendar.meeting.book": NonNullable<
    operations["calendarMeetingBook"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "calls.list": NonNullable<
    operations["callsList"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "call.inspect": NonNullable<
    operations["callInspect"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "instagram.extract.quote": NonNullable<
    operations["instagramExtractionQuote"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "instagram.extract.start": NonNullable<
    operations["instagramExtractionStart"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "instagram.extract.inspect": NonNullable<
    operations["instagramExtractionInspect"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "instagram.extract.results": NonNullable<
    operations["instagramExtractionResults"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "instagram.purchases.list": NonNullable<
    operations["instagramPurchasesList"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "instagram.purchases.inspect": NonNullable<
    operations["instagramPurchasesInspect"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "instagram.purchases.results": NonNullable<
    operations["instagramPurchasesResults"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "leads.status": NonNullable<
    operations["leadsStatus"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "leads.extract.quote": NonNullable<
    operations["leadExtractionQuote"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "leads.extract.start": NonNullable<
    operations["leadExtractionStart"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "leads.extract.inspect": NonNullable<
    operations["leadExtractionInspect"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "leads.extract.refresh": NonNullable<
    operations["leadExtractionRefresh"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "leads.extract.continue": NonNullable<
    operations["leadExtractionContinue"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "leads.enrich.preview": NonNullable<
    operations["leadEnrichmentPreview"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "leads.enrich.start": NonNullable<
    operations["leadEnrichmentStart"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "leads.enrich.inspect": NonNullable<
    operations["leadEnrichmentInspect"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "leads.prospect.quote": NonNullable<
    operations["instagramProspectQuote"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "leads.prospect.start": NonNullable<
    operations["instagramProspectStart"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "leads.prospect.inspect": NonNullable<
    operations["instagramProspectInspect"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "leads.prospect.results": NonNullable<
    operations["instagramProspectResults"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "leads.prospect.advance": NonNullable<
    operations["instagramProspectAdvance"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "leads.prospect.cancel": NonNullable<
    operations["instagramProspectCancel"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "events.list": NonNullable<
    operations["eventsList"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "conversations.changes": NonNullable<
    operations["conversationsChanges"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "suppressions.list": NonNullable<
    operations["suppressionsList"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "suppressions.add": NonNullable<
    operations["suppressionsAdd"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "suppressions.remove": NonNullable<
    operations["suppressionsRemove"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "workspace.sandbox.create": NonNullable<
    operations["workspaceSandboxCreate"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "sandbox.seed": NonNullable<
    operations["sandboxSeed"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "sandbox.inbound.simulate": NonNullable<
    operations["sandboxInboundSimulate"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "sandbox.clock.advance": NonNullable<
    operations["sandboxClockAdvance"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "call.outcome.set": NonNullable<
    operations["callOutcomeSet"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "meeting.link": NonNullable<
    operations["meetingLink"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "meeting.unlink": NonNullable<
    operations["meetingUnlink"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "webhooks.create": NonNullable<
    operations["webhooksCreate"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "webhooks.list": NonNullable<
    operations["webhooksList"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "webhooks.update": NonNullable<
    operations["webhooksUpdate"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "webhooks.delete": NonNullable<
    operations["webhooksDelete"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "webhooks.test": NonNullable<
    operations["webhooksTest"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "webhooks.replay": NonNullable<
    operations["webhooksReplay"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "meetings.unlinked.list": NonNullable<
    operations["meetingsUnlinkedList"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "pipeline.reconcile": NonNullable<
    operations["pipelineReconcile"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "workspace.agent_sales.get": NonNullable<
    operations["workspaceAgentSalesGet"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "workspace.agent_sales.update": NonNullable<
    operations["workspaceAgentSalesUpdate"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "sandbox.provider.update": NonNullable<
    operations["sandboxProviderUpdate"]["responses"][200]["content"]["application/json"]["data"]
  >;
};
