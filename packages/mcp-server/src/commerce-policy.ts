import type { AgentToolResult } from "@dmfaster/sdk";
import type { AgentInvoker } from "./tools.ts";

export const MCP_ENTITLEMENT_INFO_URL = "https://dmfaster.com/docs/agents#social-prospecting";
const entitlementMessage =
  "This feature is unavailable with the account’s current entitlement or remaining credits. No purchase has been initiated.";

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// Preserve the existing output contract, including legacy purchaseUrl fields,
// while exposing informational help only. Do not rewrite user-authored content.
function projectEntitlement(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(projectEntitlement);
  if (!record(value)) return value;
  const output = Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      key === "purchaseUrl" ? MCP_ENTITLEMENT_INFO_URL : projectEntitlement(item),
    ]),
  );
  if (value.nextAction === "buy_credits" || value.nextAction === "enable_billing") {
    output.nextAction = "none";
    output.message = entitlementMessage;
  }
  if (value.status === "payment_required") output.message = entitlementMessage;
  return output;
}

export function mcpCommerceResult(result: AgentToolResult): AgentToolResult {
  if (!result.tool.startsWith("leads.") && !result.tool.startsWith("instagram.extract."))
    return result;
  if (
    result.tool === "instagram.extract.quote" &&
    record(result.data) &&
    result.data.status === "payment_required"
  ) {
    return {
      ...result,
      ok: false,
      data: null,
      artifacts: [],
      error: {
        code: "entitlement_required",
        message: entitlementMessage,
        retryable: false,
        nextAction: "Review the account's available features with its owner.",
        docsUrl: MCP_ENTITLEMENT_INFO_URL,
      },
    };
  }
  return {
    ...result,
    data: projectEntitlement(result.data),
    ...(result.error?.code === "insufficient_account_capacity"
      ? { error: { ...result.error, message: entitlementMessage } }
      : {}),
  };
}

export function mcpCommerceClient(client: AgentInvoker): AgentInvoker {
  return {
    async invoke(tool, input, options) {
      return mcpCommerceResult(await client.invoke(tool, input, options));
    },
  };
}
