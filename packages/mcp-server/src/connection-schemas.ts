import { z } from "zod";

export const toolFailureSchema = z
  .object({
    error: z
      .object({
        code: z.string(),
        message: z.string(),
        retryable: z.boolean().optional(),
        nextAction: z.string().optional(),
        docsUrl: z.string().optional(),
        requiredScope: z.string().optional(),
        reason: z.string().optional(),
        setupUrl: z.string().optional(),
        requiredConnection: z.string().optional(),
        blockedUntil: z.string().optional(),
        retryAfterMs: z.number().int().nonnegative().optional(),
        requestId: z.string().optional(),
        retryAfterSeconds: z.number().optional(),
        details: z.record(z.string(), z.unknown()).optional(),
        status: z.number().optional(),
      })
      .strict(),
  })
  .strict();

const party = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string().optional(),
    isSandbox: z.boolean().optional(),
  })
  .strict();
const credential = z
  .object({
    id: z.string(),
    scopes: z.array(z.string()),
    expiresAt: z.string().nullable(),
  })
  .strict();
const readinessFields = {
  expiresInDays: z.number().int().nonnegative().nullable().optional(),
  readiness: z
    .object({
      observedAt: z.string(),
      calendar: z.object({ connected: z.boolean(), setupUrl: z.string() }).strict().nullable(),
      gmail: z.array(
        z
          .object({
            mailboxId: z.string(),
            canSend: z.boolean(),
            needsReauthorization: z.boolean(),
            setupUrl: z.string(),
          })
          .strict(),
      ),
      sms: z
        .object({ available: z.boolean(), configured: z.boolean(), enabled: z.boolean() })
        .strict()
        .nullable(),
      browserWorkers: z
        .object({
          online: z.number().int(),
          offline: z.number().int(),
          staleSince: z.string().nullable(),
          setupUrl: z.string(),
        })
        .strict()
        .nullable(),
      unavailable: z.array(
        z
          .object({ tool: z.enum(["calendar.status", "senders.inspect"]), reason: z.string() })
          .strict(),
      ),
    })
    .strict()
    .optional(),
};
const connectionViewFields = {
  knownToolBlockerCount: z.number().int().nonnegative().optional(),
  availabilityBasis: z.literal("granted_scopes_only").optional(),
  availabilityNote: z.string().optional(),
  toolBlockers: z
    .record(z.string(), z.object({ code: z.string(), nextAction: z.string() }).strict())
    .optional(),
  blockedTools: z
    .array(z.object({ name: z.string(), requiredScope: z.string() }).strict())
    .optional(),
  grantUrl: z.string().url().optional(),
  agent: z.object({ id: z.string(), name: z.string(), status: z.string() }).strict().optional(),
  toolsView: z.enum(["summary", "names", "full", "identity"]).optional(),
  tools: z
    .object({
      available: z.number().int(),
      blocked: z.number().int(),
      byScope: z.record(z.string(), z.number().int()),
    })
    .strict()
    .optional(),
  readinessSummary: z
    .object({
      calendarConnected: z.boolean().nullable(),
      gmailCanSend: z.boolean().nullable(),
      smsAvailable: z.boolean().nullable(),
      onlineBrowsers: z.number().int().nullable(),
      unavailableChecks: z.number().int(),
    })
    .strict()
    .nullable()
    .optional(),
};
export const hostedConnectionSchema = z
  .object({
    status: z.literal("authenticated"),
    transport: z.literal("https"),
    baseUrl: z.string(),
    user: party,
    workspace: party,
    credential,
    ...readinessFields,
    ...connectionViewFields,
    scopeEligibleTools: z.array(z.string()).optional(),
    scopeEligibleMcpTools: z.array(z.string()).optional(),
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
      ...readinessFields,
      ...connectionViewFields,
      scopeEligibleTools: z
        .array(z.object({ tool: z.string(), mcpTool: z.string() }).strict())
        .optional(),
      scopeEligibleMcpTools: z.array(z.string()).optional(),
      scopeBlockedTools: z
        .array(z.object({ tool: z.string(), missingScopes: z.array(z.string()) }).strict())
        .optional(),
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
