# @dmfaster/sdk

Typed Node.js client for DM Faster Agent 1.0. It exposes bounded workspace
inspection, stateless campaign planning, exact audience previews, idempotent
private-draft preparation, and human-approved campaign controls through a
scoped, workspace-bound `dmf_pat_…` token.

> Distribution note: the registry command below works only after this exact
> release is published. Before then, maintainers use the built package from an
> authorized source checkout.

```bash
npm install @dmfaster/sdk@1.0.2
```

Non-loopback endpoints must use HTTPS. The client also refuses HTTP redirects so
the bearer token cannot be forwarded to a different origin.

```ts
import { createDmfasterClient } from "@dmfaster/sdk";

const client = createDmfasterClient({
  baseUrl: process.env.DMFASTER_API_URL!,
  token: process.env.DMFASTER_TOKEN!,
});

const result = await client.invoke("campaigns.list", {
  status: "Running",
  limit: 10,
});
```

Campaign planning calls take the complete latest campaign state. This keeps the
public API stateless while allowing any client to resume, validate, or hand the
plan to another agent. Launch and pause are two-step operations: request a
preflight, let the owner approve the exact campaign version in DM Faster, then
invoke the action with the returned authorization ID and the same idempotency
key. Repeating the exact preflight reads the existing authorization status. A
client-supplied `approved` boolean is never accepted as authorization.

Launch preflight is a discriminated result. `status: "setup_required"` supplies
a human-owned browser setup URL and the exact preflight input to resume while
the campaign remains disabled. `status: "approval_required"` supplies the
version-bound authorization and approval URL. Browser setup never substitutes
for launch approval.

The caller must provide an absolute API base URL and a scoped bearer token.
The SDK sends tool inputs directly to
`POST /api/v1/agent/tools/{toolName}`, applies a bounded timeout, and validates
the shared result envelope before returning it.

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
