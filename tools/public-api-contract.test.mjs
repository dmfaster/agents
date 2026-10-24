import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { parse } from "yaml";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contractPath = path.join(rootDir, "packages", "public-api", "openapi.yaml");
const packagePath = path.join(rootDir, "package.json");
const generatorPath = path.join(rootDir, "tools", "generate-public-api.mjs");
const sdkContractsPath = path.join(rootDir, "packages", "sdk", "src", "contracts.ts");
const mcpToolsPath = path.join(rootDir, "packages", "mcp-server", "src", "tools.ts");
const localAuthConstantsPath = path.join(rootDir, "packages", "local-auth", "src", "constants.ts");
const capabilityRegistryPath = path.join(
  rootDir,
  "site",
  "src",
  "lib",
  "agent-platform",
  "capability-registry.ts",
);
const serverToolsPath = path.join(
  rootDir,
  "site",
  "src",
  "lib",
  "server",
  "agent-api",
  "public-tools.ts",
);
const serverResponsesPath = path.join(
  rootDir,
  "site",
  "src",
  "lib",
  "server",
  "agent-api",
  "responses.ts",
);
const serverCredentialsPath = path.join(
  rootDir,
  "site",
  "src",
  "lib",
  "server",
  "agent-api",
  "credentials.ts",
);
const databaseSchemaPath = path.join(rootDir, "site", "src", "lib", "server", "db", "schema.ts");
const scopeMigrationPaths = [path.join(rootDir, "site", "drizzle", "0415_call_stats_v2.sql")];

// Explicit reviewed Agent 3.0 catalog, including the merged feedback surface.
const EXPECTED_TOOLS = new Map([
  [
    "analytics.summary",
    {
      effect: "read",
      scopes: ["workspace:read"],
    },
  ],
  [
    "workspace.briefing",
    {
      effect: "read",
      scopes: ["workspace:read"],
    },
  ],
  [
    "campaigns.list",
    {
      effect: "read",
      scopes: ["campaigns:read"],
    },
  ],
  [
    "campaign.inspect",
    {
      effect: "read",
      scopes: ["campaigns:read"],
    },
  ],
  [
    "campaign.copy.inspect",
    {
      effect: "read",
      scopes: ["campaigns:read"],
    },
  ],
  [
    "sending.inspect",
    {
      effect: "read",
      scopes: ["sending:read"],
    },
  ],
  [
    "replies.list",
    {
      effect: "read",
      scopes: ["inbox:read"],
    },
  ],
  [
    "conversations.list",
    {
      effect: "read",
      scopes: ["inbox:read"],
    },
  ],
  [
    "conversation.inspect",
    {
      effect: "read",
      scopes: ["inbox:read"],
    },
  ],
  [
    "conversation.update",
    {
      effect: "write",
      scopes: ["inbox:read", "inbox:write"],
    },
  ],
  [
    "conversation.reply",
    {
      effect: "external",
      scopes: ["inbox:read", "inbox:write"],
    },
  ],
  [
    "conversation.reply.inspect",
    {
      effect: "read",
      scopes: ["inbox:read"],
    },
  ],
  [
    "campaign.messages.draft.list",
    {
      effect: "read",
      scopes: ["campaigns:read"],
    },
  ],
  [
    "campaign.messages.draft.update",
    {
      effect: "draft",
      scopes: ["campaigns:write"],
    },
  ],
  [
    "campaign.messages.list",
    {
      effect: "read",
      scopes: ["sending:read"],
    },
  ],
  [
    "campaign.messages.update",
    {
      effect: "write",
      scopes: ["campaigns:write"],
    },
  ],
  [
    "campaign.followups.list",
    {
      effect: "read",
      scopes: ["sending:read"],
    },
  ],
  [
    "campaign.followups.cancel",
    {
      effect: "write",
      scopes: ["campaigns:write"],
    },
  ],
  [
    "campaign.outcomes.list",
    {
      effect: "read",
      scopes: ["sending:read"],
    },
  ],
  [
    "sending.test.prepare",
    {
      effect: "draft",
      scopes: ["sending:read", "campaigns:write"],
    },
  ],
  [
    "sending.test.send",
    {
      effect: "external",
      scopes: ["sending:read", "sending:test"],
    },
  ],
  [
    "sending.test.inspect",
    {
      effect: "read",
      scopes: ["sending:read"],
    },
  ],
  [
    "senders.inspect",
    {
      effect: "read",
      scopes: ["sending:read"],
    },
  ],
  [
    "history.list",
    {
      effect: "read",
      scopes: ["campaigns:read", "sending:read"],
    },
  ],
  [
    "pipeline.inspect",
    {
      effect: "read",
      scopes: ["pipeline:read"],
    },
  ],
  [
    "pipeline.cards.list",
    {
      effect: "read",
      scopes: ["pipeline:read"],
    },
  ],
  [
    "pipeline.stage.update",
    {
      effect: "write",
      scopes: ["pipeline:read", "pipeline:write"],
    },
  ],
  [
    "pipeline.note.list",
    {
      effect: "read",
      scopes: ["pipeline:read"],
    },
  ],
  [
    "pipeline.note.add",
    {
      effect: "write",
      scopes: ["pipeline:read", "pipeline:write"],
    },
  ],
  [
    "company.timeline",
    {
      effect: "read",
      scopes: ["campaigns:read", "pipeline:read"],
    },
  ],
  [
    "industry.lookup",
    {
      effect: "read",
      scopes: ["audiences:read"],
    },
  ],
  [
    "campaign.validate",
    {
      effect: "read",
      scopes: ["audiences:read"],
    },
  ],
  [
    "audience.preview",
    {
      effect: "read",
      scopes: ["audiences:read"],
    },
  ],
  [
    "lists.list",
    {
      effect: "read",
      scopes: ["campaigns:read"],
    },
  ],
  [
    "list.inspect",
    {
      effect: "read",
      scopes: ["campaigns:read"],
    },
  ],
  [
    "list.target.remove",
    {
      effect: "write",
      scopes: ["campaigns:write"],
    },
  ],
  [
    "campaign.draft.prepare",
    {
      effect: "draft",
      scopes: ["campaigns:read", "campaigns:write"],
    },
  ],
  [
    "campaign.draft.update",
    {
      effect: "draft",
      scopes: ["campaigns:read", "campaigns:write"],
    },
  ],
  [
    "list.import",
    {
      effect: "draft",
      scopes: ["campaigns:write"],
    },
  ],
  [
    "list.prepare",
    {
      effect: "draft",
      scopes: ["audiences:read", "campaigns:write"],
    },
  ],
  [
    "campaign.prepare",
    {
      effect: "draft",
      scopes: ["audiences:read", "campaigns:write"],
    },
  ],
  [
    "campaign.launch.preflight",
    {
      effect: "write",
      scopes: ["campaigns:launch"],
    },
  ],
  [
    "campaign.launch",
    {
      effect: "external",
      scopes: ["campaigns:launch"],
    },
  ],
  [
    "campaign.pause.preflight",
    {
      effect: "write",
      scopes: ["campaigns:write"],
    },
  ],
  [
    "campaign.pause",
    {
      effect: "write",
      scopes: ["campaigns:write"],
    },
  ],
  [
    "companies.filters",
    {
      effect: "read",
      scopes: ["audiences:read"],
    },
  ],
  [
    "companies.suggest",
    {
      effect: "read",
      scopes: ["audiences:read"],
    },
  ],
  [
    "companies.search",
    {
      effect: "read",
      scopes: ["audiences:read"],
    },
  ],
  [
    "companies.evidence.search",
    {
      effect: "read",
      scopes: ["audiences:read"],
    },
  ],
  [
    "companies.knowledge.search",
    {
      effect: "read",
      scopes: ["audiences:read"],
    },
  ],
  [
    "companies.knowledge",
    {
      effect: "read",
      scopes: ["audiences:read"],
    },
  ],
  [
    "companies.evidence.start",
    {
      effect: "read",
      scopes: ["audiences:read"],
    },
  ],
  [
    "companies.evidence.advance",
    {
      effect: "read",
      scopes: ["audiences:read"],
    },
  ],
  [
    "companies.evidence.status",
    {
      effect: "read",
      scopes: ["audiences:read"],
    },
  ],
  [
    "companies.evidence.results",
    {
      effect: "read",
      scopes: ["audiences:read"],
    },
  ],
  [
    "companies.evidence.cancel",
    {
      effect: "read",
      scopes: ["audiences:read"],
    },
  ],
  [
    "company.inspect",
    {
      effect: "read",
      scopes: ["audiences:read"],
    },
  ],
  [
    "companies.fit.start",
    {
      effect: "draft",
      scopes: ["campaigns:read", "audiences:read", "campaigns:write"],
    },
  ],
  [
    "companies.fit.advance",
    {
      effect: "draft",
      scopes: ["campaigns:read", "audiences:read", "campaigns:write"],
    },
  ],
  [
    "companies.fit.results",
    {
      effect: "read",
      scopes: ["campaigns:read", "audiences:read"],
    },
  ],
  [
    "companies.fit.proposal",
    {
      effect: "read",
      scopes: ["campaigns:read", "audiences:read"],
    },
  ],
  [
    "companies.list.prepare",
    {
      effect: "draft",
      scopes: ["audiences:read", "campaigns:write"],
    },
  ],
  [
    "companies.list.inspect",
    {
      effect: "read",
      scopes: ["campaigns:read", "audiences:read"],
    },
  ],
  [
    "companies.list.refine",
    {
      effect: "write",
      scopes: ["campaigns:read", "campaigns:write"],
    },
  ],
  [
    "campaign.operation.inspect",
    {
      effect: "read",
      scopes: ["campaigns:read"],
    },
  ],
  [
    "campaign.delivery.inspect",
    {
      effect: "read",
      scopes: ["campaigns:read"],
    },
  ],
  [
    "campaign.delivery.update",
    {
      effect: "write",
      scopes: ["campaigns:read", "campaigns:write"],
    },
  ],
  [
    "sending.instagram.pacing.inspect",
    {
      effect: "read",
      scopes: ["sending:read"],
    },
  ],
  [
    "sending.instagram.pacing.update",
    {
      effect: "write",
      scopes: ["sending:read", "campaigns:write"],
    },
  ],
  [
    "companies.fit.status",
    {
      effect: "read",
      scopes: ["campaigns:read", "audiences:read"],
    },
  ],
  [
    "companies.fit.cancel",
    {
      effect: "write",
      scopes: ["campaigns:read", "audiences:read", "campaigns:write"],
    },
  ],
  [
    "companies.fit.runs.list",
    {
      effect: "read",
      scopes: ["campaigns:read", "audiences:read"],
    },
  ],
  [
    "companies.fit.run",
    {
      effect: "draft",
      scopes: ["campaigns:read", "audiences:read", "campaigns:write"],
    },
  ],
  [
    "companies.fit.cohort",
    {
      effect: "read",
      scopes: ["campaigns:read", "audiences:read"],
    },
  ],
  [
    "copy.performance",
    {
      effect: "read",
      scopes: ["campaigns:read", "sending:read", "inbox:read", "calendar:read"],
    },
  ],
  [
    "calendar.status",
    {
      effect: "read",
      scopes: ["calendar:read"],
    },
  ],
  [
    "calendar.availability",
    {
      effect: "read",
      scopes: ["calendar:read"],
    },
  ],
  [
    "calendar.meeting.book",
    {
      effect: "external",
      scopes: ["calendar:write", "calendar:read", "inbox:read", "pipeline:write"],
    },
  ],
  [
    "calls.list",
    {
      effect: "read",
      scopes: ["calls:read"],
    },
  ],
  [
    "call.inspect",
    {
      effect: "read",
      scopes: ["calls:read"],
    },
  ],
  [
    "instagram.extract.quote",
    {
      effect: "read",
      scopes: ["leads:read"],
    },
  ],
  [
    "instagram.extract.start",
    {
      effect: "write",
      scopes: ["leads:read", "leads:write"],
    },
  ],
  [
    "instagram.extract.inspect",
    {
      effect: "read",
      scopes: ["leads:read"],
    },
  ],
  [
    "instagram.extract.results",
    {
      effect: "read",
      scopes: ["leads:read"],
    },
  ],
  [
    "instagram.purchases.list",
    {
      effect: "read",
      scopes: ["leads:read"],
    },
  ],
  [
    "instagram.purchases.inspect",
    {
      effect: "read",
      scopes: ["leads:read"],
    },
  ],
  [
    "instagram.purchases.results",
    {
      effect: "read",
      scopes: ["leads:read"],
    },
  ],
  [
    "leads.status",
    {
      effect: "read",
      scopes: ["leads:read"],
    },
  ],
  [
    "leads.extract.quote",
    {
      effect: "read",
      scopes: ["leads:read"],
    },
  ],
  [
    "leads.extract.start",
    {
      effect: "write",
      scopes: ["leads:read", "leads:write"],
    },
  ],
  [
    "leads.extract.inspect",
    {
      effect: "read",
      scopes: ["leads:read"],
    },
  ],
  [
    "leads.extract.refresh",
    {
      effect: "write",
      scopes: ["leads:read", "leads:write"],
    },
  ],
  [
    "leads.extract.continue",
    {
      effect: "write",
      scopes: ["leads:read", "leads:write"],
    },
  ],
  [
    "leads.enrich.preview",
    {
      effect: "read",
      scopes: ["leads:read"],
    },
  ],
  [
    "leads.enrich.start",
    {
      effect: "write",
      scopes: ["leads:read", "leads:write"],
    },
  ],
  [
    "leads.enrich.inspect",
    {
      effect: "read",
      scopes: ["leads:read"],
    },
  ],
  [
    "leads.prospect.quote",
    {
      effect: "read",
      scopes: ["leads:read", "campaigns:read"],
    },
  ],
  [
    "leads.prospect.start",
    {
      effect: "write",
      scopes: ["leads:read", "campaigns:read", "leads:write", "campaigns:write"],
    },
  ],
  [
    "leads.prospect.inspect",
    {
      effect: "read",
      scopes: ["leads:read", "campaigns:read"],
    },
  ],
  [
    "leads.prospect.results",
    {
      effect: "read",
      scopes: ["leads:read", "campaigns:read"],
    },
  ],
  [
    "leads.prospect.advance",
    {
      effect: "write",
      scopes: ["leads:read", "campaigns:read", "leads:write", "campaigns:write"],
    },
  ],
  [
    "leads.prospect.cancel",
    {
      effect: "write",
      scopes: ["leads:read", "campaigns:read", "leads:write", "campaigns:write"],
    },
  ],
  [
    "events.list",
    {
      effect: "read",
      scopes: ["events:read"],
    },
  ],
  [
    "conversations.changes",
    {
      effect: "read",
      scopes: ["inbox:read"],
    },
  ],
  [
    "suppressions.list",
    {
      effect: "read",
      scopes: ["inbox:read"],
    },
  ],
  [
    "suppressions.add",
    {
      effect: "write",
      scopes: ["suppressions:write"],
    },
  ],
  [
    "suppressions.remove",
    {
      effect: "write",
      scopes: ["suppressions:write"],
    },
  ],
  [
    "workspace.sandbox.create",
    {
      effect: "write",
      scopes: ["sandbox:write"],
    },
  ],
  [
    "sandbox.seed",
    {
      effect: "write",
      scopes: ["sandbox:write"],
    },
  ],
  [
    "sandbox.inbound.simulate",
    {
      effect: "write",
      scopes: ["sandbox:write"],
    },
  ],
  [
    "sandbox.clock.advance",
    {
      effect: "write",
      scopes: ["sandbox:write"],
    },
  ],
  [
    "call.outcome.set",
    {
      effect: "write",
      scopes: ["calls:write"],
    },
  ],
  [
    "meeting.link",
    {
      effect: "write",
      scopes: ["calls:write"],
    },
  ],
  [
    "meeting.unlink",
    {
      effect: "write",
      scopes: ["calls:write"],
    },
  ],
  [
    "webhooks.create",
    {
      effect: "write",
      scopes: ["webhooks:write", "events:read"],
    },
  ],
  [
    "webhooks.list",
    {
      effect: "read",
      scopes: ["webhooks:write", "events:read"],
    },
  ],
  [
    "webhooks.update",
    {
      effect: "write",
      scopes: ["webhooks:write", "events:read"],
    },
  ],
  [
    "webhooks.delete",
    {
      effect: "write",
      scopes: ["webhooks:write", "events:read"],
    },
  ],
  [
    "webhooks.test",
    {
      effect: "write",
      scopes: ["webhooks:write", "events:read"],
    },
  ],
  [
    "webhooks.replay",
    {
      effect: "write",
      scopes: ["webhooks:write", "events:read"],
    },
  ],
  [
    "meetings.unlinked.list",
    {
      effect: "read",
      scopes: ["calls:read"],
    },
  ],
  [
    "pipeline.reconcile",
    {
      effect: "write",
      scopes: ["calls:read", "pipeline:write", "calls:write"],
    },
  ],
  [
    "workspace.agent_sales.get",
    {
      effect: "read",
      scopes: ["workspace:read"],
    },
  ],
  [
    "workspace.agent_sales.update",
    {
      effect: "write",
      scopes: ["inbox:write", "suppressions:write"],
    },
  ],
  [
    "sandbox.provider.update",
    {
      effect: "write",
      scopes: ["sandbox:write"],
    },
  ],
  [
    "reply.templates.list",
    {
      effect: "read",
      scopes: ["inbox:read"],
    },
  ],
  [
    "reply.templates.create",
    {
      effect: "write",
      scopes: ["policy:write"],
    },
  ],
  [
    "reply.templates.update",
    {
      effect: "write",
      scopes: ["policy:write"],
    },
  ],
  [
    "reply.templates.delete",
    {
      effect: "write",
      scopes: ["policy:write"],
    },
  ],
  [
    "reply.policy.get",
    {
      effect: "read",
      scopes: ["inbox:read"],
    },
  ],
  [
    "reply.policy.update",
    {
      effect: "write",
      scopes: ["policy:write"],
    },
  ],
  [
    "reply.approvals.list",
    {
      effect: "read",
      scopes: ["inbox:read"],
    },
  ],
  [
    "conversation.draft.save",
    {
      effect: "draft",
      scopes: ["inbox:read", "inbox:write"],
    },
  ],
  [
    "conversation.followup.set",
    {
      effect: "write",
      scopes: ["inbox:read", "inbox:write"],
    },
  ],
  [
    "conversation.followup.clear",
    {
      effect: "write",
      scopes: ["inbox:write"],
    },
  ],
  [
    "followups.due",
    {
      effect: "read",
      scopes: ["inbox:read"],
    },
  ],
  [
    "conversations.bulk.update",
    {
      effect: "write",
      scopes: ["inbox:write"],
    },
  ],
  [
    "pipeline.board",
    {
      effect: "read",
      scopes: ["pipeline:read"],
    },
  ],
  [
    "calendar.booking.link.create",
    {
      effect: "external",
      scopes: ["calendar:write", "calendar:read", "inbox:read", "pipeline:write"],
    },
  ],
  [
    "calendar.meeting.reschedule",
    {
      effect: "external",
      scopes: ["calendar:write", "calendar:read", "inbox:read", "pipeline:write"],
    },
  ],
  [
    "calendar.meeting.cancel",
    {
      effect: "external",
      scopes: ["calendar:write", "calendar:read", "inbox:read", "pipeline:write"],
    },
  ],
  [
    "campaign.followups.configure",
    {
      effect: "write",
      scopes: ["campaigns:write"],
    },
  ],
  [
    "campaign.variants.configure",
    {
      effect: "write",
      scopes: ["campaigns:write"],
    },
  ],
  [
    "recorder.settings.get",
    {
      effect: "read",
      scopes: ["calls:read"],
    },
  ],
  [
    "recorder.settings.update",
    {
      effect: "write",
      scopes: ["calls:record"],
    },
  ],
  [
    "recorder.bots.list",
    {
      effect: "read",
      scopes: ["calls:read"],
    },
  ],
  [
    "call.transcript.get",
    {
      effect: "read",
      scopes: ["calls:transcripts:read"],
    },
  ],
  [
    "call.recording.get",
    {
      effect: "read",
      scopes: ["calls:read"],
    },
  ],
  [
    "call.transcripts.get",
    {
      effect: "read",
      scopes: ["calls:transcripts:read"],
    },
  ],
  [
    "call.transcripts.search",
    {
      effect: "read",
      scopes: ["calls:transcripts:read"],
    },
  ],
  [
    "readiness.check",
    {
      effect: "read",
      scopes: ["workspace:read"],
    },
  ],
  [
    "sender.retire",
    {
      effect: "write",
      scopes: ["sending:write"],
    },
  ],
  [
    "sender.unretire",
    {
      effect: "write",
      scopes: ["sending:write"],
    },
  ],
  [
    "attribution.check",
    {
      effect: "read",
      scopes: ["campaigns:read"],
    },
  ],
  [
    "campaign.reengagement.prepare",
    {
      effect: "write",
      scopes: ["campaigns:write"],
    },
  ],
  [
    "agents.list",
    {
      effect: "read",
      scopes: ["workspace:read"],
    },
  ],
  [
    "agent.inspect",
    {
      effect: "read",
      scopes: ["workspace:read"],
    },
  ],
  [
    "agent.create.request",
    {
      effect: "write",
      scopes: ["policy:write"],
    },
  ],
  [
    "agent.pause",
    {
      effect: "write",
      scopes: ["policy:write"],
    },
  ],
  [
    "agent.resume",
    {
      effect: "write",
      scopes: ["policy:write"],
    },
  ],
  [
    "agent.credential.rotate",
    {
      effect: "write",
      scopes: ["policy:write"],
    },
  ],
  [
    "event_consumers.list",
    {
      effect: "read",
      scopes: ["events:read"],
    },
  ],
  [
    "event_consumers.create",
    {
      effect: "write",
      scopes: ["webhooks:write", "events:read"],
    },
  ],
  [
    "events.ack",
    {
      effect: "write",
      scopes: ["webhooks:write", "events:read"],
    },
  ],
  [
    "events.snapshot",
    {
      effect: "read",
      scopes: ["events:read"],
    },
  ],
  [
    "webhook.deliveries.list",
    {
      effect: "read",
      scopes: ["webhooks:write", "events:read"],
    },
  ],
  [
    "webhooks.dlq.replay",
    {
      effect: "write",
      scopes: ["webhooks:write", "events:read"],
    },
  ],
  [
    "classification.feedback",
    {
      effect: "write",
      scopes: ["inbox:write"],
    },
  ],
  [
    "classification.quality",
    {
      effect: "read",
      scopes: ["inbox:read"],
    },
  ],
  [
    "classification.backfill.plan",
    {
      effect: "read",
      scopes: ["inbox:read"],
    },
  ],
  [
    "work_queue.list",
    {
      effect: "read",
      scopes: ["workspace:read"],
    },
  ],
  [
    "work_item.claim",
    {
      effect: "write",
      scopes: ["policy:write"],
    },
  ],
  [
    "work_item.release",
    {
      effect: "write",
      scopes: ["policy:write"],
    },
  ],
  [
    "work_item.snooze",
    {
      effect: "write",
      scopes: ["policy:write"],
    },
  ],
  [
    "work_item.complete",
    {
      effect: "write",
      scopes: ["policy:write"],
    },
  ],
  [
    "work_queue.config.get",
    {
      effect: "read",
      scopes: ["workspace:read"],
    },
  ],
  [
    "work_queue.config.update",
    {
      effect: "write",
      scopes: ["policy:write"],
    },
  ],
  [
    "metrics.reconcile",
    {
      effect: "read",
      scopes: ["workspace:read"],
    },
  ],
  [
    "agent.heartbeat",
    {
      effect: "write",
      scopes: ["workspace:read"],
    },
  ],
  [
    "agent.run.start",
    {
      effect: "write",
      scopes: ["workspace:read"],
    },
  ],
  [
    "agent.run.end",
    {
      effect: "write",
      scopes: ["workspace:read"],
    },
  ],
  [
    "agent.runs.list",
    {
      effect: "read",
      scopes: ["workspace:read"],
    },
  ],
  [
    "agent.run.inspect",
    {
      effect: "read",
      scopes: ["workspace:read"],
    },
  ],
  [
    "workspace.halt",
    {
      effect: "write",
      scopes: ["policy:write"],
    },
  ],
  [
    "workspace.resume",
    {
      effect: "write",
      scopes: ["policy:write"],
    },
  ],
  [
    "channel.halt",
    {
      effect: "write",
      scopes: ["policy:write"],
    },
  ],
  [
    "workspace.automation.inspect",
    {
      effect: "read",
      scopes: ["workspace:read"],
    },
  ],
  [
    "feedback.submit",
    {
      effect: "write",
      scopes: ["feedback:write"],
    },
  ],
  [
    "feedback.list",
    {
      effect: "read",
      scopes: ["feedback:write"],
    },
  ],
  ["entity.resolve", { effect: "read", scopes: ["pipeline:read", "inbox:read"] }],
  ["entities.get", { effect: "read", scopes: ["pipeline:read"] }],
  ["people.upsert", { effect: "write", scopes: ["pipeline:write"] }],
  ["companies.upsert", { effect: "write", scopes: ["pipeline:write"] }],
  ["entity.merge", { effect: "write", scopes: ["pipeline:write"] }],
  ["entity.split", { effect: "write", scopes: ["pipeline:write"] }],
  ["budget.status", { effect: "read", scopes: ["workspace:read"] }],
]);

EXPECTED_TOOLS.set("call.stats.get", { effect: "read", scopes: ["calls:stats:read"] });
EXPECTED_TOOLS.set("call.coaching.get", { effect: "read", scopes: ["calls:stats:read"] });
EXPECTED_TOOLS.set("call.analytics.query", { effect: "read", scopes: ["calls:stats:read"] });
EXPECTED_TOOLS.set("call.insight.get", { effect: "read", scopes: ["calls:transcripts:read"] });
for (const name of ["call.access.list", "call.audit.list", "call.activity.get"]) EXPECTED_TOOLS.set(name, { effect: "read", scopes: ["calls:read"] });

EXPECTED_TOOLS.set("call.analysis.get", { effect: "read", scopes: ["calls:transcripts:read"] });

EXPECTED_TOOLS.set("call.outcome.confirm", { effect: "write", scopes: ["calls:write","calls:transcripts:read"] });

EXPECTED_TOOLS.set("call.attendance.get", { effect: "read", scopes: ["calls:stats:read"] });
EXPECTED_TOOLS.set("call.insight.review", { effect: "write", scopes: ["calls:write","calls:transcripts:read"] });
EXPECTED_TOOLS.set("recorder.event.override.get",{effect:"read",scopes:["calls:read"]});
EXPECTED_TOOLS.set("recorder.event.override.update",{effect:"write",scopes:["calls:record"]});
for(const name of ["call.bot.cancel","call.bot.remove","call.recording.stop"]) EXPECTED_TOOLS.set(name,{effect:"write",scopes:["calls:record"]});
EXPECTED_TOOLS.set("recorder.status",{effect:"read",scopes:["calls:read"]});
EXPECTED_TOOLS.set("call.bot.join",{effect:"write",scopes:["calls:record"]});
EXPECTED_TOOLS.set("recorder.join.get",{effect:"read",scopes:["calls:read"]});
EXPECTED_TOOLS.set("call.participant.withdrawal.report", { effect: "write", scopes: ["calls:record", "calls:transcripts:read"] });
EXPECTED_TOOLS.set("call.delete",{effect:"write",scopes:["calls:write"]});


const EXPECTED_AUTH_METHODS = new Map([
  ["device", "post"],
  ["token", "post"],
  ["status", "get"],
  ["revoke", "post"],
]);
const EXPECTED_TOOL_NAMES = [...EXPECTED_TOOLS.keys()];
const EXPECTED_SCOPE_NAMES = [
  "calls:stats:read",
  "calls:transcripts:read",
  "calls:media:read",
  "calls:record",
  "sending:write",
  "workspace:read",
  "campaigns:read",
  "sending:read",
  "inbox:read",
  "pipeline:read",
  "audiences:read",
  "campaigns:write",
  "campaigns:launch",
  "campaigns:control",
  "inbox:write",
  "pipeline:write",
  "calendar:read",
  "calendar:write",
  "calls:read",
  "events:read",
  "suppressions:write",
  "sandbox:write",
  "calls:write",
  "webhooks:write",
  "leads:read",
  "leads:write",
  "sending:test",
  "policy:write",
  "feedback:write",
];

function sourceSlice(source, start, end) {
  const startIndex = source.indexOf(start);
  assert.notEqual(startIndex, -1, `missing source marker: ${start}`);
  const endIndex = source.indexOf(end, startIndex + start.length);
  assert.notEqual(endIndex, -1, `missing source marker: ${end}`);
  return source.slice(startIndex, endIndex);
}

function quotedValues(source) {
  return [...source.matchAll(/["']([^"']+)["']/g)].map((match) => match[1]);
}

function yamlEnumValues(source, schemaName, nextSchemaName) {
  return sourceSlice(source, `    ${schemaName}:`, `    ${nextSchemaName}:`)
    .split("\n")
    .map((line) => line.match(/^        - (.+)$/)?.[1]?.trim())
    .filter(Boolean);
}

function jsonbScopeAllowlists(source) {
  return [...source.matchAll(/<@\s+'(\[[^']+\])'::jsonb/g)].map((match) => JSON.parse(match[1]));
}

test("public API generation scripts and stale-output guidance share one repair command", async () => {
  const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
  const generator = await readFile(generatorPath, "utf8");

  assert.equal(
    packageJson.scripts?.["generate:agent-api"],
    "node tools/generate-public-api.mjs && node tools/generate-sales-metrics.mjs",
  );
  assert.equal(
    packageJson.scripts?.["check:agent-api"],
    "node tools/generate-public-api.mjs --check && node tools/generate-sales-metrics.mjs --check",
  );
  assert.match(generator, /npm run generate:agent-api/);
  assert.doesNotMatch(generator, /npm run generate:public-api/);
});

function operationBlocks(source) {
  return [
    ...source.matchAll(/^  \/api\/v1\/agent\/tools\/([^:]+):\n([\s\S]*?)(?=^  \/|^components:)/gm),
  ].map((match) => ({ tool: match[1], source: match[2] }));
}

function authOperationBlocks(source) {
  return [
    ...source.matchAll(
      /^  \/api\/v1\/agent\/auth\/([^:]+):\n([\s\S]*?)(?=^  \/api\/v1\/agent\/(?:auth|tools)\/|^components:)/gm,
    ),
  ].map((match) => ({ operation: match[1], source: match[2] }));
}

test("the Agent API exposes the bounded browser-login lifecycle", async () => {
  const source = await readFile(contractPath, "utf8");
  const blocks = authOperationBlocks(source);

  assert.deepEqual(
    blocks.map(({ operation }) => operation),
    [...EXPECTED_AUTH_METHODS.keys()],
  );
  for (const { operation, source: block } of blocks) {
    const methods = [
      ...block.matchAll(/^    (get|post|put|patch|delete|options|head|trace):/gm),
    ].map((match) => match[1]);
    assert.deepEqual(methods, [EXPECTED_AUTH_METHODS.get(operation)]);
  }

  for (const operation of ["device", "token"]) {
    const block = blocks.find((candidate) => candidate.operation === operation)?.source || "";
    assert.match(block, /^      security: \[\]$/m, `${operation} must not require a bearer token`);
  }
  for (const operation of ["status", "revoke"]) {
    const block = blocks.find((candidate) => candidate.operation === operation)?.source || "";
    assert.doesNotMatch(
      block,
      /^      security: \[\]$/m,
      `${operation} must inherit bearer authentication`,
    );
  }

  assert.match(
    source,
    /^        codeChallengeMethod:\n          type: string\n          const: S256$/m,
  );
  assert.match(source, /^        expiresIn:\n          type: integer\n          const: 300$/m);
  assert.equal(
    parse(source).components.schemas.AgentDeviceTokenResult.properties.accessToken.pattern,
    "^dmf_pat_[a-f0-9]{64}$",
  );
});

test("the public Agent API exposes exactly the approved Agent 3.0 operations", async () => {
  const source = await readFile(contractPath, "utf8");
  const parsedContract = parse(source);
  const blocks = operationBlocks(source);

  assert.deepEqual(
    blocks.map(({ tool }) => tool),
    [...EXPECTED_TOOLS.keys()],
  );
  for (const { tool, source: operation } of blocks) {
    const methods = [
      ...operation.matchAll(/^    (get|post|put|patch|delete|options|head|trace):/gm),
    ].map((match) => match[1]);
    assert.deepEqual(methods, ["post"], `${tool} must expose only POST`);
    assert.match(
      operation,
      new RegExp(`^      x-dmfaster-effect: ${EXPECTED_TOOLS.get(tool).effect}$`, "m"),
      `${tool} effect drift`,
    );

    const scopes =
      parsedContract.paths[`/api/v1/agent/tools/${tool}`].post["x-dmfaster-required-scopes"];
    assert.deepEqual(scopes, EXPECTED_TOOLS.get(tool).scopes, `${tool} scope drift`);
  }

  assert.doesNotMatch(source, /approved:\s*true/);
  assert.match(source, /human approval/i);
});

test("every public adapter consumes the generated OpenAPI catalog", async () => {
  const sdk = await import("../packages/sdk/src/generated/tools.ts");
  const server = await import("../site/src/lib/agent-platform/public-contract.generated.ts");
  assert.deepEqual(sdk.AGENT_TOOL_NAMES, EXPECTED_TOOL_NAMES);
  assert.deepEqual(server.AGENT_TOOL_NAMES, EXPECTED_TOOL_NAMES);
  assert.deepEqual(sdk.AGENT_TOOL_POLICIES, server.AGENT_TOOL_POLICIES);
  assert.deepEqual(sdk.AGENT_TOOL_SCOPES, server.AGENT_TOOL_SCOPES);
  for (const [name, expected] of EXPECTED_TOOLS) {
    assert.equal(sdk.AGENT_TOOL_POLICIES[name].effect, expected.effect);
    assert.deepEqual(sdk.AGENT_TOOL_SCOPES[name], expected.scopes);
  }
  const [sdkSource, mcp, registry, serverTools, responses] = await Promise.all([
    readFile(sdkContractsPath, "utf8"),
    readFile(mcpToolsPath, "utf8"),
    readFile(capabilityRegistryPath, "utf8"),
    readFile(serverToolsPath, "utf8"),
    readFile(serverResponsesPath, "utf8"),
  ]);
  assert.match(sdkSource, /generated\/tools\.ts/);
  assert.match(mcp, /AGENT_TOOL_NAMES\.map/);
  assert.match(mcp, /AGENT_INPUT_SCHEMAS\[tool\]/);
  assert.match(registry, /AGENT_TOOL_NAMES as AGENT_PUBLIC_CAPABILITY_NAMES/);
  assert.match(serverTools, /PUBLIC_AGENT_TOOL_SCOPES = AGENT_TOOL_SCOPES/);
  assert.match(responses, /PUBLIC_AGENT_TOOL_POLICIES = AGENT_TOOL_POLICIES/);
});

test("every runtime, contract, schema, and migration scope allowlist stays equal", async () => {
  const [contract, localAuth, serverCredentials, databaseSchema, ...migrations] = await Promise.all(
    [
      readFile(contractPath, "utf8"),
      readFile(localAuthConstantsPath, "utf8"),
      readFile(serverCredentialsPath, "utf8"),
      readFile(databaseSchemaPath, "utf8"),
      ...scopeMigrationPaths.map((migrationPath) => readFile(migrationPath, "utf8")),
    ],
  );

  const schemas = parse(contract).components.schemas;
  for (const name of ["AgentDeviceAuthorizationInput", "AgentCredential"]) {
    assert.ok(
      schemas[name].properties.scopes.maxItems >= EXPECTED_SCOPE_NAMES.length,
      `${name} must accept the complete scope catalog`,
    );
  }

  const runtimeAllowlists = new Map([
    [
      "OpenAPI AgentApiScope",
      yamlEnumValues(contract, "AgentApiScope", "AgentDeviceAuthorizationInput"),
    ],
    [
      "local-auth DMFASTER_AGENT_SCOPES",
      quotedValues(sourceSlice(localAuth, "export const DMFASTER_AGENT_SCOPES = [", "] as const")),
    ],
    [
      "server AGENT_API_SCOPES",
      quotedValues(
        sourceSlice(serverCredentials, "export const AGENT_API_SCOPES = [", "] as const"),
      ),
    ],
  ]);
  for (const [name, scopes] of runtimeAllowlists) {
    // Local login profiles do not request policy editing; the server and API still support it.
    const expected = name.startsWith("local-auth")
      ? EXPECTED_SCOPE_NAMES.filter((scope) => scope !== "policy:write")
      : EXPECTED_SCOPE_NAMES;
    assert.deepEqual([...scopes].sort(), [...expected].sort(), `${name} scope drift`);
  }

  const persistedAllowlists = [
    ["Drizzle schema", databaseSchema],
    ...migrations.map((source, index) => [`migration ${scopeMigrationPaths[index]}`, source]),
  ];
  for (const [name, source] of persistedAllowlists) {
    const allowlists = jsonbScopeAllowlists(source);
    assert.ok(allowlists.length > 0, `${name} must contain a persisted scope allowlist`);
    for (const scopes of allowlists) {
      assert.deepEqual(
        [...scopes].sort(),
        [...EXPECTED_SCOPE_NAMES].sort(),
        `${name} persisted scope drift`,
      );
    }
  }
});

test("read and plan login profiles cannot acquire write scopes by catalog insertion", async () => {
  const { getDmfasterAgentScopes } = await import("../packages/local-auth/src/constants.ts");
  for (const profile of ["read", "plan"])
    assert.ok(
      getDmfasterAgentScopes(profile).every((scope) => scope.endsWith(":read")),
      profile,
    );
  assert.deepEqual(
    getDmfasterAgentScopes("draft").filter((scope) => !scope.endsWith(":read")),
    ["campaigns:write"],
  );
});
