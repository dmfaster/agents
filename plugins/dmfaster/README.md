# DM Faster Agent 2.0 plugin

This plugin bundles the canonical DM Faster skill and the hosted OAuth MCP
endpoint `https://app.dmfaster.com/mcp` under server name `dmfaster_hosted`.
It includes portable Agent Plugins 1.0 files and Codex, Claude and Cursor
manifests. The hosted endpoint supports MCP 2025 hosts. The separately published
version-pinned stdio MCP package requires MCP 2026-07-28; the CLI remains available
for headless callers.

The 2.3.0 source exposes 145 bounded domain tools plus an optional
portable MCP Apps Companies and campaign workspaces. It adds Instagram ICP text-to-list runs and covers social prospecting, company research, exact
audience and draft preparation, inbox and pipeline work, follow-up control,
sender readiness and paginated outcomes. Replies require the user's explicit
instruction for the exact text and report delivery state. Campaign launch and
pause require the owner's direct-control grant or the existing per-action
approval path. The interface does not expose provider credentials or bypass
the browser extension's execution boundary.

Instagram follower, following, liker and commenter extraction uses existing
lead credits: one credit per saved profile. Enrichment is separate. Durable job
receipts report saved lists, final costs and refunds; retries recover the same
job. Company and saved-list composer mentions use the host's native extension
when supported, while every profile/list read keeps the current workspace
permissions. Selecting a mention never grants action permission.

A first-time paid user can state the campaign goal without learning DM Faster's
screens or tool names. The agent carries the plan through validation, exact
audience preview, and private draft preparation. If browser-based sending is not
ready, launch preflight returns one machine-readable setup link and an exact
resume call; the user only completes the browser-store installation/link and
any approval explicitly required by the returned connection or action state.

Compliant MCP Apps hosts can render the campaign workspace inline. Modern
headless hosts use the same complete campaign state and 125 domain tools without
losing any server capability or safety guarantee; older clients do not receive
a legacy MCP downgrade.

## Release status

Version 2.3.0 adds structured feedback submission and author-scoped history, with retry-safe receipts.

Version 2.2.0 adds recipient-specific message preparation for unlaunched drafts
and edits to eligible queued messages. Users can have their own agent research
websites and supply the exact text for each recipient. Preparing copy does not
launch a campaign. The version-pinned packages use the
[trusted publishing workflow](https://github.com/dmfaster/agents/actions/workflows/agent-packages-release.yml).
Publication, registry verification and host checks are recorded separately for
each release. Refresh the plugin and start a fresh host session after upgrading.
Existing connections retain their granted permissions.

Do not point users at the private monorepo as a public marketplace. Synchronize
this plugin directory to the approved public repository after package, privacy,
and platform review. That repository can act as a Codex/ChatGPT desktop repo
marketplace and a Claude Code marketplace. It is not a universal
ChatGPT/Codex Plugins Directory acceptance: that requires a separate reviewed
submission and host verification, even though this plugin uses a public HTTPS
MCP endpoint. The local stdio package alone is not eligible.

Repository maintainers must follow the [agent distribution release
runbook](../../docs/runbooks/agent-distribution-release.md). Package publication
and plugin publication are separate approved releases.

## Authentication

Node.js 24 and macOS Keychain or Linux Secret Service are required. Windows is
not supported in this release.

```bash
npx --yes @dmfaster/cli@2.3.0 auth login --json
```

The default `full` profile supports the complete campaign-agent workflow. Use
`--access read`, `--access plan`, or `--access draft` to grant a smaller
credential. Tool availability never replaces server-side scope enforcement.

The human signs in with their normal DM Faster account, compares the browser and
CLI confirmation codes, reviews the workspace and exact permissions, and
personally approves or denies the request. The CLI and MCP server then share the
operating-system credential. With owner-granted `campaigns:control`, an explicit
launch or pause instruction is enough: run preflight and use its returned
authorization when ready. Older connections retain per-action browser approval;
they do not gain control permission automatically.

## Development validation

- Portable Agent Plugins manifest: `plugin.json`
- Portable Agent Plugins MCP config: `mcp.json`
- Codex manifest: `.codex-plugin/plugin.json`
- Shared MCP map: `.mcp.json`
- Claude manifest: `.claude-plugin/plugin.json`
- Cursor manifest: `.cursor-plugin/plugin.json`
- Canonical shared skill: `skills/dmfaster/`

Use the repository checks before packaging. Test source changes against the
locally built MCP server and nested `skills/dmfaster/` directory so validation
does not accidentally exercise an already-published package. Test the complete
plugin directory in clean Codex, Claude, and Cursor profiles before a separately
approved public release.

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
