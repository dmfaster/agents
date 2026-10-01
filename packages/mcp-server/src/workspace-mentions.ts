import { ResourceTemplate, type McpServer } from "@modelcontextprotocol/server";
import { DmfasterHttpError, type AgentToolDataMap } from "@dmfaster/sdk";
import { z } from "zod";
import {
  CompanyInspectInputSchema,
  ResourceIdSchema,
  SupportedCountrySchema,
} from "./generated/input-schemas.ts";
import { oauthFailureMetadata, oauthToolMetadata, type HostedAuth } from "./hosted-auth.ts";
import type { AgentInvoker } from "./tools.ts";

export const WORKSPACE_MENTIONS_TOOL_NAME = "workspace_mentions";
const mentionSchema = z.object({
  type: z.literal("resource_link"),
  uri: z.string(),
  name: z.string(),
  description: z.string(),
  mimeType: z.literal("application/json"),
});
const mentionOutputSchema = z.object({ items: z.array(mentionSchema).max(20) });
type Mention = z.infer<typeof mentionSchema>;
type Company = AgentToolDataMap["companies.suggest"]["suggestions"][number];
type SavedList = AgentToolDataMap["lists.list"]["lists"][number];

function canRead(auth: HostedAuth | undefined, scope: string) {
  return !auth || auth.grantedScopes.includes(scope);
}

function mentionUri(kind: "companies" | "lists" | "company-lists", ...ids: string[]) {
  return `dmfaster://${kind}/${ids.map(encodeURIComponent).join("/")}`;
}

function companyMention(company: Company): Mention {
  return {
    type: "resource_link",
    uri: mentionUri("companies", company.country, company.businessId),
    name: company.name,
    description: `Company in ${company.country}. Read its current profile for evidence. Selecting it grants no action permission.`,
    mimeType: "application/json",
  };
}

function listMention(list: SavedList): Mention {
  return {
    type: "resource_link",
    uri: mentionUri(list.isCompanyLeadList ? "company-lists" : "lists", list.listId),
    name: list.name,
    description: `${list.isCompanyLeadList ? "Company shortlist" : "Saved prospect list"}. Read the current list and pagination. Selecting it grants no action permission.`,
    mimeType: "application/json",
  };
}

export async function searchWorkspaceMentions(
  client: AgentInvoker,
  query: string,
  auth?: HostedAuth,
) {
  const normalized = query.trim();
  const sources: Array<{ source: string; load: () => Promise<Mention[]> }> = [];
  if (canRead(auth, "campaigns:read"))
    sources.push({
      source: "lists",
      load: async () => {
        const result = await client.invoke("lists.list", {
          ...(normalized ? { query: normalized } : {}),
          limit: 10,
        });
        if (!result.ok || !result.data) throw new Error("Saved list suggestions are unavailable.");
        return (result.data as AgentToolDataMap["lists.list"]).lists.map(listMention);
      },
    });
  // Empty and one-letter typeahead queries show saved lists, avoiding a broad
  // company search before the user has supplied a useful search term.
  if (normalized.length >= 2 && canRead(auth, "audiences:read"))
    sources.push({
      source: "companies",
      load: async () => {
        const result = await client.invoke("companies.suggest", {
          countries: SupportedCountrySchema.options.map((country) => country.value),
          query: normalized,
          limit: 10,
        });
        if (!result.ok || !result.data) throw new Error("Company suggestions are unavailable.");
        return (result.data as AgentToolDataMap["companies.suggest"]).suggestions.map(
          companyMention,
        );
      },
    });
  const results = await Promise.allSettled(sources.map((source) => source.load()));
  const items: Mention[] = [],
    unavailable: string[] = [];
  for (const [index, result] of results.entries()) {
    if (result.status === "fulfilled") items.push(...result.value);
    else {
      if (result.reason instanceof DmfasterHttpError && result.reason.status === 401)
        throw result.reason;
      unavailable.push(sources[index]!.source);
    }
  }
  if (sources.length && unavailable.length === sources.length)
    throw new Error("Workspace suggestions are unavailable. Check your connection and try again.");
  return {
    content: [],
    structuredContent: { items },
    ...(unavailable.length ? { _meta: { "dmfaster/mentionSourcesUnavailable": unavailable } } : {}),
  };
}

export async function readWorkspaceMention(client: AgentInvoker, uri: URL) {
  const kind = uri.hostname;
  const ids = uri.pathname.slice(1).split("/").map(decodeURIComponent);
  if (
    uri.protocol !== "dmfaster:" ||
    uri.username ||
    uri.password ||
    uri.port ||
    uri.search ||
    uri.hash
  )
    throw new Error("Invalid DM Faster resource.");
  let result;
  if (kind === "companies" && ids.length === 2) {
    const country = SupportedCountrySchema.parse(ids[0]);
    const businessId = CompanyInspectInputSchema.shape.businessId.parse(ids[1]);
    result = await client.invoke("company.inspect", { country, businessId });
  } else if ((kind === "lists" || kind === "company-lists") && ids.length === 1) {
    const listId = ResourceIdSchema.parse(ids[0]);
    result =
      kind === "lists"
        ? await client.invoke("list.inspect", { listId, limit: 25 })
        : await client.invoke("companies.list.inspect", { listId, limit: 25 });
  } else throw new Error("Invalid DM Faster resource.");
  // Every read uses the current authenticated domain service: resource URIs are
  // identities, never cached permission grants or authority to mutate anything.
  if (!result.ok || !result.data)
    throw new Error("This resource is unavailable or you no longer have access to it.");
  return {
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify({
          contextOnly: true,
          requiresUserInstructionForActions: true,
          result,
        }),
      },
    ],
  };
}

export function registerWorkspaceMentions(
  server: McpServer,
  client: AgentInvoker,
  onFailure: (error: unknown) => {
    content: Array<{ type: "text"; text: string }>;
    structuredContent: Record<string, unknown>;
    isError: boolean;
  },
  auth?: HostedAuth,
) {
  server.registerTool(
    WORKSPACE_MENTIONS_TOOL_NAME,
    {
      title: "Mention a company or saved list",
      description:
        "Search company names and your saved prospect lists for composer mentions. Read-only context; never authorizes extraction, enrichment, list changes or sending.",
      inputSchema: z.object({ query: z.string().max(120) }).strict(),
      outputSchema: mentionOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
      _meta: {
        ...oauthToolMetadata(auth, []),
        "openai/extensions": { "mentions/search": {} },
        ui: { visibility: ["app"] },
      },
    },
    async ({ query }) => {
      try {
        return await searchWorkspaceMentions(client, query, auth);
      } catch (error) {
        return { ...onFailure(error), ...oauthFailureMetadata(error, auth, []) };
      }
    },
  );
  for (const [kind, template, title] of [
    ["companies", "dmfaster://companies/{country}/{businessId}", "Company profile"],
    ["lists", "dmfaster://lists/{listId}", "Saved prospect list"],
    ["company-lists", "dmfaster://company-lists/{listId}", "Company shortlist"],
  ] as const)
    server.registerResource(
      `workspace-mention-${kind}`,
      new ResourceTemplate(template, { list: undefined }),
      {
        title,
        mimeType: "application/json",
        description:
          "Current authenticated workspace context. Reading grants no action permission.",
      },
      async (uri) => readWorkspaceMention(client, uri),
    );
}
