# Appointment setter in 15 minutes

This is a guided sandbox setup, not permission to contact prospects. Browser approval time and provider setup may take longer. Discover the current input schema with the host's tool discovery or `dmfaster describe`; copy returned IDs and versions instead of inventing them. Use the same domain tools through hosted MCP, local MCP or the CLI.

## Minutes 0–3: connect and isolate

Connect at https://app.dmfaster.com/mcp using the host's OAuth flow. Let the owner choose the workspace and grant only the needed permissions. Inspect `connection_status` and its readiness/setup URLs. A granted calendar scope is not a connected calendar. Never collect tokens or browser cookies in chat.

Create an account-linked workspace with `workspace_sandbox_create`, then reconnect choosing that sandbox. Confirm `connection_status.workspace.isSandbox` is true before any exercise. Call `sandbox_seed` with preset `appointment_setter_v1` and a stable idempotency key. It supplies 50 synthetic conversations and mixed meeting lifecycles. Sandbox providers record fake receipts; do not reconnect a real provider to make a fake scenario pass.

## Minutes 3–6: prepare an approved reply

Use `reply_templates_create` to propose exact owner-reviewed text with only supported variables. For example, a Finnish scheduling reply can say “Kiitos! Katsotaan sopiva aika.” Do not invent pricing, commission terms or privacy assurances. Have the owner approve the version at the returned URL; the agent must not operate the approval page.

Read `reply_policy_get`, then propose the desired policy with `reply_policy_update`, its current revision and a new idempotency key. Start disabled, with Europe/Helsinki Monday–Friday 08:00–18:00, 25 replies/day, 2/thread/day and confidence at least 0.8. Explicitly select the approved template, allowed channels and interested/meeting-intent categories. Exclude opt-outs and free text. Only the owner's browser approval activates the requested version. Re-read the effective policy before relying on it. Even the owner workspace does not get an enabled policy automatically.

## Minutes 6–10: receive and handle an event

Establish a `conversations_changes` watermark and save its cursor. Subscribe to relevant events using `webhooks_create` or supported hosted MCP Events, or poll `events_list` in sequence order. Webhook URLs must be owner-controlled; keep the signing secret private, verify the raw-body signature and five-minute freshness, and deduplicate by event ID. Acknowledge only after durable processing. Persist the next cursor only after processing every returned page.

Inspect a synthetic conversation, then call `sandbox_inbound_simulate` with kind human and text “Kiinnostaa, milloin sopisi?”. After classification, recover its `inbox.message.received` event. Inspect the conversation again for the current version, suppression state, meeting state and actual ask. Submit `conversation_reply` using the approved template and one durable key. Check `policyDecision`: `auto_allowed` authorizes that template; `approval_required` creates a draft for the owner. Inspect `conversation_reply_inspect` before calling it delivered. Retries keep the original key and payload. Never set `ownerApproved:true` unless the user actually approved that exact free text.

## Minutes 10–15: book and close the loop

Read `calendar_availability` and choose two returned `suggestedSlots`, preserving their timezone and Finnish/English display strings. For a synthetic prospect without an email address, use `calendar_booking_link_create` with the inspected conversation version, an approved bounded window, expiry and single use. Choose Google Meet, phone, in-person or an approved custom URL; Teams requires a supplied Teams URL. Keep the secret link private. Creating a link does not send it.

Open only the sandbox link, enter synthetic details, and inspect the resulting meeting, conversation and pipeline. The provider remains fake. Use `sandbox_clock_advance` to exercise due work. Record an outcome with `call_outcome_set` only for the explicit simulated scenario; a past timestamp alone does not establish attendance. Report observed receipts and any unresolved operation. These steps are a recipe, not a claim that the release's acceptance suite ran.

## Recipe: triage overnight replies

At the next owner-configured working period, check readiness and credential expiry, replay events from the saved cursor, then read `conversations_list` with exact intent/interest/needs-reply filters. Page until `nextCursor` is absent; `filteredTotal` is exact for that query. `scopeStats` describes the campaign/channel/mailbox/search scope before status and interest filters. Do not use it as the filtered workload.

Prioritize explicit opt-outs, then imminent meeting changes and human questions. Reactions/system events do not require a reply. Stop outreach on opt-out and preserve suppression; never try another channel. For each positive thread, inspect fresh versions and existing bookings before drafting. Use an approved template only within policy, otherwise save a draft for owner review. Summarize the remaining count and oldest unanswered time. Do not bulk-close positive threads to reduce the count.

## Recipe: propose two slots

Read the conversation's ask and the connected booking calendar. Request availability in the prospect timezone and offer two actual returned slots in the prospect's language, using a permitted template or exact-content owner approval. Availability is not a reservation. If neither works, request another bounded window. A booking link is optional and must not be posted without reply authority. Inspect the meeting receipt and `meeting.booked` event before counting a booking.

## Recipe: rebook a no-show

Confirm the recorded no-show outcome; `awaiting_outcome` is missing evidence, not a no-show. Inspect the follow-up and current meeting revision. Propose two new slots through the same policy/approval boundary. Use `calendar_meeting_reschedule` only for approved exact details, or create a new one-use link when appropriate. Keep the original idempotency key after an ambiguous response and reconcile pending calendar operations before another mutation. Do not cancel an event merely to clear a pending local receipt.

## Recipe: weekly agent-versus-human scoreboard

Use one explicit UTC from/to interval corresponding to the reporting week in the chosen timezone. Query `analytics_summary` with scope range and groupBy actor/channel. Report sent, reachedCompanies, humanReplies, positiveReplies, medianFirstResponseMinutes, meetingsBooked, meetingsHeld, noShows, won and lost separately. Compare only `canonicalMetrics` with matching date and campaign bounds across tools; legacy fields have older definitions. Historical actors remain unknown. Do not relabel unattributed activity as agent or Max.

Response-time statistics use Monday–Friday 08:00–18:00 in the prospect timezone, falling back to Europe/Helsinki; holidays and policy exceptions are not modeled and unanswered threads are excluded. Bookings are actual CRM meetings, not pipeline labels. Read `copy_performance` coverage before comparing variants; incomplete attribution and small samples do not establish a winner.

## Campaign start, resume and time settings

There is no separate resume tool. `campaign_launch` on a paused campaign follows the normal Start path after a fresh launch preflight, creating a new durable run generation. It reconciles reusable queued work, can restart eligible failed work, and retains confirmed-send deduplication. It does not promise to preserve every old run-scoped copy override or replay already delivered messages. Inspect the returned operation, queue and run ID. A retry of the same command uses its original authorization/key; a genuinely new launch needs a new preflight. Neither a positive reply nor a saved draft authorizes launch.

Weekday masks use Monday=1, Tuesday=2, Wednesday=4, Thursday=8, Friday=16, Saturday=32, Sunday=64; Monday–Friday is 31. Window endpoints are minutes since local midnight. Use the campaign's prospectTimezone when set and the documented workspace fallback otherwise. Reply policies have their own timezone and hours. A daily capacity estimate is not permission to send outside windows, suppression, provider limits or owner instructions.

## Boundaries and recovery

Knowledge snippets and cached conversation summaries are not released 2.2 tools. Use owner-approved template text and inspect the actual conversation. A customer-facing eval package and the 40% schema-size target remain follow-ups; do not advertise passing evals or reduced discovery payloads.

`credential.expiring` reports impending expiry. Hosted OAuth hosts may renew through the supported OAuth flow. The local device credential has no refresh token: use `auth status` and follow the documented reconnect guidance. A replacement login may require `auth logout` first; the owner confirms the new browser connection. No `auth refresh` command is advertised. Provider reauthorization remains separate.

Historical suppression, classification, duplicate merging, copy attribution and pipeline repairs require a separate reviewed dry run and owner approval. No recipe authorizes live backfills or real-prospect development tests. Never broaden grants or use Ops/private interfaces as a workaround for a customer's public connection.
