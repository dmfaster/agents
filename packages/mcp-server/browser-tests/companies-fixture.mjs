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
  window.__messages = [];
  window.__links = [];
  window.__displayModes = [];
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
      if (options.locale) document.documentElement.lang = options.locale;
      if (options.compatibilityLocale) window.openai = { locale: options.compatibilityLocale };
      respond({
        hostCapabilities: {
          serverTools: {},
          ...(options.draftMessages
            ? { message: { text: {} }, experimental: { "openai/message": {} } }
            : {}),
          ...(options.noModelContext ? { message: { text: {} } } : { updateModelContext: {} }),
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
          revision: options.outreach
            ? "a".repeat(64)
            : `profile:${args.country}:${args.businessId}`,
          profile: {
            ...row,
            active: true,
            netIncomeEur: 180000,
            revenueGrowthPercent: 12.4,
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
            ...options.profileOverrides,
          },
        };
      } else if (name === "companies_evidence_results") {
        if (args.pageSize > 20)
          return respond({
            isError: true,
            structuredContent: {
              ok: false,
              error: { message: "Evidence page size cannot exceed 20." },
            },
          });
        data = structuredClone(
          args.cursor && options.evidenceNext ? options.evidenceNext : payload.result.data,
        );
        if (args.view === "matches") {
          data.view = "matches";
          data.companies = data.companies.filter((company) => company.matches);
        }
        if (options.changedEvidenceRevision) data.expectedRevision = "other-evidence-revision";
      } else if (name === "companies_search") {
        const q = (args.filters.q || "").toLowerCase();
        const companies =
          args.cursor || (args.page ?? 1) > 1
            ? [{ ...rows[0], businessId: "demo-last", name: "Last company" }]
            : rows.filter((row) => row.name.toLowerCase().includes(q));
        data = {
          companies,
          total: options.changedTotal ? 40 : q ? companies.length : 41,
          totalExact: !options.approximate,
          filters: args.filters,
          page: args.page ?? 1,
          pageSize: args.pageSize ?? 3,
          expectedRevision: options.changedRevision ? "FI:revision-2" : "FI:revision-1",
          querySignature: q ? `query:${q}` : "query-fi-v1",
          hasNextPage: !q && !args.cursor && (args.page ?? 1) === 1,
          nextCursor: !q && !args.cursor ? "opaque-next-company" : null,
        };
        if (options.bulkSelection) {
          const all = Array.from(
            { length: 41 },
            (_, i) =>
              rows[i] ?? {
                ...rows[i % rows.length],
                businessId: `demo-${i + 1}`,
                name: `Demo company ${i + 1}`,
              },
          );
          const start =
            args.cursor === "opaque-next-company"
              ? 3
              : args.cursor
                ? Number(args.cursor)
                : ((args.page || 1) - 1) * (args.pageSize || 3);
          const size = args.pageSize || 3;
          data.companies = all.slice(start, start + size);
          data.hasNextPage = start + size < all.length;
          data.nextCursor = data.hasNextPage && !options.numberedBulk ? String(start + size) : null;
        }
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
      } else if (name === "senders_inspect") {
        if (options.sendersError && !window.__sendersFailed) {
          window.__sendersFailed = true;
          return respond({
            isError: true,
            structuredContent: { ok: false, error: { message: "Sender read unavailable" } },
          });
        }
        data = {
          generatedAt: "2026-10-08T12:00:00.000Z",
          browserSetupUrl: "https://app.dmfaster.com/campaigns",
          browserProfiles: [],
          emailAvailable: options.emailSetup === true,
          mailboxes: options.emailSetup
            ? [
                {
                  id: "mailbox-one",
                  provider: "gmail",
                  emailAddress: "sender@example.com",
                  status: options.mailboxPaused ? "paused" : "connected",
                  sendEnabled: true,
                  canSend: true,
                  canRead: true,
                  needsReauthorization: false,
                  replySyncEnabled: true,
                  lastHealthCheckAt: "",
                  lastErrorCode: "",
                  effectiveDailyCap: 20,
                },
                {
                  id: "mailbox-disabled",
                  provider: "smtp",
                  emailAddress: "disabled@example.com",
                  status: "connected",
                  sendEnabled: false,
                  canSend: true,
                  canRead: false,
                  needsReauthorization: false,
                  replySyncEnabled: false,
                  lastHealthCheckAt: "",
                  lastErrorCode: "",
                  effectiveDailyCap: 20,
                },
              ]
            : [],
          sms: {
            available: options.smsSetup === true,
            configured: options.smsSetup === true,
            enabled: options.smsSetup === true && !options.smsDisabled,
            phoneNumber: options.smsSetup ? "+358401234567" : "",
          },
        };
      } else if (options.outreach && name === "companies_list_prepare") {
        if (options.uncertainList && !window.__lostList) {
          window.__lostList = true;
          return respond({
            isError: true,
            structuredContent: { ok: false, error: { message: "Response unavailable." } },
          });
        }
        if (options.listFailureCode && !window.__deniedList) {
          window.__deniedList = true;
          return respond({
            isError: true,
            structuredContent: {
              error: { code: options.listFailureCode, message: "Request rejected." },
            },
            _meta: {
              "mcp/www_authenticate": [
                'Bearer error="insufficient_scope", scope="audiences:read campaigns:write"',
              ],
            },
          });
        }
        data = {
          listId: "list-selected",
          total: args.companies.length,
          expectedUpdatedAt: "2026-10-05T12:00:00.000Z",
          channelCounts: {
            instagram: options.noRoutes ? 0 : args.companies.length,
            facebook: args.companies.length,
            linkedin: args.companies.length,
            ...(options.missingChannelCounts
              ? {}
              : {
                  email: args.companies.length,
                  sms: options.noSmsRoutes ? 0 : args.companies.length,
                }),
          },
          companies: args.companies.map((c) => ({
            profileId: `enterprise-company:${c.country.toLowerCase()}:${c.businessId}`,
            externalUrl: rows.find((r) => r.businessId === c.businessId)?.websiteUrl || "",
            name: rows.find((r) => r.businessId === c.businessId)?.name || c.businessId,
            instagramHandle: options.noRoutes ? "" : "nordic.studio",
            facebookHandle: "nordic.studio",
            linkedinProfileUrl: "https://www.linkedin.com/in/demo-owner/",
            emailAddress: "recipient@example.com",
            phoneNumber: options.noSmsRoutes ? "" : "+358409876543",
          })),
          name: args.name,
          created: true,
          replayed: false,
        };
        if (options.changedSavedIdentity)
          data.companies[0].profileId = "enterprise-company:fi:other-company";
        window.__savedShortlist = structuredClone(data);
      } else if (name === "companies_list_inspect") {
        const saved = window.__savedShortlist || options.savedListData || payload.result.data;
        const start = args.offset || 0;
        const limit = args.limit || 20;
        data = {
          ...saved,
          companies: saved.companies.slice(start, start + limit),
          expectedUpdatedAt: options.changedList
            ? "2026-10-09T00:00:00.000Z"
            : saved.expectedUpdatedAt,
          nextOffset: start + limit < saved.total ? start + limit : null,
        };
      } else if (options.outreach && name === "campaign_draft_prepare") {
        if (
          options.draftFailureCode &&
          !window.__deniedDraft &&
          (!options.uncertainDraft || window.__lostDraft)
        ) {
          window.__deniedDraft = true;
          return respond({
            isError: true,
            structuredContent: {
              error: { code: options.draftFailureCode, message: "Request rejected." },
            },
            _meta: {
              "mcp/www_authenticate": [
                'Bearer error="insufficient_scope", scope="campaigns:read campaigns:write"',
              ],
            },
          });
        }
        window.__draft = {
          ...args,
          channel: args.channels?.length > 1 ? "multichannel" : args.channels?.[0] || args.channel,
          channels: args.channels || [args.channel],
          linkedinInviteNote: args.linkedinInviteNote || "",
          campaignId: "campaign-selected",
          campaignUpdatedAt: "2026-10-05T12:01:00.000Z",
          targetCount: args.expectedTargetCount,
          audienceCount: args.expectedAudienceCount,
          enabled: false,
          status: "Draft",
        };
        if (options.changedSender) window.__draft.mailboxIds = ["different-mailbox"];
        data = options.changedVariation
          ? { ...window.__draft, messageVariants: [...args.messageVariants].reverse() }
          : window.__draft;
        if (options.uncertainDraft && !window.__lostDraft) {
          window.__lostDraft = true;
          return respond({
            isError: true,
            structuredContent: { ok: false, error: { message: "Response unavailable." } },
          });
        }
      } else if (options.outreach && name === "campaign_launch_preflight") {
        const draft = window.__draft;
        data = options.setupRequired
          ? {
              status: "setup_required",
              setup: {
                setupUrl: "https://app.dmfaster.com/setup",
                message: "Connect your browser first.",
              },
            }
          : {
              status: options.approvalRequired ? "approval_required" : "ready",
              approvalUrl: "https://app.dmfaster.com/approval",
              authorization: {
                id: "agent_action_" + "a".repeat(32),
                action: "campaign.launch",
                campaignId: draft.campaignId,
                commandId: args.idempotencyKey,
                snapshot: {
                  campaignUpdatedAt: options.changedDraft
                    ? "2026-10-05T12:02:00.000Z"
                    : draft.campaignUpdatedAt,
                  targetListId: draft.listId,
                  targetCount: draft.targetCount,
                  channels: draft.channels || [draft.channel],
                },
              },
            };
      } else if (options.outreach && name === "campaign_launch") {
        if (options.uncertainLaunch && !window.__lostLaunch) {
          window.__lostLaunch = true;
          return respond({
            isError: true,
            structuredContent: {
              ok: false,
              error: { message: "Response unavailable. Check launch result." },
            },
          });
        }
        window.__launched = true;
        data = {
          action: "campaign.launch",
          authorizationId: args.authorizationId,
          idempotencyKey: args.idempotencyKey,
          campaign: { campaignId: args.campaignId, campaignStatus: "Queued" },
        };
      } else if (name === "campaigns_list") {
        const campaigns = options.demoCampaigns
          ? [
              ...(window.__draft
                ? [
                    {
                      id: window.__draft.campaignId,
                      name: window.__draft.name,
                      channels: window.__draft.channels,
                      status: window.__launched ? "Queued" : "Draft",
                      targetCount: window.__draft.targetCount,
                      sentCount: 0,
                      dailyCap: 20,
                      updatedAt: "2026-10-05T12:01:00.000Z",
                    },
                  ]
                : []),
              {
                id: "demo-marketing",
                name: "Markkinointi Suomi",
                channels: ["instagram", "facebook"],
                status: "Running",
                targetCount: 126,
                sentCount: 38,
                dailyCap: 20,
                updatedAt: "2026-10-05T12:01:00.000Z",
              },
              {
                id: "demo-software",
                name: "Ohjelmistoyritykset",
                channels: ["linkedin"],
                status: "Paused",
                targetCount: 64,
                sentCount: 12,
                dailyCap: 20,
                updatedAt: "2026-10-05T12:01:00.000Z",
              },
            ].filter((c) => !args.query || c.name.toLowerCase().includes(args.query.toLowerCase()))
          : [];
        window.__campaigns = campaigns;
        data = { campaigns, totalCount: campaigns.length, hasMore: false, nextCursor: null };
      } else if (options.demoCampaigns && name === "campaign_inspect") {
        data = {
          campaign: window.__campaigns.find((c) => c.id === args.campaignId),
          execution: { queued: 0, companiesReached: 24 },
          pipeline: { replied: 0, call_booked: 0, closed: 0 },
          settings: {
            pacingSeconds: 60,
            timezone: "Europe/Helsinki",
            instagramSendingWindowEnabled: false,
          },
        };
      } else if (options.demoCampaigns && name === "history_list") {
        const campaign = window.__campaigns.find((c) => c.id === args.campaignId);
        data = {
          campaignId: args.campaignId,
          entries: Array.from({ length: Math.min(100, campaign.sentCount) }, (_, i) => ({
            id: `demo-send-${i}`,
            sentAt: new Date(
              Date.UTC(
                2026,
                9,
                1 + Math.floor((i * 5) / Math.max(1, campaign.sentCount)),
                9,
                i % 60,
              ),
            ).toISOString(),
            state: "Sent",
            channel: "instagram",
            sentTo: "demo",
            targetName: "Demo company",
            sentFrom: "Demo sender",
          })),
          hasMore: campaign.sentCount > 100,
          nextCursor: null,
        };
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
        (options.holdSearch && name === "companies_search") ||
        (options.holdList && name === "companies_list_prepare")
      )
        window.__pending.push({ name, respond, value });
      else respond(value);
    } else if (message.method === "ui/request-display-mode") {
      window.__displayModes.push(message.params);
      if (options.denyExpansion)
        window.postMessage(
          { jsonrpc: "2.0", id: message.id, error: { message: "Expansion unavailable" } },
          "*",
        );
      else respond({ mode: message.params.mode });
    } else if (message.method === "ui/open-link") {
      window.__links.push(message.params);
      respond({});
    } else if (message.method === "ui/message") {
      window.__messages.push(message.params);
      respond({});
    } else if (message.method === "ui/update-model-context") {
      window.__contexts.push(message.params);
      respond({});
    } else respond({});
  });
}
