// Generated from packages/public-api/openapi.yaml. Run npm run generate:agent-api.
export const AGENT_TOOL_NAMES = [
  "analytics.summary",
  "workspace.briefing",
  "campaigns.list",
  "campaign.inspect",
  "sending.inspect",
  "replies.list",
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
] as const;
export const AGENT_TOOL_POLICIES = Object.freeze({
  "analytics.summary": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "workspace.briefing": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "campaigns.list": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "campaign.inspect": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "sending.inspect": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "replies.list": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "pipeline.inspect": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "company.timeline": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "industry.lookup": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "campaign.validate": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "audience.preview": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "lists.list": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "list.inspect": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "list.target.remove": {
    effect: "write",
    approval: "none",
    exposure: "public_api",
  },
  "campaign.draft.prepare": {
    effect: "draft",
    approval: "none",
    exposure: "public_api",
  },
  "campaign.draft.update": {
    effect: "draft",
    approval: "none",
    exposure: "public_api",
  },
  "list.import": {
    effect: "draft",
    approval: "none",
    exposure: "public_api",
  },
  "list.prepare": {
    effect: "draft",
    approval: "none",
    exposure: "public_api",
  },
  "campaign.prepare": {
    effect: "draft",
    approval: "none",
    exposure: "public_api",
  },
  "campaign.launch.preflight": {
    effect: "write",
    approval: "none",
    exposure: "public_api",
  },
  "campaign.launch": {
    effect: "external",
    approval: "human_confirmation",
    exposure: "public_api",
  },
  "campaign.pause.preflight": {
    effect: "write",
    approval: "none",
    exposure: "public_api",
  },
  "campaign.pause": {
    effect: "write",
    approval: "human_confirmation",
    exposure: "public_api",
  },
} as const);
export const AGENT_TOOL_SCOPES = {
  "analytics.summary": ["workspace:read"],
  "workspace.briefing": ["workspace:read"],
  "campaigns.list": ["campaigns:read"],
  "campaign.inspect": ["campaigns:read"],
  "sending.inspect": ["sending:read"],
  "replies.list": ["inbox:read"],
  "pipeline.inspect": ["pipeline:read"],
  "company.timeline": ["campaigns:read", "pipeline:read"],
  "industry.lookup": ["audiences:read"],
  "campaign.validate": ["audiences:read"],
  "audience.preview": ["audiences:read"],
  "lists.list": ["campaigns:read"],
  "list.inspect": ["campaigns:read"],
  "list.target.remove": ["campaigns:write"],
  "campaign.draft.prepare": ["campaigns:read", "campaigns:write"],
  "campaign.draft.update": ["campaigns:read", "campaigns:write"],
  "list.import": ["campaigns:write"],
  "list.prepare": ["audiences:read", "campaigns:write"],
  "campaign.prepare": ["audiences:read", "campaigns:write"],
  "campaign.launch.preflight": ["campaigns:launch"],
  "campaign.launch": ["campaigns:launch"],
  "campaign.pause.preflight": ["campaigns:write"],
  "campaign.pause": ["campaigns:write"],
} as const;
export const AGENT_OWNER_ONLY_TOOLS = [
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
] as const;
export const AGENT_TOOL_DEFINITIONS = {
  "analytics.summary": {
    mcp: {
      name: "analytics_summary",
      title: "Analytics summary",
      description:
        "Read an authoritative analytics snapshot for an explicit time scope, optionally limited to one campaign identifier or exact name.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Workspace reads",
      usage:
        "analytics summary --scope today|last_24_hours|campaign_to_date [--campaign ID_OR_NAME]",
      command: ["analytics", "summary"],
    },
  },
  "workspace.briefing": {
    mcp: {
      name: "workspace_briefing",
      title: "Workspace briefing",
      description:
        "Start here when the user has not named a specific DM Faster resource. Read the authoritative workspace summary and current campaign and sending priorities.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Workspace reads",
      usage: "workspace briefing",
      command: ["workspace", "briefing"],
    },
  },
  "campaigns.list": {
    mcp: {
      name: "campaigns_list",
      title: "List campaigns",
      description: "List campaigns in the current workspace, optionally filtered by status.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Workspace reads",
      usage: "campaigns list [--status STATUS] [--limit N]",
      command: ["campaigns", "list"],
    },
  },
  "campaign.inspect": {
    mcp: {
      name: "campaign_inspect",
      title: "Inspect campaign",
      description:
        "Read delivery, outcome, and pipeline facts for a campaign identifier returned by DM Faster.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Workspace reads",
      usage: "campaign inspect [CAMPAIGN_ID]",
      command: ["campaign", "inspect"],
    },
  },
  "sending.inspect": {
    mcp: {
      name: "sending_inspect",
      title: "Inspect sending health",
      description:
        "Read browser-worker, queue, and failed-send health for the workspace or one campaign.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Workspace reads",
      usage: "sending inspect [CAMPAIGN_ID]",
      command: ["sending", "inspect"],
    },
  },
  "replies.list": {
    mcp: {
      name: "replies_list",
      title: "List priority replies",
      description:
        "Read actual reply-stage records that need attention. Never infer replies from sent counts.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Workspace reads",
      usage: "replies list [CAMPAIGN_ID] [--limit N] [--query TEXT]",
      command: ["replies", "list"],
    },
  },
  "pipeline.inspect": {
    mcp: {
      name: "pipeline_inspect",
      title: "Inspect pipeline",
      description:
        "Read contacted, replied, booked-call, and closed pipeline counts for a campaign.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Workspace reads",
      usage: "pipeline inspect [CAMPAIGN_ID]",
      command: ["pipeline", "inspect"],
    },
  },
  "company.timeline": {
    mcp: {
      name: "company_timeline",
      title: "Inspect company timeline",
      description: "Read the outreach event timeline for one company record in one campaign.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Workspace reads",
      usage: "company timeline CAMPAIGN_ID COMPANY_OUTREACH_ID",
      command: ["company", "timeline"],
    },
  },
  "industry.lookup": {
    mcp: {
      name: "industry_lookup",
      title: "Resolve industry",
      description:
        "Resolve a natural-language industry or explicit TOL code into official executable TOL selections. Returns clarification instead of guessing.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Campaign planning and drafts",
      usage: "industry lookup QUERY [--version 2008|2025] [--language en|fi]",
      command: ["industry", "lookup"],
    },
  },
  "campaign.validate": {
    mcp: {
      name: "campaign_validate",
      title: "Validate campaign plan",
      description:
        "Validate a complete structured campaign state against DM Faster capabilities and domain rules without changing workspace data.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Campaign planning and drafts",
      usage: "campaign validate --state FILE",
      command: ["campaign", "validate"],
    },
  },
  "audience.preview": {
    mcp: {
      name: "audience_preview",
      title: "Preview exact audience",
      description:
        "Preview bounded company rows and the exact matching total. Never describe a total as final unless totalMatchesExact is true.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Campaign planning and drafts",
      usage: "audience preview --state FILE [--sample-size N]",
      command: ["audience", "preview"],
    },
  },
  "lists.list": {
    mcp: {
      name: "lists_list",
      title: "Find saved target lists",
      description:
        "Find existing workspace lists by a case-insensitive name search. Results are paginated with an exact matching-list total; inspect a selected list for authoritative audience counts and membership.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Workspace reads",
      usage: "lists list [--query TEXT] [--limit N] [--offset N]",
      command: ["lists", "list"],
    },
  },
  "list.inspect": {
    mcp: {
      name: "list_inspect",
      title: "Inspect a saved Instagram list",
      description:
        "Read an existing Instagram list, its exact target count, bounded username page and resource version. Supply username to check exact membership across the whole list, independently of the page. Company lists require the company audience workflow.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Workspace reads",
      usage: "list inspect LIST_ID [--username HANDLE] [--limit N] [--offset N]",
      command: ["list", "inspect"],
    },
  },
  "list.target.remove": {
    mcp: {
      name: "list_target_remove",
      title: "Remove an Instagram target",
      description:
        "Ensure one exact Instagram username is absent from an owner-owned saved list after the user requests removal. Echo list.inspect updatedAt as expectedListUpdatedAt. Refuse stale writes and lists protected by active campaigns. Already absent is a verified no-op. Sends nothing.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Campaign planning and drafts",
      usage: "list target remove LIST_ID --username HANDLE --expected-version TIMESTAMP",
      command: ["list", "target", "remove"],
    },
  },
  "campaign.draft.prepare": {
    mcp: {
      name: "campaign_draft_prepare",
      title: "Prepare a campaign from a saved Instagram list",
      description:
        "Create an idempotent disabled Instagram campaign draft from a saved list and 1–4 exact message variations. Echo list.inspect updatedAt and exact total as expectedListUpdatedAt and expectedTargetCount. Delivery settings must be supplied. Never launches, schedules activation, or sends messages.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Campaign planning and drafts",
      usage: "campaign draft prepare --input FILE",
      command: ["campaign", "draft", "prepare"],
    },
  },
  "campaign.draft.update": {
    mcp: {
      name: "campaign_draft_update",
      title: "Update a saved Instagram campaign draft",
      description:
        "Patch the name, messages, delivery cap, pacing, or automatic sending window of an existing disabled, unstarted Instagram draft. Echo campaign.inspect updatedAt as expectedCampaignUpdatedAt. Omitted fields are preserved. Stale versions and started campaigns are rejected; saving a window never arms it. Inspect after an uncertain response before retrying. Never creates another campaign, enables sending, or launches.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Campaign planning and drafts",
      usage: "campaign draft update --input FILE",
      command: ["campaign", "draft", "update"],
    },
  },
  "list.import": {
    mcp: {
      name: "list_import",
      title: "Import Instagram username list",
      description:
        "Save 1–1,000 supplied Instagram usernames as a private list after the user reviews them. Available to all account owners, including Basic. Duplicates are removed. Reuse the idempotency key only for the same list. Creates no campaign and sends nothing.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Campaign planning and drafts",
      usage: "list import --name NAME --file FILE [--idempotency-key KEY]",
      command: ["list", "import"],
    },
  },
  "list.prepare": {
    mcp: {
      name: "list_prepare",
      title: "Prepare private company list",
      description:
        "Create an idempotent private company list from an exact validated audience. First show the audience_preview result to the user, then echo its server-issued reviewedAudience object unchanged. This does not start outreach.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Campaign planning and drafts",
      usage: "list prepare --state FILE --reviewed-audience PREVIEW_JSON [--idempotency-key KEY]",
      command: ["list", "prepare"],
    },
  },
  "campaign.prepare": {
    mcp: {
      name: "campaign_prepare",
      title: "Prepare campaign draft",
      description:
        "Create an idempotent private list and disabled campaign draft only after the user reviews audience_preview. Echo the preview's server-issued reviewedAudience object unchanged. Nothing is sent and the campaign is not started.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Campaign planning and drafts",
      usage:
        "campaign prepare --state FILE --reviewed-audience PREVIEW_JSON [--idempotency-key KEY]",
      command: ["campaign", "prepare"],
    },
  },
  "campaign.launch.preflight": {
    mcp: {
      name: "campaign_launch_preflight",
      title: "Preflight campaign launch",
      description:
        "Use only after the user explicitly instructs you to launch this campaign. Validate one exact campaign version without launching it. A ready result authorizes immediate launch with its server-issued authorization ID. A setup_required result means the user must open setup.setupUrl, then you repeat setup.resume exactly; an approval_required result means show the approval URL and confirmation code, then repeat identical inputs after the owner decides.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Campaign controls",
      usage: "campaign launch preflight CAMPAIGN_ID --idempotency-key KEY",
      command: ["campaign", "launch", "preflight"],
    },
  },
  "campaign.launch": {
    mcp: {
      name: "campaign_launch",
      title: "Launch approved campaign",
      description:
        "Start outreach only on an explicit user instruction and a matching ready or owner-approved preflight. A connection with campaigns:control needs no additional approval page. Requires the same campaign ID and idempotency key plus the server-issued authorization ID. If the browser went offline and this returns browser_worker_required, repeat the matching preflight to receive its setup handoff.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cli: {
      section: "Campaign controls",
      usage: "campaign launch CAMPAIGN_ID --idempotency-key KEY --authorization-id ID",
      command: ["campaign", "launch"],
    },
  },
  "campaign.pause.preflight": {
    mcp: {
      name: "campaign_pause_preflight",
      title: "Preflight campaign pause",
      description:
        "Use only after an explicit user instruction to pause this campaign. A ready result permits immediate pause using its authorization ID; approval_required needs the owner to approve the returned page. This preflight does not pause it.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Campaign controls",
      usage: "campaign pause preflight CAMPAIGN_ID --idempotency-key KEY",
      command: ["campaign", "pause", "preflight"],
    },
  },
  "campaign.pause": {
    mcp: {
      name: "campaign_pause",
      title: "Pause approved campaign",
      description:
        "Pause a campaign only on an explicit user instruction and a matching ready or owner-approved preflight. A connection with campaigns:control needs no additional approval page. Retries with the same idempotency key are safe.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Campaign controls",
      usage: "campaign pause CAMPAIGN_ID --idempotency-key KEY --authorization-id ID",
      command: ["campaign", "pause"],
    },
  },
} as const;
