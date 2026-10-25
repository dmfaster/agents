import assert from "node:assert/strict";
import test from "node:test";
import { AGENT_TOOL_DEFINITIONS, AGENT_TOOL_NAMES } from "@dmfaster/sdk";

test("the default catalog hides fifteen tools behind a live successor", () => {
  const retired = AGENT_TOOL_NAMES.filter(
    (name) => "deprecatedSuccessor" in AGENT_TOOL_DEFINITIONS[name].mcp,
  );
  assert.deepEqual(retired.map((name) => AGENT_TOOL_DEFINITIONS[name].mcp.name).sort(), [
    "audience_preview",
    "call_coaching_get",
    "call_transcript_get",
    "campaign_prepare",
    "campaign_validate",
    "companies_filters",
    "companies_knowledge_search",
    "companies_suggest",
    "copy_approval_cancel",
    "events_snapshot",
    "list_prepare",
    "pipeline_board",
    "pipeline_inspect",
    "replies_list",
    "workspace_briefing",
  ]);
  for (const name of retired) {
    const mcp = AGENT_TOOL_DEFINITIONS[name].mcp as { deprecatedSuccessor?: string };
    const successor = AGENT_TOOL_NAMES.find(
      (tool) => AGENT_TOOL_DEFINITIONS[tool].mcp.name === mcp.deprecatedSuccessor,
    );
    assert.ok(successor);
    assert.equal("deprecatedSuccessor" in AGENT_TOOL_DEFINITIONS[successor].mcp, false);
  }
});
