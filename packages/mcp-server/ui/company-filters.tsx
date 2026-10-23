import { t } from "./locale.ts";
import type { CompanyFilters } from "./companies-data.ts";

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
  hasActiveHiring: "Actively hiring (Finland)",
  hiringTitleQuery: "Job title contains",
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
      if (key === "websiteFacts" && Array.isArray(value)) {
        const labels: Record<string, string> = { b2c: "B2C", b2b: "B2B", saas: "SaaS" };
        return {
          key: key as keyof CompanyFilters,
          label: value.map((fact) => labels[String(fact)] || String(fact)).join(" · "),
        };
      }
      const label = names[key as keyof CompanyFilters] || key.replace(/([a-z])([A-Z])/g, "$1 $2");
      const detail = Array.isArray(value)
        ? t("{count} selected", { count: value.length })
        : typeof value === "boolean"
          ? ""
          : String(value).replaceAll("_", " ");
      return {
        key: key as keyof CompanyFilters,
        label: `${t(label)}${detail ? ` · ${detail}` : ""}`,
      };
    });
}
