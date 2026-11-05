import { AGENT_TOOL_NAMES, AGENT_TOOL_SCOPES, AGENT_TOOL_DEFINITIONS } from "@dmfaster/sdk";
export type ConnectionToolsView = "summary" | "names" | "full" | "identity";
/** Default status is bounded independently of catalog size and mailbox count. */
export function projectConnectionStatus(
  status: Record<string, unknown>,
  view: ConnectionToolsView = "summary",
) {
  if (status.status !== "authenticated") return status;
  if (view === "identity") {
    const {
      status: state,
      baseUrl,
      user,
      workspace,
      credential,
      authorizationNote,
      transport,
      credentialSource,
      agent,
    } = status;
    return {
      status: state,
      baseUrl,
      user,
      workspace,
      credential,
      authorizationNote,
      toolsView: view,
      ...(transport ? { transport } : {}),
      ...("credentialSource" in status ? { credentialSource } : {}),
      ...(agent ? { agent } : {}),
    };
  }
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
  const access = {
    grantUrl,
    availabilityBasis: "granted_scopes_only" as const,
    availabilityNote:
      "Tool counts describe granted scopes, not execution readiness. Workspace rollout, owner role, plan, provider setup and resource checks still apply. See toolBlockers when supplied; unlisted tools are not guaranteed ready.",
  };
  if (view === "full") return { ...status, ...access, blockedTools, toolsView: view };
  const {
    scopeEligibleTools: _eligible,
    scopeEligibleMcpTools: _names,
    scopeBlockedTools: _blocked,
    blockedTools: _blockedNames,
    readiness,
    toolBlockers,
    ...base
  } = status;
  if (view === "names")
    return {
      ...base,
      ...access,
      blockedTools,
      ...(toolBlockers ? { toolBlockers } : {}),
      toolsView: view,
      scopeEligibleMcpTools: eligible.map((name) => AGENT_TOOL_DEFINITIONS[name].mcp.name),
    };
  const r = readiness as
    | {
        calendar?: { connected: boolean };
        gmail?: { canSend: boolean }[];
        sms?: { available: boolean };
        browserWorkers?: { online: number };
        unavailable?: { tool: string }[];
      }
    | undefined;
  const senderUnavailable = r?.unavailable?.some((check) => check.tool === "senders.inspect");
  const calendarUnavailable = r?.unavailable?.some((check) => check.tool === "calendar.status");
  return {
    ...base,
    ...access,
    toolsView: view,
    ...(toolBlockers ? { knownToolBlockerCount: Object.keys(toolBlockers as object).length } : {}),
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
          calendarConnected: calendarUnavailable ? null : (r.calendar?.connected ?? null),
          gmailCanSend: senderUnavailable ? null : (r.gmail?.some((m) => m.canSend) ?? null),
          smsAvailable: senderUnavailable ? null : (r.sms?.available ?? null),
          onlineBrowsers: senderUnavailable ? null : (r.browserWorkers?.online ?? null),
          unavailableChecks: r.unavailable?.length || 0,
        }
      : null,
  };
}
