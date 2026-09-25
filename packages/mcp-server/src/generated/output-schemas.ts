// Generated from packages/public-api/openapi.yaml. Run npm run generate:agent-api.
import { z } from "zod";
export const AGENT_OUTPUT_SCHEMAS = {
  "analytics.summary": z.fromJSONSchema({
    $ref: "#/$defs/AnalyticsSummaryResult",
    $defs: {
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
                    type: "null",
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
      },
    },
  }),
  "workspace.briefing": z.fromJSONSchema({
    $ref: "#/$defs/WorkspaceBriefingResult",
    $defs: {
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
            uniqueItems: true,
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
    },
  }),
  "campaigns.list": z.fromJSONSchema({
    $ref: "#/$defs/CampaignsListResult",
    $defs: {
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
            uniqueItems: true,
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
    },
  }),
  "campaign.inspect": z.fromJSONSchema({
    $ref: "#/$defs/CampaignInspectResult",
    $defs: {
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
            uniqueItems: true,
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
        },
      },
    },
  }),
  "sending.inspect": z.fromJSONSchema({
    $ref: "#/$defs/SendingInspectResult",
    $defs: {
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
        },
      },
      CampaignStatus: {
        type: "string",
        enum: ["Draft", "Queued", "Running", "Paused", "Cooldown", "Completed"],
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
    },
  }),
  "replies.list": z.fromJSONSchema({
    $ref: "#/$defs/RepliesListResult",
    $defs: {
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
            uniqueItems: true,
            items: {
              $ref: "#/$defs/TargetChannel",
            },
          },
          lastContactedAt: {
            type: "string",
          },
        },
      },
      PipelineStage: {
        type: "string",
        enum: ["contacted", "replied", "call_booked", "closed"],
      },
      TargetChannel: {
        type: "string",
        enum: ["instagram", "facebook", "linkedin", "gmail", "sms"],
      },
    },
  }),
  "conversations.list": z.fromJSONSchema({
    $ref: "#/$defs/ConversationsListResult",
    $defs: {
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
              $ref: "#/$defs/InboxConversationSummary",
            },
          },
          scopeStats: {
            $ref: "#/$defs/InboxScopeStats",
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
          unreadCount: {
            type: "integer",
            minimum: 0,
          },
          needsReply: {
            type: "boolean",
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
              "not_now",
              "wrong_person",
              "not_interested",
              "opt_out",
              "acknowledgement",
              "unclear",
            ],
          },
        },
      },
      InboxChannel: {
        type: "string",
        enum: ["instagram", "facebook", "linkedin", "gmail", "outlook", "email", "sms"],
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
    },
  }),
  "conversation.inspect": z.fromJSONSchema({
    $ref: "#/$defs/ConversationInspectResult",
    $defs: {
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
          unreadCount: {
            type: "integer",
            minimum: 0,
          },
          needsReply: {
            type: "boolean",
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
              "not_now",
              "wrong_person",
              "not_interested",
              "opt_out",
              "acknowledgement",
              "unclear",
            ],
          },
        },
      },
      InboxChannel: {
        type: "string",
        enum: ["instagram", "facebook", "linkedin", "gmail", "outlook", "email", "sms"],
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
            enum: ["text", "reply_signal", "attachment", "system"],
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
    },
  }),
  "pipeline.inspect": z.fromJSONSchema({
    $ref: "#/$defs/PipelineInspectResult",
    $defs: {
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
            uniqueItems: true,
            items: {
              $ref: "#/$defs/TargetChannel",
            },
          },
          lastContactedAt: {
            type: "string",
          },
        },
      },
      PipelineStage: {
        type: "string",
        enum: ["contacted", "replied", "call_booked", "closed"],
      },
      TargetChannel: {
        type: "string",
        enum: ["instagram", "facebook", "linkedin", "gmail", "sms"],
      },
    },
  }),
  "company.timeline": z.fromJSONSchema({
    $ref: "#/$defs/CompanyTimelineResult",
    $defs: {
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
      TargetChannel: {
        type: "string",
        enum: ["instagram", "facebook", "linkedin", "gmail", "sms"],
      },
    },
  }),
  "industry.lookup": z.fromJSONSchema({
    $ref: "#/$defs/IndustryLookupResult",
    $defs: {
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
    },
  }),
  "campaign.validate": z.fromJSONSchema({
    $ref: "#/$defs/CampaignValidateResult",
    $defs: {
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
                oneOf: [
                  {
                    $ref: "#/$defs/AgentHarnessResult",
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
    },
  }),
  "audience.preview": z.fromJSONSchema({
    $ref: "#/$defs/AudiencePreviewResult",
    $defs: {
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
                oneOf: [
                  {
                    $ref: "#/$defs/AudiencePreviewHarnessResult",
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
    },
  }),
  "lists.list": z.fromJSONSchema({
    $ref: "#/$defs/ListsListResult",
    $defs: {
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
    },
  }),
  "list.inspect": z.fromJSONSchema({
    $ref: "#/$defs/ListInspectResult",
    $defs: {
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
                    type: "null",
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
    },
  }),
  "list.target.remove": z.fromJSONSchema({
    $ref: "#/$defs/ListTargetRemoveResult",
    $defs: {
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
                    $ref: "#/$defs/ListTargetRemoveData",
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
    },
  }),
  "campaign.draft.prepare": z.fromJSONSchema({
    $ref: "#/$defs/CampaignDraftPrepareResult",
    $defs: {
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
                    $ref: "#/$defs/CampaignDraftPrepareData",
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
            const: "instagram",
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
            maximum: 60,
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
        },
      },
    },
  }),
  "campaign.draft.update": z.fromJSONSchema({
    $ref: "#/$defs/CampaignDraftUpdateResult",
    $defs: {
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
                    $ref: "#/$defs/CampaignDraftUpdateData",
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
            const: "instagram",
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
            maximum: 60,
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
          timezone: {
            type: "string",
          },
        },
      },
    },
  }),
  "list.import": z.fromJSONSchema({
    $ref: "#/$defs/ListImportResult",
    $defs: {
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
                    $ref: "#/$defs/ListImportData",
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
    },
  }),
  "list.prepare": z.fromJSONSchema({
    $ref: "#/$defs/ListPrepareResult",
    $defs: {
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
                    $ref: "#/$defs/AgentHarnessResult",
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
    },
  }),
  "campaign.prepare": z.fromJSONSchema({
    $ref: "#/$defs/CampaignPrepareResult",
    $defs: {
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
                    $ref: "#/$defs/AgentHarnessResult",
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
    },
  }),
  "campaign.launch.preflight": z.fromJSONSchema({
    $ref: "#/$defs/CampaignLaunchPreflightResult",
    $defs: {
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
                    $ref: "#/$defs/CampaignActionPreflightOutput",
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
            uniqueItems: true,
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
      CampaignStatus: {
        type: "string",
        enum: ["Draft", "Queued", "Running", "Paused", "Cooldown", "Completed"],
      },
      TargetChannel: {
        type: "string",
        enum: ["instagram", "facebook", "linkedin", "gmail", "sms"],
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
            format: "uri",
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
            format: "uri",
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
            uniqueItems: true,
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
          campaignId: {
            $ref: "#/$defs/ResourceId",
          },
          idempotencyKey: {
            $ref: "#/$defs/IdempotencyKey",
          },
        },
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
      IdempotencyKey: {
        "x-dmfaster-trim": true,
        type: "string",
        minLength: 1,
        maxLength: 160,
        pattern: "^[A-Za-z0-9._:-]{1,160}$",
      },
    },
  }),
  "campaign.launch": z.fromJSONSchema({
    $ref: "#/$defs/CampaignLaunchResult",
    $defs: {
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
                    $ref: "#/$defs/CampaignActionOutput",
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
            uniqueItems: true,
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
      CampaignStatus: {
        type: "string",
        enum: ["Draft", "Queued", "Running", "Paused", "Cooldown", "Completed"],
      },
      TargetChannel: {
        type: "string",
        enum: ["instagram", "facebook", "linkedin", "gmail", "sms"],
      },
      IdempotencyKey: {
        "x-dmfaster-trim": true,
        type: "string",
        minLength: 1,
        maxLength: 160,
        pattern: "^[A-Za-z0-9._:-]{1,160}$",
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
        },
      },
    },
  }),
  "campaign.pause.preflight": z.fromJSONSchema({
    $ref: "#/$defs/CampaignPausePreflightResult",
    $defs: {
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
            format: "uri",
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
            uniqueItems: true,
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
      CampaignStatus: {
        type: "string",
        enum: ["Draft", "Queued", "Running", "Paused", "Cooldown", "Completed"],
      },
      TargetChannel: {
        type: "string",
        enum: ["instagram", "facebook", "linkedin", "gmail", "sms"],
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
    },
  }),
  "campaign.pause": z.fromJSONSchema({
    $ref: "#/$defs/CampaignPauseResult",
    $defs: {
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
                    $ref: "#/$defs/CampaignActionOutput",
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
            uniqueItems: true,
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
      CampaignStatus: {
        type: "string",
        enum: ["Draft", "Queued", "Running", "Paused", "Cooldown", "Completed"],
      },
      TargetChannel: {
        type: "string",
        enum: ["instagram", "facebook", "linkedin", "gmail", "sms"],
      },
      IdempotencyKey: {
        "x-dmfaster-trim": true,
        type: "string",
        minLength: 1,
        maxLength: 160,
        pattern: "^[A-Za-z0-9._:-]{1,160}$",
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
        },
      },
    },
  }),
  "companies.filters": z.fromJSONSchema({
    $ref: "#/$defs/CompanyFiltersResult",
    $defs: {
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
      },
      CompanyFiltersData: {
        type: "object",
        additionalProperties: true,
        required: [
          "metadata",
          "filterFields",
          "defaults",
          "technologies",
          "fundingSources",
          "availability",
          "restrictions",
        ],
        properties: {
          metadata: {
            type: "object",
            additionalProperties: true,
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
            items: {
              type: "string",
              maxLength: 80,
            },
            maxItems: 40,
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
        },
        required: ["countries"],
        description:
          "Every filter supported by the Companies app. Numeric bounds use decimal strings, dates YYYY-MM-DD; empty values disable filters. Call companies.filters for country-specific options. Unsupported or discarded criteria are rejected.",
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
    },
  }),
  "companies.search": z.fromJSONSchema({
    $ref: "#/$defs/CompanySearchResult",
    $defs: {
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
          "Search the same company inventory and filters as the live app. Returns full rows, exact total and pagination. Echo querySignature and expectedRevision on subsequent pages.",
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
            items: {
              type: "string",
              maxLength: 80,
            },
            maxItems: 40,
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
        },
        required: ["countries"],
        description:
          "Every filter supported by the Companies app. Numeric bounds use decimal strings, dates YYYY-MM-DD; empty values disable filters. Call companies.filters for country-specific options. Unsupported or discarded criteria are rejected.",
      },
    },
  }),
  "company.inspect": z.fromJSONSchema({
    $ref: "#/$defs/CompanyInspectResult",
    $defs: {
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
      },
      CompanyInspectData: {
        type: "object",
        additionalProperties: true,
        required: ["profile", "revision"],
        properties: {
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
                },
              },
              technologies: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              socialProfiles: {
                type: "array",
                description:
                  "Company-owned social account URLs verified from the company's website.",
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
                      format: "uri",
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
          "Read the complete company profile shown in the app, including financials, technologies, advertising, funding, hiring and decision-makers wherever available. Missing data is unknown.",
      },
    },
  }),
  "companies.list.prepare": z.fromJSONSchema({
    $ref: "#/$defs/CompanyListPrepareResult",
    $defs: {
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
                    $ref: "#/$defs/CompanyListPrepareData",
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
      },
      CompanyListPrepareData: {
        type: "object",
        additionalProperties: true,
        required: ["listId", "name", "total", "created", "replayed", "companies"],
        properties: {
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
          "Save explicitly inspected companies as a private company list. Echo each company.inspect revision. No campaign is created or started. Retry using the same key.",
      },
    },
  }),
  "companies.list.inspect": z.fromJSONSchema({
    $ref: "#/$defs/CompanyListInspectResult",
    $defs: {
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
      },
      CompanyListInspectData: {
        type: "object",
        additionalProperties: true,
        required: ["listId", "name", "total", "companies", "nextOffset"],
        properties: {
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
          "Read paginated company identities and available contact routes from a saved company list. Echo expectedUpdatedAt on subsequent pages. Use company.inspect for the current full research profile.",
      },
    },
  }),
  "companies.list.refine": z.fromJSONSchema({
    $ref: "#/$defs/CompanyListRefineResult",
    $defs: {
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
                    $ref: "#/$defs/CompanyListRefineData",
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
            minimum: 1,
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
    },
  }),
  "campaign.operation.inspect": z.fromJSONSchema({
    $ref: "#/$defs/CampaignOperationInspectResult",
    $defs: {
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
    },
  }),
  "campaign.delivery.inspect": z.fromJSONSchema({
    $ref: "#/$defs/CampaignDeliveryInspectResult",
    $defs: {
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
      },
      CampaignDeliveryInspectOutput: {
        type: "object",
        additionalProperties: true,
        required: ["campaignId", "revision", "settings"],
        properties: {
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
    },
  }),
  "campaign.delivery.update": z.fromJSONSchema({
    $ref: "#/$defs/CampaignDeliveryUpdateResult",
    $defs: {
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
                    $ref: "#/$defs/CampaignDeliveryUpdateOutput",
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
        },
      },
      AgentToolName: {
        type: "string",
        enum: [
          "analytics.summary",
          "workspace.briefing",
          "campaigns.list",
          "campaign.inspect",
          "sending.inspect",
          "replies.list",
          "conversations.list",
          "conversation.inspect",
          "pipeline.inspect",
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
          "list.prepare",
          "campaign.prepare",
          "campaign.launch.preflight",
          "campaign.launch",
          "campaign.pause.preflight",
          "campaign.pause",
          "companies.filters",
          "companies.search",
          "company.inspect",
          "companies.list.prepare",
          "companies.list.inspect",
          "companies.list.refine",
          "campaign.operation.inspect",
          "campaign.delivery.inspect",
          "campaign.delivery.update",
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
        },
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
    },
  }),
} as const;
