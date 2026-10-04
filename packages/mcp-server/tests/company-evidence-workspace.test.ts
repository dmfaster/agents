import assert from "node:assert/strict";
import test from "node:test";
import { evidenceInitial } from "../browser-tests/companies-fixture.mjs";
import {
  completeEvidencePage,
  evidenceAssessment,
  evidenceNotes,
  evidenceQuotes,
} from "../ui/company-evidence-data.ts";
import {
  companiesWorkspaceInputSchema,
  registerCampaignWorkspace,
} from "../src/campaign-workspace.ts";
import { previewPayload, createPreviewReader } from "../tools/preview-workspace-host.mjs";
import { createComposerSearch } from "../tools/search-workspace-preview.mjs";
import { workspaceOutputSchema } from "../src/presentation-schemas.ts";
import type { AgentInvoker } from "../src/tools.ts";
import type { AgentToolResult } from "@dmfaster/sdk";
import type { EvidencePage } from "../ui/company-evidence-data.ts";

test("semantic result receipts preserve unavailable totals, exact progress and original evidence", () => {
  const payload = evidenceInitial();
  const page = completeEvidencePage(payload.result.data as EvidencePage);
  assert.equal(evidenceAssessment(page.companies[0]!), "Accepted match");
  assert.equal(evidenceAssessment(page.companies[1]!), "Needs review");
  assert.equal(evidenceQuotes(page.companies[0]!).length, 1);
  const result = previewPayload(payload);
  assert.equal(result.result, payload.result);
  assert.equal("filters" in result, false);
  assert(workspaceOutputSchema.safeParse(result).success);
  for (const change of [
    { total: 1 },
    { totalExact: true },
    { progress: {} },
    { expectedRevision: "" },
  ])
    assert.throws(() =>
      previewPayload({ ...payload, result: { ...payload.result, data: { ...page, ...change } } }),
    );
});

test("evidence display leads with substantial Finnish context and preserves every original source and decision", () => {
  const company = evidenceInitial().result.data.companies[0]!;
  const original = company.passages[0]!;
  const navigation = {
    ...original,
    text: "Etusivu Ratkaisut Asiakkaat Yhteystiedot",
    contentHash: "navigation",
  };
  const paragraph = {
    ...original,
    heading: "Palvelumme",
    text: "Yrityksemme auttaa asiakkaan henkilöstöä järjestämään päivittäisen työn ja seuraamaan sen etenemistä. Palvelu on käytettävissä selaimella, ja me huolehdimme sen ylläpidosta sekä jatkuvista päivityksistä. Asiakas valitsee tarvitsemansa toiminnot ja saa ne käyttöönsä kuukausimaksulla.",
    contentHash: "original-finnish-paragraph",
  };
  const other = {
    ...original,
    text: "This original page describes the company and its customers.",
    contentHash: "other-page",
    url: "https://example.fi/about",
  };
  company.passages = [navigation, paragraph, other];
  company.criteria = company.criteria.map((criterion) => ({
    ...criterion,
    evidence: [navigation, paragraph],
  }));
  const before = structuredClone(company);
  const quotes = evidenceQuotes(company);
  assert.equal(quotes[0], paragraph);
  assert.equal(quotes.length, 3);
  assert(quotes.includes(navigation));
  assert(quotes.includes(other));
  assert.deepEqual(company, before);
  assert.equal(evidenceAssessment(company), "Accepted match");
});

test("repeated assessment notes collapse while distinct review and incomplete coverage stay visible", () => {
  const company = evidenceInitial().result.data.companies[0]!;
  const criterion = company.criteria[0]!;
  const coverage = { complete: false, includedPassages: 2, retainedPassages: 5 };
  const binary = { value: true, probabilityTrue: 0.99, reviewRequired: true, coverage };
  company.criteria = [
    { ...criterion, criterionId: "saas", reason: "Original context samples.", binary },
    { ...criterion, criterionId: "b2b", reason: "Original context samples.", binary },
    {
      ...criterion,
      criterionId: "buyers",
      reason: "Buyer assessment requires review.",
      binary: { ...binary, coverage: { ...coverage, includedPassages: 3 } },
    },
  ];
  const before = structuredClone(company);
  const notes = evidenceNotes(company);
  assert.equal(notes.length, 2);
  assert(notes.some((note) => note.includes("2 of 5 saved passages")));
  assert(
    notes.some(
      (note) =>
        note.includes("Buyer assessment requires review") && note.includes("3 of 5 saved passages"),
    ),
  );
  assert.deepEqual(company, before);
});

test("opening an evidence workspace reads its pinned private run and preserves the returned criteria", async () => {
  const payload = evidenceInitial();
  const tools = new Map<
    string,
    { options: Record<string, unknown>; call: (input: unknown) => Promise<unknown> }
  >();
  const server = {
    registerResource() {},
    registerTool(
      name: string,
      options: Record<string, unknown>,
      call: (input: unknown) => Promise<unknown>,
    ) {
      tools.set(name, { options, call });
    },
  };
  const calls: unknown[] = [];
  const client = {
    invoke: async (tool: unknown, input: unknown) => {
      calls.push({ tool, input });
      return payload.result as AgentToolResult;
    },
  } as AgentInvoker;
  registerCampaignWorkspace(
    server as unknown as Parameters<typeof registerCampaignWorkspace>[0],
    client,
    () => {
      throw Error("Unexpected failure");
    },
  );
  const evidenceRun = {
    runId: payload.result.data.runId,
    expectedRevision: payload.result.data.expectedRevision,
    view: "all" as const,
  };
  const args = companiesWorkspaceInputSchema.parse({ evidenceRun, pageSize: 20 });
  const tool = tools.get("companies_workspace")!;
  const result = (await tool.call(args)) as {
    structuredContent: { result: AgentToolResult };
    content: { text: string }[];
  };
  assert.deepEqual(calls, [
    { tool: "companies.evidence.results", input: { ...evidenceRun, pageSize: 20 } },
  ]);
  assert.equal(result.structuredContent.result, payload.result);
  assert(result.content[0]!.text.includes("Market audience total is unavailable"));
  assert(workspaceOutputSchema.safeParse(result.structuredContent).success);
  assert.throws(() =>
    companiesWorkspaceInputSchema.parse({ evidenceRun, filters: { countries: ["FI"] } }),
  );
  assert.throws(() => companiesWorkspaceInputSchema.parse({ evidenceRun, pageSize: 100 }));
});

test("composer previews can publish existing evidence results but cannot create or advance a scan", async () => {
  const payload = evidenceInitial();
  const calls: unknown[] = [];
  const read = await createPreviewReader({
    invoke: async (tool: unknown, input: unknown) => {
      calls.push({ tool, input });
      return payload.result;
    },
  });
  const published: unknown[] = [];
  const search = createComposerSearch(read, async (payload: unknown) => {
    published.push(payload);
  });
  const evidenceRun = {
    runId: payload.result.data.runId,
    expectedRevision: payload.result.data.expectedRevision,
    view: "all",
  };
  const receipt = await search({ evidenceRun });
  assert.equal(receipt.total, null);
  assert.equal(receipt.totalExact, false);
  assert.equal(receipt.confirmedMatches, 1);
  assert.deepEqual(calls, [
    { tool: "companies.evidence.results", input: { ...evidenceRun, pageSize: 20 } },
  ]);
  assert.equal(published.length, 1);
  for (const name of [
    "companies_evidence_start",
    "companies_evidence_advance",
    "companies_evidence_cancel",
  ])
    await assert.rejects(read(name, evidenceRun));
  assert.equal(calls.length, 1);
});
