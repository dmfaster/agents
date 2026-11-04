#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillRoot = path.join(repoRoot, "plugins", "dmfaster", "skills", "dmfaster");
const skillPath = path.join(skillRoot, "SKILL.md");
const agentPath = path.join(skillRoot, "agents", "openai.yaml");
const legacySkillRoot = path.join(repoRoot, "packages", "agent-skill");

function fail(message) {
  process.stderr.write(`DM Faster skill check failed: ${message}\n`);
  process.exitCode = 1;
}

function containsFiles(directory) {
  if (!existsSync(directory)) return false;
  return readdirSync(directory, { withFileTypes: true }).some(
    (entry) =>
      entry.isFile() ||
      entry.isSymbolicLink() ||
      (entry.isDirectory() && containsFiles(path.join(directory, entry.name))),
  );
}

if (containsFiles(legacySkillRoot)) {
  fail("legacy packages/agent-skill must not duplicate the canonical plugin skill");
}

if (!existsSync(skillPath)) {
  fail(`missing ${path.relative(repoRoot, skillPath)}`);
} else {
  const source = readFileSync(skillPath, "utf8");
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatter) {
    fail("SKILL.md must start with YAML frontmatter");
  } else {
    const keys = [...frontmatter[1].matchAll(/^([a-z][a-z0-9_-]*):/gm)].map((match) => match[1]);
    if (keys.join(",") !== "name,description") {
      fail("SKILL.md frontmatter must contain only name and description");
    }
    const name = frontmatter[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
    const description = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
    if (name !== "dmfaster") fail('frontmatter name must be "dmfaster"');
    if (!description || description.length < 120 || description.length > 1_024) {
      fail("frontmatter description must be informative and at most 1,024 characters");
    }
    if (
      !/user's live DM Faster sales workspace/i.test(description || "") ||
      !/explicitly asks/i.test(description || "")
    ) {
      fail("frontmatter description must scope the skill to explicit live-workspace requests");
    }
    if (
      !/Do not use for repository source debugging/i.test(description || "") ||
      !/extension-runtime diagnosis/i.test(description || "")
    ) {
      fail("frontmatter description must exclude repository and extension-runtime development");
    }
  }

  const guidance = source.replace(/\s+/g, " ");
  if (/\bTODO\b|\[TODO/i.test(source)) fail("SKILL.md still contains template TODO text");
  if (!/browser cookies/i.test(guidance) || !/browser-worker tokens/i.test(guidance)) {
    fail("SKILL.md must preserve the public-authentication boundary");
  }
  if (!/generic HTTP/i.test(guidance) || !/database access/i.test(guidance)) {
    fail("SKILL.md must reject generic transport and database workarounds");
  }
  if (!/Agent 2\.0/i.test(guidance)) fail("SKILL.md must describe the Agent 2.0 surface");
  if (!/exact audience/i.test(guidance)) {
    fail("SKILL.md must preserve the exact-audience invariant");
  }
  if (!/server-issued authorization ID/i.test(guidance) || !/approved: true/i.test(guidance)) {
    fail("SKILL.md must require server-issued action authorization and reject boolean approval");
  }
  if (!/Never control the approval page/i.test(guidance)) {
    fail("SKILL.md must reserve browser approval for the human");
  }
  if (!/complete campaign state/i.test(guidance) || !/stateless/i.test(guidance)) {
    fail("SKILL.md must document stateless campaign planning");
  }
  if (!/not a repository-development interface/i.test(guidance)) {
    fail("SKILL.md must route source-checkout development back to repository guidance");
  }
  if (!/references\/authentication\.md/.test(guidance)) {
    fail("SKILL.md must route authentication through its dedicated reference");
  }
  if (!/references\/tools\.md/.test(guidance)) {
    fail("SKILL.md must route tool selection through its dedicated reference");
  }

  // Bootstrap discovery belongs in the skill; the server owns the domain catalog.
  const requiredTools = [
    "connection_status",
    "tools_discover",
    "dispatchTool",
    "tools_read",
    "tools_write",
    "tools_call",
  ];
  for (const tool of requiredTools) {
    if (!source.includes("`" + tool + "`")) fail(`SKILL.md is missing documented tool ${tool}`);
  }
  const referenceRoot = path.join(skillRoot, "references");
  const markdownPaths = [
    skillPath,
    ...readdirSync(referenceRoot)
      .filter((name) => name.endsWith(".md"))
      .map((name) => path.join(referenceRoot, name)),
  ];
  for (const markdownPath of markdownPaths) {
    const markdown = readFileSync(markdownPath, "utf8");
    for (const retired of [
      "workspace_open",
      "companies_workspace",
      "company_workspace",
      "campaign_workspace",
      "outreach_details",
      "workspace_mentions",
    ]) {
      if (markdown.includes("`" + retired + "`")) {
        fail(`skill guidance references retired presentation tool ${retired}`);
      }
    }
    for (const match of markdown.matchAll(/\]\(([^)]+)\)/g)) {
      const link = match[1];
      if (/^[a-z][a-z0-9+.-]*:/i.test(link) || link.startsWith("#")) continue;
      const target = path.resolve(path.dirname(markdownPath), link.split("#")[0]);
      if (!target.startsWith(`${skillRoot}${path.sep}`) || !existsSync(target)) {
        fail(`missing referenced resource ${link} in ${path.relative(skillRoot, markdownPath)}`);
      }
    }
  }
}

if (!existsSync(agentPath)) {
  fail(`missing ${path.relative(repoRoot, agentPath)}`);
} else {
  const agentSource = readFileSync(agentPath, "utf8");
  if (!/^interface:\s*$/m.test(agentSource))
    fail("agents/openai.yaml must define interface metadata");
  if (!/short_description:\s*"[^"]*(?:campaign|operate)[^"]*"/i.test(agentSource)) {
    fail("agents/openai.yaml must describe the campaign operations surface");
  }
  if (!/default_prompt:\s*"[^"]*\$dmfaster[^"]*"/.test(agentSource)) {
    fail("agents/openai.yaml default prompt must explicitly invoke $dmfaster");
  }
  if (
    !/^dependencies:\s*$[\s\S]*?type:\s*"mcp"$[\s\S]*?value:\s*"dmfaster_hosted"$[\s\S]*?transport:\s*"streamable_http"$[\s\S]*?url:\s*"https:\/\/app\.dmfaster\.com\/mcp"$/m.test(
      agentSource,
    )
  ) {
    fail("agents/openai.yaml must declare the official hosted HTTPS MCP dependency");
  }
  if (/\bTODO\b|\[TODO/i.test(agentSource)) fail("agents/openai.yaml contains TODO text");
}

if (!process.exitCode) process.stdout.write("DM Faster skill structure is valid.\n");
