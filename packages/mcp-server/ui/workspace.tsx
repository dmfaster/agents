import { useWorkspaceContext } from "./use-workspace-context.ts";
import type { CompanySelectionScope } from "./company-selection.tsx";
import { useLocale } from "./use-locale.ts";
import { t } from "./locale.ts";
import { useEffect, useRef, useState, useCallback } from "react";
import type { AgentToolResult } from "@dmfaster/sdk";
import { WorkspaceHome, type WorkspaceResult } from "./workspace-home.tsx";
import { CompaniesWorkspace } from "./companies-workspace.tsx";
import { CompanyEvidenceWorkspace } from "./company-evidence-workspace.tsx";
import type { EvidenceResult } from "./company-evidence-data.ts";
import type { CompanyResult, CompanyFilters } from "./companies-data.ts";
import { Check } from "lucide-react";
import { CompanyOutreach, type OutreachState } from "./company-outreach.tsx";
import { identity, type CompanyRow } from "./companies-data.ts";
import { CompanyShortlist } from "./company-shortlist.tsx";
import { checkedSelection, type Shortlist } from "./company-shortlist-data.ts";
import type { McpAppBridge } from "./bridge.ts";

export type WorkspacePayload = {
  section?: "companies" | "campaigns";
  filters?: CompanyFilters;
  savedListId?: string;
  savedListPageSize?: number;
  result: AgentToolResult;
};
function sectionFor(payload: WorkspacePayload): "companies" | "campaigns" {
  return (
    payload.section ??
    (payload.result.tool === "companies.search" ||
    payload.result.tool === "company.inspect" ||
    payload.result.tool === "companies.list.inspect" ||
    payload.result.tool === "companies.evidence.results"
      ? "companies"
      : "campaigns")
  );
}

// Mounted workflow steps retain their filters, selections and drafts. A section
// not yet visited is never loaded in the background.
export function Workspace({
  initial,
  bridge,
}: {
  initial: WorkspacePayload;
  bridge: McpAppBridge;
}) {
  const locale = useLocale();
  const first = sectionFor(initial);
  const [step, setStep] = useState(first === "companies" ? 0 : 3);
  const [selected, setSelected] = useState<CompanyRow[]>([]);
  const [selectionScope, setSelectionScope] = useState<CompanySelectionScope | null>(null);
  const [selectionLoading, setSelectionLoading] = useState(false);
  const [selectionError, setSelectionError] = useState("");
  const [shortlistLocked, setShortlistLocked] = useState(false);
  const [audienceKey, setAudienceKey] = useState("");
  const selectionVersion = useRef(0);
  const updateSelection = useCallback((rows: CompanyRow[], scope?: CompanySelectionScope) => {
    selectionVersion.current += 1;
    setSelectionLoading(false);
    setSelected(rows);
    setSelectionScope(scope ?? null);
    setSelectionError("");
  }, []);
  // Invalidate pending reads as soon as a new host result renders, even when it
  // contains the same rows and the child has not reset its selection yet.
  const payloadVersion = useRef({ payload: initial, version: 0 });
  if (payloadVersion.current.payload !== initial)
    payloadVersion.current = { payload: initial, version: payloadVersion.current.version + 1 };
  const selectionKey = `${payloadVersion.current.version}:${selectionScope?.key ?? selected.map(identity).sort().join("|")}`;
  const selectionCount = selectionScope?.count ?? selected.length;
  const canCompose = selectionCount > 0 && selectionCount <= 50 && !selectionScope?.blocked;
  const [composerMounted, setComposerMounted] = useState(false);
  const [audience, setAudience] = useState<CompanyRow[]>([]);
  const [flow, setFlow] = useState<OutreachState>({
    locked: false,
    reviewed: false,
    launched: false,
  });
  const compose = async () => {
    if (!canCompose || selectionLoading) return;
    const request = ++generation.current;
    const version = selectionVersion.current;
    setSelectionLoading(true);
    setSelectionError("");
    try {
      const rows = selectionScope ? await selectionScope.resolve() : selected;
      if (request !== generation.current || version !== selectionVersion.current) return;
      checkedSelection(rows, selectionCount);
      setAudience(rows);
      setAudienceKey(selectionKey);
      setComposerMounted(true);
      setStep(1);
    } catch (error) {
      if (request === generation.current && version === selectionVersion.current)
        setSelectionError(error instanceof Error ? error.message : String(error));
    } finally {
      if (request === generation.current && version === selectionVersion.current)
        setSelectionLoading(false);
    }
  };
  const reviewed = flow.reviewed && selectionKey === audienceKey;
  useWorkspaceContext(bridge, "workflow", {
    step: ["audience", "message", "review", "campaigns"][step],
    selectionCount,
    selectionKey,
    draftAudienceCurrent: composerMounted && selectionKey === audienceKey,
    reviewed,
    launchAcknowledged: flow.launched,
  });

  const [companies, setCompanies] = useState<{
    initial?: CompanyResult | EvidenceResult;
    filters?: CompanyFilters;
    savedListId?: string;
    savedListPageSize?: number;
  } | null>(() =>
    first === "companies"
      ? {
          initial: initial.result as CompanyResult | EvidenceResult,
          filters: initial.filters,
          savedListId: initial.savedListId,
          savedListPageSize: initial.savedListPageSize,
        }
      : null,
  );
  const [campaigns, setCampaigns] = useState<WorkspaceResult | null>(() =>
    first === "campaigns" ? (initial.result as WorkspaceResult) : null,
  );
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const generation = useRef(0);
  useEffect(() => {
    generation.current += 1;
    setSelectionLoading(false);
    setSelectionError("");
    const next = sectionFor(initial);
    setStep(next === "companies" ? 0 : 3);
    if (next === "companies")
      setCompanies({
        initial: initial.result as CompanyResult | EvidenceResult,
        filters: initial.filters,
        savedListId: initial.savedListId,
        savedListPageSize: initial.savedListPageSize,
      });
    else setCampaigns(initial.result as WorkspaceResult);
    return () => {
      generation.current += 1;
    };
  }, [initial]);
  async function openCampaigns(fresh = false) {
    setStep(3);
    if ((!fresh && (campaigns || loadingCampaigns)) || !bridge.canCallTools()) return;
    const request = ++generation.current;
    setLoadingCampaigns(true);
    try {
      const response = (await bridge.callTool("campaigns_list", { limit: 20 })) as {
        structuredContent?: WorkspaceResult;
      };
      if (request === generation.current)
        setCampaigns(response.structuredContent ?? (response as WorkspaceResult));
    } catch (error) {
      if (request === generation.current)
        setCampaigns({
          ok: false,
          error: { message: error instanceof Error ? error.message : String(error) },
        } as WorkspaceResult);
    } finally {
      if (request === generation.current) setLoadingCampaigns(false);
    }
  }
  const navigation = null;
  const labels = ["Audience", "Message", "Review", "Campaigns"];
  const navigate = (index: number) => {
    if (flow.locked || shortlistLocked || selectionLoading) return;
    if (index === 0) {
      setCompanies((current) => current ?? {});
      setStep(0);
    } else if (index === 1 && canCompose) void compose();
    else if (index === 2 && reviewed) setStep(2);
    else if (index === 3) void openCampaigns();
  };
  return (
    <div lang={locale} className="company-workflow">
      <div className="native-workspace workflow-navigation">
        <div className="workspace-shell">
          <nav aria-label={t("Campaign steps")}>
            <ol className="outreach-progress workflow-progress">
              {labels.map((label, index) => (
                <li
                  key={label}
                  data-complete={
                    index === 0
                      ? selectionCount > 0 && step !== 0
                      : index === 1
                        ? reviewed
                        : index === 2
                          ? flow.launched
                          : false
                  }
                >
                  <button
                    aria-current={step === index ? "step" : undefined}
                    disabled={
                      flow.locked ||
                      shortlistLocked ||
                      selectionLoading ||
                      (index === 1 && !canCompose) ||
                      (index === 2 && !reviewed)
                    }
                    onClick={() => navigate(index)}
                  >
                    <span>
                      {(index === 0 && selectionCount > 0 && step !== 0) ||
                      (index === 1 && reviewed && step !== 1) ||
                      (index === 2 && flow.launched && step !== 2) ? (
                        <Check size={12} aria-hidden="true" />
                      ) : (
                        index + 1
                      )}
                    </span>
                    {t(label)}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
      {selectionLoading || selectionError ? (
        <div className="native-workspace">
          <div className="workspace-shell">
            <p role={selectionError ? "alert" : "status"}>
              {selectionError || t("Loading selected companies…")}
            </p>
          </div>
        </div>
      ) : null}
      {companies ? (
        <div hidden={step !== 0}>
          {companies.initial?.tool === "companies.evidence.results" ? (
            <CompanyEvidenceWorkspace
              initial={companies.initial as EvidenceResult}
              bridge={bridge}
              navigation={navigation}
              onSelectionChange={updateSelection}
            />
          ) : (
            <CompaniesWorkspace
              initial={companies.initial as CompanyResult | undefined}
              initialFilters={companies.filters}
              savedListId={companies.savedListId}
              savedListPageSize={companies.savedListPageSize}
              bridge={bridge}
              navigation={navigation}
              onSelectionChange={updateSelection}
            />
          )}
        </div>
      ) : null}
      {companies ? (
        <div hidden={step !== 0} className="native-workspace">
          <div className="workspace-shell">
            <CompanyShortlist
              bridge={bridge}
              count={selectionCount}
              selectionKey={selectionKey}
              disabled={!canCompose || selectionLoading || flow.locked}
              resolve={() =>
                selectionScope ? selectionScope.resolve() : Promise.resolve(selected)
              }
              onLocked={setShortlistLocked}
              onOpen={async (list: Shortlist) => {
                const request = ++generation.current;
                setSelectionLoading(true);
                setSelectionError("");
                try {
                  const response = (await bridge.callTool("companies_list_inspect", {
                    listId: list.listId,
                    limit: 20,
                    expectedUpdatedAt: list.expectedUpdatedAt,
                  })) as { structuredContent: CompanyResult };
                  if (request !== generation.current) return;
                  setCompanies({
                    savedListId: list.listId,
                    savedListPageSize: 20,
                    initial: response.structuredContent,
                  });
                } catch (error) {
                  if (request === generation.current)
                    setSelectionError(error instanceof Error ? error.message : String(error));
                } finally {
                  if (request === generation.current) setSelectionLoading(false);
                }
              }}
            />
          </div>
        </div>
      ) : null}
      {composerMounted ? (
        <div hidden={step !== 1 && step !== 2}>
          <main className="native-workspace">
            <div className="workspace-shell">
              <CompanyOutreach
                companies={audience}
                bridge={bridge}
                step={step === 2 ? "review" : "message"}
                onState={setFlow}
                onReviewReady={() => setStep((current) => (current === 1 ? 2 : current))}
                onEdit={() => setStep(1)}
                onLaunched={() => void openCampaigns(true)}
              />
            </div>
          </main>
        </div>
      ) : null}
      {campaigns ? (
        <div hidden={step !== 3}>
          <WorkspaceHome initial={campaigns} bridge={bridge} navigation={navigation} />
        </div>
      ) : null}
      {step === 3 && !campaigns ? (
        <main className="native-workspace">
          <div className="workspace-shell">
            {navigation}
            <p role="status" className="workspace-muted">
              {loadingCampaigns
                ? t("Loading campaigns…")
                : t("Ask your assistant to open your campaigns.")}
            </p>
          </div>
        </main>
      ) : null}
    </div>
  );
}
