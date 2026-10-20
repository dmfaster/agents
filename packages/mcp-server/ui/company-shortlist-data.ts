import type { AgentToolDataMap, AgentToolInputMap } from "@dmfaster/sdk";
import type { McpAppBridge } from "./bridge.ts";
import { identity, readData, type CompanyDetail, type CompanyRow } from "./companies-data.ts";
import { savedCompanyRow } from "./company-saved-list.ts";

export type ShortlistRequest = AgentToolInputMap["companies.list.prepare"];
export type Shortlist = AgentToolDataMap["companies.list.prepare"];

export function checkedSelection(rows: CompanyRow[], count: number): CompanyRow[] {
  if (
    !Number.isSafeInteger(count) ||
    count < 1 ||
    count > 50 ||
    rows.length !== count ||
    new Set(rows.map(identity)).size !== count
  )
    throw new Error("The results changed. Reopen selection and try again.");
  return rows;
}

// Freeze both the identities and inspected revisions before attempting a write.
// The caller retains this exact request across ambiguous transport failures.
export async function inspectShortlist(
  bridge: Pick<McpAppBridge, "callTool">,
  rows: CompanyRow[],
  name: string,
  isCurrent: () => boolean = () => true,
): Promise<ShortlistRequest> {
  checkedSelection(rows, rows.length);
  if (!name.trim() || name.trim().length > 120) throw new Error("Enter a shortlist name.");
  const companies: ShortlistRequest["companies"] = [];
  for (let offset = 0; offset < rows.length; offset += 4) {
    if (!isCurrent()) throw new Error("The selection changed. Review it before saving.");
    const batch = await Promise.all(
      rows.slice(offset, offset + 4).map(async (row) => {
        const detail = readData<CompanyDetail>(
          await bridge.callTool("company_inspect", {
            country: row.country,
            businessId: row.businessId,
          }),
        );
        if (identity(detail.profile) !== identity(row) || !/^[a-f0-9]{64}$/.test(detail.revision))
          throw new Error("Company details changed. Inspect the company again.");
        return {
          country: row.country,
          businessId: row.businessId,
          expectedRevision: detail.revision,
        };
      }),
    );
    companies.push(...batch);
  }
  if (!isCurrent()) throw new Error("The selection changed. Review it before saving.");
  return { name: name.trim(), companies, idempotencyKey: `ui:${crypto.randomUUID()}` };
}

export function verifiedShortlist(value: unknown, request: ShortlistRequest): Shortlist {
  const result = readData<Shortlist>(value);
  const expected = request.companies.map(identity).sort();
  const actual = result.companies?.map(savedCompanyRow).map(identity).sort();
  if (
    !result.listId ||
    !result.expectedUpdatedAt ||
    result.name !== request.name ||
    result.total !== expected.length ||
    JSON.stringify(actual) !== JSON.stringify(expected)
  )
    throw new Error("The saved shortlist could not be verified. Retry to check the same list.");
  return result;
}
