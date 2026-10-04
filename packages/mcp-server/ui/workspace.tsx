import { useEffect, useRef, useState } from "react";
import type { AgentToolResult } from "@dmfaster/sdk";
import { WorkspaceHome, type WorkspaceResult } from "./workspace-home.tsx";
import { CompaniesWorkspace } from "./companies-workspace.tsx";
import { CompanyEvidenceWorkspace } from "./company-evidence-workspace.tsx";
import type { EvidenceResult } from "./company-evidence-data.ts";
import type { CompanyResult, CompanyFilters } from "./companies-data.ts";
import type { McpAppBridge } from "./bridge.ts";

export type WorkspacePayload = {
  section?: "companies" | "campaigns";
  filters?: CompanyFilters;
  result: AgentToolResult;
};
function sectionFor(payload: WorkspacePayload): "companies" | "campaigns" {
  return (
    payload.section ??
    (payload.result.tool === "companies.search" ||
    payload.result.tool === "company.inspect" ||
    payload.result.tool === "companies.evidence.results"
      ? "companies"
      : "campaigns")
  );
}

// Mounted sections retain their filters and rows when switching tabs. A section
// not yet visited is never loaded in the background.
export function Workspace({
  initial,
  bridge,
}: {
  initial: WorkspacePayload;
  bridge: McpAppBridge;
}) {
  const first = sectionFor(initial);
  const [section, setSection] = useState(first);
  const [companies, setCompanies] = useState<{
    initial?: CompanyResult | EvidenceResult;
    filters?: CompanyFilters;
  } | null>(() =>
    first === "companies"
      ? { initial: initial.result as CompanyResult | EvidenceResult, filters: initial.filters }
      : null,
  );
  const [campaigns, setCampaigns] = useState<WorkspaceResult | null>(() =>
    first === "campaigns" ? (initial.result as WorkspaceResult) : null,
  );
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const generation = useRef(0);
  useEffect(() => {
    generation.current += 1;
    const next = sectionFor(initial);
    setSection(next);
    if (next === "companies")
      setCompanies({
        initial: initial.result as CompanyResult | EvidenceResult,
        filters: initial.filters,
      });
    else setCampaigns(initial.result as WorkspaceResult);
    return () => {
      generation.current += 1;
    };
  }, [initial]);
  async function openCampaigns() {
    setSection("campaigns");
    if (campaigns || loadingCampaigns || !bridge.canCallTools()) return;
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
  const navigation = (
    <nav className="workspace-tabs" aria-label="Workspace sections">
      <button
        aria-current={section === "companies" ? "page" : undefined}
        onClick={() => {
          setCompanies((current) => current ?? {});
          setSection("companies");
        }}
      >
        Companies
      </button>
      <button
        aria-current={section === "campaigns" ? "page" : undefined}
        onClick={() => void openCampaigns()}
      >
        Campaigns
      </button>
    </nav>
  );
  return (
    <>
      {companies ? (
        <div hidden={section !== "companies"}>
          {companies.initial?.tool === "companies.evidence.results" ? (
            <CompanyEvidenceWorkspace
              initial={companies.initial as EvidenceResult}
              bridge={bridge}
              navigation={navigation}
            />
          ) : (
            <CompaniesWorkspace
              initial={companies.initial as CompanyResult | undefined}
              initialFilters={companies.filters}
              bridge={bridge}
              navigation={navigation}
            />
          )}
        </div>
      ) : null}
      {campaigns ? (
        <div hidden={section !== "campaigns"}>
          <WorkspaceHome initial={campaigns} bridge={bridge} navigation={navigation} />
        </div>
      ) : null}
      {section === "campaigns" && !campaigns ? (
        <main className="native-workspace">
          <div className="workspace-shell">
            {navigation}
            <h1>Campaigns</h1>
            <p role="status" className="workspace-muted">
              {loadingCampaigns
                ? "Loading campaigns…"
                : "Ask your assistant to open your campaigns."}
            </p>
          </div>
        </main>
      ) : null}
    </>
  );
}
