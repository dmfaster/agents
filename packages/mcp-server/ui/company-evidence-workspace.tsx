import { useWorkspaceContext } from "./use-workspace-context.ts";
import {
  CompanySelection,
  collectSelection,
  type CompanySelectionScope,
} from "./company-selection.tsx";
import { t, numberLocale } from "./locale.ts";
import { expandCompanyDetails } from "./company-display-mode.ts";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { McpAppBridge } from "./bridge.ts";
import { CompanyLogo } from "./company-logo.tsx";
import { CompanyProfileDrawer } from "./company-profile-drawer.tsx";
import { ReadCache } from "./read-cache.ts";
import {
  externalUrl,
  identity,
  readData,
  websiteLabel,
  type CompanyDetail,
  type CompanyRow,
} from "./companies-data.ts";
import {
  completeEvidencePage,
  evidenceAssessment,
  evidenceCompanyRow,
  type EvidenceCompany,
  type EvidencePage,
  type EvidenceResult,
} from "./company-evidence-data.ts";

function initialState(initial: EvidenceResult) {
  try {
    return {
      page: initial.ok && initial.data ? completeEvidencePage(initial.data) : null,
      error: initial.ok ? "" : initial.error?.message || "Saved evidence is unavailable.",
    };
  } catch (error) {
    return { page: null, error: (error as Error).message };
  }
}

export function CompanyEvidenceWorkspace({
  initial,
  bridge,
  navigation,
  onSelectionChange,
}: {
  initial: EvidenceResult;
  bridge: McpAppBridge;
  navigation: ReactNode;
  onSelectionChange(companies: CompanyRow[], scope?: CompanySelectionScope): void;
}) {
  const [selected, setSelected] = useState<Map<string, CompanyRow>>(() => new Map());
  const [allSelected, setAllSelected] = useState(true);
  const [excluded, setExcluded] = useState<Set<string>>(() => new Set());
  const [page, setPage] = useState<EvidencePage | null>(() => initialState(initial).page);
  const [error, setError] = useState(() => initialState(initial).error);
  const [busy, setBusy] = useState(false);
  const visibleSelected =
    allSelected && page
      ? new Map(
          page.companies
            .filter((company) => company.matches && !excluded.has(identity(company)))
            .map((company) => [identity(company), evidenceCompanyRow(company)]),
        )
      : selected;
  useEffect(() => {
    if (busy || error || !page) {
      onSelectionChange([]);
      return;
    }
    onSelectionChange(
      [...visibleSelected.values()],
      allSelected && page
        ? {
            count: page.progress.confirmedMatches - excluded.size,
            key: `${page.runId}:${page.expectedRevision}:${page.progress.confirmedMatches}:${[...excluded].sort().join("|")}`,
            blocked: page.progress.confirmedMatches - excluded.size > 50,
            resolve: async () =>
              (await loadSelection(page.progress.confirmedMatches, true)).filter(
                (company) => !excluded.has(identity(company)),
              ),
          }
        : undefined,
    );
  }, [selected, allSelected, excluded, page, busy, error, onSelectionChange]);
  const [company, setCompany] = useState<EvidenceCompany | null>(null);
  const [detail, setDetail] = useState<CompanyDetail | null>(null);
  const [profileBusy, setProfileBusy] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [notice, setNotice] = useState("");
  const [contextBusy, setContextBusy] = useState(false);
  const generation = useRef(0),
    profileGeneration = useRef(0),
    contextGeneration = useRef(0);
  const profiles = useRef(new ReadCache());
  const canCall = bridge.canCallTools();
  useWorkspaceContext(
    bridge,
    "audience",
    page && !busy && !error
      ? {
          source: "saved_website_evidence",
          runId: page.runId,
          querySignature: page.querySignature,
          expectedRevision: page.expectedRevision,
          query: page.query,
          filters: page.appliedFilters,
          total: null,
          totalExact: false,
          scanComplete: page.scanComplete,
          progress: page.progress,
          mode: allSelected ? "confirmed_matches_except_exclusions" : "explicit",
          selectedCount: allSelected
            ? page.progress.confirmedMatches - excluded.size
            : selected.size,
          excludedCompanyKeys: allSelected ? [...excluded].sort() : [],
          selectedCompanies: allSelected
            ? undefined
            : [...selected.values()].map(({ country, businessId, name }) => ({
                country,
                businessId,
                name,
              })),
          visiblePageIsFullAudience: false,
          campaignHandoffLimit: 50,
        }
      : { status: busy ? "loading" : "unavailable", selectedCount: null },
  );
  useWorkspaceContext(
    bridge,
    "focusedCompany",
    company
      ? {
          country: company.country,
          businessId: company.businessId,
          name: company.name,
          matches: company.matches,
          profileStatus: detail ? "loaded" : profileBusy ? "loading" : "unavailable",
          profileRevision: detail?.revision ?? null,
        }
      : null,
  );

  useEffect(() => {
    generation.current++;
    profileGeneration.current++;
    contextGeneration.current++;
    const next = initialState(initial);
    setSelected(new Map());
    setAllSelected(true);
    setExcluded(new Set());
    setPage(next.page);
    setError(next.error);
    setBusy(false);
    setCompany(null);
    setDetail(null);
    setNotice("");
    setProfileError("");
    setProfileBusy(false);
    setContextBusy(false);
    profiles.current = new ReadCache();
    return () => {
      generation.current++;
      profileGeneration.current++;
      contextGeneration.current++;
    };
  }, [initial]);

  async function readPage(cursor?: string) {
    if (!page) return;
    const request = ++generation.current;
    const current = page;
    profileGeneration.current++;
    contextGeneration.current++;
    setCompany(null);
    setDetail(null);
    setProfileBusy(false);
    setContextBusy(false);
    setNotice("");
    setBusy(true);
    setError("");
    try {
      const next = completeEvidencePage(
        readData<EvidencePage>(
          await bridge.callTool("companies_evidence_results", {
            runId: current.runId,
            expectedRevision: current.expectedRevision,
            view: current.view,
            pageSize: 20,
            ...(cursor ? { cursor } : {}),
          }),
        ),
      );
      if (
        next.runId !== current.runId ||
        next.expectedRevision !== current.expectedRevision ||
        next.querySignature !== current.querySignature ||
        next.view !== current.view
      )
        throw new Error("The evidence run changed. Reopen its results through chat.");
      if (request === generation.current) setPage(next);
    } catch (error) {
      if (request === generation.current) setError((error as Error).message);
    } finally {
      if (request === generation.current) setBusy(false);
    }
  }
  async function loadSelection(count: number, matchesOnly = false) {
    if (!page) throw new Error(t("Company data unavailable"));
    const current = page;
    const request = generation.current;
    const view = matchesOnly ? "matches" : current.view;
    return collectSelection(count, async (cursor) => {
      const next = completeEvidencePage(
        readData<EvidencePage>(
          await bridge.callTool("companies_evidence_results", {
            runId: current.runId,
            expectedRevision: current.expectedRevision,
            view,
            pageSize: 20,
            ...(cursor ? { cursor } : {}),
          }),
        ),
      );
      if (
        request !== generation.current ||
        next.runId !== current.runId ||
        next.expectedRevision !== current.expectedRevision ||
        next.querySignature !== current.querySignature ||
        next.view !== view ||
        (matchesOnly &&
          (next.progress.confirmedMatches !== current.progress.confirmedMatches ||
            next.companies.some((company) => !company.matches)))
      )
        throw new Error(t("The results changed. Reopen selection and try again."));
      return { ...next, companies: next.companies.map(evidenceCompanyRow) };
    });
  }

  async function inspect(nextCompany: EvidenceCompany, fresh = false) {
    void expandCompanyDetails(bridge);
    const request = ++profileGeneration.current;
    contextGeneration.current++;
    setContextBusy(false);
    const key = `${identity(nextCompany)}:${page?.runId}:${page?.expectedRevision}`;
    const cache = profiles.current;
    const cached = fresh ? null : cache.peek<CompanyDetail>(key);
    setCompany(nextCompany);
    setDetail(cached || null);
    setProfileError("");
    setNotice("");
    setProfileBusy(!cached);
    if (cached) return;
    try {
      const next = await cache.read(
        key,
        async () => {
          const value = readData<CompanyDetail>(
            await bridge.callTool("company_inspect", {
              country: nextCompany.country,
              businessId: nextCompany.businessId,
            }),
          );
          if (identity(value.profile) !== identity(nextCompany) || !value.revision)
            throw new Error("The profile identity did not match this saved evidence.");
          return value;
        },
        fresh,
      );
      if (request === profileGeneration.current) {
        setDetail(next);
      }
    } catch (error) {
      if (request === profileGeneration.current) setProfileError((error as Error).message);
    } finally {
      if (request === profileGeneration.current) setProfileBusy(false);
    }
  }
  function close() {
    const previous = company ? identity(company) : "";
    profileGeneration.current++;
    contextGeneration.current++;
    setCompany(null);
    setDetail(null);
    setProfileBusy(false);
    setContextBusy(false);
    setNotice("");
    requestAnimationFrame(() =>
      [...document.querySelectorAll<HTMLButtonElement>("button[data-company]")]
        .find((button) => button.dataset.company === previous)
        ?.focus(),
    );
  }
  async function useInChat() {
    if (!page || busy || error) return;
    const request = ++contextGeneration.current;
    setContextBusy(true);
    try {
      await bridge.updateModelContext({
        content: [
          {
            type: "text",
            text: company
              ? `Discuss ${company.name} using its saved website evidence and current profile. Assessment: ${t(evidenceAssessment(company))}.`
              : `Discuss this website-evidence run: ${page.query}. The exact market audience total is unavailable. ${page.progress.confirmedMatches} matches have been accepted so far; ${page.progress.processedCompanies} of ${page.progress.eligibleCompanies} eligible companies have been processed. Selection supplies discussion context only.`,
          },
        ],
        structuredContent: {
          type: "dmfaster.company_evidence_selection",
          runId: page.runId,
          query: page.query,
          criteria: page.appliedCriteria,
          filters: page.appliedFilters,
          expectedRevision: page.expectedRevision,
          querySignature: page.querySignature,
          total: null,
          totalExact: false,
          totalStatus: "unavailable",
          progress: page.progress,
          scanComplete: page.scanComplete,
          status: page.status,
          companies: company ? [company] : page.companies,
          profile: company ? detail : null,
          authorizesMutations: false,
        },
      });
      if (request === contextGeneration.current) setNotice("Added to chat context.");
    } catch (error) {
      if (request === contextGeneration.current) setNotice((error as Error).message);
    } finally {
      if (request === contextGeneration.current) setContextBusy(false);
    }
  }
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
        void bridge.openLink(anchor.href).catch((error) => setNotice(String(error)));
      }}
    >
      <div className="workspace-shell companies-shell">
        {navigation}

        {page ? (
          <>
            <div className="company-filter-chips" aria-label={t("Search criteria")}>
              <span className="company-market">{page.country}</span>
              <span className="company-filter-chip">{page.query}</span>
            </div>
            <div className="company-results-bar company-results-selection">
              <div aria-live="polite">
                <CompanySelection
                  label={
                    page.progress.confirmedMatches === 1
                      ? t("1 accepted match so far")
                      : t("{count} accepted matches so far", {
                          count: page.progress.confirmedMatches.toLocaleString(numberLocale()),
                        })
                  }
                  key={`${page.runId}:${page.expectedRevision}:${page.nextCursor}`}
                  selected={visibleSelected}
                  selectedCount={
                    allSelected ? page.progress.confirmedMatches - excluded.size : selected.size
                  }
                  pageRows={page.companies.map(evidenceCompanyRow)}
                  total={null}
                  disabled={busy || Boolean(error) || !canCall}
                  load={loadSelection}
                  onChange={(rows) => {
                    setAllSelected(false);
                    setSelected(rows);
                  }}
                />
                <p className="workspace-muted">
                  {t("Market total unavailable")} ·{" "}
                  {page.status === "complete"
                    ? t("Processing complete")
                    : page.status === "running" || page.status === "initializing"
                      ? t("Processing saved evidence")
                      : t("Run {status}", { status: t(page.status) })}
                </p>
              </div>
            </div>
            <p className="workspace-muted" role="status">
              {busy
                ? t("Loading saved results…")
                : t(
                    "{processed} of {eligible} eligible companies checked · {unresolved} unresolved",
                    {
                      processed: page.progress.processedCompanies.toLocaleString(numberLocale()),
                      eligible: page.progress.eligibleCompanies.toLocaleString(numberLocale()),
                      unresolved: page.progress.unresolvedCompanies.toLocaleString(numberLocale()),
                    },
                  )}
            </p>

            {allSelected && page.progress.confirmedMatches - excluded.size > 50 ? (
              <p className="workspace-muted">
                {t("All {count} accepted matches selected. Choose up to 50 to continue.", {
                  count: page.progress.confirmedMatches - excluded.size,
                })}
              </p>
            ) : null}
            <div className="company-table-wrap" aria-busy={busy}>
              <table className="company-table company-evidence-table">
                <caption className="sr-only">{t("Saved website evidence results")}</caption>
                <thead className="company-table-labels">
                  <tr>
                    <th>
                      <span className="sr-only">{t("Select companies")}</span>
                    </th>
                    <th>
                      <span className="sr-only">{t("Company")}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {page.companies.map((c) => {
                    return (
                      <tr key={identity(c)}>
                        <td className="company-select">
                          <input
                            type="checkbox"
                            aria-label={t("Select {name}", { name: c.name })}
                            checked={visibleSelected.has(identity(c))}
                            disabled={
                              busy ||
                              Boolean(error) ||
                              (!allSelected &&
                                !visibleSelected.has(identity(c)) &&
                                selected.size >= 50)
                            }
                            onChange={(e) => {
                              const checked = e.target.checked;
                              if (allSelected && c.matches) {
                                setExcluded((current) => {
                                  const next = new Set(current);
                                  if (checked) next.delete(identity(c));
                                  else next.add(identity(c));
                                  return next;
                                });
                                return;
                              }
                              if (allSelected) {
                                setAllSelected(false);
                                setSelected(
                                  new Map([
                                    ...visibleSelected,
                                    [identity(c), evidenceCompanyRow(c)],
                                  ]),
                                );
                                return;
                              }
                              setSelected((current) => {
                                const next = new Map(current);
                                if (checked) next.set(identity(c), evidenceCompanyRow(c));
                                else next.delete(identity(c));
                                return next;
                              });
                            }}
                          />
                        </td>
                        <td>
                          <button
                            className="company-row-link"
                            data-company={identity(c)}
                            disabled={!canCall || busy || Boolean(error)}
                            onClick={() => void inspect(c)}
                          >
                            <CompanyLogo company={evidenceCompanyRow(c)} />
                            <span className="company-row-copy">
                              <strong title={c.name}>{c.name}</strong>
                              <small>{websiteLabel(c.websiteUrl)}</small>
                            </span>
                            <span
                              className="company-evidence-status"
                              data-accepted={c.matches || undefined}
                            >
                              {t(evidenceAssessment(c))}
                            </span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {!page.companies.length ? (
              <div className="workspace-empty">
                <h2>
                  {page.awaitingMoreResults
                    ? t("Waiting for matching evidence")
                    : t("No companies on this result page")}
                </h2>
                <p>
                  {page.awaitingMoreResults
                    ? t(
                        "The scan is still running. Check for more results or continue through chat.",
                      )
                    : t(
                        "Missing or uncertain evidence does not establish that a company fails the criteria.",
                      )}
                </p>
              </div>
            ) : null}
            <div className="company-page-footer">
              <p className="workspace-muted">
                {t("{count} companies on this page · {view} view", {
                  count: page.companies.length,
                  view: t(page.view),
                })}
              </p>
              <nav className="workspace-pagination" aria-label={t("Evidence pages")}>
                <button
                  className="workspace-link"
                  disabled={!canCall || busy || Boolean(error)}
                  onClick={() => void readPage()}
                >
                  {t("First page")}
                </button>
                {page.hasNextPage || page.awaitingMoreResults ? (
                  <button
                    className="workspace-link"
                    disabled={!canCall || busy || Boolean(error)}
                    onClick={() => void readPage(page.nextCursor)}
                  >
                    {page.hasNextPage ? t("Next page") : t("Check for more results")}
                  </button>
                ) : null}
              </nav>
            </div>
          </>
        ) : null}
        {error ? (
          <p role="alert" className="company-error">
            {error}
            <button
              className="workspace-link"
              disabled={!canCall || busy}
              onClick={() => void readPage()}
            >
              {t("Retry")}
            </button>
          </p>
        ) : null}
        {notice && !company ? (
          <p className="workspace-notice" role="status">
            {t(notice)}
          </p>
        ) : null}
        {company ? (
          <CompanyProfileDrawer
            row={evidenceCompanyRow(company)}
            detail={detail}
            loading={profileBusy}
            error={profileError}
            notice={t(notice)}
            contextDisabled={!page || busy || Boolean(error) || contextBusy}
            onClose={close}
            onRetry={() => void inspect(company, true)}
            onUseInChat={() => void useInChat()}
          />
        ) : null}
      </div>
    </main>
  );
}
