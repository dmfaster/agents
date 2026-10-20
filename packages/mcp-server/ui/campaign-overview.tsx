import { useEffect, useState } from "react";
import type { AgentToolDataMap } from "@dmfaster/sdk";
import type { McpAppBridge } from "./bridge.ts";
import { readData } from "./companies-data.ts";
import { t, numberLocale } from "./locale.ts";

type History = AgentToolDataMap["history.list"];
export function CampaignOverview({
  detail,
  bridge,
}: {
  detail: AgentToolDataMap["campaign.inspect"];
  bridge: McpAppBridge;
}) {
  const [history, setHistory] = useState<History | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const campaignId = detail.campaign.id;
  useEffect(() => {
    let alive = true;
    setHistory(null);
    setError("");
    if (!bridge.canCallTools()) {
      setError(t("Activity unavailable"));
      return;
    }
    void bridge
      .callTool("history_list", { campaignId, limit: 100 })
      .then((response) => {
        const next = readData<History>(response);
        if (
          next.campaignId !== campaignId ||
          !Array.isArray(next.entries) ||
          next.entries.some(
            (entry) =>
              entry.state !== "Sent" ||
              !Number.isFinite(Date.parse(entry.sentAt)) ||
              (entry.campaignId && entry.campaignId !== campaignId),
          )
        )
          throw new Error(t("Activity unavailable"));
        if (alive) setHistory(next);
      })
      .catch((error) => {
        if (alive) setError(error instanceof Error ? error.message : String(error));
      });
    return () => {
      alive = false;
    };
  }, [bridge, campaignId, attempt]);
  const entries = history
    ? [...new Map(history.entries.map((entry) => [entry.id, entry])).values()].sort(
        (a, b) => Date.parse(a.sentAt) - Date.parse(b.sentAt),
      )
    : [];
  const days = new Map<string, number>();
  for (const entry of entries) {
    const day = new Date(entry.sentAt).toISOString().slice(0, 10);
    days.set(day, (days.get(day) ?? 0) + 1);
  }
  let cumulative = 0;
  const points = [...days].map(([day, count]) => ({ day, count: (cumulative += count) }));
  const start = Date.parse(points[0]?.day ?? "");
  const end = Date.parse(points.at(-1)?.day ?? "");
  const x = (day: string) =>
    points.length === 1 ? 300 : 12 + ((Date.parse(day) - start) / Math.max(1, end - start)) * 576;
  const y = (count: number) => 150 - (count / Math.max(1, entries.length)) * 132;
  const line = points.map((point) => `${x(point.day)},${y(point.count)}`).join(" ");
  const date = (day: string) =>
    new Date(day).toLocaleDateString(numberLocale(), {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    });
  const metrics = [
    ["Sent", detail.campaign.sentCount],
    ["Targets", detail.campaign.targetCount],
    ["Reached", detail.execution.companiesReached],
    ["Queued", detail.execution.queued],
  ] as const;
  return (
    <section aria-label={t("Campaign overview")}>
      <dl className="campaign-overview-metrics">
        {metrics.map(([label, value]) => (
          <div key={label}>
            <dt>{t(label)}</dt>
            <dd>{value == null ? "—" : value.toLocaleString(numberLocale())}</dd>
          </div>
        ))}
      </dl>
      <section className="campaign-activity" aria-label={t("Sent activity")}>
        <header>
          <h2>{t("Sent activity")}</h2>
          {history && entries.length ? (
            <small>
              {history.hasMore
                ? t("Latest {count} sends · UTC", { count: entries.length })
                : t("{count} recorded sends · UTC", { count: entries.length })}
            </small>
          ) : null}
        </header>
        {error ? (
          <p role="alert">
            {error}{" "}
            <button
              type="button"
              className="workspace-link"
              onClick={() => setAttempt((value) => value + 1)}
            >
              {t("Retry")}
            </button>
          </p>
        ) : !history ? (
          <p role="status">{t("Loading…")}</p>
        ) : !points.length ? (
          <p className="workspace-muted">{t("No sends yet")}</p>
        ) : (
          <>
            <svg viewBox="0 0 600 170" role="img" aria-label={t("Cumulative recorded sends")}>
              {[18, 84, 150].map((level) => (
                <line
                  key={level}
                  x1="12"
                  x2="588"
                  y1={level}
                  y2={level}
                  stroke="var(--dm-line)"
                  strokeDasharray="3 5"
                />
              ))}
              {points.length > 1 ? (
                <>
                  <polygon
                    points={`${x(points[0]!.day)},150 ${line} ${x(points.at(-1)!.day)},150`}
                    fill="currentColor"
                    opacity=".04"
                  />
                  <polyline
                    points={line}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              ) : null}
              {points.map((point) => (
                <circle
                  key={point.day}
                  cx={x(point.day)}
                  cy={y(point.count)}
                  r="3"
                  fill="currentColor"
                >
                  <title>
                    {date(point.day)}: {point.count}
                  </title>
                </circle>
              ))}
            </svg>
            <div className="campaign-activity-axis">
              <span>{date(points[0]!.day)}</span>
              <span>{points.length > 1 ? date(points.at(-1)!.day) : ""}</span>
            </div>
            <ol className="sr-only">
              {points.map((point) => (
                <li key={point.day}>
                  {date(point.day)}: {point.count}
                </li>
              ))}
            </ol>
          </>
        )}
      </section>
      <ul className="campaign-activity-values">
        <li>
          {t("Daily limit")}: {detail.campaign.dailyCap.toLocaleString(numberLocale())}
        </li>
      </ul>
    </section>
  );
}
