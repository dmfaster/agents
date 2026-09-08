# DM Faster CLI

CLI for DM Faster Agent 1.0. Run the version-pinned package, then authenticate
through the focused DM Faster browser approval page.

> Distribution note: the registry commands below work only after this exact
> release is published. Before then, maintainers use the built CLI from an
> authorized source checkout.

```bash
npx --yes @dmfaster/cli@1.4.0 auth login --json
npx --yes @dmfaster/cli@1.4.0 auth login --access plan --json
npx --yes @dmfaster/cli@1.4.0 auth status --json

npx --yes @dmfaster/cli@1.4.0 analytics summary --scope today --json
npx --yes @dmfaster/cli@1.4.0 workspace briefing --json
npx --yes @dmfaster/cli@1.4.0 campaigns list --status Running --limit 10 --json
npx --yes @dmfaster/cli@1.4.0 replies list campaign_123 --limit 5 --query "Visio" --json
npx --yes @dmfaster/cli@1.4.0 company timeline campaign_123 outreach_456 --json

npx --yes @dmfaster/cli@1.4.0 campaign validate --state campaign-state.json --json
npx --yes @dmfaster/cli@1.4.0 audience preview --state campaign-state.json --json > audience-preview.json
# Review the exact count and sample in audience-preview.json before continuing.
npx --yes @dmfaster/cli@1.4.0 campaign prepare --state campaign-state.json --reviewed-audience audience-preview.json --idempotency-key prepare-001 --json
npx --yes @dmfaster/cli@1.4.0 campaign launch preflight campaign_123 --idempotency-key launch-001 --json
npx --yes @dmfaster/cli@1.4.0 campaign launch campaign_123 --idempotency-key launch-001 --authorization-id agent_action_… --json

npx --yes @dmfaster/cli@1.4.0 auth logout --json
```

`auth login` creates a short-lived PKCE device request, prints a confirmation
code, opens the same request in the user's browser, and polls until the user
approves, denies, or lets it expire. The user must compare the browser and CLI
codes and review the exact workspace, expiry, and permissions. The browser never
receives the issued credential.

Login defaults to the complete `full` profile. Use `--access` to grant only the
needed capability set:

| Profile | Capability                                                                      |
| ------- | ------------------------------------------------------------------------------- |
| `read`  | inspect workspace, campaigns, sending, replies, and pipeline                    |
| `plan`  | `read` plus industry lookup, validation, and exact audience preview             |
| `draft` | `plan` plus private list/campaign preparation and approved pause requests       |
| `full`  | `draft` plus launch/pause on explicit instructions after a one-time owner grant |

The server still checks every exact scope, workspace membership, owner-only
rule, and action authorization. An access profile is a credential ceiling, not
an action approval.

Login emits two newline-delimited JSON events on stdout: first
`authorization_required`, then `authenticated` after a successful exchange.
Human instructions and warnings go to stderr, so scripts can parse stdout
without scraping prose.

Approved credentials are stored in macOS Keychain or Linux Secret Service
(`secret-tool`). Unsupported credential stores fail closed and never write a
plaintext fallback. `auth status` verifies the configured credential with the
server. `auth logout` revokes a stored credential before deleting it locally.

Campaign state files contain the complete latest state returned or confirmed by
the caller. Re-send that state for every validation, audience, or preparation
call; the MCP/API process does not keep a hidden planning session. Preparation
commands create private resources and require stable idempotency keys. They also
require `--reviewed-audience` with the saved, human-reviewed output from the
matching exact preview. The CLI echoes the server-issued audience identity from
that result unchanged; it never derives a signature from the state file.

Agents should assume the user does not know DM Faster's fields or command names:
translate the user's goal into the complete state, ask only for material missing
facts, and carry validation, exact preview, and private draft preparation in
order. `dmfaster --help` includes the same quick-start sequence for CLI-only
hosts.

The `full` connection profile includes `campaigns:control`. After the owner
grants it once, an explicit instruction such as “launch it” is enough. Call
preflight, then execute immediately when it returns `ready`, using the returned
authorization ID and the same campaign ID and idempotency key. The authorization
remains short-lived and bound to the exact campaign version.

Older connections keep per-action browser approval. Reconnect once with
`dmfaster auth logout` followed by `dmfaster auth login --access full` to enable conversational controls, or follow
the returned `approval_required` URL for a single action. Only the human operates
connection and action approval pages. If launch returns `setup_required`, show
`setup.setupUrl` and repeat `setup.resume` after the extension reconnects.

`--json` is accepted anywhere and JSON is the default for every API command.
Run `dmfaster --help` for the complete Agent 1.0 command list. The production
API URL defaults to `https://app.dmfaster.com`.

The CLI also reads `$XDG_CONFIG_HOME/dmfaster/config.json` (or
`~/.config/dmfaster/config.json`):

```json
{
  "baseUrl": "https://app.dmfaster.com"
}
```

Environment variables take precedence. `DMFASTER_API_URL` overrides the base
URL for local development or self-hosting. `DMFASTER_TOKEN` remains an explicit
developer credential override and takes precedence over the operating-system
store; the CLI rejects plaintext token fields in the JSON config. Never paste a
DM Faster token into chat or MCP configuration.

## Import Instagram usernames

Save a reviewed username collection as a private list:

```bash
dmfaster list import --name "Finland Coaches" --file instagram-usernames.csv --json
```

Use a one-column CSV with an optional `username` or `instagram_username` header,
or one username per line. UTF-8 BOM, quoted cells, and CRLF are supported. Up to
1,000 rows and 64 KiB are accepted. Invalid rows reject the whole import. Case
and leading @ are normalized; duplicates are reported and removed. The command
derives a stable retry key from the name and unique usernames; supply a new
`--idempotency-key` to intentionally create another copy.

The SDK equivalent is `client.invoke("list.import", { name, usernames,
idempotencyKey })`. It requires `campaigns:write` and owner access, and is available on all plans including Basic. A successful result contains `listId`, `name`,
`importedCount`, `inputCount`, `duplicateCount`, `created`, and `replayed`.
A changed payload or an edited saved list returns `idempotency_conflict`.
The list is selectable in the campaign builder; no campaign is created and
nothing is sent. Import validates syntax, not live Instagram account existence.

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

Inspect an ongoing campaign with `campaign delivery inspect --input FILE`.
Update cap, pace, or sending hours with `campaign delivery update --input FILE`,
including the inspection revision and an idempotency key. This preserves the run
and audience. Launch and pause return an operation reference; use
`campaign operation inspect --input FILE --wait 30` to wait up to 30 seconds for
its receipt. Pending operations can be inspected again with the same IDs.
Browser acknowledgment and confirmed delivery are separate facts.
