import type { AgentToolDataMap } from "@dmfaster/sdk";
import { identity, text, type CompanyPage, type CompanyRow } from "./companies-data.ts";
// Exhaustive against the generated contract without bundling its server schemas.
const countries: Record<CompanyRow["country"], true> = {
  FI: true,
  NO: true,
  EE: true,
  SE: true,
  DK: true,
  UK: true,
  IE: true,
  AE: true,
  AT: true,
  BE: true,
  CA: true,
  NL: true,
  NZ: true,
  ES: true,
  FR: true,
  HK: true,
  IL: true,
  LV: true,
  LT: true,
  IT: true,
  CH: true,
  PT: true,
  SA: true,
  SG: true,
  IS: true,
  AU: true,
  DE: true,
  US: true,
  ZA: true,
};

export type SavedCompanyList = AgentToolDataMap["companies.list.inspect"];

export function savedCompanyRow(value: Record<string, unknown>): CompanyRow {
  const match = text(value.profileId).match(/^(?:company:)?enterprise-company:([a-z]{2}):(.+)$/i);
  const country = match?.[1]?.toUpperCase() as CompanyRow["country"];
  if (!match || !Object.hasOwn(countries, country) || !text(value.name) || !match[2])
    throw new Error("The saved company identity is unavailable.");
  return {
    ...value,
    country,
    businessId: match[2],
    name: text(value.name),
    websiteUrl: text(value.externalUrl),
  };
}

// Normalize only for the reusable table. Host/model context retains the saved
// list identity and version; this is never presented as an inventory search.
export function savedListPage(data: SavedCompanyList, offset = 0, limit = 20): CompanyPage {
  if (
    !data ||
    !data.listId ||
    !data.name ||
    !data.expectedUpdatedAt ||
    !Number.isSafeInteger(data.total) ||
    data.total < 0 ||
    !Array.isArray(data.companies) ||
    !Number.isSafeInteger(offset) ||
    offset < 0 ||
    !Number.isSafeInteger(limit) ||
    limit < 1 ||
    limit > 100 ||
    data.companies.length !== Math.min(limit, Math.max(0, data.total - offset)) ||
    data.nextOffset !== (offset + limit < data.total ? offset + limit : null)
  )
    throw new Error("The exact saved shortlist or its pagination is unavailable.");
  const companies = data.companies.map(savedCompanyRow);
  if (new Set(companies.map(identity)).size !== companies.length)
    throw new Error("The saved shortlist contains duplicate companies.");
  return {
    companies,
    total: data.total,
    totalExact: true,
    filters: { countries: [...new Set(companies.map((c) => c.country))] },
    page: Math.floor(offset / limit) + 1,
    pageSize: limit,
    expectedRevision: data.expectedUpdatedAt,
    querySignature: `saved-list:${data.listId}`,
    hasNextPage: data.nextOffset !== null,
    ...(data.nextOffset !== null ? { nextCursor: String(data.nextOffset) } : {}),
    savedListId: data.listId,
    savedListName: data.name,
  };
}
