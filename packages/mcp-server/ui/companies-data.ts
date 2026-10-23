import type { AgentToolDataMap, AgentToolInputMap, AgentToolResult } from "@dmfaster/sdk";

export type CompanyPage = AgentToolDataMap["companies.search"];
export type CompanyRow = CompanyPage["companies"][number];
export type CompanyDetail = AgentToolDataMap["company.inspect"];
export type CompanyFilters = AgentToolInputMap["companies.search"]["filters"];
export type CompanyResult = AgentToolResult<
  CompanyPage | CompanyDetail | AgentToolDataMap["companies.list.inspect"]
>;
export const DEFAULT_COMPANY_FILTERS: CompanyFilters = { countries: ["FI"], activeOnly: true };

export function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
export function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}
export function numeric(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
export function identity(company: { country: string; businessId: string }) {
  return `${company.country}:${company.businessId}`;
}
export function stableKey(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableKey).join(",")}]`;
  if (value && typeof value === "object")
    return `{${Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableKey(item)}`)
      .join(",")}}`;
  return JSON.stringify(value) ?? "null";
}
export function readData<T>(value: unknown): T {
  const envelope = record(value);
  const result = record(envelope.structuredContent ?? value);
  if (envelope.isError || result.ok !== true || !result.data)
    throw new Error(toolErrorMessage(value));
  return result.data as T;
}

export function toolErrorMessage(value: unknown): string {
  const envelope = record(value);
  const result = record(envelope.structuredContent ?? value);
  const error = record(result.error);
  const challenges = record(envelope._meta)["mcp/www_authenticate"];
  // A role/ownership denial can also use insufficient_scope. Only an actual
  // OAuth challenge establishes that reconnecting can resolve that denial.
  if (Array.isArray(challenges)) {
    if (challenges.some((item) => /error="invalid_token"/.test(text(item))))
      return "Reconnect DM Faster in your agent app to renew access.";
    if (challenges.some((item) => /error="insufficient_scope"/.test(text(item))))
      return "Reconnect DM Faster in your agent app and approve the permissions required for this action.";
  }
  return text(error.message) || "Could not load company data. Try again.";
}

// These failures reject this invocation before writing. They cannot establish
// the outcome of an EARLIER ambiguous attempt with the same idempotency key.
export function mutationRejected(value: unknown, domainCodes: readonly string[]): boolean {
  const envelope = record(value);
  const result = record(envelope.structuredContent ?? value);
  return (
    (envelope.isError === true || result.ok === false) &&
    ["unauthorized", "insufficient_scope", "invalid_request", ...domainCodes].includes(
      text(record(result.error).code),
    )
  );
}
export function exactPage(page: CompanyPage): CompanyPage {
  if (page.totalExact !== true || !Number.isSafeInteger(page.total) || page.total < 0)
    throw new Error("The exact company count is unavailable. Refresh to try again.");
  if (!Array.isArray(page.companies) || !page.querySignature || !page.expectedRevision)
    throw new Error("The company search is missing its pagination identity. Refresh to try again.");
  return page;
}
export function employees(company: Record<string, unknown>, locale = "en-US"): string {
  const value = numeric(company.employeeCount);
  return value === null ? "—" : value.toLocaleString(locale);
}
export function revenue(company: Record<string, unknown>, locale = "en-IE"): string {
  const value = numeric(company.revenueEur);
  return value === null
    ? "—"
    : new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "EUR",
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(value);
}
export function externalUrl(value: unknown): string {
  try {
    const url = new URL(text(value));
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}
export function websiteLabel(value: unknown): string {
  const url = externalUrl(value);
  return url ? new URL(url).hostname.replace(/^www\./, "") : "";
}
