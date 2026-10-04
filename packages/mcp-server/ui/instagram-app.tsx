import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import type {
  InstagramWorkspacePayload,
  InstagramProfilePacket,
} from "../src/instagram-workspace.ts";
import type { InstagramEvaluationPage } from "../src/instagram-evaluation.ts";
import { McpAppBridge } from "./bridge.ts";
import {
  instagramPayload,
  mergeInstagramPage,
  instagramCounts,
  instagramShortlist,
  instagramShortlistCsv,
  instagramProfileUrl,
  type InstagramRows,
  type InstagramRow,
} from "./instagram-data.ts";

const bridge = new McpAppBridge({ name: "DM Faster Instagram prospecting" });
const statusLabels = {
  accept: "Provisional matches",
  review: "Review",
  exclude: "Excluded",
  pending: "Pending",
};
type Detail = { packet: InstagramProfilePacket; images: { sha256: string; url: string }[] };
function resultData(value: unknown) {
  const result = value as {
    isError?: boolean;
    structuredContent?: Record<string, unknown>;
    content?: { text?: string }[];
  };
  if (result?.isError)
    throw Error(
      String(
        (result.structuredContent?.error &&
          (result.structuredContent.error as { message?: string }).message) ||
          (result.structuredContent?.quote as { error?: { message?: string } } | undefined)?.error
            ?.message ||
          result.content?.[0]?.text ||
          "Read failed.",
      ),
    );
  return result.structuredContent ?? (result as Record<string, unknown>);
}
function downloadCsv(text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "instagram-research-shortlist.csv";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function App() {
  const [payload, setPayload] = useState<InstagramWorkspacePayload | null>(null);
  const [loaded, setLoaded] = useState<InstagramRows | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | InstagramRow["status"]>("all");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [detailLoading, setDetailLoading] = useState<string | null>(null);
  const [brief, setBrief] = useState("");
  const [source, setSource] = useState("");
  const [sourceType, setSourceType] = useState<"followers" | "following" | "likers" | "commenters">(
    "followers",
  );
  const [quantity, setQuantity] = useState("1000");
  const [quote, setQuote] = useState<Record<string, unknown> | null>(null);
  const generation = useRef(0);
  const detailGeneration = useRef(0);
  const loadedRef = useRef<InstagramRows | null>(null);
  function reset(next: InstagramWorkspacePayload) {
    generation.current++;
    detailGeneration.current++;
    const rows = next.evaluation ? mergeInstagramPage(null, next.evaluation) : null;
    loadedRef.current = rows;
    setPayload(next);
    setLoaded(rows);
    setSelected(new Set());
    setFilter("all");
    setDetail(null);
    setDetailLoading(null);
    setBrief(next.evaluation?.spec.query ?? "");
    setQuote(null);
    setBusy(false);
    setError("");
    setNotice("");
  }
  useEffect(() => {
    const apply = (value: unknown) => {
      try {
        const next = instagramPayload(value);
        if (next) reset(next);
      } catch {
        setError("This result has inconsistent profile counts. Request the snapshot again.");
      }
    };
    const unsubscribe = bridge.subscribe((n) => {
      if (n.method === "ui/notifications/tool-result") apply(n.params);
      if (n.method === "ui/notifications/host-context-changed") {
        bridge.applyHostContext(n.params ?? {});
        setReady(true);
      }
    });
    void bridge.initialize().then((initial) => {
      setReady(true);
      if (initial.output) apply(initial.output);
    });
    const observer = new ResizeObserver(() => bridge.reportSize());
    observer.observe(document.documentElement);
    return () => {
      unsubscribe();
      observer.disconnect();
    };
  }, []);
  async function choose(datasetId: string, preserveSpec = false) {
    const spec = preserveSpec ? loadedRef.current?.page.spec : undefined;
    const stamp = ++generation.current;
    detailGeneration.current++;
    setBusy(true);
    setError("");
    setSelected(new Set());
    setDetail(null);
    setDetailLoading(null);
    setQuote(null);
    loadedRef.current = null;
    setLoaded(null);
    try {
      const result = await bridge.callTool("instagram_workspace", {
        datasetId,
        mode: "replay",
        limit: 20,
        ...(spec ? { spec } : {}),
      });
      if (stamp !== generation.current) return;
      const next = instagramPayload(resultData(result));
      if (!next) throw Error("Invalid workspace result.");
      reset(next);
    } catch (e) {
      if (stamp === generation.current) setError(e instanceof Error ? e.message : "Read failed.");
    } finally {
      if (stamp === generation.current) setBusy(false);
    }
  }
  async function more() {
    const previous = loadedRef.current;
    if (!previous?.page.nextCursor || busy) return;
    const stamp = generation.current;
    setBusy(true);
    setError("");
    try {
      const value = await bridge.callTool("instagram_profiles_evaluate", {
        datasetId: previous.page.datasetId,
        mode: "replay",
        spec: previous.page.spec,
        cursor: previous.page.nextCursor,
        limit: 20,
      });
      if (stamp !== generation.current) return;
      const next = mergeInstagramPage(
        previous,
        resultData(value) as unknown as InstagramEvaluationPage,
      );
      loadedRef.current = next;
      setLoaded(next);
    } catch (e) {
      if (stamp === generation.current)
        setError(e instanceof Error ? e.message : "Page read failed.");
    } finally {
      if (stamp === generation.current) setBusy(false);
    }
  }
  async function inspect(row: InstagramRow) {
    if (!loaded || !bridge.canCallTools()) return;
    const stamp = ++detailGeneration.current;
    setDetailLoading(row.profileId);
    setDetail(null);
    setError("");
    try {
      const result = await bridge.callTool("instagram_profile_inspect", {
        datasetId: loaded.page.datasetId,
        revision: loaded.page.revision,
        profileId: row.profileId,
      });
      if (stamp !== detailGeneration.current) return;
      const packet = resultData(result) as unknown as InstagramProfilePacket;
      if (packet.profileId !== row.profileId || packet.revision !== loaded.page.revision)
        throw Error("The profile snapshot changed.");
      const meta = (result as { _meta?: { instagramImages?: unknown[] } })._meta;
      const images = (meta?.instagramImages ?? []).flatMap((value) => {
        const image = value as { sha256?: string; url?: string; content_type?: string };
        const manifest = packet.imageManifest.find(
          (m) => m.sha256 === image.sha256 && m.content_type === image.content_type,
        );
        return manifest &&
          typeof image.url === "string" &&
          image.url.length <= 6 * 1024 ** 2 &&
          /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]*={0,2}$/.test(image.url)
          ? [{ sha256: manifest.sha256, url: image.url }]
          : [];
      });
      setDetail({ packet, images });
    } catch (e) {
      if (stamp === detailGeneration.current)
        setError(e instanceof Error ? e.message : "Profile read failed.");
    } finally {
      if (stamp === detailGeneration.current) setDetailLoading(null);
    }
  }
  async function shareBrief() {
    setError("");
    setNotice("");
    try {
      await bridge.updateModelContext({
        content: [
          {
            type: "text",
            text: `Please refine this Instagram ICP into independent required/preferred criteria: ${brief}`,
          },
        ],
        structuredContent: {
          intent: "refine_instagram_icp",
          query: brief,
          datasetId: loaded?.page.datasetId ?? null,
          revision: loaded?.page.revision ?? null,
        },
      });
      setNotice("ICP shared with chat.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sharing is unavailable.");
    }
  }
  async function quoteSource() {
    if (!loaded || !source.trim()) return;
    setError("");
    setQuote(null);
    setBusy(true);
    const stamp = generation.current;
    try {
      const value = await bridge.callTool("instagram_acquisition_quote", {
        spec: loaded.page.spec,
        source: { type: sourceType, identifier: source.trim(), count: Number(quantity) },
      });
      if (stamp !== generation.current) return;
      const data = resultData(value);
      setQuote((data.quote as { data?: Record<string, unknown> })?.data ?? null);
    } catch (e) {
      if (stamp === generation.current) setError(e instanceof Error ? e.message : "Quote failed.");
    } finally {
      if (stamp === generation.current) setBusy(false);
    }
  }
  const rows = loaded?.rows ?? [];
  const counts = instagramCounts(rows);
  const visible = filter === "all" ? rows : rows.filter((row) => row.status === filter);
  const shortlist = instagramShortlist(rows, selected);
  const quoteCount = Number(quantity);
  const canRead = ready && bridge.canCallTools();
  const currentId = loaded?.page.datasetId ?? "";
  const dataset = payload?.datasets.find((d) => d.datasetId === currentId);
  function toggle(row: InstagramRow) {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(row.profileId)) next.delete(row.profileId);
      else next.add(row.profileId);
      return next;
    });
  }
  return (
    <main className="instagram-app">
      <header>
        <p className="eyebrow">Instagram · private research</p>
        <h1>Instagram prospecting</h1>
        <p>Review profiles against your ICP and assemble a provisional shortlist.</p>
      </header>
      <section className="instagram-panel">
        <label htmlFor="snapshot">Saved evidence</label>
        <select
          id="snapshot"
          value={currentId}
          disabled={!canRead || busy}
          onChange={(e) => void choose(e.target.value)}
        >
          <option value="" disabled>
            Select a snapshot
          </option>
          {payload?.datasets.map((d) => (
            <option key={d.datasetId} value={d.datasetId}>
              {d.label} · {d.totalProfiles} profiles
            </option>
          ))}
        </select>
        {!payload && <p>Open this view from a configured Instagram MCP snapshot.</p>}
        <label htmlFor="icp">Describe your Instagram ICP</label>
        <textarea
          id="icp"
          value={brief}
          maxLength={4000}
          rows={3}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="For example, freelance photographers in Oslo who offer bookings"
        />
        <button type="button" disabled={!ready || !brief.trim()} onClick={() => void shareBrief()}>
          Share ICP with chat
        </button>
        {loaded && brief.trim() !== loaded.page.spec.query.trim() && (
          <p className="instagram-muted">
            This edited ICP has not been applied. Share it with chat to update the criteria;
            displayed decisions and quotes use the current criteria below.
          </p>
        )}
      </section>
      {error && (
        <p role="alert" className="instagram-error">
          {error}
        </p>
      )}
      {notice && <p role="status">{notice}</p>}
      {loaded && (
        <>
          <section className="instagram-panel">
            <h2>{dataset?.label ?? "Saved profiles"}</h2>
            <p className="snapshot-count">
              {rows.length} loaded of {loaded.page.totalProfiles} saved profiles
              {loaded.page.nextCursor ? " · more available" : ""}
            </p>
            <p className="instagram-muted">
              Counts below cover the loaded profiles. Missing evidence follows each criterion's
              policy; provider failures stay pending.
            </p>
            <div className="instagram-filters">
              <button aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
                All {rows.length}
              </button>
              {(Object.keys(statusLabels) as (keyof typeof statusLabels)[]).map((key) => (
                <button key={key} aria-pressed={filter === key} onClick={() => setFilter(key)}>
                  {statusLabels[key]} {counts[key]}
                </button>
              ))}
            </div>
            <div className="instagram-actions">
              <button
                disabled={!rows.some((r) => r.status === "accept")}
                onClick={() =>
                  setSelected(
                    new Set(rows.filter((r) => r.status === "accept").map((r) => r.profileId)),
                  )
                }
              >
                Select loaded matches
              </button>
              <button disabled={!selected.size} onClick={() => setSelected(new Set())}>
                Clear selection
              </button>
              <button
                disabled={!selected.size}
                onClick={() => downloadCsv(instagramShortlistCsv(shortlist))}
              >
                Export shortlist CSV
              </button>
              <span>
                {selected.size} selected · {shortlist.filter((r) => r.status === "review").length}{" "}
                require review
              </span>
            </div>
            <div className="instagram-table">
              <table>
                <thead>
                  <tr>
                    <th>Include</th>
                    <th>Profile</th>
                    <th>Decision</th>
                    <th>Evidence / reason</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row) => (
                    <tr key={row.profileId}>
                      <td>
                        <input
                          type="checkbox"
                          aria-label={`Include ${row.username}`}
                          checked={selected.has(row.profileId)}
                          disabled={row.status === "pending" || row.status === "exclude"}
                          onChange={() => toggle(row)}
                        />
                      </td>
                      <td>
                        <button
                          className="profile-link"
                          disabled={!canRead}
                          onClick={() => void inspect(row)}
                        >
                          @{row.username}
                        </button>
                        <small>
                          {row.observedAt
                            ? `Evidence: ${row.observedAt}`
                            : "Observation time unavailable"}
                        </small>
                      </td>
                      <td>{statusLabels[row.status]}</td>
                      <td>
                        {row.status === "pending"
                          ? row.reason
                          : row.reasons.length
                            ? row.reasons.join(", ")
                            : "Required criteria supported"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!visible.length && <p>No loaded profiles in this view.</p>}
            <button
              disabled={!canRead || busy || !loaded.page.nextCursor}
              onClick={() => void more()}
            >
              {busy ? "Reading…" : "Load next page"}
            </button>
            <button
              disabled={!canRead || busy}
              onClick={() => void choose(loaded.page.datasetId, true)}
            >
              Refresh snapshot
            </button>
            <details>
              <summary>Current ICP criteria</summary>
              <p>{loaded.page.spec.query}</p>
              <ul>
                {loaded.page.spec.criteria.map((c) => (
                  <li key={c.id}>
                    <b>{c.role}</b> · {c.statement}
                    <small>
                      Unknown evidence: {c.unknown}
                      {c.literalRule ? ` · Exact ${c.literalRule.kind} check` : ""}
                    </small>
                  </li>
                ))}
              </ul>
            </details>
          </section>
          <section className="instagram-panel">
            <h2>Acquisition for this ICP</h2>
            <p>
              Preview extraction credits for a relevant source. Start any requested extraction in
              chat.
            </p>
            <div className="quote-fields">
              <label>
                Source audience
                <select
                  value={sourceType}
                  disabled={busy}
                  onChange={(e) => {
                    setSourceType(e.target.value as typeof sourceType);
                    setQuote(null);
                  }}
                >
                  <option value="followers">Followers</option>
                  <option value="following">Following</option>
                  <option value="likers">Post likers</option>
                  <option value="commenters">Post commenters</option>
                </select>
              </label>
              <label>
                {sourceType === "followers" || sourceType === "following"
                  ? "Instagram account"
                  : "Instagram post URL"}
                <input
                  value={source}
                  maxLength={300}
                  disabled={busy}
                  onChange={(e) => {
                    setSource(e.target.value);
                    setQuote(null);
                  }}
                  placeholder="Relevant niche source"
                />
              </label>
              <label>
                Profiles
                <input
                  type="number"
                  min={1}
                  max={2147483647}
                  value={quantity}
                  disabled={busy}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    setQuote(null);
                  }}
                />
              </label>
            </div>
            <button
              disabled={
                !canRead ||
                busy ||
                !source.trim() ||
                !Number.isSafeInteger(quoteCount) ||
                quoteCount < 1 ||
                quoteCount > 2147483647
              }
              onClick={() => void quoteSource()}
            >
              Preview extraction credits
            </button>
            {quote && (
              <p role="status">
                {String(quote.message ?? "Quote returned.")} Enrichment and qualification costs are
                separate.
              </p>
            )}
          </section>
        </>
      )}
      {(detailLoading || detail) && (
        <section className="instagram-panel" aria-label="Profile evidence">
          <button
            onClick={() => {
              detailGeneration.current++;
              setDetail(null);
              setDetailLoading(null);
            }}
          >
            Close profile evidence
          </button>
          {detailLoading ? (
            <p>Loading original evidence…</p>
          ) : (
            detail && (
              <>
                <h2>{detail.packet.profile.name || `@${detail.packet.profile.username}`}</h2>
                <p className="profile-biography">
                  {detail.packet.profile.biography || "No saved biography."}
                </p>
                <p>
                  {detail.packet.profile.city || "Location not stated"} ·{" "}
                  {detail.packet.profile.category || "Category not stated"}
                </p>
                <dl>
                  <dt>Followers</dt>
                  <dd>{detail.packet.profile.followerCount ?? "Unknown"}</dd>
                  <dt>Private profile</dt>
                  <dd>
                    {detail.packet.profile.isPrivate === null
                      ? "Unknown"
                      : String(detail.packet.profile.isPrivate)}
                  </dd>
                  <dt>Verified</dt>
                  <dd>
                    {detail.packet.profile.isVerified === null
                      ? "Unknown"
                      : String(detail.packet.profile.isVerified)}
                  </dd>
                </dl>
                <div className="saved-images">
                  {detail.images.map((image, index) => (
                    <img
                      key={image.sha256}
                      src={image.url}
                      alt={`Original saved image ${index + 1}`}
                    />
                  ))}
                </div>
                {detail.packet.imageAvailability === "missing" && (
                  <p>Saved image bytes are unavailable.</p>
                )}
                {detail.packet.imageManifest.length === 0 && (
                  <p>No images saved for this profile.</p>
                )}
                <button
                  disabled={!bridge.canOpenLinks()}
                  onClick={() =>
                    void bridge
                      .openLink(instagramProfileUrl(detail.packet.profile.username))
                      .catch(() => setError("Opening profile links is unavailable in this host."))
                  }
                >
                  Open Instagram profile
                </button>
                {(() => {
                  const row = rows.find((r) => r.profileId === detail.packet.profileId);
                  return row && row.status !== "pending" ? (
                    <details>
                      <summary>Model judgments and literal checks</summary>
                      {loaded?.page.spec.criteria.map((c) => {
                        const judgment = row.criteria[c.id];
                        const exact = row.literalChecks?.[c.id];
                        const cited = row.evidence[c.id];
                        return judgment ? (
                          <div key={c.id} className="criterion-result">
                            <b>{c.id}</b>
                            <p>
                              {judgment.judgment} ·{" "}
                              {(judgment.probabilities[judgment.judgment] * 100).toFixed(1)}% raw
                              model probability
                            </p>
                            <p>
                              Source: {cited?.source ?? judgment.evidence} ·{" "}
                              {cited?.value ?? "No literal source nominated"}
                            </p>
                            {exact && (
                              <p>
                                Code check: {exact.field} = {String(exact.value)} → {exact.judgment}
                              </p>
                            )}
                          </div>
                        ) : null;
                      })}
                    </details>
                  ) : null;
                })()}
              </>
            )
          )}
        </section>
      )}
      <footer>
        Local evaluation. Selections are research context; contact history and campaign eligibility
        are checked in later stages.
      </footer>
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
