import type { ReactNode } from "react";
import { publicFinnishBusinessId } from "@dmfaster/product-ui";
import {
  employees,
  externalUrl,
  numeric,
  record,
  revenue,
  text,
  websiteLabel,
  type CompanyDetail,
  type CompanyRow,
} from "./companies-data.ts";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="workspace-disclosure">
      <summary>{title}</summary>
      <div className="workspace-disclosure-body">{children}</div>
    </details>
  );
}
function Link({ url, children }: { url: unknown; children: ReactNode }) {
  const safe = externalUrl(url);
  return safe ? (
    <a className="workspace-link" href={safe} target="_blank" rel="noreferrer noopener">
      {children}
    </a>
  ) : null;
}
function DateLabel({ value }: { value: unknown }) {
  const date = new Date(text(value));
  return (
    <>
      {Number.isFinite(date.getTime())
        ? date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
        : "Unknown"}
    </>
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
  const funding = record(profile?.funding);
  const publicFunding = record(profile?.publicFunding);
  const hiring = record(profile?.hiring);
  return (
    <section aria-label="Company overview">
      {text(company.description) ? (
        <p className="company-description">{text(company.description)}</p>
      ) : null}
      <dl className="workspace-metrics company-metrics">
        <div>
          <dt>Employees</dt>
          <dd>{employees(company)}</dd>
        </div>
        <div>
          <dt>Revenue{text(company.financialYear) ? ` · ${text(company.financialYear)}` : ""}</dt>
          <dd>{revenue(company)}</dd>
        </div>
      </dl>
      <dl className="workspace-facts company-overview-facts">
        <div>
          <dt>Industry</dt>
          <dd>{text(company.industry) || text(company.industryLabel) || "Unknown"}</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>
            {[text(company.city), text(company.hqState), company.country]
              .filter(Boolean)
              .join(", ")}
          </dd>
        </div>
        <div>
          <dt>Website</dt>
          <dd>
            <Link url={company.websiteUrl}>{websiteLabel(company.websiteUrl)}</Link>
            {!externalUrl(company.websiteUrl) ? "Unknown" : null}
          </dd>
        </div>
        {businessId ? (
          <div>
            <dt>Finnish business ID</dt>
            <dd>{businessId}</dd>
          </div>
        ) : null}
      </dl>
      {!profile ? (
        <p className="company-loading" role={error ? "alert" : "status"}>
          {error || (loading ? "Loading full profile…" : "Full profile not loaded.")}
          {error ? (
            <button className="workspace-link" onClick={onRetry}>
              Retry profile
            </button>
          ) : null}
        </p>
      ) : (
        <div className="workspace-sections company-sections">
          <Section
            title={`Contacts${profile.decisionMakers.length ? ` · ${profile.decisionMakers.length}` : ""}`}
          >
            {profile.decisionMakers.length ? (
              <ul className="company-contacts">
                {profile.decisionMakers.map((person, index) => (
                  <li key={`${text(person.personId) || text(person.name)}:${index}`}>
                    <strong>{text(person.name) || "Name unavailable"}</strong>
                    <p className="workspace-muted">{text(person.role)}</p>
                    <div className="company-contact-routes">
                      {text(person.email) ? <span>{text(person.email)}</span> : null}
                      {text(person.phone) ? <span>{text(person.phone)}</span> : null}
                      <Link url={person.linkedinUrl || person.linkedinProfileUrl}>LinkedIn</Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No saved decision-makers. Contact availability is unknown.</p>
            )}
            {text(profile.companyPhone) ? <p>Company phone: {text(profile.companyPhone)}</p> : null}
            {profile.websiteContacts?.length ? (
              <ul>
                {profile.websiteContacts.map((contact, index) => (
                  <li key={index}>
                    {contact.value} · <Link url={contact.sourceUrl}>Website source</Link>
                  </li>
                ))}
              </ul>
            ) : null}
            {profile.socialProfiles?.length ? (
              <div className="company-contact-routes">
                {profile.socialProfiles.map((social) => (
                  <Link key={social.platform} url={social.url}>
                    {social.platform}
                  </Link>
                ))}
              </div>
            ) : null}
            <p className="workspace-muted">Saved contacts do not establish deliverability.</p>
          </Section>
          <Section title="Financials">
            {profile.financials.length ? (
              <table className="company-financials">
                <caption className="sr-only">Reported financial history</caption>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Revenue</th>
                    <th>Employees</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.financials.map((year, index) => (
                    <tr key={index}>
                      <td>{text(year.fiscalYear) || "Unknown"}</td>
                      <td>{revenue(year)}</td>
                      <td>{employees(year)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No reported financial history available.</p>
            )}
          </Section>
          <Section title="Signals">
            <dl className="workspace-facts">
              <div>
                <dt>Technologies</dt>
                <dd>{profile.technologies.length ? profile.technologies.join(", ") : "Unknown"}</dd>
              </div>
              <div>
                <dt>Google ads</dt>
                <dd>{text(google.status) || "Unknown"}</dd>
              </div>
              <div>
                <dt>Google ads checked</dt>
                <dd>
                  <DateLabel value={google.checkedAt} />
                </dd>
              </div>
              <div>
                <dt>Meta ads</dt>
                <dd>
                  {meta.associationStatus === "review_needed"
                    ? "Association needs review"
                    : meta.active === true
                      ? "Active at last check"
                      : meta.active === false && meta.checkedAt
                        ? "No active ads at last check"
                        : "Unknown"}
                </dd>
              </div>
              <div>
                <dt>Meta ads checked</dt>
                <dd>
                  <DateLabel value={meta.checkedAt} />
                </dd>
              </div>
            </dl>
            <div className="company-contact-routes">
              <Link url={google.evidenceUrl}>Google evidence</Link>
              <Link url={meta.evidenceUrl}>Meta evidence</Link>
            </div>
            <p className="workspace-muted">
              Recorded signals are evidence to discuss, not proof of current buying intent.
            </p>
          </Section>
          <Section title="Funding & hiring">
            <dl className="workspace-facts">
              <div>
                <dt>Business Finland funding</dt>
                <dd>
                  {numeric(funding.grantedEur) === null
                    ? "Unknown"
                    : revenue({ revenueEur: funding.grantedEur })}
                </dd>
              </div>
              <div>
                <dt>Public funding events</dt>
                <dd>{numeric(publicFunding.eventCount) ?? "Unknown"}</dd>
              </div>
              <div>
                <dt>Latest funding event</dt>
                <dd>
                  <DateLabel value={publicFunding.latestEventDate} />
                </dd>
              </div>
              <div>
                <dt>Hiring</dt>
                <dd>
                  {profile.hiring
                    ? numeric(hiring.activeJobCount) !== null
                      ? `${hiring.activeJobCount} recorded openings`
                      : "Saved hiring evidence"
                    : "Unknown"}
                </dd>
              </div>
              <div>
                <dt>Exhibitions</dt>
                <dd>{profile.exhibitions?.length ?? "Unknown"}</dd>
              </div>
            </dl>
          </Section>
        </div>
      )}
    </section>
  );
}
