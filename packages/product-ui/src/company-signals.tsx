"use client";
import * as React from "react";
import { recruitmentDisplayUntil } from "./lib/recruitment-display";
import { Button } from "./components/button";
import { useState } from "react";
import { Landmark, ChevronDown } from "lucide-react";
import type {
  CompanySignalsProfile,
  PipelinePublicFundingSource,
  PipelinePublicFundingSourceSummary,
  PipelinePublicFundingEvent,
} from "./company-signals-types";
export type { CompanySignalsProfile, CompanyRecruitment } from "./company-signals-types";
type Translate = (key: string, fallback: string, values?: Record<string, string>) => string;
type SignalLocale = { language?: "fi" | "en"; t?: Translate };
const english: Translate = (key, fallback, values = {}) =>
  (fallback || key).replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? `{${name}}`));
// Shared directly by the app drawer and MCP drawer; no fetching or workspace mutation.
export function formatCompanyDate(value: string, language: "fi" | "en" = "en") {
  const normalized = String(value || "").trim();
  if (!normalized) return "—";

  const exactDate = normalized.match(/^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/u);
  if (!exactDate) return normalized;
  const [, year, month, day] = exactDate;
  const timestamp = Date.UTC(Number(year), Number(month) - 1, Number(day));
  const parsed = new Date(timestamp);
  if (
    parsed.getUTCFullYear() !== Number(year) ||
    parsed.getUTCMonth() + 1 !== Number(month) ||
    parsed.getUTCDate() !== Number(day)
  ) {
    return normalized;
  }

  return language === "fi" ? `${day}.${month}.${year}` : `${month}/${day}/${year}`;
}

function formatCount(value: number, locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    notation: value >= 10_000 ? "compact" : "standard",
  }).format(value);
}

function formatCurrency(value: number | null | undefined, locale: string) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    notation: Math.abs(value) >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: Math.abs(value) >= 1_000_000 ? 1 : 0,
  }).format(value);
}

function formatFundingDate(value: string, locale: string) {
  if (!value) return "";
  if (locale === "fi-FI") return formatCompanyDate(value, "fi");
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return value;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(timestamp));
}

function publicFundingSourceLabel(source: PipelinePublicFundingSource, t: Translate) {
  if (source === "tem") return t("pipeline.canary.company.fundingSourceTem", "TEM enterprise aid");
  if (source === "eura2021") return t("pipeline.canary.company.fundingSourceEura", "EURA 2021");
  if (source === "leader") return t("pipeline.canary.company.fundingSourceLeader", "LEADER");
  return t("pipeline.canary.company.fundingSourceRural", "Rural business funding");
}

function publicFundingSourceDescription(source: PipelinePublicFundingSource, t: Translate) {
  if (source === "tem")
    return t(
      "pipeline.canary.company.fundingSourceTemDescription",
      "Actual aid decisions and payments",
    );
  if (source === "eura2021")
    return t(
      "pipeline.canary.company.fundingSourceEuraDescription",
      "EU programme project funding",
    );
  if (source === "leader")
    return t("pipeline.canary.company.fundingSourceLeaderDescription", "LEADER rural projects");
  return t(
    "pipeline.canary.company.fundingSourceRuralDescription",
    "Other ELY rural business projects",
  );
}

function publicFundingSourceMetrics(
  summary: PipelinePublicFundingSourceSummary,
  locale: string,
  t: Translate,
) {
  if (summary.source === "tem") {
    return [
      [
        t("pipeline.canary.company.fundingGranted", "Granted"),
        formatCurrency(summary.grantedEur, locale),
      ],
      [t("pipeline.canary.company.fundingPaid", "Paid"), formatCurrency(summary.paidEur, locale)],
    ];
  }
  if (summary.source === "eura2021") {
    return [
      [
        t("pipeline.canary.company.fundingPlanned", "Planned"),
        formatCurrency(summary.plannedPublicFundingEur, locale),
      ],
      [
        t("pipeline.canary.company.fundingRealized", "Realized"),
        formatCurrency(summary.realizedPublicFundingEur, locale),
      ],
    ];
  }
  return [
    [
      t("pipeline.canary.company.fundingPublicAmount", "Public funding"),
      formatCurrency(summary.publicFundingEur, locale),
    ],
  ];
}

function publicFundingEventAmount(event: PipelinePublicFundingEvent, locale: string, t: Translate) {
  if (event.source === "tem") {
    return event.recordKind === "payment"
      ? `${t("pipeline.canary.company.fundingPaid", "Paid")} ${formatCurrency(event.paidEur, locale)}`
      : `${t("pipeline.canary.company.fundingGranted", "Granted")} ${formatCurrency(event.grantedEur, locale)}`;
  }
  if (event.source === "eura2021") {
    return event.realizedPublicFundingEur > 0
      ? `${t("pipeline.canary.company.fundingRealized", "Realized")} ${formatCurrency(event.realizedPublicFundingEur, locale)}`
      : `${t("pipeline.canary.company.fundingPlanned", "Planned")} ${formatCurrency(event.plannedPublicFundingEur, locale)}`;
  }
  return `${t("pipeline.canary.company.fundingPublicAmount", "Public funding")} ${formatCurrency(event.publicFundingEur, locale)}`;
}

export function FundingSignalsCard({
  profile,
  standalone = false,
  language = "en",
  t = english,
}: { profile: CompanySignalsProfile; standalone?: boolean } & SignalLocale) {
  const locale = language === "fi" ? "fi-FI" : "en-US";
  const [expanded, setExpanded] = useState(false);
  const sourceCount = (profile.funding ? 1 : 0) + (profile.publicFunding?.sources.length || 0);
  const recordCount =
    (profile.funding?.projectCount || 0) + (profile.publicFunding?.eventCount || 0);
  const latestDate =
    profile.publicFunding?.latestEventDate || profile.funding?.latestProjectDate || "";

  const summary = (
    <span className="flex items-start gap-3">
      <Landmark className="mt-0.5 h-4 w-4 text-foreground" />
      <span>
        <span className="block text-sm font-medium text-foreground">
          {t("pipeline.canary.company.publicFunding", "Public funding")}
        </span>
        <span className="mt-1 block text-sm font-semibold text-foreground">
          {t(
            "pipeline.canary.company.fundingSourcesFound",
            "{count} sources with funding records",
            { count: String(sourceCount) },
          )}
        </span>
        <span className="mt-1 block text-xs text-foreground">
          {t("pipeline.canary.company.fundingRecords", "{count} source records", {
            count: formatCount(recordCount, locale),
          })}
          {latestDate
            ? ` · ${t("pipeline.canary.company.fundingLatest", "latest {date}", { date: formatFundingDate(latestDate, locale) })}`
            : ""}
        </span>
      </span>
    </span>
  );

  return (
    <div className={standalone ? "min-w-0" : "mt-6 border-t border-border pt-6"}>
      {standalone ? (
        <p className="text-sm leading-6 text-muted-foreground">
          {t("pipeline.canary.company.fundingRecords", "{count} source records", {
            count: formatCount(recordCount, locale),
          })}
          {latestDate
            ? ` · ${t("pipeline.canary.company.fundingLatest", "latest {date}", { date: formatFundingDate(latestDate, locale) })}`
            : ""}
        </p>
      ) : (
        <Button
          variant="ghost"
          size="row"
          type="button"
          className="flex w-full items-start justify-between gap-3 text-left"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {summary}
          <ChevronDown
            className={
              expanded
                ? "mt-0.5 h-4 w-4 shrink-0 rotate-180 text-foreground transition-transform"
                : "mt-0.5 h-4 w-4 shrink-0 text-foreground transition-transform"
            }
          />
        </Button>
      )}

      {standalone || expanded ? (
        <div className="mt-6 flex flex-col gap-6 text-sm">
          {profile.funding ? (
            <section className="border-t border-border pt-6 first:border-t-0 first:pt-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-foreground">Business Finland</h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t(
                      "pipeline.canary.company.fundingSourceBusinessFinlandDescription",
                      "Company funding and project aggregate",
                    )}
                  </p>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {t("pipeline.canary.company.fundingProjectCount", "{count} projects", {
                    count: String(profile.funding.projectCount),
                  })}
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">
                    {t("pipeline.canary.company.fundingGranted", "Granted")}
                  </dt>
                  <dd className="mt-0.5 font-semibold text-foreground">
                    {formatCurrency(profile.funding.grantedEur, locale)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">
                    {t("pipeline.canary.company.fundingPaid", "Paid")}
                  </dt>
                  <dd className="mt-0.5 font-semibold text-foreground">
                    {formatCurrency(profile.funding.paidEur, locale)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">
                    {t("pipeline.canary.company.fundingActiveProjects", "Active projects")}
                  </dt>
                  <dd className="mt-0.5 font-semibold text-foreground">
                    {profile.funding.activeProjectCount}
                  </dd>
                </div>
                {profile.funding.firstYear || profile.funding.lastYear ? (
                  <div>
                    <dt className="text-xs font-medium text-muted-foreground">
                      {t("pipeline.canary.company.fundingPeriod", "Funding period")}
                    </dt>
                    <dd className="mt-0.5 font-semibold text-foreground">
                      {[profile.funding.firstYear || "", profile.funding.lastYear || ""]
                        .filter(Boolean)
                        .join("–")}
                    </dd>
                  </div>
                ) : null}
                {profile.funding.latestService ? (
                  <div>
                    <dt className="text-xs font-medium text-muted-foreground">
                      {t("pipeline.canary.company.fundingService", "Service")}
                    </dt>
                    <dd className="mt-0.5 font-semibold text-foreground">
                      {profile.funding.latestService}
                    </dd>
                  </div>
                ) : null}
                {profile.funding.latestProgramme ? (
                  <div>
                    <dt className="text-xs font-medium text-muted-foreground">
                      {t("pipeline.canary.company.fundingProgramme", "Programme")}
                    </dt>
                    <dd className="mt-0.5 font-semibold text-foreground">
                      {profile.funding.latestProgramme}
                    </dd>
                  </div>
                ) : null}
                <div className="col-span-2 border-t border-success/14 pt-3">
                  <dt className="font-semibold text-foreground">
                    {t("pipeline.canary.company.fundingBreakdown", "Funding breakdown")}
                  </dt>
                  <dd className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-foreground sm:grid-cols-4">
                    <span>
                      <strong className="block text-xs text-foreground">
                        {t("pipeline.canary.company.fundingGrant", "Grants")}
                      </strong>
                      {formatCurrency(profile.funding.grantedGrantEur, locale)}
                    </span>
                    <span>
                      <strong className="block text-xs text-foreground">
                        {t("pipeline.canary.company.fundingLoan", "Loans")}
                      </strong>
                      {formatCurrency(profile.funding.grantedLoanEur, locale)}
                    </span>
                    <span>
                      <strong className="block text-xs text-foreground">
                        {t("pipeline.canary.company.fundingEakr", "EAKR")}
                      </strong>
                      {formatCurrency(profile.funding.grantedEakrEur, locale)}
                    </span>
                    <span>
                      <strong className="block text-xs text-foreground">
                        {t("pipeline.canary.company.fundingResearch", "Research")}
                      </strong>
                      {formatCurrency(profile.funding.grantedResearchEur, locale)}
                    </span>
                  </dd>
                </div>
                {profile.funding.latestProjectStatus ||
                profile.funding.latestInstrument ||
                profile.funding.latestSupportType ||
                profile.funding.latestProjectDate ? (
                  <div className="col-span-2 border-t border-success/14 pt-3">
                    <dt className="font-semibold text-foreground">
                      {t(
                        "pipeline.canary.company.latestFundingActivity",
                        "Latest funding activity",
                      )}
                    </dt>
                    <dd className="mt-1 text-foreground">
                      {[
                        profile.funding.latestProjectStatus,
                        profile.funding.latestInstrument,
                        profile.funding.latestSupportType,
                        formatFundingDate(profile.funding.latestProjectDate, locale),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </dd>
                  </div>
                ) : null}
                {profile.funding.fundingServices.length ? (
                  <div className="col-span-2">
                    <dt className="text-xs font-medium text-muted-foreground">
                      {t("pipeline.canary.company.fundingServices", "Funding services")}
                    </dt>
                    <dd className="mt-0.5 font-semibold text-foreground">
                      {profile.funding.fundingServices.join(" · ")}
                    </dd>
                  </div>
                ) : null}
                {profile.funding.programmes.length ? (
                  <div className="col-span-2">
                    <dt className="text-xs font-medium text-muted-foreground">
                      {t("pipeline.canary.company.fundingProgrammes", "Programmes")}
                    </dt>
                    <dd className="mt-0.5 font-semibold text-foreground">
                      {profile.funding.programmes.join(" · ")}
                    </dd>
                  </div>
                ) : null}
                {profile.funding.projectMunicipalities.length ? (
                  <div className="col-span-2">
                    <dt className="text-xs font-medium text-muted-foreground">
                      {t("pipeline.canary.company.fundingMunicipalities", "Project municipalities")}
                    </dt>
                    <dd className="mt-0.5 font-semibold text-foreground">
                      {profile.funding.projectMunicipalities.join(" · ")}
                    </dd>
                  </div>
                ) : null}
                {profile.funding.projectRegions.length ? (
                  <div className="col-span-2">
                    <dt className="text-xs font-medium text-muted-foreground">
                      {t("pipeline.canary.company.fundingRegions", "Project regions")}
                    </dt>
                    <dd className="mt-0.5 font-semibold text-foreground">
                      {profile.funding.projectRegions.join(" · ")}
                    </dd>
                  </div>
                ) : null}
                <div className="col-span-2 border-t border-success/14 pt-3">
                  <dt className="font-semibold text-foreground">
                    {t("pipeline.canary.company.projectStatuses", "Project statuses")}
                  </dt>
                  <dd className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-foreground">
                    <span>
                      {t("pipeline.canary.company.activeProjects", "Active")}:{" "}
                      {profile.funding.activeProjectCount}
                    </span>
                    <span>
                      {t("pipeline.canary.company.waitingProjects", "Waiting")}:{" "}
                      {profile.funding.waitingProjectCount}
                    </span>
                    <span>
                      {t("pipeline.canary.company.approvedProjects", "Approved")}:{" "}
                      {profile.funding.approvedProjectCount}
                    </span>
                    <span>
                      {t("pipeline.canary.company.endedProjects", "Ended")}:{" "}
                      {profile.funding.endedProjectCount}
                    </span>
                    <span>
                      {t("pipeline.canary.company.cancelledProjects", "Cancelled")}:{" "}
                      {profile.funding.cancelledProjectCount}
                    </span>
                  </dd>
                </div>
              </dl>
            </section>
          ) : null}

          {profile.publicFunding?.sources.map((summary) => (
            <section
              key={summary.source}
              className="border-t border-border pt-6 first:border-t-0 first:pt-0"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-foreground">
                    {publicFundingSourceLabel(summary.source, t)}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {publicFundingSourceDescription(summary.source, t)}
                  </p>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {t("pipeline.canary.company.fundingRecordCount", "{count} records", {
                    count: formatCount(summary.eventCount, locale),
                  })}
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-3">
                {publicFundingSourceMetrics(summary, locale, t).map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
                    <dd className="mt-0.5 font-semibold text-foreground">{value}</dd>
                  </div>
                ))}
                {summary.latestEventDate ? (
                  <div>
                    <dt className="text-xs font-medium text-muted-foreground">
                      {t("pipeline.canary.company.fundingLatestRecord", "Latest record")}
                    </dt>
                    <dd className="mt-0.5 font-semibold text-foreground">
                      {formatFundingDate(summary.latestEventDate, locale)}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </section>
          ))}

          {profile.publicFunding?.recentEvents.length ? (
            <section className="border-t border-border pt-6 first:border-t-0 first:pt-0">
              <h4 className="font-semibold text-foreground">
                {t("pipeline.canary.company.recentFundingRecords", "Recent funding records")}
              </h4>
              <div className="mt-2 divide-y divide-border">
                {profile.publicFunding.recentEvents.map((event) => {
                  const eventDate = event.eventDate || event.startDate || event.endDate;
                  const title =
                    event.projectTitle ||
                    event.programme ||
                    event.category ||
                    publicFundingSourceLabel(event.source, t);
                  return (
                    <article
                      key={`${event.source}:${event.sourceRecordId}`}
                      className="py-3 first:pt-1 last:pb-0"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="rounded-full bg-muted px-2 py-0.5 text-sm font-medium text-foreground">
                              {publicFundingSourceLabel(event.source, t)}
                            </span>
                            {eventDate ? (
                              <span className="text-xs text-foreground">
                                {formatFundingDate(eventDate, locale)}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1.5 line-clamp-2 font-semibold leading-5 text-foreground">
                            {title}
                          </p>
                          {event.authority || event.status ? (
                            <p className="mt-1 line-clamp-1 text-xs text-foreground">
                              {[event.authority, event.status].filter(Boolean).join(" · ")}
                            </p>
                          ) : null}
                        </div>
                        <span className="shrink-0 text-right text-sm font-medium text-foreground">
                          {publicFundingEventAmount(event, locale, t)}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function googleAdsDisplayValue(value: string) {
  return value
    .replace(/^CRITERIA_/u, "")
    .replaceAll("_", " ")
    .toLocaleLowerCase("en-US")
    .replace(/^\p{Letter}/u, (letter) => letter.toLocaleUpperCase("en-US"));
}

export function GoogleAdvertisingDetails({
  google,
  language = "en",
  t = english,
}: {
  google: NonNullable<CompanySignalsProfile["advertising"]["google"]>;
} & SignalLocale) {
  const locale = language === "fi" ? "fi-FI" : "en-US";
  const targetingSignals = [
    {
      label: t("pipeline.canary.company.googleAdsTargetDemographics", "Demographics"),
      values: google.audienceSelectionApproaches.demographicInfo,
    },
    {
      label: t("pipeline.canary.company.googleAdsTargetGeography", "Geography"),
      values: google.audienceSelectionApproaches.geoLocation,
    },
    {
      label: t("pipeline.canary.company.googleAdsTargetContext", "Contextual signals"),
      values: google.audienceSelectionApproaches.contextualSignals,
    },
    {
      label: t("pipeline.canary.company.googleAdsTargetCustomerLists", "Customer lists"),
      values: google.audienceSelectionApproaches.customerLists,
    },
    {
      label: t("pipeline.canary.company.googleAdsTargetInterests", "Topics of interest"),
      values: google.audienceSelectionApproaches.topicsOfInterest,
    },
  ].filter((signal) => signal.values.some((value) => value !== "CRITERIA_UNUSED"));
  const impressionRange = google.impressionRange;
  const impressionLabel = impressionRange
    ? impressionRange.lowerBound === impressionRange.upperBound
      ? formatCount(impressionRange.lowerBound, locale)
      : `${formatCount(impressionRange.lowerBound, locale)}–${formatCount(impressionRange.upperBound, locale)}`
    : "";
  const formats = google.formats.map((format) => googleAdsDisplayValue(format));
  const topics = google.topics.map((topic) => googleAdsDisplayValue(topic));
  const verificationStatuses = google.verificationStatuses.map((status) =>
    googleAdsDisplayValue(status),
  );
  const hasDetails =
    google.creativeCount !== null ||
    impressionRange ||
    google.lastShown ||
    formats.length ||
    targetingSignals.length ||
    topics.length ||
    google.adFundedBy.length ||
    google.isFundedByGoogleAdGrants ||
    google.advertiserLocations.length ||
    verificationStatuses.length;
  if (!hasDetails) return null;
  const activityPeriod =
    google.firstShown && google.lastShown
      ? `${formatFundingDate(google.firstShown, locale)}–${formatFundingDate(google.lastShown, locale)}`
      : formatFundingDate(google.lastShown || google.firstShown, locale);

  return (
    <div className="mt-6 border-t border-border pt-6 first:mt-0 first:border-t-0 first:pt-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {t("pipeline.canary.company.googleAdsDetails", "Google advertising details")}
          </p>
          <p className="mt-1 text-xs leading-4 text-muted-foreground">
            {t(
              "pipeline.canary.company.googleAdsPublicEstimate",
              "Public transparency data; impression figures are reported ranges.",
            )}
          </p>
          {google.advertiserNames.length ? (
            <p className="mt-1 text-xs font-semibold text-foreground">
              {google.advertiserNames.join(", ")}
            </p>
          ) : null}
        </div>
        {google.evidenceUrl ? (
          <a
            href={google.evidenceUrl}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 text-sm font-semibold text-foreground hover:underline"
          >
            {t("pipeline.canary.company.googleAdsEvidence", "View source")}
          </a>
        ) : null}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
        {google.creativeCount !== null ? (
          <div className="min-w-0 py-2">
            <p className="text-xs font-semibold text-muted-foreground">
              {t("pipeline.canary.company.googleAdsCreatives", "Ads")}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {formatCount(google.creativeCount, locale)}
            </p>
          </div>
        ) : null}
        {impressionLabel ? (
          <div className="min-w-0 py-2">
            <p className="text-xs font-semibold text-muted-foreground">
              {t("pipeline.canary.company.googleAdsImpressions", "Impressions")}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">{impressionLabel}</p>
          </div>
        ) : null}
        {activityPeriod ? (
          <div className="min-w-0 py-2">
            <p className="text-xs font-semibold text-muted-foreground">
              {t("pipeline.canary.company.googleAdsActivityPeriod", "Activity period")}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">{activityPeriod}</p>
          </div>
        ) : null}
      </div>

      {formats.length ? (
        <div className="mt-3">
          <p className="text-xs font-semibold text-muted-foreground">
            {t("pipeline.canary.company.googleAdsFormats", "Formats")}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
            {formats.map((format) => (
              <span key={format} className="text-sm text-foreground">
                {format}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {targetingSignals.length ? (
        <div className="mt-3">
          <p className="text-xs font-semibold text-muted-foreground">
            {t("pipeline.canary.company.googleAdsTargeting", "Audience selection used")}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
            {targetingSignals.map((signal) => (
              <span key={signal.label} className="text-sm text-foreground">
                {signal.label}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {topics.length || google.adFundedBy.length ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {topics.length ? (
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                {t("pipeline.canary.company.googleAdsTopics", "Topics")}
              </p>
              <p className="mt-1 text-xs font-semibold text-foreground">{topics.join(", ")}</p>
            </div>
          ) : null}
          {google.adFundedBy.length ? (
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                {t("pipeline.canary.company.googleAdsFundedBy", "Funded by")}
              </p>
              <p className="mt-1 text-xs font-semibold text-foreground">
                {google.adFundedBy.join(", ")}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      {google.isFundedByGoogleAdGrants ||
      google.advertiserLocations.length ||
      verificationStatuses.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {google.isFundedByGoogleAdGrants ? (
            <span className="text-xs text-muted-foreground">
              {t("pipeline.canary.company.googleAdsGrant", "Google Ad Grants")}
            </span>
          ) : null}
          {google.advertiserLocations.map((location) => (
            <span key={location} className="text-sm text-foreground">
              {t("pipeline.canary.company.googleAdsAdvertiserLocation", "Advertiser location")}:{" "}
              {location}
            </span>
          ))}
          {verificationStatuses.map((status) => (
            <span key={status} className="text-sm text-foreground">
              {status}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

const META_PUBLISHER_PLATFORM_LABELS: Record<string, string> = {
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
  AUDIENCE_NETWORK: "Audience Network",
  MESSENGER: "Messenger",
  WHATSAPP: "WhatsApp",
  OCULUS: "Oculus",
  THREADS: "Threads",
  STREAMING_SERVICES: "Streaming services",
};

function metaAdsPublisherPlatformLabel(value: string) {
  const normalized = value.trim().toUpperCase();
  return META_PUBLISHER_PLATFORM_LABELS[normalized] || googleAdsDisplayValue(normalized);
}

function metaAdsGenderLabel(value: string, t: Translate) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "all") {
    return t("pipeline.canary.company.metaAdsGenderAll", "All genders");
  }
  if (normalized === "men" || normalized === "male") {
    return t("pipeline.canary.company.metaAdsGenderMen", "Men");
  }
  if (normalized === "women" || normalized === "female") {
    return t("pipeline.canary.company.metaAdsGenderWomen", "Women");
  }
  return googleAdsDisplayValue(value);
}

function metaAdsAgeRangeLabel(value: string) {
  return value.replace(/^(\d{1,3})-(\d{1,3})$/u, "$1–$2");
}

export function MetaAdvertisingDetails({
  meta,
  language = "en",
  t = english,
}: {
  meta: NonNullable<CompanySignalsProfile["advertising"]["meta"]>;
} & SignalLocale) {
  const locale = language === "fi" ? "fi-FI" : "en-US";
  const activeStartRange =
    meta.firstDeliveryStart && meta.latestDeliveryStart
      ? meta.firstDeliveryStart === meta.latestDeliveryStart
        ? formatFundingDate(meta.firstDeliveryStart, locale)
        : `${formatFundingDate(meta.firstDeliveryStart, locale)}–${formatFundingDate(meta.latestDeliveryStart, locale)}`
      : formatFundingDate(meta.firstDeliveryStart || meta.latestDeliveryStart, locale);
  const publisherPlatforms = meta.publisherPlatforms.map(metaAdsPublisherPlatformLabel);
  const ageRanges = meta.targeting?.ageRanges.map(metaAdsAgeRangeLabel) || [];
  const genders = meta.targeting?.genders.map((gender) => metaAdsGenderLabel(gender, t)) || [];
  const locations = meta.targeting?.locations || [];
  const snapshotDescription =
    meta.active === true
      ? t(
          "pipeline.canary.company.metaAdsPublicSnapshot",
          "Public Meta Ad Library snapshot of active ads delivered to Finland.",
        )
      : meta.active === false
        ? t(
            "pipeline.canary.company.metaAdsNoActiveSnapshot",
            "The snapshot returned no active ads delivered to Finland. This does not prove that the company never advertises.",
          )
        : t(
            "pipeline.canary.company.metaAdsUnverifiedSnapshot",
            "The company Page or advertising status could not be verified in this snapshot.",
          );

  return (
    <div
      data-testid="meta-advertising-details"
      className="mt-6 border-t border-border pt-6 first:mt-0 first:border-t-0 first:pt-0"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {t("pipeline.canary.company.metaAdsDetails", "Meta advertising details")}
          </p>
          <p className="mt-1 text-xs leading-4 text-muted-foreground">{snapshotDescription}</p>
          {meta.facebookPageName ? (
            <p className="mt-1 text-xs font-semibold text-foreground">{meta.facebookPageName}</p>
          ) : null}
        </div>
        {meta.evidenceUrl ? (
          <a
            href={meta.evidenceUrl}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 text-sm font-semibold text-foreground hover:underline"
          >
            {t("pipeline.canary.company.metaAdsEvidence", "View source")}
          </a>
        ) : null}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
        {meta.activeAdCount !== null ? (
          <div className="min-w-0 py-2">
            <p className="text-xs font-semibold text-muted-foreground">
              {t("pipeline.canary.company.metaAdsActiveAds", "Active ads")}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {formatCount(meta.activeAdCount, locale)}
            </p>
          </div>
        ) : null}
        {activeStartRange ? (
          <div className="min-w-0 py-2">
            <p className="text-xs font-semibold text-muted-foreground">
              {t("pipeline.canary.company.metaAdsStartRange", "Active-ad start range")}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">{activeStartRange}</p>
          </div>
        ) : null}
        {meta.maxSingleAdReach !== null && meta.maxSingleAdReach > 0 ? (
          <div className="min-w-0 py-2">
            <p className="text-xs font-semibold text-muted-foreground">
              {t("pipeline.canary.company.metaAdsMaxEuReach", "Largest single-ad EU reach")}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {formatCount(meta.maxSingleAdReach, locale)}
            </p>
          </div>
        ) : null}
        {meta.checkedAt ? (
          <div className="min-w-0 py-2">
            <p className="text-xs font-semibold text-muted-foreground">
              {t("pipeline.canary.company.metaAdsChecked", "Checked")}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {formatFundingDate(meta.checkedAt, locale)}
            </p>
          </div>
        ) : null}
      </div>

      {publisherPlatforms.length ? (
        <div className="mt-3">
          <p className="text-xs font-semibold text-muted-foreground">
            {t("pipeline.canary.company.metaAdsPlatforms", "Platforms")}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
            {publisherPlatforms.map((platform) => (
              <span key={platform} className="text-sm text-foreground">
                {platform}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {ageRanges.length || genders.length || locations.length ? (
        <div className="mt-3">
          <p className="text-xs font-semibold text-muted-foreground">
            {t("pipeline.canary.company.metaAdsTargeting", "Targeting selections")}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
            {ageRanges.map((ageRange) => (
              <span key={ageRange} className="text-sm text-foreground">
                {t("pipeline.canary.company.metaAdsAge", "Age")}: {ageRange}
              </span>
            ))}
            {genders.map((gender) => (
              <span key={gender} className="text-sm text-foreground">
                {gender}
              </span>
            ))}
            {locations.map((location) => (
              <span
                key={`${location.name}:${location.type}:${location.excluded}`}
                className={
                  location.excluded
                    ? "rounded-md bg-warning-soft px-2 py-1 text-xs font-semibold text-warning"
                    : "text-sm text-foreground"
                }
              >
                {location.excluded
                  ? `${t("pipeline.canary.company.metaAdsExcludedLocation", "Excluded")}: `
                  : `${t("pipeline.canary.company.metaAdsLocation", "Location")}: `}
                {location.name}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {meta.associationStatus !== "unavailable" ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span
            className={
              meta.associationStatus === "corroborated"
                ? "text-xs text-muted-foreground"
                : "rounded-md bg-warning-soft px-2 py-1 text-xs font-semibold text-warning"
            }
          >
            {meta.associationStatus === "corroborated"
              ? t(
                  "pipeline.canary.company.metaAdsAssociationCorroborated",
                  "Company–Page match corroborated",
                )
              : t("pipeline.canary.company.metaAdsAssociationReview", "Page match needs review")}
          </span>
        </div>
      ) : null}
    </div>
  );
}

const HIRING_ROLE_FALLBACK_LABELS: Record<string, string> = {
  leadership_management: "Leadership",
  technology_data: "Software & data",
  engineering: "Engineering",
  sales_business_development: "Sales",
  marketing_communications: "Marketing",
  finance_accounting: "Finance",
  people_recruiting: "People & recruiting",
  operations_logistics: "Operations & logistics",
  healthcare_care: "Healthcare",
  education_training: "Education",
  construction_trades: "Construction",
  manufacturing_production: "Manufacturing",
  legal_compliance: "Legal & compliance",
  customer_service_support: "Customer service",
  other: "Other roles",
};

function RecruitmentCard({
  recruitment,
  language,
  t,
}: {
  recruitment: NonNullable<CompanySignalsProfile["recruitment"]>;
  language: "fi" | "en";
  t: Translate;
}) {
  const [expanded, setExpanded] = useState(false);
  const displayUntil = recruitmentDisplayUntil(recruitment);
  const [observedNow, setObservedNow] = useState(() => Date.now());
  React.useEffect(() => {
    if (!recruitment.verifiedUntil) return;
    const nextBoundary = [Date.parse(recruitment.verifiedUntil), displayUntil]
      .filter((at) => at > Date.now())
      .sort((a, b) => a - b)[0];
    if (!nextBoundary) return;
    const remaining = nextBoundary - Date.now();
    const timer = setTimeout(() => setObservedNow(Date.now()), remaining + 1);
    return () => clearTimeout(timer);
  }, [recruitment.verifiedUntil, displayUntil, observedNow]);
  const verified =
    recruitment.status === "verified" &&
    Boolean(recruitment.verifiedUntil && Date.parse(recruitment.verifiedUntil) > observedNow);
  const hasApiPostings = recruitment.postings.some((p) => p.source === "tyomarkkinatori");
  if (
    hasApiPostings &&
    (displayUntil <= observedNow || Date.parse(recruitment.snapshotAt) > observedNow)
  )
    return null;
  const postings = expanded ? recruitment.postings : recruitment.postings.slice(0, 5);
  return (
    <section data-testid="company-recruitment" className="min-w-0">
      <header className="flex flex-col items-start gap-2">
        <h3 className="text-sm font-semibold">{t("companies.recruitment", "Recruitment")}</h3>
        <p className="text-sm text-muted-foreground">
          {verified
            ? t(
                recruitment.activeJobCount === 1
                  ? "companies.openEmployerAd"
                  : "companies.openEmployerAds",
                recruitment.activeJobCount === 1
                  ? "1 verified open employer ad"
                  : "{count} verified open employer ads",
                { count: String(recruitment.activeJobCount) },
              )
            : t(
                recruitment.snapshotJobCount === 1
                  ? "companies.historicalEmployerAd"
                  : "companies.historicalEmployerAds",
                recruitment.snapshotJobCount === 1
                  ? "1 employer ad in the saved snapshot · current availability unverified"
                  : "{count} employer ads in the saved snapshot · current availability unverified",
                { count: String(recruitment.snapshotJobCount) },
              )}
        </p>
      </header>
      <div className="mt-6 flex flex-col divide-y divide-border border-t border-border">
        {postings.map((posting) => (
          <div
            key={`${posting.source}:${posting.externalId}`}
            className="flex flex-col gap-1.5 py-4"
          >
            {/^https:\/\//u.test(posting.sourceUrl) ? (
              <a
                href={posting.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold hover:underline underline-offset-4"
              >
                {posting.title}
              </a>
            ) : (
              <p className="text-sm font-medium">{posting.title}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {[
                posting.location,
                posting.publishedAt ? formatCompanyDate(posting.publishedAt, language) : "",
                posting.source === "tyomarkkinatori" ? "Työmarkkinatori" : posting.source,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <p className="text-xs text-muted-foreground">
              {verified && posting.status === "open"
                ? t("companies.openJob", "Open")
                : verified && posting.status === "closed"
                  ? t("companies.closedJob", "Closed")
                  : t("companies.unverifiedJob", "Availability unverified")}
            </p>
          </div>
        ))}
        {recruitment.postings.length > 5 ? (
          <Button variant="ghost" onClick={() => setExpanded(!expanded)}>
            {expanded
              ? t("companies.fewerJobs", "Show fewer")
              : t("companies.moreJobs", "Show more postings")}
          </Button>
        ) : null}
      </div>
      {hasApiPostings ? (
        <footer className="mt-5 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">
            Lähde: Työmarkkinatorin asiakastietojärjestelmä
          </p>
        </footer>
      ) : null}
    </section>
  );
}

function hiringRoleLabel(role: string, t: Translate) {
  const fallback =
    HIRING_ROLE_FALLBACK_LABELS[role] ||
    role
      .replaceAll("_", " ")
      .replace(/^\p{Letter}/u, (letter) => letter.toLocaleUpperCase("en-US"));
  return t(`workflows.role.${role}`, fallback);
}

export function HiringSignalCard({
  profile,
  language = "en",
  t = english,
}: { profile: CompanySignalsProfile } & SignalLocale) {
  if (profile.recruitment)
    return <RecruitmentCard recruitment={profile.recruitment} language={language} t={t} />;
  const hiring = profile.hiring;
  if (!hiring?.active) return null;
  const openPositions = hiring.openPositionCount;
  const newJobs = hiring.newJobs7d;
  const recentRoles = hiring.recentRoles.slice(0, 3);
  const roleFamilies = hiring.roleFamilies.slice(0, 3);

  return (
    <section className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h3 className="text-sm font-semibold text-foreground">
          {t("pipeline.canary.company.hiringNow", "Hiring now")}
        </h3>
        {hiring.latestJobAt ? (
          <span className="text-xs text-muted-foreground">
            {formatCompanyDate(hiring.latestJobAt, language)}
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-sm font-medium text-foreground">
        {openPositions !== null
          ? t(
              openPositions === 1
                ? "pipeline.canary.company.openPositionOne"
                : "pipeline.canary.company.openPositionMany",
              openPositions === 1 ? "1 open position" : "{count} open positions",
              { count: String(openPositions) },
            )
          : t("pipeline.canary.company.activeJobAd", "Active job advertisement")}
        {newJobs ? (
          <>
            {" "}
            ·{" "}
            {t(
              newJobs === 1
                ? "pipeline.canary.company.newJobOne"
                : "pipeline.canary.company.newJobMany",
              newJobs === 1 ? "1 new this week" : "{count} new this week",
              { count: String(newJobs) },
            )}
          </>
        ) : null}
      </p>

      {recentRoles.length ? (
        <div className="mt-6 divide-y divide-border border-t border-border">
          {recentRoles.map((role, index) => (
            <div
              key={`${role.title}:${role.publishedAt}:${index}`}
              className="flex items-center justify-between gap-3 py-4"
            >
              <p className="min-w-0 truncate text-sm font-medium text-foreground">{role.title}</p>
              {role.location ? (
                <span className="shrink-0 text-xs text-muted-foreground">{role.location}</span>
              ) : null}
            </div>
          ))}
        </div>
      ) : roleFamilies.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {roleFamilies.map((role) => (
            <span
              key={role}
              className="rounded-full bg-card px-2.5 py-1 text-sm font-medium text-foreground ring-1 ring-success/20"
            >
              {hiringRoleLabel(role, t)}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
