import type { AgentToolDataMap, AgentToolResult } from "@dmfaster/sdk";

// Preserve the full typed result once, in structuredContent, rather than sending
// every company and profile twice to the model. Other tool receipts are unchanged.
export function companyResultSummary(result: AgentToolResult): string | null {
  if (
    ![
      "companies.filters",
      "companies.search",
      "company.inspect",
      "companies.list.inspect",
      "companies.list.prepare",
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
  if (result.tool === "companies.list.inspect" || result.tool === "companies.list.prepare") {
    const list = result.data as AgentToolDataMap["companies.list.inspect"];
    if (!Number.isSafeInteger(list.total) || list.total < 0)
      return "The exact saved company count is unavailable.";
    return `Saved shortlist "${list.name}" contains ${list.total} companies; this page includes ${list.companies.length}. Saved contact routes are snapshots, not verified deliverability. List identity, version and contacts are in structuredContent. No campaign is created or started by saving a shortlist.`;
  }
  if (result.tool.startsWith("companies.evidence.")) {
    const page = result.data as AgentToolDataMap["companies.evidence.results"];
    if (page.companiesIncluded === false)
      return `Run ${page.status}; ${page.progress.confirmedMatches} accepted matches so far; ${page.progress.processedCompanies} of ${page.progress.eligibleCompanies} eligible companies processed. Progress only: company rows and quotations were not fetched. Use companies_evidence_results to inspect matches. Market audience total is unavailable. Run identity, exact progress and usage are in structuredContent.`;
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
      ? `${page.total.toLocaleString("en-US")} companies match the saved filters. Page ${page.page} contains ${page.companies.length} candidates. Offering fit and current contact roles still need qualification. Full rows, filters, source freshness and pagination identity are in structuredContent.`
      : "The exact company count is unavailable. Do not use an approximate total.";
  }
  if (result.tool === "company.inspect") {
    const { profile } = result.data as AgentToolDataMap["company.inspect"];
    return `Profile for ${profile.name} (${profile.country}). Review dated financial history alongside headline figures and verify current contact roles before selection. Website contacts have source URLs but unassigned person ownership. Full evidence and revision are in structuredContent.`;
  }
  return "Country-specific company filters and availability are in structuredContent.";
}
