import type { AgentToolDataMap, AgentToolInputMap, AgentToolResult } from "@dmfaster/sdk";

export type CompanyPage = AgentToolDataMap["companies.search"];
export type CompanyRow = CompanyPage["companies"][number];
export type CompanyDetail = AgentToolDataMap["company.inspect"];
export type CompanyFilters = AgentToolInputMap["companies.search"]["filters"];
export type FilterMetadata = AgentToolDataMap["companies.filters"];
export type CompanyResult = AgentToolResult<CompanyPage | CompanyDetail>;
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
    throw new Error(
      text(record(result.error).message) || "Could not load company data. Try again.",
    );
  return result.data as T;
}
export function exactPage(page: CompanyPage): CompanyPage {
  if (page.totalExact !== true || !Number.isSafeInteger(page.total) || page.total < 0)
    throw new Error("The exact company count is unavailable. Refresh to try again.");
  if (!Array.isArray(page.companies) || !page.querySignature || !page.expectedRevision)
    throw new Error("The company search is missing its pagination identity. Refresh to try again.");
  return page;
}
export function employees(company: Record<string, unknown>): string {
  const value = numeric(company.employeeCount);
  return value === null ? "—" : value.toLocaleString("en-US");
}
export function revenue(company: Record<string, unknown>): string {
  const value = numeric(company.revenueEur);
  return value === null
    ? "—"
    : new Intl.NumberFormat("en-IE", {
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
