# Reviews, cohorts, historical copy and bookings

This source describes the 1.8.0 candidate. Production and public registry release
must be verified separately before claiming the new tools are available.

## Review coordination and exports

After `companies.fit.start`, save its run ID in a small JSON file:

```json
{ "runId": "fit_RETURNED_ID", "limit": 8 }
```

```bash
npx --yes @dmfaster/cli@1.8.0 companies fit run --input run.json --until-complete --max-seconds 1800
npx --yes @dmfaster/cli@1.8.0 companies fit export fit_RETURNED_ID --output complete-review.json
```

The coordinator writes compact progress to stderr and one final receipt to stdout.
It retries only transient failures, using the same run ID. A time budget returns
that ID and incomplete progress; repeat the same command to resume. An export
requires completion, follows all pages at one version, rejects duplicates or a
changed count/version, and refuses to overwrite an existing file. It never writes
a partial export. Server evidence expires after 30 days.

MCP agents call `companies_fit_run` sequentially with the same ID and respect
`pollAfterMs`. Each call has a bounded server budget; no provider task extension
or continuing server scheduler is claimed. `companies_fit_runs_list` returns a
compound `nextBefore` cursor. Echo it unchanged with the same campaign filter.
`companies_fit_cancel` keeps saved evidence and fences late assessments.

For deeper research, start a new review with the original exact list/campaign
versions and offer, a new key, `unknownsFromRunId` and `maxPages: 5`. The source
must be complete, at most seven days old and on the same unchanged audience.
Known results are reused only with fresh evidence, unchanged website and matching
model. Unknowns receive deeper current website research. Crawling respects robots,
HTTPS, same-site links, private-address restrictions, page/byte/time budgets.

For best-N, call `companies_fit_cohort` with `runId`, `expectedVersion`, `take`
and optional `minimumPriority`. It requires enough evidenced strong/possible
matches; ties retain original list order. Review its selected reasons/citations
and exact exclusions, preview its refinement input, then apply the preview digest
only under the user's audience instruction. The existing refine tool allows at
most 1,000 exclusions; larger changes fail explicitly. No unknown is labelled poor.

## Exact historical copy

`copy_performance` takes exact ISO `from`/`to` instants, optionally `campaignId`,
`limit` (1–25) and `offset`. The window is at most 366 days. It groups actual sent
job text and channel, associates only the first confirmed outreach per conversation,
counts human replies and recorded confirmed calendar bookings, and reports linked
conversation coverage and unattributed legacy sends. Follow-ups and later outreach
are not competing opening variants. An observational rate is not causal proof;
missing links, small samples, unequal elapsed time and later sync limit comparisons.

## Calendar booking and calls

The owner needs `calendar:read` for status/availability and `calendar:write`,
`calendar:read`, `inbox:read`, `pipeline:write` for booking. Existing grants never expand silently.
Use the ordinary human-approved credential upgrade once when scopes are missing.

Availability covers at most seven days, returns 15-minute start increments and
bounded free slots for an allowed duration. Slots are observations; booking checks
availability again through the app's service. Missing busy evidence fails closed.
Timezone is an IANA zone, not a guessed UTC offset. Use the user's working-hour
window rather than proposing every returned night/weekend slot.

`calendar_meeting_book` sends invitations and must follow an explicit instruction
for the exact title, start, timezone, duration and attendees. Supply an inspected
`expectedConversationUpdatedAt` and an 8–120 character idempotency key. The app
checks the conversation's campaign, saves the confirmed meeting and updates the
pipeline. The durable key is bound to all request details before provider I/O.
Exact retries recover a lost receipt; different details return a conflict.
Cancellation or rescheduling is outside this release; do not invent a tool.

`calls_list` and `call_inspect` use `calls:read` and the app's current membership
and capability policy. They return recorded lifecycle, participants and outcomes,
not recording media, transcript artifacts or inferred attendance. The inbox calendar
booking service and the Calls calendar service are distinct existing app services;
this interface does not claim they are a single synchronized record system.
