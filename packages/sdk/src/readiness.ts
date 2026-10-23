import type { AgentToolResult } from "./contracts.ts";

type ReadinessTool = "calendar.status" | "senders.inspect";
type Row = Record<string, unknown>;
function record(value: unknown): Row {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Row) : {};
}
function rows(value: unknown): Row[] {
  return Array.isArray(value) ? value.map(record) : [];
}
function timestamp(value: unknown): string | null {
  if (typeof value !== "string" || !Number.isFinite(Date.parse(value))) return null;
  return new Date(value).toISOString();
}

/** Uses the same authorized read tools in hosted MCP, local MCP and CLI. */
export async function inspectAgentReadiness(input: {
  scopes: readonly string[];
  isOwner: boolean;
  expiresAt: string | null;
  read: (tool: ReadinessTool) => Promise<AgentToolResult>;
  now?: number;
}) {
  const now = input.now ?? Date.now();
  const unavailable: Array<{ tool: ReadinessTool; reason: string }> = [];
  async function read(tool: ReadinessTool, scope: string) {
    if (!input.isOwner || !input.scopes.includes(scope)) {
      unavailable.push({ tool, reason: !input.isOwner ? "owner_required" : "insufficient_scope" });
      return null;
    }
    try {
      const result = await input.read(tool);
      if (!result.ok || !result.data) {
        unavailable.push({ tool, reason: result.error?.code || "read_unavailable" });
        return null;
      }
      return { data: record(result.data), artifacts: rows(result.artifacts) };
    } catch {
      unavailable.push({ tool, reason: "read_unavailable" });
      return null;
    }
  }
  const [calendar, senders] = await Promise.all([
    read("calendar.status", "calendar:read"),
    read("senders.inspect", "sending:read"),
  ]);
  const profiles = rows(senders?.data.browserProfiles);
  const offlineTimes = profiles
    .filter((p) => p.online === false)
    .map((p) => timestamp(p.lastSeenAt))
    .filter((at): at is string => Boolean(at))
    .sort();
  const expiry = timestamp(input.expiresAt);
  return {
    expiresInDays: expiry ? Math.max(0, Math.ceil((Date.parse(expiry) - now) / 86_400_000)) : null,
    readiness: {
      observedAt: new Date(now).toISOString(),
      calendar: calendar
        ? {
            connected: calendar.data.connected === true,
            setupUrl: String(calendar.data.setupUrl || ""),
          }
        : null,
      gmail: rows(senders?.data.mailboxes)
        .filter((row) => row.provider === "gmail")
        .map((row) => ({
          mailboxId: String(row.id),
          canSend: row.canSend === true,
          needsReauthorization: row.needsReauthorization === true,
          setupUrl: String(
            senders?.artifacts.find((a) => a.service === "gmail" && a.mailboxId === row.id)
              ?.setupUrl || "",
          ),
        })),
      sms: senders
        ? {
            available: record(senders.data.sms).available === true,
            configured: record(senders.data.sms).configured === true,
            enabled: record(senders.data.sms).enabled === true,
          }
        : null,
      browserWorkers: senders
        ? {
            online: profiles.filter((p) => p.online === true).length,
            offline: profiles.filter((p) => p.online === false).length,
            staleSince: offlineTimes[0] || null,
            setupUrl: String(senders.data.browserSetupUrl || ""),
          }
        : null,
      unavailable: unavailable.sort((a, b) => a.tool.localeCompare(b.tool)),
    },
  };
}
