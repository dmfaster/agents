> Release candidate: 1.10.0 source. The published npm baseline is 1.9.0.
> Product deployment and package/plugin publication require guarded release
> approval and verification before these new controls can be called live.

# DM Faster for agents

This repository is the public source for
[DM Faster](https://dmfaster.com) Agent 1.0:

- the versioned Agent API contract;
- secure browser authorization backed by the operating-system credential store;
- the typed JavaScript SDK and `dmfaster` CLI;
- the stateless MCP 2026-07-28 stdio server;
- portable MCP Apps Companies and campaign views built from DM Faster's product UI;
- company and saved-list context mentions for compatible hosts;
- the shared Codex, Claude, and Cursor plugin and skill.

The shared plugin also includes portable Agent Plugins 1.0.0 root
`plugin.json` and `mcp.json` files, while retaining host-specific manifests for
clients that have not adopted the portable package format yet.

The 1.10.0 candidate exposes 78 typed domain tools. It adds Basic-plan Instagram
prospecting and separately charged enrichment, quiet Companies views, website
evidence, bounded company suggestions, and company and saved-list mentions.
Extraction reports exact saved counts and settled credit costs. A same-key retry
recovers the same job instead of starting another paid extraction. Existing
campaign copy inspection, company fit review, multichannel drafts, inbox,
pipeline, follow-up, sender, outcome and history tools remain available.
Reply actions report queued and confirmed delivery separately.
Launch and pause still require an explicit user instruction and the owner's
campaign-control grant or the existing per-action approval path. The interface
does not expose provider credentials or bypass the browser extension's
execution boundary.

This repository intentionally contains no DM Faster application server,
database, browser extension, sending runtime, or private product source.

## Install the plugin

Node.js 24 and macOS Keychain or Linux Secret Service are required. Windows is
not supported in this release. Add the public GitHub marketplace, install DM
Faster, and start a new session so the skill and MCP server load.

### Codex

```bash
codex plugin marketplace add dmfaster/agents
codex plugin add dmfaster@dmfaster-agents
```

### Claude Code

```bash
claude plugin marketplace add dmfaster/agents
claude plugin install dmfaster@dmfaster-agents
```

### Cursor

The Cursor plugin is packaged in this repository. After its separate Cursor
Marketplace review is approved, install it from Cursor Agent with:

```text
/add-plugin dmfaster
```

Merging the manifest does not publish the universal Cursor listing.

## Authenticate

```bash
npx --yes @dmfaster/cli@1.9.0 auth login --json
```

The focused DM Faster page shows the exact workspace, expiry, scopes, and a
confirmation code that must match the CLI. Credentials are stored in macOS
Keychain or Linux Secret Service and are never written to plaintext config.
Use `--access read`, `plan`, or `draft` to grant a smaller capability ceiling;
the default `full` profile enables the complete Agent 1.0 flow.

The `full` profile includes the owner-granted `campaigns:control` permission.
After this one-time connection approval, telling your agent “launch it” or
“pause it” is enough. Preflight returns `ready`; the agent executes using the
returned authorization ID and the same campaign ID and idempotency key.
Planning and draft preparation never authorize launch.

Existing connections retain per-action approval. Use `auth upgrade --access
full` to request new permissions while retaining the current credential until
the owner approves the replacement. Credentials are never upgraded silently.

## Use the CLI or MCP server directly

```bash
npx --yes @dmfaster/cli@1.9.0 workspace briefing --json
npx --yes @dmfaster/cli@1.9.0 campaign copy inspect campaign_123 --json
npx --yes @dmfaster/cli@1.9.0 conversations list --filter unread --limit 25 --json
npx --yes @dmfaster/mcp-server@1.9.0
```

The 78 candidate MCP domain tools cover prospecting, workspace, campaign, sending, reply, inbox,
pipeline, company-history, industry, validation, exact-audience preview,
private draft, launch, and pause workflows. Compatible MCP Apps hosts can render
`workspace_open`, `companies_workspace`, and `campaign_workspace`. Selecting a
company or saved-list mention reads its current authorized context and grants
no action permission. Suggestions are a bounded selection list and contain no
audience total; use `companies_search` for an exact audience. Headless hosts receive
the same complete state and keep every domain capability.

The MCP server is deliberately stateless: send the complete latest campaign
state on each planning call. Durable product state, permissions, idempotency,
and action approvals remain on DM Faster's server. Clients that have not
implemented MCP 2026-07-28 must use the version-pinned CLI; Agent 1.0 does not
silently downgrade to the 2025 protocol.

See [dmfaster.com/docs/agents](https://dmfaster.com/docs/agents) for host setup
and the complete tool workflow.

## Develop

```bash
npm ci
npm run check:agents
npm audit --omit=dev
```

The API schema in `packages/public-api/openapi.yaml` is the contract source of
truth. Regenerate SDK types with `npm run generate:agent-api`.

## Security boundary

The public clients reject plaintext non-loopback API origins, refuse redirects,
keep credentials out of URLs and process arguments, require exact audience
counts, make draft mutations idempotent, and do not accept conversational
approval in place of server-issued action authorization.

Report vulnerabilities through GitHub private vulnerability reporting. Do not
open a public issue containing credentials, customer information, or an
unpatched exploit.

## License

The source in this repository is licensed under Apache License 2.0. This
license applies only to this public repository and does not cover DM Faster's
private product source or trademarks.

## Import an Instagram list

All account owners, including Basic, can import a one-column username CSV or newline-separated usernames into a private target list:

```bash
npx --yes @dmfaster/cli@1.9.0 list import --name "My prospects" --file usernames.csv --json
```

The same operation is available as MCP `list_import` and SDK `client.call("list.import", { name, usernames, idempotencyKey })`. Imports accept 1–1,000 rows, remove duplicates, and report the exact saved count. They create no campaign and send no messages.

OpenAPI generates the SDK tool catalog and types, MCP input schemas, and CLI help metadata. After changing the contract, run `npm run generate:agent-api`; `npm run check:agent-api` rejects stale artifacts.

## Edit a saved draft

Version 1.2.0 adds `campaign_draft_update` / `campaign draft update --input FILE`.
Inspect the campaign, then send its ID, `expectedCampaignUpdatedAt`, and a
nonempty `updates` object. You can edit the name, exact message variations,
daily cap, pacing, and automatic sending window without creating another
campaign. `campaign.inspect` reports current copy, delivery settings, window,
and workspace timezone. Edits preserve omitted settings and reject stale
versions or started campaigns. Saving or toggling a draft window leaves it
disabled; an explicitly instructed, authorized launch arms the schedule.

## Agent 1.7.0 release (published baseline)

Version 1.7.0 adds `companies_fit_start`, `companies_fit_advance`,
`companies_fit_results`, and `companies_fit_proposal`. The review uses bounded
current website evidence and conservative fit tiers. Missing or ambiguous
evidence stays unknown. A proposal only returns dry-run input for the existing
version-guarded refinement tool; it never changes the audience or sends
messages. The Product server and migration 0342 must be deployed and verified
before these clients are published.

## Agent 1.6.0 release

Version 1.6.0 adds `companies_list_refine` / `companies list refine --input FILE`.
It previews exact company additions, contact refreshes, and exclusions, then
saves a separate vetted list and attaches it to an existing disabled,
unstarted campaign under version, count, and digest guards. It also adds the
inbox, pipeline, follow-up, sender, outcome and history tools described above.
Those server operations and database migrations are already released.

## Agent 1.5.0 release

Version 1.5.0 adds CLI setup diagnostics with `doctor`, per-command discovery
with `describe`, and paginated inbox conversation reads across the SDK, CLI, and
MCP server. The [agent guide](https://dmfaster.com/docs/agents) and bundled skill
cover the earlier 33 domain tools, company-centric filtering (including Shopify with
active Meta ads), ongoing delivery controls, and operation status. Saved
company shortlists preserve available real contact routes; generated company
identities are never Instagram targets. Older lost contacts are not backfilled
automatically. See the [tool reference](plugins/dmfaster/skills/dmfaster/references/tools.md)
for current behavior and limits. Full live-app parity remains in progress.

Refresh a Codex installation after this documentation update:

```bash
codex plugin marketplace upgrade dmfaster-agents
codex plugin add dmfaster@dmfaster-agents
```

Start a new session to load the refreshed skill and MCP configuration. Updating
plugin files does not change the permissions of an existing DM Faster connection.

## Agent 1.9.0 release (published baseline)

Version 1.9.0 adds `campaign.copy.inspect` without changing the existing
`campaign.inspect` response shape. It returns exact Instagram/Facebook openings,
LinkedIn invitation mode and note, both saved sequences, and the effective
accepted-message variants. `campaign.draft.update` can already configure those
fields on a disabled, unstarted social draft. Product checks for a recorded
same-company human reply before queueing the accepted message and again before
provider handoff. An already-connected prospect is eligible for the first
message directly. Guarded Product deployment must precede package/plugin
publication; neither step starts a campaign.

The local Codex 0.149.0 fixture check passed using the CLI fallback after an
incompatible MCP handshake. Claude Code was unavailable and is unverified.
Stateless MCP 2026-07-28 and clean package consumers have separate automated checks.

## Agent 1.10.0 candidate

The candidate adds `leads_status`, extraction quote/start/inspect/refresh/continue,
and enrichment preview/start/inspect. One saved profile costs one DM Faster credit;
enrichment is a separate charge. Exact available credits control extraction volume.
Credit blocks return a purchase link for the user; agents never buy credits automatically.
Prospecting saves private lists and does not start campaigns or send messages.

Hosted MCP Events can deliver a subscribed extraction or enrichment completion to
a compatible host. The local stdio server uses status reads. Protocol tests do not
prove native composer rendering or ChatGPT completion delivery; real host evidence
must be recorded separately. The hosted endpoint is deployed independently of npm.
The new `companies.suggest` operation must be deployed and verified before publishing
these clients. Native directory review and public npm release are separate steps.
