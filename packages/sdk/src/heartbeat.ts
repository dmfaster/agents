import { AGENT_CONTRACT_VERSION, AGENT_TOOL_POLICIES } from "./generated/tools.ts";
const record = (v: unknown): v is Record<string, unknown> =>
  Boolean(v && typeof v === "object" && !Array.isArray(v));
/** Echoed identity/status/dryRun stay in the request. serverTime is the accepted
 * heartbeat timestamp (including an advanceable sandbox clock). Full failures
 * retain actionable errors. SDK callers receive the conventional envelope. */
export function compactHeartbeatResult(tool: string, input: unknown, value: unknown) {
  if (
    tool !== "agent.heartbeat" ||
    (record(input) && input.responseMode === "full") ||
    !record(value) ||
    value.ok !== true ||
    !record(value.data)
  )
    return null;
  const data = value.data,
    at = data.at ?? value.serverTime;
  if (
    !Number.isSafeInteger(data.nextInSeconds) ||
    Number(data.nextInSeconds) < 0 ||
    typeof at !== "string" ||
    !Number.isFinite(Date.parse(at))
  )
    return null;
  return {
    ok: true as const,
    serverTime: new Date(at).toISOString(),
    contractVersion: AGENT_CONTRACT_VERSION,
    data: { nextInSeconds: data.nextInSeconds as number },
  };
}
export function expandHeartbeatResult(tool: string, input: unknown, value: unknown): unknown {
  if (tool !== "agent.heartbeat" || !record(value) || "version" in value) return value;
  if (
    !record(input) ||
    typeof input.agentId !== "string" ||
    !["idle", "working", "degraded"].includes(String(input.status)) ||
    value.contractVersion !== AGENT_CONTRACT_VERSION ||
    Object.keys(value).sort().join() !== "contractVersion,data,ok,serverTime" ||
    !record(value.data) ||
    Object.keys(value.data).join() !== "nextInSeconds"
  )
    return value;
  const compact = compactHeartbeatResult(tool, {}, value);
  if (!compact) return value;
  return {
    version: 1,
    tool: "agent.heartbeat",
    policy: AGENT_TOOL_POLICIES["agent.heartbeat"],
    ...compact,
    generatedAt: compact.serverTime,
    durationMs: 0,
    evidence: [],
    consistency: { status: "verified", checks: [] },
    data: {
      ...compact.data,
      agentId: input.agentId,
      status: input.status,
      dryRun: input.dryRun === true,
      at: compact.serverTime,
    },
    artifacts: [],
    error: null,
  };
}
