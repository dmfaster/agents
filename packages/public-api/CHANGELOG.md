# 2.4.0

Agent 3.0 owner-gated v2:P0-1–11: identities, event delivery, work queue, metrics, runs/controls, budgets, classification, follow-ups, identity graph, health and recorder orchestration/read/analysis/access/deletion. See docs/agent-3.0-release-scope.md in the product repository for owner-accepted P1 deferrals.

## Unreleased — Agent 3.0 recorder foundation (v2:P0-11; partial)

Adds opt-in transcript/media/recording scopes, own-user recorder settings with
versioned dry-run/idempotent writes, authorized bot listing, transcript reads,
recording metadata and audited private media sessions. Transcripts use the
existing call access service, retention fences, content-free audit events and
optional PII redaction. Compact pages are bounded and resumable. Call metadata
is negotiated with `X-DMFaster-Call-Artifacts: 1` to preserve strict older clients.
SDK, CLI and MCP retain structured scope and recovery errors (part of v2:P0-10).

Calendar V2 HTTP/rules modules and fake-provider tests are foundations; live
calendar connection, scheduling, bot commands, search, analysis, confirmation
and lifecycle events are not implemented by this slice. No P0 item is closed.
No package version or response compatibility marker changes until the complete
P0 milestone is ready. No production migration/deployment/publication yet.

Migration 0401 is additive, grants no scopes, and enables recorder eligibility
only for user_d144fee14b087834. Settings default off without consent. Individual
calendar connection and consent remain required. No real bots, prospect messages,
historical repairs or bulk call analysis are part of development verification.
Broad regression/acceptance unverified; focused fake/disposable tests, types,
builds and generator checks are recorded separately in STATUS-V2.md.

# Agent contract changelog

## 2.3.0 — Agent product feedback (2026-10-23)

Added: `feedback.submit` and `feedback.list` with minimal structured reports, optional reproduction context, durable idempotency keys, stable receipts and author/workspace-scoped pagination. Operators can review reports through `ops_product_feedback`. Stored report text is untrusted customer content; a received receipt does not promise a fix.

Compatibility: `feedback:write` is opt-in and owner-only. Existing grants are unchanged; reconnect only when requesting feedback access. The full local login profile includes feedback; policy editing remains a separate opt-in capability. Authorization schemas accept the complete 24-scope catalog.

## 2.2.0 — P2 operating guide (2026-10-23)

Added: registry-generated permission catalog and per-tool required scopes, dynamic domain-tool counts, a sandbox-first appointment-setter quickstart and recipes for overnight triage, two-slot proposals, no-show rebooking and weekly actor scoreboards (P2-2–3). The public AGENTS.md describes the same operating loop.

Fixed: response contractVersion is generated from the same OpenAPI response schema as client output validation, removing the hard-coded server version that the 2.2 private-stage canary rejected. The documentation-only 2.2 release deliberately retains response compatibility version 2.1.0 so existing 2.1 clients keep validating responses. Package/OpenAPI info versions are 2.2.0. The unpromoted artifact was replaced; no 2.2 package had been published. Also fixed the remaining hard-coded 78-tool heading; scopeStats documentation now preserves its selected campaign/channel/mailbox/search scope before status and interest filters. Documented Start/resume run generations, weekday masks and the separate prospect/policy timezones. No new permissions, database migration or automatic customer behavior.

Follow-ups: the 40% schema-reduction target (P2-1), customer eval package/reference agent (P2-4), knowledge CRUD (P2-5), cached summaries (P2-6), per-worker capacity estimates (P2-7) and a local refresh command (P2-8) remain unshipped. Existing credential-expiry events and hosted OAuth refresh remain available; local device credentials require the documented browser replacement flow. No passing eval or universal marketplace claim.

## 2.1.0 — P1 sales workflows (2026-10-23)

Added: owner-approved versioned templates and policies, exact reply drafts with a mobile approval queue, scheduled conversation next actions and inbound cancellation (P1-1–2); versioned live-campaign sequences with SMS and read-only historical enrollment previews (P1-3); single-use booking links, localized slot suggestions, phone/custom/Teams conferences and guarded reschedule/cancel (P1-4); weighted future copy and conservative Bayesian promotion, immutable revision coverage and intervals (P1-5); bounded range analytics with actor/channel/campaign/variant/day/week groups and common canonical metrics (P1-6); 50-item bulk inbox writes, cross-campaign pipeline pages and boards (P1-7); future exact-contact attribution and duplicate alias preservation, plus prepared historical copy/duplicate reports (P1-8).

Compatibility: legacy metric fields remain unchanged; compare `canonicalMetrics` across campaign, pipeline and analytics for the same campaign/date bounds. `policy:write` is opt-in and never silently added. Existing customer inbox automation remains behind the P0 flag, default off except the owner; reply policies themselves start disabled everywhere. Explicit free text on an enabled workspace queues unless the caller supplies the owner-approved exact-content instruction (`ownerApproved:true`); policy templates never bypass suppression.

Adaptations: Microsoft Graph is unavailable, so Teams requires an owner-supplied Teams URL; custom HTTPS links and phone/in-person are supported. Calendar selection is per booking/link (`calendarId`, primary default); older OAuth grants may only discover primary and receive a calendar-list scope explanation. Meetings owned by the separate Calls calendar connector cannot be mutated through the Agent Google grant. Conservative promotion uses non-overlapping simultaneous Beta(1,1) posterior intervals after seven-day maturity and the configured minimum sample, with complete conversation linkage. At most one experiment per campaign is active; no causal-lift claim. Canonical metrics retain unknown historical actors, use UTC buckets and a stated Monday–Friday 08–18 prospect-timezone response window. Synthetic historical sequence enrollment follows the original channel; cross-channel live future scheduling uses existing target resolution. No customer backfill is applied.

Validation: typecheck/build only under the owner’s speed decision. Acceptance, regression, browser, database and packed-consumer suites were intentionally skipped. Source implementation and rollout evidence are separate; see external STATUS.md.

## 2.0.0 — P0 foundation (2026-10-23)

Added: isolated account-linked sandbox workspaces, synthetic inbound/clock/provider controls (P0-1); encrypted, ordered event replay, signed webhook delivery and hosted MCP sales-event subscriptions (P0-2); inbox delta cursors, exact filters/counts and meeting filters (P0-3); provider-event hygiene, explicit opt-out rules and protected manual overrides (P0-4); global suppression commands and dispatch enforcement (P0-5); guarded meeting outcomes and closed won/lost metadata (P0-6); meeting links, unlinked inspection and dry-run pipeline reconciliation (P0-7); UTC response timestamps, serverTime, recovery guidance and readiness (P0-8/P0-10).

Changed: Agent 2.0 `replies.list` defaults to the workspace (P0-9). The SDK sends `X-DMFaster-Contract-Version: 2.0`; hosted MCP uses this contract. HTTP clients without that header keep the legacy focus-campaign default. The envelope's `version: 1` is the wire format version; additive `contractVersion: "2.0.0"` identifies domain semantics. Existing tool names remain available. New permissions are opt-in; reconnect/upgrade only for capabilities the owner requests.

Deprecated: prefer `conversations.list` or `pipeline.cards.list` to `replies.list`. Legacy timestamp inputs remain accepted for this major version; responses use UTC milliseconds and Z. Weekday masks use Monday bit 0 through Sunday bit 6; 31 means Monday–Friday.

Rollout: new classification and auto-close are off for existing customers except the explicitly authorized owner. No historical opt-out, classification, meeting or pipeline repair is applied. Live reconciliation is dry-run only; apply is sandbox-only. Meeting stages retain `closed` plus `closedOutcome`, `meetingHeld` and `noShow` to preserve existing board behavior. `awaiting_outcome` is a read projection after scheduled end plus two hours, not a historical mutation. External automatic links only consider newly created events after opt-in and exact identity/domain evidence; ambiguous matches remain unlinked for explicit correction.

Events: human inbox events wait for classification; automatic replies emit their own event. Scope checks are repeated at delivery time. `events:read` initially requires the workspace owner to avoid exposing private call entities to teammates. Meeting-outcome no-show follow-ups use the existing outcome follow-up field. Policy/booking-link/follow-up scheduling tools are P1 and are not promised by this release.

Validation: the owner explicitly selected typecheck/build-only validation. Regression, browser, contract, database, sandbox acceptance and package install suites were skipped after that instruction. This changelog is a source description; STATUS.md records actual merge/deploy/publication evidence.

Recorder foundation follow-up (unreleased, partial v2:P0-11): default complete
compact transcript text with a 512 KiB page boundary, explicit segment pages,
opt-in batched transcript reads (ten calls, 1 MiB total), and workspace/call-access
filtered Finnish/English transcript search. Precomputed compact text is written
only for new flagged ingests; older calls are not backfilled. Per-call access,
retention, revocation, redaction and source revision are checked on every read.
No P0 milestone completion or production availability is claimed by this entry.
