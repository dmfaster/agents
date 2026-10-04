import type { AgentToolDataMap, AgentToolResult } from "@dmfaster/sdk";
import type { CompanyRow } from "./companies-data.ts";

export type EvidencePage = AgentToolDataMap["companies.evidence.results"];
export type EvidenceCompany = EvidencePage["companies"][number];
export type EvidenceResult = AgentToolResult<EvidencePage>;

export function completeEvidencePage(value: EvidencePage): EvidencePage {
  if (
    !value ||
    value.total !== null ||
    value.totalExact !== false ||
    value.totalStatus !== "unavailable"
  )
    throw new Error("Website evidence cannot establish an exact market total.");
  if (
    typeof value.runId !== "string" ||
    !value.runId ||
    typeof value.expectedRevision !== "string" ||
    !value.expectedRevision ||
    typeof value.querySignature !== "string" ||
    !value.querySignature ||
    !Array.isArray(value.companies) ||
    !Array.isArray(value.appliedCriteria) ||
    !value.progress ||
    typeof value.hasNextPage !== "boolean" ||
    typeof value.nextCursor !== "string"
  )
    throw new Error("The evidence run is missing its progress or pagination identity.");
  const progressKeys = [
    "checkedPassages",
    "confirmedMatches",
    "contradictedCompanies",
    "eligibleCompanies",
    "enqueuedCompanies",
    "missingEvidenceCompanies",
    "pendingCompanies",
    "processedCompanies",
    "processingCompanies",
    "retryingCompanies",
    "staleEvidenceCompanies",
    "unresolvedCompanies",
  ] as const;
  if (
    progressKeys.some(
      (key) => !Number.isSafeInteger(value.progress[key]) || value.progress[key] < 0,
    )
  )
    throw new Error("The exact evidence processing progress is unavailable.");
  if (
    value.country !== "FI" ||
    typeof value.query !== "string" ||
    typeof value.scanComplete !== "boolean" ||
    typeof value.awaitingMoreResults !== "boolean" ||
    !value.appliedFilters ||
    !["initializing", "running", "complete", "cancelled", "stale"].includes(value.status) ||
    !["matches", "unresolved", "all"].includes(value.view) ||
    value.companies.length > 100
  )
    throw new Error("The saved evidence run state is unavailable.");
  if (
    value.companies.some(
      (c) =>
        c.country !== "FI" ||
        !c.businessId ||
        !c.name ||
        typeof c.matches !== "boolean" ||
        !Array.isArray(c.criteria) ||
        !Array.isArray(c.passages),
    )
  )
    throw new Error("The saved evidence company identity is unavailable.");
  if (
    value.companies.some(
      (c) =>
        c.criteria.some((j) => !j || !Array.isArray(j.evidence)) ||
        [...c.passages, ...c.criteria.flatMap((j) => j.evidence)].some(
          (q) =>
            !q ||
            typeof q.url !== "string" ||
            typeof q.heading !== "string" ||
            typeof q.text !== "string" ||
            !q.text ||
            typeof q.contentHash !== "string" ||
            !Number.isFinite(Date.parse(q.observedAt)),
        ),
    )
  )
    throw new Error("The original website evidence is unavailable.");
  return value;
}

export function evidenceCompanyRow(company: EvidenceCompany): CompanyRow {
  if (company.country !== "FI") throw new Error("Unsupported evidence market.");
  return {
    country: company.country,
    businessId: company.businessId,
    name: company.name,
    websiteUrl: company.websiteUrl,
  };
}

export function evidenceQuotes(company: EvidenceCompany) {
  const quotes = [...company.criteria.flatMap((c) => c.evidence), ...company.passages];
  const seen = new Set<string>();
  const unique = quotes.filter((q) => {
    const key = JSON.stringify([q.url, q.contentHash, q.heading, q.text]);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  // Show a substantial original context sample before a short navigation fragment.
  // This only orders the display: it does not select supporting citations or
  // change the assessment, source text, coverage, or any classifier input.
  const contextLength = (text: string) => Math.min(600, text.replace(/\s+/gu, "").length);
  return unique.sort((a, b) => contextLength(b.text) - contextLength(a.text));
}

export function evidenceNotes(company: EvidenceCompany) {
  return [
    ...new Set(
      company.criteria.map((criterion) =>
        (
          criterion.reason +
          (criterion.binary && !criterion.binary.coverage.complete
            ? ` The assessment includes ${criterion.binary.coverage.includedPassages} of ${criterion.binary.coverage.retainedPassages} saved passages.`
            : "")
        ).trim(),
      ),
    ),
  ].filter(Boolean);
}

export function evidenceAssessment(company: EvidenceCompany) {
  if (company.matches) return "Accepted match";
  if (company.criteria.some((c) => c.binary?.reviewRequired)) return "Needs review";
  if (company.criteria.length && company.criteria.every((c) => c.binary?.value === false))
    return "Not established";
  return "Unresolved";
}
