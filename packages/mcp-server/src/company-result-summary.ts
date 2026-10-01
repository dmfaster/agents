import type { AgentToolDataMap, AgentToolResult } from "@dmfaster/sdk";

// Preserve the full typed result once, in structuredContent, rather than sending
// every company and profile twice to the model. Other tool receipts are unchanged.
export function companyResultSummary(result: AgentToolResult): string | null {
  if (!["companies.filters", "companies.search", "company.inspect"].includes(result.tool))
    return null;
  if (!result.ok) return result.error?.message || "Company data unavailable.";
  if (!result.data) return "Company data is available in structuredContent.";
  if (result.tool === "companies.search") {
    const page = result.data as AgentToolDataMap["companies.search"];
    return page.totalExact === true && Number.isSafeInteger(page.total)
      ? `${page.total.toLocaleString("en-US")} companies match. Page ${page.page} contains ${page.companies.length} companies. Full rows, filters and pagination identity are in structuredContent.`
      : "The exact company count is unavailable. Do not use an approximate total.";
  }
  if (result.tool === "company.inspect") {
    const { profile } = result.data as AgentToolDataMap["company.inspect"];
    return `Profile for ${profile.name} (${profile.country}). Full evidence and revision are in structuredContent.`;
  }
  return "Country-specific company filters and availability are in structuredContent.";
}
