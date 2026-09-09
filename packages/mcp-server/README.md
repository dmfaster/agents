# DM Faster MCP server

Local stdio MCP server for the 31 DM Faster Agent 1.0 domain tools plus one
portable `campaign_workspace` presentation tool. It uses the MCP TypeScript SDK
v2 serving entry in strict modern-only mode. MCP 2026-07-28 clients use the new
per-request protocol; 2025-era initialization is explicitly rejected. The
server is deliberately stateless; the caller sends the complete latest campaign
state on each planning call, while durable product state, permissions,
idempotency, and approvals remain on DM Faster's server.

The server advertises host-neutral operating instructions through MCP discovery,
so an agent without a DM Faster-specific prompt can start with a workspace
briefing and carry a plain-language campaign goal through validation, exact
preview, private draft preparation, browser setup, and owner-approved launch.

Hosts implementing the standard MCP Apps extension render
`campaign_workspace` as an inline campaign editor. The self-contained
`ui://dmfaster/campaign-workspace/v1.html` resource uses the MCP Apps
`2026-01-26` bridge and requires no external scripts, styles, frames, cookies,
or network access. It can validate the current state, preview an exact audience,
prepare a private disabled draft, request launch approval, and sync edits back
into model context. It cannot execute launch or pause. Codex and other headless
hosts receive the same state and safety description as structured content and
continue to use all 31 domain tools directly.

`audience_preview` returns a server-issued `reviewedAudience` identity with an
exact, immutable search revision. The user must review that preview before a
caller echoes the object unchanged into `list_prepare` or `campaign_prepare`.
Clients must never compute the signature themselves; changing audience fields
requires a new preview and review.

To build a fresh prospect list, set `brief.excludePreviouslyContacted` to
`true`. The preview and prepare call then apply the workspace contact ledger;
the returned reviewed audience records that setting and cannot be reused for a
different one.

Authenticate first through the DM Faster CLI's focused browser flow. The MCP
server resolves the same operating-system stored credential.

> Distribution note: the registry commands below work only after this exact
> release is published. Before then, maintainers configure the built MCP server
> from an authorized source checkout.

```bash
npx --yes @dmfaster/cli@1.4.0 auth login --json
npx --yes @dmfaster/mcp-server@1.4.0
```

Login defaults to the complete Agent 1.0 capability set. Use `auth login
--access read`, `plan`, or `draft` when this MCP installation should have a
smaller ceiling. The MCP server can expose all 31 domain schemas and the
read-only presentation schema while the DM Faster API independently rejects
domain tools outside the stored credential's scopes.

The process uses stdout only for MCP protocol messages. Startup and fatal errors
go to stderr. Tool annotations accurately distinguish reads, private draft
preparation, workspace controls, and the external launch action. Every mutation
is idempotent. Launch is marked destructive and open-world.

The MCP names are the 31 domain tools:

- `analytics_summary`
- `workspace_briefing`
- `campaigns_list`
- `campaign_inspect`
- `sending_inspect`
- `replies_list`
- `pipeline_inspect`
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
- `companies_search`
- `company_inspect`
- `companies_list_prepare`
- `companies_list_inspect`
- `campaign_operation_inspect`
- `campaign_delivery_inspect`
- `campaign_delivery_update`

The additional presentation-only MCP tool is:

- `campaign_workspace`

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
      "args": ["--yes", "@dmfaster/mcp-server@1.4.0"]
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

To change an existing disabled Instagram draft, use
`dmfaster campaign draft update --input update.json --json`. Supply `campaignId`,
`expectedCampaignUpdatedAt` from campaign inspection, and a nonempty `updates`
object containing any of `name`, `messageVariants`, `dailyCap` (1–60), or
`pacingSeconds` (12–3,600). Omitted settings and the audience are preserved.
Stale versions and started campaigns are rejected. After an uncertain
response, inspect the campaign before retrying. No launch approval is needed to
edit a disabled draft.

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

## Direct campaign control (1.4.0)

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
This server behavior is available with the published 1.4.0 CLI and MCP server;
saving a research list creates no campaign and sends nothing.
