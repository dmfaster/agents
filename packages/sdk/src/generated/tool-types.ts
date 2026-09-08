// Generated from packages/public-api/openapi.yaml. Run npm run generate:agent-api.
import type { operations } from "./api.ts";
export type AgentToolInputMap = {
  "analytics.summary": operations["analyticsSummary"]["requestBody"]["content"]["application/json"];
  "workspace.briefing": operations["workspaceBriefing"]["requestBody"]["content"]["application/json"];
  "campaigns.list": operations["campaignsList"]["requestBody"]["content"]["application/json"];
  "campaign.inspect": operations["campaignInspect"]["requestBody"]["content"]["application/json"];
  "sending.inspect": operations["sendingInspect"]["requestBody"]["content"]["application/json"];
  "replies.list": operations["repliesList"]["requestBody"]["content"]["application/json"];
  "pipeline.inspect": operations["pipelineInspect"]["requestBody"]["content"]["application/json"];
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
  "sending.inspect": NonNullable<
    operations["sendingInspect"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "replies.list": NonNullable<
    operations["repliesList"]["responses"][200]["content"]["application/json"]["data"]
  >;
  "pipeline.inspect": NonNullable<
    operations["pipelineInspect"]["responses"][200]["content"]["application/json"]["data"]
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
};
