import {
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
  registerAgentToolDefinitions,
  type AgentInvoker,
  type AgentToolDefinition,
} from "./tools.ts";
import { registerCampaignWorkspace } from "./campaign-workspace.ts";
import { companyResultSummary } from "./company-result-summary.ts";
import { registerWorkspaceMentions } from "./workspace-mentions.ts";
import { registerOutreachDetails } from "./outreach-details.ts";
import { mcpToolDescription } from "./tool-guidance.ts";
import { mcpCommerceClient } from "./commerce-policy.ts";
import { cachedMcpSchema } from "./cached-schema.ts";

import { hostedConnectionSchema } from "./presentation-schemas.ts";
import { oauthToolMetadata, oauthFailureMetadata, type HostedAuth } from "./hosted-auth.ts";

export const MCP_SERVER_VERSION = "1.12.0";
export const MCP_SERVER_INSTRUCTIONS =
  "DM Faster prospecting and outreach. Check connection_status when access is unclear; use the narrowest tool. Use exact counts and returned IDs/revisions, retaining idempotency keys on retries. Selections and forms are context, not permission to save, spend or send. Private drafts never start sending. Act within granted access and explicit user instructions, follow each tool’s workflow, and inspect execution outcomes before claiming success. Never expose credentials or operate human approval pages.";

function asStructuredContent(result: AgentToolResult) {
  return result as unknown as Record<string, unknown>;
}

function toolResult(result: AgentToolResult) {
  return {
    content: [
      { type: "text" as const, text: companyResultSummary(result) ?? JSON.stringify(result) },
    ],
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
  const body = {
    error: {
      code: error instanceof DmfasterSdkError ? error.code : "mcp_tool_failed",
      message: error instanceof Error ? error.message : "DM Faster tool execution failed.",
      ...(typeof transportError?.retryable === "boolean"
        ? { retryable: transportError.retryable }
        : {}),
      ...(transportError?.requestId ? { requestId: transportError.requestId } : {}),
      ...(typeof httpError?.retryAfterSeconds === "number"
        ? { retryAfterSeconds: httpError.retryAfterSeconds }
        : {}),
      ...(httpError?.details ? { details: httpError.details } : {}),
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
) {
  const domainName = AGENT_TOOL_NAMES.find(
    (name) => AGENT_TOOL_DEFINITIONS[name].mcp.name === definition.name,
  )!;
  const scopes = AGENT_TOOL_SCOPES[domainName];
  server.registerTool(
    definition.name,
    {
      title: definition.title,
      description: mcpToolDescription(definition.name, definition.description, auth),
      inputSchema: cachedMcpSchema(definition.inputSchema),
      outputSchema: cachedMcpSchema(definition.outputSchema),
      annotations: definition.annotations,
      _meta: {
        ...oauthToolMetadata(auth, scopes),
        ui: { visibility: WIDGET_TOOLS.has(definition.name) ? ["model", "app"] : ["model"] },
        "openai/widgetAccessible": WIDGET_TOOLS.has(definition.name),
      },
    },
    async (input, context) => {
      try {
        const result = toolResult(await definition.call(input, { signal: context.mcpReq.signal }));
        const metadata = safeResultMetadata(resultMetadata);
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
  hostedAuth?: HostedAuth;
  hostedConnection?: () => Promise<Record<string, unknown>>;
  registerLocalConnection?: (server: McpServer) => void;
  registerHostedEvents?: (server: McpServer) => void;
  resultMetadata?: () => Record<string, unknown>;
}) {
  const client = mcpCommerceClient(input.client);
  const server = new McpServer(
    {
      name: "dmfaster",
      version: MCP_SERVER_VERSION,
    },
    {
      instructions: MCP_SERVER_INSTRUCTIONS,
    },
  );
  input.registerHostedEvents?.(server);
  registerAgentToolDefinitions(
    {
      register(definition) {
        registerWithMcpServer(server, definition, input.hostedAuth, input.resultMetadata);
      },
    },
    client,
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
        inputSchema: z.object({}).strict(),
        outputSchema: hostedConnectionSchema,
        _meta: { ...oauthToolMetadata(input.hostedAuth, []), "openai/widgetAccessible": true },
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
      },
      async () => {
        const status = await inspect();
        return {
          content: [{ type: "text" as const, text: JSON.stringify(status) }],
          structuredContent: status,
        };
      },
    );
  } else {
    input.registerLocalConnection?.(server);
  }
  registerCampaignWorkspace(server, client, toolFailure, input.hostedAuth);
  registerWorkspaceMentions(server, client, toolFailure, input.hostedAuth);
  registerOutreachDetails(server, client, toolFailure, input.hostedAuth);
  return server;
}
