"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./card";
import { InfoIcon } from "lucide-react";
const { useId, useState, useRef, useEffect, useMemo } = React;

const CHART_WIDTH = 1_000;
const CHART_HEIGHT = 260;
const CHART_LEFT = 54;
const CHART_RIGHT = 18;
const CHART_TOP = 16;
const CHART_BOTTOM = 34;

export type AnalyticsChartDatum = {
  id: string;
  label: string;
  fullLabel: string;
  values: number[];
};

export type AnalyticsChartSeries = {
  label: string;
  color: string;
  areaColor?: string;
  dashed?: boolean;
  width?: number;
};

function smoothLinePath(values: number[], getY: (value: number) => number, plotWidth: number) {
  if (!values.length) return "";
  const getX = (index: number) =>
    CHART_LEFT + (values.length === 1 ? plotWidth / 2 : (index / (values.length - 1)) * plotWidth);
  let path = `M ${getX(0)} ${getY(values[0] ?? 0)}`;

  for (let index = 1; index < values.length; index += 1) {
    const previousX = getX(index - 1);
    const currentX = getX(index);
    const midX = (previousX + currentX) / 2;
    path += ` C ${midX} ${getY(values[index - 1] ?? 0)}, ${midX} ${getY(values[index] ?? 0)}, ${currentX} ${getY(values[index] ?? 0)}`;
  }

  return path;
}

export function AnalyticsMetricCard({
  label,
  value,
  detail,
  action,
}: {
  label: string;
  value: string;
  detail?: string;
  action?: React.ReactNode;
}) {
  return (
    <article aria-label={label} className="min-w-0">
      <Card className="h-full">
        <CardContent className="flex flex-col gap-2">
          <div className="flex min-h-6 flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            {action}
          </div>
          <p className="text-3xl font-semibold tracking-tight tabular-nums text-foreground [overflow-wrap:anywhere]">
            {value}
          </p>
          {detail ? (
            <p className="text-xs leading-relaxed text-muted-foreground">{detail}</p>
          ) : null}
        </CardContent>
      </Card>
    </article>
  );
}

function LegendItem({ series }: { series: AnalyticsChartSeries }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
      <span
        className={`h-0.5 w-5 ${series.dashed ? "border-t border-dashed bg-transparent" : ""}`}
        style={series.dashed ? { borderColor: series.color } : { backgroundColor: series.color }}
      />
      {series.label}
    </span>
  );
}

export function AnalyticsLineChartCard({
  title,
  description,
  data,
  series,
  emptyLabel,
  note,
  ariaLabel,
  formatValue = (value) => new Intl.NumberFormat("en-US").format(value),
  formatCompactValue = (value) =>
    new Intl.NumberFormat("en-US", {
      notation: value >= 1_000 ? "compact" : "standard",
      maximumFractionDigits: value >= 1_000 ? 1 : 0,
    }).format(value),
  keyboardHint = "Use the left and right arrow keys to inspect chart values.",
}: {
  title: string;
  description: string;
  data: AnalyticsChartDatum[];
  series: AnalyticsChartSeries[];
  emptyLabel: string;
  note?: React.ReactNode;
  ariaLabel?: string;
  formatValue?: (value: number) => string;
  formatCompactValue?: (value: number) => string;
  keyboardHint?: string;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const gradientId = useId().replaceAll(":", "");
  const chartRef = useRef<SVGSVGElement>(null);
  const [chartSize, setChartSize] = useState({ width: CHART_WIDTH, height: CHART_HEIGHT });
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const measure = () => {
      const { width, height } = chart.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;
      setChartSize((previous) =>
        previous.width === width && previous.height === height ? previous : { width, height },
      );
    };
    const observer = new ResizeObserver(measure);
    observer.observe(chart);
    measure();
    return () => observer.disconnect();
  }, []);
  const plotWidth = Math.max(1, chartSize.width - CHART_LEFT - CHART_RIGHT);
  const plotHeight = chartSize.height - CHART_TOP - CHART_BOTTOM;
  const seriesCount = series.length;
  const baselineY = CHART_TOP + plotHeight;
  const { getY, paths, yTicks, xTickIndexes, isEmpty } = useMemo(() => {
    const values = data.flatMap((point) => point.values);
    const maxValue = Math.max(1, ...values);
    const chartMax = Math.max(1, Math.ceil(maxValue * 1.12));
    const getY = (value: number) => CHART_TOP + plotHeight - (value / chartMax) * plotHeight;
    const paths = Array.from({ length: seriesCount }, (_entry, seriesIndex) =>
      smoothLinePath(
        data.map((point) => point.values[seriesIndex] ?? 0),
        getY,
        plotWidth,
      ),
    );
    const yTicks = Array.from(
      new Set(Array.from({ length: 5 }, (_, index) => Math.round((chartMax / 4) * index))),
    );
    const xTickIndexes = Array.from(
      new Set(
        (chartSize.width < 480 ? [0, 0.5, 1] : [0, 0.25, 0.5, 0.75, 1]).map((ratio) =>
          Math.round((data.length - 1) * ratio),
        ),
      ),
    ).filter((index) => index >= 0 && index < data.length);
    return { getY, paths, yTicks, xTickIndexes, isEmpty: values.every((value) => value === 0) };
  }, [data, seriesCount, plotWidth, plotHeight, chartSize.width]);
  const hoveredPoint = hoveredIndex === null ? null : (data[hoveredIndex] ?? null);
  const hoveredX =
    hoveredIndex === null
      ? 0
      : CHART_LEFT +
        (data.length === 1
          ? plotWidth / 2
          : (hoveredIndex / Math.max(1, data.length - 1)) * plotWidth);
  const tooltipWidth = Math.min(240, Math.max(1, chartSize.width - CHART_LEFT - 12));
  const tooltipLeft = Math.max(
    0,
    Math.min(
      hoveredX > chartSize.width * 0.65 ? hoveredX - tooltipWidth : hoveredX + 12,
      chartSize.width - tooltipWidth,
    ),
  );

  function handleChartPointerMove(event: React.PointerEvent<SVGSVGElement>) {
    if (!data.length) return;
    const matrix = event.currentTarget.getScreenCTM();
    if (!matrix) return;
    const inverse = matrix.inverse();
    const pointerX = inverse.a * event.clientX + inverse.c * event.clientY + inverse.e;
    if (!Number.isFinite(pointerX)) return;
    const ratio = Math.max(0, Math.min(1, (pointerX - CHART_LEFT) / plotWidth));
    setHoveredIndex(Math.round(ratio * Math.max(0, data.length - 1)));
  }

  return (
    <Card role="region" aria-label={title}>
      <CardHeader className="flex flex-col gap-3 border-b sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>
            <h2>{title}</h2>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {series.map((entry) => (
            <LegendItem key={entry.label} series={entry} />
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div className="relative min-h-[220px] w-full sm:min-h-[260px]">
          <svg
            ref={chartRef}
            viewBox={`0 0 ${chartSize.width} ${chartSize.height}`}
            className="h-[220px] w-full overflow-visible rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-[260px]"
            role="img"
            aria-label={ariaLabel || title}
            aria-describedby={`${gradientId}-keyboard-hint${hoveredPoint ? ` ${gradientId}-tooltip` : ""}`}
            tabIndex={data.length && !isEmpty ? 0 : undefined}
            onFocus={() => setHoveredIndex(data.length - 1)}
            onBlur={() => setHoveredIndex(null)}
            onKeyDown={(event) => {
              if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key) || !data.length)
                return;
              event.preventDefault();
              setHoveredIndex((index) =>
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? data.length - 1
                    : Math.max(
                        0,
                        Math.min(
                          data.length - 1,
                          (index ?? data.length - 1) + (event.key === "ArrowLeft" ? -1 : 1),
                        ),
                      ),
              );
            }}
            onPointerMove={handleChartPointerMove}
            onPointerLeave={() => setHoveredIndex(null)}
          >
            <title>{title}</title>
            <defs>
              {series.map((entry, index) =>
                entry.areaColor ? (
                  <linearGradient
                    key={entry.label}
                    id={`${gradientId}-${index}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={entry.areaColor} stopOpacity="0.28" />
                    <stop offset="100%" stopColor={entry.areaColor} stopOpacity="0.02" />
                  </linearGradient>
                ) : null,
              )}
            </defs>

            {yTicks.map((tick) => {
              const y = getY(tick);
              return (
                <g key={tick}>
                  <line
                    x1={CHART_LEFT}
                    y1={y}
                    x2={CHART_LEFT + plotWidth}
                    y2={y}
                    stroke="var(--border)"
                    strokeWidth="1"
                  />
                  <text
                    x={CHART_LEFT - 12}
                    y={y + 4}
                    textAnchor="end"
                    fill="var(--muted-foreground)"
                    fontSize="11"
                    fontWeight="500"
                  >
                    {formatCompactValue(tick)}
                  </text>
                </g>
              );
            })}

            {xTickIndexes.map((index) => {
              const point = data[index];
              const x =
                CHART_LEFT +
                (data.length === 1
                  ? plotWidth / 2
                  : (index / Math.max(1, data.length - 1)) * plotWidth);
              return point ? (
                <text
                  key={`${point.id}-${index}`}
                  x={x}
                  y={chartSize.height - 12}
                  textAnchor={index === 0 ? "start" : index === data.length - 1 ? "end" : "middle"}
                  fill="var(--muted-foreground)"
                  fontSize="11"
                  fontWeight="500"
                >
                  {point.label}
                </text>
              ) : null;
            })}

            {series.map((entry, index) => {
              const path = paths[index] ?? "";
              const areaPath = path
                ? `${path} L ${CHART_LEFT + plotWidth} ${baselineY} L ${CHART_LEFT} ${baselineY} Z`
                : "";
              return (
                <g key={entry.label}>
                  {entry.areaColor && areaPath ? (
                    <path d={areaPath} fill={`url(#${gradientId}-${index})`} />
                  ) : null}
                  {path ? (
                    <path
                      d={path}
                      fill="none"
                      stroke={entry.color}
                      strokeWidth={entry.width ?? 2.5}
                      strokeDasharray={entry.dashed ? "7 6" : undefined}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : null}
                </g>
              );
            })}

            {hoveredPoint ? (
              <g>
                <line
                  x1={hoveredX}
                  y1={CHART_TOP}
                  x2={hoveredX}
                  y2={baselineY}
                  stroke="var(--muted-foreground)"
                  strokeDasharray="4 5"
                  strokeWidth="1"
                />
                {series.map((entry, index) => (
                  <circle
                    key={entry.label}
                    cx={hoveredX}
                    cy={getY(hoveredPoint.values[index] ?? 0)}
                    r={index === 0 ? 5 : 4}
                    fill="var(--card)"
                    stroke={entry.color}
                    strokeWidth={index === 0 ? 3 : 2.5}
                  />
                ))}
              </g>
            ) : null}
          </svg>

          {hoveredPoint ? (
            <div
              role="tooltip"
              aria-live="polite"
              id={`${gradientId}-tooltip`}
              className="pointer-events-none absolute top-2 z-10 max-w-full rounded-lg border border-border bg-popover p-3 text-xs text-popover-foreground shadow-lg"
              style={{
                left: tooltipLeft,
                width: tooltipWidth,
              }}
            >
              <p className="font-semibold">{hoveredPoint.fullLabel}</p>
              <div className="mt-2 flex flex-col gap-1.5 text-muted-foreground">
                {series.map((entry, index) => (
                  <p key={entry.label} className="flex items-center justify-between gap-5">
                    <span>{entry.label}</span>
                    <strong className="tabular-nums text-popover-foreground">
                      {formatValue(hoveredPoint.values[index] ?? 0)}
                    </strong>
                  </p>
                ))}
              </div>
            </div>
          ) : null}

          {isEmpty ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="rounded-lg border border-border bg-card/90 px-4 py-3 text-sm font-medium text-muted-foreground">
                {emptyLabel}
              </div>
            </div>
          ) : null}
        </div>

        {note ? (
          <div className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <InfoIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <span>{note}</span>
          </div>
        ) : null}
        <p id={`${gradientId}-keyboard-hint`} className="sr-only">
          {keyboardHint}
        </p>
      </CardContent>
    </Card>
  );
}
