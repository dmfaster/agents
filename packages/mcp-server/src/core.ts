import { projectConnectionStatus } from "./connection-view.ts";
import {
  agentErrorRecovery,
  compactHeartbeatResult,
  AGENT_TOOL_NAMES,
  AGENT_TOOL_DEFINITIONS,
  AGENT_TOOL_SCOPES,
  DmfasterHttpError,
  DmfasterAdapterError,
  DmfasterSdkError,
  type AgentToolResult,
} from "@dmfaster/sdk";
import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import {
  createAgentToolDefinitions,
  MCP_LOCAL_TOOL_NAMES,
  type AgentInvoker,
  type AgentToolDefinition,
} from "./tools.ts";
import { mcpToolDescription } from "./tool-guidance.ts";
import { mcpCommerceClient } from "./commerce-policy.ts";
import { cachedMcpSchema } from "./cached-schema.ts";

import { hostedConnectionSchema } from "./connection-schemas.ts";
import { oauthToolMetadata, oauthFailureMetadata, type HostedAuth } from "./hosted-auth.ts";

export const MCP_SERVER_VERSION = "2.9.0";
export const MCP_SERVER_INSTRUCTIONS =
  "DM Faster: check connection_status. Use exact counts, returned IDs/versions and stable retry keys. Discover tools and use their dispatchTool: tools_read for reads, tools_write for non-destructive writes. Existing grants plus explicit instructions need no repeat approval. Selections are not consent; drafts never send. Follow action workflows and verify outcomes. Never expose credentials or operate approval pages. With feedback:write, report observed friction using feedback_submit; continue the task.";

const domainByMcpName = new Map<string, (typeof AGENT_TOOL_NAMES)[number]>(
  AGENT_TOOL_NAMES.map((name) => [AGENT_TOOL_DEFINITIONS[name].mcp.name, name]),
);
function catalogSuccessor(name: string) {
  const domain = domainByMcpName.get(name);
  return domain
    ? (AGENT_TOOL_DEFINITIONS[domain].mcp as { deprecatedSuccessor?: string })
        .deprecatedSuccessor || ""
    : "";
}
function asStructuredContent(result: AgentToolResult) {
  return result as unknown as Record<string, unknown>;
}

function toolResult(
  result: AgentToolResult,
  tool: string,
  input: unknown,
  resultMetadata?: () => Record<string, unknown>,
) {
  const compact = compactHeartbeatResult(tool, input, result);
  if (compact)
    return {
      content: [],
      structuredContent: compact,
    };

  const metadata = safeResultMetadata(resultMetadata);
  return {
    ...(metadata ? { _meta: metadata } : {}),
    content: [{ type: "text" as const, text: JSON.stringify(result) }],
    structuredContent: asStructuredContent(result),
    ...(result.ok ? {} : { isError: true }),
  };
}

function safeResultMetadata(read?: () => Record<string, unknown>) {
  try {
    return read?.();
  } catch {
    return undefined;
  }
}

function editDistance(left: string, right: string) {
  if (Math.abs(left.length - right.length) > 4) return 5;
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= right.length; j += 1)
      current[j] = Math.min(
        previous[j]! + 1,
        current[j - 1]! + 1,
        previous[j - 1]! + (left[i - 1] === right[j - 1] ? 0 : 1),
      );
    previous = current;
  }
  return previous[right.length]!;
}

function catalogToolNames(): string[] {
  return [
    ...AGENT_TOOL_NAMES.map((name) => AGENT_TOOL_DEFINITIONS[name].mcp.name),
    ...MCP_LOCAL_TOOL_NAMES,
  ];
}

/** Closest catalog names for a misspelling. Distance 0 keeps dotted aliases such as company.inspect. */
export function suggestMcpToolNames(typed: string, limit = 3) {
  const needle = typed.toLowerCase().replace(/[.\s-]+/g, "_");
  return catalogToolNames()
    .map((name) => ({
      name,
      distance: editDistance(needle, name.toLowerCase().replace(/[.\s-]+/g, "_")),
    }))
    .filter((item) => item.distance <= 2)
    .sort((left, right) => left.distance - right.distance || left.name.localeCompare(right.name))
    .slice(0, limit)
    .map((item) => item.name);
}

function unknownToolFailure(tool: string) {
  const suggestions = suggestMcpToolNames(tool).filter((name) => name !== tool);
  const shown = tool.slice(0, 80);
  const body = {
    error: {
      code: "unknown_tool",
      message: suggestions.length
        ? `Unknown tool "${shown}". Did you mean ${suggestions.join(" or ")}?`
        : `Unknown tool "${shown}". It is not in the catalog.`,
      retryable: false,
      suggestions,
      nextAction: suggestions.length
        ? `Call ${suggestions[0]} or tools_discover. This is not a missing scope.`
        : "Use tools_discover to list tool names. This is not a missing scope.",
      docsUrl: "https://dmfaster.com/docs/agents#errors-unknown_tool",
    },
  };
  return {
    content: [{ type: "text" as const, text: JSON.stringify(body) }],
    structuredContent: body,
    isError: true,
  };
}

export function toolFailure(error: unknown) {
  const httpError = error instanceof DmfasterHttpError ? error : null;
  const transportError = httpError ?? (error instanceof DmfasterAdapterError ? error : null);
  const code = error instanceof DmfasterSdkError ? error.code : "mcp_tool_failed";
  const recovery = agentErrorRecovery(code, transportError?.retryable === true);
  const body = {
    error: {
      code,
      message: error instanceof Error ? error.message : "DM Faster tool execution failed.",
      retryable: transportError?.retryable === true,
      nextAction: httpError?.nextAction || recovery.nextAction,
      docsUrl: httpError?.docsUrl || recovery.docsUrl,
      ...(transportError?.requestId ? { requestId: transportError.requestId } : {}),
      ...(typeof httpError?.retryAfterSeconds === "number"
        ? { retryAfterSeconds: httpError.retryAfterSeconds }
        : {}),
      ...(httpError?.details ? { details: httpError.details } : {}),
      ...(httpError?.requiredScope ? { requiredScope: httpError.requiredScope } : {}),
      ...(httpError?.reason ? { reason: httpError.reason } : {}),
      ...(httpError?.setupUrl ? { setupUrl: httpError.setupUrl } : {}),
      ...(httpError?.requiredConnection
        ? { requiredConnection: httpError.requiredConnection }
        : {}),
      ...(httpError?.blockedUntil ? { blockedUntil: httpError.blockedUntil } : {}),
      ...(typeof httpError?.retryAfterMs === "number"
        ? { retryAfterMs: httpError.retryAfterMs }
        : {}),
      ...(httpError ? { status: httpError.status } : {}),
    },
  };
  return {
    content: [{ type: "text" as const, text: JSON.stringify(body, null, 2) }],
    structuredContent: body,
    isError: true,
  };
}

function authenticatedToolFailure(
  error: unknown,
  auth: HostedAuth | undefined,
  scopes: readonly string[],
  resultMetadata?: () => Record<string, unknown>,
) {
  const failure = { ...toolFailure(error), ...oauthFailureMetadata(error, auth, scopes) };
  const metadata = safeResultMetadata(resultMetadata);
  return metadata ? { ...failure, _meta: { ...metadata, ...failure._meta } } : failure;
}

function registerWithMcpServer(
  server: McpServer,
  definition: AgentToolDefinition,
  auth?: HostedAuth,
  resultMetadata?: () => Record<string, unknown>,
  fullOutputSchemas = false,
) {
  const domainName = domainByMcpName.get(definition.name)!;
  const scopes = AGENT_TOOL_SCOPES[domainName];
  if (auth && !scopes.every((scope) => auth.grantedScopes.includes(scope))) return;
  return server.registerTool(
    definition.name,
    {
      title: definition.title,
      description: `${definition.name}: ${definition.title}. ${definition.description}`.slice(
        0,
        300,
      ),
      inputSchema: cachedMcpSchema(definition.inputSchema),
      ...(fullOutputSchemas ? { outputSchema: cachedMcpSchema(definition.outputSchema) } : {}),
      annotations: definition.annotations,
      _meta: oauthToolMetadata(auth, scopes),
    },
    async (input, context) => {
      try {
        const response = await definition.call(input, { signal: context.mcpReq.signal });
        definition.outputSchema.parse(response);
        return toolResult(response, domainName, input, resultMetadata);
      } catch (error) {
        return authenticatedToolFailure(error, auth, scopes, resultMetadata);
      }
    },
  );
}

export function createDmfasterMcpCore(input: {
  client: AgentInvoker;
  /** Include full generated output schemas for clients that need contract introspection. */
  fullOutputSchemas?: boolean;
  hostedAuth?: HostedAuth;
  hostedConnection?: (
    view?: "summary" | "names" | "full" | "identity",
  ) => Promise<Record<string, unknown>>;
  toolBlockers?: () => Promise<Record<string, { code: string; nextAction: string }>>;
  registerLocalConnection?: (server: McpServer) => void;
  registerHostedEvents?: (server: McpServer) => void;
  resultMetadata?: () => Record<string, unknown>;
  catalogProfile?: "compact" | "full";
}) {
  const client = mcpCommerceClient(input.client);
  const server = new McpServer(
    {
      name: "dmfaster",
      version: MCP_SERVER_VERSION,
    },
    {
      instructions: MCP_SERVER_INSTRUCTIONS,
      // Hosted requests are capped at 128 KiB; also bound collection validation
      // before schemas can expand a small, densely packed JSON argument tree.
      ...(input.hostedAuth ? { maxToolInputElements: 10_000 } : {}),
    },
  );
  server.registerResource(
    "agent-guide",
    "dmfaster://docs/agents",
    { title: "Agent tools and compact profiles", mimeType: "text/markdown" },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/markdown",
          text: "Use tools_discover(query, includeSchema:true) to find any scoped tool; the returned dispatchTool({tool:MCP_name,input:{...}}) invokes it with the same validation, authorization and receipts as the named tool. The compact catalog keeps the ICP-to-draft workflow directly available. Explicit dryRun is required for sends; disabled drafts never send. Use workspace_sandbox_create for rehearsal. Request view:full for expanded responses; include:[metrics] for canonical counts and definitions. commitments_list requires calls:transcripts:read as well as its listed scope. All timestamps accept offsets. Preserve opaque IDs, versions and retry keys. Connection grants never expand automatically.",
        },
      ],
    }),
  );
  input.registerHostedEvents?.(server);
  const allDefinitions = createAgentToolDefinitions(client);
  let activeAuth = input.hostedAuth;
  const permitted = () =>
    allDefinitions.filter((definition) => {
      const domain = domainByMcpName.get(definition.name)!;
      return (
        !activeAuth ||
        AGENT_TOOL_SCOPES[domain].every((scope) => activeAuth!.grantedScopes.includes(scope))
      );
    });
  let definitions = permitted();
  const coreOrder = [
    "prospect_query",
    "industry_lookup",
    "company_inspect",
    "companies_search",
    "prospecting_preview",
    "campaign_draft_plan",
    "conversations_list",
    "conversation_inspect",
    "copy_approval_request",
    "campaign_draft_readiness",
    "work_queue_list",
  ];
  const coreNames = new Set(coreOrder);
  const registered = new Map<string, NonNullable<ReturnType<typeof registerWithMcpServer>>>();
  const synchronizeCatalog = () => {
    definitions = permitted();
    const visible = definitions
      .filter((d) => !catalogSuccessor(d.name))
      .filter((d) => input.catalogProfile === "full" || coreNames.has(d.name))
      .sort((left, right) => {
        const leftIndex = coreOrder.indexOf(left.name);
        const rightIndex = coreOrder.indexOf(right.name);
        return (
          (leftIndex < 0 ? coreOrder.length : leftIndex) -
          (rightIndex < 0 ? coreOrder.length : rightIndex)
        );
      });
    for (const [name, tool] of registered)
      if (!visible.some((d) => d.name === name)) {
        tool.remove();
        registered.delete(name);
      }
    for (const definition of visible)
      if (!registered.has(definition.name)) {
        const tool = registerWithMcpServer(
          server,
          definition,
          activeAuth,
          input.resultMetadata,
          input.fullOutputSchemas,
        );
        if (tool) registered.set(definition.name, tool);
      }
  };
  synchronizeCatalog();
  server.registerTool(
    "tools_discover",
    {
      title: "Discover scoped DM Faster tools",
      description:
        "Find tools by name or task. An empty query returns the start-here list. reply, inbox, lead, ICP and prospects rank those tools first. includeSchema adds schemas for up to 3 tools. Pass nextOffset as offset with the same query to continue. Use each result's dispatchTool with {tool, input}.",
      inputSchema: z
        .object({
          query: z.string().max(200).optional(),
          limit: z.number().int().min(1).max(30).optional(),
          offset: z.number().int().nonnegative().optional(),
          includeSchema: z.boolean().optional(),
        })
        .strict(),
      outputSchema: z
        .object({
          items: z.array(z.record(z.string(), z.unknown())),
          total: z.number().int(),
          hasMore: z.boolean(),
          nextOffset: z.number().int().nonnegative().nullable(),
        })
        .strict(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ query, limit, includeSchema, offset = 0 }) => {
      const blockers = (await input.toolBlockers?.()) || {};
      const stop = new Set(["a", "an", "the", "of", "for", "to", "and", "or", "option", "options"]);
      const terms = (query || "")
        .toLowerCase()
        .split(/\s+/)
        .filter((term) => term.length > 1 && !stop.has(term));
      // An exact tool name ("company_inspect" or "company.inspect") always ranks first,
      // then name hits rank above description hits. An empty query is the start-here list.
      // replies_list stays the deprecated alias of conversations_list.
      const asName = (value: string) => value.toLowerCase().replace(/[\s.-]+/g, "_");
      const exact = asName((query || "").trim());
      const successorName = catalogSuccessor(exact);
      const discoverable = successorName
        ? definitions.filter((definition) => definition.name === successorName)
        : definitions.filter((definition) => !catalogSuccessor(definition.name));
      const startHere = [
        "prospect_query",
        "industry_lookup",
        "company_inspect",
        "prospecting_preview",
        "campaign_draft_plan",
        "conversations_list",
        "conversation_inspect",
        "work_queue_list",
      ];
      const useWhen: Record<string, string> = {
        prospect_query: "Turn a plain-language ICP into an exact company count.",
        industry_lookup: "Resolve an industry word to TOL codes.",
        company_inspect: "Read one company profile by companyKey.",
        prospecting_preview: "See who is reachable and the channel counts.",
        campaign_draft_plan: "Dry-run a disabled campaign for that audience.",
        conversations_list: "Find inbox threads that need a reply.",
        conversation_inspect: "Read one inbox thread.",
        work_queue_list: "Rank the replies that matter now.",
      };
      const intents: Record<string, readonly string[]> = {
        reply: ["conversations_list", "conversation_inspect", "work_queue_list"],
        replies: ["conversations_list", "conversation_inspect", "work_queue_list"],
        replied: ["conversations_list", "conversation_inspect", "work_queue_list"],
        inbox: ["conversations_list", "conversation_inspect", "work_queue_list"],
        lead: ["prospect_query", "company_inspect", "prospecting_preview"],
        leads: ["prospect_query", "company_inspect", "prospecting_preview"],
        icp: ["prospect_query", "industry_lookup", "prospecting_preview", "campaign_draft_plan"],
        prospect: ["prospect_query", "prospecting_preview", "company_inspect"],
        prospects: ["prospect_query", "prospecting_preview", "company_inspect"],
      };
      // A reply word plus "draft" asks for a reply draft, not a campaign draft.
      const replyDraft =
        terms.includes("draft") &&
        terms.some((term) => ["reply", "replies", "respond", "answer"].includes(term));
      const mergeLists =
        terms.some((term) => ["merge", "combine"].includes(term)) &&
        terms.some((term) => ["list", "lists"].includes(term));
      // Match common customer requests even when they don't use our tool names.
      const words = (query || "").toLowerCase().match(/[a-z0-9]+/g) || [];
      const has = (...values: string[]) => words.some((word) => values.includes(word));
      const inboxMessages =
        has("unread") && has("message", "messages", "conversation", "conversations");
      const senderStatus =
        has("sender", "senders") && has("connected", "connection", "status", "check");
      const creditBalance =
        has("credit", "credits") &&
        (words.length === 1 || has("remaining", "remain", "left", "balance", "available"));
      const pauseCampaign = has("pause", "stop") && has("campaign", "campaigns");
      const findCompanies =
        has("find", "search", "finds") &&
        has("company", "companies", "business", "businesses", "shopify", "store", "stores") &&
        !mergeLists &&
        !replyDraft &&
        !has("reply", "replies", "replied", "unread");
      const metaAdsCompanies =
        findCompanies && has("facebook", "meta") && has("ads", "advertising");
      const ranked = discoverable
        .map((definition) => {
          const haystack =
            `${definition.name} ${definition.title} ${definition.description}`.toLowerCase();
          const intentIndex = terms.reduce((best, term) => {
            const index = (intents[term] || []).indexOf(definition.name);
            return index >= 0 ? Math.min(best, index) : best;
          }, 99);
          const score =
            (successorName || definition.name === exact ? 1000 : 0) +
            (intentIndex < 99 ? 200 - intentIndex : 0) +
            (mergeLists && definition.name === "list_merge" ? 300 : 0) +
            (replyDraft && definition.name === "conversation_draft_save" ? 300 : 0) +
            (inboxMessages && definition.name === "conversations_list" ? 400 : 0) +
            (senderStatus && definition.name === "senders_inspect" ? 400 : 0) +
            (creditBalance && definition.name === "leads_status" ? 400 : 0) +
            (pauseCampaign && definition.name === "campaign_pause_preflight" ? 400 : 0) +
            (findCompanies && definition.name === "prospect_query" ? 400 : 0) +
            (metaAdsCompanies && definition.name === "companies_search" ? 600 : 0) +
            terms.reduce(
              (total, term) =>
                total +
                (haystack.includes(term) ? 1 : 0) +
                (definition.name.includes(asName(term)) ? 1 : 0),
              0,
            );
          return { definition, score };
        })
        .filter((item) => !terms.length || item.score > 0)
        .sort(
          (left, right) =>
            right.score - left.score || left.definition.name.localeCompare(right.definition.name),
        )
        .map((item) => item.definition);
      const byName = new Map<string, (typeof discoverable)[number]>(
        discoverable.map((definition) => [definition.name, definition]),
      );
      const matches =
        terms.length || successorName
          ? ranked
          : startHere.flatMap((name) => {
              const definition = byName.get(name);
              return definition && !blockers[name] ? [definition] : [];
            });
      const items = matches
        .slice(offset, offset + Math.min(limit || 10, includeSchema ? 3 : 30))
        .map((d) => ({
          name: d.name,
          ...(useWhen[d.name] ? { useWhen: useWhen[d.name] } : {}),
          description:
            `${successorName ? `Replaces deprecated ${exact}. ` : ""}${d.title}. ${d.description}`.slice(
              0,
              300,
            ),
          annotations: d.annotations,
          dispatchTool:
            d.annotations.readOnlyHint === true
              ? "tools_read"
              : d.annotations.destructiveHint === false
                ? "tools_write"
                : "tools_call",
          ...(blockers[d.name] ? { blocker: blockers[d.name] } : {}),
          ...(includeSchema
            ? {
                inputSchema: d.inputSchema["~standard"].jsonSchema.input({
                  target: "draft-2020-12",
                }),
              }
            : {}),
        }));
      const hasMore = offset + items.length < matches.length;
      const result = {
        items,
        total: matches.length,
        hasMore,
        nextOffset: hasMore ? offset + items.length : null,
      };
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
        structuredContent: result,
      };
    },
  );
  for (const dispatcher of ["tools_read", "tools_write", "tools_call"] as const)
    server.registerTool(
      dispatcher,
      {
        title:
          dispatcher === "tools_read"
            ? "Read DM Faster data"
            : dispatcher === "tools_write"
              ? "Update DM Faster data"
              : "Call a scoped DM Faster tool",
        description: `Use tools_discover's dispatchTool. ${dispatcher === "tools_read" ? "Read-only tools only." : dispatcher === "tools_write" ? "Non-destructive write tools only." : "Compatibility dispatcher, including destructive actions."} Incompatible tools are rejected. Existing grants and explicit instructions need no repeat permission. Follow the tool's workflow; retain retry keys.`,
        inputSchema: z
          .object({ tool: z.string().min(1).max(120), input: z.record(z.string(), z.unknown()) })
          .strict(),
        outputSchema: z.record(z.string(), z.unknown()),
        annotations: {
          readOnlyHint: dispatcher === "tools_read",
          destructiveHint: dispatcher === "tools_call",
          idempotentHint: false,
          openWorldHint: true,
        },
      },
      async ({ tool, input: value }, context) => {
        const domain = domainByMcpName.get(tool);
        const scopes = domain ? AGENT_TOOL_SCOPES[domain] : [];
        const fail = (error: unknown) =>
          authenticatedToolFailure(error, activeAuth, scopes, input.resultMetadata);
        if (!domain) {
          if ((MCP_LOCAL_TOOL_NAMES as readonly string[]).includes(tool))
            return fail(
              new DmfasterSdkError(
                `Call ${tool} directly by name. tools_call only dispatches domain tools.`,
                "invalid_input",
              ),
            );
          return unknownToolFailure(tool);
        }
        const definition = definitions.find((d) => d.name === tool);
        if (!definition) {
          const missing = scopes.filter((scope) => !activeAuth?.grantedScopes.includes(scope));
          return fail(
            new DmfasterHttpError({
              status: 403,
              code: "insufficient_scope",
              retryable: false,
              responseBody: {},
              message: "This connection lacks the permissions required by this tool.",
              requiredScope: missing.join(" "),
              nextAction: `Reconnect DM Faster in your host and approve ${missing.join(" ")} to use this tool. No action was executed.`,
            }),
          );
        }
        const safeDispatcher =
          definition.annotations.readOnlyHint === true
            ? "tools_read"
            : definition.annotations.destructiveHint === false
              ? "tools_write"
              : "tools_call";
        if (dispatcher !== "tools_call" && dispatcher !== safeDispatcher)
          return fail(
            new DmfasterSdkError(
              `This tool requires ${safeDispatcher}. No action was executed.`,
              "invalid_input",
            ),
          );
        const parsedInput = definition.inputSchema.safeParse(value);
        if (!parsedInput.success)
          return fail(
            new DmfasterSdkError(
              `Invalid input for ${tool}: ${parsedInput.error.message}. Use tools_discover with includeSchema to inspect this tool's input. No action was executed.`,
              "invalid_input",
            ),
          );
        try {
          const result = await definition.call(value, { signal: context.mcpReq.signal });
          // Compact discovery never relaxes the canonical tool's response validation.
          definition.outputSchema.parse(result);
          return toolResult(result, domain, value, input.resultMetadata);
        } catch (error) {
          return fail(error);
        }
      },
    );
  if (input.hostedConnection) {
    const inspect = input.hostedConnection;
    server.registerTool(
      "connection_status",
      {
        title: "Check DM Faster connection",
        description: mcpToolDescription(
          "connection_status",
          "Check the signed-in account, selected workspace, and permissions of this hosted connection.",
          input.hostedAuth,
        ),
        inputSchema: z
          .object({ toolsView: z.enum(["summary", "names", "full", "identity"]).optional() })
          .strict(),
        outputSchema: hostedConnectionSchema,
        _meta: oauthToolMetadata(input.hostedAuth, []),
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
      },
      async ({ toolsView }) => {
        const identity = await inspect(toolsView);
        const scopes = (identity.credential as { scopes?: unknown } | undefined)?.scopes;
        if (
          activeAuth &&
          Array.isArray(scopes) &&
          scopes.every((s) => typeof s === "string") &&
          [...scopes].sort().join(" ") !== [...activeAuth.grantedScopes].sort().join(" ")
        ) {
          activeAuth = { ...activeAuth, grantedScopes: scopes };
          synchronizeCatalog();
          server.sendToolListChanged();
        }
        const status = projectConnectionStatus(identity, toolsView);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(status) }],
          structuredContent: status,
        };
      },
    );
  } else {
    input.registerLocalConnection?.(server);
  }
  return server;
}
