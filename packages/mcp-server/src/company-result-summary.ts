import type { AgentToolResult } from "@dmfaster/sdk";
/** Kept for local adapters: text-only hosts receive the same full JSON result. */
export function companyResultSummary(result: AgentToolResult): string | null {
  return result.tool.startsWith("companies.") || result.tool === "company.inspect"
    ? JSON.stringify(result)
    : null;
}
