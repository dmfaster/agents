export const ENTERPRISE_COMPANY_TECHNOLOGIES = [
  "shopify",
  "woocommerce",
  "mycashflow",
  "magento_adobe_commerce",
  "wordpress",
  "webflow",
  "framer",
  "drupal",
  "joomla",
  "squarespace",
  "wix",
  "intercom",
  "zendesk",
  "groweo",
  "leadoo",
  "serviceform",
  "tidio",
  "crisp",
  "hubspot",
  "salesforce",
  "pipedrive",
  "meta_pixel",
  "linkedin_insight",
  "ga4",
  "google_ads",
  "timma",
  "vello",
  "calendly",
  "cal_com",
  "hubspot_meetings",
  "microsoft_bookings",
  "google_calendar_appointments",
  "chili_piper",
  "youcanbookme",
  "savvycal",
  "tidycal",
] as const;

export type EnterpriseCompanyTechnology = (typeof ENTERPRISE_COMPANY_TECHNOLOGIES)[number];

export type EnterpriseCompanyTechnologyGroupKey =
  | "commerce"
  | "websiteCms"
  | "customerConversations"
  | "crmSales"
  | "appointmentBooking"
  | "analyticsTracking"
  | "signals";

const ENTERPRISE_COMPANY_TECHNOLOGY_SET = new Set<string>(ENTERPRISE_COMPANY_TECHNOLOGIES);

export const ENTERPRISE_COMPANY_TECHNOLOGY_OPTIONS: ReadonlyArray<{
  value: EnterpriseCompanyTechnology;
  label: string;
  logoSrc: string;
  mark: string;
}> = [
  {
    value: "shopify",
    label: "Shopify",
    logoSrc: "/brand-icons/technologies/shopify.svg",
    mark: "S",
  },
  {
    value: "woocommerce",
    label: "WooCommerce",
    logoSrc: "/brand-icons/technologies/woocommerce.svg",
    mark: "W",
  },
  {
    value: "mycashflow",
    label: "MyCashflow",
    logoSrc: "/brand-icons/technologies/mycashflow.png",
    mark: "M",
  },
  {
    value: "magento_adobe_commerce",
    label: "Magento / Adobe Commerce",
    logoSrc: "/brand-icons/technologies/magento.svg",
    mark: "M",
  },
  {
    value: "wordpress",
    label: "WordPress",
    logoSrc: "/brand-icons/technologies/wordpress.svg",
    mark: "WP",
  },
  {
    value: "webflow",
    label: "Webflow",
    logoSrc: "/brand-icons/technologies/webflow.svg",
    mark: "WF",
  },
  { value: "framer", label: "Framer", logoSrc: "/brand-icons/technologies/framer.svg", mark: "F" },
  { value: "drupal", label: "Drupal", logoSrc: "/brand-icons/technologies/drupal.svg", mark: "D" },
  { value: "joomla", label: "Joomla", logoSrc: "/brand-icons/technologies/joomla.svg", mark: "J" },
  {
    value: "squarespace",
    label: "Squarespace",
    logoSrc: "/brand-icons/technologies/squarespace.svg",
    mark: "SQ",
  },
  { value: "wix", label: "Wix", logoSrc: "/brand-icons/technologies/wix.svg", mark: "W" },
  {
    value: "intercom",
    label: "Intercom",
    logoSrc: "/brand-icons/technologies/intercom.svg",
    mark: "I",
  },
  {
    value: "zendesk",
    label: "Zendesk",
    logoSrc: "/brand-icons/technologies/zendesk.svg",
    mark: "Z",
  },
  { value: "groweo", label: "Groweo", logoSrc: "/brand-icons/technologies/groweo.svg", mark: "G" },
  { value: "leadoo", label: "Leadoo", logoSrc: "/brand-icons/technologies/leadoo.svg", mark: "L" },
  {
    value: "serviceform",
    label: "Serviceform",
    logoSrc: "/brand-icons/technologies/serviceform.svg",
    mark: "SF",
  },
  { value: "tidio", label: "Tidio", logoSrc: "/brand-icons/technologies/tidio.svg", mark: "T" },
  { value: "crisp", label: "Crisp", logoSrc: "/brand-icons/technologies/crisp.svg", mark: "C" },
  {
    value: "hubspot",
    label: "HubSpot",
    logoSrc: "/brand-icons/technologies/hubspot.svg",
    mark: "HS",
  },
  {
    value: "salesforce",
    label: "Salesforce",
    logoSrc: "/brand-icons/technologies/salesforce.svg",
    mark: "SF",
  },
  {
    value: "pipedrive",
    label: "Pipedrive",
    logoSrc: "/brand-icons/technologies/pipedrive.svg",
    mark: "P",
  },
  {
    value: "meta_pixel",
    label: "Meta Pixel",
    logoSrc: "/brand-icons/technologies/meta_pixel.svg",
    mark: "MP",
  },
  {
    value: "linkedin_insight",
    label: "LinkedIn Insight",
    logoSrc: "/brand-icons/technologies/linkedin_insight.svg",
    mark: "LI",
  },
  {
    value: "ga4",
    label: "Google Analytics 4",
    logoSrc: "/brand-icons/technologies/ga4.svg",
    mark: "GA",
  },
  {
    value: "google_ads",
    label: "Google Ads",
    logoSrc: "/brand-icons/technologies/google_ads.svg",
    mark: "G Ads",
  },
  { value: "timma", label: "Timma", logoSrc: "/brand-icons/technologies/timma.png", mark: "T" },
  { value: "vello", label: "Vello", logoSrc: "/brand-icons/technologies/vello.svg", mark: "V" },
  {
    value: "calendly",
    label: "Calendly",
    logoSrc: "/brand-icons/technologies/calendly.svg",
    mark: "C",
  },
  {
    value: "cal_com",
    label: "Cal.com",
    logoSrc: "/brand-icons/technologies/cal_com.svg",
    mark: "C",
  },
  {
    value: "hubspot_meetings",
    label: "HubSpot Meetings",
    logoSrc: "/brand-icons/technologies/hubspot_meetings.svg",
    mark: "HM",
  },
  {
    value: "microsoft_bookings",
    label: "Microsoft Bookings",
    logoSrc: "/brand-icons/technologies/microsoft_bookings.svg",
    mark: "MB",
  },
  {
    value: "google_calendar_appointments",
    label: "Google Appointment Scheduling",
    logoSrc: "/brand-icons/technologies/google_calendar_appointments.svg",
    mark: "G",
  },
  {
    value: "chili_piper",
    label: "Chili Piper",
    logoSrc: "/brand-icons/technologies/chili_piper.svg",
    mark: "CP",
  },
  {
    value: "youcanbookme",
    label: "YouCanBookMe",
    logoSrc: "/brand-icons/technologies/youcanbookme.svg",
    mark: "Y",
  },
  {
    value: "savvycal",
    label: "SavvyCal",
    logoSrc: "/brand-icons/technologies/savvycal.svg",
    mark: "SC",
  },
  {
    value: "tidycal",
    label: "TidyCal",
    logoSrc: "/brand-icons/technologies/tidycal.svg",
    mark: "TC",
  },
];

/**
 * Keep the filter taxonomy in one place so the companies sidebar and the
 * company drawer expose the same technology families. Advertising signals
 * intentionally live in their own group rather than being mixed into the
 * website/CRM inventory.
 */
export const ENTERPRISE_COMPANY_TECHNOLOGY_GROUPS: ReadonlyArray<{
  key: EnterpriseCompanyTechnologyGroupKey;
  translationKey: string;
  fallback: string;
  values: ReadonlyArray<EnterpriseCompanyTechnology>;
}> = [
  {
    key: "commerce",
    translationKey: "pipeline.canary.company.technologyGroup.commerce",
    fallback: "Commerce",
    values: ["shopify", "woocommerce", "mycashflow", "magento_adobe_commerce"],
  },
  {
    key: "websiteCms",
    translationKey: "pipeline.canary.company.technologyGroup.websiteCms",
    fallback: "Website and CMS",
    values: ["wordpress", "webflow", "framer", "drupal", "joomla", "squarespace", "wix"],
  },
  {
    key: "customerConversations",
    translationKey: "pipeline.canary.company.technologyGroup.customerConversations",
    fallback: "Customer conversations",
    values: ["intercom", "zendesk", "groweo", "leadoo", "serviceform", "tidio", "crisp"],
  },
  {
    key: "crmSales",
    translationKey: "pipeline.canary.company.technologyGroup.crmSales",
    fallback: "CRM and sales",
    values: ["hubspot", "salesforce", "pipedrive"],
  },
  {
    key: "appointmentBooking",
    translationKey: "companies.technologyGroup.appointmentBooking",
    fallback: "Appointment booking",
    values: [
      "timma",
      "vello",
      "calendly",
      "hubspot_meetings",
      "microsoft_bookings",
      "google_calendar_appointments",
      "cal_com",
      "chili_piper",
      "youcanbookme",
      "savvycal",
      "tidycal",
    ],
  },
  {
    key: "analyticsTracking",
    translationKey: "pipeline.canary.company.technologyGroup.analyticsTracking",
    fallback: "Analytics and tracking",
    values: ["meta_pixel", "linkedin_insight", "ga4"],
  },
  {
    key: "signals",
    translationKey: "companies.technologyGroup.signals",
    fallback: "Signals",
    values: ["google_ads"],
  },
];

export function isEnterpriseCompanyTechnology(
  value: unknown,
): value is EnterpriseCompanyTechnology {
  return typeof value === "string" && ENTERPRISE_COMPANY_TECHNOLOGY_SET.has(value);
}

/** Resolve a stored technology key to the same customer-facing label used by
 * the technology picker. Keeping this in one place prevents profile drawers
 * from leaking raw keys such as `magento_adobe_commerce` into the UI. */
export function getEnterpriseCompanyTechnologyLabel(value: unknown) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  const option = ENTERPRISE_COMPANY_TECHNOLOGY_OPTIONS.find((item) => item.value === normalized);
  return option?.label || normalized.replaceAll("_", " ");
}

export function normalizeEnterpriseCompanyTechnologyList(
  values: unknown[] | null | undefined,
  maxCount: number = ENTERPRISE_COMPANY_TECHNOLOGIES.length,
) {
  return Array.from(
    new Set(
      (values || [])
        .flatMap((value) => String(value || "").split(","))
        .map((value) => value.trim().toLowerCase())
        .filter(isEnterpriseCompanyTechnology),
    ),
  ).slice(0, maxCount);
}

/** Alternatives within a family; every selected family is required. */
export function groupEnterpriseCompanyTechnologies(values: readonly string[]) {
  const selected = new Set(normalizeEnterpriseCompanyTechnologyList([...values]));
  return ENTERPRISE_COMPANY_TECHNOLOGY_GROUPS.flatMap((group) => {
    const values = group.values.filter((value) => selected.has(value));
    return values.length ? [{ ...group, values }] : [];
  });
}

export const MIN_COMPANIES_PER_TECHNOLOGY = 50;

export type EnterpriseCompanyTechnologyAvailability = {
  country: string;
  options: Array<{ value: EnterpriseCompanyTechnology; companyCount: number }>;
};

/** Never reuse another country's options or invent availability while loading. */
export function getAvailableEnterpriseCompanyTechnologyOptions(
  availability: EnterpriseCompanyTechnologyAvailability | null | undefined,
  country: string | undefined,
) {
  if (!country || availability?.country !== country) return [];
  const available = new Set(
    availability.options
      .filter(
        ({ companyCount }) =>
          Number.isSafeInteger(companyCount) && companyCount >= MIN_COMPANIES_PER_TECHNOLOGY,
      )
      .map(({ value }) => value),
  );
  return ENTERPRISE_COMPANY_TECHNOLOGY_OPTIONS.filter(
    (option) => option.value !== "google_ads" && available.has(option.value),
  );
}
