import type { CompanyFilters, FilterMetadata } from "./companies-data.ts";
import { record, text } from "./companies-data.ts";

const markets = [
  "FI",
  "NO",
  "EE",
  "SE",
  "DK",
  "UK",
  "IE",
  "AE",
  "AT",
  "BE",
  "CA",
  "NL",
  "NZ",
  "ES",
  "FR",
  "HK",
  "IL",
  "LV",
  "LT",
  "IT",
  "CH",
  "PT",
  "SA",
  "SG",
  "IS",
  "AU",
  "DE",
  "US",
  "ZA",
] as const satisfies readonly CompanyFilters["countries"][number][];
const countryNames = new Intl.DisplayNames(["en"], { type: "region" });
const names: Partial<Record<keyof CompanyFilters, string>> = {
  industryCodes: "Industry",
  industryCodeSelections: "Local industry",
  tolCodes: "Local industry",
  companyForm: "Company form",
  cities: "City",
  states: "Region",
  employeeMin: "Employees from",
  employeeMax: "Employees to",
  employeeRanges: "Employee range",
  revenueMinEur: "Revenue from €",
  revenueMaxEur: "Revenue to €",
  technologies: "Technology",
  hasWebsite: "Has website",
  googleAdsActivityWindow: "Google ads",
  metaAdsActiveOnly: "Meta ads",
  metaAdsIncludeUncorroborated: "Include uncorroborated ads",
  metaAdsMinimumEuReach: "EU ad reach from",
  metaAdsTargetAge: "Ad audience age",
  metaAdsTargetGender: "Ad audience gender",
  metaAdsTargetLocation: "Ad audience location",
  fundingSources: "Funding sources",
  fundingFromYear: "Funding since",
  hasPublicFunding: "Public funding",
  exhibitionEventKeys: "Exhibition",
  exhibitionMinEditions: "Exhibition editions",
  hasExhibitionParticipation: "Exhibition participation",
  registrationDateEnabled: "Registration date",
  registrationDateStart: "Registered from",
  registrationDateEnd: "Registered to",
  businessIdRegistrationStart: "Business ID from",
  businessIdRegistrationEnd: "Business ID to",
};

export function filterChips(filters: CompanyFilters) {
  return Object.entries(filters)
    .filter(
      ([key, value]) =>
        !["q", "country", "countries", "activeOnly"].includes(key) &&
        value !== false &&
        value !== null &&
        value !== undefined &&
        value !== "" &&
        (!Array.isArray(value) || value.length > 0),
    )
    .map(([key, value]) => {
      const label = names[key as keyof CompanyFilters] || key.replace(/([a-z])([A-Z])/g, "$1 $2");
      const detail = Array.isArray(value)
        ? `${value.length} selected`
        : typeof value === "boolean"
          ? ""
          : String(value).replaceAll("_", " ");
      return { key: key as keyof CompanyFilters, label: `${label}${detail ? ` · ${detail}` : ""}` };
    });
}

function options(value: unknown, valueKey = "code") {
  return Array.isArray(value)
    ? value
        .map(record)
        .map((option) => ({
          value: text(option[valueKey]),
          label: text(option.label),
        }))
        .filter((option) => option.value && option.label)
    : [];
}

export function CompanyFilterControls({
  filters,
  metadata,
  loading,
  error,
  onChange,
  onRetry,
}: {
  filters: CompanyFilters;
  metadata: FilterMetadata | null;
  loading: boolean;
  error: string;
  onChange: (filters: CompanyFilters) => void;
  onRetry: () => void;
}) {
  const source = record(metadata?.metadata);
  const change = (key: keyof CompanyFilters, value: unknown) =>
    onChange({ ...filters, [key]: value });
  const fields = [
    ["employeeMin", "Employees from", 10],
    ["employeeMax", "Employees to", 10],
    ["revenueMinEur", "Revenue from (€)", 16],
    ["revenueMaxEur", "Revenue to (€)", 16],
  ] as const;
  return (
    <div className="company-filter-panel">
      <div className="company-filter-grid">
        <label>
          Market
          <select
            aria-label="Market"
            value={filters.countries.length === 1 ? filters.countries[0] : "multiple"}
            onChange={(event) =>
              onChange({
                ...filters,
                country: event.target.value as CompanyFilters["countries"][number],
                countries: [event.target.value as CompanyFilters["countries"][number]],
              })
            }
          >
            {filters.countries.length > 1 ? (
              <option value="multiple" disabled>
                {filters.countries.length} markets
              </option>
            ) : null}
            {markets.map((country) => (
              <option key={country} value={country}>
                {countryNames.of(country === "UK" ? "GB" : country)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Industry
          <select
            aria-label="Industry"
            value={filters.industryCodes?.length === 1 ? filters.industryCodes[0] : ""}
            disabled={!metadata}
            onChange={(event) =>
              change("industryCodes", event.target.value ? [event.target.value] : [])
            }
          >
            <option value="">
              {(filters.industryCodes?.length ?? 0) > 1
                ? `${filters.industryCodes!.length} industries`
                : "Any industry"}
            </option>
            {options(source.industries).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          City
          <select
            aria-label="City"
            value={filters.cities?.length === 1 ? filters.cities[0] : ""}
            disabled={!metadata}
            onChange={(event) => change("cities", event.target.value ? [event.target.value] : [])}
          >
            <option value="">
              {(filters.cities?.length ?? 0) > 1 ? `${filters.cities!.length} cities` : "Any city"}
            </option>
            {options(source.cities, "value").map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Technology
          <select
            aria-label="Technology"
            value={filters.technologies?.length === 1 ? filters.technologies[0] : ""}
            disabled={!metadata?.availability.technologies}
            onChange={(event) =>
              change("technologies", event.target.value ? [event.target.value] : [])
            }
          >
            <option value="">
              {(filters.technologies?.length ?? 0) > 1
                ? `${filters.technologies!.length} technologies`
                : "Any technology"}
            </option>
            {options(metadata?.technologies, "value").map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        {fields.map(([key, label, length]) => (
          <label key={key}>
            {label}
            <input
              aria-label={label}
              inputMode="numeric"
              maxLength={length}
              value={filters[key] || ""}
              onChange={(event) => change(key, event.target.value)}
              placeholder="Any"
            />
          </label>
        ))}
        <label>
          Google ads
          <select
            aria-label="Google ads"
            value={filters.googleAdsActivityWindow || ""}
            onChange={(event) => change("googleAdsActivityWindow", event.target.value || null)}
          >
            <option value="">Any activity</option>
            <option value="last_30_days">Last 30 days</option>
            <option value="last_90_days">Last 90 days</option>
            <option value="last_12_months">Last 12 months</option>
          </select>
        </label>
      </div>
      <div className="company-filter-checks">
        <label>
          <input
            type="checkbox"
            checked={Boolean(filters.hasWebsite)}
            onChange={(event) => change("hasWebsite", event.target.checked)}
          />
          Has website
        </label>
        <label>
          <input
            type="checkbox"
            checked={Boolean(filters.metaAdsActiveOnly)}
            disabled={!metadata?.availability.metaAds}
            onChange={(event) => change("metaAdsActiveOnly", event.target.checked)}
          />
          Active Meta ads
        </label>
        <label>
          <input
            type="checkbox"
            checked={Boolean(filters.hasPublicFunding)}
            disabled={!metadata?.availability.publicFunding}
            onChange={(event) => change("hasPublicFunding", event.target.checked)}
          />
          Public funding
        </label>
      </div>
      {loading ? (
        <p className="workspace-muted" role="status">
          Loading filter options…
        </p>
      ) : null}
      {error ? (
        <p role="alert">
          {error}{" "}
          <button className="workspace-link" onClick={onRetry}>
            Retry filters
          </button>
        </p>
      ) : null}
      <p className="workspace-muted">
        Ask your assistant to combine markets or refine any other Companies filter.
      </p>
    </div>
  );
}
