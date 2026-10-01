import { type McpServer } from "@modelcontextprotocol/server";
import type { AgentToolInputMap } from "@dmfaster/sdk";
import { z } from "zod";

import { CAMPAIGN_WORKSPACE_HTML } from "./campaign-workspace-html.ts";
import { campaignIdSchema, campaignStateSchema, type AgentInvoker } from "./tools.ts";

import { workspaceOutputSchema, campaignWorkspaceOutputSchema } from "./presentation-schemas.ts";
import { oauthToolMetadata, oauthFailureMetadata, type HostedAuth } from "./hosted-auth.ts";
import { CompanySearchFiltersSchema } from "./generated/input-schemas.ts";
import { companyResultSummary } from "./company-result-summary.ts";

export const CAMPAIGN_WORKSPACE_TOOL_NAME = "campaign_workspace";
export const CAMPAIGN_WORKSPACE_RESOURCE_URI = "ui://dmfaster/campaign-workspace/v3.html";
export const PREVIOUS_CAMPAIGN_WORKSPACE_RESOURCE_URI = "ui://dmfaster/campaign-workspace/v2.html";
export const LEGACY_CAMPAIGN_WORKSPACE_RESOURCE_URI = "ui://dmfaster/campaign-workspace/v1.html";
export const MCP_APP_RESOURCE_MIME_TYPE = "text/html;profile=mcp-app";

export const campaignWorkspaceInputSchema = z
  .object({
    state: campaignStateSchema.optional(),
    campaignId: campaignIdSchema
      .optional()
      .describe(
        "Optional DM Faster campaign identifier returned by campaign_prepare or campaign_inspect.",
      ),
  })
  .strict();

export const companiesWorkspaceInputSchema = z
  .object({
    filters: CompanySearchFiltersSchema.optional(),
    pageSize: z.number().int().min(1).max(100).optional(),
  })
  .strict();

const resourceUiMetadata = Object.freeze({
  domain: "https://app.dmfaster.com",
  csp: {
    connectDomains: [] as string[],
    resourceDomains: [] as string[],
    frameDomains: [] as string[],
  },
  prefersBorder: true,
});

function presentationResult(input: {
  state: z.infer<typeof campaignStateSchema>;
  campaignId?: string | undefined;
}) {
  const structuredContent = {
    version: 1,
    view: "dmfaster.campaign_workspace",
    state: input.state,
    campaignId: input.campaignId ?? null,
    actions: {
      validate: "campaign_validate",
      preview: "audience_preview",
      preparePrivateDraft: "campaign_prepare",
      requestLaunchApproval: "campaign_launch_preflight",
    },
    safety: {
      preparationStartsSending: false,
      launchRequiresHumanApproval: true,
      exactAudienceRequiredForPreparation: true,
    },
  };

  return {
    content: [
      {
        type: "text" as const,
        text: [
          `Campaign workspace ready for ${input.state.profile.businessName || "this business"}.`,
          "A compatible MCP Apps host can render the interactive editor.",
          "In a headless host, keep using the structured state and the DM Faster domain tools directly.",
          "Preparing creates only a private disabled draft; launching still requires the owner-approved preflight flow.",
        ].join(" "),
      },
    ],
    structuredContent,
  };
}

export function registerCampaignWorkspace(
  server: McpServer,
  client: AgentInvoker,
  onFailure: (error: unknown) => {
    content: Array<{ type: "text"; text: string }>;
    structuredContent: Record<string, unknown>;
    isError: boolean;
  },
  auth?: HostedAuth,
) {
  const openWorkspace = async (campaignId?: string) => {
    try {
      // The same authenticated domain adapter enforces scopes and workspace ownership.
      const result = campaignId
        ? await client.invoke("campaign.inspect", { campaignId })
        : await client.invoke("campaigns.list", { limit: 20 });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result) }],
        structuredContent: { version: 1, view: "dmfaster.workspace", section: "campaigns", result },
        ...(result.ok ? {} : { isError: true }),
      };
    } catch (error) {
      const failure = onFailure(error);
      return {
        ...failure,
        ...oauthFailureMetadata(error, auth, ["campaigns:read"]),
        structuredContent: {
          version: 1,
          view: "dmfaster.workspace",
          section: "campaigns",
          result: { ok: false, ...failure.structuredContent },
        },
      };
    }
  };
  const openCompanies = async (input: z.infer<typeof companiesWorkspaceInputSchema>) => {
    const filters = (input.filters ?? {
      countries: ["FI"],
      activeOnly: true,
    }) as AgentToolInputMap["companies.search"]["filters"];
    try {
      const result = await client.invoke("companies.search", {
        filters,
        pageSize: input.pageSize ?? 20,
      });
      return {
        content: [
          { type: "text" as const, text: companyResultSummary(result) ?? JSON.stringify(result) },
        ],
        structuredContent: {
          version: 1,
          view: "dmfaster.workspace",
          section: "companies",
          filters,
          result,
        },
        ...(result.ok ? {} : { isError: true }),
      };
    } catch (error) {
      const failure = onFailure(error);
      return {
        ...failure,
        ...oauthFailureMetadata(error, auth, ["audiences:read"]),
        structuredContent: {
          version: 1,
          view: "dmfaster.workspace",
          section: "companies",
          filters,
          result: { ok: false, ...failure.structuredContent },
        },
      };
    }
  };
  const metadata = {
    ui: resourceUiMetadata,
    "openai/ui": { availableDisplayModes: ["inline", "fullscreen"] },
    "openai/widgetDescription":
      "Browse companies, share a prospect search with the assistant, or review campaigns. Details load on demand; opening the view does not change data.",
    "openai/widgetCSP": { connect_domains: [], resource_domains: [] },
    "openai/widgetPrefersBorder": true,
  };
  // New calls bypass cached HTML; saved conversations retain their resource URI.
  for (const uri of [
    CAMPAIGN_WORKSPACE_RESOURCE_URI,
    PREVIOUS_CAMPAIGN_WORKSPACE_RESOURCE_URI,
    LEGACY_CAMPAIGN_WORKSPACE_RESOURCE_URI,
  ]) {
    server.registerResource(
      uri === CAMPAIGN_WORKSPACE_RESOURCE_URI
        ? "DM Faster workspace"
        : `DM Faster workspace (${uri.includes("v2") ? "v2" : "v1"} compatibility)`,
      uri,
      {
        title: "DM Faster workspace",
        description: "Company prospecting, exact search results and interactive campaign planning.",
        mimeType: MCP_APP_RESOURCE_MIME_TYPE,
        _meta: metadata,
      },
      async () => ({
        contents: [
          {
            uri,
            mimeType: MCP_APP_RESOURCE_MIME_TYPE,
            text: CAMPAIGN_WORKSPACE_HTML,
            _meta: metadata,
          },
        ],
      }),
    );
  }

  server.registerTool(
    CAMPAIGN_WORKSPACE_TOOL_NAME,
    {
      title: "Campaigns",
      description: [
        "Render a complete DM Faster campaign state as an interactive workspace in MCP Apps hosts.",
        "Pass a complete state to review a plan, a campaignId to inspect a saved campaign, or {} to browse campaigns.",
        "Opening reads through existing workspace permissions and never changes data. Headless hosts receive structured content.",
      ].join(" "),
      inputSchema: campaignWorkspaceInputSchema,
      outputSchema: campaignWorkspaceOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
      _meta: {
        ...oauthToolMetadata(auth, ["campaigns:read"]),
        ui: {
          resourceUri: CAMPAIGN_WORKSPACE_RESOURCE_URI,
          visibility: ["model", "app"],
        },
        "openai/ui": { entrypoints: [{ type: "thread" }] },
        "ui/resourceUri": CAMPAIGN_WORKSPACE_RESOURCE_URI,
        "openai/outputTemplate": CAMPAIGN_WORKSPACE_RESOURCE_URI,
        "openai/widgetAccessible": true,
        "openai/toolInvocation/invoking": "Opening campaign workspace…",
        "openai/toolInvocation/invoked": "Campaign workspace ready",
      },
    },
    async (input) =>
      input.state
        ? presentationResult({ state: input.state, campaignId: input.campaignId })
        : openWorkspace(input.campaignId),
  );
  server.registerTool(
    "companies_workspace",
    {
      title: "Companies",
      description:
        "Open the native Companies view for prospecting and brainstorming with the assistant. Accepts the same typed filters as companies_search. Empty arguments browse active companies in Finland. Returns exact totals, complete rows and stable pagination. Reads only; selections never authorize research spending, saving or sending.",
      inputSchema: companiesWorkspaceInputSchema,
      outputSchema: workspaceOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
      _meta: {
        ...oauthToolMetadata(auth, ["audiences:read"]),
        ui: { resourceUri: CAMPAIGN_WORKSPACE_RESOURCE_URI, visibility: ["model", "app"] },
        "openai/ui": { entrypoints: [{ type: "thread" }] },
        "openai/outputTemplate": CAMPAIGN_WORKSPACE_RESOURCE_URI,
        "openai/widgetAccessible": true,
      },
    },
    openCompanies,
  );
  server.registerTool(
    "workspace_open",
    {
      title: "DM Faster",
      description:
        "Open DM Faster to browse companies and brainstorm prospects. Empty arguments open Companies; pass section campaigns to browse campaigns. Reads only; never changes data or spends research credits.",
      inputSchema: companiesWorkspaceInputSchema.extend({
        section: z.enum(["companies", "campaigns"]).optional(),
      }),
      outputSchema: workspaceOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
      icons: [
        {
          src:
            "data:image/svg+xml," +
            encodeURIComponent(
              '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h14v10H9l-4 3v-3H3z"/><path d="M6 8h8M6 11h5"/></svg>',
            ),
          mimeType: "image/svg+xml",
          sizes: ["20x20"],
        },
      ],
      _meta: {
        ...oauthToolMetadata(auth, ["audiences:read"]),
        ui: { resourceUri: CAMPAIGN_WORKSPACE_RESOURCE_URI, visibility: ["model", "app"] },
        "openai/ui": { entrypoints: [{ type: "global" }] },
        "openai/outputTemplate": CAMPAIGN_WORKSPACE_RESOURCE_URI,
        "openai/widgetAccessible": true,
      },
    },
    async (input) => (input.section === "campaigns" ? openWorkspace() : openCompanies(input)),
  );
}
