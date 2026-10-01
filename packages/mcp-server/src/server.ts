import {
  createDmfasterClient,
  DmfasterSdkError,
  AGENT_TOOL_NAMES,
  AGENT_TOOL_DEFINITIONS,
  AGENT_TOOL_SCOPES,
  type DmfasterClientOptions,
} from "@dmfaster/sdk";
import {
  DEFAULT_DMFASTER_API_URL,
  AgentAuthError,
  getRemoteAuthStatus,
  resolveLocalAuthConfig,
  type CredentialStore,
} from "@dmfaster/local-auth";
import type { McpServer } from "@modelcontextprotocol/server";
import { serveStdio, type ServeStdioOptions } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
import type { AgentInvoker } from "./tools.ts";
import { createDmfasterMcpCore, toolFailure } from "./core.ts";
import { localConnectionSchema } from "./presentation-schemas.ts";
export { MCP_SERVER_VERSION, MCP_SERVER_INSTRUCTIONS, toolFailure } from "./core.ts";
export const DEFAULT_MCP_API_URL = DEFAULT_DMFASTER_API_URL;

type McpAuthInput = {
  homeDirectory?: string;
  credentialStore?: CredentialStore;
  fetch?: typeof globalThis.fetch;
};

export async function inspectMcpConnection(env: NodeJS.ProcessEnv, input: McpAuthInput = {}) {
  const config = await resolveLocalAuthConfig({
    env,
    ...(input.homeDirectory ? { homeDirectory: input.homeDirectory } : {}),
    ...(input.credentialStore ? { credentialStore: input.credentialStore } : {}),
  });
  const common = { baseUrl: config.baseUrl, credentialSource: config.tokenSource };
  if (!config.token) {
    return {
      ...common,
      status: config.credentialStoreError ? "store_unavailable" : "not_authenticated",
      actionRequired:
        config.credentialStoreError || "Run `dmfaster auth login` and approve the browser request.",
    };
  }
  try {
    const identity = await getRemoteAuthStatus({
      baseUrl: config.baseUrl,
      token: config.token,
      ...(input.fetch ? { fetch: input.fetch } : {}),
    });
    const grantedScopes = new Set(identity.credential.scopes);
    const scopeEligibleTools = AGENT_TOOL_NAMES.filter((tool) =>
      AGENT_TOOL_SCOPES[tool].every((scope) => grantedScopes.has(scope)),
    ).map((tool) => ({ tool, mcpTool: AGENT_TOOL_DEFINITIONS[tool].mcp.name }));
    const scopeBlockedTools = AGENT_TOOL_NAMES.flatMap((tool) => {
      const missingScopes = AGENT_TOOL_SCOPES[tool].filter((scope) => !grantedScopes.has(scope));
      return missingScopes.length ? [{ tool, missingScopes }] : [];
    });
    return {
      ...common,
      status: "authenticated",
      workspace: identity.workspace,
      user: identity.user,
      credential: identity.credential,
      scopeEligibleTools,
      scopeBlockedTools,
      authorizationNote:
        "Scope eligibility is advisory. Workspace role, plan and action preconditions are checked by each tool.",
    };
  } catch (error) {
    const invalid =
      error instanceof AgentAuthError &&
      (error.code === "unauthorized" || error.code === "workspace_access_denied");
    return {
      ...common,
      status: invalid ? "invalid" : "unavailable",
      actionRequired: invalid
        ? "Run `dmfaster auth logout`, then `dmfaster auth login` to reconnect."
        : "Retry connection_status when DM Faster is reachable.",
      error: {
        code: error instanceof AgentAuthError ? error.code : "connection_check_failed",
        message: error instanceof Error ? error.message : "Connection check failed.",
      },
    };
  }
}

function registerConnectionStatus(server: McpServer, env: NodeJS.ProcessEnv, input: McpAuthInput) {
  server.registerTool(
    "connection_status",
    {
      title: "Check DM Faster connection",
      description:
        "Check local authentication and the selected workspace without exposing the credential. Use when setup or permissions are unclear.",
      inputSchema: z.object({}).strict(),
      outputSchema: localConnectionSchema,
      _meta: { "openai/widgetAccessible": true },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      try {
        const status = await inspectMcpConnection(env, input);
        return {
          content: [
            {
              type: "text" as const,
              text:
                "workspace" in status
                  ? `Connected to ${status.workspace.name}. ${status.scopeEligibleTools.length} tools match this credential's scopes; ${status.scopeBlockedTools.length} need additional scopes. Role and plan checks still apply.`
                  : status.actionRequired,
            },
          ],
          structuredContent: status,
        };
      } catch (error) {
        return toolFailure(error);
      }
    },
  );
}

export function createDmfasterMcpServer(input: {
  client: AgentInvoker;
  env?: NodeJS.ProcessEnv;
  auth?: McpAuthInput;
}) {
  return createDmfasterMcpCore({
    client: input.client,
    registerLocalConnection(server) {
      registerConnectionStatus(server, input.env ?? process.env, input.auth ?? {});
    },
  });
}

export type DmfasterStdioOptions = Omit<ServeStdioOptions, "legacy">;

export function serveDmfasterStdio(
  client: AgentInvoker,
  options: DmfasterStdioOptions = {},
  connection: { env?: NodeJS.ProcessEnv; auth?: McpAuthInput } = {},
) {
  return serveStdio(() => createDmfasterMcpServer({ client, ...connection }), {
    ...options,
    legacy: "reject",
  });
}

export async function resolveMcpClientOptions(
  env: NodeJS.ProcessEnv,
  input: { homeDirectory?: string; credentialStore?: CredentialStore } = {},
): Promise<DmfasterClientOptions> {
  const config = await resolveLocalAuthConfig({
    env,
    ...(input.homeDirectory ? { homeDirectory: input.homeDirectory } : {}),
    ...(input.credentialStore ? { credentialStore: input.credentialStore } : {}),
  });
  if (!config.token) {
    throw new DmfasterSdkError(
      config.credentialStoreError ||
        "DM Faster is not signed in. Run `dmfaster auth login`, or set DMFASTER_TOKEN for headless CI.",
      "not_authenticated",
    );
  }
  const timeoutSource = env.DMFASTER_TIMEOUT_MS?.trim();
  const timeoutMs = timeoutSource ? Number(timeoutSource) : undefined;
  return {
    baseUrl: config.baseUrl,
    token: config.token,
    ...(timeoutMs === undefined ? {} : { timeoutMs }),
  };
}

export function createLocalMcpClient(
  env: NodeJS.ProcessEnv = process.env,
  input: McpAuthInput = {},
): AgentInvoker {
  return {
    async invoke(tool, toolInput) {
      const options = await resolveMcpClientOptions(env, input);
      return createDmfasterClient({
        ...options,
        ...(input.fetch ? { fetch: input.fetch } : {}),
      }).invoke(tool, toolInput);
    },
  };
}

export async function startStdioServer(
  env: NodeJS.ProcessEnv = process.env,
  input: McpAuthInput = {},
) {
  return serveDmfasterStdio(createLocalMcpClient(env, input), {}, { env, auth: input });
}
