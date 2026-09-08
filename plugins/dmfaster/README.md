# DM Faster Agent 1.0 plugin

This plugin bundles the canonical DM Faster skill and a version-pinned local
stdio MCP 2026-07-28 server definition. It includes the portable Agent Plugins
1.0 package files at the plugin root, alongside host-specific manifests for
Codex, Claude, and Cursor. Hosts that have not
implemented that revision use the same skill through the version-pinned CLI.

Agent 1.0 exposes 23 bounded domain tools plus an optional portable MCP Apps
campaign workspace. It can inspect a live workspace, resolve
industries, validate stateless campaign plans, preview exact audiences, prepare
private lists and campaign drafts idempotently, and launch or pause a campaign
only after the owner approves the exact campaign version in DM Faster. It does
not send replies, book meetings, expose provider credentials, or bypass the
browser extension's execution boundary.

A first-time paid user can state the campaign goal without learning DM Faster's
screens or tool names. The agent carries the plan through validation, exact
audience preview, and private draft preparation. If browser-based sending is not
ready, launch preflight returns one machine-readable setup link and an exact
resume call; the user only completes the browser-store installation/link and
the final campaign approval that browsers and DM Faster must keep human-owned.

Compliant MCP Apps hosts can render the campaign workspace inline. Modern
headless hosts use the same complete campaign state and 23 domain tools without
losing any server capability or safety guarantee; older clients do not receive
a legacy MCP downgrade.

## Release status

This source targets the version-pinned 1.2.0 packages. Changes in this private
canonical directory do not reach installed users until they are synchronized to
the approved public repository and released.

Do not point users at the private monorepo as a public marketplace. Synchronize
this plugin directory to the approved public repository after package, privacy,
and platform review. That repository can act as a Codex/ChatGPT desktop repo
marketplace and a Claude Code marketplace. It is not a universal
ChatGPT/Codex Plugins Directory submission: that directory requires a publicly
hosted MCP endpoint, while Agent 1.0 intentionally runs the version-pinned local
stdio server.

Repository maintainers must follow the [agent distribution release
runbook](../../docs/runbooks/agent-distribution-release.md). Package publication
and plugin publication are separate approved releases.

## Authentication

Node.js 24 and macOS Keychain or Linux Secret Service are required. Windows is
not supported in this release.

```bash
npx --yes @dmfaster/cli@1.2.0 auth login --json
```

The default `full` profile supports the complete campaign-agent workflow. Use
`--access read`, `--access plan`, or `--access draft` to grant a smaller
credential. Tool availability never replaces server-side scope enforcement.

The human signs in with their normal DM Faster account, compares the browser and
CLI confirmation codes, reviews the workspace and exact permissions, and
personally approves or denies the request. The CLI and MCP server then share the
operating-system credential. Launch and pause require another, action-specific
approval; login permission alone never authorizes either action.

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
