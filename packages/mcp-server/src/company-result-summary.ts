import type { AgentToolDataMap, AgentToolResult } from "@dmfaster/sdk";

// Preserve the full typed result once, in structuredContent, rather than sending
// every company and profile twice to the model. Other tool receipts are unchanged.
export function companyResultSummary(result: AgentToolResult): string | null {
  if (
    ![
      "companies.filters",
      "companies.search",
      "company.inspect",
      "companies.evidence.start",
      "companies.evidence.advance",
      "companies.evidence.status",
      "companies.evidence.results",
      "companies.evidence.cancel",
    ].includes(result.tool)
  )
    return null;
  if (!result.ok) return result.error?.message || "Company data unavailable.";
  if (!result.data) return "Company data is available in structuredContent.";
  if (result.tool.startsWith("companies.evidence.")) {
    const page = result.data as AgentToolDataMap["companies.evidence.results"];
    const firstPage =
      result.tool === "companies.evidence.start" &&
      page.view === "matches" &&
      page.companies.length > 0
        ? " Show the returned matches now; use companies_evidence_results only for additional pages or later discoveries."
        : "";
    return `Run ${page.status}; ${page.progress.confirmedMatches} accepted matches so far; ${page.progress.processedCompanies} of ${page.progress.eligibleCompanies} eligible companies processed. This page contains ${page.companies.length} companies (${page.view} view). Market audience total is unavailable. Original evidence and run identity are in structuredContent.${firstPage}`;
  }
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
