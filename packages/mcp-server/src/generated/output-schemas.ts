// Generated from packages/public-api/openapi.yaml. Run npm run generate:agent-api.
import type { z } from "zod";
import type { AgentToolName } from "@dmfaster/sdk";
import { lazyOutputSchema } from "../output-schema.ts";
const definitions: Record<string, z.core.JSONSchema.JSONSchema> = {
  AnalyticsSummaryResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "analytics.summary",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AnalyticsSummaryOutput",
              },
              {
                $ref: "#/$defs/SalesRangeAnalytics",
              },
              {
                type: "null",
              },
              {
                $ref: "#/$defs/SalesAnalyticsV2",
              },
            ],
          },
        },
      },
    ],
  },
  AgentToolResultBase: {
    type: "object",
    additionalProperties: false,
    required: [
      "version",
      "tool",
      "policy",
      "ok",
      "generatedAt",
      "durationMs",
      "evidence",
      "consistency",
      "data",
      "artifacts",
      "error",
    ],
    properties: {
      version: {
        type: "integer",
        const: 1,
      },
      tool: {
        $ref: "#/$defs/AgentToolName",
      },
      policy: {
        $ref: "#/$defs/AgentToolPolicy",
      },
      ok: {
        type: "boolean",
      },
      generatedAt: {
        type: "string",
        format: "date-time",
      },
      serverTime: {
        type: "string",
        format: "date-time",
      },
      durationMs: {
        type: "integer",
        minimum: 0,
        maximum: 120000,
      },
      evidence: {
        type: "array",
        items: {
          $ref: "#/$defs/AgentToolEvidence",
        },
      },
      consistency: {
        $ref: "#/$defs/AgentToolConsistency",
      },
      data: {},
      artifacts: {
        type: "array",
        items: {},
      },
      error: {
        oneOf: [
          {
            $ref: "#/$defs/AgentToolError",
          },
          {
            type: "null",
          },
        ],
      },
      requestId: {
        type: "string",
      },
      serverVersion: {
        type: "string",
      },
      build: {
        type: "string",
      },
      serverTimingMs: {
        type: "object",
        additionalProperties: {
          type: "number",
        },
      },
      executionReceipt: {
        type: "object",
        additionalProperties: false,
        description:
          "Durable tool completion, not provider delivery. Resolve with agent_run_inspect using agentRunId, afterSeq callSeq-1 and limit 1.",
        required: ["receiptId", "agentRunId", "callSeq", "kind"],
        properties: {
          receiptId: {
            type: "string",
          },
          agentRunId: {
            type: "string",
          },
          callSeq: {
            type: "integer",
            minimum: 1,
          },
          kind: {
            const: "tool_execution",
          },
        },
      },
      contractVersion: {
        type: "string",
        const: "2.9.0",
      },
      rateLimit: {
        oneOf: [
          {
            $ref: "#/$defs/AgentRateLimitEnvelope",
          },
          {
            type: "null",
          },
        ],
        description:
          "Current authenticated credential/workspace quota, negotiated by X-DMFaster-Rate-Limit: 1. Null before authentication or when authoritative quota is unavailable.",
      },
    },
  },
  AgentToolName: {
    type: "string",
    enum: [
      "analytics.summary",
      "workspace.briefing",
      "campaigns.list",
      "campaign.inspect",
      "campaign.copy.inspect",
      "sending.inspect",
      "replies.list",
      "conversations.list",
      "conversation.inspect",
      "conversation.update",
      "conversation.reply",
      "conversation.reply.inspect",
      "campaign.messages.draft.list",
      "campaign.messages.draft.update",
      "campaign.messages.list",
      "campaign.messages.update",
      "campaign.followups.list",
      "campaign.followups.cancel",
      "campaign.outcomes.list",
      "sending.test.prepare",
      "sending.test.send",
      "sending.test.inspect",
      "senders.inspect",
      "history.list",
      "pipeline.inspect",
      "pipeline.cards.list",
      "pipeline.stage.update",
      "pipeline.note.list",
      "pipeline.note.add",
      "company.timeline",
      "industry.lookup",
      "campaign.validate",
      "audience.preview",
      "lists.list",
      "list.inspect",
      "list.target.remove",
      "campaign.draft.prepare",
      "campaign.draft.update",
      "list.import",
      "leads.add",
      "list.prepare",
      "campaign.prepare",
      "campaign.launch.preflight",
      "campaign.launch",
      "campaign.pause.preflight",
      "campaign.pause",
      "companies.filters",
      "companies.suggest",
      "prospect.query",
      "companies.search",
      "companies.evidence.search",
      "companies.knowledge.search",
      "companies.knowledge",
      "companies.evidence.start",
      "companies.evidence.advance",
      "companies.evidence.status",
      "companies.evidence.results",
      "companies.evidence.cancel",
      "company.inspect",
      "companies.fit.start",
      "companies.fit.advance",
      "companies.fit.results",
      "companies.fit.proposal",
      "companies.list.prepare",
      "companies.list.inspect",
      "companies.list.refine",
      "campaign.operation.inspect",
      "campaign.delivery.inspect",
      "campaign.delivery.update",
      "sending.instagram.pacing.inspect",
      "sending.instagram.pacing.update",
      "companies.fit.status",
      "companies.fit.cancel",
      "companies.fit.runs.list",
      "companies.fit.run",
      "companies.fit.cohort",
      "campaign.variation.performance",
      "copy.performance",
      "calendar.status",
      "calendar.availability",
      "calendar.meeting.book",
      "calls.list",
      "call.inspect",
      "instagram.extract.quote",
      "instagram.extract.start",
      "instagram.extract.inspect",
      "instagram.extract.results",
      "instagram.purchases.list",
      "instagram.purchases.inspect",
      "instagram.purchases.results",
      "leads.status",
      "leads.extract.quote",
      "leads.extract.start",
      "leads.extract.inspect",
      "leads.extract.refresh",
      "leads.extract.continue",
      "leads.enrich.preview",
      "leads.enrich.start",
      "leads.enrich.inspect",
      "leads.prospect.quote",
      "leads.prospect.start",
      "leads.prospect.inspect",
      "leads.prospect.results",
      "leads.prospect.advance",
      "leads.prospect.cancel",
      "events.list",
      "conversations.changes",
      "suppressions.list",
      "suppressions.add",
      "suppressions.remove",
      "workspace.sandbox.create",
      "sandbox.seed",
      "sandbox.inbound.simulate",
      "sandbox.clock.advance",
      "call.outcome.set",
      "meeting.link",
      "meeting.unlink",
      "webhooks.create",
      "webhooks.list",
      "webhooks.update",
      "webhooks.delete",
      "webhooks.test",
      "webhooks.replay",
      "meetings.unlinked.list",
      "pipeline.reconcile",
      "workspace.agent_sales.get",
      "workspace.agent_sales.update",
      "sandbox.provider.update",
      "reply.templates.list",
      "reply.templates.create",
      "reply.templates.update",
      "reply.templates.delete",
      "reply.policy.get",
      "reply.policy.update",
      "reply.approvals.list",
      "conversation.draft.save",
      "conversation.followup.set",
      "conversation.followup.clear",
      "followups.due",
      "conversations.bulk.update",
      "pipeline.board",
      "calendar.booking.link.create",
      "calendar.meeting.reschedule",
      "calendar.meeting.cancel",
      "campaign.followups.configure",
      "campaign.variants.configure",
      "recorder.settings.get",
      "recorder.settings.update",
      "recorder.bots.list",
      "call.transcript.get",
      "call.recording.get",
      "call.transcripts.get",
      "call.transcripts.search",
      "readiness.check",
      "sender.retire",
      "sender.unretire",
      "attribution.check",
      "campaign.reengagement.prepare",
      "agents.list",
      "agent.inspect",
      "agent.create.request",
      "agent.pause",
      "agent.resume",
      "agent.credential.rotate",
      "event_consumers.list",
      "event_consumers.create",
      "events.ack",
      "events.snapshot",
      "webhook.deliveries.list",
      "webhooks.dlq.replay",
      "classification.feedback",
      "classification.quality",
      "classification.backfill.plan",
      "work_queue.list",
      "work_item.claim",
      "work_item.release",
      "work_item.snooze",
      "work_item.complete",
      "work_queue.config.get",
      "work_queue.config.update",
      "metrics.reconcile",
      "agent.heartbeat",
      "agent.run.start",
      "agent.run.end",
      "agent.runs.list",
      "agent.run.inspect",
      "workspace.halt",
      "workspace.resume",
      "channel.halt",
      "workspace.automation.inspect",
      "feedback.submit",
      "feedback.list",
      "entity.resolve",
      "entities.get",
      "people.upsert",
      "companies.upsert",
      "entity.merge",
      "entity.split",
      "budget.status",
      "call.stats.get",
      "call.coaching.get",
      "call.analytics.query",
      "call.insight.get",
      "call.access.list",
      "call.audit.list",
      "call.activity.get",
      "call.analysis.get",
      "call.outcome.confirm",
      "call.attendance.get",
      "call.insight.review",
      "recorder.event.override.get",
      "recorder.event.override.update",
      "call.bot.cancel",
      "call.bot.remove",
      "call.recording.stop",
      "recorder.status",
      "call.bot.join",
      "recorder.join.get",
      "call.participant.withdrawal.report",
      "call.delete",
      "copy.approval.request",
      "campaign.draft.plan",
      "campaign.draft.readiness",
      "prospecting.preview",
      "companies.lookalike",
      "commitments.propose",
      "commitments.list",
      "commitment.update",
      "commitment.confirm.batch",
      "commitment.reminder.draft",
      "list.merge",
      "list.rename",
      "list.archive",
      "campaign.draft.archive",
      "copy.approval.inspect",
      "copy.approval.cancel",
      "approval.cancel",
      "approvals.list",
    ],
  },
  AgentToolPolicy: {
    type: "object",
    additionalProperties: false,
    required: ["effect", "approval", "exposure"],
    properties: {
      effect: {
        type: "string",
        enum: ["read", "draft", "write", "external"],
      },
      approval: {
        type: "string",
        enum: ["none", "human_confirmation"],
      },
      exposure: {
        type: "string",
        const: "public_api",
      },
    },
  },
  AgentToolEvidence: {
    type: "object",
    additionalProperties: false,
    required: ["source", "observedAt", "scope"],
    properties: {
      source: {
        type: "string",
        enum: [
          "workspace_campaigns",
          "worker_control_plane",
          "campaign_diagnostics",
          "pipeline",
          "inbox",
          "company_database",
          "classification_catalog",
          "campaign_workflow",
          "analytics_snapshot",
        ],
      },
      observedAt: {
        type: "string",
        format: "date-time",
      },
      scope: {
        type: "string",
        enum: ["workspace", "campaign", "audience", "conversation"],
      },
    },
  },
  AgentToolConsistency: {
    type: "object",
    additionalProperties: false,
    required: ["status", "checks"],
    properties: {
      status: {
        type: "string",
        enum: ["verified", "unavailable", "conflict"],
      },
      checks: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
  },
  AgentToolError: {
    type: "object",
    additionalProperties: false,
    required: ["code", "message", "retryable"],
    properties: {
      errors: {
        type: "array",
        maxItems: 30,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["path", "code", "message"],
          properties: {
            path: {
              type: "string",
            },
            code: {
              type: "string",
            },
            message: {
              type: "string",
            },
            allowed: {
              type: "array",
              items: {
                type: "string",
              },
            },
            field: {
              type: "string",
              maxLength: 200,
            },
            expected: {
              type: "string",
              maxLength: 200,
            },
          },
        },
      },
      code: {
        type: "string",
        minLength: 1,
        maxLength: 100,
      },
      message: {
        type: "string",
        minLength: 1,
        maxLength: 500,
      },
      retryable: {
        type: "boolean",
      },
      nextAction: {
        type: "string",
        minLength: 1,
      },
      docsUrl: {
        type: "string",
        pattern: "^https://",
      },
      requiredScope: {
        type: "string",
        maxLength: 200,
      },
      reason: {
        type: "string",
        maxLength: 200,
      },
      setupUrl: {
        type: "string",
        maxLength: 2000,
      },
      requiredConnection: {
        type: "string",
        maxLength: 200,
      },
      retryAfterMs: {
        type: "integer",
        minimum: 0,
      },
      blockedUntil: {
        $ref: "#/$defs/ResourceVersion",
      },
      scope: {
        type: "string",
        enum: ["workspace", "channel", "agent"],
      },
      haltedBy: {
        type: "string",
        maxLength: 200,
      },
    },
  },
  ResourceVersion: {
    type: "string",
    description:
      "UTC resource version. Legacy PostgreSQL timestamps with an explicit offset remain accepted during the 2.x deprecation window.",
    pattern:
      "^\\d{4}-\\d{2}-\\d{2}[T ]\\d{2}:\\d{2}:\\d{2}(?:\\.\\d{1,6})?(?:Z|[+-]\\d{2}(?::?\\d{2})?)$",
    minLength: 20,
    maxLength: 32,
  },
  AgentRateLimitEnvelope: {
    type: "object",
    additionalProperties: false,
    required: ["limit", "remaining", "resetAt", "credential", "workspace"],
    properties: {
      limit: {
        type: "integer",
        minimum: 0,
      },
      remaining: {
        type: "integer",
        minimum: 0,
      },
      resetAt: {
        type: "string",
        format: "date-time",
      },
      credential: {
        $ref: "#/$defs/AgentRateLimitBucket",
      },
      workspace: {
        $ref: "#/$defs/AgentRateLimitBucket",
      },
    },
  },
  AgentRateLimitBucket: {
    type: "object",
    additionalProperties: false,
    required: ["limit", "remaining", "resetAt"],
    properties: {
      limit: {
        type: "integer",
        minimum: 0,
      },
      remaining: {
        type: "integer",
        minimum: 0,
      },
      resetAt: {
        type: "string",
        format: "date-time",
      },
    },
  },
  AnalyticsSummaryOutput: {
    type: "object",
    additionalProperties: false,
    required: [
      "version",
      "generatedAt",
      "asOf",
      "scope",
      "timezone",
      "window",
      "campaign",
      "counts",
      "rates",
      "formulas",
      "coverage",
      "sources",
      "snapshotId",
    ],
    properties: {
      version: {
        type: "integer",
        const: 1,
      },
      generatedAt: {
        type: "string",
        format: "date-time",
      },
      asOf: {
        type: "string",
        format: "date-time",
      },
      scope: {
        type: "string",
        enum: ["today", "last_24_hours", "campaign_to_date"],
      },
      timezone: {
        type: "string",
        minLength: 1,
      },
      window: {
        type: "object",
        additionalProperties: false,
        required: ["start", "end", "label"],
        properties: {
          start: {
            oneOf: [
              {
                type: "string",
                format: "date-time",
              },
              {
                type: "null",
              },
            ],
          },
          end: {
            type: "string",
            format: "date-time",
          },
          label: {
            type: "string",
            minLength: 1,
          },
        },
      },
      campaign: {
        oneOf: [
          {
            type: "object",
            additionalProperties: false,
            required: ["id", "name"],
            properties: {
              id: {
                type: "string",
                minLength: 1,
              },
              name: {
                type: "string",
                minLength: 1,
              },
            },
          },
          {
            type: "null",
          },
        ],
      },
      counts: {
        type: "object",
        additionalProperties: false,
        required: ["sent", "reachedCompanies", "replies", "replyingCompanies", "bookedCalls"],
        properties: {
          sent: {
            type: "integer",
            minimum: 0,
          },
          reachedCompanies: {
            type: "integer",
            minimum: 0,
          },
          replies: {
            type: "integer",
            minimum: 0,
          },
          replyingCompanies: {
            type: "integer",
            minimum: 0,
          },
          bookedCalls: {
            type: "integer",
            minimum: 0,
          },
        },
      },
      rates: {
        type: "object",
        additionalProperties: false,
        required: ["replyRateByCompanies", "replyRateByMessages"],
        properties: {
          replyRateByCompanies: {
            oneOf: [
              {
                type: "number",
                minimum: 0,
              },
              {
                type: "null",
              },
            ],
          },
          replyRateByMessages: {
            oneOf: [
              {
                type: "number",
                minimum: 0,
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
      formulas: {
        type: "object",
        additionalProperties: false,
        required: ["replyRateByCompanies", "replyRateByMessages"],
        properties: {
          replyRateByCompanies: {
            type: "string",
            minLength: 1,
          },
          replyRateByMessages: {
            type: "string",
            minLength: 1,
          },
        },
      },
      coverage: {
        type: "object",
        additionalProperties: false,
        required: ["sent", "reachedCompanies", "replies", "bookedCalls"],
        properties: {
          sent: {
            type: "string",
            enum: ["complete", "partial", "unavailable"],
          },
          reachedCompanies: {
            type: "string",
            enum: ["complete", "partial", "unavailable"],
          },
          replies: {
            type: "string",
            enum: ["complete", "partial", "unavailable"],
          },
          bookedCalls: {
            type: "string",
            enum: ["complete", "partial", "unavailable"],
          },
        },
      },
      sources: {
        type: "object",
        additionalProperties: false,
        required: ["sent", "reachedCompanies", "replies", "bookedCalls"],
        properties: {
          sent: {
            type: "string",
            minLength: 1,
          },
          reachedCompanies: {
            type: "string",
            minLength: 1,
          },
          replies: {
            type: "string",
            minLength: 1,
          },
          bookedCalls: {
            type: "string",
            minLength: 1,
          },
        },
      },
      snapshotId: {
        type: "string",
        minLength: 1,
      },
      canonicalMetrics: {
        $ref: "#/$defs/SalesMetrics",
      },
    },
  },
  SalesMetrics: {
    type: "object",
    additionalProperties: false,
    properties: {
      from: {
        $ref: "#/$defs/ResourceVersion",
      },
      to: {
        $ref: "#/$defs/ResourceVersion",
      },
      totals: {
        $ref: "#/$defs/SalesMetricCounts",
      },
      groups: {
        type: "array",
        items: {
          $ref: "#/$defs/SalesMetricCounts",
        },
      },
      groupBy: {
        type: "array",
        maxItems: 6,
        items: {
          type: "string",
          enum: ["day", "week", "channel", "campaign", "actor", "variant"],
        },
      },
      scope: {
        type: "object",
        additionalProperties: true,
      },
      definitions: {
        type: "object",
        additionalProperties: {
          type: "string",
        },
      },
      medianFirstResponseMinutes: {
        oneOf: [
          {
            type: "number",
          },
          {
            type: "null",
          },
        ],
      },
    },
  },
  SalesMetricCounts: {
    type: "object",
    additionalProperties: false,
    properties: {
      sent: {
        type: "integer",
      },
      reachedCompanies: {
        type: "integer",
      },
      humanReplies: {
        type: "integer",
      },
      positiveReplies: {
        type: "integer",
      },
      meetingsBooked: {
        type: "integer",
      },
      meetingsHeld: {
        type: "integer",
      },
      noShows: {
        type: "integer",
      },
      won: {
        type: "integer",
      },
      lost: {
        type: "integer",
      },
      dimensions: {
        oneOf: [
          {
            type: "object",
            additionalProperties: true,
          },
          {
            type: "null",
          },
        ],
      },
    },
  },
  SalesRangeAnalytics: {
    type: "object",
    additionalProperties: false,
    properties: {
      from: {
        $ref: "#/$defs/ResourceVersion",
      },
      to: {
        $ref: "#/$defs/ResourceVersion",
      },
      totals: {
        $ref: "#/$defs/SalesMetricCounts",
      },
      groups: {
        type: "array",
        items: {
          $ref: "#/$defs/SalesMetricCounts",
        },
      },
      groupBy: {
        type: "array",
        maxItems: 6,
        items: {
          type: "string",
          enum: ["day", "week", "channel", "campaign", "actor", "variant"],
        },
      },
      scope: {
        type: "string",
        const: "range",
      },
      definitions: {
        type: "object",
        additionalProperties: {
          type: "string",
        },
      },
      medianFirstResponseMinutes: {
        oneOf: [
          {
            type: "number",
          },
          {
            type: "null",
          },
        ],
      },
      generatedAt: {
        $ref: "#/$defs/ResourceVersion",
      },
      asOf: {
        $ref: "#/$defs/ResourceVersion",
      },
      canonicalMetrics: {
        $ref: "#/$defs/SalesMetrics",
      },
    },
  },
  SalesAnalyticsV2: {
    type: "object",
    additionalProperties: false,
    required: [
      "metricsVersion",
      "metricIds",
      "totals",
      "groups",
      "from",
      "to",
      "timezone",
      "unknown",
    ],
    properties: {
      metricsVersion: {
        type: "string",
        const: "3.0.0",
      },
      metricIds: {
        type: "object",
        additionalProperties: {
          type: "string",
        },
      },
      totals: {
        $ref: "#/$defs/SalesMetricCountsV2",
      },
      groups: {
        type: "array",
        items: {
          $ref: "#/$defs/SalesMetricCountsV2",
        },
      },
      groupBy: {
        type: "array",
        maxItems: 6,
        items: {
          type: "string",
          enum: ["day", "week", "channel", "campaign", "actor", "variant"],
        },
      },
      from: {
        $ref: "#/$defs/ResourceVersion",
      },
      to: {
        $ref: "#/$defs/ResourceVersion",
      },
      timezone: {
        type: "string",
        maxLength: 500,
      },
      scope: {
        type: "string",
        enum: ["today", "last_24_hours", "campaign_to_date", "range"],
      },
      unknown: {
        type: "object",
        additionalProperties: false,
        required: ["unanchoredMeetings", "unlinkedMeetings"],
        properties: {
          unanchoredMeetings: {
            type: "integer",
            minimum: 0,
          },
          unlinkedMeetings: {
            type: "integer",
            minimum: 0,
          },
          sendsWithoutCompany: {
            type: "integer",
            minimum: 0,
          },
          repliesWithoutCompany: {
            type: "integer",
            minimum: 0,
          },
          meetingsWithoutCompany: {
            type: "integer",
            minimum: 0,
          },
        },
      },
      definitions: {
        type: "object",
        additionalProperties: {
          type: "string",
        },
      },
      identityCoverage: {
        type: "string",
        maxLength: 500,
      },
      timeSemantics: {
        type: "string",
        maxLength: 500,
      },
      generatedAt: {
        $ref: "#/$defs/ResourceVersion",
      },
      asOf: {
        $ref: "#/$defs/ResourceVersion",
      },
      campaign: {
        oneOf: [
          {
            type: "object",
            additionalProperties: false,
            required: ["id", "name"],
            properties: {
              id: {
                type: "string",
                maxLength: 500,
              },
              name: {
                type: "string",
                maxLength: 500,
              },
            },
          },
          {
            type: "null",
          },
        ],
      },
      canonicalMetrics: {
        $ref: "#/$defs/SalesMetricsV2",
      },
      legacy: {
        $ref: "#/$defs/SalesMetrics",
      },
      medianFirstResponseMinutes: {
        oneOf: [
          {
            type: "number",
          },
          {
            type: "null",
          },
        ],
      },
    },
  },
  SalesMetricCountsV2: {
    type: "object",
    additionalProperties: false,
    properties: {
      sent: {
        type: "integer",
      },
      reachedCompanies: {
        type: "integer",
      },
      humanReplies: {
        type: "integer",
      },
      positiveReplies: {
        type: "integer",
      },
      meetingsBooked: {
        type: "integer",
      },
      meetingsHeld: {
        type: "integer",
      },
      noShows: {
        type: "integer",
      },
      won: {
        type: "integer",
      },
      lost: {
        type: "integer",
      },
      dimensions: {
        oneOf: [
          {
            type: "object",
            additionalProperties: true,
          },
          {
            type: "null",
          },
        ],
      },
      contactedPeople: {
        type: "integer",
        minimum: 0,
      },
      replyingCompanies: {
        type: "integer",
        minimum: 0,
      },
      positiveCompanies: {
        type: "integer",
        minimum: 0,
      },
      meetingsScheduled: {
        type: "integer",
        minimum: 0,
      },
      peopleBooked: {
        type: "integer",
        minimum: 0,
      },
      companiesBooked: {
        type: "integer",
        minimum: 0,
      },
      peopleHeld: {
        type: "integer",
        minimum: 0,
      },
      companiesHeld: {
        type: "integer",
        minimum: 0,
      },
      peopleNoShow: {
        type: "integer",
        minimum: 0,
      },
      companiesNoShow: {
        type: "integer",
        minimum: 0,
      },
      peopleWon: {
        type: "integer",
        minimum: 0,
      },
      companiesWon: {
        type: "integer",
        minimum: 0,
      },
      peopleLost: {
        type: "integer",
        minimum: 0,
      },
      companiesLost: {
        type: "integer",
        minimum: 0,
      },
      peopleOptedOut: {
        type: "integer",
        minimum: 0,
      },
      companiesOptedOut: {
        type: "integer",
        minimum: 0,
      },
      peopleNotInterested: {
        type: "integer",
        minimum: 0,
      },
      companiesNotInterested: {
        type: "integer",
        minimum: 0,
      },
    },
  },
  SalesMetricsV2: {
    type: "object",
    additionalProperties: false,
    required: [
      "metricsVersion",
      "metricIds",
      "totals",
      "groups",
      "from",
      "to",
      "timezone",
      "unknown",
    ],
    properties: {
      metricsVersion: {
        type: "string",
        const: "3.0.0",
      },
      metricIds: {
        type: "object",
        additionalProperties: {
          type: "string",
        },
      },
      totals: {
        $ref: "#/$defs/SalesMetricCountsV2",
      },
      groups: {
        type: "array",
        items: {
          $ref: "#/$defs/SalesMetricCountsV2",
        },
      },
      groupBy: {
        type: "array",
        maxItems: 6,
        items: {
          type: "string",
          enum: ["day", "week", "channel", "campaign", "actor", "variant"],
        },
      },
      from: {
        $ref: "#/$defs/ResourceVersion",
      },
      to: {
        $ref: "#/$defs/ResourceVersion",
      },
      timezone: {
        type: "string",
        maxLength: 500,
      },
      scope: {
        type: "object",
        additionalProperties: true,
      },
      unknown: {
        type: "object",
        additionalProperties: false,
        required: ["unanchoredMeetings", "unlinkedMeetings"],
        properties: {
          unanchoredMeetings: {
            type: "integer",
            minimum: 0,
          },
          unlinkedMeetings: {
            type: "integer",
            minimum: 0,
          },
          sendsWithoutCompany: {
            type: "integer",
            minimum: 0,
          },
          repliesWithoutCompany: {
            type: "integer",
            minimum: 0,
          },
          meetingsWithoutCompany: {
            type: "integer",
            minimum: 0,
          },
        },
      },
      definitions: {
        type: "object",
        additionalProperties: {
          type: "string",
        },
      },
      identityCoverage: {
        type: "string",
        maxLength: 500,
      },
      timeSemantics: {
        type: "string",
        maxLength: 500,
      },
      medianFirstResponseMinutes: {
        oneOf: [
          {
            type: "number",
          },
          {
            type: "null",
          },
        ],
      },
    },
  },
  WorkspaceBriefingResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "workspace.briefing",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/WorkspaceBriefingOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  WorkspaceBriefingOutput: {
    type: "object",
    additionalProperties: false,
    required: [
      "generatedAt",
      "selectedCampaignId",
      "campaignCounts",
      "totals",
      "sending",
      "focusCampaign",
    ],
    properties: {
      generatedAt: {
        type: "string",
        format: "date-time",
      },
      selectedCampaignId: {
        type: "string",
      },
      campaignCounts: {
        $ref: "#/$defs/CampaignCounts",
      },
      totals: {
        type: "object",
        additionalProperties: false,
        required: ["campaigns", "targetLists", "sent"],
        properties: {
          campaigns: {
            type: "integer",
            minimum: 0,
          },
          targetLists: {
            type: "integer",
            minimum: 0,
          },
          sent: {
            type: "integer",
            minimum: 0,
          },
        },
      },
      sending: {
        $ref: "#/$defs/SendingSummary",
      },
      focusCampaign: {
        oneOf: [
          {
            $ref: "#/$defs/CampaignSummary",
          },
          {
            type: "null",
          },
        ],
      },
      workQueue: {
        type: "object",
        additionalProperties: false,
        required: ["byType", "top", "oldestBreachedAt"],
        properties: {
          byType: {
            type: "object",
            additionalProperties: {
              type: "integer",
            },
          },
          top: {
            type: "array",
            maxItems: 5,
            items: {
              $ref: "#/$defs/AgentWorkItem",
            },
          },
          oldestBreachedAt: {
            oneOf: [
              {
                type: "string",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
      metrics: {
        $ref: "#/$defs/SalesMetricsV2",
      },
      metricsAsOf: {
        type: "string",
        format: "date-time",
      },
      metricsVersion: {
        type: "string",
        maxLength: 500,
      },
      definitions: {
        type: "object",
        additionalProperties: {
          type: "string",
        },
      },
      metricIds: {
        type: "object",
        additionalProperties: {
          type: "string",
        },
      },
      legacy: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
  CampaignCounts: {
    type: "object",
    additionalProperties: false,
    required: ["Draft", "Queued", "Running", "Paused", "Cooldown", "Completed"],
    properties: {
      Draft: {
        type: "integer",
        minimum: 0,
      },
      Queued: {
        type: "integer",
        minimum: 0,
      },
      Running: {
        type: "integer",
        minimum: 0,
      },
      Paused: {
        type: "integer",
        minimum: 0,
      },
      Cooldown: {
        type: "integer",
        minimum: 0,
      },
      Completed: {
        type: "integer",
        minimum: 0,
      },
    },
  },
  SendingSummary: {
    type: "object",
    additionalProperties: false,
    required: [
      "activeWorkers",
      "offlineWorkers",
      "queuedJobs",
      "runningJobs",
      "completedToday",
      "queueState",
      "lastWorkerSeenAt",
    ],
    properties: {
      activeWorkers: {
        type: "integer",
        minimum: 0,
      },
      offlineWorkers: {
        type: "integer",
        minimum: 0,
      },
      queuedJobs: {
        type: "integer",
        minimum: 0,
      },
      runningJobs: {
        type: "integer",
        minimum: 0,
      },
      completedToday: {
        type: "integer",
        minimum: 0,
      },
      queueState: {
        type: "string",
        enum: ["idle", "queued", "running", "waiting_for_browser"],
      },
      lastWorkerSeenAt: {
        type: "string",
        description: "ISO 8601 timestamp, or an empty string when no worker has been observed.",
      },
    },
  },
  CampaignSummary: {
    type: "object",
    additionalProperties: false,
    required: [
      "id",
      "name",
      "status",
      "channels",
      "targetCount",
      "sentCount",
      "dailyCap",
      "updatedAt",
    ],
    properties: {
      id: {
        type: "string",
      },
      name: {
        type: "string",
      },
      status: {
        $ref: "#/$defs/CampaignStatus",
      },
      channels: {
        type: "array",
        items: {
          $ref: "#/$defs/TargetChannel",
        },
      },
      targetCount: {
        type: "integer",
        minimum: 0,
      },
      sentCount: {
        type: "integer",
        minimum: 0,
      },
      processingOutcome: {
        description:
          "Processing outcome independent of control status; failures are not confirmed deliveries or permission to retry.",
        type: ["string", "null"],
        enum: ["finished_with_failures", null],
      },
      skippedCount: {
        type: "integer",
        minimum: 0,
      },
      failedCount: {
        type: "integer",
        minimum: 0,
      },
      dailyCap: {
        type: "integer",
        minimum: 0,
      },
      updatedAt: {
        type: "string",
        format: "date-time",
      },
    },
  },
  CampaignStatus: {
    type: "string",
    enum: ["Draft", "Queued", "Running", "Paused", "Cooldown", "Completed"],
  },
  TargetChannel: {
    type: "string",
    enum: ["instagram", "facebook", "linkedin", "gmail", "sms"],
  },
  AgentWorkItem: {
    type: "object",
    additionalProperties: false,
    properties: {
      ageBusinessHours: {
        type: "integer",
        minimum: 0,
      },
      id: {
        type: "string",
        maxLength: 200,
      },
      type: {
        type: "string",
        maxLength: 200,
      },
      priority: {
        type: "integer",
        minimum: 0,
      },
      priorityReasons: {
        type: "array",
        items: {
          type: "string",
          maxLength: 200,
        },
      },
      subject: {
        type: "object",
        additionalProperties: true,
      },
      blockedBy: {
        type: "array",
        items: {
          type: "string",
          maxLength: 200,
        },
      },
      claim: {
        oneOf: [
          {
            type: "object",
            additionalProperties: false,
            properties: {
              actorId: {
                type: "string",
                maxLength: 200,
              },
              until: {
                type: "string",
                maxLength: 200,
              },
            },
            required: ["actorId", "until"],
          },
          {
            type: "null",
          },
        ],
      },
      version: {
        type: "string",
        maxLength: 200,
      },
      dueAt: {
        type: "string",
        maxLength: 200,
      },
      slaState: {
        type: "string",
        maxLength: 200,
      },
      campaignId: {
        oneOf: [
          {
            type: "string",
            maxLength: 200,
          },
          {
            type: "null",
          },
        ],
      },
      person: {
        type: "object",
        additionalProperties: true,
      },
      company: {
        oneOf: [
          {
            type: "object",
            additionalProperties: true,
          },
          {
            type: "null",
          },
        ],
      },
      lastInbound: {
        oneOf: [
          {
            type: "object",
            additionalProperties: true,
          },
          {
            type: "null",
          },
        ],
      },
      recommendedAction: {
        type: "object",
        additionalProperties: true,
      },
      siblings: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: {
              $ref: "#/$defs/ResourceId",
            },
            channel: {
              type: "string",
            },
            status: {
              type: "string",
            },
            lastMessageAt: {
              oneOf: [
                {
                  type: "string",
                },
                {
                  type: "null",
                },
              ],
            },
            intent: {
              type: "string",
            },
          },
          required: ["id", "channel", "status", "lastMessageAt", "intent"],
        },
        maxItems: 100,
      },
    },
    required: [
      "id",
      "type",
      "priority",
      "priorityReasons",
      "subject",
      "blockedBy",
      "claim",
      "version",
    ],
  },
  ResourceId: {
    description:
      "A resource identifier returned by DM Faster. Never guess an identifier from a name.",
    "x-dmfaster-trim": true,
    type: "string",
    minLength: 1,
    maxLength: 160,
    pattern: ".*\\S.*",
  },
  CampaignsListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "campaigns.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CampaignsListOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CampaignsListOutput: {
    type: "object",
    additionalProperties: false,
    required: ["generatedAt", "campaigns", "totalCount", "hasMore", "nextCursor"],
    properties: {
      generatedAt: {
        type: "string",
        format: "date-time",
      },
      campaigns: {
        type: "array",
        maxItems: 25,
        items: {
          $ref: "#/$defs/CampaignSummary",
        },
      },
      totalCount: {
        type: "integer",
        minimum: 0,
        description:
          "Exact number of campaigns matching the supplied filters at this page's collection revision.",
      },
      hasMore: {
        type: "boolean",
      },
      nextCursor: {
        oneOf: [
          {
            type: "string",
            minLength: 1,
            maxLength: 500,
          },
          {
            type: "null",
          },
        ],
      },
    },
  },
  CampaignInspectResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "campaign.inspect",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CampaignInspectOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CampaignInspectOutput: {
    type: "object",
    additionalProperties: false,
    required: ["generatedAt", "campaign", "execution", "pipeline", "rates"],
    properties: {
      generatedAt: {
        type: "string",
        format: "date-time",
      },
      campaign: {
        $ref: "#/$defs/CampaignSummary",
      },
      execution: {
        type: "object",
        additionalProperties: false,
        required: [
          "queued",
          "running",
          "completed",
          "companiesPlanned",
          "companiesReached",
          "byChannel",
        ],
        properties: {
          queued: {
            type: "integer",
            minimum: 0,
          },
          running: {
            type: "integer",
            minimum: 0,
          },
          completed: {
            type: "integer",
            minimum: 0,
          },
          companiesPlanned: {
            type: "integer",
            minimum: 0,
          },
          companiesReached: {
            type: "integer",
            minimum: 0,
          },
          byChannel: {
            type: "object",
            additionalProperties: false,
            required: ["instagram", "facebook", "linkedin", "gmail", "sms"],
            properties: {
              instagram: {
                type: "integer",
                minimum: 0,
              },
              facebook: {
                type: "integer",
                minimum: 0,
              },
              linkedin: {
                type: "integer",
                minimum: 0,
              },
              gmail: {
                type: "integer",
                minimum: 0,
              },
              sms: {
                type: "integer",
                minimum: 0,
              },
            },
          },
        },
      },
      pipeline: {
        $ref: "#/$defs/PipelineCounts",
      },
      rates: {
        type: "object",
        additionalProperties: false,
        required: ["replyOrFurtherPercent", "bookedCallPercent"],
        properties: {
          replyOrFurtherPercent: {
            oneOf: [
              {
                type: "number",
                minimum: 0,
                maximum: 100,
              },
              {
                type: "null",
              },
            ],
          },
          bookedCallPercent: {
            oneOf: [
              {
                type: "number",
                minimum: 0,
                maximum: 100,
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
      settings: {
        type: "object",
        additionalProperties: false,
        properties: {
          targetListId: {
            type: "string",
          },
          messageVariants: {
            type: "array",
            items: {
              type: "string",
            },
          },
          pacingSeconds: {
            type: "integer",
          },
          onlyNewChats: {
            type: "boolean",
          },
          skipPreviouslyMessaged: {
            type: "boolean",
          },
          enabled: {
            type: "boolean",
          },
          instagramSendingWindowEnabled: {
            type: "boolean",
          },
          instagramSendingWindowStartMinute: {
            type: "integer",
            minimum: 0,
            maximum: 1380,
          },
          instagramSendingWindowEndMinute: {
            type: "integer",
            minimum: 60,
            maximum: 1440,
          },
          instagramSendingWindowWeekdays: {
            type: "integer",
            minimum: 1,
            maximum: 127,
          },
          timezone: {
            type: "string",
          },
        },
        required: [
          "targetListId",
          "messageVariants",
          "pacingSeconds",
          "onlyNewChats",
          "skipPreviouslyMessaged",
          "enabled",
          "instagramSendingWindowEnabled",
          "instagramSendingWindowStartMinute",
          "instagramSendingWindowEndMinute",
          "instagramSendingWindowWeekdays",
          "timezone",
        ],
      },
      canonicalMetrics: {
        $ref: "#/$defs/SalesMetrics",
      },
      metrics: {
        $ref: "#/$defs/SalesMetricsV2",
      },
      metricsAsOf: {
        type: "string",
        format: "date-time",
      },
      metricsVersion: {
        type: "string",
        maxLength: 500,
      },
      definitions: {
        type: "object",
        additionalProperties: {
          type: "string",
        },
      },
      metricIds: {
        type: "object",
        additionalProperties: {
          type: "string",
        },
      },
      legacy: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
  PipelineCounts: {
    type: "object",
    additionalProperties: false,
    required: ["contacted", "replied", "call_booked", "closed"],
    properties: {
      contacted: {
        type: "integer",
        minimum: 0,
      },
      replied: {
        type: "integer",
        minimum: 0,
      },
      call_booked: {
        type: "integer",
        minimum: 0,
      },
      closed: {
        type: "integer",
        minimum: 0,
      },
      meeting_held: {
        type: "integer",
        minimum: 0,
      },
      no_show: {
        type: "integer",
        minimum: 0,
      },
      won: {
        type: "integer",
        minimum: 0,
      },
      lost: {
        type: "integer",
        minimum: 0,
      },
      closed_unknown: {
        type: "integer",
        minimum: 0,
      },
    },
  },
  CampaignCopyInspectResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "campaign.copy.inspect",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CampaignCopyInspectOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CampaignCopyInspectOutput: {
    type: "object",
    additionalProperties: false,
    required: [
      "campaignId",
      "campaignUpdatedAt",
      "name",
      "status",
      "channels",
      "messageVariants",
      "linkedinInviteMode",
      "linkedinInviteNote",
      "followUpSequence",
      "linkedinFollowUpSequence",
      "linkedinAcceptedMessage",
    ],
    properties: {
      campaignId: {
        $ref: "#/$defs/ResourceId",
      },
      campaignUpdatedAt: {
        $ref: "#/$defs/ResourceVersion",
      },
      name: {
        type: "string",
      },
      status: {
        $ref: "#/$defs/CampaignStatus",
      },
      channels: {
        type: "array",
        items: {
          $ref: "#/$defs/TargetChannel",
        },
      },
      messageVariants: {
        description:
          "Saved Instagram/Facebook opening copy. This is not the LinkedIn accepted message.",
        type: "array",
        items: {
          type: "string",
        },
      },
      linkedinInviteMode: {
        type: "string",
        enum: ["invite_only", "invite_with_note"],
      },
      linkedinInviteNote: {
        type: "string",
      },
      followUpSequence: {
        oneOf: [
          {
            $ref: "#/$defs/CampaignFollowUpSequenceOutput",
          },
          {
            type: "null",
          },
        ],
      },
      linkedinFollowUpSequence: {
        oneOf: [
          {
            $ref: "#/$defs/CampaignFollowUpSequenceOutput",
          },
          {
            type: "null",
          },
        ],
      },
      linkedinAcceptedMessage: {
        type: "object",
        additionalProperties: false,
        required: ["configured", "sequenceSource", "messageVariants"],
        properties: {
          configured: {
            type: "boolean",
          },
          sequenceSource: {
            type: "string",
            enum: ["none", "followUpSequence", "linkedinFollowUpSequence"],
          },
          messageVariants: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        description:
          "Step 1 is queued when acceptance is observed or when the prospect is already connected, subject to sending controls and recorded cross-channel human reply suppression. A required delayDays on step 1 does not delay this accepted message.",
      },
    },
  },
  CampaignFollowUpSequenceOutput: {
    type: "object",
    additionalProperties: false,
    required: ["enabled", "steps"],
    properties: {
      enabled: {
        type: "boolean",
      },
      steps: {
        type: "array",
        maxItems: 3,
        items: {
          $ref: "#/$defs/CampaignFollowUpStepOutput",
        },
      },
    },
  },
  CampaignFollowUpStepOutput: {
    type: "object",
    additionalProperties: false,
    required: ["stepIndex", "delayDays", "channel", "fallbackChannel", "subject", "variants"],
    properties: {
      stepIndex: {
        type: "integer",
        minimum: 1,
        maximum: 3,
      },
      delayDays: {
        type: "integer",
        minimum: 1,
        maximum: 30,
      },
      channel: {
        type: "string",
        enum: ["inherit", "instagram", "facebook", "linkedin", "gmail"],
      },
      fallbackChannel: {
        type: "string",
        enum: ["none", "instagram", "facebook", "linkedin", "gmail"],
      },
      subject: {
        type: "string",
      },
      variants: {
        type: "array",
        minItems: 1,
        maxItems: 4,
        items: {
          type: "string",
        },
      },
    },
  },
  SendingInspectResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "sending.inspect",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/SendingInspectOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  SendingInspectOutput: {
    type: "object",
    additionalProperties: false,
    required: [
      "generatedAt",
      "campaignId",
      "campaignName",
      "status",
      "summary",
      "issues",
      "sending",
    ],
    properties: {
      generatedAt: {
        type: "string",
        format: "date-time",
      },
      campaignId: {
        type: "string",
      },
      campaignName: {
        type: "string",
      },
      campaignStatus: {
        oneOf: [
          {
            $ref: "#/$defs/CampaignStatus",
          },
          {
            type: "null",
          },
        ],
      },
      status: {
        type: "string",
        enum: ["healthy", "waiting", "attention", "blocked", "idle"],
      },
      summary: {
        type: "string",
      },
      issues: {
        type: "array",
        items: {
          $ref: "#/$defs/SendingIssue",
        },
      },
      sending: {
        description: "Workspace-wide counters; do not attribute these to campaignId.",
        $ref: "#/$defs/SendingSummary",
      },
      campaignSending: {
        description:
          "Campaign-only execution counts, or null when unavailable. Excludes passive reply checks and tracking jobs.",
        oneOf: [
          {
            type: "object",
            additionalProperties: false,
            required: ["queuedJobs", "runningJobs"],
            properties: {
              queuedJobs: {
                type: "integer",
                minimum: 0,
              },
              runningJobs: {
                type: "integer",
                minimum: 0,
              },
            },
          },
          {
            type: "null",
          },
        ],
      },
      observation: {
        description:
          "Per-channel eligibility clocks and constraints. Deadlines are earliest possible attempts, never promises of provider delivery. Lower bounds may be followed by company work or other unresolved constraints.",
        oneOf: [
          {
            $ref: "#/$defs/CampaignSendingObservation",
          },
          {
            type: "null",
          },
        ],
      },
      assessment: {
        type: "object",
        additionalProperties: false,
        required: ["scope", "reason", "nextAction"],
        properties: {
          scope: {
            type: "string",
            enum: ["campaign", "workspace"],
          },
          reason: {
            type: "string",
          },
          nextAction: {
            type: "string",
          },
        },
      },
      willSend: {
        type: "boolean",
      },
      blockedBy: {
        type: "string",
      },
    },
  },
  SendingIssue: {
    type: "object",
    additionalProperties: false,
    required: ["code", "severity", "message"],
    properties: {
      code: {
        type: "string",
      },
      severity: {
        type: "string",
        enum: ["info", "warning", "blocker"],
      },
      message: {
        type: "string",
      },
    },
  },
  CampaignSendingObservation: {
    type: "object",
    additionalProperties: false,
    required: [
      "observedAt",
      "runId",
      "evidenceComplete",
      "nextEligibleAt",
      "remainingSeconds",
      "channels",
      "browsers",
    ],
    properties: {
      observedAt: {
        type: "string",
        format: "date-time",
      },
      runId: {
        type: "string",
      },
      evidenceComplete: {
        type: "boolean",
      },
      nextEligibleAt: {
        $ref: "#/$defs/SendingTime",
      },
      remainingSeconds: {
        type: ["integer", "null"],
        minimum: 0,
      },
      channels: {
        type: "array",
        items: {
          $ref: "#/$defs/SendingChannelObservation",
        },
      },
      browsers: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "workerId",
            "online",
            "active",
            "fresh",
            "observedAt",
            "phase",
            "reason",
            "detail",
            "nextWakeAt",
            "lastProgressAt",
            "decisionAt",
            "runId",
            "clockOffsetMs",
            "timingAvailable",
          ],
          properties: {
            workerId: {
              type: "string",
            },
            online: {
              type: "boolean",
            },
            active: {
              type: "boolean",
            },
            fresh: {
              type: "boolean",
            },
            observedAt: {
              $ref: "#/$defs/SendingTime",
            },
            phase: {
              type: "string",
            },
            reason: {
              type: "string",
            },
            detail: {
              type: "string",
            },
            nextWakeAt: {
              $ref: "#/$defs/SendingTime",
            },
            lastProgressAt: {
              $ref: "#/$defs/SendingTime",
            },
            decisionAt: {
              $ref: "#/$defs/SendingTime",
            },
            runId: {
              type: ["string", "null"],
            },
            clockOffsetMs: {
              type: ["integer", "null"],
            },
            timingAvailable: {
              type: "boolean",
            },
          },
        },
      },
    },
  },
  SendingTime: {
    type: ["string", "null"],
    format: "date-time",
  },
  SendingChannelObservation: {
    type: "object",
    additionalProperties: false,
    required: [
      "channel",
      "queuedJobs",
      "runningJobs",
      "status",
      "nextEligibleAt",
      "remainingSeconds",
      "deadlineKind",
      "workerId",
      "nextJob",
      "pacing",
      "constraints",
    ],
    properties: {
      activities: {
        type: "array",
        items: {
          $ref: "#/$defs/SendingActivity",
        },
      },
      channel: {
        type: "string",
      },
      queuedJobs: {
        type: "integer",
        minimum: 0,
      },
      runningJobs: {
        type: "integer",
        minimum: 0,
      },
      status: {
        type: "string",
        enum: ["running", "waiting", "ready", "blocked", "unknown", "idle"],
      },
      nextEligibleAt: {
        $ref: "#/$defs/SendingTime",
      },
      remainingSeconds: {
        type: ["integer", "null"],
        minimum: 0,
      },
      deadlineKind: {
        type: "string",
        enum: ["eligibility", "lower_bound", "unknown"],
      },
      workerId: {
        type: ["string", "null"],
      },
      nextJob: {
        oneOf: [
          {
            $ref: "#/$defs/SendingJobReference",
          },
          {
            type: "null",
          },
        ],
      },
      pacing: {
        oneOf: [
          {
            $ref: "#/$defs/SendingPacingObservation",
          },
          {
            type: "null",
          },
        ],
      },
      constraints: {
        type: "array",
        items: {
          $ref: "#/$defs/SendingConstraint",
        },
      },
    },
  },
  SendingActivity: {
    type: "object",
    additionalProperties: false,
    required: [
      "workerId",
      "jobId",
      "attemptId",
      "step",
      "phase",
      "kind",
      "timingAvailable",
      "startedAt",
      "deadlineAt",
      "remainingSeconds",
      "watchdogAt",
      "lastProgressAt",
      "observedAt",
    ],
    properties: {
      workerId: {
        type: "string",
      },
      jobId: {
        type: "string",
      },
      attemptId: {
        type: "string",
      },
      step: {
        type: "string",
      },
      phase: {
        type: "string",
        enum: ["active", "waiting", "overdue", "telemetry_unavailable"],
      },
      kind: {
        type: "string",
        enum: ["work", "delay", "timeout", "watchdog"],
      },
      timingAvailable: {
        type: "boolean",
      },
      startedAt: {
        $ref: "#/$defs/SendingTime",
      },
      deadlineAt: {
        $ref: "#/$defs/SendingTime",
      },
      remainingSeconds: {
        type: ["integer", "null"],
        minimum: 0,
      },
      watchdogAt: {
        $ref: "#/$defs/SendingTime",
      },
      lastProgressAt: {
        $ref: "#/$defs/SendingTime",
      },
      observedAt: {
        $ref: "#/$defs/SendingTime",
      },
    },
  },
  SendingJobReference: {
    type: "object",
    additionalProperties: false,
    required: ["jobId", "channel", "state", "companyName"],
    properties: {
      jobId: {
        type: "string",
      },
      channel: {
        type: "string",
      },
      state: {
        type: "string",
      },
      companyName: {
        type: "string",
      },
    },
  },
  SendingPacingObservation: {
    type: "object",
    additionalProperties: false,
    required: [
      "observedAt",
      "nextEligibleAt",
      "remainingSeconds",
      "remainingMs",
      "reason",
      "policySource",
      "policyRevision",
      "anchor",
      "batchAnchor",
    ],
    properties: {
      observedAt: {
        type: "string",
        format: "date-time",
      },
      nextEligibleAt: {
        $ref: "#/$defs/SendingTime",
      },
      remainingSeconds: {
        type: "integer",
        minimum: 0,
      },
      remainingMs: {
        type: "integer",
        minimum: 0,
      },
      reason: {
        type: "string",
      },
      policySource: {
        type: "string",
      },
      policyRevision: {
        type: ["string", "null"],
      },
      anchor: {
        oneOf: [
          {
            type: "object",
            additionalProperties: false,
            required: ["jobId", "attemptId", "state", "finishedAt"],
            properties: {
              jobId: {
                type: "string",
              },
              attemptId: {
                type: "string",
              },
              state: {
                type: "string",
              },
              finishedAt: {
                $ref: "#/$defs/SendingTime",
              },
            },
          },
          {
            type: "null",
          },
        ],
      },
      batchAnchor: {
        oneOf: [
          {
            type: "object",
            additionalProperties: false,
            required: ["jobId", "finishedAt"],
            properties: {
              jobId: {
                type: "string",
              },
              finishedAt: {
                $ref: "#/$defs/SendingTime",
              },
            },
          },
          {
            type: "null",
          },
        ],
      },
    },
  },
  SendingConstraint: {
    type: "object",
    additionalProperties: false,
    required: ["code", "source", "detail", "notBefore", "blockingJob"],
    properties: {
      startedAt: {
        $ref: "#/$defs/SendingTime",
      },
      reason: {
        type: ["string", "null"],
      },
      code: {
        type: "string",
      },
      source: {
        type: "string",
        enum: ["server", "browser"],
      },
      detail: {
        type: "string",
      },
      notBefore: {
        $ref: "#/$defs/SendingTime",
      },
      blockingJob: {
        oneOf: [
          {
            $ref: "#/$defs/SendingJobReference",
          },
          {
            type: "null",
          },
        ],
      },
    },
  },
  RepliesListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "replies.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/RepliesListOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  RepliesListOutput: {
    type: "object",
    additionalProperties: false,
    required: ["generatedAt", "campaignId", "campaignName", "totalReplies", "replies"],
    properties: {
      generatedAt: {
        type: "string",
        format: "date-time",
      },
      campaignId: {
        type: "string",
      },
      campaignName: {
        type: "string",
      },
      totalReplies: {
        type: "integer",
        minimum: 0,
      },
      replies: {
        type: "array",
        maxItems: 20,
        items: {
          $ref: "#/$defs/AgentLead",
        },
      },
      filteredTotal: {
        type: "integer",
        minimum: 0,
      },
      hasMore: {
        type: "boolean",
      },
      nextCursor: {
        type: ["string", "null"],
      },
      scope: {
        type: "object",
        additionalProperties: false,
        required: ["campaignId", "reason"],
        properties: {
          campaignId: {
            type: ["string", "null"],
          },
          reason: {
            type: "string",
            enum: ["explicit_campaign", "workspace_default"],
          },
        },
      },
    },
  },
  AgentLead: {
    type: "object",
    additionalProperties: false,
    required: [
      "id",
      "campaignId",
      "companyOutreachId",
      "companyName",
      "contactName",
      "handle",
      "avatarUrl",
      "stage",
      "channels",
      "lastContactedAt",
    ],
    properties: {
      id: {
        type: "string",
      },
      campaignId: {
        type: "string",
      },
      companyOutreachId: {
        type: "string",
      },
      companyName: {
        type: "string",
      },
      contactName: {
        type: "string",
      },
      handle: {
        type: "string",
      },
      avatarUrl: {
        type: "string",
      },
      stage: {
        $ref: "#/$defs/PipelineStage",
      },
      channels: {
        type: "array",
        items: {
          $ref: "#/$defs/TargetChannel",
        },
      },
      lastContactedAt: {
        type: "string",
      },
      conversationId: {
        description:
          "The newest linked inbox conversation for replies_list rows; null when none is linked.",
        type: ["string", "null"],
      },
      conversationChannel: {
        type: "string",
      },
      needsReply: {
        type: "boolean",
        description:
          "False when the presented intent is opt_out or not_interested, including when the stored flag is true. Other intents keep the stored flag. The stored flag and the reply policy are unchanged.",
      },
      suggestedAction: {
        type: "string",
        enum: [
          "reply",
          "book_meeting",
          "schedule_followup",
          "ask_for_referral",
          "close_politely",
          "close_without_reply",
          "wait",
          "review",
          "none",
        ],
        description:
          "Next step implied by the presented intent. not_interested is close_politely and opt_out is close_without_reply, never a sales follow-up. Any other intent with stored needsReply false is none.",
      },
      awaitingReply: {
        type: "boolean",
        description:
          "True when the stored needsReply flag is set and the presented intent is not not_interested or opt_out. The stored flag and the reply policy are unchanged.",
      },
      interestLevel: {
        type: ["string", "null"],
      },
      intent: {
        description:
          "Classified reply intent, auto_reply for an automatic inbound, or unclassified. Null only when the row has no linked conversation. An email invitation is presented as information_requested, and an objection or capacity limit on a positive label is presented as unclear. The stored classification is unchanged.",
        type: ["string", "null"],
      },
      contactEmail: {
        description:
          "Address extracted when the reply invites an email. Omitted when none was extracted. Presentation only; the stored classification is unchanged.",
        type: "string",
        maxLength: 320,
      },
      lastMessage: {
        description:
          "Latest inbound message with text when one exists; otherwise the latest non-empty message, up to 500 characters. Empty text is not returned.",
        type: ["object", "null"],
        additionalProperties: false,
        properties: {
          direction: {
            type: ["string", "null"],
          },
          text: {
            type: "string",
            maxLength: 500,
          },
          at: {
            type: ["string", "null"],
          },
        },
      },
      lastInboundAt: {
        type: ["string", "null"],
      },
    },
  },
  PipelineStage: {
    type: "string",
    enum: ["contacted", "replied", "call_booked", "closed"],
  },
  ConversationsListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "conversations.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ConversationsListOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  ConversationsListOutput: {
    type: "object",
    additionalProperties: false,
    required: ["generatedAt", "conversations", "scopeStats", "hasMore", "nextCursor"],
    properties: {
      generatedAt: {
        type: "string",
        format: "date-time",
      },
      conversations: {
        type: "array",
        maxItems: 60,
        items: {
          oneOf: [
            {
              $ref: "#/$defs/InboxConversationSummary",
            },
            {
              $ref: "#/$defs/InboxConversationCompact",
            },
          ],
        },
      },
      scopeStats: {
        $ref: "#/$defs/InboxScopeStats",
      },
      filteredTotal: {
        type: "integer",
        minimum: 0,
        description: "Exact count matching all filters, before the pagination cursor.",
      },
      scope: {
        type: "object",
        additionalProperties: false,
        required: [
          "campaignId",
          "channel",
          "mailboxId",
          "filter",
          "interest",
          "intent",
          "query",
          "updatedAfter",
          "includeAutomaticResponses",
        ],
        properties: {
          campaignId: {
            type: ["string", "null"],
          },
          channel: {
            type: ["string", "null"],
          },
          mailboxId: {
            type: ["string", "null"],
          },
          filter: {
            type: "string",
          },
          interest: {
            type: ["string", "null"],
          },
          intent: {
            type: ["string", "null"],
          },
          query: {
            type: ["string", "null"],
          },
          updatedAfter: {
            type: ["string", "null"],
            format: "date-time",
          },
          includeAutomaticResponses: {
            type: "boolean",
          },
        },
      },
      hasMore: {
        type: "boolean",
      },
      nextCursor: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      metrics: {
        $ref: "#/$defs/SalesMetricsV2",
      },
      metricsAsOf: {
        type: "string",
        format: "date-time",
      },
      metricsVersion: {
        type: "string",
        maxLength: 500,
      },
      definitions: {
        type: "object",
        additionalProperties: {
          type: "string",
        },
      },
      metricIds: {
        type: "object",
        additionalProperties: {
          type: "string",
        },
      },
      legacy: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
  InboxConversationSummary: {
    type: "object",
    additionalProperties: false,
    required: [
      "id",
      "campaignId",
      "campaignName",
      "channel",
      "targetHandle",
      "targetName",
      "targetCompanyName",
      "status",
      "lastMessageText",
      "lastMessageDirection",
      "lastMessageAt",
      "lastInboundAt",
      "updatedAt",
      "unreadCount",
      "needsReply",
      "interestLevel",
      "interestIntent",
    ],
    properties: {
      id: {
        type: "string",
      },
      campaignId: {
        type: "string",
      },
      campaignName: {
        type: "string",
      },
      channel: {
        $ref: "#/$defs/InboxChannel",
      },
      targetHandle: {
        type: "string",
      },
      targetName: {
        type: "string",
      },
      targetCompanyName: {
        type: "string",
      },
      companyOutreachId: {
        type: "string",
      },
      intentConfidence: {
        type: ["number", "null"],
        minimum: 0,
        maximum: 1,
      },
      intentSource: {
        type: ["string", "null"],
        enum: ["model", "rule", "human", "agent", null],
      },
      intentReason: {
        type: ["string", "null"],
      },
      classifiedAt: {
        type: ["string", "null"],
        format: "date-time",
      },
      status: {
        type: "string",
        enum: ["open", "closed"],
      },
      lastMessageText: {
        type: "string",
      },
      lastMessageDirection: {
        type: "string",
        enum: ["", "inbound", "outbound"],
      },
      lastMessageAt: {
        type: "string",
      },
      lastInboundAt: {
        type: "string",
      },
      updatedAt: {
        type: "string",
      },
      unreadCount: {
        type: "integer",
        minimum: 0,
      },
      needsReply: {
        type: "boolean",
        description:
          "False when the presented intent is opt_out or not_interested, including when the stored flag is true. Other intents keep the stored flag. The stored flag and the reply policy are unchanged.",
      },
      suggestedAction: {
        type: "string",
        enum: [
          "reply",
          "book_meeting",
          "schedule_followup",
          "ask_for_referral",
          "close_politely",
          "close_without_reply",
          "wait",
          "review",
          "none",
        ],
        description:
          "Next step implied by the presented intent. not_interested is close_politely and opt_out is close_without_reply, never a sales follow-up. Any other intent with stored needsReply false is none.",
      },
      awaitingReply: {
        type: "boolean",
        description:
          "True when the stored needsReply flag is set and the presented intent is not not_interested or opt_out. The stored flag and the reply policy are unchanged.",
      },
      interestLevel: {
        type: "string",
        enum: ["", "positive", "neutral", "negative", "needs_review"],
      },
      interestIntent: {
        type: "string",
        enum: [
          "",
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
        ],
      },
      businessId: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      country: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      meetingId: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      meetingStatus: {
        type: "string",
        enum: ["none", "booked", "held", "no_show"],
      },
      nextMeetingAt: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      nextActionAt: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      nextActionType: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      nextActionNote: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      owner: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      duplicateOf: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      attributionMethod: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      intentEvidence: {
        oneOf: [
          {
            type: "object",
            additionalProperties: true,
          },
          {
            type: "null",
          },
        ],
      },
      intentHistory: {
        type: "array",
        maxItems: 5,
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
    },
  },
  InboxChannel: {
    type: "string",
    enum: ["instagram", "facebook", "linkedin", "gmail", "outlook", "email", "sms"],
  },
  InboxConversationCompact: {
    type: "object",
    additionalProperties: false,
    required: ["id", "channel"],
    properties: {
      id: {
        type: "string",
      },
      campaignId: {
        type: "string",
      },
      channel: {
        $ref: "#/$defs/InboxChannel",
      },
      targetHandle: {
        type: "string",
      },
      targetName: {
        type: "string",
      },
      status: {
        type: "string",
      },
      needsReply: {
        type: "boolean",
        description:
          "False when the presented intent is opt_out or not_interested, including when the stored flag is true. Other intents keep the stored flag. The stored flag and the reply policy are unchanged.",
      },
      suggestedAction: {
        type: "string",
        enum: [
          "reply",
          "book_meeting",
          "schedule_followup",
          "ask_for_referral",
          "close_politely",
          "close_without_reply",
          "wait",
          "review",
          "none",
        ],
        description:
          "Next step implied by the presented intent. not_interested is close_politely and opt_out is close_without_reply, never a sales follow-up. Any other intent with stored needsReply false is none.",
      },
      awaitingReply: {
        type: "boolean",
        description:
          "True when the stored needsReply flag is set and the presented intent is not not_interested or opt_out. The stored flag and the reply policy are unchanged.",
      },
      unreadCount: {
        type: "integer",
      },
      interestLevel: {
        type: "string",
      },
      interestIntent: {
        type: "string",
      },
      updatedAt: {
        type: "string",
      },
      lastInboundAt: {
        type: "string",
      },
      lastMessageAt: {
        type: "string",
      },
      lastMessageDirection: {
        type: "string",
      },
      lastMessageText: {
        type: "string",
        maxLength: 240,
      },
    },
  },
  InboxScopeStats: {
    type: "object",
    additionalProperties: false,
    description:
      "Counts in the selected campaign, channel, mailbox and text scope across conversation filters. These are not the total matching one filter.",
    required: [
      "total",
      "needsReply",
      "waiting",
      "unread",
      "snoozed",
      "closed",
      "positive",
      "neutral",
      "negative",
      "needsReview",
    ],
    properties: {
      total: {
        type: "integer",
        minimum: 0,
      },
      needsReply: {
        type: "integer",
        minimum: 0,
      },
      waiting: {
        type: "integer",
        minimum: 0,
      },
      unread: {
        type: "integer",
        minimum: 0,
      },
      snoozed: {
        type: "integer",
        minimum: 0,
      },
      closed: {
        type: "integer",
        minimum: 0,
      },
      positive: {
        type: "integer",
        minimum: 0,
      },
      neutral: {
        type: "integer",
        minimum: 0,
      },
      negative: {
        type: "integer",
        minimum: 0,
      },
      needsReview: {
        type: "integer",
        minimum: 0,
      },
    },
  },
  ConversationInspectResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "conversation.inspect",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ConversationInspectOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  ConversationInspectOutput: {
    type: "object",
    additionalProperties: false,
    required: ["generatedAt", "conversation", "messages", "hasMore", "nextCursor"],
    properties: {
      generatedAt: {
        type: "string",
        format: "date-time",
      },
      conversation: {
        $ref: "#/$defs/InboxConversationSummary",
      },
      messages: {
        type: "array",
        maxItems: 100,
        items: {
          $ref: "#/$defs/InboxConversationMessage",
        },
      },
      hasMore: {
        type: "boolean",
      },
      nextCursor: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      siblings: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: {
              $ref: "#/$defs/ResourceId",
            },
            channel: {
              type: "string",
            },
            status: {
              type: "string",
            },
            lastMessageAt: {
              oneOf: [
                {
                  type: "string",
                },
                {
                  type: "null",
                },
              ],
            },
            intent: {
              type: "string",
            },
          },
          required: ["id", "channel", "status", "lastMessageAt", "intent"],
        },
        maxItems: 100,
      },
      personId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      companyId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
    },
  },
  InboxConversationMessage: {
    type: "object",
    additionalProperties: false,
    required: [
      "id",
      "channel",
      "direction",
      "senderName",
      "text",
      "media",
      "messageType",
      "replyKind",
      "isAutomaticResponse",
      "deliveryStatus",
      "sentAt",
    ],
    properties: {
      id: {
        type: "string",
      },
      channel: {
        $ref: "#/$defs/InboxChannel",
      },
      direction: {
        type: "string",
        enum: ["inbound", "outbound"],
      },
      senderName: {
        type: "string",
      },
      text: {
        type: "string",
      },
      media: {
        type: "array",
        items: {
          $ref: "#/$defs/InboxMessageMedia",
        },
      },
      messageType: {
        type: "string",
        enum: [
          "text",
          "reply_signal",
          "attachment",
          "system",
          "reaction",
          "system_event",
          "auto_reply",
        ],
      },
      replyKind: {
        type: "string",
        enum: ["human", "automatic", "uncertain"],
      },
      isAutomaticResponse: {
        type: "boolean",
      },
      deliveryStatus: {
        type: "string",
      },
      sentAt: {
        type: "string",
      },
      editedAt: {
        type: "string",
      },
      deleted: {
        type: "boolean",
      },
      seenAt: {
        type: "string",
      },
      reaction: {
        oneOf: [
          {
            type: "object",
            additionalProperties: false,
            properties: {
              emoji: {
                type: "string",
              },
              targetMessageId: {
                type: "string",
              },
            },
            required: ["emoji", "targetMessageId"],
          },
          {
            type: "null",
          },
        ],
      },
      actor: {
        oneOf: [
          {
            type: "object",
            additionalProperties: true,
          },
          {
            type: "null",
          },
        ],
      },
      templateId: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      templateVersion: {
        oneOf: [
          {
            type: "integer",
          },
          {
            type: "null",
          },
        ],
      },
      policyVersion: {
        oneOf: [
          {
            type: "integer",
          },
          {
            type: "null",
          },
        ],
      },
      classification: {
        oneOf: [
          {
            $ref: "#/$defs/MessageClassificationV2",
          },
          {
            type: "null",
          },
        ],
      },
    },
  },
  InboxMessageMedia: {
    type: "object",
    additionalProperties: false,
    required: [
      "id",
      "kind",
      "url",
      "previewUrl",
      "title",
      "description",
      "mimeType",
      "durationMs",
      "width",
      "height",
    ],
    properties: {
      id: {
        type: "string",
      },
      kind: {
        type: "string",
        enum: ["image", "video", "audio", "link"],
      },
      url: {
        type: "string",
      },
      previewUrl: {
        type: "string",
      },
      title: {
        type: "string",
      },
      description: {
        type: "string",
      },
      mimeType: {
        type: "string",
      },
      durationMs: {
        type: "integer",
        minimum: 0,
      },
      width: {
        type: "integer",
        minimum: 0,
      },
      height: {
        type: "integer",
        minimum: 0,
      },
    },
  },
  MessageClassificationV2: {
    type: "object",
    additionalProperties: false,
    properties: {
      messageType: {
        type: "string",
        maxLength: 200,
      },
      language: {
        type: "string",
        maxLength: 200,
      },
      intents: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            intent: {
              type: "string",
              maxLength: 200,
            },
            confidence: {
              type: "number",
            },
            evidence: {
              type: "object",
              additionalProperties: false,
              properties: {
                quote: {
                  type: "string",
                  maxLength: 200,
                },
                start: {
                  type: "integer",
                  minimum: 0,
                },
                end: {
                  type: "integer",
                  minimum: 0,
                },
              },
              required: ["quote", "start", "end"],
            },
          },
          required: ["intent", "confidence", "evidence"],
        },
      },
      primaryIntent: {
        type: "string",
        maxLength: 200,
      },
      stopRequest: {
        type: "boolean",
      },
      stopEvidence: {
        oneOf: [
          {
            type: "object",
            additionalProperties: false,
            properties: {
              quote: {
                type: "string",
                maxLength: 200,
              },
              start: {
                type: "integer",
                minimum: 0,
              },
              end: {
                type: "integer",
                minimum: 0,
              },
            },
            required: ["quote", "start", "end"],
          },
          {
            type: "null",
          },
        ],
      },
      optOutReview: {
        type: "boolean",
      },
      proposedTimes: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            text: {
              type: "string",
              maxLength: 200,
            },
            startLocal: {
              type: "string",
              maxLength: 200,
            },
            tz: {
              type: "string",
              maxLength: 200,
            },
            confidence: {
              type: "number",
            },
          },
          required: ["text", "startLocal", "tz", "confidence"],
        },
      },
      extractedContacts: {
        type: "object",
        additionalProperties: false,
        properties: {
          emails: {
            type: "array",
            items: {
              type: "string",
              maxLength: 200,
            },
          },
          phones: {
            type: "array",
            items: {
              type: "string",
              maxLength: 200,
            },
          },
        },
        required: ["emails", "phones"],
      },
      classifierVersion: {
        type: "string",
        maxLength: 200,
      },
    },
    required: [
      "messageType",
      "language",
      "intents",
      "primaryIntent",
      "stopRequest",
      "stopEvidence",
      "optOutReview",
      "proposedTimes",
      "extractedContacts",
      "classifierVersion",
    ],
  },
  ConversationUpdateResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "conversation.update",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                $ref: "#/$defs/ConversationUpdateData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  AgentWritePreviewData: {
    type: "object",
    additionalProperties: false,
    required: ["dryRun", "wouldChange", "policyDecision", "budgetImpact"],
    properties: {
      dryRun: {
        type: "boolean",
        const: true,
      },
      wouldChange: {
        type: "object",
        additionalProperties: true,
      },
      policyDecision: {
        type: "object",
        additionalProperties: false,
        required: ["allowed", "ruleId", "reasons"],
        properties: {
          allowed: {
            type: "boolean",
          },
          ruleId: {
            type: "string",
          },
          reasons: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
      budgetImpact: {
        type: "object",
        additionalProperties: {
          type: "integer",
          minimum: 0,
        },
      },
    },
  },
  ConversationUpdateData: {
    type: "object",
    additionalProperties: false,
    required: ["conversation"],
    properties: {
      conversation: {
        $ref: "#/$defs/InboxConversationSummary",
      },
    },
  },
  ConversationReplyResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "conversation.reply",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ConversationReplyData",
              },
              {
                $ref: "#/$defs/ConversationReplyPreviewData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  ConversationReplyData: {
    type: "object",
    additionalProperties: false,
    required: ["conversationId"],
    properties: {
      conversationId: {
        type: "string",
      },
      actionId: {
        type: "string",
      },
      state: {
        type: "string",
        enum: ["queued", "claimed", "submitted", "sent", "failed", "cancelled", "delivery_unknown"],
      },
      deliveryRoute: {
        type: "string",
        enum: ["browser", "email", "instagram_api", "sms"],
      },
      deliveryConfirmed: {
        type: "boolean",
      },
      requiresExtensionWake: {
        type: "boolean",
      },
      policyDecision: {
        type: "string",
        enum: ["auto_allowed", "approval_required", "denied"],
      },
      reasons: {
        type: "array",
        items: {
          type: "string",
          minLength: 1,
          maxLength: 160,
        },
        maxItems: 100,
      },
      approval: {
        $ref: "#/$defs/SalesReplyResource",
      },
      approvalUrl: {
        type: "string",
      },
      receiptId: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      templateVersion: {
        type: "integer",
        minimum: 0,
      },
      policyVersion: {
        type: "integer",
        minimum: 0,
      },
    },
  },
  SalesReplyResource: {
    type: "object",
    additionalProperties: true,
    properties: {
      id: {
        type: ["string", "null"],
      },
      kind: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      revision: {
        type: "integer",
        minimum: 0,
      },
      status: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      conversationId: {
        type: ["string", "null"],
      },
      updatedAt: {
        type: ["string", "null"],
      },
      template: {
        $ref: "#/$defs/ReplyTemplate",
      },
      policy: {
        $ref: "#/$defs/ReplyPolicy",
      },
    },
    required: ["id", "revision", "status"],
  },
  ReplyTemplate: {
    type: "object",
    additionalProperties: false,
    properties: {
      name: {
        type: "string",
        minLength: 1,
        maxLength: 120,
      },
      language: {
        type: "string",
        enum: ["fi", "en"],
      },
      channels: {
        type: "array",
        items: {
          type: "string",
          enum: ["instagram", "facebook", "linkedin", "gmail", "sms"],
        },
        maxItems: 5,
      },
      intents: {
        type: "array",
        items: {
          type: "string",
          minLength: 1,
          maxLength: 80,
        },
        maxItems: 30,
      },
      body: {
        type: "string",
        minLength: 1,
        maxLength: 10000,
      },
      maxLength: {
        type: "integer",
        minimum: 1,
        maximum: 10000,
      },
    },
    required: ["name", "language", "channels", "intents", "body", "maxLength"],
  },
  ReplyPolicy: {
    type: "object",
    additionalProperties: false,
    properties: {
      enabled: {
        type: "boolean",
      },
      allowedIntents: {
        type: "array",
        items: {
          type: "string",
          minLength: 1,
          maxLength: 80,
        },
        maxItems: 30,
      },
      allowedChannels: {
        type: "array",
        items: {
          type: "string",
          enum: ["instagram", "facebook", "linkedin", "gmail", "sms"],
        },
        maxItems: 5,
      },
      allowedTemplateIds: {
        type: "array",
        items: {
          $ref: "#/$defs/ResourceId",
        },
        maxItems: 100,
      },
      freeTextAllowed: {
        type: "boolean",
        const: false,
      },
      excludeIfOptOut: {
        type: "boolean",
        const: true,
      },
      hours: {
        type: "object",
        additionalProperties: false,
        properties: {
          tz: {
            type: "string",
            minLength: 1,
            maxLength: 80,
          },
          start: {
            type: "string",
            pattern: "^(?:[01]\\d|2[0-3]):[0-5]\\d$",
          },
          end: {
            type: "string",
            pattern: "^(?:[01]\\d|2[0-3]):[0-5]\\d$",
          },
          weekdays: {
            type: "array",
            items: {
              type: "integer",
              minimum: 1,
              maximum: 7,
            },
            maxItems: 7,
          },
        },
        required: ["tz", "start", "end", "weekdays"],
      },
      maxAutoRepliesPerDay: {
        type: "integer",
        minimum: 1,
        maximum: 1000,
      },
      maxPerConversationPerDay: {
        type: "integer",
        minimum: 1,
        maximum: 20,
      },
      requireApprovalIfConfidenceBelow: {
        type: "number",
        minimum: 0,
        maximum: 1,
      },
    },
    required: [
      "enabled",
      "allowedIntents",
      "allowedChannels",
      "allowedTemplateIds",
      "freeTextAllowed",
      "excludeIfOptOut",
      "hours",
      "maxAutoRepliesPerDay",
      "maxPerConversationPerDay",
      "requireApprovalIfConfidenceBelow",
    ],
  },
  ConversationReplyPreviewData: {
    type: "object",
    additionalProperties: false,
    required: [
      "conversationId",
      "dryRun",
      "wouldChange",
      "policyDecision",
      "budgetImpact",
      "nextAllowedAt",
    ],
    properties: {
      conversationId: {
        type: "string",
      },
      dryRun: {
        type: "boolean",
        const: true,
      },
      wouldChange: {
        type: "object",
        additionalProperties: false,
        required: ["text", "channel", "senderId", "senderHandle", "mailboxId"],
        properties: {
          text: {
            type: "string",
          },
          channel: {
            type: "string",
          },
          senderId: {
            type: "string",
          },
          senderHandle: {
            type: "string",
          },
          mailboxId: {
            type: ["string", "null"],
          },
        },
      },
      policyDecision: {
        type: "object",
        additionalProperties: false,
        required: ["allowed", "ruleId", "reasons"],
        properties: {
          allowed: {
            type: "boolean",
          },
          ruleId: {
            type: "string",
          },
          reasons: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
      budgetImpact: {
        type: "object",
        additionalProperties: {
          type: "integer",
          minimum: 0,
        },
      },
      nextAllowedAt: {
        type: ["string", "null"],
        format: "date-time",
      },
    },
  },
  ConversationReplyInspectResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "conversation.reply.inspect",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ConversationReplyInspectOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  ConversationReplyInspectOutput: {
    allOf: [
      {
        $ref: "#/$defs/ConversationReplyData",
      },
      {
        type: "object",
        properties: {
          lastErrorCode: {
            type: "string",
          },
          lastErrorDetail: {
            type: "string",
          },
        },
      },
    ],
  },
  CampaignMessagesDraftListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "campaign.messages.draft.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CampaignMessagesDraftListOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CampaignMessagesDraftListOutput: {
    type: "object",
    additionalProperties: false,
    required: [
      "campaignId",
      "campaignUpdatedAt",
      "listId",
      "listUpdatedAt",
      "total",
      "staleAudience",
      "messages",
      "hasMore",
      "nextAfterId",
    ],
    properties: {
      campaignId: {
        type: "string",
      },
      campaignUpdatedAt: {
        type: "string",
      },
      listId: {
        type: "string",
      },
      listUpdatedAt: {
        type: "string",
      },
      total: {
        type: "integer",
        minimum: 0,
      },
      staleAudience: {
        type: "boolean",
      },
      messages: {
        type: "array",
        maxItems: 100,
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "id",
            "channel",
            "targetHandle",
            "targetUrl",
            "companyOutreachId",
            "message",
            "updatedAt",
          ],
          properties: {
            id: {
              type: "string",
            },
            channel: {
              type: "string",
              enum: ["instagram", "facebook"],
            },
            targetHandle: {
              type: "string",
            },
            targetUrl: {
              type: "string",
            },
            companyOutreachId: {
              type: "string",
            },
            message: {
              type: "string",
            },
            updatedAt: {
              type: "string",
            },
          },
        },
      },
      hasMore: {
        type: "boolean",
      },
      nextAfterId: {
        type: ["string", "null"],
      },
    },
  },
  CampaignMessagesDraftUpdateResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "campaign.messages.draft.update",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/CampaignMessagesDraftUpdateOutput",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  CampaignMessagesDraftUpdateOutput: {
    type: "object",
    additionalProperties: false,
    required: [
      "campaignId",
      "campaignUpdatedAt",
      "editedCount",
      "preparedCount",
      "sent",
      "replayed",
    ],
    properties: {
      campaignId: {
        type: "string",
      },
      campaignUpdatedAt: {
        type: "string",
      },
      editedCount: {
        type: "integer",
        minimum: 1,
        maximum: 100,
      },
      preparedCount: {
        type: "integer",
        minimum: 0,
      },
      sent: {
        type: "boolean",
        const: false,
      },
      replayed: {
        type: "boolean",
      },
    },
  },
  CampaignMessagesListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "campaign.messages.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CampaignMessagesListOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CampaignMessagesListOutput: {
    type: "object",
    additionalProperties: false,
    required: [
      "campaignId",
      "runId",
      "campaignUpdatedAt",
      "total",
      "jobs",
      "hasMore",
      "nextAfterJobId",
      "observedAt",
    ],
    properties: {
      campaignId: {
        type: "string",
      },
      runId: {
        type: "string",
      },
      campaignUpdatedAt: {
        type: "string",
        format: "date-time",
      },
      total: {
        type: "integer",
        minimum: 0,
      },
      jobs: {
        type: "array",
        maxItems: 100,
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "jobId",
            "targetHandle",
            "targetCompanyName",
            "targetUrl",
            "companyOutreachId",
            "channel",
            "sequenceStepIndex",
            "updatedAt",
            "message",
            "customized",
            "editable",
            "blockedReason",
          ],
          properties: {
            jobId: {
              type: "string",
            },
            targetHandle: {
              type: "string",
            },
            targetCompanyName: {
              type: "string",
            },
            targetUrl: {
              type: "string",
            },
            companyOutreachId: {
              type: "string",
            },
            channel: {
              type: "string",
              enum: ["instagram", "facebook", "linkedin"],
            },
            sequenceStepIndex: {
              type: "integer",
              minimum: 0,
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
            message: {
              type: "string",
            },
            customized: {
              type: "boolean",
            },
            editable: {
              type: "boolean",
            },
            blockedReason: {
              type: ["string", "null"],
            },
          },
        },
      },
      hasMore: {
        type: "boolean",
      },
      nextAfterJobId: {
        type: ["string", "null"],
      },
      observedAt: {
        type: "string",
        format: "date-time",
      },
    },
  },
  CampaignMessagesUpdateResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "campaign.messages.update",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/CampaignMessagesUpdateOutput",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  CampaignMessagesUpdateOutput: {
    type: "object",
    additionalProperties: false,
    required: ["campaignId", "runId", "editedCount", "jobs", "sent", "replayed"],
    properties: {
      campaignId: {
        type: "string",
      },
      runId: {
        type: "string",
      },
      editedCount: {
        type: "integer",
        minimum: 1,
        maximum: 100,
      },
      jobs: {
        type: "array",
        minItems: 1,
        maxItems: 100,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["jobId", "updatedAt", "customized"],
          properties: {
            jobId: {
              type: "string",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
            customized: {
              type: "boolean",
            },
          },
        },
      },
      sent: {
        type: "boolean",
        const: false,
      },
      replayed: {
        type: "boolean",
      },
    },
  },
  CampaignFollowupsListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "campaign.followups.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CampaignFollowupsListOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CampaignFollowupsListOutput: {
    type: "object",
    additionalProperties: false,
    required: [
      "campaignId",
      "campaignName",
      "enabled",
      "generatedAt",
      "timeZone",
      "summary",
      "view",
      "items",
      "nextCursor",
    ],
    properties: {
      campaignId: {
        type: "string",
      },
      campaignName: {
        type: "string",
      },
      enabled: {
        type: "boolean",
      },
      generatedAt: {
        type: "string",
        format: "date-time",
      },
      timeZone: {
        type: "string",
      },
      summary: {
        type: "object",
        additionalProperties: false,
        required: ["upcoming", "done"],
        properties: {
          upcoming: {
            type: "integer",
            minimum: 0,
          },
          done: {
            type: "integer",
            minimum: 0,
          },
          enabled: {
            type: "boolean",
          },
          held: {
            type: "integer",
            minimum: 0,
          },
          connectionChecks: {
            type: "integer",
            minimum: 0,
          },
        },
      },
      view: {
        type: "string",
        enum: ["upcoming", "done"],
      },
      items: {
        type: "array",
        maxItems: 50,
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "id",
            "channel",
            "targetHandle",
            "targetCompanyName",
            "message",
            "step",
            "awaitingConnection",
            "state",
            "scheduledAt",
            "updatedAt",
          ],
          properties: {
            id: {
              type: "string",
            },
            channel: {
              type: "string",
            },
            targetHandle: {
              type: "string",
            },
            targetCompanyName: {
              type: "string",
            },
            message: {
              type: "string",
            },
            step: {
              type: "integer",
            },
            awaitingConnection: {
              type: "boolean",
            },
            state: {
              type: "string",
            },
            scheduledAt: {
              oneOf: [
                {
                  type: "string",
                },
                {
                  type: "null",
                },
              ],
            },
            updatedAt: {
              type: "string",
            },
            kind: {
              type: "string",
              enum: ["connection_check", "message"],
            },
            sendsMessage: {
              type: "boolean",
            },
            willSend: {
              type: "boolean",
            },
            blockedBy: {
              type: ["string", "null"],
            },
          },
        },
      },
      nextCursor: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
    },
  },
  CampaignFollowupsCancelResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "campaign.followups.cancel",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/CampaignFollowupsCancelOutput",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  CampaignFollowupsCancelOutput: {
    type: "object",
    additionalProperties: false,
    required: ["campaignId", "cancelledJobIds", "stoppedChainCount", "replayed"],
    properties: {
      campaignId: {
        type: "string",
      },
      cancelledJobIds: {
        type: "array",
        items: {
          type: "string",
        },
      },
      stoppedChainCount: {
        type: "integer",
        minimum: 1,
      },
      replayed: {
        type: "boolean",
      },
    },
  },
  CampaignOutcomesListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "campaign.outcomes.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CampaignOutcomesListOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CampaignOutcomesListOutput: {
    type: "object",
    additionalProperties: false,
    required: ["campaignId", "events", "hasMore", "nextCursor"],
    properties: {
      campaignId: {
        type: "string",
      },
      events: {
        type: "array",
        maxItems: 100,
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "id",
            "jobId",
            "channel",
            "targetHandle",
            "eventType",
            "reasonCode",
            "stopReason",
            "createdAt",
          ],
          properties: {
            id: {
              type: "string",
            },
            jobId: {
              type: "string",
            },
            channel: {
              type: "string",
            },
            targetHandle: {
              type: "string",
            },
            eventType: {
              type: "string",
            },
            reasonCode: {
              type: "string",
            },
            stopReason: {
              type: "string",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
      hasMore: {
        type: "boolean",
      },
      nextCursor: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
    },
  },
  DeliveryTestPrepareResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "sending.test.prepare",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/DeliveryTestOutput",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  DeliveryTestOutput: {
    type: "object",
    additionalProperties: false,
    required: [
      "testId",
      "channel",
      "to",
      "from",
      "mailboxId",
      "subject",
      "body",
      "reviewDigest",
      "status",
      "expiresAt",
      "replayed",
      "providerAccepted",
      "deliveryConfirmed",
    ],
    properties: {
      testId: {
        type: "string",
      },
      channel: {
        type: "string",
        enum: ["email", "sms"],
      },
      to: {
        type: "string",
      },
      from: {
        type: "string",
      },
      mailboxId: {
        type: "string",
      },
      subject: {
        type: "string",
      },
      body: {
        type: "string",
      },
      reviewDigest: {
        type: "string",
      },
      status: {
        type: "string",
        enum: ["prepared", "submitting", "accepted", "delivered", "failed", "unknown"],
      },
      expiresAt: {
        type: "string",
      },
      replayed: {
        type: "boolean",
      },
      providerAccepted: {
        type: "boolean",
      },
      deliveryConfirmed: {
        type: "boolean",
      },
    },
  },
  DeliveryTestSendResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "sending.test.send",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/DeliveryTestOutput",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  DeliveryTestInspectResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "sending.test.inspect",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/DeliveryTestOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  SendersInspectResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "senders.inspect",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/SendersInspectOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  SendersInspectOutput: {
    type: "object",
    additionalProperties: false,
    required: ["generatedAt", "browserProfiles", "mailboxes", "browserSetupUrl"],
    properties: {
      generatedAt: {
        type: "string",
        format: "date-time",
      },
      browserSetupUrl: {
        type: "string",
        pattern: "^https?://",
      },
      emailAvailable: {
        type: "boolean",
      },
      sms: {
        type: "object",
        additionalProperties: false,
        required: ["available", "configured", "enabled", "phoneNumber"],
        properties: {
          available: {
            type: "boolean",
          },
          configured: {
            type: "boolean",
          },
          enabled: {
            type: "boolean",
          },
          phoneNumber: {
            type: "string",
          },
        },
      },
      browserProfiles: {
        type: "array",
        maxItems: 20,
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "id",
            "browserLabel",
            "instagramUsername",
            "instagramAccountType",
            "online",
            "lastSeenAt",
            "extensionVersion",
            "status",
          ],
          properties: {
            id: {
              type: "string",
            },
            browserLabel: {
              type: "string",
            },
            instagramUsername: {
              type: "string",
            },
            instagramAccountType: {
              type: "string",
              enum: ["professional", "personal", "unknown"],
            },
            online: {
              type: "boolean",
            },
            lastSeenAt: {
              type: "string",
            },
            extensionVersion: {
              type: "string",
            },
            status: {
              type: "string",
            },
            updatedAt: {
              type: "string",
              maxLength: 40,
            },
          },
        },
      },
      mailboxes: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "id",
            "provider",
            "emailAddress",
            "status",
            "sendEnabled",
            "replySyncEnabled",
            "canSend",
            "canRead",
            "needsReauthorization",
            "lastHealthCheckAt",
            "lastErrorCode",
            "effectiveDailyCap",
          ],
          properties: {
            id: {
              type: "string",
            },
            provider: {
              type: "string",
              enum: ["gmail", "outlook", "smtp"],
            },
            emailAddress: {
              type: "string",
            },
            status: {
              type: "string",
              enum: ["healthy", "degraded", "needs_reauth", "disconnected", "retired"],
            },
            sendEnabled: {
              type: "boolean",
            },
            replySyncEnabled: {
              type: "boolean",
            },
            canSend: {
              type: "boolean",
            },
            canRead: {
              type: "boolean",
            },
            needsReauthorization: {
              type: "boolean",
            },
            lastHealthCheckAt: {
              oneOf: [
                {
                  type: "string",
                },
                {
                  type: "null",
                },
              ],
            },
            lastErrorCode: {
              type: "string",
            },
            effectiveDailyCap: {
              type: "integer",
              minimum: 0,
            },
          },
        },
      },
      channelCapabilities: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
    },
  },
  HistoryListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "history.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/HistoryListOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  HistoryListOutput: {
    type: "object",
    additionalProperties: false,
    required: ["campaignId", "entries", "hasMore", "nextCursor"],
    properties: {
      campaignId: {
        description: "Null when the page is the whole workspace.",
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      entries: {
        type: "array",
        maxItems: 100,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["id", "sentTo", "targetName", "sentFrom", "sentAt", "channel", "state"],
          properties: {
            id: {
              type: "string",
            },
            jobId: {
              type: "string",
            },
            sentTo: {
              type: "string",
            },
            targetName: {
              type: "string",
            },
            targetUrl: {
              type: "string",
              description:
                "Stored recipient profile URL. Older records may recover it through an exact profile match in the original saved audience; empty when unavailable.",
            },
            targetCompanyName: {
              type: "string",
            },
            sentFrom: {
              type: "string",
            },
            sentAt: {
              type: "string",
            },
            channel: {
              type: "string",
            },
            state: {
              type: "string",
              enum: ["Sent"],
            },
            campaignId: {
              type: "string",
            },
            campaign: {
              type: "string",
            },
          },
        },
      },
      hasMore: {
        type: "boolean",
      },
      nextCursor: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
    },
  },
  PipelineInspectResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "pipeline.inspect",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/PipelineInspectOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  PipelineInspectOutput: {
    type: "object",
    additionalProperties: false,
    required: ["generatedAt", "campaignId", "campaignName", "stageCounts", "sample"],
    properties: {
      generatedAt: {
        type: "string",
        format: "date-time",
      },
      campaignId: {
        type: "string",
      },
      campaignName: {
        type: "string",
      },
      stageCounts: {
        $ref: "#/$defs/PipelineCounts",
      },
      sample: {
        type: "array",
        maxItems: 8,
        items: {
          $ref: "#/$defs/AgentLead",
        },
      },
      canonicalMetrics: {
        $ref: "#/$defs/SalesMetrics",
      },
      metrics: {
        $ref: "#/$defs/SalesMetricsV2",
      },
      metricsAsOf: {
        type: "string",
        format: "date-time",
      },
      metricsVersion: {
        type: "string",
        maxLength: 500,
      },
      definitions: {
        type: "object",
        additionalProperties: {
          type: "string",
        },
      },
      metricIds: {
        type: "object",
        additionalProperties: {
          type: "string",
        },
      },
      legacy: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
  PipelineCardsListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "pipeline.cards.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/PipelineCardsListOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  PipelineCardsListOutput: {
    type: "object",
    additionalProperties: false,
    required: ["campaignId", "stage", "cards", "stageCounts", "hasMore", "nextCursor"],
    properties: {
      campaignId: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      stage: {
        oneOf: [
          {
            $ref: "#/$defs/PipelineStage",
          },
          {
            type: "null",
          },
        ],
      },
      cards: {
        type: "array",
        maxItems: 100,
        items: {
          $ref: "#/$defs/PipelineCard",
        },
      },
      stageCounts: {
        type: "object",
        additionalProperties: {
          type: "integer",
        },
      },
      hasMore: {
        type: "boolean",
      },
      nextCursor: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      filteredTotal: {
        type: "integer",
        minimum: 0,
      },
      scope: {
        type: "object",
        additionalProperties: true,
      },
      projection: {
        type: "string",
      },
      metrics: {
        $ref: "#/$defs/SalesMetricsV2",
      },
      metricsAsOf: {
        type: "string",
        format: "date-time",
      },
      metricsVersion: {
        type: "string",
        maxLength: 500,
      },
      definitions: {
        type: "object",
        additionalProperties: {
          type: "string",
        },
      },
      metricIds: {
        type: "object",
        additionalProperties: {
          type: "string",
        },
      },
      legacy: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
  PipelineCard: {
    type: "object",
    additionalProperties: false,
    required: [
      "id",
      "stageKey",
      "stage",
      "handle",
      "name",
      "isCompany",
      "campaignId",
      "reachedChannels",
      "sentAt",
    ],
    properties: {
      id: {
        type: "string",
      },
      stageKey: {
        type: "string",
      },
      stage: {
        $ref: "#/$defs/PipelineStage",
      },
      handle: {
        type: "string",
      },
      name: {
        type: "string",
      },
      isCompany: {
        type: "boolean",
      },
      campaignId: {
        type: "string",
      },
      decisionMakerName: {
        type: "string",
      },
      decisionMakerRole: {
        type: "string",
      },
      decisionMakerLinkedinName: {
        type: "string",
      },
      decisionMakerLinkedinRole: {
        type: "string",
      },
      instagramHref: {
        type: "string",
      },
      facebookHref: {
        type: "string",
      },
      linkedinHref: {
        type: "string",
      },
      gmailHref: {
        type: "string",
      },
      reachedChannels: {
        type: "object",
        additionalProperties: false,
        required: ["instagram", "facebook", "linkedin", "gmail", "sms"],
        properties: {
          instagram: {
            type: "boolean",
          },
          facebook: {
            type: "boolean",
          },
          linkedin: {
            type: "boolean",
          },
          gmail: {
            type: "boolean",
          },
          sms: {
            type: "boolean",
          },
        },
      },
      sentAt: {
        type: "string",
      },
      closedOutcome: {
        type: "string",
        enum: ["", "won", "lost"],
      },
      lostReason: {
        type: "string",
        maxLength: 2000,
      },
      updatedAt: {
        type: "string",
      },
      meetingHeld: {
        type: "boolean",
      },
      noShow: {
        type: "boolean",
      },
      displayStage: {
        type: "string",
      },
      companyOutreachId: {
        type: "string",
      },
      channel: {
        type: "string",
      },
      entityId: {
        $ref: "#/$defs/ResourceId",
      },
      companyId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      companyKey: {
        type: ["string", "null"],
      },
    },
  },
  PipelineStageUpdateResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "pipeline.stage.update",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                $ref: "#/$defs/PipelineStageUpdateOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  PipelineStageUpdateOutput: {
    type: "object",
    additionalProperties: false,
    required: ["campaignId", "card"],
    properties: {
      campaignId: {
        type: "string",
      },
      card: {
        $ref: "#/$defs/PipelineCard",
      },
      receiptId: {
        type: "string",
        maxLength: 160,
      },
    },
  },
  PipelineNoteListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "pipeline.note.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/PipelineNoteListOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  PipelineNoteListOutput: {
    type: "object",
    additionalProperties: false,
    required: ["campaignId", "entityKey", "notes"],
    properties: {
      campaignId: {
        type: "string",
      },
      entityKey: {
        type: "string",
      },
      notes: {
        type: "array",
        maxItems: 100,
        items: {
          $ref: "#/$defs/PipelineNote",
        },
      },
    },
  },
  PipelineNote: {
    type: "object",
    additionalProperties: false,
    required: ["id", "body", "createdAt", "updatedAt", "createdByName", "isOwn"],
    properties: {
      id: {
        type: "string",
      },
      body: {
        type: "string",
      },
      createdAt: {
        type: "string",
      },
      updatedAt: {
        type: "string",
      },
      createdByName: {
        type: "string",
      },
      isOwn: {
        type: "boolean",
      },
    },
  },
  PipelineNoteAddResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "pipeline.note.add",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/PipelineNoteAddOutput",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  PipelineNoteAddOutput: {
    type: "object",
    additionalProperties: false,
    required: ["campaignId", "entityKey", "note"],
    properties: {
      campaignId: {
        type: "string",
      },
      entityKey: {
        type: "string",
      },
      note: {
        $ref: "#/$defs/PipelineNote",
      },
    },
  },
  CompanyTimelineResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "company.timeline",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CompanyTimelineOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CompanyTimelineOutput: {
    type: "object",
    additionalProperties: false,
    required: [
      "generatedAt",
      "campaignId",
      "campaignName",
      "companyOutreachId",
      "companyName",
      "stage",
      "lastEventAt",
      "events",
    ],
    properties: {
      generatedAt: {
        type: "string",
        format: "date-time",
      },
      campaignId: {
        type: "string",
      },
      campaignName: {
        type: "string",
      },
      companyOutreachId: {
        type: "string",
      },
      companyName: {
        type: "string",
      },
      stage: {
        type: "string",
        enum: ["", "contacted", "replied", "call_booked", "closed"],
      },
      lastEventAt: {
        type: "string",
      },
      events: {
        type: "array",
        maxItems: 30,
        items: {
          $ref: "#/$defs/CompanyTimelineEvent",
        },
      },
    },
  },
  CompanyTimelineEvent: {
    type: "object",
    additionalProperties: false,
    required: ["id", "type", "occurredAt", "targetName"],
    properties: {
      id: {
        type: "string",
      },
      type: {
        type: "string",
        enum: ["planned", "sent", "replied", "positive", "pipeline_stage"],
      },
      occurredAt: {
        type: "string",
        format: "date-time",
      },
      channel: {
        $ref: "#/$defs/TargetChannel",
      },
      targetName: {
        type: "string",
      },
    },
  },
  IndustryLookupResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "industry.lookup",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/IndustryLookupOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  IndustryLookupOutput: {
    type: "object",
    additionalProperties: false,
    required: ["resolution"],
    properties: {
      resolution: {
        $ref: "#/$defs/AgentIndustryResolution",
      },
    },
  },
  AgentIndustryResolution: {
    type: "object",
    additionalProperties: false,
    required: [
      "status",
      "sourceText",
      "resolvedLabel",
      "primaryVersion",
      "selections",
      "question",
      "options",
      "evidence",
    ],
    properties: {
      status: {
        type: "string",
        enum: ["resolved", "needs_clarification", "unsupported"],
      },
      sourceText: {
        type: "string",
        maxLength: 800,
      },
      resolvedLabel: {
        type: "string",
        maxLength: 240,
      },
      primaryVersion: {
        $ref: "#/$defs/TolVersion",
      },
      selections: {
        type: "array",
        maxItems: 2,
        items: {
          $ref: "#/$defs/AgentIndustryCodeSelection",
        },
      },
      question: {
        type: "string",
        maxLength: 500,
      },
      options: {
        type: "array",
        maxItems: 3,
        items: {
          $ref: "#/$defs/AgentIndustryClarificationOption",
        },
      },
      evidence: {
        type: "array",
        maxItems: 12,
        items: {
          type: "string",
          maxLength: 120,
        },
      },
    },
  },
  TolVersion: {
    type: "string",
    enum: ["2008", "2025"],
  },
  AgentIndustryCodeSelection: {
    type: "object",
    additionalProperties: false,
    required: ["classification", "version", "codes"],
    properties: {
      classification: {
        type: "string",
        const: "TOL",
      },
      version: {
        $ref: "#/$defs/TolVersion",
      },
      codes: {
        type: "array",
        maxItems: 64,
        items: {
          type: "string",
          maxLength: 5,
        },
      },
    },
  },
  AgentIndustryClarificationOption: {
    type: "object",
    additionalProperties: false,
    required: ["id", "label", "selections"],
    properties: {
      companyCount: {
        type: "integer",
        minimum: 0,
      },
      country: {
        $ref: "#/$defs/SupportedCountry",
      },
      id: {
        type: "string",
        maxLength: 80,
      },
      label: {
        type: "string",
        maxLength: 180,
      },
      selections: {
        type: "array",
        maxItems: 2,
        items: {
          $ref: "#/$defs/AgentIndustryCodeSelection",
        },
      },
    },
  },
  SupportedCountry: {
    type: "string",
    enum: [
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
    ],
  },
  CampaignValidateResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "campaign.validate",
          },
          data: {
            anyOf: [
              {
                $ref: "#/$defs/AgentHarnessResult",
              },
              {
                type: "null",
              },
              {
                $ref: "#/$defs/ProspectingOperationData",
              },
            ],
          },
        },
      },
    ],
  },
  AgentHarnessResult: {
    type: "object",
    additionalProperties: false,
    required: [
      "version",
      "action",
      "status",
      "executionMode",
      "summary",
      "blockers",
      "allowedNextActions",
      "resourceRefs",
      "approval",
      "data",
    ],
    properties: {
      version: {
        type: "integer",
        const: 1,
      },
      action: {
        type: "string",
        enum: [
          "get_workspace_capabilities",
          "validate_campaign_plan",
          "preview_audience",
          "prepare_list",
          "prepare_campaign",
          "preflight_campaign_launch",
          "launch_campaign",
          "pause_campaign",
        ],
      },
      status: {
        type: "string",
        enum: ["success", "needs_input", "needs_approval", "blocked", "failed"],
      },
      executionMode: {
        type: "string",
        enum: ["read_only", "simulation", "live"],
      },
      summary: {
        type: "string",
      },
      blockers: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["code", "message", "recoverable"],
          properties: {
            code: {
              type: "string",
            },
            message: {
              type: "string",
            },
            recoverable: {
              type: "boolean",
            },
          },
        },
      },
      allowedNextActions: {
        type: "array",
        items: {
          type: "string",
        },
      },
      resourceRefs: {
        type: "object",
        additionalProperties: false,
        properties: {
          targetListId: {
            type: "string",
          },
          targetListUpdatedAt: {
            type: "string",
            format: "date-time",
          },
          campaignId: {
            type: "string",
          },
          campaignUpdatedAt: {
            type: "string",
            format: "date-time",
          },
          preparationFingerprint: {
            type: "string",
          },
          executionTimezone: {
            type: "string",
          },
        },
      },
      approval: {
        oneOf: [
          {
            type: "object",
            additionalProperties: true,
          },
          {
            type: "null",
          },
        ],
      },
      data: {},
    },
  },
  ProspectingOperationData: {
    type: "object",
    additionalProperties: true,
    description:
      "Exact workspace-scoped prospecting or disabled draft result. authorizesLaunch is always false when readiness is returned.",
    properties: {
      qualification: {
        type: "object",
        additionalProperties: false,
        required: ["basis", "offeringFit", "contactAffiliation", "guidance"],
        properties: {
          basis: {
            type: "string",
            const: "published_filters",
          },
          offeringFit: {
            type: "string",
            const: "not_assessed",
          },
          contactAffiliation: {
            type: "string",
            const: "not_verified",
          },
          guidance: {
            type: "string",
          },
        },
        description:
          "Search matches saved filters; it does not independently qualify the offering, buyer type, or current contact employment. Exact totals refer to the published inventory.",
      },
      approvalId: {
        type: ["string", "null"],
      },
      campaignId: {
        type: ["string", "null"],
      },
      listId: {
        type: ["string", "null"],
      },
      created: {
        type: "boolean",
      },
      dryRun: {
        type: "boolean",
      },
      ready: {
        type: "boolean",
      },
      blockers: {
        type: "array",
        items: {
          type: "string",
        },
      },
      total: {
        type: "integer",
      },
      totalExact: {
        type: "boolean",
      },
      expectedRevision: {
        type: "string",
      },
      querySignature: {
        type: "string",
      },
      companies: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
      nextCursor: {
        type: ["string", "null"],
      },
    },
  },
  AudiencePreviewResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "audience.preview",
          },
          data: {
            anyOf: [
              {
                $ref: "#/$defs/AudiencePreviewHarnessResult",
              },
              {
                type: "null",
              },
              {
                $ref: "#/$defs/ProspectingOperationData",
              },
            ],
          },
        },
      },
    ],
  },
  AudiencePreviewHarnessResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentHarnessResult",
      },
      {
        type: "object",
        properties: {
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AudiencePreviewHarnessData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  AudiencePreviewHarnessData: {
    type: "object",
    additionalProperties: true,
    description:
      "Exact preview data plus the opaque audience identity required by preparation calls.",
    required: ["reviewedAudience"],
    properties: {
      reviewedAudience: {
        oneOf: [
          {
            $ref: "#/$defs/ReviewedAudience",
          },
          {
            type: "null",
          },
        ],
      },
    },
  },
  ReviewedAudience: {
    type: "object",
    additionalProperties: false,
    description:
      "Server-issued identity from the exact audience preview. Echo this object unchanged when preparing a private list or campaign; clients must not derive it.",
    required: ["querySignature", "dataFreshness"],
    properties: {
      querySignature: {
        type: "string",
        minLength: 1,
        maxLength: 200,
        pattern: ".*\\S.*",
      },
      dataFreshness: {
        type: "object",
        additionalProperties: false,
        required: ["engine", "revision"],
        properties: {
          engine: {
            type: "string",
            const: "search_facts",
          },
          revision: {
            type: "string",
            minLength: 1,
            maxLength: 200,
            pattern: ".*\\S.*",
          },
        },
      },
      excludePreviouslyContacted: {
        type: "boolean",
      },
    },
  },
  ListsListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            const: "lists.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ListsListData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  ListsListData: {
    type: "object",
    additionalProperties: false,
    required: ["lists", "total", "nextOffset"],
    properties: {
      lists: {
        type: "array",
        maxItems: 25,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["listId", "name", "isCompanyLeadList"],
          properties: {
            updatedAt: {
              type: "string",
            },
            total: {
              type: "integer",
              minimum: 0,
            },
            channelCounts: {
              type: "object",
              additionalProperties: {
                type: "integer",
                minimum: 0,
              },
            },
            listId: {
              type: "string",
              minLength: 1,
              maxLength: 160,
            },
            name: {
              type: "string",
            },
            isCompanyLeadList: {
              type: "boolean",
            },
            duplicateOf: {
              type: ["string", "null"],
              description:
                "Another list (lowest listId) with the same normalized name, or null when the name is unique.",
            },
          },
        },
      },
      total: {
        type: "integer",
        minimum: 0,
      },
      nextOffset: {
        type: ["integer", "null"],
      },
    },
  },
  ListInspectResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            const: "list.inspect",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ListInspectData",
              },
              {
                $ref: "#/$defs/CompanyListInspectData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  ListInspectData: {
    type: "object",
    additionalProperties: false,
    required: ["list", "usernames", "nextOffset", "membership"],
    properties: {
      list: {
        $ref: "#/$defs/SavedInstagramList",
      },
      usernames: {
        type: "array",
        maxItems: 100,
        items: {
          type: "string",
          minLength: 1,
          maxLength: 30,
        },
      },
      nextOffset: {
        type: ["integer", "null"],
      },
      membership: {
        oneOf: [
          {
            type: "object",
            additionalProperties: false,
            required: ["username", "present"],
            properties: {
              username: {
                type: "string",
                minLength: 1,
                maxLength: 30,
              },
              present: {
                type: "boolean",
              },
            },
          },
          {
            type: "null",
          },
        ],
      },
    },
  },
  SavedInstagramList: {
    type: "object",
    additionalProperties: false,
    required: ["listId", "name", "updatedAt", "total"],
    properties: {
      listId: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      name: {
        type: "string",
      },
      updatedAt: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      total: {
        type: "integer",
        minimum: 0,
      },
    },
  },
  CompanyListInspectData: {
    type: "object",
    additionalProperties: true,
    required: ["listId", "name", "total", "companies", "nextOffset"],
    properties: {
      channelCounts: {
        type: "object",
        additionalProperties: false,
        required: ["instagram", "facebook", "linkedin"],
        properties: {
          instagram: {
            type: "integer",
            minimum: 0,
          },
          facebook: {
            type: "integer",
            minimum: 0,
          },
          linkedin: {
            type: "integer",
            minimum: 0,
          },
          email: {
            type: "integer",
            minimum: 0,
          },
          sms: {
            type: "integer",
            minimum: 0,
          },
        },
      },
      listId: {
        type: "string",
      },
      name: {
        type: "string",
      },
      total: {
        type: "integer",
        minimum: 0,
      },
      expectedUpdatedAt: {
        type: "string",
      },
      companies: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
      nextOffset: {
        type: ["integer", "null"],
      },
    },
    description:
      "Read paginated company identities and available contact routes from a saved company list. Echo expectedUpdatedAt on subsequent pages. Use company_inspect for the current full research profile.",
  },
  ListTargetRemoveResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            const: "list.target.remove",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/ListTargetRemoveData",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  ListTargetRemoveData: {
    type: "object",
    additionalProperties: false,
    required: ["list", "username", "removed", "present"],
    properties: {
      list: {
        $ref: "#/$defs/SavedInstagramList",
      },
      username: {
        type: "string",
        minLength: 1,
        maxLength: 30,
      },
      removed: {
        type: "boolean",
      },
      present: {
        const: false,
      },
    },
  },
  CampaignDraftPrepareResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            const: "campaign.draft.prepare",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/CampaignDraftPrepareData",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  CampaignDraftPrepareData: {
    type: "object",
    additionalProperties: false,
    required: [
      "campaignId",
      "listId",
      "campaignUpdatedAt",
      "listUpdatedAt",
      "name",
      "status",
      "enabled",
      "channel",
      "channels",
      "linkedinInviteNote",
      "targetCount",
      "audienceCount",
      "messageVariants",
      "dailyCap",
      "pacingSeconds",
      "onlyNewChats",
      "skipPreviouslyMessaged",
      "created",
      "replayed",
    ],
    properties: {
      campaignId: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      listId: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      campaignUpdatedAt: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      listUpdatedAt: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      name: {
        type: "string",
      },
      status: {
        const: "Draft",
      },
      enabled: {
        const: false,
      },
      channel: {
        type: "string",
        enum: ["instagram", "facebook", "linkedin", "gmail", "sms", "multichannel"],
      },
      channels: {
        type: "array",
        minItems: 1,
        maxItems: 5,
        items: {
          type: "string",
          enum: ["instagram", "facebook", "linkedin", "gmail", "sms"],
        },
      },
      gmailSubject: {
        type: "string",
        minLength: 1,
        maxLength: 500,
        description:
          "Email subject shared by all messageVariants, which become the email body variants.",
      },
      gmailRecipientConsentConfirmed: {
        const: true,
        description: "Explicit user confirmation of recipient permission, required for email.",
      },
      mailboxIds: {
        type: "array",
        minItems: 1,
        maxItems: 8,
        items: {
          $ref: "#/$defs/ResourceId",
        },
      },
      smsBody: {
        type: "string",
        minLength: 1,
        maxLength: 1600,
        description: "Separate SMS message, required when SMS is selected.",
      },
      linkedinInviteNote: {
        type: "string",
        maxLength: 300,
      },
      targetCount: {
        type: "integer",
        minimum: 0,
      },
      audienceCount: {
        type: "integer",
        minimum: 1,
      },
      messageVariants: {
        description:
          "Up to 1000 characters per variant, or 1600 for SMS-only drafts. SMS sends the separate smsBody.",
        type: "array",
        minItems: 1,
        maxItems: 4,
        items: {
          type: "string",
          minLength: 1,
          maxLength: 1600,
        },
      },
      dailyCap: {
        type: "integer",
        minimum: 1,
        maximum: 2147483647,
      },
      pacingSeconds: {
        type: "integer",
        minimum: 12,
        maximum: 3600,
      },
      onlyNewChats: {
        type: "boolean",
      },
      skipPreviouslyMessaged: {
        type: "boolean",
      },
      created: {
        type: "boolean",
      },
      replayed: {
        type: "boolean",
      },
      suppressedCount: {
        type: "integer",
        minimum: 0,
      },
    },
  },
  CampaignDraftUpdateResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            const: "campaign.draft.update",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/CampaignDraftUpdateData",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  CampaignDraftUpdateData: {
    type: "object",
    additionalProperties: false,
    required: [
      "campaignId",
      "listId",
      "campaignUpdatedAt",
      "name",
      "status",
      "enabled",
      "channel",
      "channels",
      "targetCount",
      "messageVariants",
      "dailyCap",
      "pacingSeconds",
      "onlyNewChats",
      "skipPreviouslyMessaged",
      "instagramSendingWindowEnabled",
      "instagramSendingWindowStartMinute",
      "instagramSendingWindowEndMinute",
      "instagramSendingWindowWeekdays",
      "timezone",
    ],
    properties: {
      campaignId: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      listId: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      campaignUpdatedAt: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      name: {
        type: "string",
      },
      status: {
        const: "Draft",
      },
      enabled: {
        const: false,
      },
      channel: {
        type: "string",
        enum: ["instagram", "facebook", "linkedin", "gmail", "sms", "multichannel"],
      },
      channels: {
        type: "array",
        minItems: 1,
        maxItems: 5,
        items: {
          type: "string",
          enum: ["instagram", "facebook", "linkedin", "gmail", "sms"],
        },
      },
      description: {
        type: "string",
      },
      linkedinInviteMode: {
        type: "string",
        enum: ["invite_only", "invite_with_note"],
      },
      linkedinInviteNote: {
        type: "string",
      },
      followUpSequence: {
        type: ["object", "null"],
        additionalProperties: true,
      },
      linkedinFollowUpSequence: {
        type: ["object", "null"],
        additionalProperties: true,
      },
      targetCount: {
        type: "integer",
        minimum: 0,
      },
      messageVariants: {
        type: "array",
        minItems: 1,
        maxItems: 4,
        items: {
          type: "string",
          minLength: 1,
          maxLength: 1000,
        },
      },
      dailyCap: {
        type: "integer",
        minimum: 1,
        maximum: 2147483647,
      },
      pacingSeconds: {
        type: "integer",
        minimum: 12,
        maximum: 3600,
      },
      onlyNewChats: {
        type: "boolean",
      },
      skipPreviouslyMessaged: {
        type: "boolean",
      },
      instagramSendingWindowEnabled: {
        type: "boolean",
      },
      instagramSendingWindowStartMinute: {
        type: "integer",
        minimum: 0,
        maximum: 1380,
      },
      instagramSendingWindowEndMinute: {
        type: "integer",
        minimum: 60,
        maximum: 1440,
      },
      instagramSendingWindowWeekdays: {
        type: "integer",
        minimum: 1,
        maximum: 127,
      },
      sendingWindow: {
        $ref: "#/$defs/SendingWindow",
      },
      timezone: {
        type: "string",
      },
    },
  },
  SendingWindow: {
    type: "object",
    additionalProperties: false,
    description:
      "Channel-neutral local sending window. Weekdays are ISO 1-7 and default to Monday-Friday.",
    required: ["timezone", "start", "end"],
    properties: {
      timezone: {
        type: "string",
        minLength: 1,
        maxLength: 80,
      },
      start: {
        type: "string",
        pattern: "^(?:[01]\\d|2[0-3]):[0-5]\\d$",
      },
      end: {
        type: "string",
        pattern: "^(?:(?:[01]\\d|2[0-3]):[0-5]\\d|24:00)$",
      },
      weekdays: {
        type: "array",
        minItems: 1,
        maxItems: 7,
        items: {
          type: "integer",
          minimum: 1,
          maximum: 7,
        },
      },
    },
  },
  ListImportResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            const: "list.import",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/ListImportData",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  ListImportData: {
    type: "object",
    additionalProperties: false,
    required: [
      "listId",
      "name",
      "created",
      "replayed",
      "importedCount",
      "inputCount",
      "duplicateCount",
    ],
    properties: {
      listId: {
        type: "string",
      },
      name: {
        type: "string",
      },
      created: {
        type: "boolean",
      },
      replayed: {
        type: "boolean",
      },
      importedCount: {
        type: "integer",
        minimum: 1,
        maximum: 1000,
      },
      inputCount: {
        type: "integer",
        minimum: 1,
        maximum: 1000,
      },
      duplicateCount: {
        type: "integer",
        minimum: 0,
        maximum: 999,
      },
    },
  },
  LeadsAddResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            const: "leads.add",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/LeadsAddData",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  LeadsAddData: {
    type: "object",
    additionalProperties: false,
    required: ["preview", "skipped"],
    properties: {
      preview: {
        type: "boolean",
      },
      campaign: {
        type: "object",
        additionalProperties: false,
        required: ["id", "status", "willReopen"],
        properties: {
          id: {
            type: "string",
          },
          status: {
            type: "string",
          },
          willReopen: {
            type: "boolean",
          },
        },
      },
      list: {
        type: "object",
        additionalProperties: false,
        required: ["id", "current", "afterAdd"],
        properties: {
          id: {
            type: "string",
          },
          current: {
            type: "integer",
            minimum: 0,
          },
          afterAdd: {
            type: "integer",
            minimum: 0,
          },
          willCopy: {
            type: "boolean",
          },
        },
      },
      toAdd: {
        type: "integer",
        minimum: 0,
      },
      added: {
        type: "integer",
        minimum: 0,
      },
      skipped: {
        type: "object",
        additionalProperties: false,
        required: [
          "duplicate",
          "replied",
          "excluded",
          "suppressed",
          "priorContact",
          "pending",
          "noChannel",
        ],
        properties: {
          duplicate: {
            type: "integer",
            minimum: 0,
          },
          replied: {
            type: "integer",
            minimum: 0,
          },
          excluded: {
            type: "integer",
            minimum: 0,
          },
          suppressed: {
            type: "integer",
            minimum: 0,
          },
          priorContact: {
            type: "integer",
            minimum: 0,
          },
          pending: {
            type: "integer",
            minimum: 0,
          },
          noChannel: {
            type: "integer",
            minimum: 0,
          },
        },
      },
      sourceRemaining: {
        type: "integer",
        minimum: 0,
      },
      confirmToken: {
        type: "string",
      },
      expiresAt: {
        type: "string",
      },
      newTotal: {
        type: "integer",
        minimum: 0,
      },
      remaining: {
        type: "integer",
        minimum: 0,
      },
      campaignStatus: {
        type: "string",
      },
      targetGoal: {
        type: "integer",
        minimum: 0,
      },
      requestId: {
        type: "string",
      },
      started: {
        type: "boolean",
      },
      dedicatedListId: {
        type: "string",
      },
    },
  },
  ListPrepareResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "list.prepare",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/AgentHarnessResult",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  CampaignPrepareResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "campaign.prepare",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/AgentHarnessResult",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  CampaignLaunchPreflightResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "campaign.launch.preflight",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/CampaignActionPreflightOutput",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  CampaignActionPreflightOutput: {
    oneOf: [
      {
        $ref: "#/$defs/CampaignActionReadyOutput",
      },
      {
        $ref: "#/$defs/CampaignActionApprovalRequiredOutput",
      },
      {
        $ref: "#/$defs/CampaignLaunchSetupRequiredOutput",
      },
    ],
    discriminator: {
      propertyName: "status",
      mapping: {
        ready: "#/components/schemas/CampaignActionReadyOutput",
        approval_required: "#/components/schemas/CampaignActionApprovalRequiredOutput",
        setup_required: "#/components/schemas/CampaignLaunchSetupRequiredOutput",
      },
    },
  },
  CampaignActionReadyOutput: {
    type: "object",
    additionalProperties: false,
    required: ["status", "authorization"],
    properties: {
      status: {
        type: "string",
        const: "ready",
      },
      authorization: {
        $ref: "#/$defs/AgentActionAuthorization",
      },
    },
  },
  AgentActionAuthorization: {
    type: "object",
    additionalProperties: false,
    required: [
      "id",
      "action",
      "campaignId",
      "commandId",
      "confirmationCode",
      "status",
      "expiresAt",
      "approvedAt",
      "deniedAt",
      "consumedAt",
      "snapshot",
    ],
    properties: {
      id: {
        type: "string",
        pattern: "^agent_action_[a-f0-9]{32}$",
      },
      action: {
        $ref: "#/$defs/AgentCampaignAction",
      },
      campaignId: {
        type: "string",
      },
      commandId: {
        type: "string",
      },
      confirmationCode: {
        type: "string",
        pattern: "^[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$",
      },
      status: {
        type: "string",
        enum: ["pending", "approved", "denied", "consumed", "expired"],
      },
      expiresAt: {
        type: "string",
        format: "date-time",
      },
      approvedAt: {
        type: "string",
      },
      deniedAt: {
        type: "string",
      },
      consumedAt: {
        type: "string",
      },
      snapshot: {
        $ref: "#/$defs/AgentActionSnapshot",
      },
      approvalMethod: {
        type: "string",
        enum: ["in_app_approval", "connection_permission"],
      },
    },
  },
  AgentCampaignAction: {
    type: "string",
    enum: ["campaign.launch", "campaign.pause"],
  },
  AgentActionSnapshot: {
    type: "object",
    additionalProperties: false,
    required: [
      "campaignId",
      "campaignName",
      "campaignStatus",
      "campaignUpdatedAt",
      "targetListId",
      "targetCount",
      "channels",
      "dailyCap",
    ],
    properties: {
      campaignId: {
        type: "string",
      },
      campaignName: {
        type: "string",
      },
      campaignStatus: {
        $ref: "#/$defs/CampaignStatus",
      },
      campaignUpdatedAt: {
        type: "string",
        format: "date-time",
      },
      targetListId: {
        type: "string",
      },
      targetCount: {
        type: "integer",
        minimum: 0,
      },
      channels: {
        type: "array",
        items: {
          $ref: "#/$defs/TargetChannel",
        },
      },
      dailyCap: {
        type: "integer",
        minimum: 0,
      },
      deliveryNotice: {
        type: "string",
        maxLength: 1000,
        description:
          "Delivery restrictions the caller must disclose when summarizing the launch, including manual runs ending at local midnight.",
      },
    },
  },
  CampaignActionApprovalRequiredOutput: {
    type: "object",
    additionalProperties: false,
    required: ["status", "authorization", "approvalUrl"],
    properties: {
      status: {
        type: "string",
        const: "approval_required",
      },
      authorization: {
        $ref: "#/$defs/AgentActionAuthorization",
      },
      approvalUrl: {
        type: "string",
        pattern: "^https://|^http://(?:localhost|127\\.0\\.0\\.1|\\[::1\\])(?::[0-9]+)?(?:/|$)",
      },
    },
  },
  CampaignLaunchSetupRequiredOutput: {
    type: "object",
    additionalProperties: false,
    required: ["status", "setup"],
    properties: {
      status: {
        type: "string",
        const: "setup_required",
      },
      setup: {
        $ref: "#/$defs/BrowserWorkerSetupRequirement",
      },
    },
  },
  BrowserWorkerSetupRequirement: {
    type: "object",
    additionalProperties: false,
    required: [
      "code",
      "state",
      "setupUrl",
      "message",
      "userActionRequired",
      "campaignChannels",
      "resume",
    ],
    properties: {
      code: {
        type: "string",
        const: "browser_worker_required",
      },
      state: {
        type: "string",
        enum: ["not_connected", "offline"],
      },
      setupUrl: {
        type: "string",
        pattern: "^https://|^http://(?:localhost|127\\.0\\.0\\.1|\\[::1\\])(?::[0-9]+)?(?:/|$)",
      },
      message: {
        type: "string",
        minLength: 1,
        maxLength: 500,
      },
      userActionRequired: {
        type: "boolean",
        const: true,
      },
      campaignChannels: {
        type: "array",
        items: {
          $ref: "#/$defs/TargetChannel",
        },
      },
      resume: {
        $ref: "#/$defs/BrowserWorkerSetupResume",
      },
    },
  },
  BrowserWorkerSetupResume: {
    type: "object",
    additionalProperties: false,
    required: ["tool", "input"],
    properties: {
      tool: {
        type: "string",
        const: "campaign.launch.preflight",
      },
      input: {
        $ref: "#/$defs/CampaignActionPreflightInput",
      },
    },
  },
  CampaignActionPreflightInput: {
    type: "object",
    additionalProperties: false,
    required: ["campaignId", "idempotencyKey"],
    properties: {
      dryRun: {
        type: "boolean",
        description:
          "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      },
      campaignId: {
        $ref: "#/$defs/ResourceId",
      },
      idempotencyKey: {
        $ref: "#/$defs/IdempotencyKey",
      },
      runId: {
        type: "string",
        minLength: 1,
        maxLength: 100,
        description: "Optional run correlation. Also accepted as X-DMFaster-Run-Id.",
      },
    },
  },
  IdempotencyKey: {
    "x-dmfaster-trim": true,
    type: "string",
    minLength: 8,
    maxLength: 160,
    pattern: "^[A-Za-z0-9._:-]{8,160}$",
  },
  CampaignLaunchResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "campaign.launch",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/CampaignActionOutput",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  CampaignActionOutput: {
    type: "object",
    additionalProperties: false,
    required: ["action", "campaign", "authorizationId", "idempotencyKey", "replayed"],
    properties: {
      action: {
        $ref: "#/$defs/AgentCampaignAction",
      },
      campaign: {
        $ref: "#/$defs/AgentActionSnapshot",
      },
      authorizationId: {
        type: "string",
        pattern: "^agent_action_[a-f0-9]{32}$",
      },
      idempotencyKey: {
        $ref: "#/$defs/IdempotencyKey",
      },
      operation: {
        type: "object",
        additionalProperties: false,
        required: ["tool", "input"],
        properties: {
          tool: {
            type: "string",
            const: "campaign.operation.inspect",
          },
          input: {
            $ref: "#/$defs/CampaignOperationInspectInput",
          },
        },
      },
      replayed: {
        type: "boolean",
      },
    },
  },
  CampaignOperationInspectInput: {
    type: "object",
    additionalProperties: false,
    required: ["campaignId", "commandId"],
    properties: {
      campaignId: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      commandId: {
        type: "string",
        minLength: 1,
        maxLength: 160,
        pattern: "^[A-Za-z0-9._:-]+$",
      },
      runId: {
        type: "string",
        minLength: 1,
        maxLength: 100,
        description: "Optional run correlation. Also accepted as X-DMFaster-Run-Id.",
      },
    },
  },
  CampaignPausePreflightResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "campaign.pause.preflight",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/CampaignActionApprovalRequiredOutput",
                  },
                  {
                    $ref: "#/$defs/CampaignActionReadyOutput",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  CampaignPauseResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "campaign.pause",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/CampaignActionOutput",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  CompanyFiltersResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "companies.filters",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CompanyFiltersData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CompanyFiltersData: {
    type: "object",
    additionalProperties: true,
    properties: {
      metadata: {
        type: "object",
        additionalProperties: true,
        properties: {
          technologyAvailability: {
            oneOf: [
              {
                type: "object",
                required: ["country", "options"],
                properties: {
                  country: {
                    type: "string",
                  },
                  options: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["value", "companyCount"],
                      properties: {
                        value: {
                          type: "string",
                        },
                        companyCount: {
                          type: "integer",
                          minimum: 50,
                        },
                      },
                    },
                  },
                },
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
      filterFields: {
        type: "array",
        items: {
          type: "string",
        },
      },
      defaults: {
        $ref: "#/$defs/CompanySearchFilters",
      },
      technologies: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
          properties: {
            value: {
              type: "string",
            },
            label: {
              type: "string",
            },
          },
        },
      },
      technologyMatching: {
        type: "object",
        required: ["withinSubsection", "betweenSubsections", "groups"],
        properties: {
          withinSubsection: {
            type: "string",
            const: "any",
          },
          betweenSubsections: {
            type: "string",
            const: "all",
          },
          groups: {
            type: "array",
            items: {
              type: "object",
              required: ["key", "values"],
              properties: {
                key: {
                  type: "string",
                },
                values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
      fundingSources: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
          properties: {
            value: {
              type: "string",
            },
            label: {
              type: "string",
            },
          },
        },
      },
      availability: {
        type: "object",
        additionalProperties: {
          type: "boolean",
        },
      },
      restrictions: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    description:
      "Read all live Companies filter fields, country-specific options and restrictions. No campaign state required.",
  },
  CompanySearchFilters: {
    type: "object",
    additionalProperties: false,
    properties: {
      country: {
        $ref: "#/$defs/SupportedCountry",
      },
      countries: {
        type: "array",
        items: {
          $ref: "#/$defs/SupportedCountry",
        },
        maxItems: 32,
        minItems: 1,
      },
      q: {
        type: "string",
        maxLength: 120,
      },
      industryCodes: {
        type: "array",
        items: {
          type: "string",
          maxLength: 80,
        },
        maxItems: 8,
      },
      industryCodeSelections: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            classification: {
              const: "TOL",
            },
            version: {
              enum: ["2008", "2025"],
            },
            codes: {
              type: "array",
              items: {
                type: "string",
                maxLength: 5,
              },
              maxItems: 64,
            },
          },
          required: ["classification", "version", "codes"],
        },
        maxItems: 2,
      },
      tolCodes: {
        type: "array",
        items: {
          type: "string",
          maxLength: 80,
        },
        maxItems: 8,
      },
      companyForm: {
        type: "string",
        maxLength: 4096,
      },
      states: {
        type: "array",
        items: {
          type: "string",
          maxLength: 80,
        },
        maxItems: 32,
      },
      cities: {
        type: "array",
        items: {
          type: "string",
          maxLength: 80,
        },
        maxItems: 32,
      },
      registrationDateEnabled: {
        type: "boolean",
      },
      registrationDateStart: {
        type: "string",
        maxLength: 10,
      },
      registrationDateEnd: {
        type: "string",
        maxLength: 10,
      },
      businessIdRegistrationStart: {
        type: "string",
        maxLength: 10,
      },
      businessIdRegistrationEnd: {
        type: "string",
        maxLength: 10,
      },
      revenueMinEur: {
        type: "string",
        maxLength: 16,
      },
      revenueMaxEur: {
        type: "string",
        maxLength: 16,
      },
      employeeRanges: {
        type: "array",
        items: {
          type: "string",
          maxLength: 80,
        },
        maxItems: 32,
      },
      employeeMin: {
        type: "string",
        maxLength: 10,
      },
      employeeMax: {
        type: "string",
        maxLength: 10,
      },
      technologies: {
        type: "array",
        description:
          "Match any selected technology within each technology subsection and every selected subsection. Country picker options require at least 50 active companies; explicit saved criteria remain executable.",
        items: {
          type: "string",
          maxLength: 80,
        },
        maxItems: 40,
      },
      websiteFacts: {
        type: "array",
        description:
          "Positive-only saved Finnish website classifications with non-exhaustive coverage. Multiple selected facts must all match. b2c is a provisional consumer-targeting candidate; b2b and saas are independently scored positive candidates. Omission applies no website-fact restriction; absence is not a negative classification. Available only for Finnish audiences.",
        items: {
          type: "string",
          enum: ["b2c", "b2b", "saas"],
        },
        maxItems: 3,
      },
      hasExhibitionParticipation: {
        type: "boolean",
      },
      exhibitionEventKeys: {
        type: "array",
        items: {
          type: "string",
          maxLength: 160,
        },
        maxItems: 32,
      },
      exhibitionMinEditions: {
        type: "string",
        maxLength: 8,
      },
      hasActiveHiring: {
        type: "boolean",
        description:
          "Require verified open employer job postings in Finland. False removes this requirement; it does not mean not hiring. Unavailable or stale recruitment publications fail closed.",
      },
      hiringTitleQuery: {
        type: "string",
        maxLength: 120,
        description:
          "Literal case-insensitive title substring on the same verified open employer posting. Implies hasActiveHiring. Finland only.",
      },
      hasPublicFunding: {
        type: "boolean",
      },
      fundingSources: {
        type: "array",
        items: {
          type: "string",
          maxLength: 40,
        },
        maxItems: 5,
      },
      fundingFromYear: {
        type: "string",
        maxLength: 4,
      },
      googleAdsActivityWindow: {
        enum: [null, "last_30_days", "last_90_days", "last_12_months"],
      },
      metaAdsActiveOnly: {
        type: "boolean",
      },
      metaAdsMinimumEuReach: {
        type: "string",
        maxLength: 10,
      },
      metaAdsTargetAge: {
        type: "string",
        maxLength: 3,
      },
      metaAdsTargetGender: {
        enum: ["", "all", "men", "women"],
      },
      metaAdsTargetLocation: {
        type: "string",
        maxLength: 80,
      },
      metaAdsIncludeUncorroborated: {
        type: "boolean",
      },
      hasWebsite: {
        type: "boolean",
      },
      activeOnly: {
        type: "boolean",
      },
      includeUnknownSize: {
        type: "boolean",
        description:
          "Keep companies whose employee count is unknown when a size bound is supplied. Default true, except a minimum with no maximum, which counts published employee counts unless this is true. The same rule as prospect_query; matchedKnown and matchedIncludingUnknown are reported.",
      },
      includeUnknownRevenue: {
        type: "boolean",
        description:
          "Keep companies without a published revenue when a revenue bound is supplied. Default true, except a minimum with no maximum, which counts published revenue unless this is true. The same rule as prospect_query; unknownRevenue is reported.",
      },
    },
    description:
      "Every filter supported by the Companies app. Numeric bounds use decimal strings, dates YYYY-MM-DD; empty values disable filters. Call companies_filters for country-specific options. Saved website classifications are positive-only with non-exhaustive coverage and currently Finnish; absent classifications do not imply a negative. Unsupported or discarded criteria are rejected.",
  },
  CompanySuggestionsResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "companies.suggest",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CompanySuggestionsData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CompanySuggestionsData: {
    type: "object",
    additionalProperties: false,
    required: ["query", "suggestions"],
    properties: {
      query: {
        type: "string",
      },
      suggestions: {
        type: "array",
        maxItems: 10,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["country", "businessId", "name"],
          properties: {
            country: {
              $ref: "#/$defs/SupportedCountry",
            },
            businessId: {
              type: "string",
              minLength: 1,
              maxLength: 192,
            },
            name: {
              type: "string",
            },
          },
        },
      },
    },
    description:
      "Bounded entity suggestions only. There is deliberately no total, audience size, cursor or claim of complete coverage.",
  },
  ProspectQueryResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "prospect.query",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ProspectQueryData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  ProspectQueryData: {
    type: "object",
    additionalProperties: false,
    required: ["resolved", "totals", "columns", "rows", "nextCursor", "querySignature"],
    properties: {
      status: {
        type: "string",
        enum: ["ok", "partial", "needs_clarification", "too_large"],
        description:
          "needs_clarification means the ICP named no single industry and nothing was searched; pick one clarification option. too_large means more than 200,000 companies match. partial means part of the ICP was not applied (droppedTerms); totals are exact for the applied part only.",
      },
      droppedTerms: {
        type: "array",
        maxItems: 20,
        description: "ICP terms that were not applied. Present only when status is partial.",
        items: {
          type: "string",
          maxLength: 80,
        },
      },
      sourceUnavailable: {
        type: "array",
        maxItems: 5,
        description: "Data sources that were unavailable, so their terms were dropped.",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["source", "term", "reason"],
          properties: {
            source: {
              type: "string",
              enum: ["recruitment"],
            },
            term: {
              type: "string",
              maxLength: 80,
            },
            reason: {
              type: "string",
              maxLength: 300,
            },
          },
        },
      },
      chBits: {
        type: "string",
        maxLength: 300,
        description: "Legend for the ch column bitmask; sendable routes and contact-only data.",
      },
      clarification: {
        type: "object",
        additionalProperties: false,
        required: ["question", "options"],
        properties: {
          question: {
            type: "string",
            maxLength: 300,
          },
          options: {
            type: "array",
            maxItems: 6,
            description:
              "Each option keeps the rest of the ICP. matched is its exact total before contact exclusions, or null when unavailable or above 200,000. Re-run with querySignature or pass industries.",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["label", "industries", "matched"],
              properties: {
                label: {
                  type: "string",
                  maxLength: 80,
                },
                industries: {
                  type: "array",
                  maxItems: 1,
                  items: {
                    type: "string",
                    maxLength: 80,
                  },
                },
                matched: {
                  oneOf: [
                    {
                      type: "integer",
                      minimum: 0,
                    },
                    {
                      type: "null",
                    },
                  ],
                },
                matchedKnown: {
                  type: "integer",
                  minimum: 0,
                },
                querySignature: {
                  type: "string",
                  maxLength: 12000,
                },
              },
            },
          },
        },
      },
      resolved: {
        type: "object",
        additionalProperties: false,
        required: ["country", "activeOnly", "channel", "evidence", "labelSource"],
        properties: {
          country: {
            $ref: "#/$defs/SupportedCountry",
          },
          activeOnly: {
            type: "boolean",
          },
          industries: {
            type: "array",
            maxItems: 8,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["label", "labelSource"],
              properties: {
                label: {
                  type: "string",
                  maxLength: 80,
                },
                labelSource: {
                  type: "string",
                  enum: ["code", "tech", "evidence"],
                },
                labelPublished: {
                  type: "boolean",
                  description:
                    "True only when this segment's coverage is complete. SaaS stays false.",
                },
                evidence: {
                  type: "string",
                  enum: ["not_checked"],
                },
              },
            },
          },
          regions: {
            type: "array",
            maxItems: 19,
            items: {
              type: "string",
              maxLength: 80,
            },
          },
          cities: {
            type: "array",
            maxItems: 32,
            items: {
              type: "string",
              maxLength: 80,
            },
          },
          employees: {
            type: "object",
            additionalProperties: false,
            properties: {
              min: {
                type: "integer",
                minimum: 0,
              },
              max: {
                type: "integer",
                minimum: 0,
              },
              unknown: {
                type: "string",
                enum: ["include", "exclude", "only"],
              },
            },
          },
          revenueEur: {
            type: "object",
            additionalProperties: false,
            properties: {
              min: {
                type: "integer",
                minimum: 0,
              },
              max: {
                type: "integer",
                minimum: 0,
              },
              unknown: {
                type: "string",
                enum: ["include", "exclude"],
              },
            },
          },
          technologies: {
            type: "array",
            maxItems: 8,
            items: {
              type: "string",
              maxLength: 40,
            },
          },
          websiteFacts: {
            type: "array",
            maxItems: 3,
            items: {
              type: "string",
              enum: ["b2c", "b2b", "saas"],
            },
          },
          evidence: {
            type: "string",
            enum: ["annotate", "require", "include_evidence_only"],
          },
          channel: {
            type: "string",
            enum: ["none", "any", "linkedin", "email", "instagram", "facebook", "sms"],
          },
          labelSource: {
            type: "string",
            enum: ["code", "tech", "evidence"],
          },
          excludePreviouslyContacted: {
            type: "boolean",
          },
        },
      },
      totals: {
        type: "object",
        additionalProperties: false,
        required: ["exact"],
        properties: {
          exact: {
            type: "boolean",
          },
          reason: {
            type: "string",
            maxLength: 300,
          },
          matched: {
            type: "integer",
            minimum: 0,
          },
          withAnyChannel: {
            type: "integer",
            minimum: 0,
          },
          eligible: {
            type: "integer",
            minimum: 0,
          },
          matchedKnown: {
            type: "integer",
            minimum: 0,
            description: "Matches whose bounded employee count and revenue are both published.",
          },
          matchedIncludingUnknown: {
            type: "integer",
            minimum: 0,
            description: "Matches when unknown size and revenue are kept (the default).",
          },
          unknownSize: {
            type: "integer",
            minimum: 0,
          },
          unknownRevenue: {
            type: "integer",
            minimum: 0,
          },
          previouslyContacted: {
            type: "integer",
            minimum: 0,
          },
          neverContacted: {
            type: "integer",
            minimum: 0,
            description:
              "Matches with no contact history in this workspace (same rule as eligibleNeverContacted in the campaign path).",
          },
          saturation: {
            type: "string",
            enum: ["healthy", "saturated", "exhausted"],
          },
          evidencePositive: {
            type: "integer",
            minimum: 0,
          },
          evidenceUnassessed: {
            type: "integer",
            minimum: 0,
          },
          evidenceOnlyAvailable: {
            type: "integer",
            minimum: 0,
          },
        },
      },
      columns: {
        type: "array",
        maxItems: 16,
        items: {
          type: "string",
          maxLength: 40,
        },
      },
      rows: {
        type: "array",
        maxItems: 1000,
        items: {
          type: "array",
          maxItems: 16,
          items: {
            oneOf: [
              {
                type: "string",
                maxLength: 300,
              },
              {
                type: "integer",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
      nextCursor: {
        type: "string",
        maxLength: 12000,
      },
      querySignature: {
        type: "string",
        maxLength: 12000,
      },
      campaignFilters: {
        description:
          "Exact filters for prospecting_preview and campaign_draft_plan; their inventoryTotal equals matched before contact exclusions. Null when the ICP cannot be expressed as filters.",
        oneOf: [
          {
            $ref: "#/$defs/CompanySearchFilters",
          },
          {
            type: "null",
          },
        ],
      },
      notes: {
        type: "array",
        maxItems: 24,
        items: {
          type: "string",
          maxLength: 500,
        },
      },
      export: {
        type: "null",
      },
    },
  },
  CompanySearchResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "companies.search",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CompanySearchData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CompanySearchData: {
    type: "object",
    additionalProperties: true,
    required: [
      "companies",
      "filters",
      "total",
      "totalExact",
      "page",
      "pageSize",
      "hasNextPage",
      "querySignature",
      "expectedRevision",
    ],
    properties: {
      qualification: {
        type: "object",
        additionalProperties: false,
        required: ["basis", "offeringFit", "contactAffiliation", "guidance"],
        properties: {
          basis: {
            type: "string",
            const: "published_filters",
          },
          offeringFit: {
            type: "string",
            const: "not_assessed",
          },
          contactAffiliation: {
            type: "string",
            const: "not_verified",
          },
          guidance: {
            type: "string",
          },
        },
        description:
          "Search matches saved filters; it does not independently qualify the offering, buyer type, or current contact employment. Exact totals refer to the published inventory.",
      },
      projection: {
        type: "string",
        enum: ["list", "rich"],
      },
      companies: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
          required: ["country", "businessId", "name"],
          properties: {
            country: {
              $ref: "#/$defs/SupportedCountry",
            },
            businessId: {
              type: "string",
            },
            name: {
              type: "string",
            },
            websiteContacts: {
              type: "array",
              maxItems: 80,
              items: {
                $ref: "#/$defs/CompanyWebsiteContact",
              },
            },
          },
        },
      },
      filters: {
        $ref: "#/$defs/CompanySearchFilters",
      },
      total: {
        type: "integer",
        minimum: 0,
      },
      totalExact: {
        type: "boolean",
        const: true,
      },
      page: {
        type: "integer",
      },
      pageSize: {
        type: "integer",
      },
      hasNextPage: {
        type: "boolean",
      },
      nextCursor: {
        type: "string",
      },
      dataFreshness: {
        type: "object",
        additionalProperties: true,
      },
      querySignature: {
        type: "string",
      },
      expectedRevision: {
        type: "string",
      },
    },
    description:
      "Search the same company inventory and filters as the live app. Rich rows are the default; projection list returns compact app rows. Both preserve the exact total and pagination identity. Echo querySignature and expectedRevision on subsequent pages.",
  },
  CompanyWebsiteContact: {
    type: "object",
    additionalProperties: false,
    required: ["channel", "value", "sourceUrl"],
    description:
      "Retained website-observed contact evidence with unconfirmed ownership. Display only; this does not establish a person association or campaign eligibility.",
    properties: {
      channel: {
        type: "string",
        enum: ["email", "phone"],
      },
      value: {
        type: "string",
        maxLength: 254,
      },
      sourceUrl: {
        type: "string",
        pattern: "^https://",
      },
    },
  },
  CompanyEvidenceSearchResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "companies.evidence.search",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CompanyEvidenceSearchData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CompanyEvidenceSearchData: {
    type: "object",
    additionalProperties: false,
    properties: {
      companies: {
        type: "array",
        items: {
          $ref: "#/$defs/WebsiteEvidenceCompany",
        },
        minItems: 0,
        maxItems: 20,
      },
      appliedCriteria: {
        type: "array",
        items: {
          $ref: "#/$defs/WebsiteEvidenceCriterion",
        },
        minItems: 1,
        maxItems: 4,
      },
      appliedFilters: {
        anyOf: [
          {
            $ref: "#/$defs/CompanySearchFilters",
          },
          {
            type: "null",
          },
        ],
      },
      unresolvedCriteria: {
        type: "array",
        items: {
          type: "string",
          minLength: 1,
          maxLength: 60,
        },
        minItems: 0,
        maxItems: 4,
      },
      query: {
        type: "string",
        minLength: 1,
        maxLength: 1500,
      },
      country: {
        type: "string",
      },
      querySignature: {
        type: "string",
        minLength: 1,
        maxLength: 200,
      },
      expectedRevision: {
        type: "string",
        minLength: 1,
        maxLength: 200,
      },
      expiresAt: {
        type: "string",
        format: "date-time",
      },
      hasNextPage: {
        type: "boolean",
      },
      nextCursor: {
        type: "string",
      },
      total: {
        type: "null",
      },
      totalExact: {
        type: "boolean",
        const: false,
      },
      totalStatus: {
        type: "string",
        const: "unavailable",
      },
      coverage: {
        type: "object",
        additionalProperties: false,
        properties: {
          mode: {
            type: "string",
            const: "text_shortlist",
          },
          exhaustive: {
            type: "boolean",
            const: false,
          },
          retrievedCompanies: {
            type: "integer",
            minimum: 0,
          },
          evaluatedCompanies: {
            type: "integer",
            minimum: 0,
          },
          corpusCompanies: {
            type: "integer",
            minimum: 0,
          },
          verification: {
            type: "string",
            const: "jev",
          },
          limitations: {
            type: "array",
            items: {
              type: "string",
              minLength: 1,
              maxLength: 600,
            },
            minItems: 0,
            maxItems: 100,
          },
        },
        required: [
          "mode",
          "exhaustive",
          "retrievedCompanies",
          "evaluatedCompanies",
          "corpusCompanies",
          "verification",
          "limitations",
        ],
      },
      timing: {
        type: "object",
        additionalProperties: false,
        properties: {
          retrievalMs: {
            type: "number",
          },
          providerRequests: {
            type: "integer",
            minimum: 0,
            maximum: 30,
          },
          verificationMs: {
            type: "number",
          },
          cached: {
            type: "boolean",
          },
        },
        required: ["retrievalMs", "providerRequests", "verificationMs", "cached"],
      },
    },
    required: [
      "companies",
      "appliedCriteria",
      "appliedFilters",
      "unresolvedCriteria",
      "query",
      "country",
      "querySignature",
      "expectedRevision",
      "expiresAt",
      "hasNextPage",
      "nextCursor",
      "total",
      "totalExact",
      "totalStatus",
      "coverage",
      "timing",
    ],
  },
  WebsiteEvidenceCompany: {
    type: "object",
    additionalProperties: false,
    properties: {
      country: {
        type: "string",
      },
      businessId: {
        type: "string",
        minLength: 1,
        maxLength: 192,
      },
      name: {
        type: "string",
      },
      websiteUrl: {
        type: "string",
      },
      selection: {
        oneOf: [
          {
            type: "object",
            additionalProperties: false,
            description:
              "Ready input item for companies_list_prepare, using its shared current-profile revision contract.",
            properties: {
              country: {
                $ref: "#/$defs/SupportedCountry",
              },
              businessId: {
                type: "string",
                minLength: 1,
                maxLength: 192,
              },
              expectedRevision: {
                type: "string",
                minLength: 64,
                maxLength: 64,
              },
            },
            required: ["country", "businessId", "expectedRevision"],
          },
          {
            type: "null",
          },
        ],
      },
      passages: {
        type: "array",
        description:
          "Fresh original retrieved passages for independent assistant inspection, including unknown cases.",
        items: {
          $ref: "#/$defs/WebsiteEvidenceQuote",
        },
        minItems: 0,
        maxItems: 6,
      },
      matches: {
        type: "boolean",
      },
      criteria: {
        type: "array",
        items: {
          $ref: "#/$defs/WebsiteCriterionJudgment",
        },
        minItems: 1,
        maxItems: 4,
      },
    },
    required: [
      "country",
      "businessId",
      "name",
      "websiteUrl",
      "passages",
      "matches",
      "selection",
      "criteria",
    ],
  },
  WebsiteEvidenceQuote: {
    type: "object",
    additionalProperties: false,
    properties: {
      url: {
        type: "string",
        pattern: "^https://",
      },
      observedAt: {
        type: "string",
        format: "date-time",
      },
      contentHash: {
        type: "string",
        minLength: 1,
        maxLength: 64,
      },
      heading: {
        type: "string",
      },
      text: {
        type: "string",
        minLength: 1,
        maxLength: 1800,
      },
      language: {
        type: "string",
        minLength: 1,
        maxLength: 35,
      },
      extractionVersion: {
        type: "string",
        minLength: 1,
        maxLength: 100,
      },
    },
    required: [
      "url",
      "observedAt",
      "contentHash",
      "heading",
      "text",
      "language",
      "extractionVersion",
    ],
  },
  WebsiteCriterionJudgment: {
    type: "object",
    additionalProperties: false,
    properties: {
      criterionId: {
        type: "string",
        minLength: 1,
        maxLength: 60,
      },
      status: {
        type: "string",
        enum: ["supported", "inferred", "portfolio", "contradicted", "unknown"],
      },
      probability: {
        type: "number",
        minimum: 0,
        maximum: 1,
      },
      reason: {
        type: "string",
        minLength: 1,
        maxLength: 500,
      },
      binary: {
        type: "object",
        additionalProperties: false,
        description:
          "Decision on the supplied evidence, not proof of absence. Original quotes are context samples, not selected supporting citations. A review flag blocks automatic matching.",
        properties: {
          value: {
            type: "boolean",
          },
          probabilityTrue: {
            type: "number",
            minimum: 0,
            maximum: 1,
          },
          reviewRequired: {
            type: "boolean",
          },
          coverage: {
            type: "object",
            additionalProperties: false,
            properties: {
              retainedPassages: {
                type: "integer",
                minimum: 1,
              },
              includedPassages: {
                type: "integer",
                minimum: 1,
              },
              complete: {
                type: "boolean",
              },
            },
            required: ["retainedPassages", "includedPassages", "complete"],
          },
        },
        required: ["value", "probabilityTrue", "reviewRequired", "coverage"],
      },
      evidence: {
        type: "array",
        items: {
          $ref: "#/$defs/WebsiteEvidenceQuote",
        },
        minItems: 0,
        maxItems: 3,
      },
    },
    required: ["criterionId", "status", "probability", "reason", "evidence"],
  },
  WebsiteEvidenceCriterion: {
    type: "object",
    additionalProperties: false,
    properties: {
      id: {
        type: "string",
        minLength: 1,
        maxLength: 60,
      },
      statement: {
        type: "string",
        minLength: 1,
        maxLength: 800,
      },
      requirement: {
        type: "string",
        enum: ["advertised", "any_support"],
      },
      retrievalTerms: {
        description:
          "Optional source-language hints for complete scans; use an empty array for binary website judgments without keyword gates. Fast shortlist previews still require retrieval terms.",
        type: "array",
        items: {
          type: "string",
          minLength: 1,
          maxLength: 100,
        },
        minItems: 0,
        maxItems: 12,
      },
      retrievalGroups: {
        description:
          "Optional required concept groups for precise retrieval. Synonyms are ORed within each group; all groups must occur in one original heading/passage context. For relationships split across passages, omit groups and broaden retrievalTerms explicitly. JEV still verifies the complete criterion.",
        type: "array",
        minItems: 2,
        maxItems: 4,
        items: {
          type: "array",
          minItems: 1,
          maxItems: 12,
          items: {
            type: "string",
            minLength: 1,
            maxLength: 100,
          },
        },
      },
    },
    required: ["id", "statement", "requirement", "retrievalTerms"],
  },
  WorkspaceCompanyKnowledgeResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "companies.knowledge.search",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/WorkspaceCompanyKnowledgeData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  WorkspaceCompanyKnowledgeData: {
    type: "object",
    additionalProperties: false,
    required: [
      "scope",
      "source",
      "revision",
      "publicationRevision",
      "query",
      "facets",
      "total",
      "totalExact",
      "page",
      "pageSize",
      "hasNextPage",
      "reviewedCompanies",
      "currentlyEligibleCompanies",
      "companies",
      "limitations",
    ],
    properties: {
      scope: {
        type: "string",
        const: "owner_workspace",
      },
      source: {
        type: "string",
        const: "reviewed_saved_websites",
      },
      revision: {
        type: "string",
      },
      publicationRevision: {
        type: "string",
      },
      query: {
        type: "string",
      },
      facets: {
        type: "array",
        items: {
          type: "string",
        },
      },
      total: {
        type: "integer",
        minimum: 0,
      },
      totalExact: {
        type: "boolean",
        const: true,
      },
      page: {
        type: "integer",
      },
      pageSize: {
        type: "integer",
      },
      hasNextPage: {
        type: "boolean",
      },
      reviewedCompanies: {
        type: "integer",
      },
      currentlyEligibleCompanies: {
        type: "integer",
      },
      companies: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["country", "businessId", "name", "websiteUrl", "facets", "evidence"],
          properties: {
            country: {
              type: "string",
              const: "FI",
            },
            businessId: {
              type: "string",
            },
            name: {
              type: "string",
            },
            websiteUrl: {
              type: "string",
            },
            facets: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                required: ["id", "definition"],
                properties: {
                  id: {
                    type: "string",
                  },
                  definition: {
                    type: "string",
                  },
                },
              },
            },
            evidence: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                required: [
                  "url",
                  "text",
                  "observedAt",
                  "contentHash",
                  "reviewedAt",
                  "review",
                  "requestHash",
                ],
                properties: {
                  url: {
                    type: "string",
                  },
                  text: {
                    type: "string",
                  },
                  observedAt: {
                    type: "string",
                  },
                  contentHash: {
                    type: "string",
                  },
                  reviewedAt: {
                    type: "string",
                  },
                  review: {
                    type: "string",
                  },
                  requestHash: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
      limitations: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
  },
  CompanyKnowledgeResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "companies.knowledge",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CompanyKnowledgeData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CompanyKnowledgeData: {
    type: "object",
    additionalProperties: false,
    properties: {
      ownerVerified: {
        oneOf: [
          {
            $ref: "#/$defs/WorkspaceCompanyKnowledgeData",
          },
          {
            type: "null",
          },
        ],
      },
      company: {
        type: "object",
        additionalProperties: false,
        properties: {
          country: {
            type: "string",
            enum: ["FI"],
          },
          businessId: {
            type: "string",
            minLength: 1,
            maxLength: 192,
          },
          name: {
            type: "string",
          },
          websiteUrl: {
            type: "string",
          },
        },
        required: ["country", "businessId", "name", "websiteUrl"],
      },
      knowledgeRevision: {
        type: "string",
        minLength: 64,
        maxLength: 64,
      },
      asOf: {
        type: "string",
        format: "date-time",
      },
      maxAgeDays: {
        type: "integer",
        minimum: 1,
        maximum: 90,
      },
      sourceStatus: {
        type: "string",
        enum: ["available", "missing", "stale", "requires_complete_scan"],
      },
      sourceEvidence: {
        description:
          "Original saved evidence independent of cached model judgments, with exact pagination. Null when no fresh bounded source can be validated. Passages are unassessed and may describe customers, partners or former employers rather than this company's own offering.",
        oneOf: [
          {
            $ref: "#/$defs/CompanyKnowledgeSources",
          },
          {
            type: "null",
          },
        ],
      },
      coverage: {
        oneOf: [
          {
            $ref: "#/$defs/CompanyKnowledgeCoverage",
          },
          {
            type: "null",
          },
        ],
      },
      facts: {
        type: "array",
        minItems: 7,
        maxItems: 8,
        items: {
          $ref: "#/$defs/CompanyKnowledgeFact",
        },
      },
      limitations: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    required: [
      "company",
      "knowledgeRevision",
      "asOf",
      "maxAgeDays",
      "sourceStatus",
      "sourceEvidence",
      "coverage",
      "facts",
      "limitations",
    ],
  },
  CompanyKnowledgeSources: {
    type: "object",
    additionalProperties: false,
    properties: {
      evidenceKind: {
        type: "string",
        const: "unassessed_source",
      },
      page: {
        type: "integer",
        minimum: 1,
        maximum: 500,
      },
      pageSize: {
        type: "integer",
        minimum: 1,
        maximum: 20,
      },
      totalPassages: {
        type: "integer",
        minimum: 1,
        maximum: 500,
      },
      hasNextPage: {
        type: "boolean",
      },
      items: {
        type: "array",
        minItems: 1,
        maxItems: 20,
        items: {
          $ref: "#/$defs/WebsiteEvidenceQuote",
        },
      },
    },
    required: ["evidenceKind", "page", "pageSize", "totalPassages", "hasNextPage", "items"],
  },
  CompanyKnowledgeCoverage: {
    type: "object",
    additionalProperties: false,
    properties: {
      retainedPassages: {
        type: "integer",
        minimum: 1,
      },
      includedPassages: {
        type: "integer",
        minimum: 1,
      },
      complete: {
        type: "boolean",
      },
    },
    required: ["retainedPassages", "includedPassages", "complete"],
  },
  CompanyKnowledgeFact: {
    type: "object",
    additionalProperties: false,
    properties: {
      id: {
        type: "string",
        minLength: 1,
        maxLength: 60,
      },
      version: {
        type: "integer",
        const: 1,
      },
      question: {
        type: "string",
        minLength: 1,
        maxLength: 1000,
      },
      trueWhen: {
        type: "string",
        minLength: 1,
        maxLength: 2000,
      },
      offeringBuyer: {
        oneOf: [
          {
            type: "object",
            additionalProperties: false,
            properties: {
              offering: {
                type: "string",
                enum: [
                  "saas",
                  "software",
                  "professional_services",
                  "physical_goods",
                  "website_development",
                ],
              },
              buyerType: {
                type: "string",
                const: "businesses",
              },
              buyerIndustry: {
                oneOf: [
                  {
                    type: "string",
                    enum: ["construction"],
                  },
                  {
                    type: "null",
                  },
                ],
              },
            },
            required: ["offering", "buyerType", "buyerIndustry"],
          },
          {
            type: "null",
          },
        ],
      },
      assessment: {
        oneOf: [
          {
            $ref: "#/$defs/CompanyKnowledgeAssessment",
          },
          {
            type: "null",
          },
        ],
      },
    },
    required: ["id", "version", "question", "trueWhen", "offeringBuyer", "assessment"],
  },
  CompanyKnowledgeAssessment: {
    type: "object",
    additionalProperties: false,
    properties: {
      value: {
        type: "boolean",
      },
      probabilityTrue: {
        type: "number",
        minimum: 0,
        maximum: 1,
      },
      reviewRequired: {
        type: "boolean",
      },
      coverage: {
        $ref: "#/$defs/CompanyKnowledgeCoverage",
      },
      evaluatedAt: {
        type: "string",
        format: "date-time",
      },
      evidenceKind: {
        type: "string",
        const: "context_samples",
      },
      evidence: {
        type: "array",
        maxItems: 3,
        items: {
          $ref: "#/$defs/WebsiteEvidenceQuote",
        },
      },
    },
    required: [
      "value",
      "probabilityTrue",
      "reviewRequired",
      "coverage",
      "evaluatedAt",
      "evidenceKind",
      "evidence",
    ],
  },
  CompanyEvidenceStartResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "companies.evidence.start",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CompanyEvidenceRunData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CompanyEvidenceRunData: {
    type: "object",
    additionalProperties: false,
    properties: {
      runId: {
        type: "string",
      },
      expectedRevision: {
        type: "string",
      },
      querySignature: {
        type: "string",
      },
      status: {
        type: "string",
        enum: ["initializing", "running", "complete", "cancelled", "stale"],
      },
      scanComplete: {
        type: "boolean",
      },
      country: {
        type: "string",
        const: "FI",
      },
      query: {
        type: "string",
      },
      evaluationMode: {
        type: "string",
        enum: ["binary", "passage"],
      },
      factExpansion: {
        type: "string",
        enum: ["requested_only", "general"],
        description:
          "Binary question-expansion policy saved with this private run. New binary runs always include it. An older binary run with no field retains its original general expansion policy.",
      },
      appliedCriteria: {
        type: "array",
        minItems: 1,
        maxItems: 4,
        items: {
          $ref: "#/$defs/WebsiteEvidenceCriterion",
        },
      },
      appliedFilters: {
        anyOf: [
          {
            $ref: "#/$defs/CompanySearchFilters",
          },
          {
            type: "null",
          },
        ],
      },
      expiresAt: {
        type: "string",
        format: "date-time",
      },
      companies: {
        type: "array",
        minItems: 0,
        maxItems: 20,
        items: {
          $ref: "#/$defs/WebsiteEvidenceCompany",
        },
      },
      companiesIncluded: {
        type: "boolean",
        const: false,
        description:
          "Present and false only for progress-only status. The empty companies array does not mean there are no matches; nextCursor remains unconsumed.",
      },
      view: {
        type: "string",
        enum: ["matches", "unresolved", "all"],
      },
      nextCursor: {
        type: "string",
      },
      hasNextPage: {
        type: "boolean",
      },
      awaitingMoreResults: {
        type: "boolean",
      },
      total: {
        type: "null",
      },
      totalExact: {
        type: "boolean",
        const: false,
      },
      totalStatus: {
        type: "string",
        const: "unavailable",
      },
      progress: {
        type: "object",
        additionalProperties: false,
        properties: {
          eligibleCompanies: {
            type: "integer",
            minimum: 0,
          },
          enqueuedCompanies: {
            type: "integer",
            minimum: 0,
          },
          processedCompanies: {
            type: "integer",
            minimum: 0,
          },
          pendingCompanies: {
            type: "integer",
            minimum: 0,
          },
          processingCompanies: {
            type: "integer",
            minimum: 0,
          },
          confirmedMatches: {
            type: "integer",
            minimum: 0,
          },
          contradictedCompanies: {
            type: "integer",
            minimum: 0,
          },
          unresolvedCompanies: {
            type: "integer",
            minimum: 0,
          },
          missingEvidenceCompanies: {
            type: "integer",
            minimum: 0,
          },
          staleEvidenceCompanies: {
            type: "integer",
            minimum: 0,
          },
          retryingCompanies: {
            type: "integer",
            minimum: 0,
          },
          checkedPassages: {
            type: "integer",
            minimum: 0,
          },
        },
        required: [
          "eligibleCompanies",
          "enqueuedCompanies",
          "processedCompanies",
          "pendingCompanies",
          "processingCompanies",
          "confirmedMatches",
          "contradictedCompanies",
          "unresolvedCompanies",
          "missingEvidenceCompanies",
          "staleEvidenceCompanies",
          "retryingCompanies",
          "checkedPassages",
        ],
      },
      retryFailures: {
        type: "array",
        maxItems: 20,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            code: {
              type: "string",
            },
            companies: {
              type: "integer",
              minimum: 1,
            },
            retryAt: {
              type: "string",
              format: "date-time",
            },
          },
          required: ["code", "companies", "retryAt"],
        },
      },
      usage: {
        type: "object",
        additionalProperties: false,
        properties: {
          providerRequests: {
            type: "integer",
            minimum: 0,
          },
          inputTokens: {
            type: "integer",
            minimum: 0,
          },
          outputTokens: {
            type: "integer",
            minimum: 0,
          },
          cachedDecisions: {
            type: "integer",
            minimum: 0,
          },
          usageMissingRequests: {
            type: "integer",
            minimum: 0,
          },
          providerDurationMs: {
            type: "integer",
            minimum: 0,
          },
          elapsedMs: {
            type: "integer",
            minimum: 0,
          },
        },
        required: [
          "providerRequests",
          "inputTokens",
          "outputTokens",
          "cachedDecisions",
          "usageMissingRequests",
          "providerDurationMs",
          "elapsedMs",
        ],
      },
      limitations: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    required: [
      "runId",
      "expectedRevision",
      "querySignature",
      "status",
      "scanComplete",
      "country",
      "query",
      "appliedCriteria",
      "appliedFilters",
      "expiresAt",
      "companies",
      "view",
      "nextCursor",
      "hasNextPage",
      "awaitingMoreResults",
      "total",
      "totalExact",
      "totalStatus",
      "progress",
      "retryFailures",
      "usage",
      "limitations",
    ],
  },
  CompanyEvidenceAdvanceResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "companies.evidence.advance",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CompanyEvidenceRunData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CompanyEvidenceStatusResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "companies.evidence.status",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CompanyEvidenceRunData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CompanyEvidenceResultsResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "companies.evidence.results",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CompanyEvidenceRunData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CompanyEvidenceCancelResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "companies.evidence.cancel",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CompanyEvidenceRunData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CompanyInspectResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "company.inspect",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CompanyInspectData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CompanyInspectData: {
    type: "object",
    additionalProperties: true,
    required: ["revision"],
    properties: {
      companies: {
        type: "array",
        maxItems: 10,
        items: {
          type: "object",
          additionalProperties: true,
          required: ["profile", "revision"],
        },
      },
      notFound: {
        type: "array",
        maxItems: 10,
        items: {
          type: "string",
          maxLength: 200,
        },
      },
      financialReview: {
        type: "object",
        additionalProperties: false,
        required: ["headlineYear", "latestHistoryYear", "comparison"],
        properties: {
          headlineYear: {
            type: ["string", "null"],
          },
          latestHistoryYear: {
            type: ["string", "null"],
          },
          comparison: {
            type: "string",
            enum: [
              "promoted_newest_year",
              "newer_history_available",
              "no_newer_history",
              "unknown",
            ],
          },
          previousHeadline: {
            type: "object",
            additionalProperties: false,
            description: "The stored figures replaced by the newest fiscal year.",
            required: ["fiscalYear", "employeeCount", "revenueEur"],
            properties: {
              fiscalYear: {
                type: ["string", "null"],
              },
              employeeCount: {
                type: ["integer", "null"],
              },
              revenueEur: {
                type: ["number", "null"],
              },
            },
          },
          employeeFiscalYear: {
            type: "string",
            description:
              "Set when the newest year has no employee count and the headline keeps this year's.",
          },
          newerHistory: {
            type: ["object", "null"],
            additionalProperties: false,
            required: ["fiscalYear", "employeeCount", "revenueEur"],
            properties: {
              fiscalYear: {
                type: "string",
              },
              employeeCount: {
                type: ["integer", "null"],
              },
              revenueEur: {
                type: ["number", "null"],
              },
            },
          },
        },
        description:
          "The profile headline is the newest fiscal year with a published revenue, the year the FI search snapshot filters on (promoted_newest_year; previousHeadline keeps the stored figures). A newer year without revenue is reported in newerHistory. Operating margin is derived from the same year's operating profit and revenue.",
      },
      revision: {
        type: "string",
      },
      profile: {
        type: "object",
        additionalProperties: true,
        description:
          "The complete current Companies drawer profile. Additional properties preserve all app profile sections as they evolve.",
        required: [
          "country",
          "businessId",
          "name",
          "financials",
          "decisionMakers",
          "technologies",
          "advertising",
        ],
        properties: {
          country: {
            type: "string",
          },
          businessId: {
            type: "string",
          },
          name: {
            type: "string",
          },
          financials: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: true,
            },
          },
          decisionMakers: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: true,
              required: ["name", "role", "phone", "email", "linkedinUrl", "location"],
              properties: {
                name: {
                  type: "string",
                },
                role: {
                  type: "string",
                },
                phone: {
                  type: "string",
                },
                email: {
                  type: "string",
                },
                linkedinUrl: {
                  type: "string",
                },
                location: {
                  type: "string",
                },
                socialProfiles: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["platform", "url"],
                    properties: {
                      platform: {
                        type: "string",
                      },
                      url: {
                        type: "string",
                        pattern: "^https://",
                      },
                    },
                  },
                },
              },
            },
          },
          companyEmails: {
            type: "array",
            items: {
              type: "string",
            },
          },
          companyPhones: {
            type: "array",
            items: {
              type: "string",
            },
          },
          companyPhone: {
            type: "string",
          },
          technologies: {
            type: "array",
            items: {
              type: "string",
            },
          },
          socialProfiles: {
            type: "array",
            description: "Supported company-owned business social account URLs.",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["platform", "url"],
              properties: {
                platform: {
                  type: "string",
                  enum: ["instagram", "facebook", "linkedin", "youtube", "tiktok", "x"],
                },
                url: {
                  type: "string",
                  pattern: "^https://",
                },
              },
            },
          },
          websiteContacts: {
            type: "array",
            description:
              "Email addresses and phone numbers verified on saved company website HTML. Company-route and person ownership are unassigned.",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["channel", "value", "sourceUrl"],
              properties: {
                channel: {
                  type: "string",
                  enum: ["email", "phone"],
                },
                value: {
                  type: "string",
                },
                sourceUrl: {
                  type: "string",
                  pattern: "^https://",
                },
              },
            },
          },
          advertising: {
            type: "object",
            additionalProperties: true,
          },
          exhibitions: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: true,
            },
          },
          publicFunding: {
            type: ["object", "null"],
            additionalProperties: true,
          },
          recruitment: {
            oneOf: [
              {
                $ref: "#/$defs/CompanyRecruitmentData",
              },
              {
                type: "null",
              },
            ],
          },
          funding: {
            type: ["object", "null"],
            additionalProperties: true,
          },
          hiring: {
            type: ["object", "null"],
            additionalProperties: true,
          },
        },
      },
    },
    description:
      "Read the complete company profile shown in the app, including financials, technologies, advertising, funding, hiring and decision-makers wherever available. Missing data is unknown. One company returns profile and financialReview; companyKeys returns companies in request order and notFound keys.",
  },
  CompanyRecruitmentData: {
    type: "object",
    additionalProperties: false,
    required: [
      "revision",
      "snapshotAt",
      "verifiedUntil",
      "status",
      "activeJobCount",
      "snapshotJobCount",
      "postings",
    ],
    properties: {
      revision: {
        type: "string",
      },
      snapshotAt: {
        type: "string",
      },
      verifiedUntil: {
        type: ["string", "null"],
      },
      status: {
        type: "string",
        enum: ["verified", "historical", "stale"],
      },
      activeJobCount: {
        type: ["integer", "null"],
        minimum: 0,
      },
      snapshotJobCount: {
        type: "integer",
        minimum: 0,
      },
      postings: {
        type: "array",
        maxItems: 20,
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "source",
            "externalId",
            "title",
            "location",
            "publishedAt",
            "sourceUrl",
            "status",
            "verifiedAt",
          ],
          properties: {
            source: {
              type: "string",
            },
            externalId: {
              type: "string",
            },
            title: {
              type: "string",
            },
            location: {
              type: "string",
            },
            publishedAt: {
              type: "string",
            },
            sourceUrl: {
              type: "string",
            },
            status: {
              type: "string",
              enum: ["open", "closed", "not_reverified"],
            },
            verifiedAt: {
              type: ["string", "null"],
            },
          },
        },
      },
    },
  },
  CompanyFitStartResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "companies.fit.start",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/CompanyFitStartData",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  CompanyFitStartData: {
    type: "object",
    additionalProperties: false,
    required: ["replayed", "progress"],
    properties: {
      replayed: {
        type: "boolean",
      },
      progress: {
        $ref: "#/$defs/CompanyFitProgress",
      },
    },
  },
  CompanyFitProgress: {
    type: "object",
    additionalProperties: false,
    required: [
      "runId",
      "campaignId",
      "listId",
      "status",
      "total",
      "pending",
      "processing",
      "complete",
      "strong",
      "possible",
      "poor",
      "unknown",
      "readyForProposal",
    ],
    properties: {
      runId: {
        type: "string",
      },
      campaignId: {
        type: "string",
      },
      listId: {
        type: "string",
      },
      status: {
        type: "string",
        enum: ["initializing", "ready", "stale", "cancelled"],
      },
      total: {
        type: "integer",
        minimum: 1,
      },
      pending: {
        type: "integer",
        minimum: 0,
      },
      processing: {
        type: "integer",
        minimum: 0,
      },
      complete: {
        type: "integer",
        minimum: 0,
      },
      strong: {
        type: "integer",
        minimum: 0,
      },
      possible: {
        type: "integer",
        minimum: 0,
      },
      poor: {
        type: "integer",
        minimum: 0,
      },
      unknown: {
        type: "integer",
        minimum: 0,
      },
      readyForProposal: {
        type: "boolean",
      },
    },
  },
  CompanyFitAdvanceResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "companies.fit.advance",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/CompanyFitAdvanceData",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  CompanyFitAdvanceData: {
    type: "object",
    additionalProperties: false,
    required: ["processed", "progress"],
    properties: {
      processed: {
        type: "integer",
        minimum: 0,
        maximum: 16,
      },
      progress: {
        $ref: "#/$defs/CompanyFitProgress",
      },
    },
  },
  CompanyFitResultsResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "companies.fit.results",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CompanyFitResultsData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CompanyFitResultsData: {
    type: "object",
    additionalProperties: false,
    required: ["progress", "totalMatching", "items", "nextOffset"],
    properties: {
      progressVersion: {
        type: "string",
        minLength: 64,
        maxLength: 64,
        description:
          "Present only when the caller supplies expectedVersion. Legacy requests retain their exact response shape.",
      },
      progress: {
        $ref: "#/$defs/CompanyFitProgress",
      },
      totalMatching: {
        type: "integer",
        minimum: 0,
      },
      items: {
        type: "array",
        items: {
          $ref: "#/$defs/CompanyFitItem",
        },
      },
      nextOffset: {
        type: ["integer", "null"],
      },
    },
  },
  CompanyFitItem: {
    type: "object",
    additionalProperties: false,
    required: [
      "country",
      "businessId",
      "companyName",
      "websiteUrl",
      "status",
      "tier",
      "priority",
      "reason",
      "evidence",
    ],
    properties: {
      country: {
        type: "string",
      },
      businessId: {
        type: "string",
      },
      companyName: {
        type: "string",
      },
      websiteUrl: {
        type: "string",
      },
      status: {
        type: "string",
        enum: ["pending", "processing", "complete"],
      },
      tier: {
        type: "string",
        enum: ["strong", "possible", "poor", "unknown"],
      },
      priority: {
        type: "integer",
        minimum: 0,
        maximum: 100,
      },
      reason: {
        type: "string",
      },
      evidence: {
        type: "array",
        items: {
          $ref: "#/$defs/CompanyFitEvidence",
        },
      },
      checkedAt: {
        type: ["string", "null"],
      },
      modelVersion: {
        type: "string",
      },
    },
  },
  CompanyFitEvidence: {
    type: "object",
    additionalProperties: false,
    required: ["url", "text", "observedAt"],
    properties: {
      url: {
        type: "string",
      },
      text: {
        type: "string",
      },
      observedAt: {
        type: "string",
      },
    },
  },
  CompanyFitProposalResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "companies.fit.proposal",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CompanyFitProposalData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CompanyFitProposalData: {
    type: "object",
    additionalProperties: false,
    required: [
      "progress",
      "proposedExclusions",
      "expectedRemaining",
      "expectedRemainingTargetCount",
      "refinePreviewInput",
    ],
    properties: {
      progress: {
        $ref: "#/$defs/CompanyFitProgress",
      },
      proposedExclusions: {
        type: "integer",
        minimum: 0,
      },
      expectedRemaining: {
        type: "integer",
        minimum: 1,
      },
      expectedRemainingTargetCount: {
        type: "integer",
        minimum: 0,
      },
      refinePreviewInput: {
        oneOf: [
          {
            $ref: "#/$defs/CompanyListRefineInput",
          },
          {
            type: "null",
          },
        ],
      },
    },
  },
  CompanyListRefineInput: {
    type: "object",
    additionalProperties: false,
    required: [
      "listId",
      "campaignId",
      "expectedListUpdatedAt",
      "expectedCampaignUpdatedAt",
      "expectedTotal",
      "expectedTargetCount",
      "excludeCompanies",
      "expectedRemaining",
      "expectedRemainingTargetCount",
      "idempotencyKey",
      "apply",
    ],
    properties: {
      dryRun: {
        type: "boolean",
        description:
          "True returns a non-executing input-only preview. Resource, version, policy and budget checks remain pending; policyDecision.allowed is false. False or omission retains the original operation and approval requirements.",
      },
      listId: {
        $ref: "#/$defs/ResourceId",
      },
      campaignId: {
        $ref: "#/$defs/ResourceId",
      },
      expectedListUpdatedAt: {
        $ref: "#/$defs/ResourceVersion",
      },
      expectedCampaignUpdatedAt: {
        $ref: "#/$defs/ResourceVersion",
      },
      expectedTotal: {
        type: "integer",
        minimum: 1,
        maximum: 25000,
      },
      expectedTargetCount: {
        type: "integer",
        minimum: 0,
        maximum: 125000,
      },
      excludeCompanies: {
        type: "array",
        minItems: 0,
        maxItems: 1000,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["country", "businessId"],
          properties: {
            country: {
              $ref: "#/$defs/SupportedCountry",
            },
            businessId: {
              type: "string",
              minLength: 1,
              maxLength: 192,
            },
          },
        },
      },
      includeCompanies: {
        type: "array",
        minItems: 1,
        maxItems: 50,
        description:
          "Inspected companies to add or refresh. Existing identities are refreshed with the selected decision-maker routes.",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["country", "businessId", "expectedRevision"],
          properties: {
            country: {
              $ref: "#/$defs/SupportedCountry",
            },
            businessId: {
              type: "string",
              minLength: 1,
              maxLength: 192,
            },
            expectedRevision: {
              type: "string",
              minLength: 64,
              maxLength: 64,
            },
            selectedLinkedinUrl: {
              type: "string",
              minLength: 1,
              maxLength: 500,
            },
            selectedEmailAddress: {
              type: "string",
              minLength: 1,
              maxLength: 320,
            },
            selectedPhoneNumber: {
              type: "string",
              minLength: 1,
              maxLength: 80,
            },
          },
        },
      },
      expectedRemaining: {
        type: "integer",
        minimum: 1,
        maximum: 25000,
      },
      expectedRemainingTargetCount: {
        type: "integer",
        minimum: 1,
        maximum: 125000,
      },
      idempotencyKey: {
        $ref: "#/$defs/IdempotencyKey",
      },
      reviewedSelectionDigest: {
        type: "string",
        minLength: 64,
        maxLength: 64,
        description: "Echo selectionDigest from the matching dry run when apply is true.",
      },
      apply: {
        type: "boolean",
        description:
          "False previews exact removals without a write. True applies the same reviewed selection to the disabled draft list.",
      },
      runId: {
        type: "string",
        minLength: 1,
        maxLength: 100,
        description: "Optional run correlation. Also accepted as X-DMFaster-Run-Id.",
      },
    },
  },
  CompanyListPrepareResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "companies.list.prepare",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/CompanyListPrepareData",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  CompanyListPrepareData: {
    type: "object",
    additionalProperties: true,
    required: ["listId", "name", "total", "created", "replayed", "companies"],
    properties: {
      channelCounts: {
        type: "object",
        additionalProperties: false,
        required: ["instagram", "facebook", "linkedin"],
        properties: {
          instagram: {
            type: "integer",
            minimum: 0,
          },
          facebook: {
            type: "integer",
            minimum: 0,
          },
          linkedin: {
            type: "integer",
            minimum: 0,
          },
          email: {
            type: "integer",
            minimum: 0,
          },
          sms: {
            type: "integer",
            minimum: 0,
          },
        },
      },
      listId: {
        type: "string",
      },
      name: {
        type: "string",
      },
      total: {
        type: "integer",
        minimum: 0,
      },
      created: {
        type: "boolean",
      },
      replayed: {
        type: "boolean",
      },
      expectedUpdatedAt: {
        type: "string",
      },
      companies: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
    },
    description:
      "Save explicitly inspected companies as a private company list. Echo each company_inspect revision. No campaign is created or started. Retry using the same key.",
  },
  CompanyListInspectResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "companies.list.inspect",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CompanyListInspectData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CompanyListRefineResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "companies.list.refine",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/CompanyListRefineData",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  CompanyListRefineData: {
    type: "object",
    additionalProperties: false,
    required: [
      "sourceListId",
      "listId",
      "campaignId",
      "applied",
      "replayed",
      "beforeTotal",
      "removed",
      "added",
      "updated",
      "remaining",
      "targetCountBefore",
      "targetCountAfter",
      "sourceListUpdatedAt",
      "listUpdatedAt",
      "campaignUpdatedAt",
      "selectionDigest",
    ],
    properties: {
      sourceListId: {
        type: "string",
      },
      listId: {
        type: "string",
      },
      campaignId: {
        type: "string",
      },
      applied: {
        type: "boolean",
      },
      replayed: {
        type: "boolean",
      },
      beforeTotal: {
        type: "integer",
        minimum: 1,
      },
      removed: {
        type: "integer",
        minimum: 0,
      },
      added: {
        type: "integer",
        minimum: 0,
      },
      updated: {
        type: "integer",
        minimum: 0,
      },
      remaining: {
        type: "integer",
        minimum: 1,
      },
      targetCountBefore: {
        type: "integer",
        minimum: 0,
      },
      targetCountAfter: {
        type: "integer",
        minimum: 1,
      },
      sourceListUpdatedAt: {
        type: "string",
      },
      listUpdatedAt: {
        type: ["string", "null"],
      },
      campaignUpdatedAt: {
        type: "string",
      },
      selectionDigest: {
        type: "string",
      },
    },
  },
  CampaignOperationInspectResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "campaign.operation.inspect",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CampaignOperationInspectOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CampaignOperationInspectOutput: {
    type: "object",
    additionalProperties: false,
    required: [
      "campaignId",
      "commandId",
      "runId",
      "commandSequence",
      "action",
      "state",
      "reason",
      "senderAcknowledgedAt",
      "createdAt",
      "observedAt",
    ],
    properties: {
      campaignId: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      commandId: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      runId: {
        type: "string",
      },
      commandSequence: {
        type: "integer",
      },
      action: {
        type: "string",
        enum: ["start", "stop"],
      },
      state: {
        type: "string",
        enum: [
          "preparing_queue",
          "superseded",
          "blocked",
          "stopped",
          "sender_acknowledged",
          "awaiting_sender",
          "queue_prepared",
        ],
      },
      reason: {
        type: "string",
      },
      senderAcknowledgedAt: {
        type: ["string", "null"],
      },
      createdAt: {
        type: "string",
      },
      observedAt: {
        type: "string",
      },
    },
  },
  CampaignDeliveryInspectResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "campaign.delivery.inspect",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CampaignDeliveryInspectOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CampaignDeliveryInspectOutput: {
    type: "object",
    additionalProperties: true,
    required: ["campaignId", "revision", "settings"],
    properties: {
      warnings: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["code", "campaignTimezone", "dominantProspectTimezone", "basis"],
          properties: {
            code: {
              type: "string",
              const: "prospect_timezone_mismatch",
            },
            campaignTimezone: {
              type: "string",
            },
            dominantProspectTimezone: {
              type: ["string", "null"],
            },
            basis: {
              type: "string",
              const: "company_country",
            },
          },
        },
      },
      prospectTimezone: {
        $ref: "#/$defs/CampaignProspectTimezoneSummary",
      },
      contactPolicyReport: {
        $ref: "#/$defs/CampaignContactPolicyImpact",
      },
      campaignId: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      revision: {
        type: "string",
      },
      settings: {
        type: "object",
        additionalProperties: true,
      },
      eligibility: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
  CampaignProspectTimezoneSummary: {
    type: "object",
    additionalProperties: false,
    required: [
      "basis",
      "inferred",
      "total",
      "known",
      "unknown",
      "campaignTimezone",
      "dominantTimezone",
      "mismatch",
    ],
    properties: {
      basis: {
        type: "string",
        const: "company_country",
      },
      inferred: {
        type: "boolean",
      },
      total: {
        type: "integer",
        minimum: 0,
      },
      known: {
        type: "integer",
        minimum: 0,
      },
      unknown: {
        type: "integer",
        minimum: 0,
      },
      campaignTimezone: {
        type: "string",
      },
      dominantTimezone: {
        type: ["string", "null"],
      },
      mismatch: {
        type: "boolean",
      },
    },
  },
  CampaignContactPolicyImpact: {
    type: "object",
    additionalProperties: false,
    required: [
      "dryRun",
      "observedAt",
      "policyVersion",
      "currentFlags",
      "hypotheticalFlags",
      "filteredTotal",
      "evaluated",
      "wouldSkipOnPage",
      "pageOnly",
      "nextAfterJobId",
      "items",
    ],
    properties: {
      dryRun: {
        type: "boolean",
        const: true,
      },
      observedAt: {
        $ref: "#/$defs/ResourceVersion",
      },
      policyVersion: {
        type: "integer",
        minimum: 0,
      },
      currentFlags: {
        type: "object",
        additionalProperties: {
          type: "boolean",
        },
      },
      hypotheticalFlags: {
        type: "object",
        additionalProperties: {
          type: "boolean",
        },
      },
      filteredTotal: {
        type: "integer",
        minimum: 0,
      },
      evaluated: {
        type: "integer",
        minimum: 0,
      },
      wouldSkipOnPage: {
        type: "integer",
        minimum: 0,
      },
      pageOnly: {
        type: "boolean",
        const: true,
      },
      nextAfterJobId: {
        type: ["string", "null"],
      },
      items: {
        type: "array",
        maxItems: 100,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["jobId", "channel", "allowed", "reasons", "timezone", "nextAllowedAt"],
          properties: {
            jobId: {
              type: "string",
            },
            channel: {
              type: "string",
            },
            allowed: {
              type: "boolean",
            },
            reasons: {
              type: "array",
              items: {
                type: "string",
              },
            },
            timezone: {
              type: "string",
            },
            nextAllowedAt: {
              type: ["string", "null"],
            },
          },
        },
      },
    },
  },
  CampaignDeliveryUpdateResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "campaign.delivery.update",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/CampaignDeliveryUpdateOutput",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  CampaignDeliveryUpdateOutput: {
    type: "object",
    additionalProperties: true,
    required: ["campaignId", "revision", "previous", "settings", "effectiveAt", "replayed"],
    properties: {
      campaignId: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      revision: {
        type: "string",
      },
      previous: {
        type: "object",
        additionalProperties: true,
      },
      settings: {
        type: "object",
        additionalProperties: true,
      },
      effectiveAt: {
        type: "string",
        const: "next_attempt",
      },
      replayed: {
        type: "boolean",
      },
    },
  },
  InstagramPacingInspectResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "sending.instagram.pacing.inspect",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/InstagramPacingInspectOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  InstagramPacingInspectOutput: {
    type: "object",
    additionalProperties: false,
    required: ["revision", "override", "source"],
    properties: {
      revision: {
        type: ["string", "null"],
        pattern:
          "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[1-8][a-fA-F0-9]{3}-[89abAB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}$",
      },
      override: {
        oneOf: [
          {
            $ref: "#/$defs/InstagramPacingPolicy",
          },
          {
            type: "null",
          },
        ],
      },
      source: {
        type: "string",
        enum: ["user", "campaign"],
      },
    },
  },
  InstagramPacingPolicy: {
    type: "object",
    additionalProperties: false,
    required: ["gapMinSeconds", "gapMaxSeconds"],
    properties: {
      gapMinSeconds: {
        type: "integer",
        minimum: 12,
        maximum: 3600,
      },
      gapMaxSeconds: {
        type: "integer",
        minimum: 12,
        maximum: 3600,
      },
    },
    description:
      "Minimum must be less than or equal to maximum; seconds between outgoing Instagram messages.",
  },
  InstagramPacingUpdateResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "sending.instagram.pacing.update",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/InstagramPacingUpdateOutput",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  InstagramPacingUpdateOutput: {
    type: "object",
    additionalProperties: false,
    required: [
      "revision",
      "policy",
      "previous",
      "effectiveAt",
      "inProgressAttemptChanged",
      "replayed",
    ],
    properties: {
      revision: {
        type: "string",
        pattern:
          "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[1-8][a-fA-F0-9]{3}-[89abAB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}$",
      },
      policy: {
        oneOf: [
          {
            $ref: "#/$defs/InstagramPacingPolicy",
          },
          {
            type: "null",
          },
        ],
      },
      previous: {
        oneOf: [
          {
            $ref: "#/$defs/InstagramPacingPolicy",
          },
          {
            type: "null",
          },
        ],
      },
      effectiveAt: {
        type: "string",
        const: "next_scheduler_check",
      },
      inProgressAttemptChanged: {
        type: "boolean",
        const: false,
      },
      replayed: {
        type: "boolean",
      },
    },
  },
  CompanyFitStatusResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CompanyFitStatusData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CompanyFitStatusData: {
    type: "object",
    additionalProperties: false,
    required: ["progress"],
    properties: {
      progress: {
        $ref: "#/$defs/CompanyFitDetailedProgress",
      },
    },
  },
  CompanyFitDetailedProgress: {
    type: "object",
    additionalProperties: false,
    required: [
      "runId",
      "campaignId",
      "listId",
      "status",
      "total",
      "pending",
      "processing",
      "complete",
      "strong",
      "possible",
      "poor",
      "unknown",
      "readyForProposal",
      "version",
      "maxPages",
      "pollAfterMs",
      "expiresAt",
    ],
    properties: {
      runId: {
        type: "string",
      },
      campaignId: {
        type: "string",
      },
      listId: {
        type: "string",
      },
      status: {
        type: "string",
        enum: ["initializing", "ready", "stale", "cancelled"],
      },
      total: {
        type: "integer",
        minimum: 1,
      },
      pending: {
        type: "integer",
        minimum: 0,
      },
      processing: {
        type: "integer",
        minimum: 0,
      },
      complete: {
        type: "integer",
        minimum: 0,
      },
      strong: {
        type: "integer",
        minimum: 0,
      },
      possible: {
        type: "integer",
        minimum: 0,
      },
      poor: {
        type: "integer",
        minimum: 0,
      },
      unknown: {
        type: "integer",
        minimum: 0,
      },
      readyForProposal: {
        type: "boolean",
      },
      version: {
        type: "string",
        minLength: 64,
        maxLength: 64,
      },
      maxPages: {
        type: "integer",
        minimum: 2,
        maximum: 5,
      },
      pollAfterMs: {
        type: "integer",
        minimum: 0,
        maximum: 60000,
      },
      expiresAt: {
        type: "string",
        minLength: 20,
        maxLength: 40,
      },
    },
  },
  CompanyFitCancelResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/CompanyFitCancelData",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  CompanyFitCancelData: {
    type: "object",
    additionalProperties: false,
    required: ["progress"],
    properties: {
      progress: {
        $ref: "#/$defs/CompanyFitDetailedProgress",
      },
    },
  },
  CompanyFitRunsListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CompanyFitRunsListData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CompanyFitRunsListData: {
    type: "object",
    additionalProperties: false,
    required: ["runs", "nextBefore"],
    properties: {
      runs: {
        type: "array",
        items: {
          $ref: "#/$defs/CompanyFitDetailedProgress",
        },
        maxItems: 25,
      },
      nextBefore: {
        oneOf: [
          {
            $ref: "#/$defs/CompanyFitRunCursor",
          },
          {
            type: "null",
          },
        ],
      },
    },
  },
  CompanyFitRunCursor: {
    type: "object",
    additionalProperties: false,
    required: ["createdAt", "id"],
    properties: {
      createdAt: {
        type: "string",
        minLength: 20,
        maxLength: 40,
      },
      id: {
        $ref: "#/$defs/ResourceId",
      },
    },
  },
  CompanyFitRunResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/CompanyFitRunData",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  CompanyFitRunData: {
    type: "object",
    additionalProperties: false,
    required: ["progress", "processed", "stopReason"],
    properties: {
      progress: {
        $ref: "#/$defs/CompanyFitDetailedProgress",
      },
      processed: {
        type: "integer",
        minimum: 0,
        maximum: 16,
      },
      stopReason: {
        type: "string",
        enum: ["complete", "budget", "waiting", "cancelled"],
      },
    },
  },
  CompanyFitCohortResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CompanyFitCohortData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CompanyFitCohortData: {
    type: "object",
    additionalProperties: false,
    required: [
      "progress",
      "selected",
      "proposedExclusions",
      "expectedRemaining",
      "expectedRemainingTargetCount",
      "refinePreviewInput",
    ],
    properties: {
      progress: {
        $ref: "#/$defs/CompanyFitDetailedProgress",
      },
      selected: {
        type: "array",
        items: {
          $ref: "#/$defs/CompanyFitItem",
        },
        maxItems: 1000,
      },
      proposedExclusions: {
        type: "integer",
        minimum: 0,
        maximum: 1000,
      },
      expectedRemaining: {
        type: "integer",
        minimum: 1,
        maximum: 25000,
      },
      expectedRemainingTargetCount: {
        type: "integer",
        minimum: 0,
        maximum: 125000,
      },
      refinePreviewInput: {
        oneOf: [
          {
            $ref: "#/$defs/CompanyListRefineInput",
          },
          {
            type: "null",
          },
        ],
      },
    },
  },
  CopyPerformanceResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CopyPerformanceData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CopyPerformanceData: {
    type: "object",
    additionalProperties: false,
    required: [
      "from",
      "to",
      "totalMatching",
      "items",
      "nextOffset",
      "unattributedSends",
      "limitations",
    ],
    properties: {
      variationPerformance: {
        $ref: "#/$defs/VariationPerformanceData",
      },
      from: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      to: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      totalMatching: {
        type: "integer",
        minimum: 0,
        maximum: 100000000,
      },
      items: {
        type: "array",
        items: {
          $ref: "#/$defs/CopyPerformanceItem",
        },
        maxItems: 25,
      },
      nextOffset: {
        type: ["integer", "null"],
      },
      unattributedSends: {
        type: "integer",
        minimum: 0,
        maximum: 100000000,
      },
      limitations: {
        type: "array",
        items: {
          type: "string",
          minLength: 1,
          maxLength: 500,
        },
        maxItems: 10,
      },
      attributionCoverage: {
        type: "object",
        additionalProperties: true,
      },
      metrics: {
        $ref: "#/$defs/SalesMetricsV2",
      },
      metricsAsOf: {
        type: "string",
        format: "date-time",
      },
      metricsVersion: {
        type: "string",
        maxLength: 500,
      },
      definitions: {
        type: "object",
        additionalProperties: {
          type: "string",
        },
      },
      metricIds: {
        type: "object",
        additionalProperties: {
          type: "string",
        },
      },
      legacy: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
  VariationPerformanceData: {
    type: "object",
    additionalProperties: false,
    required: [
      "generatedAt",
      "responseWindowDays",
      "totalMatching",
      "items",
      "nextOffset",
      "coverage",
    ],
    properties: {
      generatedAt: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      responseWindowDays: {
        type: "integer",
        const: 7,
      },
      totalMatching: {
        type: "integer",
        minimum: 0,
        maximum: 100000000,
      },
      items: {
        type: "array",
        maxItems: 25,
        items: {
          $ref: "#/$defs/VariationPerformanceItem",
        },
      },
      nextOffset: {
        type: ["integer", "null"],
        minimum: 0,
        maximum: 1000000,
      },
      coverage: {
        type: "object",
        additionalProperties: false,
        required: [
          "recipients",
          "unknownTemplateRecipients",
          "overriddenRecipients",
          "unlinkedRecipients",
        ],
        properties: {
          recipients: {
            type: "integer",
            minimum: 0,
            maximum: 100000000,
          },
          unknownTemplateRecipients: {
            type: "integer",
            minimum: 0,
            maximum: 100000000,
          },
          overriddenRecipients: {
            type: "integer",
            minimum: 0,
            maximum: 100000000,
          },
          unlinkedRecipients: {
            type: "integer",
            minimum: 0,
            maximum: 100000000,
          },
        },
      },
    },
  },
  VariationPerformanceItem: {
    type: "object",
    additionalProperties: false,
    required: [
      "revisionId",
      "channel",
      "variantIndex",
      "subject",
      "body",
      "sentRecipients",
      "matureRecipients",
      "awaitingRecipients",
      "linkedMatureRecipients",
      "humanResponders",
      "replyRate",
    ],
    properties: {
      revisionId: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      channel: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      copyBasis: {
        type: "string",
        enum: ["saved_template", "recovered_delivered_copy"],
        description:
          "Recovered rows group exact delivered text; they do not reconstruct original templates or A/B slots.",
      },
      variantIndex: {
        type: ["integer", "null"],
        minimum: 0,
        maximum: 100,
      },
      subject: {
        type: "string",
        maxLength: 10000,
      },
      body: {
        type: "string",
        maxLength: 10000,
      },
      sentRecipients: {
        type: "integer",
        minimum: 0,
        maximum: 100000000,
      },
      matureRecipients: {
        type: "integer",
        minimum: 0,
        maximum: 100000000,
      },
      awaitingRecipients: {
        type: "integer",
        minimum: 0,
        maximum: 100000000,
      },
      linkedMatureRecipients: {
        type: "integer",
        minimum: 0,
        maximum: 100000000,
      },
      humanResponders: {
        type: "integer",
        minimum: 0,
        maximum: 100000000,
      },
      replyRate: {
        type: ["number", "null"],
      },
      positiveResponders: {
        type: "integer",
      },
      bookedRecipients: {
        type: "integer",
      },
      credibleInterval: {
        oneOf: [
          {
            $ref: "#/$defs/CredibleInterval",
          },
          {
            type: "null",
          },
        ],
      },
    },
  },
  CredibleInterval: {
    type: "object",
    additionalProperties: false,
    properties: {
      low: {
        type: "number",
        minimum: 0,
        maximum: 1,
      },
      high: {
        type: "number",
        minimum: 0,
        maximum: 1,
      },
      confidence: {
        type: "number",
      },
      method: {
        type: "string",
      },
    },
  },
  CopyPerformanceItem: {
    type: "object",
    additionalProperties: false,
    required: [
      "campaignId",
      "campaignName",
      "channel",
      "text",
      "linkedConversations",
      "confirmedSends",
      "repliedTargets",
      "bookedTargets",
      "replyRate",
      "bookingRate",
      "attribution",
    ],
    properties: {
      campaignId: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      campaignName: {
        type: "string",
        minLength: 0,
        maxLength: 200,
      },
      channel: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      text: {
        type: "string",
        minLength: 0,
        maxLength: 10000,
      },
      linkedConversations: {
        type: "integer",
        minimum: 0,
        maximum: 100000000,
        description:
          "Conversations with an exact outbound job link. Shows the observed coverage of confirmed sends.",
      },
      confirmedSends: {
        type: "integer",
        minimum: 0,
        maximum: 100000000,
      },
      repliedTargets: {
        type: "integer",
        minimum: 0,
        maximum: 100000000,
      },
      bookedTargets: {
        type: "integer",
        minimum: 0,
        maximum: 100000000,
      },
      replyRate: {
        type: ["number", "null"],
      },
      bookingRate: {
        type: ["number", "null"],
      },
      attribution: {
        type: "string",
        const: "first_confirmed_outreach_per_conversation",
      },
      credibleInterval: {
        oneOf: [
          {
            $ref: "#/$defs/CredibleInterval",
          },
          {
            type: "null",
          },
        ],
      },
    },
  },
  CalendarStatusResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CalendarStatusData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CalendarStatusData: {
    type: "object",
    additionalProperties: false,
    required: ["configured", "connected", "email", "tokenError", "setupUrl"],
    properties: {
      configured: {
        type: "boolean",
      },
      connected: {
        type: "boolean",
      },
      email: {
        type: "string",
        minLength: 0,
        maxLength: 320,
      },
      tokenError: {
        type: "string",
        minLength: 0,
        maxLength: 500,
      },
      setupUrl: {
        type: "string",
        minLength: 1,
        maxLength: 500,
      },
      calendars: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
      calendarDiscovery: {
        type: "string",
      },
      calendarListRequiredScope: {
        type: "string",
      },
    },
  },
  CalendarAvailabilityResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CalendarAvailabilityData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CalendarAvailabilityData: {
    type: "object",
    additionalProperties: false,
    required: ["from", "to", "timezone", "slots", "hasMore", "observedAt"],
    properties: {
      from: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      to: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      timezone: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      slots: {
        type: "array",
        items: {
          $ref: "#/$defs/CalendarSlot",
        },
        maxItems: 100,
      },
      hasMore: {
        type: "boolean",
      },
      observedAt: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      suggestedSlots: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            start: {
              $ref: "#/$defs/ResourceVersion",
            },
            end: {
              $ref: "#/$defs/ResourceVersion",
            },
            display: {
              type: "object",
              additionalProperties: false,
              properties: {
                fi: {
                  type: "string",
                },
                en: {
                  type: "string",
                },
              },
              required: ["fi", "en"],
            },
          },
          required: ["start", "end", "display"],
        },
      },
    },
  },
  CalendarSlot: {
    type: "object",
    additionalProperties: false,
    required: ["start", "end"],
    properties: {
      start: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      end: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
    },
  },
  CalendarMeetingBookResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                $ref: "#/$defs/CalendarMeetingBookData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CalendarMeetingBookData: {
    type: "object",
    additionalProperties: false,
    required: [
      "conversationId",
      "calendarEventId",
      "replayed",
      "htmlLink",
      "meetingLink",
      "pipelineStage",
    ],
    properties: {
      conversationId: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      calendarEventId: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      replayed: {
        type: "boolean",
      },
      htmlLink: {
        type: "string",
        minLength: 0,
        maxLength: 2000,
      },
      meetingLink: {
        type: "string",
        minLength: 0,
        maxLength: 2000,
      },
      pipelineStage: {
        type: "string",
        const: "call_booked",
      },
    },
  },
  CallsListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CallsListData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CallsListData: {
    type: "object",
    additionalProperties: false,
    required: ["items", "nextOffset"],
    properties: {
      items: {
        type: "array",
        items: {
          $ref: "#/$defs/CallListItemPublic",
        },
        maxItems: 50,
      },
      nextOffset: {
        type: ["integer", "null"],
      },
      filteredTotal: {
        type: "integer",
        minimum: 0,
      },
      nextCursor: {
        oneOf: [
          {
            type: "string",
            maxLength: 2000,
          },
          {
            type: "null",
          },
        ],
      },
      scope: {
        type: "object",
        additionalProperties: false,
        properties: {
          workspaceId: {
            $ref: "#/$defs/ResourceId",
          },
          reason: {
            type: "string",
            const: "authorized_workspace_meetings",
          },
        },
        required: ["workspaceId", "reason"],
      },
    },
  },
  CallListItemPublic: {
    type: "object",
    additionalProperties: false,
    required: [
      "id",
      "title",
      "lifecycle",
      "scheduledStartAt",
      "scheduledEndAt",
      "timezone",
      "bookingSource",
      "calendarManaged",
      "conferenceConfigured",
      "recordingMode",
      "createdAt",
      "updatedAt",
    ],
    properties: {
      id: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      title: {
        type: "string",
        minLength: 0,
        maxLength: 500,
      },
      lifecycle: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      scheduledStartAt: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      scheduledEndAt: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      timezone: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      bookingSource: {
        type: "string",
        minLength: 0,
        maxLength: 200,
      },
      calendarManaged: {
        type: "boolean",
      },
      conferenceConfigured: {
        type: "boolean",
      },
      recordingMode: {
        type: "string",
        enum: ["off", "on"],
      },
      createdAt: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      updatedAt: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      conversationId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      companyOutreachId: {
        type: "string",
        maxLength: 160,
      },
      campaignId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      linkConfidence: {
        oneOf: [
          {
            type: "number",
          },
          {
            type: "null",
          },
        ],
      },
      linkMethod: {
        type: "string",
        maxLength: 160,
      },
      hasRecording: {
        type: "boolean",
      },
      hasTranscript: {
        type: "boolean",
      },
      outcomeProposed: {
        type: "boolean",
      },
      source: {
        type: "string",
        maxLength: 200,
      },
      linkState: {
        type: "string",
        enum: ["linked", "unlinked"],
      },
      analysisState: {
        type: "string",
        maxLength: 100,
      },
      recordingState: {
        type: "string",
        maxLength: 100,
      },
      durationMs: {
        type: ["integer", "null"],
        minimum: 0,
      },
      transcriptAccessReason: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      transcriptAccess: {
        type: "string",
        enum: ["allowed", "denied"],
      },
      talkRatioTeamBps: {
        anyOf: [
          {
            type: "integer",
            minimum: 0,
            maximum: 10000,
          },
          {
            type: "null",
          },
        ],
      },
      talkBalance: {
        anyOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      attributionStatus: {
        anyOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
    },
  },
  CallInspectResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CallInspectData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CallInspectData: {
    type: "object",
    additionalProperties: false,
    required: ["meeting", "outcomes", "participants"],
    properties: {
      meeting: {
        $ref: "#/$defs/CallListItemPublic",
      },
      outcomes: {
        type: "array",
        items: {
          $ref: "#/$defs/CallOutcomePublic",
        },
        maxItems: 1000,
      },
      participants: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["id", "displayName", "identity", "companyOutreachId", "companyName"],
          properties: {
            id: {
              type: "string",
              minLength: 1,
              maxLength: 160,
            },
            displayName: {
              type: "string",
              minLength: 0,
              maxLength: 500,
            },
            identity: {
              type: "string",
              minLength: 0,
              maxLength: 500,
            },
            companyOutreachId: {
              type: "string",
              minLength: 0,
              maxLength: 500,
            },
            companyName: {
              type: "string",
              minLength: 0,
              maxLength: 500,
            },
            role: {
              type: "string",
              enum: ["team", "external", "unknown"],
            },
            roleSource: {
              type: "string",
            },
            roleConfidenceBps: {
              type: "integer",
              minimum: 0,
              maximum: 10000,
            },
            isOrganizer: {
              type: "boolean",
            },
            rsvpState: {
              type: "string",
            },
            participantKind: {
              type: "string",
            },
            participantId: {
              type: ["string", "null"],
            },
          },
        },
        maxItems: 1000,
      },
      recording: {
        oneOf: [
          {
            $ref: "#/$defs/AgentCallRecordingDetail",
          },
          {
            type: "null",
          },
        ],
      },
      stats: {
        anyOf: [
          {
            $ref: "#/$defs/CallStatsV2",
          },
          {
            $ref: "#/$defs/CallStatsLegacy",
          },
          {
            type: "null",
          },
        ],
      },
    },
  },
  CallOutcomePublic: {
    type: "object",
    additionalProperties: false,
    required: [
      "id",
      "attendanceResult",
      "salesDisposition",
      "occurredAt",
      "nextStep",
      "followUpAt",
      "reason",
      "recordedAt",
    ],
    properties: {
      id: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      attendanceResult: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      salesDisposition: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      occurredAt: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      nextStep: {
        type: "string",
        minLength: 0,
        maxLength: 5000,
      },
      followUpAt: {
        type: "string",
        minLength: 0,
        maxLength: 40,
      },
      reason: {
        type: "string",
        minLength: 0,
        maxLength: 5000,
      },
      recordedAt: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      result: {
        type: "string",
        maxLength: 160,
      },
      lostReason: {
        type: "string",
        maxLength: 2000,
      },
      valueEur: {
        oneOf: [
          {
            type: "number",
          },
          {
            type: "null",
          },
        ],
      },
      actor: {
        type: "object",
        additionalProperties: false,
        properties: {
          type: {
            type: "string",
            enum: ["agent", "user"],
          },
          credentialId: {
            oneOf: [
              {
                $ref: "#/$defs/ResourceId",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: ["type", "credentialId"],
      },
      outcomeSource: {
        type: "string",
        enum: ["manual", "analysis_confirmed"],
      },
      fromAnalysisVersion: {
        oneOf: [
          {
            type: "string",
            maxLength: 64,
          },
          {
            type: "null",
          },
        ],
      },
    },
  },
  AgentCallRecordingDetail: {
    type: "object",
    additionalProperties: false,
    properties: {
      id: {
        $ref: "#/$defs/ResourceId",
      },
      recorderLifecycle: {
        type: "string",
        maxLength: 100,
      },
      failureCode: {
        type: "string",
        maxLength: 100,
      },
      captureStartedAt: {
        type: ["string", "null"],
      },
      captureEndedAt: {
        type: ["string", "null"],
      },
      language: {
        type: ["string", "null"],
      },
      retentionDeadline: {
        type: ["string", "null"],
      },
      legalHold: {
        type: "boolean",
      },
      noticeVersion: {
        type: "string",
        maxLength: 100,
      },
      policy: {
        type: "object",
        additionalProperties: false,
        properties: {
          downloadEnabled: {
            type: "boolean",
          },
          externalSharingEnabled: {
            type: "boolean",
          },
          recorderUserConsent: {
            type: "boolean",
          },
        },
        required: ["downloadEnabled", "externalSharingEnabled", "recorderUserConsent"],
      },
      usageSeconds: {
        type: "object",
        additionalProperties: false,
        properties: {
          bot: {
            type: "integer",
            minimum: 0,
          },
          captured: {
            type: "integer",
            minimum: 0,
          },
          transcribed: {
            type: "integer",
            minimum: 0,
          },
        },
        required: ["bot", "captured", "transcribed"],
      },
    },
    required: [
      "id",
      "recorderLifecycle",
      "failureCode",
      "captureStartedAt",
      "captureEndedAt",
      "language",
      "retentionDeadline",
      "legalHold",
      "noticeVersion",
      "policy",
      "usageSeconds",
    ],
  },
  CallStatsV2: {
    type: "object",
    additionalProperties: false,
    properties: {
      schemaVersion: {
        type: "string",
        const: "conversation_analytics_v2",
      },
      lexiconVersion: {
        type: "string",
      },
      durationMs: {
        type: "integer",
        minimum: 0,
      },
      activeSpeakingMs: {
        type: "integer",
        minimum: 0,
      },
      silenceMs: {
        type: "integer",
        minimum: 0,
      },
      overlapMs: {
        type: "integer",
        minimum: 0,
      },
      totalTurns: {
        type: "integer",
        minimum: 0,
      },
      attribution: {
        type: "object",
        additionalProperties: false,
        properties: {
          status: {
            type: "string",
            enum: ["complete", "partial", "unavailable"],
          },
          coverageBps: {
            type: "integer",
            minimum: 0,
          },
          unattributedMs: {
            type: "integer",
            minimum: 0,
          },
        },
        required: ["status", "coverageBps", "unattributedMs"],
      },
      sides: {
        type: "object",
        additionalProperties: false,
        properties: {
          team: {
            type: "object",
            additionalProperties: false,
            properties: {
              speakingMs: {
                type: "integer",
                minimum: 0,
              },
              talkRatioBps: {
                anyOf: [
                  {
                    type: "integer",
                    minimum: 0,
                  },
                  {
                    type: "null",
                  },
                ],
              },
              longestMonologueMs: {
                type: "integer",
                minimum: 0,
              },
              turns: {
                type: "integer",
                minimum: 0,
              },
              questionCount: {
                type: "integer",
                minimum: 0,
              },
              wpm: {
                anyOf: [
                  {
                    type: "integer",
                    minimum: 0,
                  },
                  {
                    type: "null",
                  },
                ],
              },
              interruptionsMade: {
                type: "integer",
                minimum: 0,
              },
              interruptionsReceived: {
                type: "integer",
                minimum: 0,
              },
            },
            required: [
              "speakingMs",
              "talkRatioBps",
              "longestMonologueMs",
              "turns",
              "questionCount",
              "wpm",
              "interruptionsMade",
              "interruptionsReceived",
            ],
          },
          external: {
            type: "object",
            additionalProperties: false,
            properties: {
              speakingMs: {
                type: "integer",
                minimum: 0,
              },
              talkRatioBps: {
                anyOf: [
                  {
                    type: "integer",
                    minimum: 0,
                  },
                  {
                    type: "null",
                  },
                ],
              },
              longestMonologueMs: {
                type: "integer",
                minimum: 0,
              },
              turns: {
                type: "integer",
                minimum: 0,
              },
              questionCount: {
                type: "integer",
                minimum: 0,
              },
              wpm: {
                anyOf: [
                  {
                    type: "integer",
                    minimum: 0,
                  },
                  {
                    type: "null",
                  },
                ],
              },
              interruptionsMade: {
                type: "integer",
                minimum: 0,
              },
              interruptionsReceived: {
                type: "integer",
                minimum: 0,
              },
            },
            required: [
              "speakingMs",
              "talkRatioBps",
              "longestMonologueMs",
              "turns",
              "questionCount",
              "wpm",
              "interruptionsMade",
              "interruptionsReceived",
            ],
          },
        },
        required: ["team", "external"],
      },
      talkBalance: {
        type: "string",
        enum: ["team_led", "external_led", "balanced", "unavailable"],
      },
      longestSilenceMs: {
        type: "integer",
        minimum: 0,
      },
      silencesOver5s: {
        type: "integer",
        minimum: 0,
      },
      beforeFirstExternal30sBps: {
        anyOf: [
          {
            type: "integer",
            minimum: 0,
          },
          {
            type: "null",
          },
        ],
      },
      patienceMs: {
        anyOf: [
          {
            type: "integer",
            minimum: 0,
          },
          {
            type: "null",
          },
        ],
      },
      speakers: {
        type: "array",
        items: {
          $ref: "#/$defs/CallStatsSpeaker",
        },
        maxItems: 10000,
      },
      transcriptVersion: {
        type: "integer",
        minimum: 0,
      },
      statsVersion: {
        type: "string",
      },
      computedAt: {
        type: "string",
        format: "date-time",
      },
    },
    required: [
      "schemaVersion",
      "lexiconVersion",
      "durationMs",
      "activeSpeakingMs",
      "silenceMs",
      "overlapMs",
      "totalTurns",
      "attribution",
      "sides",
      "talkBalance",
      "longestSilenceMs",
      "silencesOver5s",
      "beforeFirstExternal30sBps",
      "patienceMs",
      "transcriptVersion",
      "statsVersion",
      "computedAt",
    ],
  },
  CallStatsSpeaker: {
    type: "object",
    additionalProperties: false,
    properties: {
      speakerId: {
        $ref: "#/$defs/ResourceId",
      },
      displayLabel: {
        type: "string",
      },
      role: {
        type: "string",
        enum: ["team", "external", "unknown"],
      },
      roleSource: {
        type: "string",
        enum: [
          "workspace_member",
          "own_domain",
          "calendar_organizer",
          "calendar_attendee",
          "human_confirmed",
          "unattributed",
        ],
      },
      roleConfidenceBps: {
        type: "integer",
        minimum: 0,
      },
      participantId: {
        anyOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      isOrganizer: {
        type: "boolean",
      },
      speakingMs: {
        type: "integer",
        minimum: 0,
      },
      talkRatioBps: {
        anyOf: [
          {
            type: "integer",
            minimum: 0,
          },
          {
            type: "null",
          },
        ],
      },
      turns: {
        type: "integer",
        minimum: 0,
      },
      longestMonologueMs: {
        type: "integer",
        minimum: 0,
      },
      interruptionsMade: {
        type: "integer",
        minimum: 0,
      },
      interruptionsReceived: {
        type: "integer",
        minimum: 0,
      },
      wpm: {
        anyOf: [
          {
            type: "integer",
            minimum: 0,
          },
          {
            type: "null",
          },
        ],
      },
      questions: {
        type: "integer",
        minimum: 0,
      },
      fillerRate: {
        anyOf: [
          {
            type: "number",
            minimum: 0,
          },
          {
            type: "null",
          },
        ],
      },
    },
    required: [
      "speakerId",
      "displayLabel",
      "role",
      "roleSource",
      "roleConfidenceBps",
      "participantId",
      "isOrganizer",
      "speakingMs",
      "talkRatioBps",
      "turns",
      "longestMonologueMs",
      "interruptionsMade",
      "interruptionsReceived",
      "wpm",
      "questions",
      "fillerRate",
    ],
  },
  CallStatsLegacy: {
    type: "object",
    additionalProperties: false,
    properties: {
      schemaVersion: {
        type: "string",
        const: "conversation_analytics_v1",
      },
      lexiconVersion: {
        type: "null",
      },
      durationMs: {
        type: "integer",
        minimum: 0,
      },
      activeSpeakingMs: {
        type: "integer",
        minimum: 0,
      },
      silenceMs: {
        type: "integer",
        minimum: 0,
      },
      overlapMs: {
        type: "integer",
        minimum: 0,
      },
      totalTurns: {
        type: "integer",
        minimum: 0,
      },
      attribution: {
        type: "object",
        additionalProperties: false,
        properties: {
          status: {
            type: "string",
            enum: ["complete", "partial", "unavailable"],
          },
          coverageBps: {
            type: "integer",
            minimum: 0,
          },
          unattributedMs: {
            type: "integer",
            minimum: 0,
          },
        },
        required: ["status", "coverageBps", "unattributedMs"],
      },
      sides: {
        type: "object",
        additionalProperties: false,
        properties: {
          team: {
            type: "object",
            additionalProperties: false,
            properties: {
              speakingMs: {
                type: "integer",
                minimum: 0,
              },
              talkRatioBps: {
                anyOf: [
                  {
                    type: "integer",
                    minimum: 0,
                  },
                  {
                    type: "null",
                  },
                ],
              },
              longestMonologueMs: {
                type: "integer",
                minimum: 0,
              },
              turns: {
                type: "integer",
                minimum: 0,
              },
              questionCount: {
                type: "null",
              },
              wpm: {
                type: "null",
              },
              interruptionsMade: {
                type: "null",
              },
              interruptionsReceived: {
                type: "null",
              },
            },
            required: [
              "speakingMs",
              "talkRatioBps",
              "longestMonologueMs",
              "turns",
              "questionCount",
              "wpm",
              "interruptionsMade",
              "interruptionsReceived",
            ],
          },
          external: {
            type: "object",
            additionalProperties: false,
            properties: {
              speakingMs: {
                type: "integer",
                minimum: 0,
              },
              talkRatioBps: {
                anyOf: [
                  {
                    type: "integer",
                    minimum: 0,
                  },
                  {
                    type: "null",
                  },
                ],
              },
              longestMonologueMs: {
                type: "integer",
                minimum: 0,
              },
              turns: {
                type: "integer",
                minimum: 0,
              },
              questionCount: {
                type: "null",
              },
              wpm: {
                type: "null",
              },
              interruptionsMade: {
                type: "null",
              },
              interruptionsReceived: {
                type: "null",
              },
            },
            required: [
              "speakingMs",
              "talkRatioBps",
              "longestMonologueMs",
              "turns",
              "questionCount",
              "wpm",
              "interruptionsMade",
              "interruptionsReceived",
            ],
          },
        },
        required: ["team", "external"],
      },
      talkBalance: {
        type: "string",
        enum: ["team_led", "external_led", "balanced", "unavailable"],
      },
      longestSilenceMs: {
        type: "null",
      },
      silencesOver5s: {
        type: "null",
      },
      beforeFirstExternal30sBps: {
        type: "null",
      },
      patienceMs: {
        type: "null",
      },
      speakers: {
        type: "array",
        items: {
          $ref: "#/$defs/CallStatsLegacySpeaker",
        },
        maxItems: 10000,
      },
      transcriptVersion: {
        type: "integer",
        minimum: 0,
      },
      statsVersion: {
        type: "string",
      },
      computedAt: {
        type: "string",
        format: "date-time",
      },
    },
    required: [
      "schemaVersion",
      "lexiconVersion",
      "durationMs",
      "activeSpeakingMs",
      "silenceMs",
      "overlapMs",
      "totalTurns",
      "attribution",
      "sides",
      "talkBalance",
      "longestSilenceMs",
      "silencesOver5s",
      "beforeFirstExternal30sBps",
      "patienceMs",
      "transcriptVersion",
      "statsVersion",
      "computedAt",
    ],
  },
  CallStatsLegacySpeaker: {
    type: "object",
    additionalProperties: false,
    properties: {
      speakerId: {
        $ref: "#/$defs/ResourceId",
      },
      displayLabel: {
        type: "string",
      },
      role: {
        type: "string",
        enum: ["team", "external", "unknown"],
      },
      roleSource: {
        type: "string",
        const: "legacy_cached",
      },
      roleConfidenceBps: {
        type: "null",
      },
      participantId: {
        type: "null",
      },
      isOrganizer: {
        type: "null",
      },
      speakingMs: {
        type: "integer",
        minimum: 0,
      },
      talkRatioBps: {
        anyOf: [
          {
            type: "integer",
            minimum: 0,
          },
          {
            type: "null",
          },
        ],
      },
      turns: {
        type: "integer",
        minimum: 0,
      },
      longestMonologueMs: {
        type: "integer",
        minimum: 0,
      },
      interruptionsMade: {
        type: "null",
      },
      interruptionsReceived: {
        type: "null",
      },
      wpm: {
        type: "null",
      },
      questions: {
        type: "null",
      },
      fillerRate: {
        type: "null",
      },
    },
    required: [
      "speakerId",
      "displayLabel",
      "role",
      "roleSource",
      "roleConfidenceBps",
      "participantId",
      "isOrganizer",
      "speakingMs",
      "talkRatioBps",
      "turns",
      "longestMonologueMs",
      "interruptionsMade",
      "interruptionsReceived",
      "wpm",
      "questions",
      "fillerRate",
    ],
  },
  InstagramExtractionQuoteResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            anyOf: [
              {
                $ref: "#/$defs/InstagramExtractionQuoteData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  InstagramExtractionQuoteData: {
    type: "object",
    additionalProperties: false,
    required: [
      "status",
      "username",
      "type",
      "requestedCount",
      "coveredCount",
      "purchaseCount",
      "availableProfiles",
      "amountCents",
      "currency",
      "purchaseUrl",
      "checkoutAvailable",
      "message",
    ],
    properties: {
      status: {
        type: "string",
        enum: ["ready", "payment_required"],
      },
      username: {
        type: "string",
      },
      type: {
        type: "string",
      },
      requestedCount: {
        type: "integer",
        minimum: 0,
      },
      coveredCount: {
        type: "integer",
        minimum: 0,
      },
      purchaseCount: {
        type: "integer",
        minimum: 0,
      },
      availableProfiles: {
        type: "integer",
        minimum: 0,
      },
      amountCents: {
        type: "integer",
        minimum: 0,
      },
      currency: {
        type: "string",
        enum: ["USD", "EUR"],
      },
      purchaseUrl: {
        type: "string",
      },
      checkoutAvailable: {
        type: "boolean",
      },
      message: {
        type: "string",
      },
    },
  },
  InstagramExtractionStartResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                anyOf: [
                  {
                    $ref: "#/$defs/InstagramExtractionData",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  InstagramExtractionData: {
    type: "object",
    additionalProperties: false,
    required: [
      "status",
      "jobId",
      "extractionId",
      "type",
      "identifier",
      "requestedCount",
      "savedCount",
      "availableProfiles",
      "resultsReady",
      "profiles",
      "nextCursor",
      "purchaseUrl",
      "pollAfterMs",
      "message",
    ],
    properties: {
      status: {
        type: "string",
        enum: ["queued", "running", "completed", "partial", "failed", "payment_required"],
      },
      jobId: {
        anyOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      extractionId: {
        anyOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      type: {
        type: "string",
      },
      identifier: {
        type: "string",
      },
      requestedCount: {
        type: "integer",
        minimum: 0,
      },
      savedCount: {
        type: "integer",
        minimum: 0,
      },
      availableProfiles: {
        type: "integer",
        minimum: 0,
      },
      resultsReady: {
        type: "boolean",
      },
      profiles: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["username", "name", "instagramUrl"],
          properties: {
            username: {
              type: "string",
            },
            name: {
              type: "string",
            },
            instagramUrl: {
              type: "string",
            },
          },
        },
        maxItems: 100,
      },
      nextCursor: {
        anyOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      purchaseUrl: {
        type: "string",
      },
      pollAfterMs: {
        anyOf: [
          {
            type: "integer",
            minimum: 0,
          },
          {
            type: "null",
          },
        ],
      },
      message: {
        type: "string",
      },
    },
  },
  InstagramExtractionInspectResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            anyOf: [
              {
                $ref: "#/$defs/InstagramExtractionData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  InstagramExtractionResultsResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            anyOf: [
              {
                $ref: "#/$defs/InstagramExtractionData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  InstagramPurchasesListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            anyOf: [
              {
                $ref: "#/$defs/InstagramPurchasesListData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  InstagramPurchasesListData: {
    type: "object",
    additionalProperties: false,
    required: ["purchases", "nextCursor"],
    properties: {
      purchases: {
        type: "array",
        maxItems: 20,
        items: {
          $ref: "#/$defs/InstagramPurchaseSummary",
        },
      },
      nextCursor: {
        anyOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
    },
  },
  InstagramPurchaseSummary: {
    type: "object",
    additionalProperties: false,
    required: ["orderId", "username", "type", "requestedCount", "currency", "paidAt"],
    properties: {
      orderId: {
        type: "string",
      },
      username: {
        type: "string",
      },
      type: {
        type: "string",
      },
      requestedCount: {
        type: "integer",
        minimum: 1,
      },
      currency: {
        type: "string",
        enum: ["USD", "EUR"],
      },
      paidAt: {
        type: "string",
      },
    },
  },
  InstagramPurchasesInspectResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            anyOf: [
              {
                $ref: "#/$defs/InstagramPurchasesInspectData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  InstagramPurchasesInspectData: {
    type: "object",
    additionalProperties: false,
    required: [
      "orderId",
      "username",
      "type",
      "requestedCount",
      "currency",
      "paidAt",
      "availableProfiles",
      "jobs",
      "nextCursor",
    ],
    properties: {
      orderId: {
        type: "string",
      },
      username: {
        type: "string",
      },
      type: {
        type: "string",
      },
      requestedCount: {
        type: "integer",
        minimum: 1,
      },
      currency: {
        type: "string",
        enum: ["USD", "EUR"],
      },
      paidAt: {
        type: "string",
      },
      availableProfiles: {
        type: "integer",
        minimum: 0,
      },
      jobs: {
        type: "array",
        maxItems: 20,
        items: {
          $ref: "#/$defs/InstagramPurchasedJob",
        },
      },
      nextCursor: {
        anyOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
    },
  },
  InstagramPurchasedJob: {
    type: "object",
    additionalProperties: false,
    required: ["jobId", "status", "savedCount", "resultsReady"],
    properties: {
      jobId: {
        type: "string",
      },
      extractionId: {
        type: "string",
      },
      type: {
        type: "string",
      },
      identifier: {
        type: "string",
      },
      requestedCount: {
        type: "integer",
        minimum: 0,
      },
      savedCount: {
        type: "integer",
        minimum: 0,
      },
      status: {
        type: "string",
      },
      resultsReady: {
        type: "boolean",
      },
      message: {
        type: "string",
      },
      profiles: {
        type: "array",
        maxItems: 100,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["username", "name", "instagramUrl"],
          properties: {
            username: {
              type: "string",
            },
            name: {
              type: "string",
            },
            instagramUrl: {
              type: "string",
            },
          },
        },
      },
      nextCursor: {
        anyOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
    },
  },
  InstagramPurchasesResultsResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            anyOf: [
              {
                $ref: "#/$defs/InstagramPurchasesResultsData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  InstagramPurchasesResultsData: {
    type: "object",
    additionalProperties: false,
    required: ["orderId", "job"],
    properties: {
      orderId: {
        type: "string",
      },
      job: {
        $ref: "#/$defs/InstagramPurchasedJob",
      },
    },
  },
  LeadsStatusResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            anyOf: [
              {
                $ref: "#/$defs/LeadProspectingData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  LeadProspectingData: {
    type: "object",
    additionalProperties: false,
    required: [
      "status",
      "message",
      "credits",
      "requiredCredits",
      "jobId",
      "extraction",
      "enrichment",
      "estimatedCredits",
      "recentExtractions",
      "nextCursor",
      "pollAfterMs",
      "nextAction",
      "purchaseUrl",
    ],
    properties: {
      status: {
        type: "string",
        enum: ["ready", "queued", "running", "completed", "failed", "blocked"],
      },
      message: {
        type: "string",
      },
      credits: {
        anyOf: [
          {
            $ref: "#/$defs/LeadCreditBalance",
          },
          {
            type: "null",
          },
        ],
      },
      requiredCredits: {
        anyOf: [
          {
            type: "integer",
            minimum: 0,
          },
          {
            type: "null",
          },
        ],
      },
      jobId: {
        anyOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      extraction: {
        anyOf: [
          {
            $ref: "#/$defs/LeadExtractionPublic",
          },
          {
            type: "null",
          },
        ],
      },
      enrichment: {
        anyOf: [
          {
            $ref: "#/$defs/LeadEnrichmentPublic",
          },
          {
            type: "null",
          },
        ],
      },
      estimatedCredits: {
        anyOf: [
          {
            type: "integer",
            minimum: 0,
          },
          {
            type: "null",
          },
        ],
      },
      recentExtractions: {
        type: "array",
        items: {
          $ref: "#/$defs/LeadExtractionPublic",
        },
      },
      nextCursor: {
        anyOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      pollAfterMs: {
        anyOf: [
          {
            type: "integer",
            minimum: 0,
          },
          {
            type: "null",
          },
        ],
      },
      nextAction: {
        type: "string",
        enum: ["inspect", "buy_credits", "enable_billing", "open_list", "enrich", "none"],
      },
      purchaseUrl: {
        type: "string",
      },
    },
  },
  LeadCreditBalance: {
    type: "object",
    additionalProperties: false,
    required: [
      "active",
      "remaining",
      "monthlyAllowance",
      "used",
      "purchasedRemaining",
      "cycleEndsAt",
      "purchaseUrl",
    ],
    properties: {
      active: {
        type: "boolean",
      },
      remaining: {
        type: "integer",
        minimum: 0,
      },
      monthlyAllowance: {
        type: "integer",
        minimum: 0,
      },
      used: {
        type: "integer",
        minimum: 0,
      },
      purchasedRemaining: {
        type: "integer",
        minimum: 0,
      },
      cycleEndsAt: {
        anyOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      purchaseUrl: {
        type: "string",
      },
    },
  },
  LeadExtractionPublic: {
    type: "object",
    additionalProperties: false,
    required: [
      "extractionId",
      "status",
      "type",
      "identifier",
      "requestedCount",
      "collectedCount",
      "savedCount",
      "listId",
      "listUrl",
      "creditCost",
      "creditState",
      "hasMore",
      "updatedAt",
      "error",
    ],
    properties: {
      extractionId: {
        type: "string",
      },
      status: {
        type: "string",
        enum: ["queued", "pending", "processing", "completed", "failed"],
      },
      type: {
        type: "string",
      },
      identifier: {
        type: "string",
      },
      requestedCount: {
        type: "integer",
        minimum: 0,
      },
      collectedCount: {
        type: "integer",
        minimum: 0,
      },
      savedCount: {
        anyOf: [
          {
            type: "integer",
            minimum: 0,
          },
          {
            type: "null",
          },
        ],
      },
      listId: {
        anyOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      listUrl: {
        anyOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      creditCost: {
        type: "integer",
        minimum: 0,
      },
      creditState: {
        type: "string",
        enum: ["reserved", "settled"],
      },
      hasMore: {
        type: "boolean",
      },
      updatedAt: {
        type: "string",
      },
      error: {
        type: "string",
      },
    },
  },
  LeadEnrichmentPublic: {
    type: "object",
    additionalProperties: false,
    required: [
      "enrichmentId",
      "listId",
      "status",
      "requestedCount",
      "processedCount",
      "enrichedCount",
      "creditCost",
      "creditRefunded",
      "netCreditCost",
      "creditState",
      "updatedAt",
      "error",
    ],
    properties: {
      enrichmentId: {
        type: "string",
      },
      listId: {
        type: "string",
      },
      status: {
        type: "string",
      },
      requestedCount: {
        type: "integer",
        minimum: 0,
      },
      processedCount: {
        type: "integer",
        minimum: 0,
      },
      enrichedCount: {
        type: "integer",
        minimum: 0,
      },
      creditCost: {
        type: "integer",
        minimum: 0,
      },
      creditRefunded: {
        type: "integer",
        minimum: 0,
      },
      netCreditCost: {
        type: "integer",
        minimum: 0,
      },
      creditState: {
        type: "string",
        enum: ["reserved", "settled"],
      },
      updatedAt: {
        type: "string",
      },
      error: {
        type: "string",
      },
    },
  },
  LeadExtractionQuoteResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            anyOf: [
              {
                $ref: "#/$defs/LeadProspectingData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  LeadExtractionStartResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            anyOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                $ref: "#/$defs/LeadProspectingData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  LeadExtractionInspectResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            anyOf: [
              {
                $ref: "#/$defs/LeadProspectingData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  LeadExtractionRefreshResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            anyOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                $ref: "#/$defs/LeadProspectingData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  LeadExtractionContinueResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            anyOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                $ref: "#/$defs/LeadProspectingData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  LeadEnrichmentPreviewResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            anyOf: [
              {
                $ref: "#/$defs/LeadProspectingData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  LeadEnrichmentStartResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            anyOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                $ref: "#/$defs/LeadProspectingData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  LeadEnrichmentInspectResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {
          data: {
            anyOf: [
              {
                $ref: "#/$defs/LeadProspectingData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  InstagramProspectQuoteResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          data: {
            anyOf: [
              {
                $ref: "#/$defs/InstagramProspectData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  InstagramProspectData: {
    type: "object",
    additionalProperties: false,
    required: [
      "runId",
      "phase",
      "query",
      "revision",
      "counts",
      "targetCount",
      "maxCandidates",
      "maxCredits",
      "maxModelCalls",
      "creditBalance",
      "creditSpent",
      "creditState",
      "providerReady",
      "model",
      "media",
      "listId",
      "reviewListId",
      "savedMatches",
      "savedReview",
      "modelCalls",
      "cachedDecisions",
      "inputTokens",
      "usageMissingCalls",
      "providerDurationMs",
      "resultVersion",
      "items",
      "nextCursor",
      "pollAfterMs",
      "errorCode",
      "targetReached",
      "workComplete",
      "warnings",
    ],
    properties: {
      runId: {
        type: ["string", "null"],
      },
      phase: {
        type: "string",
        enum: [
          "quoted",
          "queued",
          "discovering",
          "acquiring",
          "enriching",
          "qualifying",
          "saving",
          "completed",
          "blocked",
          "cancelled",
          "failed",
        ],
      },
      query: {
        type: "string",
      },
      revision: {
        type: ["string", "null"],
      },
      counts: {
        $ref: "#/$defs/InstagramProspectCounts",
      },
      targetCount: {
        type: "integer",
        minimum: 1,
      },
      maxCandidates: {
        type: "integer",
        minimum: 1,
      },
      maxCredits: {
        type: "integer",
        minimum: 0,
      },
      maxModelCalls: {
        type: "integer",
        minimum: 1,
      },
      creditBalance: {
        type: ["integer", "null"],
        minimum: 0,
      },
      creditSpent: {
        type: "integer",
        minimum: 0,
      },
      creditState: {
        type: "string",
        enum: ["reserved", "settled"],
      },
      providerReady: {
        type: "boolean",
      },
      model: {
        type: "string",
        enum: ["clef", "clef-flash"],
      },
      media: {
        type: "string",
        enum: ["none", "avatar", "recent_posts"],
      },
      listId: {
        type: ["string", "null"],
      },
      reviewListId: {
        type: ["string", "null"],
      },
      savedMatches: {
        type: "integer",
        minimum: 0,
      },
      savedReview: {
        type: "integer",
        minimum: 0,
      },
      modelCalls: {
        type: "integer",
        minimum: 0,
      },
      cachedDecisions: {
        type: "integer",
        minimum: 0,
      },
      inputTokens: {
        type: ["integer", "null"],
        minimum: 0,
      },
      usageMissingCalls: {
        type: "integer",
        minimum: 0,
      },
      providerDurationMs: {
        type: "number",
        minimum: 0,
      },
      resultVersion: {
        type: "integer",
        minimum: 0,
      },
      items: {
        type: "array",
        items: {
          $ref: "#/$defs/InstagramProspectItem",
        },
      },
      nextCursor: {
        type: ["string", "null"],
      },
      pollAfterMs: {
        type: ["integer", "null"],
        minimum: 0,
      },
      errorCode: {
        type: "string",
      },
      targetReached: {
        type: "boolean",
      },
      workComplete: {
        type: "boolean",
      },
      warnings: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
  },
  InstagramProspectCounts: {
    type: "object",
    additionalProperties: false,
    required: ["candidates", "attempted", "pending", "accept", "review", "exclude", "suppressed"],
    properties: {
      candidates: {
        type: "integer",
        minimum: 0,
      },
      attempted: {
        type: "integer",
        minimum: 0,
      },
      pending: {
        type: "integer",
        minimum: 0,
      },
      accept: {
        type: "integer",
        minimum: 0,
      },
      review: {
        type: "integer",
        minimum: 0,
      },
      exclude: {
        type: "integer",
        minimum: 0,
      },
      suppressed: {
        type: "integer",
        minimum: 0,
      },
    },
  },
  InstagramProspectItem: {
    type: "object",
    additionalProperties: false,
    required: [
      "profileId",
      "username",
      "name",
      "biography",
      "observedAt",
      "status",
      "attempted",
      "reason",
      "decision",
      "evidenceHash",
      "requestHash",
      "imageManifest",
      "mediaSources",
      "cached",
    ],
    properties: {
      profileId: {
        type: "string",
      },
      username: {
        type: "string",
      },
      name: {
        type: "string",
      },
      biography: {
        type: "string",
      },
      observedAt: {
        type: "string",
      },
      status: {
        type: "string",
        enum: ["pending", "accept", "review", "exclude", "suppressed"],
      },
      attempted: {
        type: "boolean",
      },
      reason: {
        type: "string",
      },
      decision: {
        anyOf: [
          {
            type: "object",
            additionalProperties: true,
          },
          {
            type: "null",
          },
        ],
      },
      evidenceHash: {
        type: ["string", "null"],
      },
      requestHash: {
        type: ["string", "null"],
      },
      imageManifest: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
      mediaSources: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["kind", "url", "observedAt"],
          properties: {
            kind: {
              type: "string",
              enum: ["avatar", "post"],
            },
            url: {
              type: "string",
            },
            observedAt: {
              type: "string",
            },
          },
        },
      },
      cached: {
        type: "boolean",
      },
    },
  },
  InstagramProspectStartResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                anyOf: [
                  {
                    $ref: "#/$defs/InstagramProspectData",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  InstagramProspectInspectResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          data: {
            anyOf: [
              {
                $ref: "#/$defs/InstagramProspectData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  InstagramProspectResultsResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          data: {
            anyOf: [
              {
                $ref: "#/$defs/InstagramProspectData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  InstagramProspectAdvanceResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                anyOf: [
                  {
                    $ref: "#/$defs/InstagramProspectData",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  InstagramProspectCancelResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                anyOf: [
                  {
                    $ref: "#/$defs/InstagramProspectData",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  EventsListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "events.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/EventsListOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  EventsListOutput: {
    type: "object",
    additionalProperties: false,
    required: ["events", "filteredTotal", "hasMore", "sequence", "nextCursor", "scope"],
    properties: {
      events: {
        type: "array",
        maxItems: 100,
        items: {
          $ref: "#/$defs/AgentEvent",
        },
      },
      filteredTotal: {
        type: "integer",
        minimum: 0,
      },
      hasMore: {
        type: "boolean",
      },
      sequence: {
        type: "integer",
        minimum: 0,
      },
      nextCursor: {
        type: "string",
      },
      scope: {
        $ref: "#/$defs/AgentEventsScope",
      },
      cursorSemantics: {
        type: "string",
        maxLength: 200,
      },
    },
  },
  AgentEvent: {
    type: "object",
    additionalProperties: false,
    required: ["id", "type", "createdAt", "workspaceId", "sequence", "apiVersion", "data"],
    properties: {
      id: {
        type: "string",
      },
      type: {
        $ref: "#/$defs/AgentSalesEventType",
      },
      createdAt: {
        type: "string",
        format: "date-time",
      },
      workspaceId: {
        type: "string",
      },
      sequence: {
        type: "integer",
        minimum: 0,
      },
      apiVersion: {
        type: "string",
        const: "2.0",
      },
      data: {
        type: "object",
        additionalProperties: true,
      },
      occurredAt: {
        type: "string",
        format: "date-time",
      },
      orderingKey: {
        type: "string",
        maxLength: 200,
      },
      actor: {
        oneOf: [
          {
            type: "object",
            additionalProperties: true,
          },
          {
            type: "null",
          },
        ],
      },
      agentId: {
        type: "string",
        maxLength: 200,
      },
      kind: {
        type: "string",
        enum: ["change", "snapshot"],
      },
      links: {
        type: "object",
        additionalProperties: false,
        properties: {
          conversationId: {
            type: "string",
            maxLength: 200,
          },
          personId: {
            type: "string",
            maxLength: 200,
          },
          companyId: {
            type: "string",
            maxLength: 200,
          },
          campaignId: {
            type: "string",
            maxLength: 200,
          },
          meetingId: {
            type: "string",
            maxLength: 200,
          },
        },
        required: [],
      },
      summary: {
        type: "string",
        maxLength: 300,
      },
    },
  },
  AgentSalesEventType: {
    type: "string",
    enum: [
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
    ],
  },
  AgentEventsScope: {
    type: "object",
    additionalProperties: false,
    required: ["workspaceId", "after", "through", "types", "retentionDays"],
    properties: {
      workspaceId: {
        type: "string",
      },
      after: {
        type: "integer",
        minimum: 0,
      },
      through: {
        type: "integer",
        minimum: 0,
      },
      types: {
        type: "array",
        items: {
          type: "string",
        },
      },
      retentionDays: {
        type: "integer",
        minimum: 0,
      },
    },
  },
  ConversationsChangesResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "conversations.changes",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ConversationsChangesOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  ConversationsChangesOutput: {
    type: "object",
    additionalProperties: false,
    required: ["changes", "filteredTotal", "hasMore", "nextCursor", "scope"],
    properties: {
      changes: {
        type: "array",
        maxItems: 100,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["conversationId", "reason", "updatedAt", "sequence"],
          properties: {
            conversationId: {
              type: "string",
            },
            reason: {
              type: "string",
              enum: ["message", "intent", "status", "meeting"],
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
            sequence: {
              type: "integer",
              minimum: 0,
            },
          },
        },
      },
      filteredTotal: {
        type: "integer",
        minimum: 0,
      },
      hasMore: {
        type: "boolean",
      },
      nextCursor: {
        type: "string",
      },
      scope: {
        $ref: "#/$defs/AgentEventsScope",
      },
      cursorSemantics: {
        type: "string",
        maxLength: 200,
      },
    },
  },
  SuppressionsListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "suppressions.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/SuppressionsListOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  SuppressionsListOutput: {
    type: "object",
    additionalProperties: false,
    required: ["entries", "filteredTotal", "hasMore", "nextCursor", "scope"],
    properties: {
      entries: {
        type: "array",
        maxItems: 100,
        items: {
          $ref: "#/$defs/SuppressionRecord",
        },
      },
      filteredTotal: {
        type: "integer",
        minimum: 0,
      },
      hasMore: {
        type: "boolean",
      },
      nextCursor: {
        type: ["string", "null"],
      },
      scope: {
        type: "object",
        additionalProperties: false,
        required: ["workspaceId", "query", "active"],
        properties: {
          workspaceId: {
            $ref: "#/$defs/ResourceId",
          },
          query: {
            type: ["string", "null"],
          },
          active: {
            type: "boolean",
            const: true,
          },
        },
      },
    },
  },
  SuppressionRecord: {
    type: "object",
    additionalProperties: false,
    required: ["id", "type", "value", "reason", "source", "createdAt", "updatedAt"],
    properties: {
      id: {
        $ref: "#/$defs/ResourceId",
      },
      type: {
        type: "string",
        enum: ["company", "phone", "email", "instagram", "facebook", "linkedin", "domain"],
      },
      value: {
        type: "string",
        minLength: 1,
        maxLength: 500,
      },
      reason: {
        type: "string",
        minLength: 1,
        maxLength: 500,
      },
      source: {
        type: "string",
        enum: ["prospect_request", "owner", "agent"],
      },
      createdAt: {
        type: "string",
        format: "date-time",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
      },
      removedAt: {
        type: ["string", "null"],
        format: "date-time",
      },
    },
  },
  SuppressionsAddResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "suppressions.add",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                $ref: "#/$defs/SuppressionsAddOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  SuppressionsAddOutput: {
    type: "object",
    additionalProperties: false,
    required: ["entries", "receiptId"],
    properties: {
      entries: {
        type: "array",
        maxItems: 100,
        items: {
          $ref: "#/$defs/SuppressionRecord",
        },
      },
      receiptId: {
        $ref: "#/$defs/ResourceId",
      },
    },
  },
  SuppressionsRemoveResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "suppressions.remove",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                $ref: "#/$defs/SuppressionsRemoveOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  SuppressionsRemoveOutput: {
    type: "object",
    additionalProperties: false,
    required: ["entry", "receiptId"],
    properties: {
      entry: {
        $ref: "#/$defs/SuppressionRecord",
      },
      receiptId: {
        $ref: "#/$defs/ResourceId",
      },
    },
  },
  WorkspaceSandboxCreateResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "workspace.sandbox.create",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/WorkspaceSandboxCreateOutput",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  WorkspaceSandboxCreateOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      workspaceId: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      isSandbox: {
        const: true,
        type: "boolean",
      },
      name: {
        type: "string",
        minLength: 1,
        maxLength: 100,
      },
      updatedAt: {
        $ref: "#/$defs/ResourceVersion",
      },
    },
    required: ["workspaceId", "isSandbox", "name", "updatedAt"],
  },
  SandboxSeedResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "sandbox.seed",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/SandboxSeedOutput",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  SandboxSeedOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      preset: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      listId: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      campaignId: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      companies: {
        type: "integer",
        minimum: 0,
      },
      conversationIds: {
        type: "array",
        items: {
          type: "string",
          minLength: 1,
          maxLength: 160,
        },
      },
      isSandbox: {
        type: "boolean",
        const: true,
      },
      meetingIds: {
        type: "array",
        items: {
          type: "string",
        },
        maxItems: 10,
      },
    },
    required: ["preset", "listId", "campaignId", "companies", "conversationIds", "isSandbox"],
  },
  SandboxInboundSimulateResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "sandbox.inbound.simulate",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/SandboxInboundSimulateOutput",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  SandboxInboundSimulateOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      conversationId: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      receiptId: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      isSandbox: {
        type: "boolean",
        const: true,
      },
      inserted: {
        type: "boolean",
      },
    },
    required: ["conversationId", "receiptId", "isSandbox", "inserted"],
  },
  SandboxClockAdvanceResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "sandbox.clock.advance",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/SandboxClockAdvanceOutput",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  SandboxClockAdvanceOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      now: {
        $ref: "#/$defs/ResourceVersion",
      },
      updatedAt: {
        $ref: "#/$defs/ResourceVersion",
      },
      offsetMinutes: {
        type: "integer",
        minimum: 0,
      },
      receiptId: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      isSandbox: {
        type: "boolean",
        const: true,
      },
    },
    required: ["now", "updatedAt", "offsetMinutes", "receiptId", "isSandbox"],
  },
  CallOutcomeSetResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "call.outcome.set",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                $ref: "#/$defs/CallOutcomeSetOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CallOutcomeSetOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      meetingId: {
        $ref: "#/$defs/ResourceId",
      },
      outcomeId: {
        $ref: "#/$defs/ResourceId",
      },
      lifecycle: {
        type: "string",
        maxLength: 160,
      },
      updatedAt: {
        $ref: "#/$defs/ResourceVersion",
      },
      followUpAt: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceVersion",
          },
          {
            type: "null",
          },
        ],
      },
      receiptId: {
        $ref: "#/$defs/ResourceId",
      },
    },
    required: ["meetingId", "outcomeId", "lifecycle", "updatedAt", "followUpAt", "receiptId"],
  },
  MeetingLinkResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "meeting.link",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                $ref: "#/$defs/MeetingLinkOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  MeetingLinkOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      meetingId: {
        $ref: "#/$defs/ResourceId",
      },
      conversationId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      companyOutreachId: {
        type: "string",
        maxLength: 160,
      },
      campaignId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      linkConfidence: {
        oneOf: [
          {
            type: "number",
            minimum: 0,
            maximum: 1,
          },
          {
            type: "null",
          },
        ],
      },
      linkMethod: {
        type: "string",
        maxLength: 160,
      },
      revision: {
        type: "integer",
        minimum: 1,
      },
      updatedAt: {
        $ref: "#/$defs/ResourceVersion",
      },
      receiptId: {
        $ref: "#/$defs/ResourceId",
      },
    },
    required: [
      "meetingId",
      "conversationId",
      "companyOutreachId",
      "campaignId",
      "linkConfidence",
      "linkMethod",
      "revision",
      "updatedAt",
      "receiptId",
    ],
  },
  MeetingUnlinkResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "meeting.unlink",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                $ref: "#/$defs/MeetingUnlinkOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  MeetingUnlinkOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      meetingId: {
        $ref: "#/$defs/ResourceId",
      },
      conversationId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      companyOutreachId: {
        type: "string",
        maxLength: 160,
      },
      campaignId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      linkConfidence: {
        oneOf: [
          {
            type: "number",
            minimum: 0,
            maximum: 1,
          },
          {
            type: "null",
          },
        ],
      },
      linkMethod: {
        type: "string",
        maxLength: 160,
      },
      revision: {
        type: "integer",
        minimum: 1,
      },
      updatedAt: {
        $ref: "#/$defs/ResourceVersion",
      },
      receiptId: {
        $ref: "#/$defs/ResourceId",
      },
    },
    required: [
      "meetingId",
      "conversationId",
      "companyOutreachId",
      "campaignId",
      "linkConfidence",
      "linkMethod",
      "revision",
      "updatedAt",
      "receiptId",
    ],
  },
  WebhooksCreateResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "webhooks.create",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/WebhooksCreateOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  WebhooksCreateOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      id: {
        $ref: "#/$defs/ResourceId",
      },
      url: {
        type: "string",
        maxLength: 2048,
      },
      events: {
        type: "array",
        items: {
          $ref: "#/$defs/AgentSalesEventType",
        },
        minItems: 1,
        maxItems: 30,
      },
      description: {
        type: "string",
        maxLength: 1000,
      },
      enabled: {
        type: "boolean",
      },
      createdAt: {
        $ref: "#/$defs/ResourceVersion",
      },
      updatedAt: {
        $ref: "#/$defs/ResourceVersion",
      },
      secret: {
        type: "string",
        maxLength: 100,
      },
      receiptId: {
        $ref: "#/$defs/ResourceId",
      },
      headerNames: {
        type: "array",
        maxItems: 5,
        items: {
          type: "string",
          minLength: 1,
          maxLength: 160,
        },
      },
      ordering: {
        type: "string",
      },
      payload: {
        type: "string",
      },
      health: {
        type: "string",
      },
      dryRun: {
        type: "boolean",
      },
    },
    required: ["id", "url", "events", "description", "enabled", "createdAt", "updatedAt", "secret"],
  },
  WebhooksListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "webhooks.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/WebhooksListOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  WebhooksListOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      items: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: {
              $ref: "#/$defs/ResourceId",
            },
            url: {
              type: "string",
              maxLength: 2048,
            },
            events: {
              type: "array",
              items: {
                $ref: "#/$defs/AgentSalesEventType",
              },
              minItems: 1,
              maxItems: 30,
            },
            description: {
              type: "string",
              maxLength: 1000,
            },
            enabled: {
              type: "boolean",
            },
            createdAt: {
              $ref: "#/$defs/ResourceVersion",
            },
            updatedAt: {
              $ref: "#/$defs/ResourceVersion",
            },
            headerNames: {
              type: "array",
              maxItems: 5,
              items: {
                type: "string",
                minLength: 1,
                maxLength: 160,
              },
            },
            ordering: {
              type: "string",
            },
            payload: {
              type: "string",
            },
            health: {
              type: "string",
            },
            dryRun: {
              type: "boolean",
            },
            webhookHealth: {
              type: "object",
              additionalProperties: false,
              properties: {
                attempts24h: {
                  type: "integer",
                  minimum: 0,
                },
                delivered24h: {
                  type: "integer",
                  minimum: 0,
                },
                p50LatencyMs: {
                  oneOf: [
                    {
                      type: "number",
                    },
                    {
                      type: "null",
                    },
                  ],
                },
                p95LatencyMs: {
                  oneOf: [
                    {
                      type: "number",
                    },
                    {
                      type: "null",
                    },
                  ],
                },
                oldestPendingAgeMs: {
                  type: "number",
                },
                successRate24h: {
                  oneOf: [
                    {
                      type: "number",
                    },
                    {
                      type: "null",
                    },
                  ],
                },
              },
              required: [
                "attempts24h",
                "delivered24h",
                "p50LatencyMs",
                "p95LatencyMs",
                "oldestPendingAgeMs",
                "successRate24h",
              ],
            },
          },
          required: ["id", "url", "events", "description", "enabled", "createdAt", "updatedAt"],
        },
        maxItems: 20,
      },
      filteredTotal: {
        type: "integer",
        minimum: 0,
      },
      nextCursor: {
        type: "null",
      },
      scope: {
        type: "object",
        additionalProperties: false,
        properties: {
          workspaceId: {
            $ref: "#/$defs/ResourceId",
          },
        },
        required: ["workspaceId"],
      },
    },
    required: ["items", "filteredTotal", "nextCursor", "scope"],
  },
  WebhooksUpdateResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "webhooks.update",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/WebhooksUpdateOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  WebhooksUpdateOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      id: {
        $ref: "#/$defs/ResourceId",
      },
      queued: {
        type: "integer",
        minimum: 0,
      },
      nextCursor: {
        oneOf: [
          {
            type: "string",
            maxLength: 1000,
          },
          {
            type: "null",
          },
        ],
      },
      updatedAt: {
        $ref: "#/$defs/ResourceVersion",
      },
      receiptId: {
        $ref: "#/$defs/ResourceId",
      },
      dryRun: {
        type: "boolean",
      },
    },
    required: ["id", "queued", "nextCursor", "updatedAt"],
  },
  WebhooksDeleteResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "webhooks.delete",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/WebhooksDeleteOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  WebhooksDeleteOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      id: {
        $ref: "#/$defs/ResourceId",
      },
      queued: {
        type: "integer",
        minimum: 0,
      },
      nextCursor: {
        oneOf: [
          {
            type: "string",
            maxLength: 1000,
          },
          {
            type: "null",
          },
        ],
      },
      updatedAt: {
        $ref: "#/$defs/ResourceVersion",
      },
      receiptId: {
        $ref: "#/$defs/ResourceId",
      },
      dryRun: {
        type: "boolean",
      },
    },
    required: ["id", "queued", "nextCursor", "updatedAt"],
  },
  WebhooksTestResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "webhooks.test",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/WebhooksTestOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  WebhooksTestOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      id: {
        $ref: "#/$defs/ResourceId",
      },
      queued: {
        type: "integer",
        minimum: 0,
      },
      nextCursor: {
        oneOf: [
          {
            type: "string",
            maxLength: 1000,
          },
          {
            type: "null",
          },
        ],
      },
      updatedAt: {
        $ref: "#/$defs/ResourceVersion",
      },
      receiptId: {
        $ref: "#/$defs/ResourceId",
      },
      dryRun: {
        type: "boolean",
      },
    },
    required: ["id", "queued", "nextCursor", "updatedAt"],
  },
  WebhooksReplayResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "webhooks.replay",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/WebhooksReplayOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  WebhooksReplayOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      id: {
        $ref: "#/$defs/ResourceId",
      },
      queued: {
        type: "integer",
        minimum: 0,
      },
      nextCursor: {
        oneOf: [
          {
            type: "string",
            maxLength: 1000,
          },
          {
            type: "null",
          },
        ],
      },
      updatedAt: {
        $ref: "#/$defs/ResourceVersion",
      },
      receiptId: {
        $ref: "#/$defs/ResourceId",
      },
      dryRun: {
        type: "boolean",
      },
    },
    required: ["id", "queued", "nextCursor", "updatedAt"],
  },
  MeetingsUnlinkedListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "meetings.unlinked.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/MeetingsUnlinkedListOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  MeetingsUnlinkedListOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      items: {
        type: "array",
        maxItems: 100,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            identityPlan: {
              oneOf: [
                {
                  $ref: "#/$defs/MeetingIdentityPlan",
                },
                {
                  type: "null",
                },
              ],
            },
            meetingId: {
              $ref: "#/$defs/ResourceId",
            },
            title: {
              type: "string",
              maxLength: 500,
            },
            scheduledStartAt: {
              $ref: "#/$defs/ResourceVersion",
            },
            updatedAt: {
              $ref: "#/$defs/ResourceVersion",
            },
            linkMethod: {
              type: "string",
              maxLength: 160,
            },
            linkConfidence: {
              oneOf: [
                {
                  type: "number",
                },
                {
                  type: "null",
                },
              ],
            },
          },
          required: [
            "meetingId",
            "title",
            "scheduledStartAt",
            "updatedAt",
            "linkMethod",
            "linkConfidence",
          ],
        },
      },
      filteredTotal: {
        type: "integer",
        minimum: 0,
      },
      nextCursor: {
        oneOf: [
          {
            type: "string",
            maxLength: 2000,
          },
          {
            type: "null",
          },
        ],
      },
      scope: {
        type: "object",
        additionalProperties: false,
        properties: {
          workspaceId: {
            $ref: "#/$defs/ResourceId",
          },
        },
        required: ["workspaceId"],
      },
    },
    required: ["items", "filteredTotal", "nextCursor", "scope"],
  },
  MeetingIdentityPlan: {
    type: "object",
    additionalProperties: false,
    required: ["state", "candidates", "autoLinkEligible"],
    properties: {
      state: {
        type: "string",
        enum: ["internal", "unmatched", "ambiguous", "proposed", "bounded"],
      },
      autoLinkEligible: {
        type: "boolean",
      },
      candidates: {
        type: "array",
        maxItems: 100,
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "conversationId",
            "companyOutreachId",
            "campaignId",
            "personId",
            "companyId",
            "linkMethod",
            "confidence",
            "expectedConversationUpdatedAt",
          ],
          properties: {
            conversationId: {
              $ref: "#/$defs/ResourceId",
            },
            companyOutreachId: {
              type: "string",
            },
            campaignId: {
              type: ["string", "null"],
            },
            personId: {
              type: ["string", "null"],
            },
            companyId: {
              type: ["string", "null"],
            },
            linkMethod: {
              type: "string",
              enum: ["attendee_email", "attendee_domain"],
            },
            confidence: {
              type: "number",
              minimum: 0,
              maximum: 1,
            },
            expectedConversationUpdatedAt: {
              $ref: "#/$defs/ResourceVersion",
            },
          },
        },
      },
    },
  },
  PipelineReconcileResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "pipeline.reconcile",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/PipelineReconcileOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  PipelineReconcileOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      dryRun: {
        type: "boolean",
      },
      bookedMeetings: {
        type: "integer",
        minimum: 0,
      },
      bookedCompanies: {
        type: "integer",
        minimum: 0,
      },
      pipelineBookedOrClosed: {
        type: "integer",
        minimum: 0,
      },
      filteredTotal: {
        type: "integer",
        minimum: 0,
      },
      items: {
        type: "array",
        maxItems: 100,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            calendarEventId: {
              type: "string",
              maxLength: 160,
            },
            meetingId: {
              oneOf: [
                {
                  type: "string",
                  maxLength: 160,
                },
                {
                  type: "null",
                },
              ],
            },
            conversationId: {
              type: "string",
              maxLength: 160,
            },
            companyOutreachId: {
              type: "string",
              maxLength: 400,
            },
            campaignId: {
              oneOf: [
                {
                  type: "string",
                  maxLength: 160,
                },
                {
                  type: "null",
                },
              ],
            },
            expectedUpdatedAt: {
              oneOf: [
                {
                  $ref: "#/$defs/ResourceVersion",
                },
                {
                  type: "null",
                },
              ],
            },
          },
          required: [
            "calendarEventId",
            "meetingId",
            "conversationId",
            "companyOutreachId",
            "campaignId",
            "expectedUpdatedAt",
          ],
        },
      },
      truncated: {
        type: "boolean",
      },
      applied: {
        type: "array",
        maxItems: 100,
        items: {
          type: "string",
          maxLength: 160,
        },
      },
      scope: {
        type: "object",
        additionalProperties: false,
        properties: {
          workspaceId: {
            $ref: "#/$defs/ResourceId",
          },
          campaignId: {
            oneOf: [
              {
                $ref: "#/$defs/ResourceId",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: ["workspaceId", "campaignId"],
      },
      ownerApprovalRequired: {
        type: "boolean",
      },
    },
    required: [
      "dryRun",
      "bookedMeetings",
      "bookedCompanies",
      "pipelineBookedOrClosed",
      "filteredTotal",
      "items",
      "truncated",
      "applied",
      "scope",
      "ownerApprovalRequired",
    ],
  },
  WorkspaceAgentSalesGetResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "workspace.agent_sales.get",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/WorkspaceAgentSalesGetOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  WorkspaceAgentSalesGetOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      enabled: {
        type: "boolean",
      },
      autoClose: {
        type: "boolean",
      },
      autoSuppress: {
        type: "boolean",
      },
      suppressCompany: {
        type: "boolean",
      },
      updatedAt: {
        $ref: "#/$defs/ResourceVersion",
      },
    },
    required: ["enabled", "autoClose", "autoSuppress", "suppressCompany", "updatedAt"],
  },
  WorkspaceAgentSalesUpdateResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "workspace.agent_sales.update",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/WorkspaceAgentSalesUpdateOutput",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  WorkspaceAgentSalesUpdateOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      enabled: {
        type: "boolean",
      },
      autoClose: {
        type: "boolean",
      },
      autoSuppress: {
        type: "boolean",
      },
      suppressCompany: {
        type: "boolean",
      },
      updatedAt: {
        $ref: "#/$defs/ResourceVersion",
      },
      receiptId: {
        $ref: "#/$defs/ResourceId",
      },
    },
    required: ["enabled", "autoClose", "autoSuppress", "suppressCompany", "updatedAt", "receiptId"],
  },
  SandboxProviderUpdateResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "sandbox.provider.update",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/SandboxProviderUpdateOutput",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  SandboxProviderUpdateOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      provider: {
        type: "string",
        enum: ["calendar", "gmail", "sms", "browser"],
      },
      connected: {
        type: "boolean",
      },
      updatedAt: {
        $ref: "#/$defs/ResourceVersion",
      },
      receiptId: {
        $ref: "#/$defs/ResourceId",
      },
      isSandbox: {
        type: "boolean",
        const: true,
      },
    },
    required: ["provider", "connected", "updatedAt", "receiptId", "isSandbox"],
  },
  ReplyTemplatesListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "reply.templates.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/SalesReplyOperation",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: ["tool"],
      },
    ],
  },
  SalesReplyOperation: {
    type: "object",
    additionalProperties: false,
    properties: {
      resource: {
        $ref: "#/$defs/SalesReplyResource",
      },
      approval: {
        $ref: "#/$defs/SalesReplyResource",
      },
      followup: {
        $ref: "#/$defs/SalesReplyResource",
      },
      items: {
        type: "array",
        items: {
          $ref: "#/$defs/SalesReplyResource",
        },
        maxItems: 100,
      },
      filteredTotal: {
        type: "integer",
        minimum: 0,
      },
      nextCursor: {
        type: ["string", "null"],
      },
      scope: {
        type: "object",
        additionalProperties: true,
      },
      receiptId: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      approvalUrl: {
        type: "string",
      },
      policyDecision: {
        type: "string",
        enum: ["auto_allowed", "approval_required", "denied"],
      },
      conversationUpdatedAt: {
        $ref: "#/$defs/ResourceVersion",
      },
      cancelledIds: {
        type: "array",
        items: {
          $ref: "#/$defs/ResourceId",
        },
        maxItems: 100,
      },
    },
    required: [],
  },
  ReplyTemplatesCreateResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "reply.templates.create",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/SalesReplyOperation",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
        required: ["tool"],
      },
    ],
  },
  ReplyTemplatesUpdateResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "reply.templates.update",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/SalesReplyOperation",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
        required: ["tool"],
      },
    ],
  },
  ReplyTemplatesDeleteResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "reply.templates.delete",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/SalesReplyOperation",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
        required: ["tool"],
      },
    ],
  },
  ReplyPolicyGetResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "reply.policy.get",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/SalesReplyOperation",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: ["tool"],
      },
    ],
  },
  ReplyPolicyUpdateResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "reply.policy.update",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/SalesReplyOperation",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
        required: ["tool"],
      },
    ],
  },
  ReplyApprovalsListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "reply.approvals.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/SalesReplyOperation",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: ["tool"],
      },
    ],
  },
  ConversationDraftSaveResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "conversation.draft.save",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/SalesReplyOperation",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
        required: ["tool"],
      },
    ],
  },
  ConversationFollowupSetResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "conversation.followup.set",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                $ref: "#/$defs/SalesReplyOperation",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: ["tool"],
      },
    ],
  },
  ConversationFollowupClearResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "conversation.followup.clear",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                $ref: "#/$defs/SalesReplyOperation",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: ["tool"],
      },
    ],
  },
  FollowupsDueResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "followups.due",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/SalesReplyOperation",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: ["tool"],
      },
    ],
  },
  ConversationsBulkUpdateResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "conversations.bulk.update",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                type: "object",
                properties: {
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      additionalProperties: true,
                    },
                  },
                  succeeded: {
                    type: "integer",
                  },
                  failed: {
                    type: "integer",
                  },
                  scope: {
                    type: "object",
                    additionalProperties: true,
                  },
                },
                required: ["items", "succeeded", "failed", "scope"],
              },
            ],
          },
        },
      },
    ],
  },
  PipelineBoardResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "pipeline.board",
          },
          data: {
            type: "object",
            additionalProperties: true,
          },
        },
      },
    ],
  },
  CalendarBookingLinkCreateResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "calendar.booking.link.create",
          },
          data: {
            type: "object",
            additionalProperties: true,
          },
        },
      },
    ],
  },
  CalendarMeetingRescheduleResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "calendar.meeting.reschedule",
          },
          data: {
            oneOf: [
              {
                type: "object",
                additionalProperties: true,
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CalendarMeetingCancelResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "calendar.meeting.cancel",
          },
          data: {
            oneOf: [
              {
                type: "object",
                additionalProperties: true,
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CampaignFollowupsConfigureResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "campaign.followups.configure",
          },
          data: {
            oneOf: [
              {
                type: "object",
                additionalProperties: true,
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CampaignVariantsConfigureResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "campaign.variants.configure",
          },
          data: {
            type: "object",
            additionalProperties: true,
          },
        },
      },
    ],
  },
  RecorderSettingsGetResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "recorder.settings.get",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/RecorderSettingsGetOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  RecorderSettingsGetOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      settings: {
        $ref: "#/$defs/RecorderSettings",
      },
      version: {
        type: "integer",
        minimum: 0,
      },
      calendarAutojoinEnabled: {
        type: "boolean",
      },
      transcriptToolsEnabled: {
        type: "boolean",
      },
      calendarConnected: {
        type: "boolean",
      },
    },
    required: [
      "settings",
      "version",
      "calendarAutojoinEnabled",
      "transcriptToolsEnabled",
      "calendarConnected",
    ],
  },
  RecorderSettings: {
    type: "object",
    additionalProperties: false,
    properties: {
      mode: {
        type: "string",
        enum: ["all", "hosted_by_me", "external_attendees", "dmfaster_booked_only", "off"],
      },
      consent: {
        type: "boolean",
      },
      consentNoticeVersion: {
        type: "string",
        minLength: 1,
        maxLength: 100,
      },
      consentNotice: {
        type: "string",
        minLength: 1,
        maxLength: 2000,
      },
      excludeTitleKeywords: {
        type: "array",
        items: {
          type: "string",
          maxLength: 200,
        },
        maxItems: 100,
      },
      excludeDomains: {
        type: "array",
        items: {
          type: "string",
          maxLength: 200,
        },
        maxItems: 100,
      },
      excludeEmails: {
        type: "array",
        items: {
          type: "string",
          maxLength: 254,
        },
        maxItems: 100,
      },
      minDurationMinutes: {
        type: "integer",
        minimum: 1,
        maximum: 240,
      },
      maxDurationMinutes: {
        type: "integer",
        minimum: 1,
        maximum: 240,
      },
      botName: {
        type: "string",
        minLength: 1,
        maxLength: 60,
      },
      language: {
        type: "string",
        enum: ["auto", "fi", "en"],
      },
      redactPii: {
        type: "boolean",
      },
      analyzeNewCalls: {
        type: "boolean",
      },
      monthlyBotMinutes: {
        type: "integer",
        minimum: 0,
        maximum: 100000,
      },
      monthlyTranscriptionMinutes: {
        type: "integer",
        minimum: 0,
        maximum: 100000,
      },
      ownDomains: {
        type: "array",
        maxItems: 20,
        items: {
          type: "string",
          minLength: 3,
          maxLength: 253,
        },
      },
      coachingThresholds: {
        type: "object",
        additionalProperties: false,
        properties: {
          talkRatioBps: {
            type: "integer",
            minimum: 1,
            maximum: 10000,
          },
          monologueMs: {
            type: "integer",
            minimum: 1000,
            maximum: 3600000,
          },
          questionsPer30m: {
            type: "integer",
            minimum: 0,
            maximum: 100,
          },
          interruptionMultiple: {
            type: "integer",
            minimum: 1,
            maximum: 20,
          },
        },
        required: ["talkRatioBps", "monologueMs", "questionsPer30m", "interruptionMultiple"],
      },
    },
    required: [
      "mode",
      "consent",
      "consentNoticeVersion",
      "consentNotice",
      "excludeTitleKeywords",
      "excludeDomains",
      "excludeEmails",
      "minDurationMinutes",
      "maxDurationMinutes",
      "botName",
      "language",
      "redactPii",
      "analyzeNewCalls",
      "monthlyBotMinutes",
      "monthlyTranscriptionMinutes",
    ],
  },
  RecorderSettingsUpdateResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "recorder.settings.update",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/RecorderSettingsUpdateOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  RecorderSettingsUpdateOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      dryRun: {
        type: "boolean",
      },
      version: {
        type: "integer",
        minimum: 0,
      },
      settings: {
        $ref: "#/$defs/RecorderSettings",
      },
      receiptId: {
        type: "string",
        maxLength: 200,
      },
      wouldChange: {
        type: "object",
        additionalProperties: true,
      },
    },
    required: ["dryRun", "version", "settings"],
  },
  RecorderBotsListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "recorder.bots.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/RecorderBotsListOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  RecorderBotsListOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      items: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: {
              type: "string",
              maxLength: 200,
            },
            meetingId: {
              type: "string",
              maxLength: 200,
            },
            status: {
              type: "string",
              maxLength: 200,
            },
            matchedRule: {
              type: "string",
              maxLength: 200,
            },
            deduplicationKey: {
              type: "string",
              maxLength: 64,
            },
            scheduledStartAt: {
              $ref: "#/$defs/ResourceVersion",
            },
            scheduledEndAt: {
              $ref: "#/$defs/ResourceVersion",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
            controlState: {
              oneOf: [
                {
                  type: "string",
                  enum: ["queued", "completed", "denied"],
                },
                {
                  type: "null",
                },
              ],
            },
            controlAction: {
              oneOf: [
                {
                  type: "string",
                  enum: ["cancel", "stop", "remove"],
                },
                {
                  type: "null",
                },
              ],
            },
            controlError: {
              oneOf: [
                {
                  type: "string",
                  maxLength: 100,
                },
                {
                  type: "null",
                },
              ],
            },
          },
          required: [
            "id",
            "meetingId",
            "status",
            "matchedRule",
            "deduplicationKey",
            "scheduledStartAt",
            "scheduledEndAt",
            "updatedAt",
            "controlState",
            "controlAction",
            "controlError",
          ],
        },
        maxItems: 100,
      },
      nextCursor: {
        oneOf: [
          {
            type: "string",
            maxLength: 2000,
          },
          {
            type: "null",
          },
        ],
      },
    },
    required: ["items", "nextCursor"],
  },
  CallTranscriptGetResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "call.transcript.get",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CallTranscriptGetOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CallTranscriptGetOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      meetingId: {
        type: "string",
        maxLength: 200,
      },
      transcriptVersion: {
        type: "integer",
        minimum: 0,
      },
      checksum: {
        type: "string",
        maxLength: 64,
      },
      language: {
        type: "string",
        maxLength: 100,
      },
      format: {
        type: "string",
        enum: ["compact", "segments"],
      },
      text: {
        oneOf: [
          {
            type: "string",
            maxLength: 524288,
          },
          {
            type: "null",
          },
        ],
      },
      segmentCount: {
        type: "integer",
        minimum: 0,
      },
      etag: {
        type: "string",
        maxLength: 100,
      },
      updatedAt: {
        oneOf: [
          {
            type: "string",
            format: "date-time",
            maxLength: 40,
          },
          {
            type: "null",
          },
        ],
      },
      complete: {
        type: "boolean",
      },
      precomputed: {
        type: "boolean",
      },
      mode: {
        type: "string",
        enum: ["full", "compact"],
      },
      segments: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            seq: {
              type: "integer",
              minimum: 0,
            },
            throughSeq: {
              type: "integer",
              minimum: 0,
            },
            speakerId: {
              type: "string",
              maxLength: 200,
            },
            speakerLabel: {
              type: "string",
              maxLength: 500,
            },
            role: {
              type: "string",
              enum: ["team", "external", "unknown"],
            },
            participantId: {
              oneOf: [
                {
                  type: "string",
                  maxLength: 200,
                },
                {
                  type: "null",
                },
              ],
            },
            matchMethod: {
              type: "string",
              maxLength: 200,
            },
            confidence: {
              type: "number",
              minimum: 0,
              maximum: 1,
            },
            startMs: {
              type: "integer",
              minimum: 0,
            },
            endMs: {
              type: "integer",
              minimum: 0,
            },
            text: {
              type: "string",
              maxLength: 100000,
            },
            redacted: {
              type: "boolean",
            },
            truncated: {
              type: "boolean",
            },
            isOrganizer: {
              type: "boolean",
            },
            roleSource: {
              type: "string",
              enum: [
                "workspace_member",
                "own_domain",
                "calendar_organizer",
                "calendar_attendee",
                "human_confirmed",
                "unattributed",
              ],
            },
            roleConfidenceBps: {
              type: "integer",
              minimum: 0,
            },
          },
          required: [
            "seq",
            "throughSeq",
            "speakerId",
            "speakerLabel",
            "role",
            "participantId",
            "matchMethod",
            "confidence",
            "startMs",
            "endMs",
            "text",
            "redacted",
            "truncated",
          ],
        },
        maxItems: 200,
      },
      nextCursor: {
        oneOf: [
          {
            type: "string",
            maxLength: 2000,
          },
          {
            type: "null",
          },
        ],
      },
      metadata: {
        oneOf: [
          {
            type: "object",
            additionalProperties: false,
            properties: {
              title: {
                type: "string",
                maxLength: 500,
              },
              scheduledStartAt: {
                type: "string",
                maxLength: 40,
              },
              scheduledEndAt: {
                type: "string",
                maxLength: 40,
              },
              conversationId: {
                oneOf: [
                  {
                    type: "string",
                    maxLength: 200,
                  },
                  {
                    type: "null",
                  },
                ],
              },
              companyOutreachId: {
                oneOf: [
                  {
                    type: "string",
                    maxLength: 200,
                  },
                  {
                    type: "null",
                  },
                ],
              },
              campaignId: {
                oneOf: [
                  {
                    type: "string",
                    maxLength: 200,
                  },
                  {
                    type: "null",
                  },
                ],
              },
              pipelineCardId: {
                oneOf: [
                  {
                    type: "string",
                    maxLength: 500,
                  },
                  {
                    type: "null",
                  },
                ],
              },
              linkMethod: {
                type: "string",
                maxLength: 200,
              },
              linkConfidence: {
                oneOf: [
                  {
                    type: "number",
                  },
                  {
                    type: "null",
                  },
                ],
              },
              attendees: {
                type: "array",
                maxItems: 100,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    id: {
                      type: "string",
                      maxLength: 200,
                    },
                    label: {
                      type: "string",
                      maxLength: 500,
                    },
                    isOrganizer: {
                      type: "boolean",
                    },
                  },
                  required: ["id", "label", "isOrganizer"],
                },
              },
            },
            required: [
              "title",
              "scheduledStartAt",
              "scheduledEndAt",
              "conversationId",
              "companyOutreachId",
              "campaignId",
              "pipelineCardId",
              "linkMethod",
              "linkConfidence",
              "attendees",
            ],
          },
          {
            type: "null",
          },
        ],
      },
    },
    required: [
      "meetingId",
      "transcriptVersion",
      "checksum",
      "language",
      "mode",
      "segments",
      "nextCursor",
    ],
  },
  CallRecordingGetResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "call.recording.get",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CallRecordingGetOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CallRecordingGetOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      meetingId: {
        type: "string",
        maxLength: 200,
      },
      recordingState: {
        type: "string",
        maxLength: 200,
      },
      durationMs: {
        oneOf: [
          {
            type: "integer",
            minimum: 0,
          },
          {
            type: "null",
          },
        ],
      },
      consentNoticeVersion: {
        type: "string",
        maxLength: 200,
      },
      retentionDeadline: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceVersion",
          },
          {
            type: "null",
          },
        ],
      },
      redactionState: {
        type: "string",
        enum: ["enabled", "disabled"],
      },
      media: {
        oneOf: [
          {
            type: "object",
            additionalProperties: false,
            properties: {
              url: {
                type: "string",
                maxLength: 8000,
              },
              expiresAt: {
                $ref: "#/$defs/ResourceVersion",
              },
            },
            required: ["url", "expiresAt"],
          },
          {
            type: "null",
          },
        ],
      },
    },
    required: [
      "meetingId",
      "recordingState",
      "durationMs",
      "consentNoticeVersion",
      "retentionDeadline",
      "redactionState",
      "media",
    ],
  },
  CallTranscriptsGetResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "call.transcripts.get",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CallTranscriptsGetOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CallTranscriptsGetOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      items: {
        type: "array",
        maxItems: 10,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            meetingId: {
              type: "string",
              maxLength: 200,
            },
            transcript: {
              oneOf: [
                {
                  $ref: "#/$defs/CallTranscriptGetOutput",
                },
                {
                  type: "null",
                },
              ],
            },
            error: {
              oneOf: [
                {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    code: {
                      type: "string",
                      maxLength: 200,
                    },
                    status: {
                      type: "integer",
                      minimum: 400,
                      maximum: 599,
                    },
                  },
                  required: ["code", "status"],
                },
                {
                  type: "null",
                },
              ],
            },
          },
          required: ["meetingId", "transcript", "error"],
        },
      },
      totalBytes: {
        type: "integer",
        minimum: 0,
        maximum: 1048576,
      },
    },
    required: ["items", "totalBytes"],
  },
  CallTranscriptsSearchResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "call.transcripts.search",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CallTranscriptsSearchOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CallTranscriptsSearchOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      items: {
        type: "array",
        maxItems: 50,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            meetingId: {
              type: "string",
              maxLength: 200,
            },
            transcriptVersion: {
              type: "integer",
              minimum: 1,
            },
            seq: {
              type: "integer",
              minimum: 0,
            },
            startMs: {
              type: "integer",
              minimum: 0,
            },
            endMs: {
              type: "integer",
              minimum: 0,
            },
            snippet: {
              type: "string",
              maxLength: 1000,
            },
            redacted: {
              type: "boolean",
            },
          },
          required: [
            "meetingId",
            "transcriptVersion",
            "seq",
            "startMs",
            "endMs",
            "snippet",
            "redacted",
          ],
        },
      },
      nextCursor: {
        oneOf: [
          {
            type: "string",
            maxLength: 2000,
          },
          {
            type: "null",
          },
        ],
      },
    },
    required: ["items", "nextCursor"],
  },
  ReadinessCheckResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "readiness.check",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ReadinessCheckOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  ReadinessCheckOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      for: {
        type: "string",
        enum: [
          "reply",
          "book",
          "followups",
          "send:sms",
          "send:gmail",
          "send:instagram",
          "send:facebook",
          "send:linkedin",
          "launch",
        ],
      },
      ready: {
        type: "boolean",
      },
      checkedAt: {
        type: "string",
        maxLength: 40,
      },
      requiresActionPreflight: {
        type: "boolean",
      },
      blockers: {
        type: "array",
        maxItems: 10,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            code: {
              type: "string",
              maxLength: 200,
            },
            requiredScope: {
              oneOf: [
                {
                  type: "string",
                  maxLength: 200,
                },
                {
                  type: "null",
                },
              ],
            },
            requiredConnection: {
              oneOf: [
                {
                  type: "string",
                  maxLength: 200,
                },
                {
                  type: "null",
                },
              ],
            },
            setupUrl: {
              oneOf: [
                {
                  type: "string",
                  maxLength: 2000,
                },
                {
                  type: "null",
                },
              ],
            },
            nextAction: {
              type: "string",
              maxLength: 1000,
            },
          },
          required: ["code", "requiredScope", "requiredConnection", "setupUrl", "nextAction"],
        },
      },
    },
    required: ["for", "ready", "checkedAt", "requiresActionPreflight", "blockers"],
  },
  SenderRetireResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "sender.retire",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/SenderRetireOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  SenderRetireOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      workerId: {
        type: "string",
        maxLength: 200,
      },
      status: {
        type: "string",
        enum: ["retired", "healthy", "disconnected"],
      },
      updatedAt: {
        type: "string",
        maxLength: 40,
      },
      dryRun: {
        type: "boolean",
      },
      receiptId: {
        type: "string",
        maxLength: 200,
      },
      wouldChange: {
        type: "object",
        additionalProperties: false,
        properties: {
          retiredBefore: {
            type: "boolean",
          },
          retiredAfter: {
            type: "boolean",
          },
        },
        required: ["retiredBefore", "retiredAfter"],
      },
    },
    required: ["workerId", "status", "updatedAt", "dryRun", "wouldChange"],
  },
  SenderUnretireResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "sender.unretire",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/SenderUnretireOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  SenderUnretireOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      workerId: {
        type: "string",
        maxLength: 200,
      },
      status: {
        type: "string",
        enum: ["retired", "healthy", "disconnected"],
      },
      updatedAt: {
        type: "string",
        maxLength: 40,
      },
      dryRun: {
        type: "boolean",
      },
      receiptId: {
        type: "string",
        maxLength: 200,
      },
      wouldChange: {
        type: "object",
        additionalProperties: false,
        properties: {
          retiredBefore: {
            type: "boolean",
          },
          retiredAfter: {
            type: "boolean",
          },
        },
        required: ["retiredBefore", "retiredAfter"],
      },
    },
    required: ["workerId", "status", "updatedAt", "dryRun", "wouldChange"],
  },
  AttributionCheckResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "attribution.check",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AttributionCheckOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  AttributionCheckOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      campaignId: {
        $ref: "#/$defs/ResourceId",
      },
      from: {
        type: "string",
      },
      to: {
        type: "string",
      },
      sends: {
        type: "integer",
        minimum: 0,
      },
      attributed: {
        type: "integer",
        minimum: 0,
      },
      unattributed: {
        type: "integer",
        minimum: 0,
      },
      coverage: {
        oneOf: [
          {
            type: "number",
            minimum: 0,
            maximum: 1,
          },
          {
            type: "null",
          },
        ],
      },
      gap: {
        type: "boolean",
      },
      definition: {
        type: "string",
      },
      historicalRepairPerformed: {
        type: "boolean",
      },
    },
    required: [
      "campaignId",
      "from",
      "to",
      "sends",
      "attributed",
      "unattributed",
      "coverage",
      "gap",
      "definition",
      "historicalRepairPerformed",
    ],
  },
  CampaignReengagementPrepareResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "campaign.reengagement.prepare",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CampaignReengagementPrepareOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CampaignReengagementPrepareOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      dryRun: {
        type: "boolean",
      },
      sourceCampaignId: {
        $ref: "#/$defs/ResourceId",
      },
      campaignId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      listId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      status: {
        type: "string",
        const: "Draft",
      },
      disabled: {
        type: "boolean",
      },
      sent: {
        type: "boolean",
      },
      recipientCount: {
        type: "integer",
        minimum: 0,
      },
      audienceFingerprint: {
        type: "string",
      },
      maxAgeDays: {
        type: "integer",
      },
      freshCopyRequired: {
        type: "boolean",
      },
      receiptId: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
    },
    required: [
      "dryRun",
      "sourceCampaignId",
      "campaignId",
      "listId",
      "status",
      "disabled",
      "sent",
      "recipientCount",
      "audienceFingerprint",
      "maxAgeDays",
      "freshCopyRequired",
      "receiptId",
    ],
  },
  AgentsListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "agents.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentsListOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  AgentsListOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      items: {
        type: "array",
        items: {
          $ref: "#/$defs/SalesAgent",
        },
      },
      nextAfterId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
    },
    required: ["items", "nextAfterId"],
  },
  SalesAgent: {
    type: "object",
    additionalProperties: false,
    properties: {
      id: {
        $ref: "#/$defs/ResourceId",
      },
      workspaceUserId: {
        $ref: "#/$defs/ResourceId",
      },
      name: {
        type: "string",
        maxLength: 100,
      },
      kind: {
        type: "string",
        enum: ["setter", "prospector", "analyst", "custom"],
      },
      status: {
        type: "string",
        enum: ["active", "paused", "disabled"],
      },
      scopes: {
        type: "array",
        items: {
          type: "string",
          maxLength: 200,
        },
        maxItems: 29,
      },
      limits: {
        $ref: "#/$defs/AgentBudgetLimits",
      },
      runtime: {
        type: "string",
        maxLength: 200,
      },
      createdBy: {
        $ref: "#/$defs/ResourceId",
      },
      pausedBy: {
        type: "string",
        maxLength: 200,
      },
      lastSeenAt: {
        oneOf: [
          {
            type: "string",
            maxLength: 200,
          },
          {
            type: "null",
          },
        ],
      },
      createdAt: {
        type: "string",
        maxLength: 200,
      },
      updatedAt: {
        type: "string",
        maxLength: 200,
      },
    },
    required: [
      "id",
      "workspaceUserId",
      "name",
      "kind",
      "status",
      "scopes",
      "limits",
      "runtime",
      "createdBy",
      "pausedBy",
      "lastSeenAt",
      "createdAt",
      "updatedAt",
    ],
  },
  AgentBudgetLimits: {
    type: "object",
    additionalProperties: false,
    properties: {
      sendsPerDay: {
        type: "object",
        additionalProperties: false,
        properties: {
          instagram: {
            type: "integer",
            minimum: 0,
          },
          facebook: {
            type: "integer",
            minimum: 0,
          },
          linkedin: {
            type: "integer",
            minimum: 0,
          },
          gmail: {
            type: "integer",
            minimum: 0,
          },
          sms: {
            type: "integer",
            minimum: 0,
          },
        },
        required: [],
      },
      autoRepliesPerDay: {
        type: "integer",
        minimum: 0,
      },
      bookingsPerDay: {
        type: "integer",
        minimum: 0,
      },
      creditsPerDay: {
        type: "integer",
        minimum: 0,
      },
      smsSpendPerMonthEur: {
        type: "number",
        minimum: 0,
      },
      writesPerHour: {
        type: "integer",
        minimum: 0,
      },
    },
    required: [],
  },
  AgentInspectResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "agent.inspect",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentInspectOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  AgentInspectOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      id: {
        $ref: "#/$defs/ResourceId",
      },
      workspaceUserId: {
        $ref: "#/$defs/ResourceId",
      },
      name: {
        type: "string",
        maxLength: 100,
      },
      kind: {
        type: "string",
        enum: ["setter", "prospector", "analyst", "custom"],
      },
      status: {
        type: "string",
        enum: ["active", "paused", "disabled"],
      },
      scopes: {
        type: "array",
        items: {
          type: "string",
          maxLength: 200,
        },
        maxItems: 29,
      },
      limits: {
        $ref: "#/$defs/AgentBudgetLimits",
      },
      runtime: {
        type: "string",
        maxLength: 200,
      },
      createdBy: {
        $ref: "#/$defs/ResourceId",
      },
      pausedBy: {
        type: "string",
        maxLength: 200,
      },
      lastSeenAt: {
        oneOf: [
          {
            type: "string",
            maxLength: 200,
          },
          {
            type: "null",
          },
        ],
      },
      createdAt: {
        type: "string",
        maxLength: 200,
      },
      updatedAt: {
        type: "string",
        maxLength: 200,
      },
    },
    required: [
      "id",
      "workspaceUserId",
      "name",
      "kind",
      "status",
      "scopes",
      "limits",
      "runtime",
      "createdBy",
      "pausedBy",
      "lastSeenAt",
      "createdAt",
      "updatedAt",
    ],
  },
  AgentCreateRequestResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "agent.create.request",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentCreateRequestOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  AgentCreateRequestOutput: {
    type: "object",
    properties: {
      dryRun: {
        type: "boolean",
      },
      requestId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      approvalUrl: {
        oneOf: [
          {
            type: "string",
            maxLength: 2000,
          },
          {
            type: "null",
          },
        ],
      },
      expiresAt: {
        oneOf: [
          {
            type: "string",
            maxLength: 200,
          },
          {
            type: "null",
          },
        ],
      },
      ownerApprovalRequired: {
        type: "boolean",
      },
      receiptId: {
        type: "string",
        maxLength: 200,
      },
      wouldChange: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: {
            type: "string",
            maxLength: 200,
          },
          kind: {
            type: "string",
            maxLength: 200,
          },
          runtime: {
            type: "string",
            maxLength: 200,
          },
          scopes: {
            type: "array",
            items: {
              type: "string",
              maxLength: 200,
            },
            maxItems: 29,
          },
        },
        required: ["name", "kind", "runtime", "scopes"],
      },
    },
    required: [
      "dryRun",
      "requestId",
      "approvalUrl",
      "expiresAt",
      "ownerApprovalRequired",
      "wouldChange",
    ],
    additionalProperties: false,
  },
  AgentPauseResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "agent.pause",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentPauseOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  AgentPauseOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      dryRun: {
        type: "boolean",
      },
      id: {
        $ref: "#/$defs/ResourceId",
      },
      status: {
        type: "string",
        maxLength: 200,
      },
      updatedAt: {
        type: "string",
        maxLength: 200,
      },
      receiptId: {
        type: "string",
        maxLength: 200,
      },
    },
    required: ["dryRun", "id", "status", "updatedAt"],
  },
  AgentResumeResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "agent.resume",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentResumeOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  AgentResumeOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      dryRun: {
        type: "boolean",
      },
      id: {
        $ref: "#/$defs/ResourceId",
      },
      status: {
        type: "string",
        maxLength: 200,
      },
      updatedAt: {
        type: "string",
        maxLength: 200,
      },
      receiptId: {
        type: "string",
        maxLength: 200,
      },
    },
    required: ["dryRun", "id", "status", "updatedAt"],
  },
  AgentCredentialRotateResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "agent.credential.rotate",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentCredentialRotateOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  AgentCredentialRotateOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      dryRun: {
        type: "boolean",
      },
      agentId: {
        $ref: "#/$defs/ResourceId",
      },
      credentialId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      secret: {
        oneOf: [
          {
            type: "string",
            maxLength: 200,
          },
          {
            type: "null",
          },
        ],
      },
      secretShownOnce: {
        type: "boolean",
      },
      oldCredentialsExpireBy: {
        oneOf: [
          {
            type: "string",
            maxLength: 200,
          },
          {
            type: "null",
          },
        ],
      },
      updatedAt: {
        type: "string",
        maxLength: 200,
      },
      receiptId: {
        type: "string",
        maxLength: 200,
      },
    },
    required: [
      "dryRun",
      "agentId",
      "credentialId",
      "secret",
      "secretShownOnce",
      "oldCredentialsExpireBy",
      "updatedAt",
    ],
  },
  EventConsumersListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "event_consumers.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/EventConsumersListOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  EventConsumersListOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      items: {
        type: "array",
        maxItems: 20,
        items: {
          $ref: "#/$defs/EventConsumer",
        },
      },
      filteredTotal: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
    },
    required: ["items", "filteredTotal"],
  },
  EventConsumer: {
    type: "object",
    additionalProperties: false,
    properties: {
      id: {
        type: "string",
        maxLength: 200,
      },
      workspaceUserId: {
        type: "string",
        maxLength: 200,
      },
      agentId: {
        type: "string",
        maxLength: 200,
      },
      name: {
        type: "string",
        maxLength: 200,
      },
      ackedSequence: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      version: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      createdAt: {
        type: "string",
        maxLength: 200,
      },
      updatedAt: {
        type: "string",
        maxLength: 200,
      },
      dryRun: {
        type: "boolean",
      },
      receiptId: {
        type: "string",
        maxLength: 200,
      },
      headSequence: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      lag: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      oldestUnackedAgeMs: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
    },
    required: [
      "id",
      "workspaceUserId",
      "agentId",
      "name",
      "ackedSequence",
      "version",
      "createdAt",
      "updatedAt",
    ],
  },
  EventConsumersCreateResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "event_consumers.create",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/EventConsumersCreateOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  EventConsumersCreateOutput: {
    $ref: "#/$defs/EventConsumer",
  },
  EventsAckResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "events.ack",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/EventsAckOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  EventsAckOutput: {
    $ref: "#/$defs/EventConsumer",
  },
  EventsSnapshotResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "events.snapshot",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/EventsSnapshotOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  EventsSnapshotOutput: {
    $ref: "#/$defs/EventsListOutput",
  },
  WebhookDeliveriesListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "webhook.deliveries.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/WebhookDeliveriesListOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  WebhookDeliveriesListOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      items: {
        type: "array",
        maxItems: 100,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: {
              type: "string",
              maxLength: 200,
            },
            webhookId: {
              type: "string",
              maxLength: 200,
            },
            eventId: {
              type: "string",
              maxLength: 200,
            },
            sequence: {
              type: "integer",
              minimum: 0,
            },
            orderingKey: {
              type: "string",
              maxLength: 200,
            },
            status: {
              type: "string",
              maxLength: 200,
            },
            attempts: {
              type: "integer",
              minimum: 0,
            },
            lastHttpStatus: {
              oneOf: [
                {
                  type: "integer",
                  minimum: 0,
                },
                {
                  type: "null",
                },
              ],
            },
            lastError: {
              oneOf: [
                {
                  type: "string",
                  maxLength: 200,
                },
                {
                  type: "null",
                },
              ],
            },
            nextAttemptAt: {
              oneOf: [
                {
                  type: "string",
                  maxLength: 200,
                },
                {
                  type: "null",
                },
              ],
            },
            createdAt: {
              type: "string",
              maxLength: 200,
            },
            deliveredAt: {
              oneOf: [
                {
                  type: "string",
                  maxLength: 200,
                },
                {
                  type: "null",
                },
              ],
            },
            latencyMs: {
              oneOf: [
                {
                  type: "integer",
                  minimum: 0,
                },
                {
                  type: "null",
                },
              ],
            },
          },
          required: [
            "id",
            "webhookId",
            "eventId",
            "sequence",
            "orderingKey",
            "status",
            "attempts",
            "lastHttpStatus",
            "lastError",
            "nextAttemptAt",
            "createdAt",
            "deliveredAt",
            "latencyMs",
          ],
        },
      },
      nextCursor: {
        oneOf: [
          {
            type: "string",
            maxLength: 1000,
          },
          {
            type: "null",
          },
        ],
      },
    },
    required: ["items", "nextCursor"],
  },
  WebhooksDlqReplayResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "webhooks.dlq.replay",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/WebhooksDlqReplayOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  WebhooksDlqReplayOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      dryRun: {
        type: "boolean",
      },
      queued: {
        type: "integer",
        minimum: 0,
      },
      wouldQueue: {
        type: "integer",
        minimum: 0,
      },
      receiptId: {
        type: "string",
        maxLength: 200,
      },
    },
    required: ["dryRun", "queued", "wouldQueue"],
  },
  ClassificationFeedbackResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "classification.feedback",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ClassificationFeedbackOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  ClassificationFeedbackOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      dryRun: {
        type: "boolean",
      },
      wouldChange: {
        type: "object",
        additionalProperties: false,
        properties: {
          messageId: {
            type: "string",
            maxLength: 200,
          },
          conversationId: {
            type: "string",
            maxLength: 200,
          },
          correctIntent: {
            type: "string",
            maxLength: 200,
          },
          correctMessageType: {
            type: "string",
            maxLength: 200,
          },
        },
        required: ["messageId", "conversationId", "correctIntent", "correctMessageType"],
      },
      updatedAt: {
        type: "string",
        maxLength: 200,
      },
      receiptId: {
        type: "string",
        maxLength: 200,
      },
    },
    required: ["dryRun", "wouldChange", "updatedAt"],
  },
  ClassificationQualityResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "classification.quality",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ClassificationQualityOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  ClassificationQualityOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      population: {
        type: "string",
        maxLength: 200,
      },
      items: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            language: {
              type: "string",
              maxLength: 200,
            },
            intent: {
              type: "string",
              maxLength: 200,
            },
            truePositive: {
              type: "integer",
              minimum: 0,
            },
            falsePositive: {
              type: "integer",
              minimum: 0,
            },
            falseNegative: {
              type: "integer",
              minimum: 0,
            },
            precision: {
              oneOf: [
                {
                  type: "number",
                },
                {
                  type: "null",
                },
              ],
            },
            recall: {
              oneOf: [
                {
                  type: "number",
                },
                {
                  type: "null",
                },
              ],
            },
          },
          required: [
            "language",
            "intent",
            "truePositive",
            "falsePositive",
            "falseNegative",
            "precision",
            "recall",
          ],
        },
      },
    },
    required: ["population", "items"],
  },
  ClassificationBackfillPlanResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "classification.backfill.plan",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ClassificationBackfillPlanOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  ClassificationBackfillPlanOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      planId: {
        type: "string",
        maxLength: 200,
      },
      dryRun: {
        type: "boolean",
      },
      applied: {
        type: "boolean",
      },
      scannedCount: {
        type: "integer",
        minimum: 0,
      },
      remainingCount: {
        type: "integer",
        minimum: 0,
      },
      complete: {
        type: "boolean",
      },
      counts: {
        type: "object",
        additionalProperties: {
          type: "integer",
        },
      },
      sampleIds: {
        type: "array",
        maxItems: 20,
        items: {
          type: "string",
          maxLength: 200,
        },
      },
      nextAfterId: {
        oneOf: [
          {
            type: "string",
            maxLength: 200,
          },
          {
            type: "null",
          },
        ],
      },
      ownerApprovalRequired: {
        type: "boolean",
      },
    },
    required: [
      "planId",
      "dryRun",
      "applied",
      "scannedCount",
      "remainingCount",
      "complete",
      "counts",
      "sampleIds",
      "nextAfterId",
      "ownerApprovalRequired",
    ],
  },
  WorkQueueListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "work_queue.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/WorkQueueListOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  WorkQueueListOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      items: {
        type: "array",
        maxItems: 100,
        items: {
          $ref: "#/$defs/AgentWorkItem",
        },
      },
      filteredTotal: {
        type: "integer",
        minimum: 0,
      },
      nextCursor: {
        oneOf: [
          {
            type: "string",
            maxLength: 1000,
          },
          {
            type: "null",
          },
        ],
      },
    },
    required: ["items", "filteredTotal", "nextCursor"],
  },
  WorkItemClaimResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "work_item.claim",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/WorkItemClaimOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  WorkItemClaimOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      dryRun: {
        type: "boolean",
      },
      item: {
        $ref: "#/$defs/AgentWorkItem",
      },
      receiptId: {
        type: "string",
        maxLength: 200,
      },
    },
    required: ["dryRun", "item"],
  },
  WorkItemReleaseResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "work_item.release",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/WorkItemReleaseOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  WorkItemReleaseOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      dryRun: {
        type: "boolean",
      },
      item: {
        $ref: "#/$defs/AgentWorkItem",
      },
      receiptId: {
        type: "string",
        maxLength: 200,
      },
    },
    required: ["dryRun", "item"],
  },
  WorkItemSnoozeResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "work_item.snooze",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/WorkItemSnoozeOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  WorkItemSnoozeOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      dryRun: {
        type: "boolean",
      },
      item: {
        $ref: "#/$defs/AgentWorkItem",
      },
      receiptId: {
        type: "string",
        maxLength: 200,
      },
    },
    required: ["dryRun", "item"],
  },
  WorkItemCompleteResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "work_item.complete",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/WorkItemCompleteOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  WorkItemCompleteOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      dryRun: {
        type: "boolean",
      },
      item: {
        $ref: "#/$defs/AgentWorkItem",
      },
      receiptId: {
        type: "string",
        maxLength: 200,
      },
    },
    required: ["dryRun", "item"],
  },
  WorkQueueConfigGetResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "work_queue.config.get",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/WorkQueueConfigGetOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  WorkQueueConfigGetOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      config: {
        type: "object",
        additionalProperties: true,
      },
      version: {
        type: "integer",
        minimum: 0,
      },
      formula: {
        type: "string",
        maxLength: 2000,
      },
      businessHours: {
        type: "string",
        maxLength: 2000,
      },
      dryRun: {
        type: "boolean",
      },
      receiptId: {
        type: "string",
        maxLength: 200,
      },
    },
    required: ["config", "version"],
  },
  WorkQueueConfigUpdateResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "work_queue.config.update",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/WorkQueueConfigUpdateOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  WorkQueueConfigUpdateOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      config: {
        type: "object",
        additionalProperties: true,
      },
      version: {
        type: "integer",
        minimum: 0,
      },
      formula: {
        type: "string",
        maxLength: 2000,
      },
      businessHours: {
        type: "string",
        maxLength: 2000,
      },
      dryRun: {
        type: "boolean",
      },
      receiptId: {
        type: "string",
        maxLength: 200,
      },
    },
    required: ["config", "version"],
  },
  MetricsReconcileResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "metrics.reconcile",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/MetricsReconcileOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  MetricsReconcileOutput: {
    type: "object",
    additionalProperties: false,
    required: [
      "metricsVersion",
      "scope",
      "from",
      "to",
      "timezone",
      "changes",
      "reasons",
      "unknown",
      "readOnly",
      "coverage",
    ],
    properties: {
      metricsAsOf: {
        type: "string",
        format: "date-time",
      },
      metricsVersion: {
        type: "string",
        maxLength: 500,
      },
      scope: {
        type: "object",
        additionalProperties: true,
      },
      from: {
        $ref: "#/$defs/ResourceVersion",
      },
      to: {
        $ref: "#/$defs/ResourceVersion",
      },
      timezone: {
        type: "string",
        maxLength: 500,
      },
      changes: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["metric", "metricId", "old", "current"],
          properties: {
            metric: {
              type: "string",
              maxLength: 500,
            },
            metricId: {
              type: "string",
              maxLength: 500,
            },
            old: {
              type: "integer",
              minimum: 0,
            },
            current: {
              type: "integer",
              minimum: 0,
            },
          },
        },
      },
      reasons: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["code", "total", "ids"],
          properties: {
            code: {
              type: "string",
              maxLength: 500,
            },
            total: {
              type: "integer",
              minimum: 0,
            },
            ids: {
              type: "array",
              maxItems: 100,
              items: {
                type: "string",
                maxLength: 500,
              },
            },
          },
        },
      },
      unknown: {
        type: "object",
        additionalProperties: false,
        required: ["unanchoredMeetings", "unlinkedMeetings"],
        properties: {
          unanchoredMeetings: {
            type: "integer",
            minimum: 0,
          },
          unlinkedMeetings: {
            type: "integer",
            minimum: 0,
          },
          sendsWithoutCompany: {
            type: "integer",
            minimum: 0,
          },
          repliesWithoutCompany: {
            type: "integer",
            minimum: 0,
          },
          meetingsWithoutCompany: {
            type: "integer",
            minimum: 0,
          },
        },
      },
      readOnly: {
        type: "boolean",
        const: true,
      },
      coverage: {
        type: "string",
        maxLength: 1000,
      },
    },
  },
  AgentHeartbeatResult: {
    oneOf: [
      {
        $ref: "#/$defs/AgentHeartbeatFullResult",
      },
      {
        $ref: "#/$defs/AgentHeartbeatCompactResult",
      },
    ],
  },
  AgentHeartbeatFullResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "agent.heartbeat",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentHeartbeatOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: [],
      },
    ],
  },
  AgentHeartbeatOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      agentId: {
        $ref: "#/$defs/ResourceId",
      },
      status: {
        type: "string",
        maxLength: 200,
      },
      at: {
        $ref: "#/$defs/ResourceVersion",
      },
      nextInSeconds: {
        type: "integer",
        minimum: 0,
      },
      dryRun: {
        type: "boolean",
      },
    },
    required: ["agentId", "status", "at", "nextInSeconds", "dryRun"],
  },
  AgentHeartbeatCompactResult: {
    type: "object",
    additionalProperties: false,
    required: ["ok", "serverTime", "contractVersion", "data"],
    properties: {
      ok: {
        const: true,
        type: "boolean",
      },
      serverTime: {
        $ref: "#/$defs/ResourceVersion",
        description:
          "Accepted heartbeat timestamp; uses the advanceable workspace clock in a sandbox.",
      },
      contractVersion: {
        type: "string",
        const: "2.9.0",
      },
      rateLimit: {
        oneOf: [
          {
            $ref: "#/$defs/AgentRateLimitEnvelope",
          },
          {
            type: "null",
          },
        ],
        description: "Negotiated quota metadata, matching the full response envelope.",
      },
      data: {
        type: "object",
        additionalProperties: false,
        required: ["nextInSeconds"],
        properties: {
          nextInSeconds: {
            type: "integer",
            minimum: 0,
          },
        },
      },
    },
  },
  AgentRunStartResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "agent.run.start",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentRunStartOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: [],
      },
    ],
  },
  AgentRunStartOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      dryRun: {
        type: "boolean",
      },
      runId: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      wouldChange: {
        type: "object",
        additionalProperties: false,
        properties: {
          agentId: {
            oneOf: [
              {
                type: "string",
              },
              {
                type: "null",
              },
            ],
          },
          trigger: {
            type: "string",
            enum: ["schedule", "webhook", "manual"],
          },
          triggerRefHash: {
            type: "string",
          },
        },
        required: ["agentId", "trigger", "triggerRefHash"],
      },
      receiptId: {
        type: "string",
      },
    },
    required: ["dryRun", "runId", "wouldChange"],
  },
  AgentRunEndResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "agent.run.end",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentRunEndOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: [],
      },
    ],
  },
  AgentRunEndOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      dryRun: {
        type: "boolean",
      },
      wouldChange: {
        type: "object",
        additionalProperties: false,
        properties: {
          runId: {
            type: "string",
          },
          outcome: {
            type: "string",
            enum: ["completed", "failed", "cancelled"],
          },
        },
        required: ["runId", "outcome"],
      },
      receiptId: {
        type: "string",
      },
    },
    required: ["dryRun", "wouldChange"],
  },
  AgentRunsListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "agent.runs.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentRunsListOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: [],
      },
    ],
  },
  AgentRunsListOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      items: {
        type: "array",
        items: {
          $ref: "#/$defs/AgentRunRecord",
        },
      },
      nextBefore: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      retentionDays: {
        type: "integer",
        const: 90,
      },
    },
    required: ["items", "nextBefore", "retentionDays"],
  },
  AgentRunRecord: {
    type: "object",
    additionalProperties: false,
    properties: {
      activity: {
        $ref: "#/$defs/AgentRunActivity",
      },
      id: {
        type: "string",
      },
      workspaceUserId: {
        type: "string",
      },
      agentId: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      credentialId: {
        type: "string",
      },
      actorUserId: {
        type: "string",
      },
      trigger: {
        type: "string",
        enum: ["schedule", "webhook", "manual", "implicit"],
      },
      triggerRefHash: {
        type: "string",
      },
      status: {
        type: "string",
        enum: ["running", "completed", "failed", "cancelled"],
      },
      outcome: {
        type: "string",
      },
      startedAt: {
        type: "string",
        format: "date-time",
      },
      lastActivityAt: {
        type: "string",
        format: "date-time",
      },
      endedAt: {
        oneOf: [
          {
            type: "string",
            format: "date-time",
          },
          {
            type: "null",
          },
        ],
      },
      summary: {
        type: "string",
      },
    },
    required: [
      "activity",
      "id",
      "workspaceUserId",
      "agentId",
      "credentialId",
      "actorUserId",
      "trigger",
      "triggerRefHash",
      "status",
      "outcome",
      "startedAt",
      "lastActivityAt",
      "endedAt",
      "summary",
    ],
  },
  AgentRunActivity: {
    type: "object",
    additionalProperties: false,
    description:
      "Exact retained metadata for the entire run, independent of call pagination. Sends are confirmed campaign jobs plus sent reply actions; queued/uncertain actions do not count. Bookings require the saved provider-booking timestamp. Attribution requires the original actor runId; missing historical actors are never inferred. Approval references count distinct referenced approvals, not pending approvals.",
    properties: {
      toolCalls: {
        type: "integer",
        minimum: 0,
      },
      failedCalls: {
        type: "integer",
        minimum: 0,
      },
      responseBytes: {
        type: "integer",
        minimum: 0,
      },
      durationMs: {
        type: "integer",
        minimum: 0,
      },
      writeReceipts: {
        type: "integer",
        minimum: 0,
      },
      approvalReferences: {
        type: "integer",
        minimum: 0,
      },
      confirmedCampaignSends: {
        type: "integer",
        minimum: 0,
      },
      confirmedReplies: {
        type: "integer",
        minimum: 0,
      },
      confirmedSends: {
        type: "integer",
        minimum: 0,
      },
      bookings: {
        type: "integer",
        minimum: 0,
      },
      policyRefusals: {
        type: "integer",
        minimum: 0,
      },
    },
    required: [
      "toolCalls",
      "failedCalls",
      "responseBytes",
      "durationMs",
      "writeReceipts",
      "approvalReferences",
      "confirmedCampaignSends",
      "confirmedReplies",
      "confirmedSends",
      "bookings",
      "policyRefusals",
    ],
  },
  AgentRunInspectResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "agent.run.inspect",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentRunInspectOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: [],
      },
    ],
  },
  AgentRunInspectOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      aggregates: {
        type: "array",
        maxItems: 10,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            tool: {
              type: "string",
            },
            calls: {
              type: "integer",
            },
            errors: {
              type: "integer",
            },
            bytes: {
              oneOf: [
                {
                  type: "integer",
                },
                {
                  type: "string",
                },
              ],
            },
            p50Ms: {
              type: "integer",
            },
            p95Ms: {
              type: "integer",
            },
          },
          required: ["tool", "calls", "errors", "bytes", "p50Ms", "p95Ms"],
        },
      },
      aggregatesHasMore: {
        type: "boolean",
      },
      run: {
        $ref: "#/$defs/AgentRunRecord",
      },
      calls: {
        type: "array",
        items: {
          $ref: "#/$defs/AgentRunCall",
        },
      },
      nextAfterSeq: {
        oneOf: [
          {
            type: "integer",
            minimum: 0,
          },
          {
            type: "null",
          },
        ],
      },
      retentionDays: {
        type: "integer",
        const: 90,
      },
    },
    required: ["run", "calls", "nextAfterSeq", "retentionDays"],
  },
  AgentRunCall: {
    type: "object",
    additionalProperties: false,
    properties: {
      requestId: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      serverTimingMs: {
        type: "object",
        additionalProperties: {
          type: "number",
        },
      },
      seq: {
        type: "integer",
        minimum: 0,
      },
      workspaceUserId: {
        type: "string",
      },
      runId: {
        type: "string",
      },
      tool: {
        type: "string",
      },
      argumentHash: {
        type: "string",
      },
      effect: {
        type: "string",
      },
      durationMs: {
        type: "integer",
        minimum: 0,
      },
      ok: {
        type: "boolean",
      },
      errorCode: {
        type: "string",
      },
      responseBytes: {
        type: "integer",
        minimum: 0,
      },
      receiptIds: {
        type: "array",
        items: {
          type: "string",
        },
      },
      approvalIds: {
        type: "array",
        items: {
          type: "string",
        },
      },
      resourceIds: {
        type: "array",
        items: {
          type: "string",
        },
      },
      occurredAt: {
        type: "string",
        format: "date-time",
      },
    },
    required: [
      "seq",
      "workspaceUserId",
      "runId",
      "tool",
      "argumentHash",
      "effect",
      "durationMs",
      "ok",
      "errorCode",
      "responseBytes",
      "receiptIds",
      "approvalIds",
      "resourceIds",
      "occurredAt",
    ],
  },
  WorkspaceHaltResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "workspace.halt",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/WorkspaceHaltOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: [],
      },
    ],
  },
  WorkspaceHaltOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      dryRun: {
        type: "boolean",
      },
      wouldChange: {
        type: "object",
        additionalProperties: false,
        properties: {
          workspaceUserId: {
            type: "string",
          },
          halted: {
            type: "boolean",
          },
          haltEverything: {
            type: "boolean",
          },
          haltedChannels: {
            type: "array",
            items: {
              type: "string",
            },
          },
          haltedBy: {
            type: "string",
          },
          reason: {
            type: "string",
          },
          version: {
            type: "integer",
            minimum: 0,
          },
        },
        required: [
          "workspaceUserId",
          "halted",
          "haltEverything",
          "haltedChannels",
          "haltedBy",
          "reason",
          "version",
        ],
      },
      receiptId: {
        type: "string",
      },
    },
    required: ["dryRun", "wouldChange"],
  },
  WorkspaceResumeResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "workspace.resume",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/WorkspaceResumeOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: [],
      },
    ],
  },
  WorkspaceResumeOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      dryRun: {
        type: "boolean",
      },
      requestId: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      approvalUrl: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
      ownerApprovalRequired: {
        type: "boolean",
      },
      receiptId: {
        type: "string",
      },
    },
    required: ["dryRun", "requestId", "approvalUrl", "ownerApprovalRequired"],
  },
  ChannelHaltResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "channel.halt",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ChannelHaltOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: [],
      },
    ],
  },
  ChannelHaltOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      dryRun: {
        type: "boolean",
      },
      wouldChange: {
        type: "object",
        additionalProperties: false,
        properties: {
          workspaceUserId: {
            type: "string",
          },
          halted: {
            type: "boolean",
          },
          haltEverything: {
            type: "boolean",
          },
          haltedChannels: {
            type: "array",
            items: {
              type: "string",
            },
          },
          haltedBy: {
            type: "string",
          },
          reason: {
            type: "string",
          },
          version: {
            type: "integer",
            minimum: 0,
          },
        },
        required: [
          "workspaceUserId",
          "halted",
          "haltEverything",
          "haltedChannels",
          "haltedBy",
          "reason",
          "version",
        ],
      },
      receiptId: {
        type: "string",
      },
    },
    required: ["dryRun", "wouldChange"],
  },
  WorkspaceAutomationInspectResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "workspace.automation.inspect",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/WorkspaceAutomationInspectOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: [],
      },
    ],
  },
  WorkspaceAutomationInspectOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      workspaceUserId: {
        type: "string",
      },
      halted: {
        type: "boolean",
      },
      haltEverything: {
        type: "boolean",
      },
      haltedChannels: {
        type: "array",
        items: {
          type: "string",
        },
      },
      haltedBy: {
        type: "string",
      },
      reason: {
        type: "string",
      },
      version: {
        type: "integer",
        minimum: 0,
      },
      updatedAt: {
        oneOf: [
          {
            type: "string",
            format: "date-time",
          },
          {
            type: "null",
          },
        ],
      },
    },
    required: [
      "workspaceUserId",
      "halted",
      "haltEverything",
      "haltedChannels",
      "haltedBy",
      "reason",
      "version",
      "updatedAt",
    ],
  },
  AgentFeedbackSubmitResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "feedback.submit",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentWritePreviewData",
              },
              {
                oneOf: [
                  {
                    $ref: "#/$defs/AgentFeedbackSubmitData",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  AgentFeedbackSubmitData: {
    type: "object",
    additionalProperties: false,
    properties: {
      receipt: {
        $ref: "#/$defs/AgentFeedbackReceipt",
      },
      duplicate: {
        type: "boolean",
      },
    },
    required: ["receipt", "duplicate"],
  },
  AgentFeedbackReceipt: {
    type: "object",
    additionalProperties: false,
    properties: {
      feedbackId: {
        type: "string",
        minLength: 1,
        maxLength: 100,
        pattern: ".*\\S.*",
        "x-dmfaster-trim": true,
      },
      receivedAt: {
        type: "string",
        format: "date-time",
      },
      status: {
        type: "string",
        const: "received",
      },
    },
    required: ["feedbackId", "receivedAt", "status"],
  },
  AgentFeedbackListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "feedback.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/AgentFeedbackListData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  AgentFeedbackListData: {
    type: "object",
    additionalProperties: false,
    properties: {
      items: {
        type: "array",
        maxItems: 25,
        items: {
          $ref: "#/$defs/AgentFeedbackListItem",
        },
      },
      nextCursor: {
        type: ["string", "null"],
      },
    },
    required: ["items", "nextCursor"],
  },
  AgentFeedbackListItem: {
    type: "object",
    additionalProperties: false,
    properties: {
      receipt: {
        $ref: "#/$defs/AgentFeedbackReceipt",
      },
      report: {
        $ref: "#/$defs/AgentFeedbackReport",
      },
    },
    required: ["receipt", "report"],
  },
  AgentFeedbackReport: {
    type: "object",
    additionalProperties: false,
    properties: {
      category: {
        type: "string",
        enum: ["bug", "missing_capability", "confusing_behavior", "performance", "improvement"],
      },
      summary: {
        type: "string",
        minLength: 1,
        maxLength: 240,
        pattern: ".*\\S.*",
        "x-dmfaster-trim": true,
        description: "One concrete problem or improvement.",
      },
      task: {
        type: "string",
        minLength: 1,
        maxLength: 1000,
        pattern: ".*\\S.*",
        "x-dmfaster-trim": true,
        description: "The task being attempted, without customer data.",
      },
      observed: {
        type: "string",
        minLength: 1,
        maxLength: 2000,
        pattern: ".*\\S.*",
        "x-dmfaster-trim": true,
        description: "What actually happened; omit private transcripts and raw tool payloads.",
      },
      expected: {
        type: "string",
        minLength: 1,
        maxLength: 2000,
        pattern: ".*\\S.*",
        "x-dmfaster-trim": true,
        description: "What should happen instead.",
      },
      suggestion: {
        type: "string",
        minLength: 1,
        maxLength: 2000,
        pattern: ".*\\S.*",
        "x-dmfaster-trim": true,
        description:
          "Optional proposed improvement; distinguish speculation from observed behavior.",
      },
      toolName: {
        type: "string",
        minLength: 1,
        maxLength: 120,
        pattern: ".*\\S.*",
        "x-dmfaster-trim": true,
        description:
          "Affected MCP or API tool name, if known. Unknown names are allowed for missing tools.",
      },
      requestId: {
        type: "string",
        minLength: 1,
        maxLength: 128,
        pattern: ".*\\S.*",
        "x-dmfaster-trim": true,
        description: "Optional request reference already returned by DM Faster; do not invent one.",
      },
      impact: {
        type: "string",
        enum: ["blocked", "workaround", "minor"],
      },
    },
    required: ["category", "summary"],
  },
  EntityResolveResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "entity.resolve",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/EntityResolveOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: [],
      },
    ],
  },
  EntityResolveOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      person: {
        oneOf: [
          {
            $ref: "#/$defs/AgentEntity",
          },
          {
            type: "null",
          },
        ],
      },
      company: {
        oneOf: [
          {
            $ref: "#/$defs/AgentEntity",
          },
          {
            type: "null",
          },
        ],
      },
      conversations: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: {
              $ref: "#/$defs/ResourceId",
            },
            channel: {
              type: "string",
            },
            status: {
              type: "string",
            },
            lastMessageAt: {
              oneOf: [
                {
                  type: "string",
                },
                {
                  type: "null",
                },
              ],
            },
            intent: {
              type: "string",
            },
            campaignId: {
              oneOf: [
                {
                  $ref: "#/$defs/ResourceId",
                },
                {
                  type: "null",
                },
              ],
            },
          },
          required: ["id", "channel", "status", "lastMessageAt", "intent", "campaignId"],
        },
        maxItems: 100,
      },
      meetings: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: {
              $ref: "#/$defs/ResourceId",
            },
            startsAt: {
              type: "string",
            },
            status: {
              type: "string",
            },
            linkMethod: {
              type: "string",
            },
          },
          required: ["id", "startsAt", "status", "linkMethod"],
        },
        maxItems: 100,
      },
      pipelineCards: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: {
              $ref: "#/$defs/ResourceId",
            },
            campaignId: {
              $ref: "#/$defs/ResourceId",
            },
            entityKey: {
              type: "string",
            },
            stage: {
              type: "string",
            },
            companyId: {
              oneOf: [
                {
                  $ref: "#/$defs/ResourceId",
                },
                {
                  type: "null",
                },
              ],
            },
          },
          required: ["id", "campaignId", "entityKey", "stage", "companyId"],
        },
        maxItems: 100,
      },
      suppressions: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: {
              $ref: "#/$defs/ResourceId",
            },
            type: {
              type: "string",
            },
            value: {
              type: "string",
            },
          },
          required: ["id", "type", "value"],
        },
        maxItems: 100,
      },
      openWorkItems: {
        type: "array",
        items: {
          $ref: "#/$defs/AgentWorkItem",
        },
        maxItems: 100,
      },
      lastTouchPerChannel: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            channel: {
              type: "string",
            },
            at: {
              oneOf: [
                {
                  type: "string",
                },
                {
                  type: "null",
                },
              ],
            },
          },
          required: ["channel", "at"],
        },
        maxItems: 10,
      },
      projection: {
        type: "string",
        const: "read_only",
      },
    },
    required: [
      "person",
      "company",
      "conversations",
      "meetings",
      "pipelineCards",
      "suppressions",
      "openWorkItems",
      "lastTouchPerChannel",
      "projection",
    ],
  },
  AgentEntity: {
    type: "object",
    additionalProperties: false,
    properties: {
      id: {
        $ref: "#/$defs/ResourceId",
      },
      kind: {
        type: "string",
        enum: ["person", "company"],
      },
      name: {
        type: "string",
      },
      companyId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      role: {
        type: "string",
      },
      country: {
        type: "string",
      },
      timezone: {
        type: "string",
      },
      nameVariants: {
        type: "array",
        items: {
          type: "string",
        },
        maxItems: 20,
      },
      source: {
        type: "string",
      },
      version: {
        type: "integer",
        minimum: 0,
      },
      createdAt: {
        type: "string",
      },
      updatedAt: {
        type: "string",
      },
      derived: {
        type: "boolean",
      },
      identities: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            type: {
              type: "string",
              enum: [
                "phone",
                "email",
                "instagram",
                "facebook",
                "linkedin",
                "website_form",
                "domain",
                "business_id",
                "company_outreach",
              ],
            },
            value: {
              type: "string",
              minLength: 1,
              maxLength: 500,
            },
            verified: {
              type: "boolean",
            },
            source: {
              type: "string",
            },
            firstSeenAt: {
              type: "string",
            },
          },
          required: ["type", "value", "verified", "source", "firstSeenAt"],
        },
        maxItems: 150,
      },
    },
    required: [
      "id",
      "kind",
      "name",
      "companyId",
      "role",
      "country",
      "timezone",
      "nameVariants",
      "source",
      "version",
      "createdAt",
      "updatedAt",
      "derived",
      "identities",
    ],
  },
  EntitiesGetResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "entities.get",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/EntitiesGetOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: [],
      },
    ],
  },
  EntitiesGetOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      items: {
        type: "array",
        items: {
          $ref: "#/$defs/AgentEntity",
        },
        maxItems: 100,
      },
      missingIds: {
        type: "array",
        items: {
          $ref: "#/$defs/ResourceId",
        },
        maxItems: 100,
      },
    },
    required: ["items", "missingIds"],
  },
  PeopleUpsertResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "people.upsert",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/PeopleUpsertOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: [],
      },
    ],
  },
  PeopleUpsertOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      dryRun: {
        type: "boolean",
      },
      wouldChange: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: {
            $ref: "#/$defs/ResourceId",
          },
          version: {
            type: "integer",
            minimum: 0,
          },
        },
        required: ["id", "version"],
      },
      entity: {
        oneOf: [
          {
            $ref: "#/$defs/AgentEntity",
          },
          {
            type: "null",
          },
        ],
      },
      receiptId: {
        $ref: "#/$defs/ResourceId",
      },
    },
    required: ["dryRun", "wouldChange", "entity"],
  },
  CompaniesUpsertResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "companies.upsert",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CompaniesUpsertOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: [],
      },
    ],
  },
  CompaniesUpsertOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      dryRun: {
        type: "boolean",
      },
      wouldChange: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: {
            $ref: "#/$defs/ResourceId",
          },
          version: {
            type: "integer",
            minimum: 0,
          },
        },
        required: ["id", "version"],
      },
      entity: {
        oneOf: [
          {
            $ref: "#/$defs/AgentEntity",
          },
          {
            type: "null",
          },
        ],
      },
      receiptId: {
        $ref: "#/$defs/ResourceId",
      },
    },
    required: ["dryRun", "wouldChange", "entity"],
  },
  EntityMergeResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "entity.merge",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/EntityMergeOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: [],
      },
    ],
  },
  EntityMergeOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      dryRun: {
        type: "boolean",
      },
      wouldChange: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceId: {
            $ref: "#/$defs/ResourceId",
          },
          targetId: {
            $ref: "#/$defs/ResourceId",
          },
          sourceVersion: {
            type: "integer",
            minimum: 0,
          },
          targetVersion: {
            type: "integer",
            minimum: 0,
          },
        },
        required: ["sourceId", "targetId"],
      },
      changeId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      receiptId: {
        $ref: "#/$defs/ResourceId",
      },
    },
    required: ["dryRun", "wouldChange", "changeId"],
  },
  EntitySplitResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "entity.split",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/EntitySplitOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: [],
      },
    ],
  },
  EntitySplitOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      dryRun: {
        type: "boolean",
      },
      wouldChange: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceId: {
            $ref: "#/$defs/ResourceId",
          },
          targetId: {
            $ref: "#/$defs/ResourceId",
          },
          sourceVersion: {
            type: "integer",
            minimum: 0,
          },
          targetVersion: {
            type: "integer",
            minimum: 0,
          },
        },
        required: ["sourceId", "targetId"],
      },
      changeId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      receiptId: {
        $ref: "#/$defs/ResourceId",
      },
    },
    required: ["dryRun", "wouldChange", "changeId"],
  },
  BudgetStatusResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "budget.status",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/BudgetStatusOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: [],
      },
    ],
  },
  BudgetStatusOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      enforcementEnabled: {
        type: "boolean",
      },
      agentId: {
        $ref: "#/$defs/ResourceId",
      },
      timezone: {
        type: "string",
      },
      at: {
        $ref: "#/$defs/ResourceVersion",
      },
      items: {
        type: "array",
        maxItems: 10,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            metric: {
              type: "string",
              enum: [
                "send:instagram",
                "send:facebook",
                "send:linkedin",
                "send:gmail",
                "send:sms",
                "autoReplies",
                "bookings",
                "credits",
                "smsCents",
                "writes",
              ],
            },
            unit: {
              type: "string",
              enum: ["EUR_cents", "count"],
            },
            limit: {
              oneOf: [
                {
                  type: "integer",
                  minimum: 0,
                },
                {
                  type: "null",
                },
              ],
            },
            used: {
              type: "integer",
              minimum: 0,
            },
            reserved: {
              type: "integer",
              minimum: 0,
            },
            remaining: {
              oneOf: [
                {
                  type: "integer",
                  minimum: 0,
                },
                {
                  type: "null",
                },
              ],
            },
            periodStart: {
              $ref: "#/$defs/ResourceVersion",
            },
            resetAt: {
              $ref: "#/$defs/ResourceVersion",
            },
          },
          required: [
            "metric",
            "unit",
            "limit",
            "used",
            "reserved",
            "remaining",
            "periodStart",
            "resetAt",
          ],
        },
      },
    },
    required: ["agentId", "timezone", "at", "items"],
  },
  CallStatsGetResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "call.stats.get",
          },
          data: {
            anyOf: [
              {
                $ref: "#/$defs/CallStatsGetOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: [],
      },
    ],
  },
  CallStatsGetOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      items: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            meetingId: {
              $ref: "#/$defs/ResourceId",
            },
            stats: {
              anyOf: [
                {
                  $ref: "#/$defs/CallStatsV2",
                },
                {
                  $ref: "#/$defs/CallStatsLegacy",
                },
                {
                  type: "null",
                },
              ],
            },
            state: {
              type: "string",
              enum: ["ready", "not_precomputed", "legacy_cached"],
            },
          },
          required: ["meetingId", "stats", "state"],
        },
        maxItems: 50,
      },
    },
    required: ["items"],
  },
  CallCoachingGetResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "call.coaching.get",
          },
          data: {
            anyOf: [
              {
                $ref: "#/$defs/CallCoachingGetOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: [],
      },
    ],
  },
  CallCoachingGetOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      meetingId: {
        $ref: "#/$defs/ResourceId",
      },
      state: {
        type: "string",
        enum: ["ready", "not_precomputed", "legacy_cached"],
      },
      assumptionVersion: {
        type: "string",
      },
      flags: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            code: {
              type: "string",
            },
            severity: {
              type: "string",
              const: "advisory",
            },
            value: {
              type: "number",
            },
            threshold: {
              type: "number",
            },
            evidence: {
              type: "array",
              maxItems: 20,
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  seq: {
                    type: "integer",
                    minimum: 0,
                  },
                  startMs: {
                    type: "integer",
                    minimum: 0,
                  },
                },
                required: ["seq", "startMs"],
              },
            },
          },
          required: ["code", "severity", "value", "threshold"],
        },
        maxItems: 20,
      },
    },
    required: ["meetingId", "state", "assumptionVersion", "flags"],
  },
  CallAnalyticsQueryResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "call.analytics.query",
          },
          data: {
            anyOf: [
              {
                $ref: "#/$defs/CallAnalyticsQueryOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: [],
      },
    ],
  },
  CallAnalyticsQueryOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      rows: {
        type: "array",
        maxItems: 100,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            group: {
              type: "string",
            },
            n: {
              type: "integer",
              minimum: 0,
            },
            mean: {
              type: "object",
              additionalProperties: {
                anyOf: [
                  {
                    type: "number",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            },
            p50: {
              type: "object",
              additionalProperties: {
                anyOf: [
                  {
                    type: "number",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            },
            p90: {
              type: "object",
              additionalProperties: {
                anyOf: [
                  {
                    type: "number",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            },
          },
          required: ["group", "n", "mean", "p50", "p90"],
        },
      },
      timezone: {
        type: "string",
        maxLength: 100,
      },
      benchmarkScope: {
        type: "string",
        const: "authorized_calls",
      },
      excluded: {
        type: "object",
        additionalProperties: false,
        properties: {
          lowCoverage: {
            type: "integer",
            minimum: 0,
          },
          noTranscript: {
            type: "integer",
            minimum: 0,
          },
          notPrecomputed: {
            type: "integer",
            minimum: 0,
          },
          noAccess: {
            type: "integer",
            minimum: 0,
          },
          privacy: {
            type: "integer",
            minimum: 0,
          },
        },
        required: ["lowCoverage", "noTranscript", "notPrecomputed", "noAccess", "privacy"],
      },
      suppressedGroups: {
        type: "integer",
        minimum: 0,
      },
      totalGroups: {
        type: "integer",
        minimum: 0,
      },
      nextCursor: {
        anyOf: [
          {
            type: "string",
          },
          {
            type: "null",
          },
        ],
      },
    },
    required: [
      "rows",
      "timezone",
      "benchmarkScope",
      "excluded",
      "suppressedGroups",
      "totalGroups",
      "nextCursor",
    ],
  },
  CallInsightGetResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "call.insight.get",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CallInsightGetOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CallInsightGetOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      meetingId: {
        $ref: "#/$defs/ResourceId",
      },
      state: {
        type: "string",
        maxLength: 40,
      },
      insight: {
        oneOf: [
          {
            type: "object",
            additionalProperties: false,
            properties: {
              id: {
                type: "string",
                maxLength: 300,
              },
              version: {
                type: "string",
                maxLength: 300,
              },
              model: {
                type: "string",
                maxLength: 300,
              },
              transcriptVersion: {
                type: "integer",
                minimum: 0,
              },
              reviewState: {
                type: "string",
                maxLength: 40,
              },
              reviewFeedback: {
                type: "string",
                maxLength: 2000,
              },
              generatedAt: {
                oneOf: [
                  {
                    type: "string",
                    maxLength: 40,
                  },
                  {
                    type: "null",
                  },
                ],
              },
              reviewedAt: {
                oneOf: [
                  {
                    type: "string",
                    maxLength: 40,
                  },
                  {
                    type: "null",
                  },
                ],
              },
              redacted: {
                type: "boolean",
              },
              result: {
                oneOf: [
                  {
                    $ref: "#/$defs/CallSalesInsightV1",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            },
            required: [
              "id",
              "version",
              "model",
              "transcriptVersion",
              "reviewState",
              "reviewFeedback",
              "generatedAt",
              "reviewedAt",
              "redacted",
              "result",
            ],
          },
          {
            type: "null",
          },
        ],
      },
    },
    required: ["meetingId", "state", "insight"],
  },
  CallSalesInsightV1: {
    type: "object",
    additionalProperties: false,
    properties: {
      schemaVersion: {
        type: "string",
        const: "sales_insight_v1",
      },
      summary: {
        type: "object",
        additionalProperties: false,
        properties: {
          text: {
            type: "string",
            maxLength: 10000,
          },
          evidence: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                utteranceSourceIds: {
                  type: "array",
                  items: {
                    type: "string",
                    maxLength: 300,
                  },
                  maxItems: 100,
                },
                startMs: {
                  type: "integer",
                  minimum: 0,
                },
                endMs: {
                  type: "integer",
                  minimum: 0,
                },
              },
              required: ["utteranceSourceIds", "startMs", "endMs"],
            },
            maxItems: 30,
          },
        },
        required: ["text", "evidence"],
      },
      painPoints: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            text: {
              type: "string",
              maxLength: 10000,
            },
            evidence: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  utteranceSourceIds: {
                    type: "array",
                    items: {
                      type: "string",
                      maxLength: 300,
                    },
                    maxItems: 100,
                  },
                  startMs: {
                    type: "integer",
                    minimum: 0,
                  },
                  endMs: {
                    type: "integer",
                    minimum: 0,
                  },
                },
                required: ["utteranceSourceIds", "startMs", "endMs"],
              },
              maxItems: 30,
            },
          },
          required: ["text", "evidence"],
        },
        maxItems: 100,
      },
      objections: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            text: {
              type: "string",
              maxLength: 10000,
            },
            evidence: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  utteranceSourceIds: {
                    type: "array",
                    items: {
                      type: "string",
                      maxLength: 300,
                    },
                    maxItems: 100,
                  },
                  startMs: {
                    type: "integer",
                    minimum: 0,
                  },
                  endMs: {
                    type: "integer",
                    minimum: 0,
                  },
                },
                required: ["utteranceSourceIds", "startMs", "endMs"],
              },
              maxItems: 30,
            },
          },
          required: ["text", "evidence"],
        },
        maxItems: 100,
      },
      decisionProcess: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            text: {
              type: "string",
              maxLength: 10000,
            },
            evidence: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  utteranceSourceIds: {
                    type: "array",
                    items: {
                      type: "string",
                      maxLength: 300,
                    },
                    maxItems: 100,
                  },
                  startMs: {
                    type: "integer",
                    minimum: 0,
                  },
                  endMs: {
                    type: "integer",
                    minimum: 0,
                  },
                },
                required: ["utteranceSourceIds", "startMs", "endMs"],
              },
              maxItems: 30,
            },
          },
          required: ["text", "evidence"],
        },
        maxItems: 100,
      },
      commitments: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            text: {
              type: "string",
              maxLength: 10000,
            },
            evidence: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  utteranceSourceIds: {
                    type: "array",
                    items: {
                      type: "string",
                      maxLength: 300,
                    },
                    maxItems: 100,
                  },
                  startMs: {
                    type: "integer",
                    minimum: 0,
                  },
                  endMs: {
                    type: "integer",
                    minimum: 0,
                  },
                },
                required: ["utteranceSourceIds", "startMs", "endMs"],
              },
              maxItems: 30,
            },
          },
          required: ["text", "evidence"],
        },
        maxItems: 100,
      },
      nextSteps: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            text: {
              type: "string",
              maxLength: 10000,
            },
            evidence: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  utteranceSourceIds: {
                    type: "array",
                    items: {
                      type: "string",
                      maxLength: 300,
                    },
                    maxItems: 100,
                  },
                  startMs: {
                    type: "integer",
                    minimum: 0,
                  },
                  endMs: {
                    type: "integer",
                    minimum: 0,
                  },
                },
                required: ["utteranceSourceIds", "startMs", "endMs"],
              },
              maxItems: 30,
            },
          },
          required: ["text", "evidence"],
        },
        maxItems: 100,
      },
      crmNoteDraft: {
        type: "object",
        additionalProperties: false,
        properties: {
          text: {
            type: "string",
            maxLength: 10000,
          },
          evidence: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                utteranceSourceIds: {
                  type: "array",
                  items: {
                    type: "string",
                    maxLength: 300,
                  },
                  maxItems: 100,
                },
                startMs: {
                  type: "integer",
                  minimum: 0,
                },
                endMs: {
                  type: "integer",
                  minimum: 0,
                },
              },
              required: ["utteranceSourceIds", "startMs", "endMs"],
            },
            maxItems: 30,
          },
        },
        required: ["text", "evidence"],
      },
    },
    required: [
      "schemaVersion",
      "summary",
      "painPoints",
      "objections",
      "decisionProcess",
      "commitments",
      "nextSteps",
      "crmNoteDraft",
    ],
  },
  CallAccessListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "call.access.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CallAccessListOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CallAccessListOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      meetingId: {
        $ref: "#/$defs/ResourceId",
      },
      nextCursor: {
        oneOf: [
          {
            type: "string",
            maxLength: 1500,
          },
          {
            type: "null",
          },
        ],
      },
      items: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: {
              type: "string",
              maxLength: 300,
            },
            kind: {
              type: "string",
              enum: ["grant", "share_link"],
            },
            userId: {
              oneOf: [
                {
                  type: "string",
                  maxLength: 300,
                },
                {
                  type: "null",
                },
              ],
            },
            role: {
              oneOf: [
                {
                  type: "string",
                  maxLength: 40,
                },
                {
                  type: "null",
                },
              ],
            },
            source: {
              type: "string",
              maxLength: 40,
            },
            createdAt: {
              type: "string",
              maxLength: 40,
            },
            expiresAt: {
              oneOf: [
                {
                  type: "string",
                  maxLength: 40,
                },
                {
                  type: "null",
                },
              ],
            },
            revokedAt: {
              oneOf: [
                {
                  type: "string",
                  maxLength: 40,
                },
                {
                  type: "null",
                },
              ],
            },
          },
          required: [
            "id",
            "kind",
            "userId",
            "role",
            "source",
            "createdAt",
            "expiresAt",
            "revokedAt",
          ],
        },
        maxItems: 100,
      },
    },
    required: ["meetingId", "nextCursor", "items"],
  },
  CallAuditListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "call.audit.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CallAuditListOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CallAuditListOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      meetingId: {
        $ref: "#/$defs/ResourceId",
      },
      nextCursor: {
        oneOf: [
          {
            type: "string",
            maxLength: 1500,
          },
          {
            type: "null",
          },
        ],
      },
      items: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: {
              type: "string",
              maxLength: 300,
            },
            eventType: {
              type: "string",
              maxLength: 100,
            },
            subjectType: {
              type: "string",
              maxLength: 100,
            },
            subjectId: {
              type: "string",
              maxLength: 300,
            },
            actorType: {
              type: "string",
              enum: ["agent", "user", "system"],
            },
            actorUserId: {
              oneOf: [
                {
                  type: "string",
                  maxLength: 300,
                },
                {
                  type: "null",
                },
              ],
            },
            agentId: {
              oneOf: [
                {
                  type: "string",
                  maxLength: 300,
                },
                {
                  type: "null",
                },
              ],
            },
            occurredAt: {
              type: "string",
              maxLength: 40,
            },
          },
          required: [
            "id",
            "eventType",
            "subjectType",
            "subjectId",
            "actorType",
            "actorUserId",
            "agentId",
            "occurredAt",
          ],
        },
        maxItems: 100,
      },
    },
    required: ["meetingId", "nextCursor", "items"],
  },
  CallActivityGetResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "call.activity.get",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CallActivityGetOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CallActivityGetOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      meetingId: {
        $ref: "#/$defs/ResourceId",
      },
      nextCursor: {
        oneOf: [
          {
            type: "string",
            maxLength: 1500,
          },
          {
            type: "null",
          },
        ],
      },
      items: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: {
              type: "string",
              maxLength: 300,
            },
            source: {
              type: "string",
              enum: ["call_context", "outreach"],
            },
            type: {
              type: "string",
              maxLength: 100,
            },
            occurredAt: {
              type: "string",
              maxLength: 40,
            },
            actorUserId: {
              oneOf: [
                {
                  type: "string",
                  maxLength: 300,
                },
                {
                  type: "null",
                },
              ],
            },
            companyId: {
              oneOf: [
                {
                  type: "string",
                  maxLength: 300,
                },
                {
                  type: "null",
                },
              ],
            },
            companyOutreachId: {
              oneOf: [
                {
                  type: "string",
                  maxLength: 300,
                },
                {
                  type: "null",
                },
              ],
            },
            campaignId: {
              oneOf: [
                {
                  type: "string",
                  maxLength: 300,
                },
                {
                  type: "null",
                },
              ],
            },
            stage: {
              oneOf: [
                {
                  type: "string",
                  maxLength: 100,
                },
                {
                  type: "null",
                },
              ],
            },
          },
          required: [
            "id",
            "source",
            "type",
            "occurredAt",
            "actorUserId",
            "companyId",
            "companyOutreachId",
            "campaignId",
            "stage",
          ],
        },
        maxItems: 100,
      },
    },
    required: ["meetingId", "nextCursor", "items"],
  },
  CallAnalysisGetResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "call.analysis.get",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CallAnalysisGetOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CallAnalysisGetOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      meetingId: {
        $ref: "#/$defs/ResourceId",
      },
      state: {
        type: "string",
        maxLength: 40,
      },
      insight: {
        oneOf: [
          {
            type: "object",
            additionalProperties: false,
            properties: {
              id: {
                type: "string",
                maxLength: 300,
              },
              version: {
                type: "string",
                maxLength: 300,
              },
              model: {
                type: "string",
                maxLength: 300,
              },
              transcriptVersion: {
                type: "integer",
                minimum: 0,
              },
              reviewState: {
                type: "string",
                maxLength: 40,
              },
              reviewFeedback: {
                type: "string",
                maxLength: 2000,
              },
              generatedAt: {
                oneOf: [
                  {
                    type: "string",
                    maxLength: 40,
                  },
                  {
                    type: "null",
                  },
                ],
              },
              reviewedAt: {
                oneOf: [
                  {
                    type: "string",
                    maxLength: 40,
                  },
                  {
                    type: "null",
                  },
                ],
              },
              redacted: {
                type: "boolean",
              },
              result: {
                oneOf: [
                  {
                    $ref: "#/$defs/CallSalesInsightV1",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            },
            required: [
              "id",
              "version",
              "model",
              "transcriptVersion",
              "reviewState",
              "reviewFeedback",
              "generatedAt",
              "reviewedAt",
              "redacted",
              "result",
            ],
          },
          {
            type: "null",
          },
        ],
      },
      analysis: {
        oneOf: [
          {
            type: "object",
            additionalProperties: false,
            properties: {
              id: {
                type: "string",
                maxLength: 300,
              },
              analysisVersion: {
                type: "string",
                maxLength: 300,
              },
              model: {
                type: "string",
                maxLength: 300,
              },
              transcriptVersion: {
                type: "integer",
                minimum: 0,
              },
              generatedAt: {
                type: "string",
                maxLength: 300,
              },
              redacted: {
                type: "boolean",
              },
              language: {
                type: "string",
                maxLength: 40,
              },
              talkRatioTeamBps: {
                oneOf: [
                  {
                    type: "integer",
                    minimum: 0,
                    maximum: 10000,
                  },
                  {
                    type: "null",
                  },
                ],
              },
              questionsAsked: {
                oneOf: [
                  {
                    type: "integer",
                    minimum: 0,
                  },
                  {
                    type: "null",
                  },
                ],
              },
              result: {
                $ref: "#/$defs/CallAnalysisV1",
              },
            },
            required: [
              "id",
              "analysisVersion",
              "model",
              "transcriptVersion",
              "generatedAt",
              "redacted",
              "language",
              "talkRatioTeamBps",
              "questionsAsked",
              "result",
            ],
          },
          {
            type: "null",
          },
        ],
      },
    },
    required: ["meetingId", "state", "insight", "analysis"],
  },
  CallAnalysisV1: {
    type: "object",
    properties: {
      schemaVersion: {
        type: "string",
        const: "call_analysis_v1",
      },
      summary: {
        anyOf: [
          {
            type: "object",
            properties: {
              text: {
                type: "string",
                minLength: 1,
                maxLength: 2000,
              },
              evidence: {
                minItems: 1,
                maxItems: 20,
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    seq: {
                      type: "integer",
                      minimum: 0,
                      maximum: 9007199254740991,
                    },
                    startMs: {
                      type: "integer",
                      minimum: 0,
                      maximum: 86400000,
                    },
                    endMs: {
                      type: "integer",
                      minimum: 0,
                      maximum: 86400000,
                    },
                    quote: {
                      type: "string",
                      minLength: 1,
                      maxLength: 200,
                    },
                  },
                  required: ["seq", "startMs", "endMs", "quote"],
                  additionalProperties: false,
                },
              },
            },
            required: ["text", "evidence"],
            additionalProperties: false,
          },
          {
            type: "null",
          },
        ],
      },
      proposedOutcome: {
        anyOf: [
          {
            type: "object",
            properties: {
              value: {
                type: "string",
                enum: ["meeting_held", "no_show", "won", "lost", "follow_up", "rescheduled"],
              },
              confidence: {
                type: "number",
                minimum: 0,
                maximum: 1,
              },
              reason: {
                type: "string",
                minLength: 1,
                maxLength: 2000,
              },
              evidence: {
                minItems: 1,
                maxItems: 20,
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    seq: {
                      type: "integer",
                      minimum: 0,
                      maximum: 9007199254740991,
                    },
                    startMs: {
                      type: "integer",
                      minimum: 0,
                      maximum: 86400000,
                    },
                    endMs: {
                      type: "integer",
                      minimum: 0,
                      maximum: 86400000,
                    },
                    quote: {
                      type: "string",
                      minLength: 1,
                      maxLength: 200,
                    },
                  },
                  required: ["seq", "startMs", "endMs", "quote"],
                  additionalProperties: false,
                },
              },
            },
            required: ["value", "confidence", "reason", "evidence"],
            additionalProperties: false,
          },
          {
            type: "null",
          },
        ],
      },
      nextSteps: {
        maxItems: 30,
        type: "array",
        items: {
          type: "object",
          properties: {
            text: {
              type: "string",
              minLength: 1,
              maxLength: 2000,
            },
            owner: {
              anyOf: [
                {
                  type: "string",
                  minLength: 1,
                  maxLength: 200,
                },
                {
                  type: "null",
                },
              ],
            },
            dueAt: {
              anyOf: [
                {
                  type: "string",
                  format: "date-time",
                  pattern:
                    "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d+)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
                },
                {
                  type: "null",
                },
              ],
            },
            evidence: {
              minItems: 1,
              maxItems: 20,
              type: "array",
              items: {
                type: "object",
                properties: {
                  seq: {
                    type: "integer",
                    minimum: 0,
                    maximum: 9007199254740991,
                  },
                  startMs: {
                    type: "integer",
                    minimum: 0,
                    maximum: 86400000,
                  },
                  endMs: {
                    type: "integer",
                    minimum: 0,
                    maximum: 86400000,
                  },
                  quote: {
                    type: "string",
                    minLength: 1,
                    maxLength: 200,
                  },
                },
                required: ["seq", "startMs", "endMs", "quote"],
                additionalProperties: false,
              },
            },
          },
          required: ["text", "owner", "dueAt", "evidence"],
          additionalProperties: false,
        },
      },
      objections: {
        maxItems: 30,
        type: "array",
        items: {
          type: "object",
          properties: {
            type: {
              type: "string",
              minLength: 1,
              maxLength: 200,
            },
            text: {
              type: "string",
              minLength: 1,
              maxLength: 2000,
            },
            handled: {
              type: ["boolean", "null"],
            },
            evidence: {
              minItems: 1,
              maxItems: 20,
              type: "array",
              items: {
                type: "object",
                properties: {
                  seq: {
                    type: "integer",
                    minimum: 0,
                    maximum: 9007199254740991,
                  },
                  startMs: {
                    type: "integer",
                    minimum: 0,
                    maximum: 86400000,
                  },
                  endMs: {
                    type: "integer",
                    minimum: 0,
                    maximum: 86400000,
                  },
                  quote: {
                    type: "string",
                    minLength: 1,
                    maxLength: 200,
                  },
                },
                required: ["seq", "startMs", "endMs", "quote"],
                additionalProperties: false,
              },
            },
          },
          required: ["type", "text", "handled", "evidence"],
          additionalProperties: false,
        },
      },
      pricingDiscussed: {
        anyOf: [
          {
            type: "object",
            properties: {
              mentioned: {
                type: "boolean",
              },
              amounts: {
                maxItems: 20,
                type: "array",
                items: {
                  type: "string",
                  minLength: 1,
                  maxLength: 200,
                },
              },
              reaction: {
                anyOf: [
                  {
                    type: "string",
                    minLength: 1,
                    maxLength: 2000,
                  },
                  {
                    type: "null",
                  },
                ],
              },
              evidence: {
                minItems: 1,
                maxItems: 20,
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    seq: {
                      type: "integer",
                      minimum: 0,
                      maximum: 9007199254740991,
                    },
                    startMs: {
                      type: "integer",
                      minimum: 0,
                      maximum: 86400000,
                    },
                    endMs: {
                      type: "integer",
                      minimum: 0,
                      maximum: 86400000,
                    },
                    quote: {
                      type: "string",
                      minLength: 1,
                      maxLength: 200,
                    },
                  },
                  required: ["seq", "startMs", "endMs", "quote"],
                  additionalProperties: false,
                },
              },
            },
            required: ["mentioned", "amounts", "reaction", "evidence"],
            additionalProperties: false,
          },
          {
            type: "null",
          },
        ],
      },
      buyingSignals: {
        maxItems: 30,
        type: "array",
        items: {
          type: "object",
          properties: {
            text: {
              type: "string",
              minLength: 1,
              maxLength: 2000,
            },
            evidence: {
              minItems: 1,
              maxItems: 20,
              type: "array",
              items: {
                type: "object",
                properties: {
                  seq: {
                    type: "integer",
                    minimum: 0,
                    maximum: 9007199254740991,
                  },
                  startMs: {
                    type: "integer",
                    minimum: 0,
                    maximum: 86400000,
                  },
                  endMs: {
                    type: "integer",
                    minimum: 0,
                    maximum: 86400000,
                  },
                  quote: {
                    type: "string",
                    minLength: 1,
                    maxLength: 200,
                  },
                },
                required: ["seq", "startMs", "endMs", "quote"],
                additionalProperties: false,
              },
            },
          },
          required: ["text", "evidence"],
          additionalProperties: false,
        },
      },
      decisionMaker: {
        anyOf: [
          {
            type: "object",
            properties: {
              present: {
                type: "boolean",
              },
              name: {
                anyOf: [
                  {
                    type: "string",
                    minLength: 1,
                    maxLength: 200,
                  },
                  {
                    type: "null",
                  },
                ],
              },
              role: {
                anyOf: [
                  {
                    type: "string",
                    minLength: 1,
                    maxLength: 200,
                  },
                  {
                    type: "null",
                  },
                ],
              },
              evidence: {
                minItems: 1,
                maxItems: 20,
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    seq: {
                      type: "integer",
                      minimum: 0,
                      maximum: 9007199254740991,
                    },
                    startMs: {
                      type: "integer",
                      minimum: 0,
                      maximum: 86400000,
                    },
                    endMs: {
                      type: "integer",
                      minimum: 0,
                      maximum: 86400000,
                    },
                    quote: {
                      type: "string",
                      minLength: 1,
                      maxLength: 200,
                    },
                  },
                  required: ["seq", "startMs", "endMs", "quote"],
                  additionalProperties: false,
                },
              },
            },
            required: ["present", "name", "role", "evidence"],
            additionalProperties: false,
          },
          {
            type: "null",
          },
        ],
      },
      competitors: {
        maxItems: 30,
        type: "array",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string",
              minLength: 1,
              maxLength: 200,
            },
            evidence: {
              minItems: 1,
              maxItems: 20,
              type: "array",
              items: {
                type: "object",
                properties: {
                  seq: {
                    type: "integer",
                    minimum: 0,
                    maximum: 9007199254740991,
                  },
                  startMs: {
                    type: "integer",
                    minimum: 0,
                    maximum: 86400000,
                  },
                  endMs: {
                    type: "integer",
                    minimum: 0,
                    maximum: 86400000,
                  },
                  quote: {
                    type: "string",
                    minLength: 1,
                    maxLength: 200,
                  },
                },
                required: ["seq", "startMs", "endMs", "quote"],
                additionalProperties: false,
              },
            },
          },
          required: ["name", "evidence"],
          additionalProperties: false,
        },
      },
      timeline: {
        anyOf: [
          {
            type: "object",
            properties: {
              text: {
                type: "string",
                minLength: 1,
                maxLength: 2000,
              },
              evidence: {
                minItems: 1,
                maxItems: 20,
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    seq: {
                      type: "integer",
                      minimum: 0,
                      maximum: 9007199254740991,
                    },
                    startMs: {
                      type: "integer",
                      minimum: 0,
                      maximum: 86400000,
                    },
                    endMs: {
                      type: "integer",
                      minimum: 0,
                      maximum: 86400000,
                    },
                    quote: {
                      type: "string",
                      minLength: 1,
                      maxLength: 200,
                    },
                  },
                  required: ["seq", "startMs", "endMs", "quote"],
                  additionalProperties: false,
                },
              },
            },
            required: ["text", "evidence"],
            additionalProperties: false,
          },
          {
            type: "null",
          },
        ],
      },
      topics: {
        maxItems: 30,
        type: "array",
        items: {
          type: "object",
          properties: {
            label: {
              type: "string",
              minLength: 1,
              maxLength: 200,
            },
            startMs: {
              type: "integer",
              minimum: 0,
              maximum: 86400000,
            },
            endMs: {
              type: "integer",
              minimum: 0,
              maximum: 86400000,
            },
            evidence: {
              minItems: 1,
              maxItems: 20,
              type: "array",
              items: {
                type: "object",
                properties: {
                  seq: {
                    type: "integer",
                    minimum: 0,
                    maximum: 9007199254740991,
                  },
                  startMs: {
                    type: "integer",
                    minimum: 0,
                    maximum: 86400000,
                  },
                  endMs: {
                    type: "integer",
                    minimum: 0,
                    maximum: 86400000,
                  },
                  quote: {
                    type: "string",
                    minLength: 1,
                    maxLength: 200,
                  },
                },
                required: ["seq", "startMs", "endMs", "quote"],
                additionalProperties: false,
              },
            },
          },
          required: ["label", "startMs", "endMs", "evidence"],
          additionalProperties: false,
        },
      },
      chapters: {
        maxItems: 30,
        type: "array",
        items: {
          type: "object",
          properties: {
            title: {
              type: "string",
              minLength: 1,
              maxLength: 200,
            },
            startMs: {
              type: "integer",
              minimum: 0,
              maximum: 86400000,
            },
            endMs: {
              type: "integer",
              minimum: 0,
              maximum: 86400000,
            },
            summary: {
              type: "string",
              minLength: 1,
              maxLength: 2000,
            },
            evidence: {
              minItems: 1,
              maxItems: 20,
              type: "array",
              items: {
                type: "object",
                properties: {
                  seq: {
                    type: "integer",
                    minimum: 0,
                    maximum: 9007199254740991,
                  },
                  startMs: {
                    type: "integer",
                    minimum: 0,
                    maximum: 86400000,
                  },
                  endMs: {
                    type: "integer",
                    minimum: 0,
                    maximum: 86400000,
                  },
                  quote: {
                    type: "string",
                    minLength: 1,
                    maxLength: 200,
                  },
                },
                required: ["seq", "startMs", "endMs", "quote"],
                additionalProperties: false,
              },
            },
          },
          required: ["title", "startMs", "endMs", "summary", "evidence"],
          additionalProperties: false,
        },
      },
      sentiment: {
        anyOf: [
          {
            type: "object",
            properties: {
              team: {
                anyOf: [
                  {
                    type: "object",
                    properties: {
                      value: {
                        type: "string",
                        enum: ["positive", "neutral", "negative"],
                      },
                      evidence: {
                        minItems: 1,
                        maxItems: 20,
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            seq: {
                              type: "integer",
                              minimum: 0,
                              maximum: 9007199254740991,
                            },
                            startMs: {
                              type: "integer",
                              minimum: 0,
                              maximum: 86400000,
                            },
                            endMs: {
                              type: "integer",
                              minimum: 0,
                              maximum: 86400000,
                            },
                            quote: {
                              type: "string",
                              minLength: 1,
                              maxLength: 200,
                            },
                          },
                          required: ["seq", "startMs", "endMs", "quote"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["value", "evidence"],
                    additionalProperties: false,
                  },
                  {
                    type: "null",
                  },
                ],
              },
              external: {
                anyOf: [
                  {
                    type: "object",
                    properties: {
                      value: {
                        type: "string",
                        enum: ["positive", "neutral", "negative"],
                      },
                      evidence: {
                        minItems: 1,
                        maxItems: 20,
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            seq: {
                              type: "integer",
                              minimum: 0,
                              maximum: 9007199254740991,
                            },
                            startMs: {
                              type: "integer",
                              minimum: 0,
                              maximum: 86400000,
                            },
                            endMs: {
                              type: "integer",
                              minimum: 0,
                              maximum: 86400000,
                            },
                            quote: {
                              type: "string",
                              minLength: 1,
                              maxLength: 200,
                            },
                          },
                          required: ["seq", "startMs", "endMs", "quote"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["value", "evidence"],
                    additionalProperties: false,
                  },
                  {
                    type: "null",
                  },
                ],
              },
              trajectory: {
                anyOf: [
                  {
                    type: "object",
                    properties: {
                      value: {
                        type: "string",
                        enum: ["improving", "flat", "declining"],
                      },
                      evidence: {
                        minItems: 1,
                        maxItems: 20,
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            seq: {
                              type: "integer",
                              minimum: 0,
                              maximum: 9007199254740991,
                            },
                            startMs: {
                              type: "integer",
                              minimum: 0,
                              maximum: 86400000,
                            },
                            endMs: {
                              type: "integer",
                              minimum: 0,
                              maximum: 86400000,
                            },
                            quote: {
                              type: "string",
                              minLength: 1,
                              maxLength: 200,
                            },
                          },
                          required: ["seq", "startMs", "endMs", "quote"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["value", "evidence"],
                    additionalProperties: false,
                  },
                  {
                    type: "null",
                  },
                ],
              },
            },
            required: ["team", "external", "trajectory"],
            additionalProperties: false,
          },
          {
            type: "null",
          },
        ],
      },
      keyMoments: {
        maxItems: 50,
        type: "array",
        items: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["pricing", "objection", "next_step", "competitor", "buying_signal"],
            },
            text: {
              type: "string",
              minLength: 1,
              maxLength: 2000,
            },
            evidence: {
              minItems: 1,
              maxItems: 20,
              type: "array",
              items: {
                type: "object",
                properties: {
                  seq: {
                    type: "integer",
                    minimum: 0,
                    maximum: 9007199254740991,
                  },
                  startMs: {
                    type: "integer",
                    minimum: 0,
                    maximum: 86400000,
                  },
                  endMs: {
                    type: "integer",
                    minimum: 0,
                    maximum: 86400000,
                  },
                  quote: {
                    type: "string",
                    minLength: 1,
                    maxLength: 200,
                  },
                },
                required: ["seq", "startMs", "endMs", "quote"],
                additionalProperties: false,
              },
            },
          },
          required: ["type", "text", "evidence"],
          additionalProperties: false,
        },
      },
      questionsByProspect: {
        maxItems: 50,
        type: "array",
        items: {
          type: "object",
          properties: {
            text: {
              type: "string",
              minLength: 1,
              maxLength: 2000,
            },
            evidence: {
              minItems: 1,
              maxItems: 20,
              type: "array",
              items: {
                type: "object",
                properties: {
                  seq: {
                    type: "integer",
                    minimum: 0,
                    maximum: 9007199254740991,
                  },
                  startMs: {
                    type: "integer",
                    minimum: 0,
                    maximum: 86400000,
                  },
                  endMs: {
                    type: "integer",
                    minimum: 0,
                    maximum: 86400000,
                  },
                  quote: {
                    type: "string",
                    minLength: 1,
                    maxLength: 200,
                  },
                },
                required: ["seq", "startMs", "endMs", "quote"],
                additionalProperties: false,
              },
            },
          },
          required: ["text", "evidence"],
          additionalProperties: false,
        },
      },
    },
    required: [
      "schemaVersion",
      "summary",
      "proposedOutcome",
      "nextSteps",
      "objections",
      "pricingDiscussed",
      "buyingSignals",
      "decisionMaker",
      "competitors",
      "timeline",
      "topics",
      "chapters",
      "sentiment",
      "keyMoments",
      "questionsByProspect",
    ],
    additionalProperties: false,
  },
  CallOutcomeConfirmResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "call.outcome.confirm",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CallOutcomeConfirmOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CallOutcomeConfirmOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      meetingId: {
        $ref: "#/$defs/ResourceId",
      },
      outcome: {
        type: "string",
        enum: ["meeting_held", "no_show", "won", "lost", "follow_up", "rescheduled"],
      },
      fromAnalysisVersion: {
        type: "string",
        maxLength: 300,
      },
      dryRun: {
        type: "boolean",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
      },
      receiptId: {
        oneOf: [
          {
            type: "string",
            maxLength: 300,
          },
          {
            type: "null",
          },
        ],
      },
      outcomeId: {
        oneOf: [
          {
            type: "string",
            maxLength: 300,
          },
          {
            type: "null",
          },
        ],
      },
      lifecycle: {
        oneOf: [
          {
            type: "string",
            maxLength: 300,
          },
          {
            type: "null",
          },
        ],
      },
    },
    required: [
      "meetingId",
      "outcome",
      "fromAnalysisVersion",
      "dryRun",
      "updatedAt",
      "receiptId",
      "outcomeId",
      "lifecycle",
    ],
  },
  CallAttendanceGetResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "call.attendance.get",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CallAttendanceGetOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CallAttendanceGetOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      meetingId: {
        $ref: "#/$defs/ResourceId",
      },
      state: {
        type: "string",
        enum: ["available", "unavailable"],
      },
      complete: {
        oneOf: [
          {
            type: "boolean",
          },
          {
            type: "null",
          },
        ],
      },
      transcriptVersion: {
        oneOf: [
          {
            type: "integer",
            minimum: 0,
          },
          {
            type: "null",
          },
        ],
      },
      items: {
        type: "array",
        maxItems: 100,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: {
              type: "string",
              maxLength: 300,
            },
            participantId: {
              oneOf: [
                {
                  type: "string",
                  maxLength: 300,
                },
                {
                  type: "null",
                },
              ],
            },
            speakerId: {
              oneOf: [
                {
                  type: "string",
                  maxLength: 300,
                },
                {
                  type: "null",
                },
              ],
            },
            joinedAtMs: {
              type: "integer",
              minimum: 0,
            },
            leftAtMs: {
              oneOf: [
                {
                  type: "integer",
                  minimum: 0,
                },
                {
                  type: "null",
                },
              ],
            },
            isHost: {
              oneOf: [
                {
                  type: "boolean",
                },
                {
                  type: "null",
                },
              ],
            },
          },
          required: ["id", "participantId", "speakerId", "joinedAtMs", "leftAtMs", "isHost"],
        },
      },
      nextCursor: {
        oneOf: [
          {
            type: "string",
            maxLength: 1500,
          },
          {
            type: "null",
          },
        ],
      },
    },
    required: ["meetingId", "state", "complete", "transcriptVersion", "items", "nextCursor"],
  },
  CallInsightReviewResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "call.insight.review",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CallInsightReviewOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CallInsightReviewOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      meetingId: {
        $ref: "#/$defs/ResourceId",
      },
      insightId: {
        $ref: "#/$defs/ResourceId",
      },
      status: {
        type: "string",
        enum: ["preview", "updated", "duplicate"],
      },
      reviewState: {
        type: "string",
        enum: ["pending", "approved", "rejected"],
      },
      noteId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      updatedAt: {
        type: "string",
        format: "date-time",
      },
      dryRun: {
        type: "boolean",
      },
    },
    required: ["meetingId", "insightId", "status", "reviewState", "noteId", "updatedAt", "dryRun"],
  },
  RecorderEventOverrideGetResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "recorder.event.override.get",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/RecorderEventOverrideGetOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  RecorderEventOverrideGetOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      calendarId: {
        $ref: "#/$defs/ResourceId",
      },
      eventId: {
        $ref: "#/$defs/ResourceId",
      },
      icalUid: {
        type: "string",
        maxLength: 500,
      },
      instanceKey: {
        oneOf: [
          {
            type: "string",
            maxLength: 500,
          },
          {
            type: "null",
          },
        ],
      },
      record: {
        type: "string",
        enum: ["on", "off", "inherit"],
      },
      version: {
        type: "integer",
        minimum: 0,
      },
      dryRun: {
        type: "boolean",
      },
      receiptId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      dispatch: {
        type: "string",
        enum: ["unchanged", "preview", "pending_rules"],
      },
    },
    required: [
      "calendarId",
      "eventId",
      "icalUid",
      "instanceKey",
      "record",
      "version",
      "dryRun",
      "receiptId",
      "dispatch",
    ],
  },
  RecorderEventOverrideUpdateResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "recorder.event.override.update",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/RecorderEventOverrideUpdateOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  RecorderEventOverrideUpdateOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      calendarId: {
        $ref: "#/$defs/ResourceId",
      },
      eventId: {
        $ref: "#/$defs/ResourceId",
      },
      icalUid: {
        type: "string",
        maxLength: 500,
      },
      instanceKey: {
        oneOf: [
          {
            type: "string",
            maxLength: 500,
          },
          {
            type: "null",
          },
        ],
      },
      record: {
        type: "string",
        enum: ["on", "off", "inherit"],
      },
      version: {
        type: "integer",
        minimum: 0,
      },
      dryRun: {
        type: "boolean",
      },
      receiptId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      dispatch: {
        type: "string",
        enum: ["unchanged", "preview", "pending_rules"],
      },
    },
    required: [
      "calendarId",
      "eventId",
      "icalUid",
      "instanceKey",
      "record",
      "version",
      "dryRun",
      "receiptId",
      "dispatch",
    ],
  },
  CallBotCancelResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "call.bot.cancel",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CallBotCancelOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CallBotCancelOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      meetingId: {
        $ref: "#/$defs/ResourceId",
      },
      botId: {
        $ref: "#/$defs/ResourceId",
      },
      commandId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      receiptId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      action: {
        type: "string",
        enum: ["cancel", "stop", "remove"],
      },
      state: {
        type: "string",
        enum: ["preview", "queued", "completed", "denied"],
      },
      dryRun: {
        type: "boolean",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
      },
    },
    required: [
      "meetingId",
      "botId",
      "commandId",
      "receiptId",
      "action",
      "state",
      "dryRun",
      "updatedAt",
    ],
  },
  CallBotRemoveResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "call.bot.remove",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CallBotRemoveOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CallBotRemoveOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      meetingId: {
        $ref: "#/$defs/ResourceId",
      },
      botId: {
        $ref: "#/$defs/ResourceId",
      },
      commandId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      receiptId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      action: {
        type: "string",
        enum: ["cancel", "stop", "remove"],
      },
      state: {
        type: "string",
        enum: ["preview", "queued", "completed", "denied"],
      },
      dryRun: {
        type: "boolean",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
      },
    },
    required: [
      "meetingId",
      "botId",
      "commandId",
      "receiptId",
      "action",
      "state",
      "dryRun",
      "updatedAt",
    ],
  },
  CallRecordingStopResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "call.recording.stop",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CallRecordingStopOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CallRecordingStopOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      meetingId: {
        $ref: "#/$defs/ResourceId",
      },
      botId: {
        $ref: "#/$defs/ResourceId",
      },
      commandId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      receiptId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      action: {
        type: "string",
        enum: ["cancel", "stop", "remove"],
      },
      state: {
        type: "string",
        enum: ["preview", "queued", "completed", "denied"],
      },
      dryRun: {
        type: "boolean",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
      },
    },
    required: [
      "meetingId",
      "botId",
      "commandId",
      "receiptId",
      "action",
      "state",
      "dryRun",
      "updatedAt",
    ],
  },
  RecorderStatusResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "recorder.status",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/RecorderStatusOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  RecorderStatusOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      timezone: {
        type: "string",
        maxLength: 100,
      },
      asOf: {
        type: "string",
        format: "date-time",
      },
      calendarAutojoinEnabled: {
        type: "boolean",
        description:
          "Workspace rollout flag only. See autojoinActive for whether calendar meetings are admitted.",
      },
      autojoinActive: {
        type: "boolean",
        description:
          "True only when calendarAutojoinEnabled is on, consent is recorded and mode is not off.",
      },
      autojoinBlockedBy: {
        type: "array",
        maxItems: 3,
        items: {
          type: "string",
          enum: ["feature_disabled", "consent_required", "recording_off"],
        },
      },
      transcriptToolsEnabled: {
        type: "boolean",
      },
      consent: {
        type: "boolean",
      },
      mode: {
        type: "string",
        enum: ["all", "hosted_by_me", "external_attendees", "dmfaster_booked_only", "off"],
      },
      calendars: {
        type: "array",
        maxItems: 1000,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: {
              $ref: "#/$defs/ResourceId",
            },
            provider: {
              type: "string",
              maxLength: 100,
            },
            status: {
              type: "string",
              enum: ["connected", "connecting", "disconnected"],
            },
            lastSyncAt: {
              oneOf: [
                {
                  type: "string",
                  format: "date-time",
                },
                {
                  type: "null",
                },
              ],
            },
          },
          required: ["id", "provider", "status", "lastSyncAt"],
        },
      },
      botsStartingToday: {
        type: "integer",
        minimum: 0,
      },
      failuresLast7Days: {
        type: "integer",
        minimum: 0,
      },
      pendingControls: {
        type: "integer",
        minimum: 0,
      },
      upcoming: {
        type: "array",
        maxItems: 50,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            botId: {
              $ref: "#/$defs/ResourceId",
            },
            meetingId: {
              $ref: "#/$defs/ResourceId",
            },
            status: {
              type: "string",
              maxLength: 100,
            },
            scheduledStartAt: {
              type: "string",
              format: "date-time",
            },
            scheduledEndAt: {
              type: "string",
              format: "date-time",
            },
          },
          required: ["botId", "meetingId", "status", "scheduledStartAt", "scheduledEndAt"],
        },
      },
      moreUpcoming: {
        type: "boolean",
      },
      limits: {
        type: "object",
        additionalProperties: false,
        properties: {
          monthlyBotMinutes: {
            type: "integer",
            minimum: 0,
          },
          monthlyTranscriptionMinutes: {
            type: "integer",
            minimum: 0,
          },
        },
        required: ["monthlyBotMinutes", "monthlyTranscriptionMinutes"],
      },
    },
    required: [
      "timezone",
      "asOf",
      "calendarAutojoinEnabled",
      "transcriptToolsEnabled",
      "consent",
      "mode",
      "calendars",
      "botsStartingToday",
      "failuresLast7Days",
      "pendingControls",
      "upcoming",
      "moreUpcoming",
      "limits",
    ],
  },
  CallBotJoinResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "call.bot.join",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CallBotJoinOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CallBotJoinOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      requestId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      botId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      meetingId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      state: {
        type: "string",
        enum: ["preview", "queued", "submitting", "scheduled", "denied"],
      },
      safeErrorCode: {
        oneOf: [
          {
            type: "string",
            maxLength: 100,
          },
          {
            type: "null",
          },
        ],
      },
      receiptId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      dryRun: {
        type: "boolean",
      },
    },
    required: ["requestId", "botId", "meetingId", "state", "safeErrorCode", "receiptId", "dryRun"],
  },
  RecorderJoinGetResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "recorder.join.get",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/RecorderJoinGetOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  RecorderJoinGetOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      requestId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      botId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      meetingId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      state: {
        type: "string",
        enum: ["preview", "queued", "submitting", "scheduled", "denied", "none"],
      },
      safeErrorCode: {
        oneOf: [
          {
            type: "string",
            maxLength: 100,
          },
          {
            type: "null",
          },
        ],
      },
      receiptId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      dryRun: {
        type: "boolean",
      },
    },
    required: ["requestId", "botId", "meetingId", "state", "safeErrorCode", "receiptId", "dryRun"],
  },
  CallParticipantWithdrawalReportResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "call.participant.withdrawal.report",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CallParticipantWithdrawalReportOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CallParticipantWithdrawalReportOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      meetingId: {
        $ref: "#/$defs/ResourceId",
      },
      withdrawalId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      receiptId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      state: {
        type: "string",
        enum: ["preview", "queued"],
      },
      dryRun: {
        type: "boolean",
      },
    },
    required: ["meetingId", "withdrawalId", "receiptId", "state", "dryRun"],
  },
  CallDeleteResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            type: "string",
            const: "call.delete",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/CallDeleteOutput",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CallDeleteOutput: {
    type: "object",
    additionalProperties: false,
    properties: {
      meetingId: {
        $ref: "#/$defs/ResourceId",
      },
      scope: {
        type: "string",
        enum: ["media", "transcript", "analysis", "all"],
      },
      dryRun: {
        type: "boolean",
      },
      receiptId: {
        oneOf: [
          {
            $ref: "#/$defs/ResourceId",
          },
          {
            type: "null",
          },
        ],
      },
      requests: {
        type: "array",
        maxItems: 20,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: {
              oneOf: [
                {
                  $ref: "#/$defs/ResourceId",
                },
                {
                  type: "null",
                },
              ],
            },
            recordingId: {
              $ref: "#/$defs/ResourceId",
            },
            state: {
              type: "string",
              enum: [
                "preview",
                "queued",
                "leased",
                "requested",
                "deleting",
                "deleted",
                "failed",
                "legal_hold",
              ],
            },
          },
          required: ["id", "recordingId", "state"],
        },
      },
    },
    required: ["meetingId", "scope", "dryRun", "receiptId", "requests"],
  },
  CopyApprovalRequestResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            const: "copy.approval.request",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ProspectingOperationData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CampaignDraftPlanResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            const: "campaign.draft.plan",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ProspectingOperationData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CampaignDraftReadinessResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            const: "campaign.draft.readiness",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ProspectingOperationData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  ProspectingPreviewResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            const: "prospecting.preview",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ProspectingOperationData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CompaniesLookalikeResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            const: "companies.lookalike",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ProspectingOperationData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CommitmentsProposeResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            const: "commitments.propose",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ProspectingOperationData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CommitmentsListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            const: "commitments.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ProspectingOperationData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CommitmentUpdateResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            const: "commitment.update",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ProspectingOperationData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CommitmentConfirmBatchResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            const: "commitment.confirm.batch",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ProspectingOperationData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CommitmentReminderDraftResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            const: "commitment.reminder.draft",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ProspectingOperationData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  ListMergeResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            const: "list.merge",
          },
          data: {
            oneOf: [
              {
                type: "object",
                additionalProperties: false,
                required: ["status", "name", "leadCount"],
                properties: {
                  status: {
                    type: "string",
                    enum: ["preview", "created", "existing"],
                  },
                  name: {
                    type: "string",
                  },
                  leadCount: {
                    type: "integer",
                    minimum: 0,
                  },
                  listId: {
                    type: "string",
                  },
                  archiveSourceListIds: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Preview with archiveSources only. Source lists that would be archived after saving.",
                  },
                  archivedSourceCount: {
                    type: "integer",
                    minimum: 0,
                    description:
                      "Created with archiveSources only. Source lists archived by this call.",
                  },
                },
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  ListRenameResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            const: "list.rename",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ProspectingOperationData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  ListArchiveResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            const: "list.archive",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ProspectingOperationData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CampaignDraftArchiveResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            const: "campaign.draft.archive",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ProspectingOperationData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CopyApprovalInspectResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            const: "copy.approval.inspect",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ProspectingOperationData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  CopyApprovalCancelResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            const: "copy.approval.cancel",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ProspectingOperationData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  ApprovalCancelResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        properties: {
          tool: {
            const: "approval.cancel",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/ProspectingOperationData",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
    ],
  },
  ApprovalsListResult: {
    allOf: [
      {
        $ref: "#/$defs/AgentToolResultBase",
      },
      {
        type: "object",
        additionalProperties: false,
        properties: {
          tool: {
            type: "string",
            const: "approvals.list",
          },
          data: {
            oneOf: [
              {
                $ref: "#/$defs/SalesReplyOperation",
              },
              {
                type: "null",
              },
            ],
          },
        },
        required: ["tool"],
      },
    ],
  },
};
const roots: Record<AgentToolName, z.core.JSONSchema.JSONSchema> = {
  "analytics.summary": {
    $ref: "#/$defs/AnalyticsSummaryResult",
  },
  "workspace.briefing": {
    $ref: "#/$defs/WorkspaceBriefingResult",
  },
  "campaigns.list": {
    $ref: "#/$defs/CampaignsListResult",
  },
  "campaign.inspect": {
    $ref: "#/$defs/CampaignInspectResult",
  },
  "campaign.copy.inspect": {
    $ref: "#/$defs/CampaignCopyInspectResult",
  },
  "sending.inspect": {
    $ref: "#/$defs/SendingInspectResult",
  },
  "replies.list": {
    $ref: "#/$defs/RepliesListResult",
  },
  "conversations.list": {
    $ref: "#/$defs/ConversationsListResult",
  },
  "conversation.inspect": {
    $ref: "#/$defs/ConversationInspectResult",
  },
  "conversation.update": {
    $ref: "#/$defs/ConversationUpdateResult",
  },
  "conversation.reply": {
    $ref: "#/$defs/ConversationReplyResult",
  },
  "conversation.reply.inspect": {
    $ref: "#/$defs/ConversationReplyInspectResult",
  },
  "campaign.messages.draft.list": {
    $ref: "#/$defs/CampaignMessagesDraftListResult",
  },
  "campaign.messages.draft.update": {
    $ref: "#/$defs/CampaignMessagesDraftUpdateResult",
  },
  "campaign.messages.list": {
    $ref: "#/$defs/CampaignMessagesListResult",
  },
  "campaign.messages.update": {
    $ref: "#/$defs/CampaignMessagesUpdateResult",
  },
  "campaign.followups.list": {
    $ref: "#/$defs/CampaignFollowupsListResult",
  },
  "campaign.followups.cancel": {
    $ref: "#/$defs/CampaignFollowupsCancelResult",
  },
  "campaign.outcomes.list": {
    $ref: "#/$defs/CampaignOutcomesListResult",
  },
  "sending.test.prepare": {
    $ref: "#/$defs/DeliveryTestPrepareResult",
  },
  "sending.test.send": {
    $ref: "#/$defs/DeliveryTestSendResult",
  },
  "sending.test.inspect": {
    $ref: "#/$defs/DeliveryTestInspectResult",
  },
  "senders.inspect": {
    $ref: "#/$defs/SendersInspectResult",
  },
  "history.list": {
    $ref: "#/$defs/HistoryListResult",
  },
  "pipeline.inspect": {
    $ref: "#/$defs/PipelineInspectResult",
  },
  "pipeline.cards.list": {
    $ref: "#/$defs/PipelineCardsListResult",
  },
  "pipeline.stage.update": {
    $ref: "#/$defs/PipelineStageUpdateResult",
  },
  "pipeline.note.list": {
    $ref: "#/$defs/PipelineNoteListResult",
  },
  "pipeline.note.add": {
    $ref: "#/$defs/PipelineNoteAddResult",
  },
  "company.timeline": {
    $ref: "#/$defs/CompanyTimelineResult",
  },
  "industry.lookup": {
    $ref: "#/$defs/IndustryLookupResult",
  },
  "campaign.validate": {
    $ref: "#/$defs/CampaignValidateResult",
  },
  "audience.preview": {
    $ref: "#/$defs/AudiencePreviewResult",
  },
  "lists.list": {
    $ref: "#/$defs/ListsListResult",
  },
  "list.inspect": {
    $ref: "#/$defs/ListInspectResult",
  },
  "list.target.remove": {
    $ref: "#/$defs/ListTargetRemoveResult",
  },
  "campaign.draft.prepare": {
    $ref: "#/$defs/CampaignDraftPrepareResult",
  },
  "campaign.draft.update": {
    $ref: "#/$defs/CampaignDraftUpdateResult",
  },
  "list.import": {
    $ref: "#/$defs/ListImportResult",
  },
  "leads.add": {
    $ref: "#/$defs/LeadsAddResult",
  },
  "list.prepare": {
    $ref: "#/$defs/ListPrepareResult",
  },
  "campaign.prepare": {
    $ref: "#/$defs/CampaignPrepareResult",
  },
  "campaign.launch.preflight": {
    $ref: "#/$defs/CampaignLaunchPreflightResult",
  },
  "campaign.launch": {
    $ref: "#/$defs/CampaignLaunchResult",
  },
  "campaign.pause.preflight": {
    $ref: "#/$defs/CampaignPausePreflightResult",
  },
  "campaign.pause": {
    $ref: "#/$defs/CampaignPauseResult",
  },
  "companies.filters": {
    $ref: "#/$defs/CompanyFiltersResult",
  },
  "companies.suggest": {
    $ref: "#/$defs/CompanySuggestionsResult",
  },
  "prospect.query": {
    $ref: "#/$defs/ProspectQueryResult",
  },
  "companies.search": {
    $ref: "#/$defs/CompanySearchResult",
  },
  "companies.evidence.search": {
    $ref: "#/$defs/CompanyEvidenceSearchResult",
  },
  "companies.knowledge.search": {
    $ref: "#/$defs/WorkspaceCompanyKnowledgeResult",
  },
  "companies.knowledge": {
    $ref: "#/$defs/CompanyKnowledgeResult",
  },
  "companies.evidence.start": {
    $ref: "#/$defs/CompanyEvidenceStartResult",
  },
  "companies.evidence.advance": {
    $ref: "#/$defs/CompanyEvidenceAdvanceResult",
  },
  "companies.evidence.status": {
    $ref: "#/$defs/CompanyEvidenceStatusResult",
  },
  "companies.evidence.results": {
    $ref: "#/$defs/CompanyEvidenceResultsResult",
  },
  "companies.evidence.cancel": {
    $ref: "#/$defs/CompanyEvidenceCancelResult",
  },
  "company.inspect": {
    $ref: "#/$defs/CompanyInspectResult",
  },
  "companies.fit.start": {
    $ref: "#/$defs/CompanyFitStartResult",
  },
  "companies.fit.advance": {
    $ref: "#/$defs/CompanyFitAdvanceResult",
  },
  "companies.fit.results": {
    $ref: "#/$defs/CompanyFitResultsResult",
  },
  "companies.fit.proposal": {
    $ref: "#/$defs/CompanyFitProposalResult",
  },
  "companies.list.prepare": {
    $ref: "#/$defs/CompanyListPrepareResult",
  },
  "companies.list.inspect": {
    $ref: "#/$defs/CompanyListInspectResult",
  },
  "companies.list.refine": {
    $ref: "#/$defs/CompanyListRefineResult",
  },
  "campaign.operation.inspect": {
    $ref: "#/$defs/CampaignOperationInspectResult",
  },
  "campaign.delivery.inspect": {
    $ref: "#/$defs/CampaignDeliveryInspectResult",
  },
  "campaign.delivery.update": {
    $ref: "#/$defs/CampaignDeliveryUpdateResult",
  },
  "sending.instagram.pacing.inspect": {
    $ref: "#/$defs/InstagramPacingInspectResult",
  },
  "sending.instagram.pacing.update": {
    $ref: "#/$defs/InstagramPacingUpdateResult",
  },
  "companies.fit.status": {
    $ref: "#/$defs/CompanyFitStatusResult",
  },
  "companies.fit.cancel": {
    $ref: "#/$defs/CompanyFitCancelResult",
  },
  "companies.fit.runs.list": {
    $ref: "#/$defs/CompanyFitRunsListResult",
  },
  "companies.fit.run": {
    $ref: "#/$defs/CompanyFitRunResult",
  },
  "companies.fit.cohort": {
    $ref: "#/$defs/CompanyFitCohortResult",
  },
  "campaign.variation.performance": {
    $ref: "#/$defs/CopyPerformanceResult",
  },
  "copy.performance": {
    $ref: "#/$defs/CopyPerformanceResult",
  },
  "calendar.status": {
    $ref: "#/$defs/CalendarStatusResult",
  },
  "calendar.availability": {
    $ref: "#/$defs/CalendarAvailabilityResult",
  },
  "calendar.meeting.book": {
    $ref: "#/$defs/CalendarMeetingBookResult",
  },
  "calls.list": {
    $ref: "#/$defs/CallsListResult",
  },
  "call.inspect": {
    $ref: "#/$defs/CallInspectResult",
  },
  "instagram.extract.quote": {
    $ref: "#/$defs/InstagramExtractionQuoteResult",
  },
  "instagram.extract.start": {
    $ref: "#/$defs/InstagramExtractionStartResult",
  },
  "instagram.extract.inspect": {
    $ref: "#/$defs/InstagramExtractionInspectResult",
  },
  "instagram.extract.results": {
    $ref: "#/$defs/InstagramExtractionResultsResult",
  },
  "instagram.purchases.list": {
    $ref: "#/$defs/InstagramPurchasesListResult",
  },
  "instagram.purchases.inspect": {
    $ref: "#/$defs/InstagramPurchasesInspectResult",
  },
  "instagram.purchases.results": {
    $ref: "#/$defs/InstagramPurchasesResultsResult",
  },
  "leads.status": {
    $ref: "#/$defs/LeadsStatusResult",
  },
  "leads.extract.quote": {
    $ref: "#/$defs/LeadExtractionQuoteResult",
  },
  "leads.extract.start": {
    $ref: "#/$defs/LeadExtractionStartResult",
  },
  "leads.extract.inspect": {
    $ref: "#/$defs/LeadExtractionInspectResult",
  },
  "leads.extract.refresh": {
    $ref: "#/$defs/LeadExtractionRefreshResult",
  },
  "leads.extract.continue": {
    $ref: "#/$defs/LeadExtractionContinueResult",
  },
  "leads.enrich.preview": {
    $ref: "#/$defs/LeadEnrichmentPreviewResult",
  },
  "leads.enrich.start": {
    $ref: "#/$defs/LeadEnrichmentStartResult",
  },
  "leads.enrich.inspect": {
    $ref: "#/$defs/LeadEnrichmentInspectResult",
  },
  "leads.prospect.quote": {
    $ref: "#/$defs/InstagramProspectQuoteResult",
  },
  "leads.prospect.start": {
    $ref: "#/$defs/InstagramProspectStartResult",
  },
  "leads.prospect.inspect": {
    $ref: "#/$defs/InstagramProspectInspectResult",
  },
  "leads.prospect.results": {
    $ref: "#/$defs/InstagramProspectResultsResult",
  },
  "leads.prospect.advance": {
    $ref: "#/$defs/InstagramProspectAdvanceResult",
  },
  "leads.prospect.cancel": {
    $ref: "#/$defs/InstagramProspectCancelResult",
  },
  "events.list": {
    $ref: "#/$defs/EventsListResult",
  },
  "conversations.changes": {
    $ref: "#/$defs/ConversationsChangesResult",
  },
  "suppressions.list": {
    $ref: "#/$defs/SuppressionsListResult",
  },
  "suppressions.add": {
    $ref: "#/$defs/SuppressionsAddResult",
  },
  "suppressions.remove": {
    $ref: "#/$defs/SuppressionsRemoveResult",
  },
  "workspace.sandbox.create": {
    $ref: "#/$defs/WorkspaceSandboxCreateResult",
  },
  "sandbox.seed": {
    $ref: "#/$defs/SandboxSeedResult",
  },
  "sandbox.inbound.simulate": {
    $ref: "#/$defs/SandboxInboundSimulateResult",
  },
  "sandbox.clock.advance": {
    $ref: "#/$defs/SandboxClockAdvanceResult",
  },
  "call.outcome.set": {
    $ref: "#/$defs/CallOutcomeSetResult",
  },
  "meeting.link": {
    $ref: "#/$defs/MeetingLinkResult",
  },
  "meeting.unlink": {
    $ref: "#/$defs/MeetingUnlinkResult",
  },
  "webhooks.create": {
    $ref: "#/$defs/WebhooksCreateResult",
  },
  "webhooks.list": {
    $ref: "#/$defs/WebhooksListResult",
  },
  "webhooks.update": {
    $ref: "#/$defs/WebhooksUpdateResult",
  },
  "webhooks.delete": {
    $ref: "#/$defs/WebhooksDeleteResult",
  },
  "webhooks.test": {
    $ref: "#/$defs/WebhooksTestResult",
  },
  "webhooks.replay": {
    $ref: "#/$defs/WebhooksReplayResult",
  },
  "meetings.unlinked.list": {
    $ref: "#/$defs/MeetingsUnlinkedListResult",
  },
  "pipeline.reconcile": {
    $ref: "#/$defs/PipelineReconcileResult",
  },
  "workspace.agent_sales.get": {
    $ref: "#/$defs/WorkspaceAgentSalesGetResult",
  },
  "workspace.agent_sales.update": {
    $ref: "#/$defs/WorkspaceAgentSalesUpdateResult",
  },
  "sandbox.provider.update": {
    $ref: "#/$defs/SandboxProviderUpdateResult",
  },
  "reply.templates.list": {
    $ref: "#/$defs/ReplyTemplatesListResult",
  },
  "reply.templates.create": {
    $ref: "#/$defs/ReplyTemplatesCreateResult",
  },
  "reply.templates.update": {
    $ref: "#/$defs/ReplyTemplatesUpdateResult",
  },
  "reply.templates.delete": {
    $ref: "#/$defs/ReplyTemplatesDeleteResult",
  },
  "reply.policy.get": {
    $ref: "#/$defs/ReplyPolicyGetResult",
  },
  "reply.policy.update": {
    $ref: "#/$defs/ReplyPolicyUpdateResult",
  },
  "reply.approvals.list": {
    $ref: "#/$defs/ReplyApprovalsListResult",
  },
  "conversation.draft.save": {
    $ref: "#/$defs/ConversationDraftSaveResult",
  },
  "conversation.followup.set": {
    $ref: "#/$defs/ConversationFollowupSetResult",
  },
  "conversation.followup.clear": {
    $ref: "#/$defs/ConversationFollowupClearResult",
  },
  "followups.due": {
    $ref: "#/$defs/FollowupsDueResult",
  },
  "conversations.bulk.update": {
    $ref: "#/$defs/ConversationsBulkUpdateResult",
  },
  "pipeline.board": {
    $ref: "#/$defs/PipelineBoardResult",
  },
  "calendar.booking.link.create": {
    $ref: "#/$defs/CalendarBookingLinkCreateResult",
  },
  "calendar.meeting.reschedule": {
    $ref: "#/$defs/CalendarMeetingRescheduleResult",
  },
  "calendar.meeting.cancel": {
    $ref: "#/$defs/CalendarMeetingCancelResult",
  },
  "campaign.followups.configure": {
    $ref: "#/$defs/CampaignFollowupsConfigureResult",
  },
  "campaign.variants.configure": {
    $ref: "#/$defs/CampaignVariantsConfigureResult",
  },
  "recorder.settings.get": {
    $ref: "#/$defs/RecorderSettingsGetResult",
  },
  "recorder.settings.update": {
    $ref: "#/$defs/RecorderSettingsUpdateResult",
  },
  "recorder.bots.list": {
    $ref: "#/$defs/RecorderBotsListResult",
  },
  "call.transcript.get": {
    $ref: "#/$defs/CallTranscriptGetResult",
  },
  "call.recording.get": {
    $ref: "#/$defs/CallRecordingGetResult",
  },
  "call.transcripts.get": {
    $ref: "#/$defs/CallTranscriptsGetResult",
  },
  "call.transcripts.search": {
    $ref: "#/$defs/CallTranscriptsSearchResult",
  },
  "readiness.check": {
    $ref: "#/$defs/ReadinessCheckResult",
  },
  "sender.retire": {
    $ref: "#/$defs/SenderRetireResult",
  },
  "sender.unretire": {
    $ref: "#/$defs/SenderUnretireResult",
  },
  "attribution.check": {
    $ref: "#/$defs/AttributionCheckResult",
  },
  "campaign.reengagement.prepare": {
    $ref: "#/$defs/CampaignReengagementPrepareResult",
  },
  "agents.list": {
    $ref: "#/$defs/AgentsListResult",
  },
  "agent.inspect": {
    $ref: "#/$defs/AgentInspectResult",
  },
  "agent.create.request": {
    $ref: "#/$defs/AgentCreateRequestResult",
  },
  "agent.pause": {
    $ref: "#/$defs/AgentPauseResult",
  },
  "agent.resume": {
    $ref: "#/$defs/AgentResumeResult",
  },
  "agent.credential.rotate": {
    $ref: "#/$defs/AgentCredentialRotateResult",
  },
  "event_consumers.list": {
    $ref: "#/$defs/EventConsumersListResult",
  },
  "event_consumers.create": {
    $ref: "#/$defs/EventConsumersCreateResult",
  },
  "events.ack": {
    $ref: "#/$defs/EventsAckResult",
  },
  "events.snapshot": {
    $ref: "#/$defs/EventsSnapshotResult",
  },
  "webhook.deliveries.list": {
    $ref: "#/$defs/WebhookDeliveriesListResult",
  },
  "webhooks.dlq.replay": {
    $ref: "#/$defs/WebhooksDlqReplayResult",
  },
  "classification.feedback": {
    $ref: "#/$defs/ClassificationFeedbackResult",
  },
  "classification.quality": {
    $ref: "#/$defs/ClassificationQualityResult",
  },
  "classification.backfill.plan": {
    $ref: "#/$defs/ClassificationBackfillPlanResult",
  },
  "work_queue.list": {
    $ref: "#/$defs/WorkQueueListResult",
  },
  "work_item.claim": {
    $ref: "#/$defs/WorkItemClaimResult",
  },
  "work_item.release": {
    $ref: "#/$defs/WorkItemReleaseResult",
  },
  "work_item.snooze": {
    $ref: "#/$defs/WorkItemSnoozeResult",
  },
  "work_item.complete": {
    $ref: "#/$defs/WorkItemCompleteResult",
  },
  "work_queue.config.get": {
    $ref: "#/$defs/WorkQueueConfigGetResult",
  },
  "work_queue.config.update": {
    $ref: "#/$defs/WorkQueueConfigUpdateResult",
  },
  "metrics.reconcile": {
    $ref: "#/$defs/MetricsReconcileResult",
  },
  "agent.heartbeat": {
    $ref: "#/$defs/AgentHeartbeatResult",
  },
  "agent.run.start": {
    $ref: "#/$defs/AgentRunStartResult",
  },
  "agent.run.end": {
    $ref: "#/$defs/AgentRunEndResult",
  },
  "agent.runs.list": {
    $ref: "#/$defs/AgentRunsListResult",
  },
  "agent.run.inspect": {
    $ref: "#/$defs/AgentRunInspectResult",
  },
  "workspace.halt": {
    $ref: "#/$defs/WorkspaceHaltResult",
  },
  "workspace.resume": {
    $ref: "#/$defs/WorkspaceResumeResult",
  },
  "channel.halt": {
    $ref: "#/$defs/ChannelHaltResult",
  },
  "workspace.automation.inspect": {
    $ref: "#/$defs/WorkspaceAutomationInspectResult",
  },
  "feedback.submit": {
    $ref: "#/$defs/AgentFeedbackSubmitResult",
  },
  "feedback.list": {
    $ref: "#/$defs/AgentFeedbackListResult",
  },
  "entity.resolve": {
    $ref: "#/$defs/EntityResolveResult",
  },
  "entities.get": {
    $ref: "#/$defs/EntitiesGetResult",
  },
  "people.upsert": {
    $ref: "#/$defs/PeopleUpsertResult",
  },
  "companies.upsert": {
    $ref: "#/$defs/CompaniesUpsertResult",
  },
  "entity.merge": {
    $ref: "#/$defs/EntityMergeResult",
  },
  "entity.split": {
    $ref: "#/$defs/EntitySplitResult",
  },
  "budget.status": {
    $ref: "#/$defs/BudgetStatusResult",
  },
  "call.stats.get": {
    $ref: "#/$defs/CallStatsGetResult",
  },
  "call.coaching.get": {
    $ref: "#/$defs/CallCoachingGetResult",
  },
  "call.analytics.query": {
    $ref: "#/$defs/CallAnalyticsQueryResult",
  },
  "call.insight.get": {
    $ref: "#/$defs/CallInsightGetResult",
  },
  "call.access.list": {
    $ref: "#/$defs/CallAccessListResult",
  },
  "call.audit.list": {
    $ref: "#/$defs/CallAuditListResult",
  },
  "call.activity.get": {
    $ref: "#/$defs/CallActivityGetResult",
  },
  "call.analysis.get": {
    $ref: "#/$defs/CallAnalysisGetResult",
  },
  "call.outcome.confirm": {
    $ref: "#/$defs/CallOutcomeConfirmResult",
  },
  "call.attendance.get": {
    $ref: "#/$defs/CallAttendanceGetResult",
  },
  "call.insight.review": {
    $ref: "#/$defs/CallInsightReviewResult",
  },
  "recorder.event.override.get": {
    $ref: "#/$defs/RecorderEventOverrideGetResult",
  },
  "recorder.event.override.update": {
    $ref: "#/$defs/RecorderEventOverrideUpdateResult",
  },
  "call.bot.cancel": {
    $ref: "#/$defs/CallBotCancelResult",
  },
  "call.bot.remove": {
    $ref: "#/$defs/CallBotRemoveResult",
  },
  "call.recording.stop": {
    $ref: "#/$defs/CallRecordingStopResult",
  },
  "recorder.status": {
    $ref: "#/$defs/RecorderStatusResult",
  },
  "call.bot.join": {
    $ref: "#/$defs/CallBotJoinResult",
  },
  "recorder.join.get": {
    $ref: "#/$defs/RecorderJoinGetResult",
  },
  "call.participant.withdrawal.report": {
    $ref: "#/$defs/CallParticipantWithdrawalReportResult",
  },
  "call.delete": {
    $ref: "#/$defs/CallDeleteResult",
  },
  "copy.approval.request": {
    $ref: "#/$defs/CopyApprovalRequestResult",
  },
  "campaign.draft.plan": {
    $ref: "#/$defs/CampaignDraftPlanResult",
  },
  "campaign.draft.readiness": {
    $ref: "#/$defs/CampaignDraftReadinessResult",
  },
  "prospecting.preview": {
    $ref: "#/$defs/ProspectingPreviewResult",
  },
  "companies.lookalike": {
    $ref: "#/$defs/CompaniesLookalikeResult",
  },
  "commitments.propose": {
    $ref: "#/$defs/CommitmentsProposeResult",
  },
  "commitments.list": {
    $ref: "#/$defs/CommitmentsListResult",
  },
  "commitment.update": {
    $ref: "#/$defs/CommitmentUpdateResult",
  },
  "commitment.confirm.batch": {
    $ref: "#/$defs/CommitmentConfirmBatchResult",
  },
  "commitment.reminder.draft": {
    $ref: "#/$defs/CommitmentReminderDraftResult",
  },
  "list.merge": {
    $ref: "#/$defs/ListMergeResult",
  },
  "list.rename": {
    $ref: "#/$defs/ListRenameResult",
  },
  "list.archive": {
    $ref: "#/$defs/ListArchiveResult",
  },
  "campaign.draft.archive": {
    $ref: "#/$defs/CampaignDraftArchiveResult",
  },
  "copy.approval.inspect": {
    $ref: "#/$defs/CopyApprovalInspectResult",
  },
  "copy.approval.cancel": {
    $ref: "#/$defs/CopyApprovalCancelResult",
  },
  "approval.cancel": {
    $ref: "#/$defs/ApprovalCancelResult",
  },
  "approvals.list": {
    $ref: "#/$defs/ApprovalsListResult",
  },
};
export const AGENT_OUTPUT_SCHEMAS = Object.fromEntries(
  Object.entries(roots).map(([name, root]) => [name, lazyOutputSchema(root, definitions)]),
) as unknown as Record<AgentToolName, z.ZodType>;
