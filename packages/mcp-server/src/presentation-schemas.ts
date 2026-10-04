import { z } from "zod";
import { campaignStateSchema } from "./tools.ts";
import { AGENT_OUTPUT_SCHEMAS } from "./generated/output-schemas.ts";
import { CompanySearchFiltersSchema } from "./generated/input-schemas.ts";

export const toolFailureSchema = z
  .object({
    error: z
      .object({
        code: z.string(),
        message: z.string(),
        retryable: z.boolean().optional(),
        requestId: z.string().optional(),
        retryAfterSeconds: z.number().optional(),
        details: z.record(z.string(), z.unknown()).optional(),
        status: z.number().optional(),
      })
      .strict(),
  })
  .strict();

export const workspaceOutputSchema = z
  .object({
    version: z.literal(1),
    view: z.literal("dmfaster.workspace"),
    section: z.enum(["companies", "campaigns"]).optional(),
    filters: CompanySearchFiltersSchema.optional(),
    result: z.union([
      AGENT_OUTPUT_SCHEMAS["campaigns.list"],
      AGENT_OUTPUT_SCHEMAS["campaign.inspect"],
      AGENT_OUTPUT_SCHEMAS["companies.search"],
      AGENT_OUTPUT_SCHEMAS["companies.evidence.results"],
      toolFailureSchema.extend({ ok: z.literal(false) }),
    ]),
  })
  .strict();

const planOutputSchema = z
  .object({
    version: z.literal(1),
    view: z.literal("dmfaster.campaign_workspace"),
    state: campaignStateSchema,
    campaignId: z.string().nullable(),
    actions: z
      .object({
        validate: z.literal("campaign_validate"),
        preview: z.literal("audience_preview"),
        preparePrivateDraft: z.literal("campaign_prepare"),
        requestLaunchApproval: z.literal("campaign_launch_preflight"),
      })
      .strict(),
    safety: z
      .object({
        preparationStartsSending: z.literal(false),
        launchRequiresHumanApproval: z.literal(true),
        exactAudienceRequiredForPreparation: z.literal(true),
      })
      .strict(),
  })
  .strict();
export const campaignWorkspaceOutputSchema = z.union([workspaceOutputSchema, planOutputSchema]);

const party = z.object({ id: z.string(), name: z.string(), email: z.string().optional() }).strict();
const credential = z
  .object({
    id: z.string(),
    scopes: z.array(z.string()),
    expiresAt: z.string().nullable(),
  })
  .strict();
export const hostedConnectionSchema = z
  .object({
    status: z.literal("authenticated"),
    transport: z.literal("https"),
    baseUrl: z.string(),
    user: party,
    workspace: party,
    credential,
    scopeEligibleTools: z.array(z.string()),
    authorizationNote: z.string(),
  })
  .strict();
const localBase = z.object({ baseUrl: z.string(), credentialSource: z.string().nullable() });
export const localConnectionSchema = z.union([
  localBase
    .extend({
      status: z.literal("authenticated"),
      user: party,
      workspace: party,
      credential: credential.extend({ name: z.string(), client: z.string() }),
      scopeEligibleTools: z.array(z.object({ tool: z.string(), mcpTool: z.string() }).strict()),
      scopeBlockedTools: z.array(
        z.object({ tool: z.string(), missingScopes: z.array(z.string()) }).strict(),
      ),
      authorizationNote: z.string(),
    })
    .strict(),
  localBase
    .extend({
      status: z.enum(["store_unavailable", "not_authenticated", "invalid", "unavailable"]),
      actionRequired: z.string(),
      error: z.object({ code: z.string(), message: z.string() }).strict().optional(),
    })
    .strict(),
  toolFailureSchema,
]);
