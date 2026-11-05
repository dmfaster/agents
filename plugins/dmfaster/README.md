# DM Faster Agent 2.0 plugin

This plugin bundles the canonical DM Faster skill and the hosted OAuth MCP
endpoint `https://app.dmfaster.com/mcp` under server name `dmfaster_hosted`.
It includes portable Agent Plugins 1.0 files and Codex, Claude and Cursor
manifests. The hosted endpoint supports MCP 2025 hosts. The separately published
version-pinned stdio MCP package requires MCP 2026-07-28; the CLI remains available
for headless callers.

The source exposes typed, scoped operations for company research, prospecting,
campaign drafts, inbox and pipeline work, sender readiness and outcomes. The
compact catalog advertises common operations directly; `tools_discover` finds
other permitted operations and returns the right dispatcher and input schema.
The server is headless: the former campaign and company MCP Apps workspaces,
forms and composer mentions are retired. Domain tools preserve the underlying
reads and workflows. Catalog contents depend on the connection's grants and the
deployed version; source presence alone does not establish live availability.

Prospecting uses existing lead credits, with enrichment charged separately.
Job receipts report saved lists, settled costs and refunds. Drafting does not
send. Replies and campaign control follow their existing explicit-instruction,
permission and action-precondition requirements.

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

For the hosted plugin, connect through the host's OAuth flow and approve the
requested workspace permissions. Existing grants remain in effect; reconnect
only if additional scopes are needed. This path does not require the local CLI.

For the optional local CLI and stdio server, Node.js 24 and macOS Keychain or Linux Secret Service are required. Windows is
not supported in this release.

```bash
npx --yes @dmfaster/cli@2.9.0 auth login --json
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
