import { useEffect, useRef, useState, type ReactNode } from "react";
import type { AgentToolDataMap, AgentToolResult } from "@dmfaster/sdk";
import { CampaignDetails, ConnectionDetails } from "./workspace-details.tsx";
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
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [cursor, setCursor] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const generation = useRef(0);
  useEffect(() => {
    generation.current += 1;
    setResult(initial);
    setCursor(null);
    setQuery("");
    setAppliedQuery("");
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

  async function call(name: string, input: Record<string, unknown>, search = appliedQuery) {
    const request = ++generation.current;
    setBusy(true);
    setNotice("");
    try {
      const next = unpack(await bridge.callTool(name, input));
      if (request !== generation.current) return;
      setResult(next);
      setAppliedQuery(search);
      if (name === "campaigns_list")
        setCursor(typeof input.cursor === "string" ? input.cursor : null);
    } catch (error) {
      if (request === generation.current)
        setNotice(error instanceof Error ? error.message : String(error));
    } finally {
      if (request === generation.current) setBusy(false);
    }
  }
  async function useInChat() {
    const request = ++generation.current;
    setBusy(true);
    setNotice("");
    try {
      await bridge.updateModelContext({
        content: [
          {
            type: "text",
            text: detail
              ? `The user selected campaign ${detail.campaign.name} (${detail.campaign.id}). This is context only, not an instruction to change or send anything.`
              : "The user is browsing their DM Faster campaigns. They have not requested any campaign mutation.",
          },
        ],
        structuredContent: {
          type: "dmfaster.campaign_selection",
          campaignId: detail?.campaign.id ?? null,
          result,
        },
      });
      if (request === generation.current) setNotice("Added to chat context.");
    } catch (error) {
      if (request === generation.current)
        setNotice(error instanceof Error ? error.message : String(error));
    } finally {
      if (request === generation.current) setBusy(false);
    }
  }
  const list = (search: string, cursor?: string) =>
    call(
      "campaigns_list",
      { limit: 20, ...(search ? { query: search } : {}), ...(cursor ? { cursor } : {}) },
      search,
    );

  return (
    <main className="native-workspace">
      <div className="workspace-shell">
        {navigation}
        <header className="workspace-header">
          <div>
            {detail ? (
              <button
                className="workspace-link workspace-back"
                disabled={busy || !canCall}
                onClick={() => void list(appliedQuery)}
              >
                ← Back to campaigns
              </button>
            ) : null}
            <h1>{detail ? detail.campaign.name : "Campaigns"}</h1>
            {detail ? (
              <p className="workspace-muted">
                {detail.campaign.status} · {detail.campaign.channels.join(" · ")}
              </p>
            ) : null}
          </div>
          <button
            className="workspace-link"
            disabled={busy || !canCall}
            onClick={() =>
              detail
                ? void call("campaign_inspect", { campaignId: detail.campaign.id })
                : void list(appliedQuery, cursor ?? undefined)
            }
          >
            Refresh
          </button>
        </header>
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
          <section aria-label="Campaign overview">
            <dl className="workspace-metrics">
              {[
                ["Sent", detail.campaign.sentCount],
                ["Targets", detail.campaign.targetCount],
                ["Queued", detail.execution.queued],
              ].map(([label, count]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{Number(count).toLocaleString()}</dd>
                </div>
              ))}
            </dl>
            <button className="workspace-button" disabled={busy} onClick={() => void useInChat()}>
              Use this campaign in chat
            </button>
            <CampaignDetails
              key={`${detail.campaign.id}:${detail.generatedAt}`}
              detail={detail}
              bridge={bridge}
            />
          </section>
        ) : page ? (
          <section aria-label="Campaigns">
            <form
              className="workspace-search"
              onSubmit={(event) => {
                event.preventDefault();
                if (!busy && canCall) void list(query.trim());
              }}
            >
              <input
                aria-label="Search campaigns"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search campaigns"
              />
              <button className="workspace-link" disabled={busy || !canCall}>
                Search
              </button>
            </form>
            <p className="workspace-count">
              {page.totalCount.toLocaleString()} campaigns
              {appliedQuery ? ` matching “${appliedQuery}”` : ""}
            </p>
            {page.campaigns.length ? (
              <ul className="workspace-campaigns">
                {page.campaigns.map((campaign) => (
                  <li key={campaign.id}>
                    <button
                      disabled={busy || !canCall}
                      onClick={() => void call("campaign_inspect", { campaignId: campaign.id })}
                    >
                      <span>
                        <strong>{campaign.name}</strong>
                        <small>
                          {campaign.sentCount.toLocaleString()} sent ·{" "}
                          {campaign.targetCount.toLocaleString()} targets
                        </small>
                      </span>
                      <span className="workspace-muted">{campaign.status}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="workspace-empty">
                <h2>
                  {appliedQuery
                    ? "No campaigns match this search"
                    : "Your first campaign starts with a conversation"}
                </h2>
                <p>
                  {appliedQuery
                    ? "Try another name."
                    : "Tell your assistant who you want to reach."}
                </p>
              </div>
            )}
            {cursor || page.hasMore ? (
              <nav className="workspace-pagination" aria-label="Campaign pages">
                {cursor ? (
                  <button
                    className="workspace-link"
                    disabled={busy || !canCall}
                    onClick={() => void list(appliedQuery)}
                  >
                    First page
                  </button>
                ) : null}
                {page.hasMore && page.nextCursor ? (
                  <button
                    className="workspace-link"
                    disabled={busy || !canCall}
                    onClick={() => void list(appliedQuery, page.nextCursor!)}
                  >
                    Next page
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
        <footer>
          <ConnectionDetails bridge={bridge} />
        </footer>
      </div>
    </main>
  );
}
