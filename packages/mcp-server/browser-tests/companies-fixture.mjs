export const rows = [
  {
    country: "FI",
    businessId: "demo-1",
    name: "Nordic Studio",
    city: "Helsinki",
    industryLabel: "Advertising",
    websiteUrl: "https://nordic.example.test",
    employeeCount: 18,
    revenueEur: 2400000,
    financialYear: "2025",
  },
  {
    country: "FI",
    businessId: "demo-2",
    name: "Helsinki Craft",
    city: "Espoo",
    industryLabel: "Design",
    websiteUrl: "https://craft.example.test",
    employeeCount: 8,
    revenueEur: 900000,
    financialYear: "2025",
  },
  {
    country: "FI",
    businessId: "demo-3",
    name: "Northstar Software",
    city: "Tampere",
    industryLabel: "Software",
    websiteUrl: "https://northstar.example.test",
    employeeCount: 42,
    revenueEur: 7600000,
    financialYear: "2025",
  },
];
export const initial = (filters = { countries: ["FI"], activeOnly: true }) => ({
  version: 1,
  view: "dmfaster.workspace",
  section: "companies",
  result: {
    version: 1,
    tool: "companies.search",
    ok: true,
    error: null,
    data: {
      companies: rows,
      total: 41,
      totalExact: true,
      filters,
      page: 1,
      pageSize: 3,
      expectedRevision: "FI:revision-1",
      querySignature: "query-fi-v1",
      nextCursor: "opaque-next-company",
      hasNextPage: true,
      dataFreshness: { engine: "search_facts", revision: "FI:revision-1" },
    },
  },
});

export function evidenceInitial() {
  const quote = {
    url: "https://nordic.example.test/tuote",
    observedAt: "2026-10-01T00:00:00.000Z",
    contentHash: "a".repeat(64),
    extractionVersion: "fixture",
    language: "fi",
    heading: "Tuote yrityksille",
    text: "Tarjoamme yrityksille omaa selaimella käytettävää ohjelmaa kuukausimaksulla.",
  };
  return {
    version: 1,
    view: "dmfaster.workspace",
    section: "companies",
    result: {
      version: 1,
      tool: "companies.evidence.results",
      policy: { effect: "read", approval: "none", exposure: "public_api" },
      ok: true,
      generatedAt: "2026-10-02T12:00:00.000Z",
      durationMs: 1,
      evidence: [],
      consistency: { status: "verified", checks: [] },
      artifacts: [],
      error: null,
      data: {
        country: "FI",
        runId: "00000000-0000-4000-8000-000000000001",
        expectedRevision: "b".repeat(64),
        querySignature: "c".repeat(64),
        query: "Finnish SaaS companies",
        evaluationMode: "binary",
        view: "all",
        status: "running",
        scanComplete: false,
        awaitingMoreResults: false,
        total: null,
        totalExact: false,
        totalStatus: "unavailable",
        expiresAt: "2026-10-03T12:00:00.000Z",
        hasNextPage: true,
        nextCursor: "sequence:2",
        appliedFilters: { countries: ["FI"], activeOnly: true },
        appliedCriteria: [
          {
            id: "saas",
            statement: "Does this company offer its own SaaS product?",
            requirement: "advertised",
            retrievalTerms: [],
          },
        ],
        progress: {
          checkedPassages: 4,
          confirmedMatches: 1,
          contradictedCompanies: 0,
          eligibleCompanies: 10,
          enqueuedCompanies: 10,
          missingEvidenceCompanies: 0,
          pendingCompanies: 8,
          processedCompanies: 2,
          processingCompanies: 0,
          retryingCompanies: 0,
          staleEvidenceCompanies: 0,
          unresolvedCompanies: 1,
        },
        usage: {
          cachedDecisions: 0,
          elapsedMs: 12,
          inputTokens: 100,
          outputTokens: 5,
          providerDurationMs: 10,
          providerRequests: 2,
          usageMissingRequests: 0,
        },
        retryFailures: [],
        limitations: ["Saved source fixture; no real company or classifier accuracy claim."],
        companies: rows.slice(0, 2).map((row, i) => ({
          country: row.country,
          businessId: row.businessId,
          name: row.name,
          websiteUrl: row.websiteUrl,
          matches: i === 0,
          passages: [{ ...quote, url: row.websiteUrl + "/tuote" }],
          selection: null,
          criteria: [
            {
              criterionId: "saas",
              status: i === 0 ? "supported" : "unknown",
              probability: i === 0 ? 0.98 : 0,
              binary: {
                value: true,
                probabilityTrue: 0.98,
                reviewRequired: i !== 0,
                coverage: {
                  retainedPassages: i === 0 ? 2 : 5,
                  includedPassages: 2,
                  complete: i === 0,
                },
              },
              evidence: [{ ...quote, url: row.websiteUrl + "/tuote" }],
              reason: "Original context samples, not selected supporting citations.",
            },
          ],
        })),
      },
    },
  };
}

// Deterministic, disposable host simulation. Also used by the local review preview.
export function installCompanyHost({ payload, rows, options = {} }) {
  window.__calls = [];
  window.__contexts = [];
  window.__links = [];
  window.__pending = [];
  window.__release = (name, index = 0) => {
    const matching = window.__pending.filter((item) => item.name === name);
    const item = matching[index];
    if (!item) throw new Error(`No pending ${name} call at ${index}`);
    window.__pending.splice(window.__pending.indexOf(item), 1);
    item.respond(item.value);
  };
  window.addEventListener("message", (event) => {
    const message = event.data;
    if (message?.jsonrpc !== "2.0" || typeof message.id !== "number" || !message.method) return;
    const respond = (value) =>
      window.postMessage({ jsonrpc: "2.0", id: message.id, result: value }, "*");
    if (message.method === "ui/initialize") {
      respond({
        hostCapabilities: {
          serverTools: {},
          updateModelContext: {},
          ...(options.supportLinks ? { openLinks: {} } : {}),
        },
        hostContext: { displayMode: "fullscreen", theme: "light", ...options.hostContext },
      });
      setTimeout(
        () =>
          window.postMessage(
            {
              jsonrpc: "2.0",
              method: "ui/notifications/tool-result",
              params: { structuredContent: payload },
            },
            "*",
          ),
        0,
      );
    } else if (message.method === "tools/call") {
      const { name, arguments: args } = message.params;
      window.__calls.push(message.params);
      if (options.denyCalls)
        return respond({
          isError: true,
          structuredContent: { ok: false, error: { message: "Company access denied" } },
        });
      let data;
      if (name === "company_inspect") {
        const row = rows.find((item) => item.businessId === args.businessId) ?? rows[0];
        data = {
          revision: `profile:${args.country}:${args.businessId}`,
          profile: {
            ...row,
            country: args.country,
            businessId: args.businessId,
            industry: row.industryLabel,
            description: `${row.name} helps teams build lasting customer relationships.`,
            technologies: ["wordpress"],
            decisionMakers: [{ name: "Alex Example", role: "Founder", email: "alex@example.test" }],
            financials: [
              { fiscalYear: "2025", revenueEur: row.revenueEur, employeeCount: row.employeeCount },
            ],
            advertising: {
              google: { status: "recent", checkedAt: "2026-08-26T00:00:00Z" },
              meta: { active: true, checkedAt: "2026-08-29T00:00:00Z" },
            },
            funding: null,
            publicFunding: null,
            hiring: null,
            exhibitions: [],
            websiteContacts: [],
            socialProfiles: [],
          },
        };
      } else if (name === "companies_evidence_results") {
        data = structuredClone(
          args.cursor && options.evidenceNext ? options.evidenceNext : payload.result.data,
        );
        if (options.changedEvidenceRevision) data.expectedRevision = "other-evidence-revision";
      } else if (name === "companies_search") {
        const q = (args.filters.q || "").toLowerCase();
        const companies =
          args.cursor || (args.page ?? 1) > 1
            ? [{ ...rows[0], businessId: "demo-last", name: "Last company" }]
            : rows.filter((row) => row.name.toLowerCase().includes(q));
        data = {
          companies,
          total: q ? companies.length : 41,
          totalExact: !options.approximate,
          filters: args.filters,
          page: args.page ?? 1,
          pageSize: args.pageSize ?? 3,
          expectedRevision: options.changedRevision ? "FI:revision-2" : "FI:revision-1",
          querySignature: q ? `query:${q}` : "query-fi-v1",
          hasNextPage: !q && !args.cursor && (args.page ?? 1) === 1,
          nextCursor: !q && !args.cursor ? "opaque-next-company" : null,
        };
      } else if (name === "companies_filters") {
        data = {
          defaults: { countries: args.countries, activeOnly: true },
          filterFields: ["industryCodes", "employeeMin", "hasWebsite"],
          availability: { technologies: true, metaAds: true, publicFunding: true },
          restrictions: [],
          fundingSources: [],
          metadata: {
            industries: [
              { code: "MARKETING_ADVERTISING", label: "Advertising" },
              { code: "SOFTWARE", label: "Software" },
            ],
            cities: [{ value: "HELSINKI", label: "Helsinki" }],
          },
          technologies: [
            { value: "shopify", label: "Shopify" },
            { value: "wordpress", label: "WordPress" },
          ],
        };
      } else if (name === "campaigns_list") {
        data = { campaigns: [], totalCount: 0, hasMore: false, nextCursor: null };
      } else if (name === "connection_status") {
        return respond({
          structuredContent: {
            status: "authenticated",
            user: { email: "demo@example.test" },
            workspace: { name: "Demo workspace" },
            credential: { scopes: ["audiences:read"] },
          },
        });
      } else
        return respond({
          isError: true,
          structuredContent: { ok: false, error: { message: `Unexpected tool ${name}` } },
        });
      const value = {
        structuredContent: {
          ok: true,
          data,
          tool: name === "company_inspect" ? "company.inspect" : name.replaceAll("_", "."),
          error: null,
        },
      };
      if (
        (options.holdProfiles && name === "company_inspect") ||
        (options.holdEvidence && name === "companies_evidence_results") ||
        (options.holdSearch && name === "companies_search")
      )
        window.__pending.push({ name, respond, value });
      else respond(value);
    } else if (message.method === "ui/open-link") {
      window.__links.push(message.params);
      respond({});
    } else if (message.method === "ui/update-model-context") {
      window.__contexts.push(message.params);
      respond({});
    } else respond({});
  });
}
