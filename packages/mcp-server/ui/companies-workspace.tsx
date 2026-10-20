import { useWorkspaceContext } from "./use-workspace-context.ts";
import {
  CompanySelection,
  collectSelection,
  type CompanySelectionScope,
} from "./company-selection.tsx";
import { t, numberLocale } from "./locale.ts";
import { expandCompanyDetails } from "./company-display-mode.ts";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { publicFinnishBusinessId } from "@dmfaster/product-ui";
import type { AgentToolInputMap } from "@dmfaster/sdk";
import type { McpAppBridge } from "./bridge.ts";
import { filterChips } from "./company-filters.tsx";
import { CompanyIcon } from "./company-icon.tsx";
import { CompanyLogo } from "./company-logo.tsx";
import { CompanyProfileDrawer } from "./company-profile-drawer.tsx";
import { ReadCache } from "./read-cache.ts";
import { savedListPage, type SavedCompanyList } from "./company-saved-list.ts";
import {
  DEFAULT_COMPANY_FILTERS,
  employees,
  externalUrl,
  exactPage,
  identity,
  readData,
  revenue,
  stableKey,
  text,
  websiteLabel,
  type CompanyDetail,
  type CompanyFilters,
  type CompanyPage,
  type CompanyResult,
  type CompanyRow,
} from "./companies-data.ts";

type SearchInput = AgentToolInputMap["companies.search"];
const MAX_SELECTED_COMPANIES = 50;
function initialPage(initial?: CompanyResult, limit = 20): CompanyPage | null {
  const data = initial?.ok ? initial.data : null;
  if (!data || !("companies" in data)) return null;
  try {
    if (initial?.tool === "companies.list.inspect")
      return savedListPage(data as SavedCompanyList, 0, limit);
    return exactPage(data as CompanyPage);
  } catch {
    return null;
  }
}
function initialError(initial?: CompanyResult, limit = 20): string {
  if (initial && !initial.ok) return initial.error?.message || "Company access unavailable.";
  const data = initial?.data;
  if (data && "companies" in data) {
    try {
      if (initial?.tool === "companies.list.inspect") {
        savedListPage(data as SavedCompanyList, 0, limit);
        return "";
      }
      exactPage(data as CompanyPage);
    } catch (error) {
      return String((error as Error).message);
    }
  }
  return "";
}

export function CompaniesWorkspace({
  initial,
  initialFilters,
  savedListId,
  savedListPageSize = 20,
  bridge,
  navigation,
  onSelectionChange,
}: {
  initial?: CompanyResult;
  initialFilters?: CompanyFilters;
  savedListId?: string;
  savedListPageSize?: number;
  bridge: McpAppBridge;
  navigation: ReactNode;
  onSelectionChange(companies: CompanyRow[], scope?: CompanySelectionScope): void;
}) {
  const [page, setPage] = useState<CompanyPage | null>(() =>
    initialPage(initial, savedListPageSize),
  );
  const [filters, setFilters] = useState<CompanyFilters>(
    () =>
      initialPage(initial, savedListPageSize)?.filters ?? initialFilters ?? DEFAULT_COMPANY_FILTERS,
  );
  const [row, setRow] = useState<CompanyRow | null>(null);
  const [detail, setDetail] = useState<CompanyDetail | null>(null);
  const [selected, setSelected] = useState<Map<string, CompanyRow>>(() => new Map());
  const [allSelected, setAllSelected] = useState(true);
  const [excluded, setExcluded] = useState<Set<string>>(() => new Set());
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(() => initialError(initial, savedListPageSize));
  const pageRef = useRef(page);
  pageRef.current = page;
  const visibleSelected =
    allSelected && page
      ? new Map(
          page.companies
            .filter((company) => !excluded.has(identity(company)))
            .map((company) => [identity(company), company]),
        )
      : selected;
  useEffect(() => {
    if (searching || searchError || !page) {
      onSelectionChange([]);
      return;
    }
    onSelectionChange(
      [...visibleSelected.values()],
      allSelected && page
        ? {
            count: page.total - excluded.size,
            key: `${page.querySignature}:${page.expectedRevision}:${[...excluded].sort().join("|")}`,
            blocked: page.total - excluded.size > MAX_SELECTED_COMPANIES,
            resolve: async () =>
              (await loadSelection(page.total)).filter(
                (company) => !excluded.has(identity(company)),
              ),
          }
        : undefined,
    );
  }, [selected, allSelected, excluded, page, searching, searchError, onSelectionChange]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [notice, setNotice] = useState("");
  const [contextBusy, setContextBusy] = useState(false);
  const searchGeneration = useRef(0);
  const profileGeneration = useRef(0);
  const contextGeneration = useRef(0);
  const cacheRef = useRef<ReadCache | null>(null);
  if (!cacheRef.current) cacheRef.current = new ReadCache();
  const cache = cacheRef.current;
  const canCall = bridge.canCallTools();
  useWorkspaceContext(
    bridge,
    "audience",
    page && !searching && !searchError
      ? {
          source: savedListId ? "saved_company_list" : "inventory",
          ...(savedListId ? { listId: savedListId, expectedUpdatedAt: page.expectedRevision } : {}),
          querySignature: page.querySignature,
          expectedRevision: page.expectedRevision,
          ...(savedListId ? {} : { filters: page.filters }),
          total: page.total,
          totalExact: true,
          mode: allSelected ? "all_matching_except_exclusions" : "explicit",
          selectedCount: allSelected ? page.total - excluded.size : selected.size,
          excludedCompanyKeys: allSelected ? [...excluded].sort() : [],
          selectedCompanies: allSelected
            ? undefined
            : [...selected.values()].map(({ country, businessId, name }) => ({
                country,
                businessId,
                name,
              })),
          visibleCompanies: page.companies.map(({ country, businessId, name }) => ({
            country,
            businessId,
            name,
          })),
          visiblePageIsFullAudience: false,
          campaignHandoffLimit: MAX_SELECTED_COMPANIES,
        }
      : { status: searching ? "loading" : "unavailable", selectedCount: null },
  );
  useWorkspaceContext(
    bridge,
    "focusedCompany",
    row
      ? {
          country: row.country,
          businessId: row.businessId,
          name: row.name,
          profileStatus: detail ? "loaded" : profileLoading ? "loading" : "unavailable",
          profileRevision: detail?.revision ?? null,
        }
      : null,
  );

  const readPage = useCallback(
    async (input: SearchInput): Promise<CompanyPage> => {
      if (!savedListId)
        return readData<CompanyPage>(await bridge.callTool("companies_search", input));
      const limit = input.pageSize ?? 20;
      const offset = ((input.page ?? 1) - 1) * limit;
      const result = readData<SavedCompanyList>(
        await bridge.callTool("companies_list_inspect", {
          listId: savedListId,
          limit,
          offset,
          ...(input.expectedRevision ? { expectedUpdatedAt: input.expectedRevision } : {}),
        }),
      );
      if (result.listId !== savedListId) throw new Error("The saved shortlist changed. Reopen it.");
      return savedListPage(result, offset, limit);
    },
    [bridge, savedListId],
  );

  const search = useCallback(
    async (input: SearchInput, fresh = false) => {
      input = { ...input, projection: "list" };
      const previous = pageRef.current;
      const generation = ++searchGeneration.current;
      setSearching(true);
      setSearchError("");
      try {
        const next = await cache.read(
          `search:${stableKey(input)}`,
          async () => {
            const result = exactPage(await readPage(input));
            if (
              (input.expectedRevision && result.expectedRevision !== input.expectedRevision) ||
              (input.querySignature && result.querySignature !== input.querySignature) ||
              (previous &&
                input.expectedRevision === previous.expectedRevision &&
                input.querySignature === previous.querySignature &&
                result.total !== previous.total)
            )
              throw new Error("The inventory changed. Refresh the search before continuing.");
            return result;
          },
          fresh,
        );
        if (generation !== searchGeneration.current) return;
        cache.seed(
          `search:${stableKey({ ...input, filters: next.filters, pageSize: next.pageSize })}`,
          next,
        );
        setPage(next);
        setFilters(next.filters);
        if (!input.expectedRevision || !input.querySignature) {
          setSelected(new Map());
          setAllSelected(true);
          setExcluded(new Set());
        }
      } catch (error) {
        if (generation === searchGeneration.current)
          setSearchError(error instanceof Error ? error.message : String(error));
      } finally {
        if (generation === searchGeneration.current) setSearching(false);
      }
    },
    [cache, readPage],
  );

  useEffect(() => {
    searchGeneration.current += 1;
    profileGeneration.current += 1;
    contextGeneration.current += 1;
    const next = initialPage(initial, savedListPageSize);
    setPage(next);
    setFilters(next?.filters ?? initialFilters ?? DEFAULT_COMPANY_FILTERS);
    setSelected(new Map());
    setAllSelected(true);
    setExcluded(new Set());
    setRow(null);
    setDetail(null);
    setNotice("");
    setSearchError(initialError(initial, savedListPageSize));
    setSearching(false);
    if (next && next.page === 1) {
      cache.seed(
        `search:${stableKey({ filters: next.filters, pageSize: next.pageSize, projection: "list" })}`,
        next,
      );
      cache.seed(
        `search:${stableKey({
          filters: next.filters,
          pageSize: next.pageSize,
          projection: "list",
          expectedRevision: next.expectedRevision,
          querySignature: next.querySignature,
        })}`,
        next,
      );
    }
    if (!initial && bridge.canCallTools())
      void search({ filters: initialFilters ?? DEFAULT_COMPANY_FILTERS, pageSize: 20 });
    return () => {
      searchGeneration.current += 1;
      profileGeneration.current += 1;
      contextGeneration.current += 1;
    };
  }, [initial, initialFilters, bridge, cache, search, savedListPageSize]);

  async function loadSelection(count: number) {
    if (!page || count > page.total) throw new Error(t("Exact count unavailable"));
    const current = page;
    const generation = searchGeneration.current;
    let pageNumber = 0;
    let cursor: string | undefined;
    return collectSelection(count, async () => {
      pageNumber += 1;
      const next =
        pageNumber === 1 && current.page === 1
          ? current
          : exactPage(
              await readPage({
                filters: current.filters,
                pageSize: current.pageSize,
                page: pageNumber,
                projection: "list",
                expectedRevision: current.expectedRevision,
                querySignature: current.querySignature,
                ...(cursor ? { cursor } : {}),
              }),
            );
      if (
        generation !== searchGeneration.current ||
        next.expectedRevision !== current.expectedRevision ||
        next.querySignature !== current.querySignature ||
        next.total !== current.total
      )
        throw new Error(t("The results changed. Reopen selection and try again."));
      cursor = next.nextCursor;
      return { ...next, nextCursor: next.hasNextPage ? String(pageNumber + 1) : null };
    });
  }

  const profileKey = (company: CompanyRow) =>
    `profile:${identity(company)}:${page?.expectedRevision ?? ""}`;
  async function inspect(company: CompanyRow, fresh = false) {
    void expandCompanyDetails(bridge);
    const generation = ++profileGeneration.current;
    contextGeneration.current += 1;
    const key = profileKey(company);
    const cached = fresh ? null : (cache.peek<CompanyDetail>(key) ?? null);
    setRow(company);
    setDetail(cached);
    setProfileError("");
    setNotice("");
    setProfileLoading(!cached);
    if (cached) return;
    try {
      const next = await cache.read(
        key,
        async () => {
          const value = readData<CompanyDetail>(
            await bridge.callTool("company_inspect", {
              country: company.country,
              businessId: company.businessId,
            }),
          );
          if (identity(value.profile) !== identity(company) || !value.revision)
            throw new Error(
              "The profile identity did not match the selected company. Retry the profile.",
            );
          return value;
        },
        fresh,
      );
      if (generation === profileGeneration.current) setDetail(next);
    } catch (error) {
      if (generation === profileGeneration.current)
        setProfileError(error instanceof Error ? error.message : String(error));
    } finally {
      if (generation === profileGeneration.current) setProfileLoading(false);
    }
  }
  function back() {
    const previous = row ? identity(row) : "";
    profileGeneration.current += 1;
    contextGeneration.current += 1;
    setRow(null);
    setDetail(null);
    setProfileLoading(false);
    setNotice("");
    requestAnimationFrame(() => {
      [...document.querySelectorAll<HTMLButtonElement>("button[data-company]")]
        .find((button) => button.dataset.company === previous)
        ?.focus();
    });
  }
  function refresh() {
    if (row) {
      void inspect(row, true);
      return;
    }
    setSelected(new Map());
    void search({ filters, pageSize: page?.pageSize ?? 20 }, true);
  }
  async function draftChatRequest() {
    if (!row || !page || searching || searchError || contextBusy) return;
    const generation = ++contextGeneration.current;
    setContextBusy(true);
    setNotice("");
    try {
      await bridge.draftMessage([
        {
          type: "text",
          text: `Help me write an outreach message for ${row.name}. Use the current saved company evidence and ask for missing campaign details. Do not save a campaign or send outreach.`,
        },
        {
          type: "resource_link",
          uri: `dmfaster://companies/${encodeURIComponent(row.country)}/${encodeURIComponent(row.businessId)}`,
          name: row.name,
          mimeType: "application/json",
        },
      ]);
      if (generation === contextGeneration.current)
        setNotice("Chat draft ready. Edit it and press Send in chat.");
    } catch (error) {
      if (generation === contextGeneration.current)
        setNotice(error instanceof Error ? error.message : String(error));
    } finally {
      setContextBusy(false);
    }
  }

  async function useInChat() {
    if (!page || searching || searchError) return;
    const generation = ++contextGeneration.current;
    setContextBusy(true);
    setNotice("");
    try {
      const companies = row ? [row] : [...selected.values()];
      await bridge.updateModelContext({
        content: [
          {
            type: "text",
            text: row
              ? `Discuss ${row.name} (${identity(row)}) using the current company evidence. ${detail ? "The full saved profile is included." : "Only the search summary is available; full profile evidence is still unknown."} Selection is context only, not authorization to save, spend research credits, change data or send messages.`
              : `The user is exploring ${page.total.toLocaleString(numberLocale())} exact matching companies${companies.length ? ` and selected ${companies.length} for discussion` : ""}. This is one bounded search page, not the full inventory. Selection is context only, not authorization to save, spend research credits, change data or send messages.`,
          },
        ],
        structuredContent: {
          type: "dmfaster.company_selection",
          source: savedListId ? "saved_company_list" : "inventory",
          ...(savedListId ? { listId: savedListId, expectedUpdatedAt: page.expectedRevision } : {}),
          ...(savedListId ? {} : { filters: page.filters }),
          total: page.total,
          totalExact: true,
          querySignature: page.querySignature,
          expectedRevision: page.expectedRevision,
          page: page.page,
          pageSize: page.pageSize,
          hasNextPage: page.hasNextPage,
          visibleCompanies: page.companies,
          selectedCompanies: companies,
          profile: row && detail ? detail : null,
          profileStatus: row ? (detail ? "complete" : "summary_only") : "not_requested",
          dataFreshness: page.dataFreshness ?? null,
        },
      });
      if (generation === contextGeneration.current) setNotice("Added to chat context.");
    } catch (error) {
      if (generation === contextGeneration.current)
        setNotice(error instanceof Error ? error.message : String(error));
    } finally {
      setContextBusy(false);
    }
  }
  const resultCountLabel = searching
    ? t("Counting matches…")
    : searchError
      ? t("Exact count unavailable")
      : page
        ? `${page.total.toLocaleString(numberLocale())} ${page.total === 1 ? t("company") : t("companies")}`
        : t("Company data unavailable");
  const contextDisabled = !page || searching || Boolean(searchError) || contextBusy;
  return (
    <main
      className="native-workspace"
      onClick={(event) => {
        const anchor =
          event.target instanceof Element
            ? event.target.closest<HTMLAnchorElement>("a[href]")
            : null;
        if (!anchor || !bridge.canOpenLinks() || !externalUrl(anchor.href)) return;
        event.preventDefault();
        void bridge
          .openLink(anchor.href)
          .catch((error: unknown) =>
            setNotice(error instanceof Error ? error.message : String(error)),
          );
      }}
    >
      <div className="workspace-shell companies-shell">
        {navigation}

        {notice && !row ? (
          <p className="workspace-notice" role="status">
            {t(notice)}
          </p>
        ) : null}
        {!canCall ? (
          <p className="workspace-muted">{t("Continue this search through your assistant.")}</p>
        ) : null}
        <section aria-label={t("Companies")}>
          {savedListId ? (
            <header className="workspace-header">
              <div>
                <h1>{text(page?.savedListName) || t("Saved shortlist")}</h1>
                <p className="workspace-muted">
                  {t("Saved contacts are snapshots. Open a company for its current profile.")}
                </p>
              </div>
            </header>
          ) : (
            <div className="company-filter-chips" aria-label={t("Search criteria")}>
              <span className="company-market">{filters.countries.join(" · ")}</span>
              {filters.q ? <span className="company-filter-chip">{filters.q}</span> : null}
              {filterChips(filters).map((chip) => (
                <span className="company-filter-chip" key={chip.key}>
                  {chip.label}
                </span>
              ))}
            </div>
          )}
          <div className="company-results-bar company-results-selection">
            {page ? (
              <CompanySelection
                label={resultCountLabel}
                key={`${page.querySignature}:${page.expectedRevision}:${page.page}`}
                selected={visibleSelected}
                selectedCount={allSelected ? page.total - excluded.size : selected.size}
                onSelectAll={() => {
                  setAllSelected(true);
                  setExcluded(new Set());
                }}
                pageRows={page.companies}
                total={page.total}
                disabled={contextDisabled || !canCall}
                load={loadSelection}
                onChange={(rows) => {
                  setAllSelected(false);
                  setSelected(rows);
                }}
              />
            ) : (
              <p className="workspace-count" aria-live="polite">
                {resultCountLabel}
              </p>
            )}
          </div>

          {searchError ? (
            <p role="alert" className="company-error">
              {searchError}
              <button className="workspace-link" disabled={!canCall || searching} onClick={refresh}>
                {t("Retry")}
              </button>
            </p>
          ) : null}
          {page ? (
            <>
              <div className="company-table-wrap" aria-busy={searching}>
                <table className="company-table">
                  <caption className="sr-only">
                    {t(
                      savedListId
                        ? "Companies in this shortlist"
                        : "Companies matching the current search",
                    )}
                  </caption>
                  <thead className="company-table-labels">
                    <tr>
                      <th className="company-select">
                        <span className="sr-only">{t("Select companies")}</span>
                      </th>
                      <th>
                        <span className="sr-only">{t("Company")}</span>
                      </th>
                      <th className="company-location">
                        <span className="sr-only">{t("Location")}</span>
                      </th>
                      <th className="company-employees">
                        <span className="sr-only">{t("Employees")}</span>
                      </th>
                      <th className="company-revenue">
                        <span className="sr-only">{t("Revenue")}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {page.companies.map((company) => (
                      <tr
                        key={identity(company)}
                        data-selected={visibleSelected.has(identity(company)) || undefined}
                      >
                        <td className="company-select">
                          <label className="company-selection-target">
                            <input
                              type="checkbox"
                              aria-label={t("Select {name}", { name: company.name })}
                              checked={visibleSelected.has(identity(company))}
                              disabled={
                                searching ||
                                Boolean(searchError) ||
                                (!allSelected &&
                                  !visibleSelected.has(identity(company)) &&
                                  selected.size >= MAX_SELECTED_COMPANIES)
                              }
                              onChange={(event) => {
                                const checked = event.target.checked;
                                if (allSelected) {
                                  setExcluded((current) => {
                                    const next = new Set(current);
                                    if (checked) next.delete(identity(company));
                                    else next.add(identity(company));
                                    return next;
                                  });
                                  return;
                                }
                                setSelected((current) => {
                                  const next = new Map(current);
                                  if (checked && next.size < MAX_SELECTED_COMPANIES)
                                    next.set(identity(company), company);
                                  else next.delete(identity(company));
                                  return next;
                                });
                              }}
                            />
                          </label>
                        </td>
                        <td>
                          <button
                            className="company-row-link"
                            data-company={identity(company)}
                            disabled={searching || !canCall || Boolean(searchError)}
                            onClick={() => void inspect(company)}
                          >
                            <CompanyLogo company={company} />
                            <span className="company-row-copy">
                              <strong title={company.name}>{company.name}</strong>
                              <small title={text(company.industryLabel)}>
                                {[text(company.industryLabel), text(company.city)]
                                  .filter(Boolean)
                                  .join(" · ") ||
                                  websiteLabel(company.websiteUrl) ||
                                  publicFinnishBusinessId(company.country, company.businessId)}
                              </small>
                            </span>
                            <span className="company-row-financials">
                              <span
                                aria-label={t("Revenue {value}", {
                                  value: revenue(company, numberLocale()),
                                })}
                                title={`${t("Revenue")}${text(company.financialYear) ? ` · ${text(company.financialYear)}` : ""}`}
                              >
                                <CompanyIcon name="revenue" />
                                {revenue(company, numberLocale())}
                              </span>
                              <small
                                aria-label={t("{count} employees", {
                                  count: employees(company, numberLocale()),
                                })}
                              >
                                <CompanyIcon name="people" />
                                {employees(company, numberLocale())}
                              </small>
                            </span>
                            <CompanyIcon name="chevron" />
                          </button>
                        </td>
                        <td className="company-location">
                          {text(company.city) || company.country}
                        </td>
                        <td className="company-employees">{employees(company, numberLocale())}</td>
                        <td className="company-revenue">{revenue(company, numberLocale())}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!page.companies.length && !searching && !searchError ? (
                <div className="workspace-empty">
                  <h2>
                    {t(savedListId ? "This shortlist is empty" : "No companies match this search")}
                  </h2>
                  <p>
                    {t(
                      savedListId
                        ? "Ask your assistant to find companies for a new shortlist."
                        : "Try fewer filters, or explore another market with your assistant.",
                    )}
                  </p>
                </div>
              ) : null}
              <div className="company-page-footer">
                <p className="workspace-muted">
                  {page.companies.length
                    ? t("Showing {start}–{end}", {
                        start: ((page.page - 1) * page.pageSize + 1).toLocaleString(numberLocale()),
                        end: (
                          (page.page - 1) * page.pageSize +
                          page.companies.length
                        ).toLocaleString(numberLocale()),
                      })
                    : t("No rows")}
                </p>
                <nav className="workspace-pagination" aria-label={t("Company pages")}>
                  {page.page > 1 ? (
                    <button
                      className="workspace-link"
                      disabled={searching || !canCall || Boolean(searchError)}
                      onClick={() =>
                        void search({
                          filters: page.filters,
                          pageSize: page.pageSize,
                          expectedRevision: page.expectedRevision,
                          querySignature: page.querySignature,
                        })
                      }
                    >
                      {t("First page")}
                    </button>
                  ) : null}
                  {page.hasNextPage ? (
                    <button
                      className="workspace-link"
                      disabled={searching || !canCall || Boolean(searchError)}
                      onClick={() =>
                        void search({
                          filters: page.filters,
                          pageSize: page.pageSize,
                          page: page.page + 1,
                          ...(page.nextCursor ? { cursor: page.nextCursor } : {}),
                          expectedRevision: page.expectedRevision,
                          querySignature: page.querySignature,
                        })
                      }
                    >
                      {t("Next page")}
                    </button>
                  ) : null}
                </nav>
              </div>
              {allSelected && page.total - excluded.size > MAX_SELECTED_COMPANIES ? (
                <p className="workspace-muted">
                  {t("All {count} companies selected. Choose up to 50 to continue.", {
                    count: page.total - excluded.size,
                  })}
                </p>
              ) : null}
              {!allSelected && selected.size >= MAX_SELECTED_COMPANIES ? (
                <p className="workspace-muted">{t("Up to 50 companies per campaign.")}</p>
              ) : null}
            </>
          ) : null}
        </section>
        {row ? (
          <CompanyProfileDrawer
            row={row}
            detail={detail}
            loading={profileLoading}
            error={profileError}
            notice={t(notice)}
            contextDisabled={contextDisabled}
            onClose={back}
            onRetry={() => void inspect(row, true)}
            onUseInChat={() => void useInChat()}
            onDraftChat={bridge.canDraftMessage() ? () => void draftChatRequest() : undefined}
          />
        ) : null}
      </div>
    </main>
  );
}
