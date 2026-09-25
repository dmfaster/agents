// Generated from packages/public-api/openapi.yaml. Run npm run generate:agent-api.
export const AGENT_TOOL_NAMES = [
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
  "campaign.operation.inspect",
  "campaign.delivery.inspect",
  "campaign.delivery.update",
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
  "conversations.list": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "conversation.inspect": {
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
  "companies.filters": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "companies.search": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "company.inspect": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "companies.list.prepare": {
    effect: "draft",
    approval: "none",
    exposure: "public_api",
  },
  "companies.list.inspect": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "campaign.operation.inspect": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "campaign.delivery.inspect": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "campaign.delivery.update": {
    effect: "write",
    approval: "none",
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
  "conversations.list": ["inbox:read"],
  "conversation.inspect": ["inbox:read"],
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
  "companies.filters": ["audiences:read"],
  "companies.search": ["audiences:read"],
  "company.inspect": ["audiences:read"],
  "companies.list.prepare": ["audiences:read", "campaigns:write"],
  "companies.list.inspect": ["campaigns:read", "audiences:read"],
  "campaign.operation.inspect": ["campaigns:read"],
  "campaign.delivery.inspect": ["campaigns:read"],
  "campaign.delivery.update": ["campaigns:read", "campaigns:write"],
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
  "companies.list.prepare",
  "campaign.delivery.update",
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
      description:
        "Search and page through campaigns in the current workspace. Reuse nextCursor until hasMore is false; restart if the collection changes.",
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
        "campaigns list [--status STATUS] [--query TEXT] [--channel CHANNEL] [--limit N] [--cursor CURSOR]",
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
  "conversations.list": {
    mcp: {
      name: "conversations_list",
      title: "List inbox conversations",
      description:
        "Find actual inbox conversations by status, campaign, channel, and text. Page with the returned cursor; listing never marks a conversation read.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Inbox",
      usage:
        "conversations list [--filter FILTER] [--channel CHANNEL] [--campaign-id ID] [--query TEXT] [--limit N] [--cursor CURSOR] [--input FILE]",
      command: ["conversations", "list"],
    },
  },
  "conversation.inspect": {
    mcp: {
      name: "conversation_inspect",
      title: "Read inbox conversation",
      description:
        "Read an exact conversation's inbound and outbound message page. Pass nextCursor with the same conversation ID to continue.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Inbox",
      usage: "conversation inspect CONVERSATION_ID [--limit N] [--cursor CURSOR] [--input FILE]",
      command: ["conversation", "inspect"],
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
  "companies.filters": {
    mcp: {
      name: "companies_filters",
      title: "Discover company filters",
      description:
        "Read all live Companies filter fields, country-specific options and restrictions. No campaign state required.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "B2B company prospecting",
      usage: "companies filters --input FILE",
      command: ["companies", "filters"],
    },
  },
  "companies.search": {
    mcp: {
      name: "companies_search",
      title: "Search companies",
      description:
        "Search the same company inventory and filters as the live app. Returns full rows, exact total and pagination. Echo querySignature and expectedRevision on subsequent pages.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "B2B company prospecting",
      usage: "companies search --input FILE",
      command: ["companies", "search"],
    },
  },
  "company.inspect": {
    mcp: {
      name: "company_inspect",
      title: "Inspect company",
      description:
        "Read the complete company profile shown in the app, including financials, technologies, advertising, funding, hiring and decision-makers wherever available. Missing data is unknown.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "B2B company prospecting",
      usage: "company inspect --input FILE",
      command: ["company", "inspect"],
    },
  },
  "companies.list.prepare": {
    mcp: {
      name: "companies_list_prepare",
      title: "Save company shortlist",
      description:
        "Save explicitly inspected companies as a private company list. Echo each company.inspect revision. No campaign is created or started. Retry using the same key.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "B2B company prospecting",
      usage: "companies list prepare --input FILE",
      command: ["companies", "list", "prepare"],
    },
  },
  "companies.list.inspect": {
    mcp: {
      name: "companies_list_inspect",
      title: "Inspect company shortlist",
      description:
        "Read paginated company identities and available contact routes from a saved company list. Echo expectedUpdatedAt on subsequent pages. Use company.inspect for the current full research profile.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "B2B company prospecting",
      usage: "companies list inspect --input FILE",
      command: ["companies", "list", "inspect"],
    },
  },
  "campaign.operation.inspect": {
    mcp: {
      name: "campaign_operation_inspect",
      title: "Inspect campaign command progress",
      description:
        "Read the durable result of a launch or pause command. Queue preparation and sender acknowledgment are distinct from delivered messages.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Campaign operation and delivery",
      usage: "campaign operation inspect --input FILE [--wait SECONDS]",
      command: ["campaign", "operation", "inspect"],
    },
  },
  "campaign.delivery.inspect": {
    mcp: {
      name: "campaign_delivery_inspect",
      title: "Inspect campaign delivery settings",
      description:
        "Read delivery configuration, configuration revision and known sending eligibility for a campaign, including running and paused campaigns.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Campaign operation and delivery",
      usage: "campaign delivery inspect --input FILE",
      command: ["campaign", "delivery", "inspect"],
    },
  },
  "campaign.delivery.update": {
    mcp: {
      name: "campaign_delivery_update",
      title: "Update ongoing campaign delivery",
      description:
        "Change pacing, daily cap or automatic window on a running, paused or draft campaign. An in-progress attempt finishes; the new configuration applies to following attempts. Does not start a campaign or change its audience, content, run identity or terminal outcomes.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Campaign operation and delivery",
      usage: "campaign delivery update --input FILE",
      command: ["campaign", "delivery", "update"],
    },
  },
} as const;
export const AGENT_TOOL_INPUT_SCHEMAS = {
  "analytics.summary": {
    $ref: "#/components/schemas/AnalyticsSummaryInput",
  },
  "workspace.briefing": {
    $ref: "#/components/schemas/WorkspaceBriefingInput",
  },
  "campaigns.list": {
    $ref: "#/components/schemas/CampaignsListInput",
  },
  "campaign.inspect": {
    $ref: "#/components/schemas/CampaignInspectInput",
  },
  "sending.inspect": {
    $ref: "#/components/schemas/SendingInspectInput",
  },
  "replies.list": {
    $ref: "#/components/schemas/RepliesListInput",
  },
  "conversations.list": {
    $ref: "#/components/schemas/ConversationsListInput",
  },
  "conversation.inspect": {
    $ref: "#/components/schemas/ConversationInspectInput",
  },
  "pipeline.inspect": {
    $ref: "#/components/schemas/PipelineInspectInput",
  },
  "company.timeline": {
    $ref: "#/components/schemas/CompanyTimelineInput",
  },
  "industry.lookup": {
    $ref: "#/components/schemas/IndustryLookupInput",
  },
  "campaign.validate": {
    $ref: "#/components/schemas/CampaignValidateInput",
  },
  "audience.preview": {
    $ref: "#/components/schemas/AudiencePreviewInput",
  },
  "lists.list": {
    $ref: "#/components/schemas/ListsListInput",
  },
  "list.inspect": {
    $ref: "#/components/schemas/ListInspectInput",
  },
  "list.target.remove": {
    $ref: "#/components/schemas/ListTargetRemoveInput",
  },
  "campaign.draft.prepare": {
    $ref: "#/components/schemas/CampaignDraftPrepareInput",
  },
  "campaign.draft.update": {
    $ref: "#/components/schemas/CampaignDraftUpdateInput",
  },
  "list.import": {
    $ref: "#/components/schemas/ListImportInput",
  },
  "list.prepare": {
    $ref: "#/components/schemas/ListPrepareInput",
  },
  "campaign.prepare": {
    $ref: "#/components/schemas/CampaignPrepareInput",
  },
  "campaign.launch.preflight": {
    $ref: "#/components/schemas/CampaignActionPreflightInput",
  },
  "campaign.launch": {
    $ref: "#/components/schemas/CampaignActionInput",
  },
  "campaign.pause.preflight": {
    $ref: "#/components/schemas/CampaignActionPreflightInput",
  },
  "campaign.pause": {
    $ref: "#/components/schemas/CampaignActionInput",
  },
  "companies.filters": {
    $ref: "#/components/schemas/CompanyFiltersInput",
  },
  "companies.search": {
    $ref: "#/components/schemas/CompanySearchInput",
  },
  "company.inspect": {
    $ref: "#/components/schemas/CompanyInspectInput",
  },
  "companies.list.prepare": {
    $ref: "#/components/schemas/CompanyListPrepareInput",
  },
  "companies.list.inspect": {
    $ref: "#/components/schemas/CompanyListInspectInput",
  },
  "campaign.operation.inspect": {
    $ref: "#/components/schemas/CampaignOperationInspectInput",
  },
  "campaign.delivery.inspect": {
    $ref: "#/components/schemas/CampaignDeliveryInspectInput",
  },
  "campaign.delivery.update": {
    $ref: "#/components/schemas/CampaignDeliveryUpdateInput",
  },
} as const;
export const AGENT_INPUT_SCHEMA_DEFINITIONS = {
  AnalyticsSummaryInput: {
    type: "object",
    additionalProperties: false,
    required: ["scope"],
    properties: {
      scope: {
        type: "string",
        enum: ["today", "last_24_hours", "campaign_to_date"],
      },
      campaign: {
        allOf: [
          {
            $ref: "#/components/schemas/ResourceId",
          },
        ],
        description: "Optional campaign identifier or exact campaign name.",
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
  WorkspaceBriefingInput: {
    type: "object",
    additionalProperties: false,
  },
  CampaignsListInput: {
    type: "object",
    additionalProperties: false,
    properties: {
      status: {
        $ref: "#/components/schemas/CampaignStatus",
      },
      query: {
        type: "string",
        minLength: 1,
        maxLength: 120,
        description: "Case-insensitive campaign name search.",
      },
      channel: {
        $ref: "#/components/schemas/TargetChannel",
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: 25,
      },
      cursor: {
        type: "string",
        minLength: 1,
        maxLength: 500,
        description: "Opaque nextCursor returned by the preceding page.",
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
  CampaignInspectInput: {
    $ref: "#/components/schemas/OptionalCampaignInput",
  },
  OptionalCampaignInput: {
    type: "object",
    additionalProperties: false,
    properties: {
      campaignId: {
        allOf: [
          {
            $ref: "#/components/schemas/ResourceId",
          },
        ],
        description: "Omit to use the selected, active, or most recent campaign.",
      },
    },
  },
  SendingInspectInput: {
    $ref: "#/components/schemas/OptionalCampaignInput",
  },
  RepliesListInput: {
    type: "object",
    additionalProperties: false,
    properties: {
      campaignId: {
        $ref: "#/components/schemas/ResourceId",
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: 20,
      },
      query: {
        type: "string",
        minLength: 1,
        maxLength: 120,
        pattern: ".*\\S.*",
        description: "Optional case-insensitive reply search text.",
      },
    },
  },
  ConversationsListInput: {
    type: "object",
    additionalProperties: false,
    properties: {
      filter: {
        type: "string",
        enum: ["all", "needs_reply", "waiting", "unread", "snoozed", "closed"],
      },
      interest: {
        type: "string",
        enum: ["positive", "neutral", "negative", "needs_review"],
      },
      intent: {
        type: "string",
        enum: [
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
      channel: {
        $ref: "#/components/schemas/InboxChannel",
      },
      mailboxId: {
        $ref: "#/components/schemas/ResourceId",
      },
      campaignId: {
        $ref: "#/components/schemas/ResourceId",
      },
      query: {
        type: "string",
        minLength: 1,
        maxLength: 120,
      },
      includeAutomaticResponses: {
        type: "boolean",
      },
      cursor: {
        type: "string",
        minLength: 1,
        maxLength: 2000,
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: 60,
      },
    },
  },
  InboxChannel: {
    type: "string",
    enum: ["instagram", "facebook", "linkedin", "gmail", "outlook", "email", "sms"],
  },
  ConversationInspectInput: {
    type: "object",
    additionalProperties: false,
    required: ["conversationId"],
    properties: {
      conversationId: {
        $ref: "#/components/schemas/ResourceId",
      },
      cursor: {
        type: "string",
        minLength: 1,
        maxLength: 2000,
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: 100,
      },
    },
  },
  PipelineInspectInput: {
    $ref: "#/components/schemas/OptionalCampaignInput",
  },
  CompanyTimelineInput: {
    type: "object",
    additionalProperties: false,
    required: ["campaignId", "companyOutreachId"],
    properties: {
      campaignId: {
        $ref: "#/components/schemas/ResourceId",
      },
      companyOutreachId: {
        $ref: "#/components/schemas/ResourceId",
      },
    },
  },
  IndustryLookupInput: {
    type: "object",
    additionalProperties: false,
    required: ["query"],
    properties: {
      query: {
        type: "string",
        minLength: 1,
        maxLength: 800,
        pattern: ".*\\S.*",
      },
      version: {
        oneOf: [
          {
            $ref: "#/components/schemas/TolVersion",
          },
          {
            type: "null",
          },
        ],
      },
      language: {
        type: "string",
        enum: ["en", "fi"],
      },
    },
  },
  TolVersion: {
    type: "string",
    enum: ["2008", "2025"],
  },
  CampaignValidateInput: {
    type: "object",
    additionalProperties: false,
    required: ["state"],
    properties: {
      state: {
        $ref: "#/components/schemas/AgentCampaignState",
      },
    },
  },
  AgentCampaignState: {
    description:
      "Complete stateless campaign state. Send the latest returned or user-confirmed state on every planning call.",
    "x-dmfaster-max-serialized-chars": 32000,
    type: "object",
    additionalProperties: false,
    required: ["profile", "brief"],
    properties: {
      profile: {
        $ref: "#/components/schemas/AgentBusinessProfile",
      },
      brief: {
        $ref: "#/components/schemas/AgentCampaignBrief",
      },
    },
  },
  AgentBusinessProfile: {
    type: "object",
    additionalProperties: false,
    required: [
      "version",
      "businessName",
      "websiteUrl",
      "businessDescription",
      "offer",
      "customerOutcome",
      "differentiators",
      "proofPoints",
      "preferredTone",
      "preferredLanguages",
      "defaultCountries",
      "excludedCompanyTraits",
    ],
    properties: {
      version: {
        type: "integer",
        const: 1,
      },
      businessName: {
        type: "string",
      },
      websiteUrl: {
        type: "string",
      },
      businessDescription: {
        type: "string",
      },
      offer: {
        type: "string",
      },
      customerOutcome: {
        type: "string",
      },
      differentiators: {
        type: "array",
        items: {
          type: "string",
        },
      },
      proofPoints: {
        type: "array",
        items: {
          type: "string",
        },
      },
      preferredTone: {
        type: "string",
      },
      preferredLanguages: {
        type: "array",
        items: {
          type: "string",
        },
      },
      defaultCountries: {
        type: "array",
        items: {
          $ref: "#/components/schemas/SupportedCountry",
        },
      },
      excludedCompanyTraits: {
        type: "array",
        items: {
          type: "string",
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
  AgentCampaignBrief: {
    type: "object",
    additionalProperties: false,
    required: [
      "version",
      "objective",
      "offer",
      "targetDescription",
      "countries",
      "industryCodes",
      "decisionMakerRoles",
      "companySize",
      "requestedSignals",
      "exclusions",
      "callToAction",
      "requestedChannels",
      "messageLanguage",
      "tone",
      "dailyVolume",
      "deliverySettings",
      "outreachMessages",
    ],
    properties: {
      version: {
        type: "integer",
        const: 1,
      },
      objective: {
        type: "string",
      },
      offer: {
        type: "string",
      },
      targetDescription: {
        type: "string",
      },
      countries: {
        type: "array",
        items: {
          $ref: "#/components/schemas/SupportedCountry",
        },
      },
      cities: {
        type: "array",
        maxItems: 32,
        items: {
          type: "string",
          minLength: 1,
          maxLength: 80,
        },
      },
      industryCodes: {
        type: "array",
        items: {
          type: "string",
        },
      },
      industryResolution: {
        $ref: "#/components/schemas/AgentIndustryResolution",
      },
      decisionMakerRoles: {
        type: "array",
        items: {
          type: "string",
        },
      },
      companySize: {
        $ref: "#/components/schemas/AgentCompanySize",
      },
      googleAdsActivityWindow: {
        oneOf: [
          {
            type: "string",
            enum: ["last_30_days", "last_90_days", "last_12_months"],
          },
          {
            type: "null",
          },
        ],
      },
      metaAdsFilter: {
        oneOf: [
          {
            $ref: "#/components/schemas/AgentMetaAdsFilter",
          },
          {
            type: "null",
          },
        ],
      },
      requestedSignals: {
        type: "array",
        items: {
          $ref: "#/components/schemas/AgentSignalCriterion",
        },
      },
      exclusions: {
        type: "array",
        items: {
          type: "string",
        },
      },
      excludePreviouslyContacted: {
        type: "boolean",
        description:
          "Exclude companies already contacted in this workspace. The exact preview and prepare call must use the same setting.",
      },
      unsupportedCriteria: {
        type: "array",
        maxItems: 8,
        items: {
          type: "string",
          maxLength: 160,
        },
      },
      callToAction: {
        type: "string",
      },
      requestedChannels: {
        type: "array",
        items: {
          $ref: "#/components/schemas/TargetChannel",
        },
      },
      messageLanguage: {
        type: "string",
      },
      tone: {
        type: "string",
      },
      dailyVolume: {
        oneOf: [
          {
            type: "number",
          },
          {
            type: "null",
          },
        ],
      },
      deliverySettings: {
        $ref: "#/components/schemas/AgentCampaignDeliverySettings",
      },
      outreachMessages: {
        type: "array",
        items: {
          $ref: "#/components/schemas/AgentOutreachMessage",
        },
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
        $ref: "#/components/schemas/TolVersion",
      },
      selections: {
        type: "array",
        maxItems: 2,
        items: {
          $ref: "#/components/schemas/AgentIndustryCodeSelection",
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
          $ref: "#/components/schemas/AgentIndustryClarificationOption",
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
        $ref: "#/components/schemas/TolVersion",
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
          $ref: "#/components/schemas/AgentIndustryCodeSelection",
        },
      },
    },
  },
  AgentCompanySize: {
    type: "object",
    additionalProperties: false,
    required: ["employeeMin", "employeeMax", "revenueMinEur", "revenueMaxEur"],
    properties: {
      employeeMin: {
        oneOf: [
          {
            type: "number",
          },
          {
            type: "null",
          },
        ],
      },
      employeeMax: {
        oneOf: [
          {
            type: "number",
          },
          {
            type: "null",
          },
        ],
      },
      revenueMinEur: {
        oneOf: [
          {
            type: "number",
          },
          {
            type: "null",
          },
        ],
      },
      revenueMaxEur: {
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
  AgentMetaAdsFilter: {
    type: "object",
    additionalProperties: false,
    required: [
      "minimumEuReach",
      "targetAge",
      "targetGender",
      "targetLocation",
      "includeUncorroborated",
    ],
    properties: {
      minimumEuReach: {
        oneOf: [
          {
            type: "integer",
            minimum: 0,
            maximum: 100000000,
          },
          {
            type: "null",
          },
        ],
      },
      targetAge: {
        oneOf: [
          {
            type: "integer",
            minimum: 13,
            maximum: 65,
          },
          {
            type: "null",
          },
        ],
      },
      targetGender: {
        oneOf: [
          {
            type: "string",
            enum: ["all", "men", "women"],
          },
          {
            type: "null",
          },
        ],
      },
      targetLocation: {
        type: "string",
        maxLength: 80,
      },
      includeUncorroborated: {
        type: "boolean",
      },
    },
  },
  AgentSignalCriterion: {
    type: "object",
    additionalProperties: false,
    required: ["key", "required", "description"],
    properties: {
      key: {
        type: "string",
        enum: [
          "recent_funding",
          "active_hiring",
          "leadership_change",
          "technology_usage",
          "content_activity",
          "purchase_intent",
        ],
      },
      required: {
        type: "boolean",
      },
      description: {
        type: "string",
      },
    },
  },
  AgentCampaignDeliverySettings: {
    type: "object",
    additionalProperties: false,
    required: ["dailyCap", "windowStart", "windowEnd", "weekdays", "timezone", "confirmed"],
    properties: {
      dailyCap: {
        oneOf: [
          {
            type: "number",
          },
          {
            type: "null",
          },
        ],
      },
      windowStart: {
        type: "string",
      },
      windowEnd: {
        type: "string",
      },
      weekdays: {
        type: "integer",
        minimum: 1,
        maximum: 127,
      },
      timezone: {
        type: "string",
      },
      confirmed: {
        type: "boolean",
      },
    },
  },
  AgentOutreachMessage: {
    type: "object",
    additionalProperties: false,
    required: ["channels", "subject", "body", "origin"],
    properties: {
      channels: {
        type: "array",
        items: {
          $ref: "#/components/schemas/TargetChannel",
        },
      },
      subject: {
        type: "string",
      },
      body: {
        type: "string",
      },
      origin: {
        type: "string",
        enum: ["user", "user_requested_generation", "agent_draft", "user_approved_generation"],
      },
    },
  },
  AudiencePreviewInput: {
    type: "object",
    additionalProperties: false,
    required: ["state"],
    properties: {
      state: {
        $ref: "#/components/schemas/AgentCampaignState",
      },
      sampleSize: {
        type: "integer",
        minimum: 1,
        maximum: 25,
      },
    },
  },
  ListsListInput: {
    type: "object",
    additionalProperties: false,
    required: [],
    properties: {
      query: {
        type: "string",
        minLength: 1,
        maxLength: 120,
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: 25,
      },
      offset: {
        type: "integer",
        minimum: 0,
        maximum: 1000000,
      },
    },
  },
  ListInspectInput: {
    type: "object",
    additionalProperties: false,
    required: ["listId"],
    properties: {
      listId: {
        $ref: "#/components/schemas/ResourceId",
      },
      username: {
        type: "string",
        minLength: 1,
        maxLength: 64,
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: 100,
      },
      offset: {
        type: "integer",
        minimum: 0,
        maximum: 1000000,
      },
    },
  },
  ListTargetRemoveInput: {
    type: "object",
    additionalProperties: false,
    required: ["listId", "username", "expectedListUpdatedAt"],
    properties: {
      listId: {
        $ref: "#/components/schemas/ResourceId",
      },
      username: {
        type: "string",
        minLength: 1,
        maxLength: 64,
      },
      expectedListUpdatedAt: {
        $ref: "#/components/schemas/ResourceVersion",
      },
    },
  },
  ResourceVersion: {
    type: "string",
    pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d{1,6})?Z$",
    minLength: 20,
    maxLength: 27,
  },
  CampaignDraftPrepareInput: {
    type: "object",
    additionalProperties: false,
    required: [
      "listId",
      "expectedListUpdatedAt",
      "expectedTargetCount",
      "name",
      "messageVariants",
      "dailyCap",
      "pacingSeconds",
      "onlyNewChats",
      "skipPreviouslyMessaged",
      "idempotencyKey",
    ],
    properties: {
      listId: {
        $ref: "#/components/schemas/ResourceId",
      },
      expectedListUpdatedAt: {
        $ref: "#/components/schemas/ResourceVersion",
      },
      expectedTargetCount: {
        type: "integer",
        minimum: 1,
      },
      name: {
        type: "string",
        minLength: 1,
        maxLength: 120,
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
        const: true,
      },
      skipPreviouslyMessaged: {
        const: true,
      },
      idempotencyKey: {
        $ref: "#/components/schemas/IdempotencyKey",
      },
    },
  },
  IdempotencyKey: {
    "x-dmfaster-trim": true,
    type: "string",
    minLength: 1,
    maxLength: 160,
    pattern: "^[A-Za-z0-9._:-]{1,160}$",
  },
  CampaignDraftUpdateInput: {
    type: "object",
    additionalProperties: false,
    required: ["campaignId", "expectedCampaignUpdatedAt", "updates"],
    properties: {
      campaignId: {
        $ref: "#/components/schemas/ResourceId",
      },
      expectedCampaignUpdatedAt: {
        $ref: "#/components/schemas/ResourceVersion",
      },
      updates: {
        type: "object",
        additionalProperties: false,
        minProperties: 1,
        properties: {
          name: {
            type: "string",
            minLength: 1,
            maxLength: 120,
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
        },
      },
    },
  },
  ListImportInput: {
    type: "object",
    additionalProperties: false,
    required: ["name", "usernames", "idempotencyKey"],
    properties: {
      name: {
        type: "string",
        minLength: 1,
        maxLength: 120,
      },
      usernames: {
        type: "array",
        minItems: 1,
        maxItems: 1000,
        items: {
          type: "string",
          minLength: 1,
          maxLength: 64,
        },
        description:
          "Instagram handles; whitespace and a leading @ are removed and case is normalized. Invalid handles reject the whole import.",
      },
      idempotencyKey: {
        $ref: "#/components/schemas/IdempotencyKey",
      },
    },
  },
  ListPrepareInput: {
    type: "object",
    additionalProperties: false,
    required: ["state", "reviewedAudience"],
    properties: {
      state: {
        $ref: "#/components/schemas/AgentCampaignState",
      },
      sampleSize: {
        type: "integer",
        minimum: 1,
        maximum: 25,
      },
      idempotencyKey: {
        $ref: "#/components/schemas/IdempotencyKey",
      },
      reviewedAudience: {
        $ref: "#/components/schemas/ReviewedAudience",
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
  CampaignPrepareInput: {
    $ref: "#/components/schemas/ListPrepareInput",
  },
  CampaignActionPreflightInput: {
    type: "object",
    additionalProperties: false,
    required: ["campaignId", "idempotencyKey"],
    properties: {
      campaignId: {
        $ref: "#/components/schemas/ResourceId",
      },
      idempotencyKey: {
        $ref: "#/components/schemas/IdempotencyKey",
      },
    },
  },
  CampaignActionInput: {
    type: "object",
    additionalProperties: false,
    required: ["campaignId", "idempotencyKey", "authorizationId"],
    properties: {
      campaignId: {
        $ref: "#/components/schemas/ResourceId",
      },
      idempotencyKey: {
        $ref: "#/components/schemas/IdempotencyKey",
      },
      authorizationId: {
        type: "string",
        pattern: "^agent_action_[a-f0-9]{32}$",
      },
    },
  },
  CompanyFiltersInput: {
    type: "object",
    additionalProperties: false,
    properties: {
      countries: {
        type: "array",
        items: {
          $ref: "#/components/schemas/SupportedCountry",
        },
        maxItems: 32,
        minItems: 1,
      },
      states: {
        type: "array",
        items: {
          type: "string",
          maxLength: 80,
        },
        maxItems: 32,
      },
      citySearch: {
        type: "string",
        maxLength: 120,
      },
    },
    required: ["countries"],
  },
  CompanySearchInput: {
    type: "object",
    additionalProperties: false,
    properties: {
      filters: {
        $ref: "#/components/schemas/CompanySearchFilters",
      },
      page: {
        type: "integer",
        minimum: 1,
        maximum: 10000,
      },
      pageSize: {
        type: "integer",
        minimum: 1,
        maximum: 100,
      },
      cursor: {
        type: "string",
        maxLength: 1000,
      },
      expectedRevision: {
        type: "string",
        maxLength: 200,
      },
      querySignature: {
        type: "string",
        maxLength: 200,
      },
    },
    required: ["filters"],
  },
  CompanySearchFilters: {
    type: "object",
    additionalProperties: false,
    properties: {
      country: {
        $ref: "#/components/schemas/SupportedCountry",
      },
      countries: {
        type: "array",
        items: {
          $ref: "#/components/schemas/SupportedCountry",
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
  CompanyInspectInput: {
    type: "object",
    additionalProperties: false,
    properties: {
      country: {
        $ref: "#/components/schemas/SupportedCountry",
      },
      businessId: {
        type: "string",
        maxLength: 192,
        minLength: 1,
      },
    },
    required: ["country", "businessId"],
  },
  CompanyListPrepareInput: {
    type: "object",
    additionalProperties: false,
    properties: {
      name: {
        type: "string",
        maxLength: 120,
        minLength: 1,
      },
      companies: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            country: {
              $ref: "#/components/schemas/SupportedCountry",
            },
            businessId: {
              type: "string",
              maxLength: 192,
              minLength: 1,
            },
            expectedRevision: {
              type: "string",
              maxLength: 64,
              minLength: 64,
            },
          },
          required: ["country", "businessId", "expectedRevision"],
        },
        maxItems: 50,
        minItems: 1,
      },
      idempotencyKey: {
        $ref: "#/components/schemas/IdempotencyKey",
      },
    },
    required: ["name", "companies", "idempotencyKey"],
  },
  CompanyListInspectInput: {
    type: "object",
    additionalProperties: false,
    properties: {
      listId: {
        $ref: "#/components/schemas/ResourceId",
      },
      offset: {
        type: "integer",
        minimum: 0,
        maximum: 1000000,
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: 100,
      },
      expectedUpdatedAt: {
        type: "string",
        maxLength: 160,
      },
    },
    required: ["listId"],
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
  CampaignDeliveryInspectInput: {
    type: "object",
    additionalProperties: false,
    required: ["campaignId"],
    properties: {
      campaignId: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
    },
  },
  CampaignDeliveryUpdateInput: {
    type: "object",
    additionalProperties: false,
    required: ["campaignId", "expectedRevision", "idempotencyKey", "patch"],
    properties: {
      campaignId: {
        type: "string",
        minLength: 1,
        maxLength: 160,
      },
      expectedRevision: {
        type: "string",
        pattern: "^[a-f0-9]{64}$",
      },
      idempotencyKey: {
        type: "string",
        minLength: 1,
        maxLength: 160,
        pattern: "^[A-Za-z0-9._:-]+$",
      },
      patch: {
        type: "object",
        additionalProperties: false,
        properties: {
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
        },
        minProperties: 1,
      },
    },
  },
} as const;
