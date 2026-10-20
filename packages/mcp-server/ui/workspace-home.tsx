import { ChevronRight } from "lucide-react";
import { InstagramIcon, FacebookIcon, LinkedInIcon } from "@dmfaster/product-ui/company-brands";
import { t } from "./locale.ts";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { AgentToolDataMap, AgentToolResult } from "@dmfaster/sdk";
import { CampaignOverview } from "./campaign-overview.tsx";
import type { McpAppBridge } from "./bridge.ts";

type CampaignPage = AgentToolDataMap["campaigns.list"];
type CampaignDetail = AgentToolDataMap["campaign.inspect"];
export type WorkspaceResult = AgentToolResult<CampaignPage | CampaignDetail>;

function unpack(value: unknown): WorkspaceResult {
  if (!value || typeof value !== "object")
    throw new Error("The workspace returned an invalid response.");
  const envelope = value as { structuredContent?: WorkspaceResult; isError?: boolean };
  const result = envelope.structuredContent ?? (value as WorkspaceResult);
  if (!result || typeof result !== "object")
    throw new Error("The workspace returned an invalid response.");
  if (envelope.isError || result.ok !== true || !result.data) {
    throw new Error(
      result.error?.message ||
        "Could not load the workspace. Check your DM Faster connection and permissions, then retry.",
    );
  }
  return result;
}

export function WorkspaceHome({
  initial,
  bridge,
  navigation,
}: {
  initial: WorkspaceResult;
  bridge: McpAppBridge;
  navigation?: ReactNode;
}) {
  const [result, setResult] = useState(initial);
  const [cursor, setCursor] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const generation = useRef(0);
  useEffect(() => {
    generation.current += 1;
    setResult(initial);
    setCursor(null);
    setNotice("");
    setBusy(false);
    return () => {
      generation.current += 1;
    };
  }, [initial]);
  const data = result.ok ? result.data : null;
  const page = data && "campaigns" in data ? data : null;
  const detail = data && "campaign" in data ? data : null;
  const canCall = bridge.canCallTools();

  async function call(name: string, input: Record<string, unknown>) {
    const request = ++generation.current;
    setBusy(true);
    setNotice("");
    try {
      const next = unpack(await bridge.callTool(name, input));
      if (request !== generation.current) return;
      setResult(next);
      if (name === "campaigns_list")
        setCursor(typeof input.cursor === "string" ? input.cursor : null);
    } catch (error) {
      if (request === generation.current)
        setNotice(error instanceof Error ? error.message : String(error));
    } finally {
      if (request === generation.current) setBusy(false);
    }
  }
  const list = (cursor?: string) =>
    call("campaigns_list", { limit: 20, ...(cursor ? { cursor } : {}) });

  return (
    <main className="native-workspace">
      <div className="workspace-shell">
        {navigation}
        {detail ? (
          <header className="workspace-header">
            <div>
              <button
                className="workspace-link workspace-back"
                disabled={busy || !canCall}
                onClick={() => void list()}
              >
                {t("Back to campaigns")}
              </button>
              <h1>{detail.campaign.name}</h1>
              <p className="workspace-muted">
                {t(detail.campaign.status)} · {detail.campaign.channels.join(" · ")}
              </p>
            </div>
          </header>
        ) : null}
        {notice ? (
          <p role="status" className="workspace-notice">
            {notice}
          </p>
        ) : null}
        {!result.ok ? (
          <section>
            <h2>Workspace unavailable</h2>
            <p>{result.error?.message || "Reconnect DM Faster, then refresh."}</p>
          </section>
        ) : null}
        {!canCall ? (
          <p className="workspace-muted">
            This host cannot make interactive tool calls. Continue through your assistant.
          </p>
        ) : null}
        {detail ? (
          <CampaignOverview
            key={`${detail.campaign.id}:${detail.generatedAt}`}
            detail={detail}
            bridge={bridge}
          />
        ) : page ? (
          <section aria-label={t("Campaigns")}>
            {page.campaigns.length ? (
              <div className="campaign-panel">
                <div className="campaign-grid campaign-grid-heading" aria-hidden="true">
                  <span>{t("Campaign")}</span>
                  <span>{t("Targets")}</span>
                  <span>{t("Sent")}</span>
                  <span>{t("Status")}</span>
                  <span />
                </div>
                <ul className="campaign-rows">
                  {page.campaigns.map((campaign) => (
                    <li key={campaign.id}>
                      <button
                        className="campaign-grid campaign-row"
                        aria-label={campaign.name}
                        disabled={busy || !canCall}
                        onClick={() => void call("campaign_inspect", { campaignId: campaign.id })}
                      >
                        <span className="campaign-identity">
                          <strong>{campaign.name}</strong>
                          <span className="campaign-channels">
                            {campaign.channels.map((channel) => {
                              const Icon = {
                                instagram: InstagramIcon,
                                facebook: FacebookIcon,
                                linkedin: LinkedInIcon,
                              }[channel as "instagram" | "facebook" | "linkedin"];
                              return (
                                <span key={channel} title={channel} aria-label={channel}>
                                  {Icon ? (
                                    <Icon
                                      className={`outreach-channel-icon outreach-icon-${channel}`}
                                    />
                                  ) : (
                                    channel
                                  )}
                                </span>
                              );
                            })}
                          </span>
                        </span>
                        <span className="campaign-stat">
                          <small>{t("Targets")}</small>
                          {campaign.targetCount.toLocaleString()}
                        </span>
                        <span className="campaign-stat">
                          <small>{t("Sent")}</small>
                          {campaign.sentCount.toLocaleString()}
                        </span>
                        <span className="campaign-status" data-status={campaign.status}>
                          {t(campaign.status)}
                        </span>
                        <ChevronRight className="campaign-open" size={16} aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {cursor || page.hasMore ? (
              <nav className="workspace-pagination" aria-label={t("Campaign pages")}>
                {cursor ? (
                  <button
                    className="workspace-link"
                    disabled={busy || !canCall}
                    onClick={() => void list()}
                  >
                    {t("First page")}
                  </button>
                ) : null}
                {page.hasMore && page.nextCursor ? (
                  <button
                    className="workspace-link"
                    disabled={busy || !canCall}
                    onClick={() => void list(page.nextCursor!)}
                  >
                    {t("Next page")}
                  </button>
                ) : null}
              </nav>
            ) : null}
          </section>
        ) : result.ok ? (
          <p>Campaign data unavailable. Try refreshing.</p>
        ) : null}
        {busy ? (
          <p role="status" className="workspace-muted">
            Loading…
          </p>
        ) : null}
      </div>
    </main>
  );
}
