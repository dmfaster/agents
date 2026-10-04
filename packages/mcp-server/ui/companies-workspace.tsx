import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { publicFinnishBusinessId } from "@dmfaster/product-ui";
import type { AgentToolInputMap } from "@dmfaster/sdk";
import type { McpAppBridge } from "./bridge.ts";
import { ConnectionDetails } from "./workspace-details.tsx";
import { filterChips } from "./company-filters.tsx";
import { CompanyLogo } from "./company-logo.tsx";
import { CompanyProfileDrawer } from "./company-profile-drawer.tsx";
import { ReadCache } from "./read-cache.ts";
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
function initialPage(initial?: CompanyResult): CompanyPage | null {
  const data = initial?.ok ? initial.data : null;
  if (!data || !("companies" in data)) return null;
  try {
    return exactPage(data as CompanyPage);
  } catch {
    return null;
  }
}
function initialError(initial?: CompanyResult): string {
  if (initial && !initial.ok) return initial.error?.message || "Company access unavailable.";
  const data = initial?.data;
  if (data && "companies" in data) {
    try {
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
  bridge,
  navigation,
}: {
  initial?: CompanyResult;
  initialFilters?: CompanyFilters;
  bridge: McpAppBridge;
  navigation: ReactNode;
}) {
  const [page, setPage] = useState<CompanyPage | null>(() => initialPage(initial));
  const [filters, setFilters] = useState<CompanyFilters>(
    () => initialPage(initial)?.filters ?? initialFilters ?? DEFAULT_COMPANY_FILTERS,
  );
  const [row, setRow] = useState<CompanyRow | null>(null);
  const [detail, setDetail] = useState<CompanyDetail | null>(null);
  const [selected, setSelected] = useState<Map<string, CompanyRow>>(() => new Map());
  const [searching, setSearching] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [searchError, setSearchError] = useState(() => initialError(initial));
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

  const search = useCallback(
    async (input: SearchInput, fresh = false) => {
      input = { ...input, projection: "list" };
      const generation = ++searchGeneration.current;
      setSearching(true);
      setSearchError("");
      try {
        const next = await cache.read(
          `search:${stableKey(input)}`,
          async () => {
            const result = exactPage(
              readData<CompanyPage>(await bridge.callTool("companies_search", input)),
            );
            if (
              (input.expectedRevision && result.expectedRevision !== input.expectedRevision) ||
              (input.querySignature && result.querySignature !== input.querySignature)
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
      } catch (error) {
        if (generation === searchGeneration.current)
          setSearchError(error instanceof Error ? error.message : String(error));
      } finally {
        if (generation === searchGeneration.current) setSearching(false);
      }
    },
    [bridge, cache],
  );

  useEffect(() => {
    searchGeneration.current += 1;
    profileGeneration.current += 1;
    contextGeneration.current += 1;
    const next = initialPage(initial);
    setPage(next);
    setFilters(next?.filters ?? initialFilters ?? DEFAULT_COMPANY_FILTERS);
    setSelected(new Map());
    setRow(null);
    setDetail(null);
    setNotice("");
    setSearchError(initialError(initial));
    setSearching(false);
    if (next && next.page === 1)
      cache.seed(
        `search:${stableKey({ filters: next.filters, pageSize: next.pageSize, projection: "list" })}`,
        next,
      );
    if (!initial && bridge.canCallTools())
      void search({ filters: initialFilters ?? DEFAULT_COMPANY_FILTERS, pageSize: 20 });
    return () => {
      searchGeneration.current += 1;
      profileGeneration.current += 1;
      contextGeneration.current += 1;
    };
  }, [initial, initialFilters, bridge, cache, search]);

  const profileKey = (company: CompanyRow) =>
    `profile:${identity(company)}:${page?.expectedRevision ?? ""}`;
  async function inspect(company: CompanyRow, fresh = false) {
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
              : `The user is exploring ${page.total.toLocaleString("en-US")} exact matching companies${companies.length ? ` and selected ${companies.length} for discussion` : ""}. This is one bounded search page, not the full inventory. Selection is context only, not authorization to save, spend research credits, change data or send messages.`,
          },
        ],
        structuredContent: {
          type: "dmfaster.company_selection",
          filters: page.filters,
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
        <header className="workspace-header">
          <div>
            <h1>Companies</h1>
            <p className="workspace-muted">Search in chat. Explore the results here.</p>
          </div>
          <button className="workspace-link" disabled={!canCall || searching} onClick={refresh}>
            Refresh
          </button>
        </header>
        {notice && !row ? (
          <p className="workspace-notice" role="status">
            {notice}
          </p>
        ) : null}
        {!canCall ? (
          <p className="workspace-muted">Continue this search through your assistant.</p>
        ) : null}
        <section aria-label="Companies">
          <div className="company-filter-chips" aria-label="Search criteria">
            <span className="company-market">{filters.countries.join(" · ")}</span>
            {filters.q ? <span className="company-filter-chip">{filters.q}</span> : null}
            {filterChips(filters).map((chip) => (
              <span className="company-filter-chip" key={chip.key}>
                {chip.label}
              </span>
            ))}
          </div>
          <div className="company-results-bar">
            <p className="workspace-count" aria-live="polite">
              {searching
                ? "Counting matches…"
                : searchError
                  ? "Exact count unavailable"
                  : page
                    ? `${page.total.toLocaleString("en-US")} ${page.total === 1 ? "company" : "companies"}`
                    : "Company data unavailable"}
            </p>
            <button
              className="workspace-link"
              disabled={contextDisabled}
              onClick={() => void useInChat()}
            >
              {selected.size ? `Discuss selected (${selected.size})` : "Use this search in chat"}
            </button>
          </div>
          {searchError ? (
            <p role="alert" className="company-error">
              {searchError}
            </p>
          ) : null}
          {page ? (
            <>
              <div className="company-table-wrap" aria-busy={searching}>
                <table className="company-table">
                  <caption className="sr-only">Companies matching the current search</caption>
                  <thead>
                    <tr>
                      <th className="company-select">
                        <span className="sr-only">Select for discussion</span>
                      </th>
                      <th>Company</th>
                      <th className="company-location">Location</th>
                      <th className="company-employees">Employees</th>
                      <th className="company-revenue">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {page.companies.map((company) => (
                      <tr
                        key={identity(company)}
                        data-selected={selected.has(identity(company)) || undefined}
                      >
                        <td className="company-select">
                          <input
                            type="checkbox"
                            aria-label={`Select ${company.name}`}
                            checked={selected.has(identity(company))}
                            disabled={
                              searching ||
                              Boolean(searchError) ||
                              (!selected.has(identity(company)) &&
                                selected.size >= MAX_SELECTED_COMPANIES)
                            }
                            onChange={(event) => {
                              const checked = event.target.checked;
                              setSelected((current) => {
                                const next = new Map(current);
                                if (checked && next.size < MAX_SELECTED_COMPANIES)
                                  next.set(identity(company), company);
                                else next.delete(identity(company));
                                return next;
                              });
                            }}
                          />
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
                                {text(company.industryLabel) ||
                                  websiteLabel(company.websiteUrl) ||
                                  publicFinnishBusinessId(company.country, company.businessId)}
                              </small>
                              <small className="company-mobile-summary">
                                {text(company.city) || company.country} · {employees(company)}{" "}
                                employees · {revenue(company)}
                              </small>
                            </span>
                          </button>
                        </td>
                        <td className="company-location">
                          {text(company.city) || company.country}
                        </td>
                        <td className="company-employees">{employees(company)}</td>
                        <td className="company-revenue">{revenue(company)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!page.companies.length && !searching && !searchError ? (
                <div className="workspace-empty">
                  <h2>No companies match this search</h2>
                  <p>Try fewer filters, or explore another market with your assistant.</p>
                </div>
              ) : null}
              <div className="company-page-footer">
                <p className="workspace-muted">
                  {page.companies.length
                    ? `Showing ${(page.page - 1) * page.pageSize + 1}–${(page.page - 1) * page.pageSize + page.companies.length}`
                    : "No rows"}
                </p>
                <nav className="workspace-pagination" aria-label="Company pages">
                  {page.page > 1 ? (
                    <button
                      className="workspace-link"
                      disabled={searching || !canCall || Boolean(searchError)}
                      onClick={() =>
                        void search({ filters: page.filters, pageSize: page.pageSize })
                      }
                    >
                      First page
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
                      Next page
                    </button>
                  ) : null}
                </nav>
              </div>
              {selected.size >= MAX_SELECTED_COMPANIES ? (
                <p className="workspace-muted">
                  Up to 50 companies per discussion. Deselect a company to choose another.
                </p>
              ) : null}
            </>
          ) : null}
        </section>
        <footer>
          <ConnectionDetails bridge={bridge} />
        </footer>
        {row ? (
          <CompanyProfileDrawer
            row={row}
            detail={detail}
            loading={profileLoading}
            error={profileError}
            notice={notice}
            contextDisabled={contextDisabled}
            onClose={back}
            onRetry={() => void inspect(row, true)}
            onUseInChat={() => void useInChat()}
          />
        ) : null}
      </div>
    </main>
  );
}
