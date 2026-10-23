# Agent contract changelog

## 2.0.0 — P0 foundation (2026-10-23)

Added: isolated account-linked sandbox workspaces, synthetic inbound/clock/provider controls (P0-1); encrypted, ordered event replay, signed webhook delivery and hosted MCP sales-event subscriptions (P0-2); inbox delta cursors, exact filters/counts and meeting filters (P0-3); provider-event hygiene, explicit opt-out rules and protected manual overrides (P0-4); global suppression commands and dispatch enforcement (P0-5); guarded meeting outcomes and closed won/lost metadata (P0-6); meeting links, unlinked inspection and dry-run pipeline reconciliation (P0-7); UTC response timestamps, serverTime, recovery guidance and readiness (P0-8/P0-10).

Changed: Agent 2.0 `replies.list` defaults to the workspace (P0-9). The SDK sends `X-DMFaster-Contract-Version: 2.0`; hosted MCP uses this contract. HTTP clients without that header keep the legacy focus-campaign default. The envelope's `version: 1` is the wire format version; additive `contractVersion: "2.0.0"` identifies domain semantics. Existing tool names remain available. New permissions are opt-in; reconnect/upgrade only for capabilities the owner requests.

Deprecated: prefer `conversations.list` or `pipeline.cards.list` to `replies.list`. Legacy timestamp inputs remain accepted for this major version; responses use UTC milliseconds and Z. Weekday masks use Monday bit 0 through Sunday bit 6; 31 means Monday–Friday.

Rollout: new classification and auto-close are off for existing customers except the explicitly authorized owner. No historical opt-out, classification, meeting or pipeline repair is applied. Live reconciliation is dry-run only; apply is sandbox-only. Meeting stages retain `closed` plus `closedOutcome`, `meetingHeld` and `noShow` to preserve existing board behavior. `awaiting_outcome` is a read projection after scheduled end plus two hours, not a historical mutation. External automatic links only consider newly created events after opt-in and exact identity/domain evidence; ambiguous matches remain unlinked for explicit correction.

Events: human inbox events wait for classification; automatic replies emit their own event. Scope checks are repeated at delivery time. `events:read` initially requires the workspace owner to avoid exposing private call entities to teammates. Meeting-outcome no-show follow-ups use the existing outcome follow-up field. Policy/booking-link/follow-up scheduling tools are P1 and are not promised by this release.

Validation: the owner explicitly selected typecheck/build-only validation. Regression, browser, contract, database, sandbox acceptance and package install suites were skipped after that instruction. This changelog is a source description; STATUS.md records actual merge/deploy/publication evidence.
