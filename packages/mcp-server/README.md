# DM Faster MCP server

Native Instagram ICP text-to-list uses the six `leads_prospect_*` operations,
existing Hiker extraction/enrichment, Clef text and original-image judgments,
and private saved match/review lists. These tools are registered without local
datasets and retain existing lead/campaign grants and explicit spending limits.
Unknown evidence and provider failures remain marked; no campaign is activated.

Optional offline Instagram ICP research is available only when
`DMFASTER_INSTAGRAM_EVALUATION_DATASETS` explicitly configures named local
datasets. `instagram_icp_plan`, `instagram_evaluation_datasets` and
`instagram_profiles_evaluate` prepare or replay recorded decisions.
`instagram_workspace` opens a private MCP Apps review view with exact loaded
counts and provisional CSV export. `instagram_profile_inspect` reads original
saved text and cached media; image bytes are view-only tool metadata.
`instagram_acquisition_quote` forwards the existing authenticated extraction quote,
preserving permissions and credit blocks. These tools do not run providers, spend
credits, save customer lists or send. Offline reads need no cloud credentials;
the acquisition quote uses the normal account grant. See
`src/instagram-evaluation.ts` for the optional evaluation configuration.
These tools are not registered by hosted MCP or the current published plugin.

The default local stdio MCP server exposes the generated DM Faster domain-tool
catalog and one local `connection_status` tool. Retained workspace UI adapters
are registered only when an embedding explicitly opts into `uiTools`; the
published CLI and hosted connection remain headless. It uses the MCP TypeScript SDK
v2 serving entry in strict modern-only mode. MCP 2026-07-28 clients use the new
per-request protocol; 2025-era initialization is explicitly rejected. The
server is deliberately stateless; the caller sends the complete latest campaign
state on each planning call, while durable product state, permissions,
idempotency, and approvals remain on DM Faster's server.

Discovery carries a self-contained instruction summary of at most 512 characters.
Detailed sequences and recovery rules live on their entry tool descriptions, including
validation, exact preview, private drafts and owner-authorized launch. Hosted connection
guidance uses host reconnect; local connections use the CLI scope-upgrade flow.

For explicitly enabled UI adapters, hosts implementing the standard MCP Apps extension render
`campaign_workspace` as an inline campaign editor. The self-contained
`ui://dmfaster/campaign-workspace/v7.html` resource uses the MCP Apps
`2026-01-26` bridge and requires no external scripts, styles, frames or cookies.
Company website icons use trusted public favicon origins, with initials when
unavailable. The Companies view displays searches initiated by the chat composer;
criteria are read-only, and new tool results replace the displayed search.
Users can browse pages, select a campaign audience and open profile drawers.
It can validate the current state, preview an exact audience,
prepare a private disabled draft, request launch approval, and sync edits back
into model context. It cannot execute launch or pause. Codex and other headless
hosts receive the same state and safety description as structured content and
continue to use the typed domain tools directly.

OpenAI hosts that support composer mentions discover `workspace_mentions` as an
app-only search tool through `capabilities.extensions["openai/mentions"]`,
with `searchTool: "workspace_mentions"`. It suggests companies across the supported countries and
saved prospect or company lists. Company suggestions use `companies_suggest`,
a bounded compact read with no audience total; `companies_search` still returns
an exact total. Opening a mention reads the current profile or list through
authenticated resource templates, with pagination preserved. A mention is
context only and never authorizes spending credits, changing lists or sending.
Native host availability needs a separate host check; protocol metadata alone
does not establish that the composer will render it.

For local UI review, `npm run dev:agent:workspace` uses disposable fixtures.
After `npm run build:agents`, an owner-authorized live interface test can use an official MCP
`companies_search` JSON receipt outside Git:

```bash
npm run dev:agent:workspace -- --live-results /absolute/path/search-receipt.json
```

To execute a typed search and publish its receipt immediately, use:

```bash
npm run dev:agent:search -- --preview http://127.0.0.1:PORT/ --input /absolute/path/company-search-input.json
```

The input contains the same filters as `companies_search`. The review server
reuses the official agent client, pushes completed results to the view, and
atomically saves the receipt. Superseded requests cannot replace a newer result.
File updates also refresh the view without a reload. The preview uses the existing official CLI credential
through the shared MCP agent client for company profiles and pagination. It
binds to loopback, validates typed inputs, rejects foreign origins, and permits
only `companies.search` and `company.inspect`. It cannot start website research,
spend research credits, save lists or send. No browser cookie, token handoff,
database access or production environment file is involved. Selection-to-composer
integration still requires a native MCP host; this local view tests result updates
and read interactions separately from hosted availability.

The candidate adds optional `projection: list` for compact rows and a shared,
revision-bound exact-page cache. The native view uses list rows and fetches full
profiles on demand; existing headless callers still receive rich rows by default.
Against an older public server, local review retries only an unsupported optional
projection field, preserving every criterion and returning rich rows.

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
npx --yes @dmfaster/cli@2.7.2 auth login --json
npx --yes @dmfaster/mcp-server@2.7.2
```

Login defaults to the complete Agent 2.0 capability set. Use `auth login
--access read`, `plan`, or `draft` when this MCP installation should have a
smaller ceiling. The MCP server can expose all 91 domain schemas and the
local connection and presentation schemas while the DM Faster API independently rejects
domain tools outside the stored credential's scopes.

The process uses stdout only for MCP protocol messages. Startup and fatal errors
go to stderr. Tool annotations accurately distinguish reads, private draft
preparation, workspace controls, and the external launch action. Every mutation
is idempotent. Launch is marked destructive and open-world. Domain tools also
advertise output schemas generated from the public Agent API contract.

The MCP names are the 125 domain tools:

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
- `companies_knowledge`
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
- `sending_instagram_pacing_inspect`
- `sending_instagram_pacing_update`
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
- `instagram_extract_quote`
- `instagram_extract_start`
- `instagram_extract_inspect`
- `instagram_extract_results`
- `leads_status`
- `leads_extract_quote`
- `leads_extract_start`
- `leads_extract_inspect`
- `leads_extract_refresh`
- `leads_extract_continue`
- `leads_enrich_preview`
- `leads_enrich_start`
- `leads_enrich_inspect`
- `leads_prospect_quote`
- `leads_prospect_start`
- `leads_prospect_inspect`
- `leads_prospect_results`
- `leads_prospect_advance`
- `leads_prospect_cancel`

Additional MCP tools are `connection_status`, `campaign_workspace`,
`companies_workspace`, `workspace_open`, the app-only `workspace_mentions`,
and read-only `outreach_details` for native forms.

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
      "args": ["--yes", "@dmfaster/mcp-server@2.7.2"]
    }
  }
}
```

Hosts that have not implemented MCP 2026-07-28 must use the version-pinned CLI
until they upgrade. Agent 2.0 does not silently downgrade to the 2025 protocol.

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

The company outreach composer supports one to four message variations for Instagram
and Facebook through the existing `messageVariants` contract. Review displays every
variation and verifies the exact ordered array returned by draft preparation. Editing,
adding or removing a variation invalidates review; uncertain requests retain their
original configuration and idempotency key. LinkedIn invitations keep a separate note.

The workspace resource requests `preferredDisplayMode: "fullscreen"` while
retaining inline support. This is a host-controlled preference, not a guarantee
that a model invocation opens a side panel. Thread entrypoints open a content
tab; the global entrypoint opens the standalone workspace.

Company selection, focused company identity, workflow step, and edited outreach
copy publish a debounced `dmfaster.workspace_context` snapshot through
`ui/update-model-context`. Query-wide selection carries the frozen query/revision
and exclusions instead of fetching all matches. Saved-evidence context preserves
unknown market totals and exact processing progress. Passive updates never fall
back to `ui/message`, never create lists/campaigns, and never authorize sending.
If the host clears its attached model context, unchanged renders and theme
updates do not reattach it; a subsequent workspace state change publishes again.
Legacy `setWidgetState` is supported when available. Hosts with neither context
capability retain the normal UI and tool workflow without passive synchronization.

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

Company selection alone never saves a list, spends research credits or starts outreach. Full typed company data stays in
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

The compact campaign detail shows basic campaign facts and a cumulative activity
chart from at most 100 recorded sends. It reads `history.list` only on opening a
campaign, validates campaign identity, labels truncated history as the latest
sends, and keeps denied or empty activity separate from zero. Detailed copy,
delivery, replies and sending-health tools remain available through the assistant.
The plan editor keeps its audience and forecast summary collapsed until requested.

Company selection opens from the result count, with no visible header row or select-all checkbox: a custom quantity, this page, all exact
results, or clear selection. The campaign editor currently supports 50 companies.
Query results start selected across all pages without eager reads. Exclusions
stay selected-out while paging. Continuing to Message resolves the bounded
selection against the pinned source identity. Larger exact queries remain entirely
selected, but the editor requires a custom audience of at most 50 before continuing;
it never silently truncates to the first page. Unknown evidence market totals do
not become an all-results count: only the run's confirmed matches start selected,
and unresolved companies require an explicit choice.
Cross-page selection pins the query and revision and applies atomically; incomplete
or changed results leave the previous selection intact. The Message navigation
step replaces redundant discussion and compose buttons.

The view follows host theme and font tokens, with light/dark fallbacks. The original
`v1.html` and `v2.html` resources remain readable for existing conversations. All presentation
and connection tools declare output schemas. Hosted tool descriptors declare OAuth
scopes and return renewal challenges for expired or insufficient grants; ownership
and role denials do not trigger an unhelpful reconnect. Local stdio authentication
keeps its existing flow. Only tools used by the view permit iframe invocation.

## Company research shortlists

The native Companies view can save 1–50 selected companies as a named private
research list without preparing a campaign. It resolves the exact selection,
inspects current company revisions, and retains one immutable save request across
uncertain responses. A changed selection before saving cancels preparation; a
retry after an uncertain save reuses the original identities, revisions, name,
and idempotency key. Saving requires the existing owner and audience/list scopes.

Open a saved company list with `companies_workspace` (or `workspace_open`):

```json
{ "savedList": { "listId": "<returned-list-id>" }, "pageSize": 20 }
```

The view reads `companies.list.inspect`, preserves its exact saved total and
`expectedUpdatedAt` across pages, and opens current profiles on demand. Saved
list counts are not market counts. Saved contact routes retain their snapshot
meaning; opening a profile does not verify deliverability. Preparing new outreach
from a selection reinspects its companies through the existing draft workflow.
Filters, savedList and evidenceRun are mutually exclusive sources. Errors and
missing exact counts block selection-dependent actions. Hosted and local MCP
share the same presentation and domain authorization.

This implementation is locally verified separately from production promotion,
public package publication and native-host installation. See the company
prospecting readiness record for the current candidate's evidence.

The native company outreach composer also offers **Email** and **SMS** when the
workspace has usable setup. Email requires a connected sender, subject and the
app's existing recipient permission confirmation; SMS uses the workspace's
assigned sender and separate message. Discovery uses `senders_inspect`, including
its `emailAvailable` and safe `sms` fields, and requires `sending:read`.

For headless company drafts, `campaign_draft_prepare` supports `gmail` and `sms`
in `channel` or `channels`. Sum `channelCounts.email` for `gmail` and
`channelCounts.sms` for SMS in `expectedTargetCount`. Supply `gmailSubject`,
`gmailRecipientConsentConfirmed: true` only after explicit user confirmation,
and connected `mailboxIds` for email; `messageVariants` are the email body
variants. Supply separate `smsBody` for SMS. Recipient counts, list version,
workspace access and sender readiness are validated before the disabled draft
is saved. Only a separate authorized launch can start it.

## October 14 MCP guidance upgrades (source candidate)

The company profile's **Draft chat request** action creates an editable prompt with
`_meta["openai/message"]: { target: "active", send: false }`. It includes a company
resource reference. It appears only when the host advertises the extension and identifies
itself as desktop or web. Mobile and unknown hosts keep context sharing. Context updates
never fall back to immediate `ui/message` submission. Opening a chat draft does not create
an outreach draft or send messages.

`outreach_details` reads the current owner sender setup through `senders.inspect`
(`sending:read`) and collects channel, name, body, daily cap and optional eligible email
mailbox/subject. MCP 2.0 hosts with form elicitation receive `input_required`; OpenAI extended
forms additionally require the extension capability and carry their schema in
`_meta["openai/elicitation"].requestedSchema`. A fresh request resumes with `inputResponses`.
Each round checks sender eligibility again, validates the answer and handles cancellation.
No authorization state is round-tripped, saved or trusted. Unsupported hosts receive the
same collection instructions for chat. Results are typed review context; normal audience,
plan, recipient-permission, draft, revision, idempotency and launch checks still apply.

Hosted servers additionally advertise campaign-filtered `reply.received`, `campaign.blocked`
and `campaign.completed`. Reply events need `campaigns:read` and `inbox:read`; blocked events
need `campaigns:read` and `sending:read`; completion needs `campaigns:read`. Replies carry IDs,
not bodies, and include only confirmed human inbound records saved after monitoring starts.
They exclude automatic and uncertain responses. A durable outbox drains batches without a
moving timestamp cursor, preserving equal-time and late-committing records within the monitored
interval. Blocked alerts use existing sending health and remain quiet during normal pacing,
caps and closed windows. Completion is checked against authoritative remaining jobs and reports
sent/skipped/failed outcomes separately. Subscriptions, callback verification, expiry, revocation,
signatures and retry protections are shared with prospecting Events.

MCP Events in ChatGPT require Cloud Work chats; local chats use status tools. Actual ChatGPT
subscription/delivery verification remains a release canary, not a claim from these local tests.
Migration `0376_mcp_sales_events` expands the event-name check and adds bounded reply/outbox
lookup indexes. Production migration/deployment and package or marketplace publication have
not been performed by this source change.

The panel follows host safe-area updates and relies on host display-mode controls. HTML v7
keeps older resource URIs readable for saved conversations.

References: [OpenAI extensions v0.2](https://github.com/openai/mcp-extensions/blob/main/CHANGELOG.md),
[UI patterns](https://github.com/openai/mcp-extensions/blob/main/docs/patterns.md),
[MCP Events](https://developers.openai.com/plugins/build/mcp-events).

### Per-recipient campaign messages

Agents can research recipients with their own authorized web tools and save unique
Instagram/Facebook first messages **before the first launch**. Prepare a disabled
campaign, inspect its saved list, then use `campaign_messages_draft_list` and
`campaign_messages_draft_update`. Draft updates accept up to 100 exact
channel/handle identities per batch with inspected campaign/list versions and a
stable key. Messages preserve exact text; null removes prepared copy. Use the
returned campaign version for subsequent batches, then read the saved copy back.
Preparation creates no queue and sends nothing. Normal authorized launch uses
that copy with existing suppression, pacing and provider checks. An audience
change blocks launch until the prepared copy is reviewed or removed.

For an existing queue, `campaign_messages_list` returns exact counts, research
identities, pagination, editability and versions. `campaign_messages_update`
atomically edits up to 100 distinct unsent recipients. It refuses active or
unresolved send attempts, never starts or sends, and returns a durable retry
receipt. Queued overrides belong to the inspected run; a new run clears them.
Prepared draft copy remains the campaign's recipient-specific base across runs.

Draft reads use `campaigns:read`, queue reads use `sending:read`, and owner writes
use `campaigns:write` without an extra approval screen. Draft messages support
Instagram/Facebook; queued edits also support LinkedIn accepted/follow-up messages.
Gmail, SMS and LinkedIn invitations are excluded. Use batches below 64,000 UTF-8
bytes for CLI/HTTP compatibility.

Prepared copy may also be removed (with null) while a used campaign is stopped,
so a changed audience can return to the campaign template before a new launch.

### Compact catalog

The default MCP catalog exposes the five prospecting workflow tools and `tools_discover` / `tools_call`. Discovery returns only granted tools and can include their exact input schema. `tools_call` accepts the MCP tool name and validates the response against the same generated contract. Read `dmfaster://docs/agents` for guidance. Local clients may set `DMFASTER_MCP_PROFILE=full`; UI-only tools remain hidden unless explicitly enabled by the host. `npm run check:agent-catalog` prints bytes and estimated tokens for both profiles and enforces the 100 KB compact budget.

Tool discovery omits large output schemas by default; successful calls still return
complete `structuredContent` and text. Embedders that need the generated contracts
can pass `fullOutputSchemas: true` to `createDmfasterMcpCore`. Input validation and
domain authorization apply in both modes.
