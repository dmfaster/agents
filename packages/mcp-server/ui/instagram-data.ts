import type { InstagramEvaluationPage } from "../src/instagram-evaluation.ts";
import type { InstagramWorkspacePayload } from "../src/instagram-workspace.ts";

export type InstagramRow = InstagramEvaluationPage["results"][number];
export type InstagramRows = { page: InstagramEvaluationPage; rows: InstagramRow[] };
export function instagramPayload(value: unknown): InstagramWorkspacePayload | null {
  const raw = value && typeof value === "object" ? (value as Record<string, unknown>) : null;
  const data = raw?.structuredContent ?? raw;
  if (!data || typeof data !== "object") return null;
  const packet = data as InstagramWorkspacePayload;
  if (
    packet.version !== 1 ||
    packet.view !== "dmfaster.instagram_workspace" ||
    !Array.isArray(packet.datasets)
  )
    return null;
  if (packet.evaluation) validateInstagramPage(packet.evaluation);
  return packet;
}
export function validateInstagramPage(page: InstagramEvaluationPage) {
  if (
    !page ||
    !Array.isArray(page.results) ||
    page.results.length > 50 ||
    !Number.isSafeInteger(page.totalProfiles) ||
    page.totalProfiles < 0 ||
    !Number.isSafeInteger(page.offset) ||
    page.offset < 0 ||
    page.scanned !== page.results.length ||
    page.offset + page.scanned > page.totalProfiles ||
    !/^[a-f0-9]{64}$/.test(page.revision) ||
    !/^[a-f0-9]{64}$/.test(page.policyHash) ||
    !page.spec ||
    !Array.isArray(page.spec.criteria) ||
    !(page.nextCursor === null || typeof page.nextCursor === "string")
  )
    throw Error("invalid_instagram_page");
  const counts = { accept: 0, review: 0, exclude: 0, pending: 0 };
  const ids = new Set<string>();
  for (const row of page.results) {
    if (
      !Object.hasOwn(counts, row.status) ||
      !/^\d{1,30}$/.test(row.profileId) ||
      !/^[a-z0-9._]{1,30}$/.test(row.username) ||
      ids.has(row.profileId)
    )
      throw Error("invalid_instagram_row");
    ids.add(row.profileId);
    counts[row.status]++;
  }
  for (const key of Object.keys(counts) as (keyof typeof counts)[])
    if (page.counts[key] !== counts[key]) throw Error("inexact_instagram_page_counts");
}
export function mergeInstagramPage(
  current: InstagramRows | null,
  page: InstagramEvaluationPage,
): InstagramRows {
  validateInstagramPage(page);
  if (!current) {
    if (page.offset !== 0) throw Error("missing_first_instagram_page");
    return { page, rows: page.results };
  }
  if (
    current.page.datasetId !== page.datasetId ||
    current.page.revision !== page.revision ||
    current.page.policyHash !== page.policyHash ||
    current.page.totalProfiles !== page.totalProfiles ||
    page.offset !== current.rows.length ||
    !current.page.nextCursor
  )
    throw Error("stale_instagram_page");
  const ids = new Set(current.rows.map((row) => row.profileId));
  if (page.results.some((row) => ids.has(row.profileId))) throw Error("duplicate_instagram_page");
  return { page, rows: [...current.rows, ...page.results] };
}
export function instagramCounts(rows: InstagramRow[]) {
  return rows.reduce(
    (counts, row) => {
      counts[row.status]++;
      return counts;
    },
    { accept: 0, review: 0, exclude: 0, pending: 0 },
  );
}
export function instagramShortlist(rows: InstagramRow[], selected: ReadonlySet<string>) {
  const byId = new Map(rows.map((row) => [row.profileId, row]));
  return [...selected].map((id) => {
    const row = byId.get(id);
    if (!row || (row.status !== "accept" && row.status !== "review"))
      throw Error("invalid_shortlist_selection");
    return row;
  });
}
function csvCell(value: string) {
  // Preserve literal text while preventing spreadsheet formula execution.
  const literal = /^[\s\uFEFF]*[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${literal.replaceAll('"', '""')}"`;
}
export function instagramShortlistCsv(rows: InstagramRow[]) {
  if (rows.some((row) => row.status !== "accept" && row.status !== "review"))
    throw Error("invalid_shortlist_selection");
  const header = [
    "profileId",
    "username",
    "instagramUrl",
    "modelStatus",
    "reviewRequired",
    "observedAt",
    "reasons",
    "policyHash",
    "evidenceHash",
  ];
  return (
    [
      header.join(","),
      ...rows.map((row) =>
        [
          row.profileId,
          row.username,
          instagramProfileUrl(row.username),
          row.status,
          String(row.status === "review"),
          row.observedAt,
          row.status === "pending" ? "" : row.reasons.join("; "),
          row.policyHash ?? "",
          row.evidenceHash ?? "",
        ]
          .map(csvCell)
          .join(","),
      ),
    ].join("\r\n") + "\r\n"
  );
}
export function instagramProfileUrl(username: string) {
  if (!/^[a-z0-9._]{1,30}$/.test(username)) throw Error("invalid_instagram_username");
  return `https://www.instagram.com/${username}/`;
}
