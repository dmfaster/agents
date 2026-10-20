import { t, language, numberLocale, productT } from "./locale.ts";
import { formatStandardDecisionMakerRole } from "@dmfaster/product-ui/decision-maker-roles";
import {
  InstagramIcon,
  FacebookIcon,
  LinkedInIcon,
  GmailIcon,
} from "@dmfaster/product-ui/company-brands";
import { useState, type ReactNode } from "react";
import {
  FundingSignalsCard,
  GoogleAdvertisingDetails,
  MetaAdvertisingDetails,
  HiringSignalCard,
  formatCompanyDate,
} from "@dmfaster/product-ui/company-signals";
import {
  ENTERPRISE_COMPANY_TECHNOLOGY_OPTIONS,
  getEnterpriseCompanyTechnologyLabel,
} from "@dmfaster/product-ui/company-technologies";
import { companySignals } from "./company-signals-data.ts";
import { publicFinnishBusinessId } from "@dmfaster/product-ui";
import { CompanyIcon, type CompanyIconName } from "./company-icon.tsx";
import {
  externalUrl,
  numeric,
  record,
  text,
  type CompanyDetail,
  type CompanyRow,
} from "./companies-data.ts";

// Match CompanyProfileContent in the current Companies drawer. The public
// profile supplies the same facts; no extra reads or private portrait requests.
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="company-main-section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}
function Link({
  url,
  children,
  label,
  tone,
}: {
  url: unknown;
  children: ReactNode;
  label?: string;
  tone?: string;
}) {
  const safe = externalUrl(url);
  return safe ? (
    <a
      className="company-main-link"
      data-tone={tone}
      href={safe}
      aria-label={label}
      target="_blank"
      rel="noreferrer noopener"
    >
      {children}
    </a>
  ) : null;
}
function currency(value: unknown) {
  const n = numeric(value);
  return n === null
    ? "—"
    : new Intl.NumberFormat(numberLocale(), {
        style: "currency",
        currency: "EUR",
        notation: Math.abs(n) >= 1_000_000 ? "compact" : "standard",
        maximumFractionDigits: Math.abs(n) >= 1_000_000 ? 1 : 0,
      }).format(n);
}
function count(value: unknown) {
  const n = numeric(value);
  return n === null ? "—" : n.toLocaleString(numberLocale());
}
function percent(value: unknown) {
  const n = numeric(value);
  return n === null
    ? "—"
    : `${new Intl.NumberFormat(numberLocale(), { maximumFractionDigits: 1 }).format(n)}%`;
}
function date(value: unknown) {
  return formatCompanyDate(text(value), language());
}
function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.map(text).filter(Boolean) : [];
}
function records(value: unknown) {
  return Array.isArray(value) ? value.map(record) : [];
}
function Metric({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: CompanyIconName;
  tone: string;
}) {
  return (
    <div data-tone={tone}>
      <CompanyIcon name={icon} />
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
const technologyGroups = [
  { label: "Commerce", values: ["shopify", "woocommerce", "mycashflow", "magento_adobe_commerce"] },
  {
    label: "Website and CMS",
    values: ["wordpress", "webflow", "framer", "drupal", "joomla", "squarespace", "wix"],
  },
  {
    label: "Customer conversations",
    values: ["intercom", "zendesk", "groweo", "leadoo", "serviceform", "tidio", "crisp"],
  },
  { label: "CRM and sales", values: ["hubspot", "salesforce", "pipedrive"] },
  { label: "Analytics and tracking", values: ["meta_pixel", "linkedin_insight", "ga4"] },
];

function Person({ person }: { person: Record<string, unknown> }) {
  const [failedPortrait, setFailedPortrait] = useState("");
  const portrait = externalUrl(person.avatarUrl);
  const name = text(person.name) || text(person.email) || text(person.phone) || t("Contact");
  return (
    <div className="company-main-person">
      <span className="company-main-avatar" aria-hidden="true">
        {portrait && failedPortrait !== portrait ? (
          <img
            src={portrait}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setFailedPortrait(portrait)}
          />
        ) : (
          <CompanyIcon name="person" />
        )}
      </span>
      <div className="company-main-person-copy">
        <strong title={name}>{name}</strong>
        {text(person.role) ? (
          <p>{formatStandardDecisionMakerRole(text(person.role), productT)}</p>
        ) : null}
        {text(person.location) ? <small>{text(person.location)}</small> : null}
      </div>
      <div className="company-main-person-actions">
        {text(person.phone) ? (
          <a
            href={`tel:${text(person.phone).replace(/[^\d+]/g, "")}`}
            aria-label={t("Call {name}", { name })}
            title={text(person.phone)}
          >
            <CompanyIcon name="phone" />
          </a>
        ) : null}
        {text(person.email) ? (
          <a
            href={`mailto:${encodeURIComponent(text(person.email))}`}
            aria-label={t("Email {name}", { name })}
            title={text(person.email)}
          >
            {" "}
            @{" "}
          </a>
        ) : null}
        <Link
          url={person.linkedinUrl || person.linkedinProfileUrl}
          label={t("Open {name} on LinkedIn", { name })}
          tone="blue"
        >
          in
        </Link>
      </div>
    </div>
  );
}

export function CompanyProfile({
  row,
  detail,
  loading,
  error,
  onRetry,
}: {
  row: CompanyRow;
  detail: CompanyDetail | null;
  loading: boolean;
  error: string;
  onRetry: () => void;
}) {
  const profile = detail?.profile;
  const company = profile ?? row;
  const businessId = publicFinnishBusinessId(company.country, company.businessId);
  const google = record(profile?.advertising.google);
  const meta = record(profile?.advertising.meta);
  const signals = companySignals(profile);
  const [showAllRecruiting, setShowAllRecruiting] = useState(false);
  const categories = strings(company.categories);
  const phones = strings(company.companyPhones).length
    ? strings(company.companyPhones)
    : text(company.companyPhone)
      ? [text(company.companyPhone)]
      : [];
  const emails = strings(company.companyEmails);
  const recruiting = records(company.recruitingContacts);
  const financials = profile?.financials ?? [];
  const hasFinancials =
    [company.revenueEur, company.employeeCount, company.netIncomeEur].some(
      (value) => numeric(value) !== null,
    ) || financials.length > 0;
  const country = (() => {
    try {
      return (
        new Intl.DisplayNames([language()], { type: "region" }).of(company.country) ||
        company.country
      );
    } catch {
      return company.country;
    }
  })();
  const location = [text(company.city), text(company.hqState), country].filter(Boolean).join(", ");
  const googleSignal = ["recent", "historical"].includes(text(google.status));
  const metaSignal =
    meta.associationStatus === "review_needed" ||
    (meta.active === true && meta.activeAdCount !== 0);
  const hasSignals = Boolean(
    profile?.funding ||
    profile?.publicFunding ||
    profile?.exhibitions?.length ||
    googleSignal ||
    metaSignal ||
    categories.length,
  );
  const groups = technologyGroups
    .map((group) => ({
      ...group,
      values: (profile?.technologies ?? []).filter((tech) => group.values.includes(tech)),
    }))
    .filter((group) => group.values.length);
  const other = (profile?.technologies ?? []).filter(
    (tech) =>
      tech !== "google_ads" && !technologyGroups.some((group) => group.values.includes(tech)),
  );
  if (other.length) groups.push({ label: "Other", values: other });
  return (
    <section aria-label={t("Company overview")} className="company-profile-main">
      <section className="company-main-intro">
        {text(company.description) ? (
          <p className="company-main-description">{text(company.description)}</p>
        ) : null}
        <div className="company-main-badges">
          {typeof company.active === "boolean" ? (
            <span className="company-main-badge" data-tone={company.active ? "green" : undefined}>
              {company.active ? t("Active") : t("Inactive")}
            </span>
          ) : null}
          {text(company.companyForm) ? (
            <span className="company-main-badge">{text(company.companyForm)}</span>
          ) : null}
          {text(company.industry) || text(company.industryLabel) ? (
            <span className="company-main-badge" data-tone="blue">
              {text(company.industry) || text(company.industryLabel)}
            </span>
          ) : null}
        </div>
        <p className="company-main-location">
          <CompanyIcon name="location" />
          {location}
        </p>
      </section>
      <HiringSignalCard language={language()} t={productT} profile={signals} />
      {hasFinancials ? (
        <Section title={t("Financials")}>
          <dl className="company-main-metrics" aria-label={t("Key financials")}>
            <Metric
              label={t("Revenue")}
              value={currency(company.revenueEur)}
              icon="revenue"
              tone="blue"
            />
            <Metric
              label={t("Employees")}
              value={count(company.employeeCount)}
              icon="people"
              tone="violet"
            />
            <Metric
              label={t("Net income")}
              value={currency(company.netIncomeEur)}
              icon="revenue"
              tone="indigo"
            />
            <Metric
              label={t("Growth")}
              value={percent(company.revenueGrowthPercent)}
              icon="growth"
              tone="green"
            />
          </dl>
          {financials.length ? (
            <div className="company-main-financial-table">
              <table className="company-financials">
                <caption className="sr-only">{t("Reported financial history")}</caption>
                <thead>
                  <tr>
                    <th>{t("Year")}</th>
                    <th>{t("Revenue")}</th>
                    <th>{t("Employees")}</th>
                    <th>{t("Net income")}</th>
                    <th>{t("Margin")}</th>
                  </tr>
                </thead>
                <tbody>
                  {financials.map((year, i) => (
                    <tr key={i}>
                      <td>{text(year.fiscalYear) || "—"}</td>
                      <td>{currency(year.revenueEur)}</td>
                      <td>{count(year.employeeCount)}</td>
                      <td>{currency(year.netIncomeEur)}</td>
                      <td>{percent(year.operatingMarginPercent)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          {[company.netIncomeEur, company.operatingMarginPercent, company.ebitdaPercent].some(
            (value) => numeric(value) !== null,
          ) ? (
            <dl className="company-main-secondary-metrics">
              <div>
                <dt>{t("Net income")}</dt>
                <dd>{currency(company.netIncomeEur)}</dd>
              </div>
              <div>
                <dt>{t("Operating margin")}</dt>
                <dd>{percent(company.operatingMarginPercent)}</dd>
              </div>
              <div>
                <dt>EBITDA</dt>
                <dd>{percent(company.ebitdaPercent)}</dd>
              </div>
            </dl>
          ) : null}
        </Section>
      ) : null}
      <Section title={t("Company details")}>
        <dl className="company-main-facts">
          {businessId ? (
            <div>
              <dt>{t("Business ID")}</dt>
              <dd>{businessId}</dd>
            </div>
          ) : null}
          {text(company.registrationDate) || text(company.foundedOn) ? (
            <div>
              <dt>{t("Registered")}</dt>
              <dd>{date(company.registrationDate || company.foundedOn)}</dd>
            </div>
          ) : null}
          {text(company.tradeRegisterStatus) || text(company.companySituation) ? (
            <div>
              <dt>{t("Status")}</dt>
              <dd>{text(company.companySituation) || text(company.tradeRegisterStatus)}</dd>
            </div>
          ) : null}
          {company.isListedCompany === true ? (
            <div>
              <dt>{t("Listed")}</dt>
              <dd>
                {[text(company.listedExchange), text(company.listedTicker)]
                  .filter(Boolean)
                  .join(" · ")}
              </dd>
            </div>
          ) : null}
        </dl>
        <div className="company-main-links">
          <Link url={company.websiteUrl}>
            <CompanyIcon name="globe" />
            {t("Website")}
            <CompanyIcon name="arrow" />
          </Link>
          <Link url={company.companyLinkedinUrl} tone="blue">
            {t("in Company LinkedIn")}
            <CompanyIcon name="arrow" />
          </Link>
          {phones.map((phone) => (
            <a
              key={phone}
              className="company-main-link"
              data-tone="green"
              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
            >
              <CompanyIcon name="phone" />
              {phone}
            </a>
          ))}
        </div>
        {profile?.socialProfiles?.length ? (
          <div className="company-main-contact-group">
            <h4>{t("Social profiles")}</h4>
            <div className="company-main-links">
              {profile.socialProfiles.map((social) => (
                <Link key={social.platform} url={social.url} tone="blue">
                  {social.platform === "x"
                    ? "X"
                    : social.platform === "linkedin"
                      ? "LinkedIn"
                      : social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
                  <CompanyIcon name="arrow" />
                </Link>
              ))}
            </div>
          </div>
        ) : null}
        {emails.length ? (
          <div className="company-main-contact-group">
            <h4>{t("Company email addresses")}</h4>
            <div className="company-main-links">
              {emails.map((email) => (
                <a
                  className="company-main-link"
                  key={email}
                  href={`mailto:${encodeURIComponent(email)}`}
                >
                  @ {email}
                </a>
              ))}
            </div>
          </div>
        ) : null}
        {profile?.websiteContacts?.length ? (
          <div className="company-main-contact-group">
            <h4>{t("Found on company website")}</h4>
            <p>{t("Published on the company website; contact owner is unconfirmed.")}</p>
            <div className="company-main-links">
              {profile.websiteContacts.map((contact, i) => (
                <span className="company-main-link" key={i}>
                  {contact.value}
                  <Link url={contact.sourceUrl} label={t("View source page")}>
                    <CompanyIcon name="arrow" />
                  </Link>
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </Section>
      {profile?.decisionMakers.length || recruiting.length ? (
        <Section title={t("People")}>
          {profile?.decisionMakers.map((person, i) => (
            <Person key={i} person={person} />
          ))}
          {recruiting.length ? (
            <div className="company-main-contact-group">
              <h4>{t("Hiring contacts")}</h4>
              {(showAllRecruiting ? recruiting : recruiting.slice(0, 3)).map((person, i) => (
                <Person key={i} person={person} />
              ))}
              {recruiting.length > 3 ? (
                <button
                  className="workspace-link"
                  onClick={() => setShowAllRecruiting((value) => !value)}
                >
                  {showAllRecruiting ? t("Show fewer") : t("Show more")}
                </button>
              ) : null}
            </div>
          ) : null}
        </Section>
      ) : null}
      {hasSignals ? (
        <Section title={t("Sales signals")}>
          {profile?.funding || profile?.publicFunding ? (
            <FundingSignalsCard language={language()} t={productT} profile={signals} />
          ) : null}
          <div className="company-main-badges">
            {googleSignal ? (
              <span className="company-main-badge" data-tone="blue">
                Google Ads · {t(text(google.status))}
              </span>
            ) : null}
            {metaSignal ? (
              <span className="company-main-badge" data-tone="blue">
                Meta Ads ·{" "}
                {meta.associationStatus === "review_needed"
                  ? t("association needs review")
                  : t("active at last check")}
              </span>
            ) : null}
            {categories.map((category) => (
              <span className="company-main-badge" key={category}>
                {category}
              </span>
            ))}
          </div>
          {googleSignal && signals.advertising.google ? (
            <GoogleAdvertisingDetails
              language={language()}
              t={productT}
              google={signals.advertising.google}
            />
          ) : null}
          {metaSignal && signals.advertising.meta ? (
            <MetaAdvertisingDetails
              language={language()}
              t={productT}
              meta={signals.advertising.meta}
            />
          ) : null}
          {profile?.exhibitions?.length ? (
            <div className="company-main-contact-group">
              <h4>{t("Exhibitions")}</h4>
              <dl className="company-main-facts">
                {profile.exhibitions.map((event, i) => (
                  <div key={i}>
                    <dt>{text(event.name)}</dt>
                    <dd>
                      {[
                        text(event.year) || numeric(event.year),
                        text(event.location),
                        text(event.booth),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </Section>
      ) : null}
      {groups.length ? (
        <Section title={t("Website technologies")}>
          {groups.map((group) => (
            <div className="company-main-contact-group" key={group.label}>
              <h4>{t(group.label)}</h4>
              <div className="company-main-badges">
                {group.values.map((technology) => (
                  <span className="company-main-technology" key={technology}>
                    {ENTERPRISE_COMPANY_TECHNOLOGY_OPTIONS.find(
                      (option) => option.value === technology,
                    )?.logoSrc ? (
                      <img
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        src={
                          new URL(
                            ENTERPRISE_COMPANY_TECHNOLOGY_OPTIONS.find(
                              (option) => option.value === technology,
                            )!.logoSrc,
                            "https://app.dmfaster.com",
                          ).href
                        }
                      />
                    ) : null}
                    {getEnterpriseCompanyTechnologyLabel(technology)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </Section>
      ) : null}
      {profile &&
      (text(company.instagramUrl) ||
        text(company.facebookUrl) ||
        text(company.companyLinkedinUrl) ||
        text(row.decisionMakerPrimaryEmail)) ? (
        <Section title={t("Channel activity")}>
          <div className="company-main-channels">
            {[
              ["Instagram", company.instagramUrl],
              ["Facebook", company.facebookUrl],
              ["LinkedIn", company.companyLinkedinUrl],
            ]
              .filter(([, url]) => externalUrl(url))
              .map(([label, url]) => (
                <Link key={text(label)} url={url}>
                  <span className="company-channel-name">
                    <span className="company-channel-brand">
                      {label === "Instagram" ? (
                        <InstagramIcon className="h-4 w-4 text-rose-500" />
                      ) : label === "Facebook" ? (
                        <FacebookIcon className="h-4 w-4 text-blue-600" />
                      ) : (
                        <LinkedInIcon className="h-4 w-4 text-[#0a66c2]" />
                      )}
                    </span>
                    <strong>{text(label)}</strong>
                  </span>
                  <CompanyIcon name="arrow" />
                </Link>
              ))}
            {text(row.decisionMakerPrimaryEmail) ? (
              <a
                className="company-main-link"
                href={`mailto:${encodeURIComponent(text(row.decisionMakerPrimaryEmail))}`}
              >
                <span className="company-channel-name">
                  <span className="company-channel-brand">
                    <GmailIcon className="h-[0.8rem] w-[0.8rem]" />
                  </span>
                  <strong>{t("Email")}</strong>
                </span>
                <CompanyIcon name="arrow" />
              </a>
            ) : null}
          </div>
        </Section>
      ) : null}
      {!profile ? (
        <p className="company-loading" role={error ? "alert" : "status"}>
          {error || (loading ? t("Loading full profile…") : t("Full profile not loaded."))}
          {error ? (
            <button className="workspace-link" onClick={onRetry}>
              {t("Retry profile")}
            </button>
          ) : null}
        </p>
      ) : null}
    </section>
  );
}
