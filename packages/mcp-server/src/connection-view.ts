import { AGENT_TOOL_NAMES, AGENT_TOOL_SCOPES, AGENT_TOOL_DEFINITIONS } from "@dmfaster/sdk";
export type ConnectionToolsView = "summary" | "names" | "full";
/** Default status is bounded independently of catalog size and mailbox count. */
export function projectConnectionStatus(
  status: Record<string, unknown>,
  view: ConnectionToolsView = "summary",
) {
  if (status.status !== "authenticated") return status;
  const credential = status.credential as { scopes?: string[] },
    granted = new Set(credential?.scopes || []);
  const eligible = AGENT_TOOL_NAMES.filter((name) =>
    AGENT_TOOL_SCOPES[name].every((scope) => granted.has(scope)),
  );
  const blockedTools = AGENT_TOOL_NAMES.filter((name) => !eligible.includes(name)).map((name) => ({
    name: AGENT_TOOL_DEFINITIONS[name].mcp.name,
    requiredScope: AGENT_TOOL_SCOPES[name].filter((scope) => !granted.has(scope)).join(" "),
  }));
  const grantUrl = new URL(
    "/settings",
    String(status.baseUrl || "https://app.dmfaster.com"),
  ).toString();
  const access = { blockedTools, grantUrl };
  if (view === "full") return { ...status, ...access, toolsView: view };
  const {
    scopeEligibleTools: _eligible,
    scopeEligibleMcpTools: _names,
    scopeBlockedTools: _blocked,
    readiness,
    ...base
  } = status;
  if (view === "names")
    return {
      ...base,
      ...access,
      toolsView: view,
      scopeEligibleMcpTools: eligible.map((name) => AGENT_TOOL_DEFINITIONS[name].mcp.name),
    };
  const r = readiness as
    | {
        calendar?: { connected: boolean };
        gmail?: { canSend: boolean }[];
        sms?: { available: boolean };
        browserWorkers?: { online: number };
        unavailable?: unknown[];
      }
    | undefined;
  return {
    ...base,
    ...access,
    toolsView: view,
    tools: {
      available: eligible.length,
      blocked: AGENT_TOOL_NAMES.length - eligible.length,
      byScope: Object.fromEntries(
        [...granted]
          .sort()
          .map((scope) => [
            scope,
            eligible.filter((name) =>
              (AGENT_TOOL_SCOPES[name] as readonly string[]).includes(scope),
            ).length,
          ]),
      ),
    },
    readinessSummary: r
      ? {
          calendarConnected: r.calendar?.connected ?? null,
          gmailCanSend: r.gmail?.some((m) => m.canSend) ?? null,
          smsAvailable: r.sms?.available ?? null,
          onlineBrowsers: r.browserWorkers?.online ?? null,
          unavailableChecks: r.unavailable?.length || 0,
        }
      : null,
  };
}
