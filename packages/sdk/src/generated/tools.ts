// Generated from packages/public-api/openapi.yaml. Run npm run generate:agent-api.
export const AGENT_TOOL_NAMES = [
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
  "campaign.followups.list",
  "campaign.followups.cancel",
  "campaign.outcomes.list",
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
  "list.prepare",
  "campaign.prepare",
  "campaign.launch.preflight",
  "campaign.launch",
  "campaign.pause.preflight",
  "campaign.pause",
  "companies.filters",
  "companies.suggest",
  "companies.search",
  "companies.evidence.search",
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
  "campaign.copy.inspect": {
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
  "conversation.update": {
    effect: "write",
    approval: "none",
    exposure: "public_api",
  },
  "conversation.reply": {
    effect: "external",
    approval: "human_confirmation",
    exposure: "public_api",
  },
  "conversation.reply.inspect": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "campaign.followups.list": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "campaign.followups.cancel": {
    effect: "write",
    approval: "none",
    exposure: "public_api",
  },
  "campaign.outcomes.list": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "senders.inspect": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "history.list": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "pipeline.inspect": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "pipeline.cards.list": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "pipeline.stage.update": {
    effect: "write",
    approval: "none",
    exposure: "public_api",
  },
  "pipeline.note.list": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "pipeline.note.add": {
    effect: "write",
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
  "companies.suggest": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "companies.search": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "companies.evidence.search": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "companies.knowledge": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "companies.evidence.start": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "companies.evidence.advance": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "companies.evidence.status": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "companies.evidence.results": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "companies.evidence.cancel": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "company.inspect": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "companies.fit.start": {
    effect: "draft",
    approval: "none",
    exposure: "public_api",
  },
  "companies.fit.advance": {
    effect: "draft",
    approval: "none",
    exposure: "public_api",
  },
  "companies.fit.results": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "companies.fit.proposal": {
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
  "companies.list.refine": {
    effect: "write",
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
  "sending.instagram.pacing.inspect": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "sending.instagram.pacing.update": {
    effect: "write",
    approval: "none",
    exposure: "public_api",
  },
  "companies.fit.status": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "companies.fit.cancel": {
    effect: "write",
    approval: "none",
    exposure: "public_api",
  },
  "companies.fit.runs.list": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "companies.fit.run": {
    effect: "draft",
    approval: "none",
    exposure: "public_api",
  },
  "companies.fit.cohort": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "copy.performance": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "calendar.status": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "calendar.availability": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "calendar.meeting.book": {
    effect: "external",
    approval: "human_confirmation",
    exposure: "public_api",
  },
  "calls.list": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "call.inspect": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "instagram.extract.quote": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "instagram.extract.start": {
    effect: "write",
    approval: "none",
    exposure: "public_api",
  },
  "instagram.extract.inspect": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "instagram.extract.results": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "leads.status": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "leads.extract.quote": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "leads.extract.start": {
    effect: "write",
    approval: "none",
    exposure: "public_api",
  },
  "leads.extract.inspect": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "leads.extract.refresh": {
    effect: "write",
    approval: "none",
    exposure: "public_api",
  },
  "leads.extract.continue": {
    effect: "write",
    approval: "none",
    exposure: "public_api",
  },
  "leads.enrich.preview": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "leads.enrich.start": {
    effect: "write",
    approval: "none",
    exposure: "public_api",
  },
  "leads.enrich.inspect": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "leads.prospect.quote": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "leads.prospect.start": {
    effect: "write",
    approval: "none",
    exposure: "public_api",
  },
  "leads.prospect.inspect": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "leads.prospect.results": {
    effect: "read",
    approval: "none",
    exposure: "public_api",
  },
  "leads.prospect.advance": {
    effect: "write",
    approval: "none",
    exposure: "public_api",
  },
  "leads.prospect.cancel": {
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
  "campaign.copy.inspect": ["campaigns:read"],
  "sending.inspect": ["sending:read"],
  "replies.list": ["inbox:read"],
  "conversations.list": ["inbox:read"],
  "conversation.inspect": ["inbox:read"],
  "conversation.update": ["inbox:read", "inbox:write"],
  "conversation.reply": ["inbox:read", "inbox:write"],
  "conversation.reply.inspect": ["inbox:read"],
  "campaign.followups.list": ["sending:read"],
  "campaign.followups.cancel": ["campaigns:write"],
  "campaign.outcomes.list": ["sending:read"],
  "senders.inspect": ["sending:read"],
  "history.list": ["campaigns:read", "sending:read"],
  "pipeline.inspect": ["pipeline:read"],
  "pipeline.cards.list": ["pipeline:read"],
  "pipeline.stage.update": ["pipeline:read", "pipeline:write"],
  "pipeline.note.list": ["pipeline:read"],
  "pipeline.note.add": ["pipeline:read", "pipeline:write"],
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
  "companies.suggest": ["audiences:read"],
  "companies.search": ["audiences:read"],
  "companies.evidence.search": ["audiences:read"],
  "companies.knowledge": ["audiences:read"],
  "companies.evidence.start": ["audiences:read"],
  "companies.evidence.advance": ["audiences:read"],
  "companies.evidence.status": ["audiences:read"],
  "companies.evidence.results": ["audiences:read"],
  "companies.evidence.cancel": ["audiences:read"],
  "company.inspect": ["audiences:read"],
  "companies.fit.start": ["campaigns:read", "audiences:read", "campaigns:write"],
  "companies.fit.advance": ["campaigns:read", "audiences:read", "campaigns:write"],
  "companies.fit.results": ["campaigns:read", "audiences:read"],
  "companies.fit.proposal": ["campaigns:read", "audiences:read"],
  "companies.list.prepare": ["audiences:read", "campaigns:write"],
  "companies.list.inspect": ["campaigns:read", "audiences:read"],
  "companies.list.refine": ["campaigns:read", "campaigns:write"],
  "campaign.operation.inspect": ["campaigns:read"],
  "campaign.delivery.inspect": ["campaigns:read"],
  "campaign.delivery.update": ["campaigns:read", "campaigns:write"],
  "sending.instagram.pacing.inspect": ["sending:read"],
  "sending.instagram.pacing.update": ["sending:read", "campaigns:write"],
  "companies.fit.status": ["campaigns:read", "audiences:read"],
  "companies.fit.cancel": ["campaigns:read", "audiences:read", "campaigns:write"],
  "companies.fit.runs.list": ["campaigns:read", "audiences:read"],
  "companies.fit.run": ["campaigns:read", "audiences:read", "campaigns:write"],
  "companies.fit.cohort": ["campaigns:read", "audiences:read"],
  "copy.performance": ["campaigns:read", "sending:read", "inbox:read", "calendar:read"],
  "calendar.status": ["calendar:read"],
  "calendar.availability": ["calendar:read"],
  "calendar.meeting.book": ["calendar:write", "calendar:read", "inbox:read", "pipeline:write"],
  "calls.list": ["calls:read"],
  "call.inspect": ["calls:read"],
  "instagram.extract.quote": ["leads:read"],
  "instagram.extract.start": ["leads:read", "leads:write"],
  "instagram.extract.inspect": ["leads:read"],
  "instagram.extract.results": ["leads:read"],
  "leads.status": ["leads:read"],
  "leads.extract.quote": ["leads:read"],
  "leads.extract.start": ["leads:read", "leads:write"],
  "leads.extract.inspect": ["leads:read"],
  "leads.extract.refresh": ["leads:read", "leads:write"],
  "leads.extract.continue": ["leads:read", "leads:write"],
  "leads.enrich.preview": ["leads:read"],
  "leads.enrich.start": ["leads:read", "leads:write"],
  "leads.enrich.inspect": ["leads:read"],
  "leads.prospect.quote": ["leads:read", "campaigns:read"],
  "leads.prospect.start": ["leads:read", "campaigns:read", "leads:write", "campaigns:write"],
  "leads.prospect.inspect": ["leads:read", "campaigns:read"],
  "leads.prospect.results": ["leads:read", "campaigns:read"],
  "leads.prospect.advance": ["leads:read", "campaigns:read", "leads:write", "campaigns:write"],
  "leads.prospect.cancel": ["leads:read", "campaigns:read", "leads:write", "campaigns:write"],
} as const;
export const AGENT_OWNER_ONLY_TOOLS = [
  "conversation.update",
  "conversation.reply",
  "campaign.followups.cancel",
  "senders.inspect",
  "pipeline.stage.update",
  "pipeline.note.add",
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
  "companies.fit.start",
  "companies.fit.advance",
  "companies.list.prepare",
  "companies.list.refine",
  "campaign.delivery.update",
  "sending.instagram.pacing.update",
  "companies.fit.cancel",
  "companies.fit.run",
  "calendar.status",
  "calendar.availability",
  "calendar.meeting.book",
  "instagram.extract.quote",
  "instagram.extract.start",
  "instagram.extract.inspect",
  "instagram.extract.results",
  "leads.extract.start",
  "leads.extract.refresh",
  "leads.extract.continue",
  "leads.enrich.preview",
  "leads.enrich.start",
  "leads.enrich.inspect",
  "leads.prospect.start",
  "leads.prospect.advance",
  "leads.prospect.cancel",
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
        "Read saved social copy, delivery, outcomes, and pipeline facts for a campaign identifier returned by DM Faster. Use campaign_copy_inspect for LinkedIn invitation and accepted-message settings.",
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
  "campaign.copy.inspect": {
    mcp: {
      name: "campaign_copy_inspect",
      title: "Inspect campaign copy and LinkedIn sequence",
      description:
        "Read exact saved social opening copy, LinkedIn invitation settings, both sequences and effective accepted-message variants for a campaign identifier returned by DM Faster.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Workspace reads",
      usage: "campaign copy inspect CAMPAIGN_ID",
      command: ["campaign", "copy", "inspect"],
    },
  },
  "sending.inspect": {
    mcp: {
      name: "sending_inspect",
      title: "Inspect sending health",
      description:
        "Read campaign sending health with per-channel eligibility deadlines, remaining seconds, pacing anchors, company-order blockers, and browser freshness. These clocks are earliest possible attempts, not promised deliveries. Inspect observation before calling a quiet queue stalled; null deadlines and stale evidence must stay explicit.",
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
  "conversation.update": {
    mcp: {
      name: "conversation_update",
      title: "Update inbox conversation",
      description:
        "Mark read or unread, close or reopen, snooze, assign, or set interest on one inspected conversation. Echo its updatedAt.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Inbox",
      usage: "conversation update --input FILE",
      command: ["conversation", "update"],
    },
  },
  "conversation.reply": {
    mcp: {
      name: "conversation_reply",
      title: "Send conversation reply",
      description:
        "Send only text explicitly approved by the user for this exact conversation. Echo lastInboundAt and lastMessageAt from inspection, and use a stable idempotency key. Inspect delivery afterward.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cli: {
      section: "Inbox",
      usage: "conversation reply --input FILE",
      command: ["conversation", "reply"],
    },
  },
  "conversation.reply.inspect": {
    mcp: {
      name: "conversation_reply_inspect",
      title: "Inspect reply delivery",
      description: "Check the durable state of a reply by its idempotency key; queued is not sent.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Inbox",
      usage: "conversation reply inspect --input FILE",
      command: ["conversation", "reply", "inspect"],
    },
  },
  "campaign.followups.list": {
    mcp: {
      name: "campaign_followups_list",
      title: "List campaign follow-ups",
      description: "Read upcoming, completed, skipped, or failed follow-ups for one campaign.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Campaigns",
      usage: "campaign followups list --input FILE",
      command: ["campaign", "followups", "list"],
    },
  },
  "campaign.followups.cancel": {
    mcp: {
      name: "campaign_followups_cancel",
      title: "Cancel queued follow-ups",
      description:
        "Stop exact queued follow-up chains using inspected job IDs, campaign version, and a stable idempotency key.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Campaigns",
      usage: "campaign followups cancel --input FILE",
      command: ["campaign", "followups", "cancel"],
    },
  },
  "campaign.outcomes.list": {
    mcp: {
      name: "campaign_outcomes_list",
      title: "List campaign outcomes",
      description: "Read the execution event timeline with reasons and cursor pagination.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Campaigns",
      usage: "campaign outcomes list --input FILE",
      command: ["campaign", "outcomes", "list"],
    },
  },
  "senders.inspect": {
    mcp: {
      name: "senders_inspect",
      title: "Inspect senders",
      description:
        "Read browser and email sender status, health, and the setup URL for manual reconnection.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Campaigns",
      usage: "senders inspect",
      command: ["senders", "inspect"],
    },
  },
  "history.list": {
    mcp: {
      name: "history_list",
      title: "List sent history",
      description: "Page the confirmed sends for one campaign, including channel and target.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Campaigns",
      usage: "history list --input FILE",
      command: ["history", "list"],
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
  "pipeline.cards.list": {
    mcp: {
      name: "pipeline_cards_list",
      title: "List pipeline cards",
      description: "Page campaign pipeline cards by stage, search, or exact entity key.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Pipeline",
      usage: "pipeline cards list --input FILE",
      command: ["pipeline", "cards", "list"],
    },
  },
  "pipeline.stage.update": {
    mcp: {
      name: "pipeline_stage_update",
      title: "Update pipeline stage",
      description: "Change one inspected card using its exact stageKey and expectedStage.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Pipeline",
      usage: "pipeline stage update --input FILE",
      command: ["pipeline", "stage", "update"],
    },
  },
  "pipeline.note.list": {
    mcp: {
      name: "pipeline_note_list",
      title: "List pipeline notes",
      description: "Read up to 100 notes for an exact campaign and pipeline entity.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Pipeline",
      usage: "pipeline note list --input FILE",
      command: ["pipeline", "note", "list"],
    },
  },
  "pipeline.note.add": {
    mcp: {
      name: "pipeline_note_add",
      title: "Add pipeline note",
      description: "Add a note to an exact existing card with a durable idempotency key.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Pipeline",
      usage: "pipeline note add --input FILE",
      command: ["pipeline", "note", "add"],
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
      title: "Update a saved social campaign draft",
      description:
        "Patch social copy, channel toggles, LinkedIn invitation and accepted-message sequence, delivery cap, pacing, or sending window of an existing disabled, unstarted social draft. Echo campaign.inspect updatedAt as expectedCampaignUpdatedAt. Omitted fields are preserved. Stale versions and started campaigns are rejected; saving a window never arms it. Inspect after an uncertain response before retrying. Never creates another campaign, enables sending, or launches.",
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
  "companies.suggest": {
    mcp: {
      name: "companies_suggest",
      title: "Suggest company identities",
      description:
        "Find a few company identities for selection or composer mentions. These are suggestions, not an audience or a complete inventory search. Use companies_search for exact totals.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "B2B company prospecting",
      usage: "companies suggest --input FILE",
      command: ["companies", "suggest"],
    },
  },
  "companies.search": {
    mcp: {
      name: "companies_search",
      title: "Search companies",
      description:
        "Search the same company inventory and filters as the live app. Use projection list for fast prospecting views and company_inspect for full profiles; omit projection for rich rows. Returns an exact total and stable pagination. Echo querySignature and expectedRevision on subsequent pages.",
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
  "companies.evidence.search": {
    mcp: {
      name: "companies_evidence_search",
      title: "Preview website evidence shortlist",
      description:
        "Fast bounded preview only. For every fitting company use companies.evidence.start and companies.evidence.results. Search saved company website passages for arbitrary ICP criteria, preserving seller/service/buyer relationships. Agent-supplied source-language text retrieval with bounded JEV relationship verification. Advertised offerings, portfolio-only evidence, inference and unknown are distinct. Ranked shortlist has no audience total. Echo cursor, querySignature and expectedRevision to continue. Supply Finnish keywords and synonyms per criterion. Original passages allow independent assistant inspection. No OpenAI API or embeddings are required.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "B2B company prospecting",
      usage: "companies evidence search --input FILE",
      command: ["companies", "evidence", "search"],
    },
  },
  "companies.knowledge": {
    mcp: {
      name: "companies_knowledge",
      title: "Read saved public company knowledge",
      description:
        "Read standard public website facts for one current published Finnish company. Returns connected offering-to-buyer relationships and existing boolean assessments. Missing assessments remain null. No website fetch, Jev call or private run access. Quotations are context samples, not selected supporting citations.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "B2B company prospecting",
      usage: "companies knowledge --input FILE",
      command: ["companies", "knowledge"],
    },
  },
  "companies.evidence.start": {
    mcp: {
      name: "companies_evidence_start",
      title: "Start complete website evidence scan",
      description:
        "Start or resume a private complete website-evidence scan of every eligible published company. Preserve the original criteria and deterministic filters. Choose evaluationMode binary for one compact website packet per company with boolean decisions, probability and explicit review/coverage. Empty retrievalTerms are allowed; keywords only prioritize work. Omission preserves the complete passage verifier. Processing continues in the background. The response already contains a first results page, including validated cached matches when available; inspect and show those rows immediately without repeating the page or waiting for completion. Use results for additional pages or later discoveries. Unknown or missing evidence stays unresolved. No OpenAI API or embeddings required.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "B2B company prospecting",
      usage: "companies evidence start --input FILE",
      command: ["companies", "evidence", "start"],
    },
  },
  "companies.evidence.advance": {
    mcp: {
      name: "companies_evidence_advance",
      title: "Advance complete website evidence scan",
      description:
        "Advance bounded chunks of a complete website-evidence scan. Repeated calls never impose a lifetime company or passage limit. Background processing also continues. Echo runId and expectedRevision.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "B2B company prospecting",
      usage: "companies evidence advance --input FILE",
      command: ["companies", "evidence", "advance"],
    },
  },
  "companies.evidence.status": {
    mcp: {
      name: "companies_evidence_status",
      title: "Status complete website evidence scan",
      description:
        "Read exact progress, observed confirmed-match counts and unresolved coverage for a private complete scan. Completion covers the pinned published inventory. Binary packets report any omitted retained passages and require review; uncrawled websites remain unresolved.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "B2B company prospecting",
      usage: "companies evidence status --input FILE",
      command: ["companies", "evidence", "status"],
    },
  },
  "companies.evidence.results": {
    mcp: {
      name: "companies_evidence_results",
      title: "Results complete website evidence scan",
      description:
        "Page all finalized confirmed matches or unresolved companies from a private complete scan. Keep nextCursor even when a partial page is empty; later discoveries are appended in commit order. scanComplete distinguishes a provisional page from final results. Echo runId and expectedRevision.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "B2B company prospecting",
      usage: "companies evidence results --input FILE",
      command: ["companies", "evidence", "results"],
    },
  },
  "companies.evidence.cancel": {
    mcp: {
      name: "companies_evidence_cancel",
      title: "Cancel complete website evidence scan",
      description:
        "Cancel a private website-evidence scan and fence in-flight workers. Repeated cancellation is safe; no campaign or outreach is changed.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "B2B company prospecting",
      usage: "companies evidence cancel --input FILE",
      command: ["companies", "evidence", "cancel"],
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
  "companies.fit.start": {
    mcp: {
      name: "companies_fit_start",
      title: "Start company fit review",
      description:
        "Snapshot a disabled campaign's exact audience for a resumable website-evidence review. Never changes the audience or starts sending.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "B2B company prospecting",
      usage: "companies fit start --input FILE",
      command: ["companies", "fit", "start"],
    },
  },
  "companies.fit.advance": {
    mcp: {
      name: "companies_fit_advance",
      title: "Review next company batch",
      description:
        "Review up to 16 websites in a durable audience run. Repeat until pending and processing are zero; no audience write occurs.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cli: {
      section: "B2B company prospecting",
      usage: "companies fit advance --input FILE",
      command: ["companies", "fit", "advance"],
    },
  },
  "companies.fit.results": {
    mcp: {
      name: "companies_fit_results",
      title: "Inspect company fit evidence",
      description:
        "Read paginated source excerpts, fit reasons, priority, and exact progress for one review run.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "B2B company prospecting",
      usage: "companies fit results --input FILE",
      command: ["companies", "fit", "results"],
    },
  },
  "companies.fit.proposal": {
    mcp: {
      name: "companies_fit_proposal",
      title: "Prepare fit-based audience refinement",
      description:
        "Return exact guarded dry-run input for excluding only high-confidence poor fits. Never changes the campaign.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "B2B company prospecting",
      usage: "companies fit proposal --input FILE",
      command: ["companies", "fit", "proposal"],
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
  "companies.list.refine": {
    mcp: {
      name: "companies_list_refine",
      title: "Refine disabled campaign audience",
      description:
        "Preview reviewed exclusions, then attach a refined copy to a disabled, unstarted campaign. Current versions and exact counts are required. Never starts sending or changes the source list.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "B2B company prospecting",
      usage: "companies list refine --input FILE",
      command: ["companies", "list", "refine"],
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
  "sending.instagram.pacing.inspect": {
    mcp: {
      name: "sending_instagram_pacing_inspect",
      title: "Inspect workspace Instagram sending pace",
      description:
        "Inspect the user-wide Instagram message gap range and its revision. The range covers every campaign and browser; null uses campaign pacing.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Instagram sending pace",
      usage: "sending instagram pacing inspect --input FILE",
      command: ["sending", "instagram", "pacing", "inspect"],
    },
  },
  "sending.instagram.pacing.update": {
    mcp: {
      name: "sending_instagram_pacing_update",
      title: "Change workspace Instagram sending pace",
      description:
        "On the owner's explicit instruction, set a user-wide random Instagram message gap range in seconds, or reset it with policy null. Echo the inspected revision and use a stable idempotency key. The change applies at the next scheduler check across all campaigns and browsers; an in-progress attempt finishes and no campaign is started.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Instagram sending pace",
      usage: "sending instagram pacing update --input FILE",
      command: ["sending", "instagram", "pacing", "update"],
    },
  },
  "companies.fit.status": {
    mcp: {
      name: "companies_fit_status",
      title: "Inspect fit review progress",
      description:
        "Read exact compact progress, resumable run identity, freshness and polling advice.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Agent workflows",
      usage: "companies fit status --input FILE",
      command: ["companies", "fit", "status"],
    },
  },
  "companies.fit.cancel": {
    mcp: {
      name: "companies_fit_cancel",
      title: "Cancel fit review",
      description:
        "Stop new work and fence in-flight results; completed evidence remains readable. Does not change a campaign.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Agent workflows",
      usage: "companies fit cancel --input FILE",
      command: ["companies", "fit", "cancel"],
    },
  },
  "companies.fit.runs.list": {
    mcp: {
      name: "companies_fit_runs_list",
      title: "Find resumable fit reviews",
      description:
        "List recent review identities and exact progress in this workspace; use the returned cursor to continue.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Agent workflows",
      usage: "companies fit runs list --input FILE",
      command: ["companies", "fit", "runs", "list"],
    },
  },
  "companies.fit.run": {
    mcp: {
      name: "companies_fit_run",
      title: "Run a resumable fit review",
      description:
        "Process bounded batches automatically for up to 45 seconds. Resume with the same runId until complete. CLI --until-complete adds bounded retries and backoff. Does not run while every client is disconnected.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Agent workflows",
      usage: "companies fit run --input FILE",
      command: ["companies", "fit", "run"],
    },
  },
  "companies.fit.cohort": {
    mcp: {
      name: "companies_fit_cohort",
      title: "Select a ranked audience cohort",
      description:
        "Return the best requested number of evidenced strong/possible matches, with stable ties and exact guarded refinement input. Unknowns are excluded only as an explicit cohort selection, never labelled poor. Preview and review the selection before applying companies.list.refine.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Agent workflows",
      usage: "companies fit cohort --input FILE",
      command: ["companies", "fit", "cohort"],
    },
  },
  "copy.performance": {
    mcp: {
      name: "copy_performance",
      title: "Find historical outreach copy performance",
      description:
        "Read exact text from confirmed outreach jobs and observed human replies/confirmed calendar bookings. A reply or booking is associated with the first confirmed outreach in its exact conversation; this is observational evidence, not causal lift. Missing deleted job text remains unattributed.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Agent workflows",
      usage: "copy performance --input FILE",
      command: ["copy", "performance"],
    },
  },
  "calendar.status": {
    mcp: {
      name: "calendar_status",
      title: "Inspect calendar connection",
      description:
        "Read connection readiness and provide the existing human OAuth setup destination without exposing tokens.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Agent workflows",
      usage: "calendar status --input FILE",
      command: ["calendar", "status"],
    },
  },
  "calendar.availability": {
    mcp: {
      name: "calendar_availability",
      title: "Find available meeting slots",
      description:
        "Read primary-calendar busy periods and return bounded free slots within an exact window of at most seven days. Availability is an observation; booking checks again.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Agent workflows",
      usage: "calendar availability --input FILE",
      command: ["calendar", "availability"],
    },
  },
  "calendar.meeting.book": {
    mcp: {
      name: "calendar_meeting_book",
      title: "Book a conversation meeting",
      description:
        "On explicit instruction, book exact invitees/time through the existing app booking service, send provider invitations, persist the confirmed meeting, and update its pipeline card. Echo the inspected conversation version. Stable keys reject changed payloads.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cli: {
      section: "Agent workflows",
      usage: "calendar meeting book --input FILE",
      command: ["calendar", "meeting", "book"],
    },
  },
  "calls.list": {
    mcp: {
      name: "calls_list",
      title: "List authorized meetings",
      description:
        "Page meeting records through the app access service. Recorded meetings are separate from inferred pipeline booking labels.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Agent workflows",
      usage: "calls list --input FILE",
      command: ["calls", "list"],
    },
  },
  "call.inspect": {
    mcp: {
      name: "call_inspect",
      title: "Inspect meeting and outcomes",
      description:
        "Read authorized meeting details, participant links and recorded outcomes through the app access service; never infers attendance or sales outcomes.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Agent workflows",
      usage: "call inspect --input FILE",
      command: ["call", "inspect"],
    },
  },
  "instagram.extract.quote": {
    mcp: {
      name: "instagram_extract_quote",
      title: "Quote an Instagram audience extraction",
      description:
        "Read existing prepaid capacity in the signed-in owner's account wallet. Insufficient capacity hands off to separate account-gated standalone checkout and purchase-scoped API/MCP; standalone payment cannot fund or resume an account request. No provider calls or payment.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Instagram extraction",
      usage: "instagram extract quote --input FILE",
      command: ["instagram", "extract", "quote"],
    },
  },
  "instagram.extract.start": {
    mcp: {
      name: "instagram_extract_start",
      title: "Start a prepaid Instagram audience extraction",
      description:
        "Queue a durable extraction using the signed-in owner's prepaid account capacity. Guest purchases use their separate purchase-scoped API/MCP and cannot fund this wallet. No subscription or sending access. Requires a stable idempotency key; no automatic payment.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Instagram extraction",
      usage: "instagram extract start --input FILE",
      command: ["instagram", "extract", "start"],
    },
  },
  "instagram.extract.inspect": {
    mcp: {
      name: "instagram_extract_inspect",
      title: "Inspect a prepaid Instagram extraction",
      description:
        "Read exact stored progress by durable job ID without advancing the provider or spending capacity. Follow pollAfterMs.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Instagram extraction",
      usage: "instagram extract inspect --input FILE",
      command: ["instagram", "extract", "inspect"],
    },
  },
  "instagram.extract.results": {
    mcp: {
      name: "instagram_extract_results",
      title: "Read saved Instagram extraction profiles",
      description:
        "Read a bounded page of usernames, names and profile URLs after terminal settlement. Follow nextCursor until null; partial results are explicit.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Instagram extraction",
      usage: "instagram extract results --input FILE",
      command: ["instagram", "extract", "results"],
    },
  },
  "leads.status": {
    mcp: {
      name: "leads_status",
      title: "Read social prospecting and lead credits",
      description:
        "Read exact credit balance and paginated recent social extractions. When credits are exhausted, show the purchase URL. A page is not the complete history.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Social prospecting",
      usage: "leads status --input FILE",
      command: ["leads", "status"],
    },
  },
  "leads.extract.quote": {
    mcp: {
      name: "leads_extract_quote",
      title: "Estimate a social extraction",
      description:
        "Estimate one credit per saved profile without calling Hiker or spending credits. Followers/following require a positive count; omitting count for likers/commenters requests all available results within the credit balance.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Social prospecting",
      usage: "leads extract quote --input FILE",
      command: ["leads", "extract", "quote"],
    },
  },
  "leads.extract.start": {
    mcp: {
      name: "leads_extract_start",
      title: "Start social prospecting",
      description:
        "On explicit instructions, queue a credit-bounded Instagram followers, following, likers or commenters job. Return promptly with a durable job ID. Reuse the same idempotency key on retries, inspect actual saved results and settled credits, and subscribe to its completion event when the user requests an update. Does not start a campaign or send messages.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Social prospecting",
      usage: "leads extract start --input FILE",
      command: ["leads", "extract", "start"],
    },
  },
  "leads.extract.inspect": {
    mcp: {
      name: "leads_extract_inspect",
      title: "Inspect a social extraction",
      description:
        "Read stored progress by durable job ID without advancing Hiker or spending credits. Distinguish queued acceptance, saved profiles and final settled cost. Follow pollAfterMs if the host does not support completion events.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Social prospecting",
      usage: "leads extract inspect --input FILE",
      command: ["leads", "extract", "inspect"],
    },
  },
  "leads.extract.refresh": {
    mcp: {
      name: "leads_extract_refresh",
      title: "Refresh a social extraction",
      description:
        "Advance only the existing reserved extraction when explicitly requested or its progress is stale. Does not start another paid extraction.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Social prospecting",
      usage: "leads extract refresh --input FILE",
      command: ["leads", "extract", "refresh"],
    },
  },
  "leads.extract.continue": {
    mcp: {
      name: "leads_extract_continue",
      title: "Continue a social extraction",
      description:
        "On explicit instructions, queue the next available page as a separately credit-bounded job. Use its inspected job ID and a new stable idempotency key. Count defaults to the original batch size; no fixed product cap applies.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Social prospecting",
      usage: "leads extract continue --input FILE",
      command: ["leads", "extract", "continue"],
    },
  },
  "leads.enrich.preview": {
    mcp: {
      name: "leads_enrich_preview",
      title: "Estimate social profile enrichment",
      description:
        "Read the current count of missing eligible profiles and its separate credit estimate. Reuses the same list eligibility and pricing as the app. Does not spend credits.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Social prospecting",
      usage: "leads enrich preview --input FILE",
      command: ["leads", "enrich", "preview"],
    },
  },
  "leads.enrich.start": {
    mcp: {
      name: "leads_enrich_start",
      title: "Start social profile enrichment",
      description:
        "On explicit instructions, queue missing-profile enrichment for a saved social prospecting list. One successful enrichment costs one credit; unused credits are returned. An optional instructed maxCredits budget is enforced before charging. Reuse the request key on retry and inspect the durable job ID.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Social prospecting",
      usage: "leads enrich start --input FILE",
      command: ["leads", "enrich", "start"],
    },
  },
  "leads.enrich.inspect": {
    mcp: {
      name: "leads_enrich_inspect",
      title: "Inspect social profile enrichment",
      description:
        "Read exact progress and credit refunds for the specific durable enrichment job. A reservation is not a final charge and an accepted job is not completion.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Social prospecting",
      usage: "leads enrich inspect --input FILE",
      command: ["leads", "enrich", "inspect"],
    },
  },
  "leads.prospect.quote": {
    mcp: {
      name: "leads_prospect_quote",
      title: "Quote an Instagram ICP list",
      description:
        "Read the exact lead balance and bounded acquisition/enrichment budget. No Hiker or Clef calls, credit reservation or list writes.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Social prospecting",
      usage: "leads prospect quote --input FILE",
      command: ["leads", "prospect", "quote"],
    },
  },
  "leads.prospect.start": {
    mcp: {
      name: "leads_prospect_start",
      title: "Build an Instagram ICP list",
      description:
        "On an explicit instruction, discover or reuse Instagram sources, run existing credit-bounded extraction and enrichment, qualify observed evidence with Clef, and save private match and optional review lists. Supply atomic criteria and short searchQueries from the user description for better discovery. Same idempotency key resumes the same immutable request. Does not launch campaigns or send messages.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Social prospecting",
      usage: "leads prospect start --input FILE",
      command: ["leads", "prospect", "start"],
    },
  },
  "leads.prospect.inspect": {
    mcp: {
      name: "leads_prospect_inspect",
      title: "Inspect an Instagram ICP run",
      description:
        "Read exact stored progress, budgets, saved lists and unresolved outcomes. Inspection never advances provider work.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Social prospecting",
      usage: "leads prospect inspect --input FILE",
      command: ["leads", "prospect", "inspect"],
    },
  },
  "leads.prospect.results": {
    mcp: {
      name: "leads_prospect_results",
      title: "Read Instagram ICP decisions",
      description:
        "Page observed profiles, decisions, raw probabilities and image manifests. Review and pending profiles are not verified matches. Cursors bind the exact run revision, result version and status filter; restart pagination after a result change.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Social prospecting",
      usage: "leads prospect results --input FILE",
      command: ["leads", "prospect", "results"],
    },
  },
  "leads.prospect.advance": {
    mcp: {
      name: "leads_prospect_advance",
      title: "Advance an Instagram ICP run",
      description:
        "Advance one bounded batch using the existing run budgets and current owner grant. Provider reservations prevent duplicate requests after unknown outcomes. Continue inspection/advancement until workComplete; no additional campaign approval is introduced.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Social prospecting",
      usage: "leads prospect advance --input FILE",
      command: ["leads", "prospect", "advance"],
    },
  },
  "leads.prospect.cancel": {
    mcp: {
      name: "leads_prospect_cancel",
      title: "Cancel an Instagram ICP run",
      description:
        "Stop future work in this run. In-flight provider or child extraction/enrichment work may complete and settle normally; already saved lists remain private.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cli: {
      section: "Social prospecting",
      usage: "leads prospect cancel --input FILE",
      command: ["leads", "prospect", "cancel"],
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
  "campaign.copy.inspect": {
    $ref: "#/components/schemas/CampaignCopyInspectInput",
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
  "conversation.update": {
    $ref: "#/components/schemas/ConversationUpdateInput",
  },
  "conversation.reply": {
    $ref: "#/components/schemas/ConversationReplyInput",
  },
  "conversation.reply.inspect": {
    $ref: "#/components/schemas/ConversationReplyInspectInput",
  },
  "campaign.followups.list": {
    $ref: "#/components/schemas/CampaignFollowupsListInput",
  },
  "campaign.followups.cancel": {
    $ref: "#/components/schemas/CampaignFollowupsCancelInput",
  },
  "campaign.outcomes.list": {
    $ref: "#/components/schemas/CampaignOutcomesListInput",
  },
  "senders.inspect": {
    $ref: "#/components/schemas/WorkspaceBriefingInput",
  },
  "history.list": {
    $ref: "#/components/schemas/HistoryListInput",
  },
  "pipeline.inspect": {
    $ref: "#/components/schemas/PipelineInspectInput",
  },
  "pipeline.cards.list": {
    $ref: "#/components/schemas/PipelineCardsListInput",
  },
  "pipeline.stage.update": {
    $ref: "#/components/schemas/PipelineStageUpdateInput",
  },
  "pipeline.note.list": {
    $ref: "#/components/schemas/PipelineNoteListInput",
  },
  "pipeline.note.add": {
    $ref: "#/components/schemas/PipelineNoteAddInput",
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
  "companies.suggest": {
    $ref: "#/components/schemas/CompanySuggestionsInput",
  },
  "companies.search": {
    $ref: "#/components/schemas/CompanySearchInput",
  },
  "companies.evidence.search": {
    $ref: "#/components/schemas/CompanyEvidenceSearchInput",
  },
  "companies.knowledge": {
    $ref: "#/components/schemas/CompanyKnowledgeInput",
  },
  "companies.evidence.start": {
    $ref: "#/components/schemas/CompanyEvidenceStartInput",
  },
  "companies.evidence.advance": {
    $ref: "#/components/schemas/CompanyEvidenceAdvanceInput",
  },
  "companies.evidence.status": {
    $ref: "#/components/schemas/CompanyEvidenceStatusInput",
  },
  "companies.evidence.results": {
    $ref: "#/components/schemas/CompanyEvidenceResultsInput",
  },
  "companies.evidence.cancel": {
    $ref: "#/components/schemas/CompanyEvidenceCancelInput",
  },
  "company.inspect": {
    $ref: "#/components/schemas/CompanyInspectInput",
  },
  "companies.fit.start": {
    $ref: "#/components/schemas/CompanyFitStartInput",
  },
  "companies.fit.advance": {
    $ref: "#/components/schemas/CompanyFitAdvanceInput",
  },
  "companies.fit.results": {
    $ref: "#/components/schemas/CompanyFitResultsInput",
  },
  "companies.fit.proposal": {
    $ref: "#/components/schemas/CompanyFitProposalInput",
  },
  "companies.list.prepare": {
    $ref: "#/components/schemas/CompanyListPrepareInput",
  },
  "companies.list.inspect": {
    $ref: "#/components/schemas/CompanyListInspectInput",
  },
  "companies.list.refine": {
    $ref: "#/components/schemas/CompanyListRefineInput",
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
  "sending.instagram.pacing.inspect": {
    $ref: "#/components/schemas/InstagramPacingInspectInput",
  },
  "sending.instagram.pacing.update": {
    $ref: "#/components/schemas/InstagramPacingUpdateInput",
  },
  "companies.fit.status": {
    $ref: "#/components/schemas/CompanyFitStatusInput",
  },
  "companies.fit.cancel": {
    $ref: "#/components/schemas/CompanyFitCancelInput",
  },
  "companies.fit.runs.list": {
    $ref: "#/components/schemas/CompanyFitRunsListInput",
  },
  "companies.fit.run": {
    $ref: "#/components/schemas/CompanyFitRunInput",
  },
  "companies.fit.cohort": {
    $ref: "#/components/schemas/CompanyFitCohortInput",
  },
  "copy.performance": {
    $ref: "#/components/schemas/CopyPerformanceInput",
  },
  "calendar.status": {
    $ref: "#/components/schemas/CalendarStatusInput",
  },
  "calendar.availability": {
    $ref: "#/components/schemas/CalendarAvailabilityInput",
  },
  "calendar.meeting.book": {
    $ref: "#/components/schemas/CalendarMeetingBookInput",
  },
  "calls.list": {
    $ref: "#/components/schemas/CallsListInput",
  },
  "call.inspect": {
    $ref: "#/components/schemas/CallInspectInput",
  },
  "instagram.extract.quote": {
    $ref: "#/components/schemas/InstagramExtractionQuoteInput",
  },
  "instagram.extract.start": {
    $ref: "#/components/schemas/InstagramExtractionStartInput",
  },
  "instagram.extract.inspect": {
    $ref: "#/components/schemas/InstagramExtractionInspectInput",
  },
  "instagram.extract.results": {
    $ref: "#/components/schemas/InstagramExtractionResultsInput",
  },
  "leads.status": {
    $ref: "#/components/schemas/LeadsStatusInput",
  },
  "leads.extract.quote": {
    $ref: "#/components/schemas/LeadExtractionQuoteInput",
  },
  "leads.extract.start": {
    $ref: "#/components/schemas/LeadExtractionStartInput",
  },
  "leads.extract.inspect": {
    $ref: "#/components/schemas/LeadExtractionInspectInput",
  },
  "leads.extract.refresh": {
    $ref: "#/components/schemas/LeadExtractionRefreshInput",
  },
  "leads.extract.continue": {
    $ref: "#/components/schemas/LeadExtractionContinueInput",
  },
  "leads.enrich.preview": {
    $ref: "#/components/schemas/LeadEnrichmentPreviewInput",
  },
  "leads.enrich.start": {
    $ref: "#/components/schemas/LeadEnrichmentStartInput",
  },
  "leads.enrich.inspect": {
    $ref: "#/components/schemas/LeadEnrichmentInspectInput",
  },
  "leads.prospect.quote": {
    $ref: "#/components/schemas/InstagramProspectInput",
  },
  "leads.prospect.start": {
    $ref: "#/components/schemas/InstagramProspectStartInput",
  },
  "leads.prospect.inspect": {
    $ref: "#/components/schemas/InstagramProspectRunInput",
  },
  "leads.prospect.results": {
    $ref: "#/components/schemas/InstagramProspectResultsInput",
  },
  "leads.prospect.advance": {
    $ref: "#/components/schemas/InstagramProspectRunInput",
  },
  "leads.prospect.cancel": {
    $ref: "#/components/schemas/InstagramProspectRunInput",
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
  CampaignCopyInspectInput: {
    type: "object",
    additionalProperties: false,
    required: ["campaignId"],
    properties: {
      campaignId: {
        $ref: "#/components/schemas/ResourceId",
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
  ConversationUpdateInput: {
    type: "object",
    additionalProperties: false,
    required: ["conversationId", "expectedUpdatedAt", "action"],
    properties: {
      conversationId: {
        $ref: "#/components/schemas/ResourceId",
      },
      expectedUpdatedAt: {
        $ref: "#/components/schemas/ResourceVersion",
      },
      action: {
        type: "string",
        enum: [
          "mark_read",
          "mark_unread",
          "close",
          "reopen",
          "snooze",
          "unsnooze",
          "assign_to_me",
          "unassign",
          "set_interest",
        ],
      },
      snoozedUntil: {
        $ref: "#/components/schemas/ResourceVersion",
      },
      interestLevel: {
        type: "string",
        enum: ["positive", "neutral", "negative"],
      },
      interestIntent: {
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
    },
  },
  ResourceVersion: {
    type: "string",
    pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d{1,6})?Z$",
    minLength: 20,
    maxLength: 27,
  },
  ConversationReplyInput: {
    type: "object",
    additionalProperties: false,
    required: [
      "conversationId",
      "expectedLastInboundAt",
      "expectedLastMessageAt",
      "text",
      "idempotencyKey",
    ],
    properties: {
      conversationId: {
        $ref: "#/components/schemas/ResourceId",
      },
      expectedLastInboundAt: {
        $ref: "#/components/schemas/ResourceVersion",
      },
      expectedLastMessageAt: {
        $ref: "#/components/schemas/ResourceVersion",
      },
      text: {
        type: "string",
        minLength: 1,
        maxLength: 10000,
      },
      idempotencyKey: {
        type: "string",
        minLength: 8,
        maxLength: 160,
        pattern: "^[a-zA-Z0-9_-]+$",
      },
    },
  },
  ConversationReplyInspectInput: {
    type: "object",
    additionalProperties: false,
    required: ["idempotencyKey"],
    properties: {
      idempotencyKey: {
        type: "string",
        minLength: 8,
        maxLength: 160,
        pattern: "^[a-zA-Z0-9_-]+$",
      },
    },
  },
  CampaignFollowupsListInput: {
    type: "object",
    additionalProperties: false,
    required: ["campaignId"],
    properties: {
      campaignId: {
        $ref: "#/components/schemas/ResourceId",
      },
      view: {
        type: "string",
        enum: ["upcoming", "done"],
      },
      cursor: {
        type: "string",
        minLength: 1,
        maxLength: 512,
      },
    },
  },
  CampaignFollowupsCancelInput: {
    type: "object",
    additionalProperties: false,
    required: ["campaignId", "expectedCampaignUpdatedAt", "jobIds", "idempotencyKey"],
    properties: {
      campaignId: {
        $ref: "#/components/schemas/ResourceId",
      },
      expectedCampaignUpdatedAt: {
        $ref: "#/components/schemas/ResourceVersion",
      },
      jobIds: {
        type: "array",
        minItems: 1,
        maxItems: 50,
        items: {
          $ref: "#/components/schemas/ResourceId",
        },
      },
      idempotencyKey: {
        type: "string",
        minLength: 8,
        maxLength: 160,
        pattern: "^[a-zA-Z0-9._:-]+$",
      },
    },
  },
  CampaignOutcomesListInput: {
    type: "object",
    additionalProperties: false,
    required: ["campaignId"],
    properties: {
      campaignId: {
        $ref: "#/components/schemas/ResourceId",
      },
      cursor: {
        type: "string",
        minLength: 1,
        maxLength: 512,
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: 100,
      },
    },
  },
  HistoryListInput: {
    type: "object",
    additionalProperties: false,
    required: ["campaignId"],
    properties: {
      campaignId: {
        $ref: "#/components/schemas/ResourceId",
      },
      cursor: {
        type: "string",
        minLength: 1,
        maxLength: 512,
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: 100,
      },
      search: {
        type: "string",
        minLength: 3,
        maxLength: 120,
      },
    },
  },
  PipelineInspectInput: {
    $ref: "#/components/schemas/OptionalCampaignInput",
  },
  PipelineCardsListInput: {
    type: "object",
    additionalProperties: false,
    required: ["campaignId", "stage"],
    properties: {
      campaignId: {
        $ref: "#/components/schemas/ResourceId",
      },
      stage: {
        $ref: "#/components/schemas/PipelineStage",
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: 15,
      },
      cursor: {
        type: "string",
        minLength: 1,
        maxLength: 4000,
      },
      query: {
        type: "string",
        minLength: 1,
        maxLength: 120,
      },
      entityKey: {
        type: "string",
        minLength: 1,
        maxLength: 320,
      },
    },
  },
  PipelineStage: {
    type: "string",
    enum: ["contacted", "replied", "call_booked", "closed"],
  },
  PipelineStageUpdateInput: {
    type: "object",
    additionalProperties: false,
    required: ["campaignId", "entityKey", "stageKey", "expectedStage", "stage"],
    properties: {
      campaignId: {
        $ref: "#/components/schemas/ResourceId",
      },
      entityKey: {
        type: "string",
        minLength: 1,
        maxLength: 320,
      },
      stageKey: {
        type: "string",
        minLength: 1,
        maxLength: 500,
      },
      expectedStage: {
        $ref: "#/components/schemas/PipelineStage",
      },
      stage: {
        $ref: "#/components/schemas/PipelineStage",
      },
    },
  },
  PipelineNoteListInput: {
    type: "object",
    additionalProperties: false,
    required: ["campaignId", "entityKey"],
    properties: {
      campaignId: {
        $ref: "#/components/schemas/ResourceId",
      },
      entityKey: {
        type: "string",
        minLength: 1,
        maxLength: 320,
      },
    },
  },
  PipelineNoteAddInput: {
    type: "object",
    additionalProperties: false,
    required: ["campaignId", "entityKey", "body", "idempotencyKey"],
    properties: {
      campaignId: {
        $ref: "#/components/schemas/ResourceId",
      },
      entityKey: {
        type: "string",
        minLength: 1,
        maxLength: 320,
      },
      body: {
        type: "string",
        minLength: 1,
        maxLength: 2000,
      },
      idempotencyKey: {
        type: "string",
        minLength: 8,
        maxLength: 160,
        pattern: "^[a-zA-Z0-9._:-]+$",
      },
    },
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
          description: {
            type: "string",
            maxLength: 1000,
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
          instagramEnabled: {
            type: "boolean",
          },
          facebookEnabled: {
            type: "boolean",
          },
          linkedinEnabled: {
            type: "boolean",
          },
          linkedinInviteMode: {
            type: "string",
            enum: ["invite_only", "invite_with_note"],
          },
          linkedinInviteNote: {
            type: "string",
            maxLength: 300,
          },
          followUpSequence: {
            description:
              "Shared social follow-ups, or the accepted-message sequence for a LinkedIn-only campaign.",
            $ref: "#/components/schemas/CampaignFollowUpSequenceInput",
          },
          linkedinFollowUpSequence: {
            description:
              "For a mixed-channel campaign, step 1 is the message sent as soon as acceptance is verified, including an already-connected prospect. The required delayDays on step 1 does not delay that first message. Step 2, if present, uses its delayDays. A known human reply on another channel suppresses unsent LinkedIn steps.",
            $ref: "#/components/schemas/LinkedinFollowUpSequenceInput",
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
  CampaignFollowUpSequenceInput: {
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
          $ref: "#/components/schemas/CampaignFollowUpStepInput",
        },
      },
    },
  },
  CampaignFollowUpStepInput: {
    type: "object",
    additionalProperties: false,
    required: ["delayDays", "channel", "variants"],
    properties: {
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
        maxLength: 500,
      },
      variants: {
        type: "array",
        minItems: 1,
        maxItems: 4,
        items: {
          type: "string",
          minLength: 1,
          maxLength: 1000,
        },
      },
    },
  },
  LinkedinFollowUpSequenceInput: {
    type: "object",
    additionalProperties: false,
    required: ["enabled", "steps"],
    properties: {
      enabled: {
        type: "boolean",
      },
      steps: {
        type: "array",
        maxItems: 2,
        items: {
          $ref: "#/components/schemas/CampaignFollowUpStepInput",
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
  CompanySuggestionsInput: {
    type: "object",
    additionalProperties: false,
    required: ["query", "countries"],
    properties: {
      query: {
        type: "string",
        minLength: 2,
        maxLength: 120,
      },
      countries: {
        type: "array",
        minItems: 1,
        maxItems: 32,
        items: {
          $ref: "#/components/schemas/SupportedCountry",
        },
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: 10,
      },
    },
  },
  CompanySearchInput: {
    type: "object",
    additionalProperties: false,
    properties: {
      filters: {
        $ref: "#/components/schemas/CompanySearchFilters",
      },
      projection: {
        type: "string",
        enum: ["list", "rich"],
        description:
          "List returns the compact app row and flat primary contact fields. Rich preserves contact arrays and is the default. Full profiles remain available through company.inspect.",
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
        description:
          "Match any selected technology within each technology subsection and every selected subsection. Country picker options require at least 50 active companies; explicit saved criteria remain executable.",
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
  CompanyEvidenceSearchInput: {
    type: "object",
    additionalProperties: false,
    properties: {
      country: {
        type: "string",
        enum: ["FI"],
      },
      query: {
        type: "string",
        minLength: 1,
        maxLength: 1500,
      },
      criteria: {
        type: "array",
        items: {
          $ref: "#/components/schemas/WebsiteEvidenceCriterion",
        },
        minItems: 1,
        maxItems: 4,
      },
      filters: {
        $ref: "#/components/schemas/CompanySearchFilters",
        description:
          "Optional deterministic Companies app filters, applied before text candidate limits. Country must remain FI. Numeric and registry constraints use company data, not website judgments.",
      },
      includePassages: {
        type: "boolean",
        description:
          "Include up to six full original retrieval contexts per company. By default verified quotes are returned with each judgment, and unknown-only companies retain one original context for inspection.",
      },
      candidateLimit: {
        type: "integer",
        minimum: 1,
        maximum: 30,
      },
      pageSize: {
        type: "integer",
        minimum: 1,
        maximum: 20,
      },
      maxAgeDays: {
        type: "integer",
        minimum: 1,
        maximum: 90,
      },
      cursor: {
        type: "string",
        minLength: 1,
        maxLength: 200,
      },
      expectedRevision: {
        type: "string",
        minLength: 1,
        maxLength: 200,
      },
      querySignature: {
        type: "string",
        minLength: 1,
        maxLength: 200,
      },
    },
    required: ["country", "query", "criteria"],
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
  CompanyKnowledgeInput: {
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
      maxAgeDays: {
        type: "integer",
        minimum: 1,
        maximum: 90,
      },
    },
    required: ["country", "businessId"],
  },
  CompanyEvidenceStartInput: {
    type: "object",
    additionalProperties: false,
    properties: {
      country: {
        type: "string",
        enum: ["FI"],
      },
      query: {
        type: "string",
        minLength: 1,
        maxLength: 1500,
      },
      criteria: {
        type: "array",
        minItems: 1,
        maxItems: 4,
        items: {
          $ref: "#/components/schemas/WebsiteEvidenceCriterion",
        },
      },
      evaluationMode: {
        type: "string",
        enum: ["binary", "passage"],
        description:
          "Binary evaluates related website sections together in one compact request per company. Passage preserves separate relationship statuses and explicit-denial merging. Omission preserves passage behavior.",
      },
      filters: {
        $ref: "#/components/schemas/CompanySearchFilters",
      },
      maxAgeDays: {
        type: "integer",
        minimum: 1,
        maximum: 90,
      },
      idempotencyKey: {
        type: "string",
        minLength: 1,
        maxLength: 100,
      },
    },
    required: ["country", "query", "criteria", "idempotencyKey"],
  },
  CompanyEvidenceAdvanceInput: {
    type: "object",
    additionalProperties: false,
    properties: {
      runId: {
        type: "string",
        minLength: 36,
        maxLength: 36,
      },
      expectedRevision: {
        type: "string",
        minLength: 64,
        maxLength: 64,
      },
      batchSize: {
        type: "integer",
        minimum: 1,
        maximum: 16,
      },
    },
    required: ["runId", "expectedRevision"],
  },
  CompanyEvidenceStatusInput: {
    type: "object",
    additionalProperties: false,
    properties: {
      runId: {
        type: "string",
        minLength: 36,
        maxLength: 36,
      },
      expectedRevision: {
        type: "string",
        minLength: 64,
        maxLength: 64,
      },
    },
    required: ["runId", "expectedRevision"],
  },
  CompanyEvidenceResultsInput: {
    type: "object",
    additionalProperties: false,
    properties: {
      runId: {
        type: "string",
        minLength: 36,
        maxLength: 36,
      },
      expectedRevision: {
        type: "string",
        minLength: 64,
        maxLength: 64,
      },
      cursor: {
        type: "string",
        minLength: 1,
        maxLength: 200,
      },
      pageSize: {
        type: "integer",
        minimum: 1,
        maximum: 20,
      },
      view: {
        type: "string",
        enum: ["matches", "unresolved", "all"],
      },
    },
    required: ["runId", "expectedRevision"],
  },
  CompanyEvidenceCancelInput: {
    type: "object",
    additionalProperties: false,
    properties: {
      runId: {
        type: "string",
        minLength: 36,
        maxLength: 36,
      },
      expectedRevision: {
        type: "string",
        minLength: 64,
        maxLength: 64,
      },
    },
    required: ["runId", "expectedRevision"],
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
  CompanyFitStartInput: {
    type: "object",
    additionalProperties: false,
    required: [
      "campaignId",
      "listId",
      "expectedCampaignUpdatedAt",
      "expectedListUpdatedAt",
      "expectedTotal",
      "expectedTargetCount",
      "offer",
      "idempotencyKey",
    ],
    properties: {
      campaignId: {
        $ref: "#/components/schemas/ResourceId",
      },
      listId: {
        $ref: "#/components/schemas/ResourceId",
      },
      expectedCampaignUpdatedAt: {
        type: "string",
        minLength: 20,
        maxLength: 40,
      },
      expectedListUpdatedAt: {
        type: "string",
        minLength: 20,
        maxLength: 40,
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
      offer: {
        type: "string",
        minLength: 20,
        maxLength: 500,
        description: "What B2B appointment-setting service is being sold to these companies.",
      },
      refreshEvidence: {
        type: "boolean",
        description: "Ignore recent evidence from the same workspace and fetch websites anew.",
      },
      idempotencyKey: {
        $ref: "#/components/schemas/IdempotencyKey",
      },
      maxPages: {
        type: "integer",
        minimum: 2,
        maximum: 5,
        description:
          "Maximum official website pages per company, excluding robots; defaults to 2. Each company has a 20-second fetch budget.",
      },
      unknownsFromRunId: {
        $ref: "#/components/schemas/ResourceId",
        description:
          "Review only unknowns from this completed, recent run; carry forward its other assessments only for the same offer, website and exact audience.",
      },
    },
  },
  CompanyFitAdvanceInput: {
    type: "object",
    additionalProperties: false,
    required: ["runId"],
    properties: {
      runId: {
        $ref: "#/components/schemas/ResourceId",
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: 16,
      },
    },
  },
  CompanyFitResultsInput: {
    type: "object",
    additionalProperties: false,
    required: ["runId"],
    properties: {
      runId: {
        $ref: "#/components/schemas/ResourceId",
      },
      tier: {
        type: "string",
        enum: ["strong", "possible", "poor", "unknown"],
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
      sort: {
        type: "string",
        enum: ["priority", "audience"],
      },
      expectedComplete: {
        type: "integer",
        minimum: 0,
        maximum: 25000,
        description:
          "Echo progress.complete from the first page when continuing so advancing runs cannot shift pages.",
      },
      expectedVersion: {
        type: "string",
        minLength: 64,
        maxLength: 64,
      },
      includeEvidence: {
        type: "boolean",
        description:
          "Defaults to true. False returns compact fit reasons with empty evidence arrays; fetch full evidence before an audience review.",
      },
    },
  },
  CompanyFitProposalInput: {
    type: "object",
    additionalProperties: false,
    required: ["runId"],
    properties: {
      runId: {
        $ref: "#/components/schemas/ResourceId",
      },
    },
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
      listId: {
        $ref: "#/components/schemas/ResourceId",
      },
      campaignId: {
        $ref: "#/components/schemas/ResourceId",
      },
      expectedListUpdatedAt: {
        type: "string",
        minLength: 20,
        maxLength: 40,
      },
      expectedCampaignUpdatedAt: {
        type: "string",
        minLength: 20,
        maxLength: 40,
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
              $ref: "#/components/schemas/SupportedCountry",
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
              $ref: "#/components/schemas/SupportedCountry",
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
        $ref: "#/components/schemas/IdempotencyKey",
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
  InstagramPacingInspectInput: {
    type: "object",
    additionalProperties: false,
    properties: {},
  },
  InstagramPacingUpdateInput: {
    type: "object",
    additionalProperties: false,
    required: ["expectedRevision", "idempotencyKey", "policy", "reason"],
    properties: {
      expectedRevision: {
        type: ["string", "null"],
        pattern:
          "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[1-8][a-fA-F0-9]{3}-[89abAB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}$",
      },
      idempotencyKey: {
        type: "string",
        minLength: 1,
        maxLength: 160,
        pattern: "^[A-Za-z0-9._:-]+$",
      },
      reason: {
        type: "string",
        minLength: 3,
        maxLength: 500,
      },
      policy: {
        oneOf: [
          {
            $ref: "#/components/schemas/InstagramPacingPolicy",
          },
          {
            type: "null",
          },
        ],
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
  CompanyFitStatusInput: {
    type: "object",
    additionalProperties: false,
    required: ["runId"],
    properties: {
      runId: {
        $ref: "#/components/schemas/ResourceId",
      },
    },
  },
  CompanyFitCancelInput: {
    type: "object",
    additionalProperties: false,
    required: ["runId"],
    properties: {
      runId: {
        $ref: "#/components/schemas/ResourceId",
      },
    },
  },
  CompanyFitRunsListInput: {
    type: "object",
    additionalProperties: false,
    required: [],
    properties: {
      campaignId: {
        $ref: "#/components/schemas/ResourceId",
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: 25,
      },
      before: {
        $ref: "#/components/schemas/CompanyFitRunCursor",
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
        $ref: "#/components/schemas/ResourceId",
      },
    },
  },
  CompanyFitRunInput: {
    type: "object",
    additionalProperties: false,
    required: ["runId"],
    properties: {
      runId: {
        $ref: "#/components/schemas/ResourceId",
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: 8,
      },
    },
  },
  CompanyFitCohortInput: {
    type: "object",
    additionalProperties: false,
    required: ["runId", "expectedVersion", "take"],
    properties: {
      runId: {
        $ref: "#/components/schemas/ResourceId",
      },
      expectedVersion: {
        type: "string",
        minLength: 64,
        maxLength: 64,
      },
      take: {
        type: "integer",
        minimum: 1,
        maximum: 1000,
      },
      minimumPriority: {
        type: "integer",
        minimum: 1,
        maximum: 100,
      },
    },
  },
  CopyPerformanceInput: {
    type: "object",
    additionalProperties: false,
    required: ["from", "to"],
    properties: {
      campaignId: {
        $ref: "#/components/schemas/ResourceId",
      },
      from: {
        type: "string",
        minLength: 20,
        maxLength: 40,
      },
      to: {
        type: "string",
        minLength: 20,
        maxLength: 40,
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
  CalendarStatusInput: {
    type: "object",
    additionalProperties: false,
    required: [],
    properties: {},
  },
  CalendarAvailabilityInput: {
    type: "object",
    additionalProperties: false,
    required: ["from", "to", "timezone", "durationMinutes"],
    properties: {
      from: {
        type: "string",
        minLength: 20,
        maxLength: 40,
      },
      to: {
        type: "string",
        minLength: 20,
        maxLength: 40,
      },
      timezone: {
        type: "string",
        minLength: 1,
        maxLength: 80,
      },
      durationMinutes: {
        type: "integer",
        enum: [15, 30, 45, 60, 90, 120],
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: 100,
      },
    },
  },
  CalendarMeetingBookInput: {
    type: "object",
    additionalProperties: false,
    required: [
      "conversationId",
      "expectedConversationUpdatedAt",
      "idempotencyKey",
      "title",
      "start",
      "timezone",
      "durationMinutes",
      "attendees",
    ],
    properties: {
      conversationId: {
        $ref: "#/components/schemas/ResourceId",
      },
      expectedConversationUpdatedAt: {
        type: "string",
        minLength: 20,
        maxLength: 40,
      },
      idempotencyKey: {
        type: "string",
        minLength: 8,
        maxLength: 120,
        pattern: "^[a-zA-Z0-9_-]{8,120}$",
      },
      title: {
        type: "string",
        minLength: 1,
        maxLength: 200,
      },
      start: {
        type: "string",
        minLength: 20,
        maxLength: 40,
      },
      timezone: {
        type: "string",
        minLength: 1,
        maxLength: 80,
      },
      durationMinutes: {
        type: "integer",
        enum: [15, 30, 45, 60, 90, 120],
      },
      attendees: {
        type: "array",
        items: {
          type: "string",
          minLength: 3,
          maxLength: 320,
          pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
        },
        maxItems: 20,
        minItems: 1,
      },
    },
  },
  CallsListInput: {
    type: "object",
    additionalProperties: false,
    required: [],
    properties: {
      offset: {
        type: "integer",
        minimum: 0,
        maximum: 1000000,
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: 50,
      },
    },
  },
  CallInspectInput: {
    type: "object",
    additionalProperties: false,
    required: ["meetingId"],
    properties: {
      meetingId: {
        $ref: "#/components/schemas/ResourceId",
      },
    },
  },
  InstagramExtractionQuoteInput: {
    type: "object",
    additionalProperties: false,
    required: ["username", "type", "count"],
    properties: {
      username: {
        type: "string",
        minLength: 1,
        maxLength: 31,
        pattern: "^@?[A-Za-z0-9._]{1,30}$",
        "x-dmfaster-trim": true,
      },
      type: {
        type: "string",
        enum: ["followers", "following", "likers", "commenters"],
      },
      count: {
        type: "integer",
        minimum: 1,
        maximum: 2147483647,
      },
      currency: {
        type: "string",
        enum: ["USD", "EUR"],
      },
      postUrl: {
        type: "string",
        minLength: 1,
        maxLength: 300,
        "x-dmfaster-trim": true,
      },
    },
  },
  InstagramExtractionStartInput: {
    type: "object",
    additionalProperties: false,
    required: ["username", "type", "count", "idempotencyKey"],
    properties: {
      username: {
        type: "string",
        minLength: 1,
        maxLength: 31,
        pattern: "^@?[A-Za-z0-9._]{1,30}$",
        "x-dmfaster-trim": true,
      },
      type: {
        type: "string",
        enum: ["followers", "following", "likers", "commenters"],
      },
      count: {
        type: "integer",
        minimum: 1,
        maximum: 2147483647,
      },
      currency: {
        type: "string",
        enum: ["USD", "EUR"],
      },
      postUrl: {
        type: "string",
        minLength: 1,
        maxLength: 300,
        "x-dmfaster-trim": true,
      },
      idempotencyKey: {
        type: "string",
        minLength: 1,
        maxLength: 160,
        pattern: "^[A-Za-z0-9._:-]{1,160}$",
        "x-dmfaster-trim": true,
      },
    },
  },
  InstagramExtractionInspectInput: {
    type: "object",
    additionalProperties: false,
    required: ["jobId"],
    properties: {
      jobId: {
        $ref: "#/components/schemas/ResourceId",
      },
    },
  },
  InstagramExtractionResultsInput: {
    type: "object",
    additionalProperties: false,
    required: ["jobId"],
    properties: {
      jobId: {
        $ref: "#/components/schemas/ResourceId",
      },
      cursor: {
        type: "string",
        minLength: 1,
        maxLength: 30,
        pattern: "^[A-Za-z0-9._]+$",
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: 100,
      },
    },
  },
  LeadsStatusInput: {
    type: "object",
    additionalProperties: false,
    required: [],
    properties: {
      cursor: {
        type: "string",
        minLength: 1,
        maxLength: 1000,
        "x-dmfaster-trim": true,
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: 50,
      },
    },
  },
  LeadExtractionQuoteInput: {
    type: "object",
    additionalProperties: false,
    required: ["type", "identifier"],
    properties: {
      type: {
        type: "string",
        enum: ["followers", "following", "likers", "commenters"],
      },
      identifier: {
        type: "string",
        minLength: 1,
        maxLength: 300,
        "x-dmfaster-trim": true,
      },
      count: {
        type: "integer",
        minimum: 1,
        maximum: 2147483647,
      },
      postUrls: {
        type: "array",
        minItems: 1,
        items: {
          type: "string",
          minLength: 1,
          maxLength: 300,
          "x-dmfaster-trim": true,
        },
      },
      priority: {
        type: "string",
        enum: ["high", "normal", "low"],
      },
      feedType: {
        type: "string",
        enum: ["top", "recent"],
      },
    },
  },
  LeadExtractionStartInput: {
    type: "object",
    additionalProperties: false,
    required: ["type", "identifier", "idempotencyKey"],
    properties: {
      type: {
        type: "string",
        enum: ["followers", "following", "likers", "commenters"],
      },
      identifier: {
        type: "string",
        minLength: 1,
        maxLength: 300,
        "x-dmfaster-trim": true,
      },
      count: {
        type: "integer",
        minimum: 1,
        maximum: 2147483647,
      },
      postUrls: {
        type: "array",
        minItems: 1,
        items: {
          type: "string",
          minLength: 1,
          maxLength: 300,
          "x-dmfaster-trim": true,
        },
      },
      priority: {
        type: "string",
        enum: ["high", "normal", "low"],
      },
      feedType: {
        type: "string",
        enum: ["top", "recent"],
      },
      idempotencyKey: {
        type: "string",
        minLength: 1,
        maxLength: 160,
        "x-dmfaster-trim": true,
        pattern: "^[A-Za-z0-9._:-]{1,160}$",
      },
    },
  },
  LeadExtractionInspectInput: {
    type: "object",
    additionalProperties: false,
    required: ["jobId"],
    properties: {
      jobId: {
        $ref: "#/components/schemas/ResourceId",
      },
    },
  },
  LeadExtractionRefreshInput: {
    type: "object",
    additionalProperties: false,
    required: ["jobId"],
    properties: {
      jobId: {
        $ref: "#/components/schemas/ResourceId",
      },
    },
  },
  LeadExtractionContinueInput: {
    type: "object",
    additionalProperties: false,
    required: ["jobId", "idempotencyKey"],
    properties: {
      jobId: {
        $ref: "#/components/schemas/ResourceId",
      },
      count: {
        type: "integer",
        minimum: 1,
        maximum: 2147483647,
      },
      idempotencyKey: {
        type: "string",
        minLength: 1,
        maxLength: 160,
        "x-dmfaster-trim": true,
        pattern: "^[A-Za-z0-9._:-]{1,160}$",
      },
    },
  },
  LeadEnrichmentPreviewInput: {
    type: "object",
    additionalProperties: false,
    required: ["listId"],
    properties: {
      listId: {
        $ref: "#/components/schemas/ResourceId",
      },
    },
  },
  LeadEnrichmentStartInput: {
    type: "object",
    additionalProperties: false,
    required: ["listId", "idempotencyKey"],
    properties: {
      listId: {
        $ref: "#/components/schemas/ResourceId",
      },
      maxCredits: {
        type: "integer",
        minimum: 0,
        maximum: 2147483647,
      },
      idempotencyKey: {
        type: "string",
        minLength: 1,
        maxLength: 160,
        "x-dmfaster-trim": true,
        pattern: "^[A-Za-z0-9._:-]{1,160}$",
      },
    },
  },
  LeadEnrichmentInspectInput: {
    type: "object",
    additionalProperties: false,
    required: ["jobId"],
    properties: {
      jobId: {
        $ref: "#/components/schemas/ResourceId",
      },
    },
  },
  InstagramProspectInput: {
    type: "object",
    additionalProperties: false,
    required: ["query"],
    properties: {
      query: {
        type: "string",
        minLength: 1,
        maxLength: 4000,
      },
      criteria: {
        type: "array",
        minItems: 1,
        maxItems: 12,
        items: {
          $ref: "#/components/schemas/InstagramProspectCriterion",
        },
      },
      threshold: {
        type: "number",
        minimum: 0.5,
        maximum: 1,
      },
      evidenceThreshold: {
        type: "number",
        minimum: 0.5,
        maximum: 1,
      },
      sourceListIds: {
        type: "array",
        maxItems: 10,
        items: {
          type: "string",
          minLength: 1,
          maxLength: 200,
        },
      },
      sources: {
        type: "array",
        maxItems: 10,
        items: {
          $ref: "#/components/schemas/InstagramProspectSource",
        },
      },
      searchQueries: {
        type: "array",
        minItems: 1,
        maxItems: 5,
        items: {
          type: "string",
          minLength: 1,
          maxLength: 120,
        },
      },
      targetCount: {
        type: "integer",
        minimum: 1,
        maximum: 1000,
      },
      maxCandidates: {
        type: "integer",
        minimum: 1,
        maximum: 1000,
      },
      maxCredits: {
        type: "integer",
        minimum: 1,
        maximum: 100000,
      },
      maxModelCalls: {
        type: "integer",
        minimum: 1,
        maximum: 1000,
      },
      media: {
        type: "string",
        enum: ["none", "avatar", "recent_posts"],
      },
      model: {
        type: "string",
        enum: ["clef", "clef-flash"],
      },
      includeReview: {
        type: "boolean",
      },
      excludePreviouslyContacted: {
        type: "boolean",
      },
      name: {
        type: "string",
        minLength: 1,
        maxLength: 100,
      },
    },
  },
  InstagramProspectCriterion: {
    type: "object",
    additionalProperties: false,
    required: ["id", "statement", "basis", "role", "unknown"],
    properties: {
      id: {
        type: "string",
        minLength: 1,
        maxLength: 40,
        pattern: "^[a-z][a-z0-9_]{0,39}$",
      },
      statement: {
        type: "string",
        minLength: 1,
        maxLength: 1000,
      },
      basis: {
        type: "string",
        enum: ["text", "visual"],
      },
      role: {
        type: "string",
        enum: ["required", "preferred"],
      },
      unknown: {
        type: "string",
        enum: ["review", "exclude"],
      },
      literalRule: {
        oneOf: [
          {
            type: "object",
            additionalProperties: false,
            required: ["kind"],
            properties: {
              kind: {
                type: "string",
                const: "follower_count",
              },
              min: {
                type: "integer",
                minimum: 0,
              },
              max: {
                type: "integer",
                minimum: 0,
              },
            },
          },
          {
            type: "object",
            additionalProperties: false,
            required: ["kind", "equals"],
            properties: {
              kind: {
                type: "string",
                enum: ["privacy", "verification"],
              },
              equals: {
                type: "boolean",
              },
            },
          },
        ],
      },
    },
  },
  InstagramProspectSource: {
    type: "object",
    additionalProperties: false,
    required: ["type", "identifier"],
    properties: {
      type: {
        type: "string",
        enum: ["followers", "following", "likers", "commenters"],
      },
      identifier: {
        type: "string",
        minLength: 1,
        maxLength: 2048,
      },
      count: {
        type: "integer",
        minimum: 1,
        maximum: 1000,
      },
    },
  },
  InstagramProspectStartInput: {
    allOf: [
      {
        $ref: "#/components/schemas/InstagramProspectInput",
      },
      {
        type: "object",
        additionalProperties: false,
        required: ["idempotencyKey"],
        properties: {
          idempotencyKey: {
            type: "string",
            minLength: 1,
            maxLength: 120,
          },
        },
      },
    ],
  },
  InstagramProspectRunInput: {
    type: "object",
    additionalProperties: false,
    required: ["runId"],
    properties: {
      runId: {
        type: "string",
        minLength: 1,
        maxLength: 100,
      },
    },
  },
  InstagramProspectResultsInput: {
    type: "object",
    additionalProperties: false,
    required: ["runId"],
    properties: {
      runId: {
        type: "string",
        minLength: 1,
        maxLength: 100,
      },
      status: {
        type: "string",
        enum: ["pending", "accept", "review", "exclude", "suppressed"],
      },
      cursor: {
        type: "string",
        maxLength: 2000,
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: 100,
      },
    },
  },
} as const;
