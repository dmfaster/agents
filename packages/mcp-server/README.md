# DM Faster MCP server

Local stdio MCP server for 78 DM Faster Agent 1.0 domain tools, one local
`connection_status` tool, and portable `companies_workspace`, `campaign_workspace` and `workspace_open` views. It uses the MCP TypeScript SDK
v2 serving entry in strict modern-only mode. MCP 2026-07-28 clients use the new
per-request protocol; 2025-era initialization is explicitly rejected. The
server is deliberately stateless; the caller sends the complete latest campaign
state on each planning call, while durable product state, permissions,
idempotency, and approvals remain on DM Faster's server.

The server advertises host-neutral operating instructions through MCP discovery,
so an agent without a DM Faster-specific prompt can inspect its connection,
choose the right read tool, and carry a plain-language campaign goal through validation, exact
preview, private draft preparation, browser setup, and owner-approved launch.

Hosts implementing the standard MCP Apps extension render
`campaign_workspace` as an inline campaign editor. The self-contained
`ui://dmfaster/campaign-workspace/v3.html` resource uses the MCP Apps
`2026-01-26` bridge and requires no external scripts, styles, frames, cookies,
or network access. It can validate the current state, preview an exact audience,
prepare a private disabled draft, request launch approval, and sync edits back
into model context. It cannot execute launch or pause. Codex and other headless
hosts receive the same state and safety description as structured content and
continue to use all 78 domain tools directly.

OpenAI hosts that support composer mentions discover `workspace_mentions` as an
app-only search tool. It suggests companies across the supported countries and
saved prospect or company lists. Company suggestions use `companies_suggest`,
a bounded compact read with no audience total; `companies_search` still returns
an exact total. Opening a mention reads the current profile or list through
authenticated resource templates, with pagination preserved. A mention is
context only and never authorizes spending credits, changing lists or sending.
Native host availability needs a separate host check; protocol metadata alone
does not establish that the composer will render it.

Social prospecting uses `leads_status`, quote/start/inspect/refresh/continue tools,
and separate enrichment preview/start/inspect tools. Exact saved counts and
settled costs come from the durable job receipt. Hosted MCP Events can deliver
completion updates to subscribed capable hosts; local stdio clients inspect the
same job. The hosted endpoint also supports the compatibility protocol needed
by current legacy clients; this local stdio package remains modern-only.

`audience_preview` returns a server-issued `reviewedAudience` identity with an
exact, immutable search revision. The user must review that preview before a
caller echoes the object unchanged into `list_prepare` or `campaign_prepare`.
Clients must never compute the signature themselves; changing audience fields
requires a new preview and review.

To build a fresh prospect list, set `brief.excludePreviouslyContacted` to
`true`. The preview and prepare call then apply the workspace contact ledger;
the returned reviewed audience records that setting and cannot be reused for a
different one.

The MCP server starts and exposes `connection_status` before login. Authenticate
through the DM Faster CLI's focused browser flow when required. The running MCP
server resolves the same operating-system credential for each domain tool call,
so a new login takes effect without restarting the host.
When connected, `connection_status` identifies the workspace and shows which
tools satisfy the credential's scopes, with missing scopes for the others.
Workspace role, plan, and action preconditions still apply when a tool runs.

```bash
npx --yes @dmfaster/cli@1.10.0 auth login --json
npx --yes @dmfaster/mcp-server@1.10.0
```

Login defaults to the complete Agent 1.0 capability set. Use `auth login
--access read`, `plan`, or `draft` when this MCP installation should have a
smaller ceiling. The MCP server can expose all 78 domain schemas and the
local connection and presentation schemas while the DM Faster API independently rejects
domain tools outside the stored credential's scopes.

The process uses stdout only for MCP protocol messages. Startup and fatal errors
go to stderr. Tool annotations accurately distinguish reads, private draft
preparation, workspace controls, and the external launch action. Every mutation
is idempotent. Launch is marked destructive and open-world. Domain tools also
advertise output schemas generated from the public Agent API contract.

The MCP names are the 78 domain tools:

- `analytics_summary`
- `workspace_briefing`
- `campaigns_list`
- `campaign_inspect`
- `campaign_copy_inspect`
- `sending_inspect`
- `replies_list`
- `conversations_list`
- `conversation_inspect`
- `conversation_update`
- `conversation_reply`
- `conversation_reply_inspect`
- `campaign_followups_list`
- `campaign_followups_cancel`
- `campaign_outcomes_list`
- `senders_inspect`
- `history_list`
- `pipeline_inspect`
- `pipeline_cards_list`
- `pipeline_stage_update`
- `pipeline_note_list`
- `pipeline_note_add`
- `company_timeline`
- `industry_lookup`
- `campaign_validate`
- `audience_preview`
- `lists_list`
- `list_inspect`
- `list_target_remove`
- `campaign_draft_prepare`
- `campaign_draft_update`
- `list_import`
- `list_prepare`
- `campaign_prepare`
- `campaign_launch_preflight`
- `campaign_launch`
- `campaign_pause_preflight`
- `campaign_pause`
- `companies_filters`
- `companies_suggest`
- `companies_search`
- `companies_evidence_search`
- `companies_evidence_start`
- `companies_evidence_advance`
- `companies_evidence_status`
- `companies_evidence_results`
- `companies_evidence_cancel`
- `company_inspect`
- `companies_fit_start`
- `companies_fit_advance`
- `companies_fit_results`
- `companies_fit_proposal`
- `companies_list_prepare`
- `companies_list_inspect`
- `companies_list_refine`
- `campaign_operation_inspect`
- `campaign_delivery_inspect`
- `campaign_delivery_update`
- `companies_fit_status`
- `companies_fit_cancel`
- `companies_fit_runs_list`
- `companies_fit_run`
- `companies_fit_cohort`
- `copy_performance`
- `calendar_status`
- `calendar_availability`
- `calendar_meeting_book`
- `calls_list`
- `call_inspect`
- `leads_status`
- `leads_extract_quote`
- `leads_extract_start`
- `leads_extract_inspect`
- `leads_extract_refresh`
- `leads_extract_continue`
- `leads_enrich_preview`
- `leads_enrich_start`
- `leads_enrich_inspect`

Additional MCP tools are `connection_status`, `campaign_workspace`,
`companies_workspace`, `workspace_open`, and the app-only `workspace_mentions`.

Planning and preview tools do not mutate the workspace. Preparation creates
private drafts with a stable idempotency key. Launch and pause use a two-step
server-enforced protocol: preflight the exact campaign and command, let the
owner approve it on the returned DM Faster page, then call the action with the
server-issued authorization ID and the same idempotency key. An `approved: true`
tool argument does not exist and cannot authorize an action.

For browser-based campaigns, launch preflight returns `setup_required` until a
fresh browser worker is connected. The result contains one `setup.setupUrl` and
an exact `setup.resume` call. The agent shows that link and keeps the campaign
disabled; the user installs or reconnects the extension in their own browser,
then the agent resumes the same preflight. A website or agent cannot silently
install a browser extension.

For a local host that supports MCP 2026-07-28, use this version-pinned stdio
entry:

```json
{
  "mcpServers": {
    "dmfaster": {
      "command": "npx",
      "args": ["--yes", "@dmfaster/mcp-server@1.10.0"]
    }
  }
}
```

Hosts that have not implemented MCP 2026-07-28 must use the version-pinned CLI
until they upgrade. Agent 1.0 does not silently downgrade to the 2025 protocol.

Production defaults to `https://app.dmfaster.com`; use `DMFASTER_API_URL` only
for local development or self-hosting. `DMFASTER_TOKEN` remains an explicit
developer override, but it must never be pasted into chat or MCP tool inputs.

## Existing Instagram lists (1.1.0)

Find a saved list, check the whole audience for an exact username, remove a
requested target, and prepare an unstarted campaign through the same contract:

```bash
dmfaster lists list --query "Coaches" --json
dmfaster list inspect LIST_ID --username pt.j.jylha --json
dmfaster list target remove LIST_ID --username pt.j.jylha --expected-version INSPECTED_UPDATED_AT --json
dmfaster campaign draft prepare --input draft.json --json
```

Draft JSON contains `listId`, `expectedListUpdatedAt`, `expectedTargetCount`,
`name`, `messageVariants` (1–4 strings), `dailyCap`, `pacingSeconds`,
`onlyNewChats`, `skipPreviouslyMessaged`, and `idempotencyKey`. Use the version
and exact total from the latest inspection/removal. Preparation verifies the
saved copy and settings and always returns a disabled `Draft`. It does not
start or arm sending. Reusing a key with different settings or an edited audience
fails without changing the original campaign.

SDK operation names are `lists.list`, `list.inspect`, `list.target.remove`,
`campaign.draft.prepare`, and `campaign.draft.update`; MCP names replace dots with underscores. List
reads require `campaigns:read`; removal requires owner `campaigns:write`;
draft preparation requires both scopes. No company-search entitlement is needed
for these Instagram lists. Existing campaign launch/pause approval is unchanged.

Instagram campaigns always exclude known contacts: `onlyNewChats` and
`skipPreviouslyMessaged` must both be `true`. Unsupported values are rejected
before a draft is created.

To change an existing disabled, unstarted social campaign draft, use
`dmfaster campaign draft update --input update.json --json`. Supply `campaignId`,
`expectedCampaignUpdatedAt` from campaign inspection, and a nonempty `updates`
object containing any supported setting: social channel toggles, LinkedIn invite
mode and note, follow-up sequences, description, `name`, `messageVariants`,
`dailyCap` (1–60), `pacingSeconds` (12–3,600), or sending-window fields.
Omitted settings and the audience are preserved.
Stale versions and started campaigns are rejected. After an uncertain
response, inspect the campaign before retrying. No launch approval is needed to
edit a disabled draft.

For a mixed Instagram/Facebook/LinkedIn draft, use `campaign_copy_inspect` to
read the exact invite mode, note, saved sequences, Instagram/Facebook
`messageVariants`, and effective `linkedinAcceptedMessage`.
To send an invitation without a note and then a DM, set `linkedinInviteMode` to
`invite_only` and `linkedinFollowUpSequence` to an enabled sequence with a first
LinkedIn step containing the DM text. That first step is queued as soon as the
connection is accepted, or immediately if the person is already connected;
its required `delayDays: 1` does not delay the acceptance message. Later steps
use their configured delay. A known human reply on another campaign channel
stops unsent LinkedIn steps, with a final check before sending. A LinkedIn-only
campaign uses `followUpSequence` for these steps. Inspect after updating to
verify the saved copy; editing never launches the draft.

Automatic sending windows are also editable through `campaign.draft.update`:
`instagramSendingWindowEnabled` is a boolean; `instagramSendingWindowStartMinute`
is 0–1380; `instagramSendingWindowEndMinute` is 60–1440; and
`instagramSendingWindowWeekdays` is a bitmask from 1–127 (Monday=1, Tuesday=2,
through Sunday=64; Monday–Friday=31). The interval must span at least 60 minutes
in the same day. Times use the workspace timezone returned by `campaign.inspect`
in `settings`, alongside the current window, copy, pacing, and enabled state.
Send both endpoints when changing the interval. A saved window can be toggled
on or off while the draft stays disabled; only the separate launch operation
arms the schedule. Started campaigns cannot be edited with this draft tool.

## Direct campaign control (since 1.4.0)

An owner can grant `campaigns:control` once when connecting an agent with the
`full` profile. Explicit user instructions then suffice for launch or pause:
preflight returns `ready` and a version-bound authorization ID for immediate
execution. The normal action scope is still required. Existing credentials
retain per-action approval until the owner reconnects and grants this permission.
Planning or preparing a campaign never authorizes launch.

## Saved company contact details

Company search supports the current Companies app filters, including
`technologies: ["shopify"]` together with `metaAdsActiveOnly: true`. Discover
country-specific options first, then inspect the returned company identities
before preparing a private shortlist.

Saved company lists preserve available real email, LinkedIn, phone, Instagram,
and Facebook routes. Names and roles stay with the selected contact for each
channel; inspect the full company profile for all decision-makers. Generated
`company.…` identities are never Instagram targets, and contactless companies
remain research rows. Saved routes are snapshots, not verified deliverability.
Older lists are not automatically backfilled with contacts previously lost.
This server behavior was available with the published 1.4.0 CLI and MCP server;
saving a research list creates no campaign and sends nothing.

## Review and meeting controls (since 1.8.0)

Review runs have durable status/history, cancellation, bounded coordination and
best-N evidenced cohorts. Unknown research can check up to five current website
pages. CLI/SDK coordinators resume the same run; no offline scheduler is claimed.
Historical copy reports return exact sent text and observed attribution limits.
Calendar booking reuses the app service and sends invitations only under exact
user instructions and owner calendar scopes. Call reads preserve app permissions.
See the shared plugin review and booking reference for full workflow limits.

## Native workspace entrypoints

`workspace_open({})` advertises a global sidebar entry and returns the first exact
Companies page. `companies_workspace({ filters, pageSize })` opens a prospect
search beside chat using every typed Companies filter. Empty arguments browse
active companies in Finland. `campaign_workspace({})` opens the first authenticated
campaign page. The UI does not repeat the initial read. Users can search, filter,
page and share their current search or selected company evidence with chat.
Company profiles show their existing row summary immediately; full details load
without blocking navigation. Back retains the search, and view-local reads are
deduplicated and cached for 30 seconds. Refresh performs a fresh domain read;
the shared server profile retains its existing five-minute freshness policy.
The visual filter controls cover common criteria; other typed criteria stay intact
and visible as removable chips. The assistant can refine every supported filter.
Supplying `state`
to `campaign_workspace` preserves the existing plan editor. Supplying only
`campaignId` inspects that saved campaign. Selection is context, never authorization
to mutate or send. Domain tools retain their scope, ownership, plan and audit checks.

Company selection is discussion context, never authorization to save, spend
research credits or execute outreach. Full typed company data stays in
`structuredContent`; brief text summaries avoid duplicating it in the response.
These extensions require a supporting host. Metadata and local tests are not proof
of public directory listing, production deployment, or native host availability.

Run `npm run test:agent:workspace-ui` from the repository root for the standalone
Chromium MCP-host simulation (no app server or database). It covers first-result
rendering, search, cursor pagination, selection context, empty and denied states,
read errors, stale-response fencing, exact-count failures, native company profiles,
filter preservation and narrow-layout overflow. It stays outside `test:tooling` so fast
checks never launch a browser. `npm run dev:agent:workspace` opens a loopback-only
review preview with disposable Companies fixture data. Add `?theme=dark` for dark mode.

The native view keeps messages, delivery, replies/pipeline, sending health, and
connection details in collapsed disclosures. Extra reads run only when opened;
permission failures stay local to the section. Reply contacts are a labelled
bounded sample, not inbox message text. Sending health uses the server's assessment
and does not present workspace-wide counters as campaign totals. The plan editor
keeps its audience and forecast summary collapsed until requested.

The view follows host theme and font tokens, with light/dark fallbacks. The original
`v1.html` and `v2.html` resources remain readable for existing conversations. All presentation
and connection tools declare output schemas. Hosted tool descriptors declare OAuth
scopes and return renewal challenges for expired or insufficient grants; ownership
and role denials do not trigger an unhelpful reconnect. Local stdio authentication
keeps its existing flow. Only tools used by the view permit iframe invocation.
