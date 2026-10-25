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
  type AgentInvoker,
  type AgentToolDefinition,
} from "./tools.ts";
import { registerCampaignWorkspace } from "./campaign-workspace.ts";
import { registerWorkspaceMentions } from "./workspace-mentions.ts";
import { registerOutreachDetails } from "./outreach-details.ts";
import { mcpToolDescription } from "./tool-guidance.ts";
import { mcpCommerceClient } from "./commerce-policy.ts";
import { cachedMcpSchema } from "./cached-schema.ts";

import { hostedConnectionSchema } from "./presentation-schemas.ts";
import { oauthToolMetadata, oauthFailureMetadata, type HostedAuth } from "./hosted-auth.ts";

export const MCP_SERVER_VERSION = "2.7.3";
export const MCP_SERVER_INSTRUCTIONS =
  "DM Faster prospecting and outreach. Check connection_status; use narrow tools, exact counts and returned IDs/revisions. Retain retry keys. Selections are not consent. Drafts never send. Follow granted access, explicit user instructions and tool workflows; verify outcomes before claiming success. Never expose credentials or operate approval pages. With feedback:write, use feedback_submit for observed friction: concise context, no private data, one stable key per report. Continue the main task.";

function asStructuredContent(result: AgentToolResult) {
  return result as unknown as Record<string, unknown>;
}

function toolResult(result: AgentToolResult, tool: string, input: unknown) {
  const compact = compactHeartbeatResult(tool, input, result);
  if (compact)
    return {
      content: [],
      structuredContent: compact,
    };

  return {
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

// Only the tools used by the view are callable from its iframe. Domain authorization
// still runs on every call. Launch requires an explicit click and the same server
// preflight authorization used by chat; mounting or selecting never starts outreach.
const WIDGET_TOOLS = new Set([
  "companies_filters",
  "companies_search",
  "companies_evidence_results",
  "company_inspect",
  "campaigns_list",
  "campaign_inspect",
  "campaign_copy_inspect",
  "history_list",
  "replies_list",
  "sending_inspect",
  "senders_inspect",
  "campaign_validate",
  "audience_preview",
  "campaign_prepare",
  "campaign_launch_preflight",
  "companies_list_prepare",
  "companies_list_inspect",
  "campaign_draft_prepare",
  "campaign_launch",
]);

function registerWithMcpServer(
  server: McpServer,
  definition: AgentToolDefinition,
  auth?: HostedAuth,
  resultMetadata?: () => Record<string, unknown>,
  fullOutputSchemas = false,
) {
  const domainName = AGENT_TOOL_NAMES.find(
    (name) => AGENT_TOOL_DEFINITIONS[name].mcp.name === definition.name,
  )!;
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
      _meta: {
        ...oauthToolMetadata(auth, scopes),
        ui: { visibility: WIDGET_TOOLS.has(definition.name) ? ["model", "app"] : ["model"] },
        "openai/widgetAccessible": WIDGET_TOOLS.has(definition.name),
      },
    },
    async (input, context) => {
      try {
        const response = await definition.call(input, { signal: context.mcpReq.signal });
        definition.outputSchema.parse(response);
        const result = toolResult(response, domainName, input);
        const compactHeartbeat = domainName === "agent.heartbeat" && result.content.length === 0;
        const metadata = compactHeartbeat ? undefined : safeResultMetadata(resultMetadata);
        return metadata ? { ...result, _meta: metadata } : result;
      } catch (error) {
        const failure = { ...toolFailure(error), ...oauthFailureMetadata(error, auth, scopes) };
        const metadata = safeResultMetadata(resultMetadata);
        return metadata ? { ...failure, _meta: { ...metadata, ...failure._meta } } : failure;
      }
    },
  );
}

export function createDmfasterMcpCore(input: {
  client: AgentInvoker;
  /** Include full generated output schemas for clients that need contract introspection. */
  fullOutputSchemas?: boolean;
  hostedAuth?: HostedAuth;
  hostedConnection?: () => Promise<Record<string, unknown>>;
  registerLocalConnection?: (server: McpServer) => void;
  registerHostedEvents?: (server: McpServer) => void;
  resultMetadata?: () => Record<string, unknown>;
  uiTools?: boolean;
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
          text: "Use tools_discover(query, includeSchema:true) to find any scoped tool; tools_call({tool:MCP_name,input:{...}}) invokes it with the same validation, authorization and receipts as the named tool. The compact catalog keeps the ICP-to-draft workflow directly available. Explicit dryRun is required for sends; disabled drafts never send. Use workspace_sandbox_create for rehearsal. Request view:full for expanded responses; include:[metrics] for canonical counts and definitions. commitments_list requires calls:transcripts:read as well as its listed scope. All timestamps accept offsets. Preserve opaque IDs, versions and retry keys. Connection grants never expand automatically.",
        },
      ],
    }),
  );
  input.registerHostedEvents?.(server);
  const allDefinitions = createAgentToolDefinitions(client);
  let activeAuth = input.hostedAuth;
  const permitted = () =>
    allDefinitions.filter((definition) => {
      const domain = AGENT_TOOL_NAMES.find(
        (name) => AGENT_TOOL_DEFINITIONS[name].mcp.name === definition.name,
      )!;
      return (
        !activeAuth ||
        AGENT_TOOL_SCOPES[domain].every((scope) => activeAuth!.grantedScopes.includes(scope))
      );
    });
  let definitions = permitted();
  const coreOrder = [
    "prospect_query",
    "industry_lookup",
    "companies_search",
    "audience_preview",
    "prospecting_preview",
    "campaign_draft_plan",
    "copy_approval_request",
    "campaign_draft_readiness",
    "work_queue_list",
  ];
  const coreNames = new Set(coreOrder);
  const registered = new Map<string, NonNullable<ReturnType<typeof registerWithMcpServer>>>();
  const synchronizeCatalog = () => {
    definitions = permitted();
    const visible = definitions
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
        "Find available tools by name or task. Returns compact names; includeSchema adds exact input schemas for up to 3 tools. Call any returned name with tools_call. Missing permissions appear in connection_status.",
      inputSchema: z
        .object({
          query: z.string().max(200).optional(),
          limit: z.number().int().min(1).max(30).optional(),
          includeSchema: z.boolean().optional(),
        })
        .strict(),
      outputSchema: z
        .object({
          items: z.array(z.record(z.string(), z.unknown())),
          total: z.number().int(),
          hasMore: z.boolean(),
        })
        .strict(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ query, limit, includeSchema }) => {
      const stop = new Set(["a", "an", "the", "of", "for", "to", "and", "or", "option", "options"]);
      const terms = (query || "")
        .toLowerCase()
        .split(/\s+/)
        .filter((term) => term.length > 1 && !stop.has(term));
      // An exact tool name ("company_inspect" or "company.inspect") always ranks first,
      // then name hits rank above description hits.
      const asName = (value: string) => value.toLowerCase().replace(/[\s.-]+/g, "_");
      const exact = asName((query || "").trim());
      const matches = definitions
        .map((definition) => {
          const haystack =
            `${definition.name} ${definition.title} ${definition.description}`.toLowerCase();
          const score =
            (definition.name === exact ? 1000 : 0) +
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
      const items = matches.slice(0, Math.min(limit || 10, includeSchema ? 3 : 30)).map((d) => ({
        name: d.name,
        description: `${d.title}. ${d.description}`.slice(0, 300),
        annotations: d.annotations,
        ...(includeSchema
          ? {
              inputSchema: d.inputSchema["~standard"].jsonSchema.input({
                target: "draft-2020-12",
              }),
            }
          : {}),
      }));
      const result = { items, total: matches.length, hasMore: matches.length > items.length };
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
        structuredContent: result,
      };
    },
  );
  server.registerTool(
    "tools_call",
    {
      title: "Call a scoped DM Faster tool",
      description:
        "Call a tool by the MCP name from tools_discover or connection_status. Same input/output validation, permissions, explicit send approval and idempotency requirements as the named tool. Discover the exact input when unsure; do not guess resource IDs.",
      inputSchema: z
        .object({ tool: z.string().min(1).max(120), input: z.record(z.string(), z.unknown()) })
        .strict(),
      outputSchema: z.record(z.string(), z.unknown()),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async ({ tool, input: value }, context) => {
      const definition = definitions.find((d) => d.name === tool);
      if (!definition)
        return toolFailure(
          new Error(
            "Tool unavailable for this connection. Inspect connection_status for missing scopes.",
          ),
        );
      try {
        const result = await definition.call(value, { signal: context.mcpReq.signal });
        // Compact discovery never relaxes the canonical tool's response validation.
        definition.outputSchema.parse(result);
        const domain = AGENT_TOOL_NAMES.find(
          (name) => AGENT_TOOL_DEFINITIONS[name].mcp.name === tool,
        )!;
        return toolResult(result, domain, value);
      } catch (error) {
        return toolFailure(error);
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
          .object({ toolsView: z.enum(["summary", "names", "full"]).optional() })
          .strict(),
        outputSchema: hostedConnectionSchema,
        _meta: { ...oauthToolMetadata(input.hostedAuth, []), "openai/widgetAccessible": true },
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
      },
      async ({ toolsView }) => {
        const identity = await inspect();
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
  if (input.uiTools) {
    registerCampaignWorkspace(
      server,
      client,
      toolFailure,
      input.hostedAuth,
      input.fullOutputSchemas,
    );
    registerWorkspaceMentions(server, client, toolFailure, input.hostedAuth);
    registerOutreachDetails(server, client, toolFailure, input.hostedAuth);
  }
  return server;
}
