import type { AgentToolInputMap, AgentToolName, AgentToolResult } from "@dmfaster/sdk";
import { z } from "zod";

import { AGENT_TOOL_NAMES, AGENT_TOOL_DEFINITIONS } from "@dmfaster/sdk";
import {
  AGENT_INPUT_SCHEMAS,
  ResourceIdSchema,
  AgentCampaignStateSchema,
} from "./generated/input-schemas.ts";

export const MCP_AGENT_TOOL_NAMES = AGENT_TOOL_NAMES.map(
  (name) => AGENT_TOOL_DEFINITIONS[name].mcp.name,
);

export const MCP_PRESENTATION_TOOL_NAMES = ["campaign_workspace"] as const;

export const MCP_TOOL_NAMES = [...MCP_AGENT_TOOL_NAMES, ...MCP_PRESENTATION_TOOL_NAMES] as const;

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
  ): Promise<AgentToolResult>;
};

export type AgentToolDefinition = {
  name: McpAgentToolName;
  title: string;
  description: string;
  inputSchema: z.ZodType;
  annotations: AgentToolAnnotations;
  call(input: unknown): Promise<AgentToolResult>;
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
    return {
      ...metadata,
      inputSchema,
      call: async (value: unknown) =>
        client.invoke(tool, inputSchema.parse(value) as AgentToolInputMap[typeof tool]),
    };
  });
}

export function registerAgentToolDefinitions(registrar: AgentToolRegistrar, client: AgentInvoker) {
  for (const tool of createAgentToolDefinitions(client)) registrar.register(tool);
}
