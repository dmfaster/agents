import { useEffect, useRef, useState, type ReactNode } from "react";
import type { McpAppBridge } from "./bridge.ts";
import { CompanyLogo } from "./company-logo.tsx";
import { CompanyProfileDrawer } from "./company-profile-drawer.tsx";
import { ConnectionDetails } from "./workspace-details.tsx";
import { ReadCache } from "./read-cache.ts";
import {
  externalUrl,
  identity,
  readData,
  websiteLabel,
  type CompanyDetail,
} from "./companies-data.ts";
import {
  completeEvidencePage,
  evidenceAssessment,
  evidenceCompanyRow,
  evidenceNotes,
  evidenceQuotes,
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

function Sources({ company }: { company: EvidenceCompany }) {
  const quotes = evidenceQuotes(company);
  return (
    <section className="company-evidence-sources" aria-label="Saved website evidence">
      <h3>Saved website evidence</h3>
      <p className="workspace-muted">
        {evidenceAssessment(company)}.{" "}
        {company.criteria.some((c) => c.binary)
          ? "These original quotes are context samples from the assessment."
          : "Original source passages from this evidence run."}
      </p>
      {evidenceNotes(company).map((note) => (
        <p key={note} className="workspace-muted">
          {note}
        </p>
      ))}
      {quotes.length ? (
        quotes.slice(0, 6).map((quote, index) => (
          <details key={index} open={index === 0}>
            <summary>{quote.heading || websiteLabel(quote.url) || "Original passage"}</summary>
            <blockquote>{quote.text}</blockquote>
            <p className="workspace-muted">
              Saved {new Date(quote.observedAt).toLocaleDateString("en-GB")}
              {externalUrl(quote.url) ? (
                <>
                  {" "}
                  ·{" "}
                  <a href={externalUrl(quote.url)} target="_blank" rel="noreferrer">
                    Source page
                  </a>
                </>
              ) : null}
            </p>
          </details>
        ))
      ) : (
        <p className="workspace-muted">No usable saved passage is available for this company.</p>
      )}
    </section>
  );
}

export function CompanyEvidenceWorkspace({
  initial,
  bridge,
  navigation,
}: {
  initial: EvidenceResult;
  bridge: McpAppBridge;
  navigation: ReactNode;
}) {
  const [page, setPage] = useState<EvidencePage | null>(() => initialState(initial).page);
  const [error, setError] = useState(() => initialState(initial).error);
  const [busy, setBusy] = useState(false);
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

  useEffect(() => {
    generation.current++;
    profileGeneration.current++;
    contextGeneration.current++;
    const next = initialState(initial);
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
  async function inspect(nextCompany: EvidenceCompany, fresh = false) {
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
              ? `Discuss ${company.name} using its saved website evidence and current profile. Assessment: ${evidenceAssessment(company)}.`
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
        <header className="workspace-header">
          <div>
            <h1>Companies</h1>
            <p className="workspace-muted">Search in chat. Explore saved website evidence here.</p>
          </div>
          <button
            className="workspace-link"
            disabled={!canCall || busy || !page}
            onClick={() => void readPage()}
          >
            Refresh results
          </button>
        </header>
        {page ? (
          <>
            <div className="company-filter-chips" aria-label="Search criteria">
              <span className="company-market">{page.country}</span>
              <span className="company-filter-chip">{page.query}</span>
            </div>
            <div className="company-results-bar">
              <div aria-live="polite">
                <p className="workspace-count">
                  {page.progress.confirmedMatches.toLocaleString("en-US")} accepted{" "}
                  {page.progress.confirmedMatches === 1 ? "match" : "matches"} so far
                </p>
                <p className="workspace-muted">
                  Market total unavailable ·{" "}
                  {page.status === "complete"
                    ? "Processing complete"
                    : page.status === "running" || page.status === "initializing"
                      ? "Processing saved evidence"
                      : `Run ${page.status}`}
                </p>
              </div>
              <button
                className="workspace-link"
                disabled={busy || Boolean(error) || contextBusy}
                onClick={() => void useInChat()}
              >
                Use this search in chat
              </button>
            </div>
            <p className="workspace-muted" role="status">
              {busy
                ? "Loading saved results…"
                : `${page.progress.processedCompanies.toLocaleString("en-US")} of ${page.progress.eligibleCompanies.toLocaleString("en-US")} eligible companies checked · ${page.progress.unresolvedCompanies.toLocaleString("en-US")} unresolved`}
            </p>
            <div className="company-table-wrap" aria-busy={busy}>
              <table className="company-table">
                <caption className="sr-only">Saved website evidence results</caption>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Assessment</th>
                    <th>Saved evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {page.companies.map((c) => {
                    const quote = evidenceQuotes(c)[0];
                    return (
                      <tr key={identity(c)}>
                        <td>
                          <button
                            className="company-row-link"
                            data-company={identity(c)}
                            disabled={!canCall || busy || Boolean(error)}
                            onClick={() => void inspect(c)}
                          >
                            <CompanyLogo company={evidenceCompanyRow(c)} />
                            <span className="company-row-copy">
                              <strong>{c.name}</strong>
                              <small>{websiteLabel(c.websiteUrl)}</small>
                            </span>
                          </button>
                        </td>
                        <td>
                          <span
                            className="company-evidence-status"
                            data-accepted={c.matches || undefined}
                          >
                            {evidenceAssessment(c)}
                          </span>
                        </td>
                        <td className="company-evidence-excerpt">
                          {quote ? (
                            <>
                              <span title={quote.text}>{quote.text}</span>
                              <small>{quote.heading || websiteLabel(quote.url)}</small>
                            </>
                          ) : (
                            "Saved evidence unavailable"
                          )}
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
                    ? "Waiting for matching evidence"
                    : "No companies on this result page"}
                </h2>
                <p>
                  {page.awaitingMoreResults
                    ? "The scan is still running. Refresh results or continue through chat."
                    : "Missing or uncertain evidence does not establish that a company fails the criteria."}
                </p>
              </div>
            ) : null}
            <div className="company-page-footer">
              <p className="workspace-muted">
                {page.companies.length} companies on this page · {page.view} view
              </p>
              <nav className="workspace-pagination" aria-label="Evidence pages">
                <button
                  className="workspace-link"
                  disabled={!canCall || busy || Boolean(error)}
                  onClick={() => void readPage()}
                >
                  First page
                </button>
                {page.hasNextPage || page.awaitingMoreResults ? (
                  <button
                    className="workspace-link"
                    disabled={!canCall || busy || Boolean(error)}
                    onClick={() => void readPage(page.nextCursor)}
                  >
                    {page.hasNextPage ? "Next page" : "Check for more results"}
                  </button>
                ) : null}
              </nav>
            </div>
          </>
        ) : null}
        {error ? (
          <p role="alert" className="company-error">
            {error}
          </p>
        ) : null}
        {notice && !company ? (
          <p className="workspace-notice" role="status">
            {notice}
          </p>
        ) : null}
        <footer>
          <ConnectionDetails bridge={bridge} />
        </footer>
        {company ? (
          <CompanyProfileDrawer
            row={evidenceCompanyRow(company)}
            detail={detail}
            loading={profileBusy}
            error={profileError}
            notice={notice}
            contextDisabled={!page || busy || Boolean(error) || contextBusy}
            onClose={close}
            onRetry={() => void inspect(company, true)}
            onUseInChat={() => void useInChat()}
            evidence={<Sources company={company} />}
          />
        ) : null}
      </div>
    </main>
  );
}
