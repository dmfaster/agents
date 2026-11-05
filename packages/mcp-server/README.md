# DM Faster MCP server

The local stdio server and hosted connection are headless. They expose typed DM Faster
operations through the same domain services, scopes, workspace permissions and durable
receipts as the HTTP API and SDK. CRM integrations and Codex Ops controls retain their
separate interfaces and existing grants.

The compact catalog exposes current prospecting entry points plus `connection_status`,
`tools_discover` and `tools_call`. Use discovery with `includeSchema: true` for the exact
input of an operation, then invoke its returned `dispatchTool` with the tool name and input.
`tools_read` handles reads, `tools_write` handles non-destructive writes, and `tools_call`
remains the compatibility dispatcher for other actions and deprecated names.
`DMFASTER_MCP_PROFILE=full` advertises the non-deprecated domain tools directly.

`dmfaster://docs/agents` remains available as a Markdown resource. Optional campaign and
company cards, composer-mention adapters, native forms, HTML resources and preview hosts
are retired. Their presentation operations are superseded by the existing domain tools:

| Retired presentation           | Headless operations                                             |
| ------------------------------ | --------------------------------------------------------------- |
| Campaign editor and workspace  | Discover campaign inspect, draft, validation and planning tools |
| Company workspace and mentions | Company search, suggestions, profiles and saved-list inspection |
| Outreach details forms         | Company timeline, campaign inspection and message/reply reads   |

Exact counts, unavailable-total states, original evidence, revisions and pagination remain
in domain results. A selection never authorizes spending, list changes or sending.

For Codex, Claude and Cursor, prefer the hosted plugin endpoint
`https://app.dmfaster.com/mcp`; it supports modern and 2025-era MCP clients and
uses host OAuth. The host's installed version and connection state determine
actual compatibility. The optional local stdio package below requires MCP
2026-07-28 and the local CLI credential.

For a local host supporting MCP 2026-07-28:

```json
{
  "mcpServers": {
    "dmfaster": {
      "command": "npx",
      "args": ["--yes", "@dmfaster/mcp-server@2.9.0"]
    }
  }
}
```

The strict modern stdio transport rejects 2025-era initialization. Hosts without the
current protocol should use the hosted endpoint or matching CLI; the local server
never silently downgrades.
Production defaults to `https://app.dmfaster.com`. `DMFASTER_API_URL` is a development
or self-hosting override. `DMFASTER_TOKEN` is an explicit developer override and must
never enter chat, tool inputs or logs. Local authentication uses the existing CLI/OS
credential store. Hosted MCP preserves OAuth security declarations and scope challenges.

Successful tools return complete text and structured content. Successful compact heartbeats
remain bounded acknowledgements; full diagnostics are available through the existing full
response mode. Cancellation reaches the domain adapter. Existing permissions, action
preconditions, idempotency keys and server-issued authorizations remain authoritative.
One-time `campaigns:control` grants continue to support explicitly instructed actions;
retiring UI does not introduce another approval page.

Output schemas are omitted from discovery by default to keep the catalog bounded.
Embedders can pass `fullOutputSchemas: true` to `createDmfasterMcpCore`. Input and output
validation run in both modes. `npm run check:agent-catalog` measures the catalog and
checks its existing size budget.

Optional private Instagram research is configured only through named local datasets in
`DMFASTER_INSTAGRAM_EVALUATION_DATASETS`. The existing `instagram_icp_plan`,
`instagram_evaluation_datasets`, `instagram_profiles_evaluate`, `instagram_workspace`,
`instagram_profile_inspect` and `instagram_acquisition_quote` tools remain available.
They return saved decisions, original evidence and exact page counts without an HTML
view. Cached images remain private tool-result metadata. Offline reads never start
providers, spend credits, create customer lists or send. Acquisition quotes use the
normal authenticated domain service and retain its exact permission and credit checks.
These optional local tools are not registered by hosted MCP or the published plugin.

Builds emit only the headless server and clear the previous package output first, so a
rebuild cannot retain retired UI bundles. Building does not publish a package or deploy
Product/Ops; those require their separately authorized release workflows.
