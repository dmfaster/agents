import {
  inputRequired,
  inputResponse,
  CLIENT_CAPABILITIES_META_KEY,
  PROTOCOL_VERSION_META_KEY,
  type ClientCapabilities,
  type ElicitRequestFormParams,
  type McpServer,
  type ServerContext,
} from "@modelcontextprotocol/server";
import type { AgentToolDataMap } from "@dmfaster/sdk";
import { z } from "zod";
import type { AgentInvoker } from "./tools.ts";
import { oauthFailureMetadata, oauthToolMetadata, type HostedAuth } from "./hosted-auth.ts";

export const OUTREACH_DETAILS_TOOL_NAME = "outreach_details";
const channel = z.enum(["instagram", "facebook", "linkedin", "gmail", "sms"]);
export const outreachDetailsSchema = z
  .object({
    channel,
    name: z.string().trim().min(1).max(120),
    body: z.string().trim().min(1).max(5000),
    subject: z.string().trim().max(200).optional(),
    mailboxId: z.string().max(160).optional(),
    dailyCap: z.number().int().min(1).max(1000),
  })
  .strict();
export type OutreachDetails = z.infer<typeof outreachDetailsSchema>;
type OutreachDefaults = { [K in keyof OutreachDetails]?: OutreachDetails[K] | undefined };
const outputSchema = z.object({
  status: z.enum(["collected", "cancelled", "unsupported", "unavailable"]),
  details: outreachDetailsSchema.nullable(),
  contextOnly: z.literal(true),
  preparationStartsSending: z.literal(false),
});
const labels = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn invitation",
  gmail: "Email",
  sms: "SMS",
};

export function outreachForm(
  senders: AgentToolDataMap["senders.inspect"],
  defaults: OutreachDefaults,
) {
  const mailboxes = senders.emailAvailable
    ? senders.mailboxes.filter(
        (m) => m.status === "healthy" && m.sendEnabled && m.canSend && !m.needsReauthorization,
      )
    : [];
  // Social channels remain available for planning; preflight owns provider setup.
  const channels: Array<z.infer<typeof channel>> = ["instagram", "facebook", "linkedin"];
  if (mailboxes.length) channels.push("gmail");
  if (
    senders.sms?.available &&
    senders.sms.configured &&
    senders.sms.enabled &&
    senders.sms.phoneNumber
  )
    channels.push("sms");
  const properties: ElicitRequestFormParams["requestedSchema"]["properties"] = {
    channel: {
      type: "string",
      title: "Outreach channel",
      oneOf: channels.map((c) => ({ const: c, title: labels[c] })),
      ...(defaults.channel && channels.includes(defaults.channel)
        ? { default: defaults.channel }
        : {}),
    },
    name: {
      type: "string",
      title: "Campaign name",
      minLength: 1,
      maxLength: 120,
      ...(defaults.name ? { default: defaults.name } : {}),
    },
    body: {
      type: "string",
      title: "Message or invitation note",
      minLength: 1,
      maxLength: 5000,
      ...(defaults.body ? { default: defaults.body } : {}),
    },
    dailyCap: {
      type: "integer",
      title: "Daily sending cap",
      minimum: 1,
      maximum: 1000,
      default: defaults.dailyCap ?? 20,
    },
  };
  if (mailboxes.length) {
    properties.subject = {
      type: "string",
      title: "Email subject (email only)",
      maxLength: 200,
      ...(defaults.subject ? { default: defaults.subject } : {}),
    };
    properties.mailboxId = {
      type: "string",
      title: "Sending mailbox (email only)",
      oneOf: mailboxes.map((m) => ({ const: m.id, title: m.emailAddress })),
      ...(mailboxes.some((m) => m.id === defaults.mailboxId)
        ? { default: defaults.mailboxId }
        : {}),
    };
  }
  return {
    channels,
    mailboxes,
    schema: {
      type: "object" as const,
      properties,
      required: ["channel", "name", "body", "dailyCap"],
      additionalProperties: false,
    },
  };
}

function completed(
  status: z.infer<typeof outputSchema>["status"],
  details: OutreachDetails | null,
  text: string,
) {
  return {
    content: [{ type: "text" as const, text }],
    structuredContent: {
      status,
      details,
      contextOnly: true as const,
      preparationStartsSending: false as const,
    },
  };
}

export async function collectOutreachDetails(
  client: AgentInvoker,
  defaults: OutreachDefaults,
  ctx: ServerContext,
) {
  const envelope = ctx.mcpReq.envelope as Record<string, unknown> | undefined;
  const capabilities = envelope?.[CLIENT_CAPABILITIES_META_KEY] as ClientCapabilities | undefined;
  const formCapability = capabilities?.elicitation?.form;
  if (!formCapability || envelope?.[PROTOCOL_VERSION_META_KEY] !== "2026-07-28")
    return completed(
      "unsupported",
      null,
      "This host does not support forms. Ask for campaign name, channel, message and daily cap in chat; inspect senders_inspect before selecting a mailbox. No data was saved or sent.",
    );
  // Every round reads current sender eligibility. Client answers and state never grant access.
  const receipt = await client.invoke("senders.inspect", {}, { signal: ctx.mcpReq.signal });
  if (!receipt.ok || !receipt.data)
    return {
      ...completed(
        "unavailable",
        null,
        "Sender setup could not be inspected. Resolve the returned domain error before collecting outreach details.",
      ),
      isError: true,
      _meta: { "dmfaster/senderError": receipt.error },
    };
  const form = outreachForm(receipt.data as AgentToolDataMap["senders.inspect"], defaults);
  const answer = inputResponse(ctx.mcpReq.inputResponses, "outreach");
  if (answer.kind === "elicit" && answer.action !== "accept")
    return completed(
      "cancelled",
      null,
      "Outreach details were cancelled. No campaign was saved or sent.",
    );
  if (answer.kind === "elicit" && answer.action === "accept") {
    const parsed = outreachDetailsSchema.safeParse(answer.content);
    if (!parsed.success)
      throw new Error("Invalid outreach details. Collect the requested fields again.");
    const details = parsed.data;
    if (!form.channels.includes(details.channel))
      throw new Error("This outreach channel is no longer available. Inspect sender setup again.");
    if (
      details.channel === "gmail" &&
      (!details.subject?.trim() || !form.mailboxes.some((m) => m.id === details.mailboxId))
    )
      throw new Error("Email needs a subject and a currently eligible sending mailbox.");
    // Ignore mailbox/subject fields for other channels rather than carrying hidden form state.
    if (details.channel !== "gmail") {
      delete details.subject;
      delete details.mailboxId;
    }
    return completed(
      "collected",
      details,
      "Outreach details collected for review only. Inspect the intended audience and follow campaign_draft_prepare or the exact audience_preview/campaign_prepare workflow. These answers do not authorize saving, launching or sending; recipient permission and provider limits still require their normal checks.",
    );
  }
  const extended = capabilities?.extensions?.["openai/elicitation"] as
    | { form?: unknown }
    | undefined;
  return inputRequired({
    inputRequests: {
      outreach: inputRequired.elicit({
        message:
          "Choose outreach details for review. This form does not save a campaign or send messages.",
        requestedSchema: extended?.form ? { type: "object", properties: {} } : form.schema,
        ...(extended?.form
          ? { _meta: { "openai/elicitation": { requestedSchema: form.schema } } }
          : {}),
      }),
    },
  });
}

export function registerOutreachDetails(
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
    OUTREACH_DETAILS_TOOL_NAME,
    {
      title: "Collect outreach details",
      description:
        "Use when the user wants to choose a channel, campaign name, message, daily cap or email mailbox in a native form. Returns typed details for review only. It never saves, spends credits, launches or sends. Headless hosts receive a chat fallback. Requires the same owner and sending:read permission as senders_inspect. Keep audience revisions and idempotency keys in the normal draft workflow.",
      inputSchema: z.object({ defaults: outreachDetailsSchema.partial().optional() }).strict(),
      outputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
      _meta: { ...oauthToolMetadata(auth, ["sending:read"]), ui: { visibility: ["model"] } },
    },
    async ({ defaults }, ctx) => {
      try {
        return await collectOutreachDetails(client, defaults ?? {}, ctx);
      } catch (error) {
        return { ...onFailure(error), ...oauthFailureMetadata(error, auth, ["sending:read"]) };
      }
    },
  );
}
