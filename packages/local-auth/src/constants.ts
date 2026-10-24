export const DEFAULT_DMFASTER_API_URL = "https://app.dmfaster.com";

export const DMFASTER_AGENT_SCOPES = [
  "workspace:read",
  "campaigns:read",
  "sending:read",
  "sending:write",
  "inbox:read",
  "pipeline:read",
  "audiences:read",
  "campaigns:write",
  "campaigns:launch",
  "campaigns:control",
  "inbox:write",
  "pipeline:write",
  "calendar:read",
  "calendar:write",
  "calls:read",
  "calls:transcripts:read",
  "calls:media:read",
  "calls:record",
  "calls:stats:read",
  "events:read",
  "suppressions:write",
  "sandbox:write",
  "calls:write",
  "webhooks:write",
  "leads:read",
  "leads:write",
  "sending:test",
  "feedback:write",
] as const;

export const DMFASTER_AGENT_ACCESS_PROFILES = Object.freeze({
  read: Object.freeze([
    "workspace:read",
    "campaigns:read",
    "sending:read",
    "inbox:read",
    "pipeline:read",
    "calendar:read",
    "calls:read",
    "leads:read",
  ]),
  plan: Object.freeze([
    "workspace:read",
    "campaigns:read",
    "sending:read",
    "inbox:read",
    "pipeline:read",
    "audiences:read",
    "calendar:read",
    "calls:read",
    "leads:read",
  ]),
  draft: Object.freeze([
    "workspace:read",
    "campaigns:read",
    "sending:read",
    "inbox:read",
    "pipeline:read",
    "audiences:read",
    "campaigns:write",
    "calendar:read",
    "calls:read",
    "leads:read",
  ]),
  full: Object.freeze([...DMFASTER_AGENT_SCOPES]),
});

export type DmfasterAgentAccessProfile = keyof typeof DMFASTER_AGENT_ACCESS_PROFILES;

export function isDmfasterAgentAccessProfile(value: unknown): value is DmfasterAgentAccessProfile {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(DMFASTER_AGENT_ACCESS_PROFILES, value)
  );
}

export function getDmfasterAgentScopes(profile: DmfasterAgentAccessProfile = "full") {
  if (!isDmfasterAgentAccessProfile(profile)) {
    throw new TypeError("Unknown DM Faster agent access profile.");
  }
  return [...DMFASTER_AGENT_ACCESS_PROFILES[profile]];
}

export const DMFASTER_CREDENTIAL_EXPIRY_DAYS = 30;
