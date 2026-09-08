# DM Faster authentication

Use this reference only for the official local CLI and MCP distribution. The
production API origin is `https://app.dmfaster.com`. Node.js 24 is required.

## Supported credential stores

- macOS: Keychain.
- Linux: Secret Service through `secret-tool`.
- Windows: not supported in this release. Authentication fails closed instead
  of writing a plaintext credential.

The CLI and MCP server share the same operating-system credential for the
configured API origin. Never copy that credential into chat, a prompt, a
repository, or MCP configuration.

## Version-pinned CLI

Check the current credential without a global install:

```bash
npx --yes @dmfaster/cli@1.4.0 auth status --json
```

When authentication is required:

```bash
npx --yes @dmfaster/cli@1.4.0 auth login --json
```

The CLI prints an `authorization_required` JSON event and a human-readable
confirmation code, opens the focused DM Faster browser page, and waits. The
human must personally:

1. Sign in with their normal DM Faster account.
2. Compare the browser and CLI confirmation codes.
3. Review the client, device, workspace, expiry, and exact permissions.
4. Approve or deny the request.

The browser never receives the issued agent credential. Continue only after the
CLI emits a verified `authenticated` event. Do not control the approval page for
the human.

Agent 1.0 defines these bounded scopes: `workspace:read`, `campaigns:read`,
`sending:read`, `inbox:read`, `pipeline:read`, `audiences:read`, `campaigns:write`,
`campaigns:launch`, and `campaigns:control`. Login defaults to the `full` profile.
The owner approves this connection once. With `campaigns:control`, explicit user
instructions authorize launch and pause without another approval page per action;
the normal `campaigns:launch` or `campaigns:write` permission is still required.
Existing connections are never upgraded silently. When the owner wants direct
control, use `auth logout` to revoke the stored connection, then
`auth login --access full` to request the new permission. Login deliberately
refuses to overwrite an existing stored credential. The human personally approves
the new connection page; the agent must not operate it for them.

Use `--access read`, `--access plan`, or `--access draft` for smaller grants.
These profiles add operational reads, planning, and private drafts respectively.
All three write/control scopes are owner-only. Connections without
`campaigns:control` retain the per-action browser approval workflow.

If the pinned package is unavailable, report that DM Faster Agent 1.0 is not
installed. Do not search for a private source checkout or fall back to another
credential.

## Overrides

`DMFASTER_API_URL` may select a loopback development server or an explicitly
configured self-hosted HTTPS origin. `DMFASTER_TOKEN` is an already-configured
developer or CI override only. Never ask a person to reveal or paste a PAT,
browser cookie, `dmf_session` cookie, or `wtoken_...` browser-worker credential.

## Authentication and transport errors

- `401`: credential missing, expired, revoked, or invalid. Check status, then
  start browser login when needed.
- `403`: credential lacks the required membership or scope. Do not retry through
  a more privileged endpoint.
- `404`: resource is outside the credential's workspace or does not exist. Do
  not reveal which case applies.
- `409`: the approved campaign version or operation binding changed. Run the
  exact preflight again; do not bypass the conflict.
- `429`: respect the retry hint and avoid parallel retries.
- MCP startup failure with no credential: authenticate with the pinned CLI,
  then restart or reload the MCP host.
