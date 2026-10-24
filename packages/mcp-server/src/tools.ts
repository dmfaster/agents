import type {
  AgentToolInputMap,
  AgentToolName,
  AgentToolResult,
  AgentToolCallOptions,
} from "@dmfaster/sdk";
import { z } from "zod";

import { AGENT_TOOL_NAMES, AGENT_TOOL_DEFINITIONS } from "@dmfaster/sdk";
import {
  AGENT_INPUT_SCHEMAS,
  ResourceIdSchema,
  AgentCampaignStateSchema,
} from "./generated/input-schemas.ts";
import { AGENT_OUTPUT_SCHEMAS } from "./generated/output-schemas.ts";

export const MCP_AGENT_TOOL_NAMES = AGENT_TOOL_NAMES.map(
  (name) => AGENT_TOOL_DEFINITIONS[name].mcp.name,
);

export const MCP_PRESENTATION_TOOL_NAMES = [
  "campaign_workspace",
  "companies_workspace",
  "workspace_open",
  "workspace_mentions",
  "outreach_details",
] as const;
export const MCP_LOCAL_TOOL_NAMES = ["connection_status", "tools_discover", "tools_call"] as const;

export const MCP_TOOL_NAMES = [
  ...MCP_AGENT_TOOL_NAMES,
  ...MCP_LOCAL_TOOL_NAMES,
  ...MCP_PRESENTATION_TOOL_NAMES,
] as const;

export type McpAgentToolName = (typeof MCP_AGENT_TOOL_NAMES)[number];
export type McpToolName = (typeof MCP_TOOL_NAMES)[number];

export type AgentToolAnnotations = {
  readOnlyHint: boolean;
  destructiveHint: boolean;
  idempotentHint: boolean;
  openWorldHint: boolean;
};

export type AgentInvoker = {
  invoke<Name extends AgentToolName>(
    tool: Name,
    input: AgentToolInputMap[Name],
    options?: AgentToolCallOptions,
  ): Promise<AgentToolResult>;
};

export type AgentToolDefinition = {
  name: McpAgentToolName;
  title: string;
  description: string;
  inputSchema: z.ZodType;
  outputSchema: z.ZodType;
  annotations: AgentToolAnnotations;
  call(input: unknown, options?: AgentToolCallOptions): Promise<AgentToolResult>;
};

export type AgentToolRegistrar = {
  register(definition: AgentToolDefinition): void;
};

export const campaignIdSchema = ResourceIdSchema;
export const campaignStateSchema = AgentCampaignStateSchema;

export function createAgentToolDefinitions(client: AgentInvoker): AgentToolDefinition[] {
  return AGENT_TOOL_NAMES.map((tool) => {
    const metadata = AGENT_TOOL_DEFINITIONS[tool].mcp;
    const inputSchema = AGENT_INPUT_SCHEMAS[tool];
    const outputSchema = AGENT_OUTPUT_SCHEMAS[tool];
    return {
      ...metadata,
      ...(tool === "instagram.extract.quote"
        ? {
            description:
              "Check whether the signed-in owner’s existing prepaid capacity covers an Instagram audience extraction. If not, explain that the current entitlement is insufficient. Does not offer prices, checkout, payment or collection.",
          }
        : {}),
      inputSchema,
      outputSchema,
      call: async (value: unknown, options?: AgentToolCallOptions) =>
        client.invoke(tool, inputSchema.parse(value) as AgentToolInputMap[typeof tool], options),
    };
  });
}

export function registerAgentToolDefinitions(registrar: AgentToolRegistrar, client: AgentInvoker) {
  for (const tool of createAgentToolDefinitions(client)) registrar.register(tool);
}
