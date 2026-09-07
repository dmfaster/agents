import type { components } from "./generated/api.ts";

import { AGENT_TOOL_NAMES } from "./generated/tools.ts";
export {
  AGENT_TOOL_NAMES,
  AGENT_TOOL_POLICIES,
  AGENT_TOOL_SCOPES,
  AGENT_OWNER_ONLY_TOOLS,
  AGENT_TOOL_DEFINITIONS,
} from "./generated/tools.ts";
export type { AgentToolInputMap, AgentToolDataMap } from "./generated/tool-types.ts";

export type AgentToolName = components["schemas"]["AgentToolName"];
export type AgentToolPolicy = components["schemas"]["AgentToolPolicy"];
export type CampaignStatus = components["schemas"]["CampaignStatus"];

export type AgentToolEvidence = components["schemas"]["AgentToolEvidence"];
export type AgentToolConsistency = components["schemas"]["AgentToolConsistency"];
export type AgentToolError = components["schemas"]["AgentToolError"];
export type AgentCampaignState = components["schemas"]["AgentCampaignState"];
export type AgentBusinessProfile = components["schemas"]["AgentBusinessProfile"];
export type AgentCampaignBrief = components["schemas"]["AgentCampaignBrief"];
export type AgentIndustryResolution = components["schemas"]["AgentIndustryResolution"];
export type AgentHarnessResult = components["schemas"]["AgentHarnessResult"];
export type AgentActionAuthorization = components["schemas"]["AgentActionAuthorization"];

export type AgentToolResult<Data = unknown> = Omit<
  components["schemas"]["AgentToolResultBase"],
  "tool" | "data"
> & {
  tool: AgentToolName;
  data: Data | null;
};

export function isAgentToolName(value: string): value is AgentToolName {
  return (AGENT_TOOL_NAMES as readonly string[]).includes(value);
}
