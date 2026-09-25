import {
  createDmfasterClient,
  AGENT_TOOL_NAMES,
  AGENT_TOOL_DEFINITIONS,
  AGENT_TOOL_SCOPES,
  AGENT_TOOL_POLICIES,
  AGENT_TOOL_INPUT_SCHEMAS,
  AGENT_INPUT_SCHEMA_DEFINITIONS,
  DmfasterHttpError,
  DmfasterSdkError,
  type AgentToolInputMap,
  type AgentToolName,
  type AgentToolResult,
  type CampaignStatus,
  type DmfasterClientOptions,
} from "@dmfaster/sdk";
import {
  AgentAuthError,
  acquireLoginLock as acquireSystemLoginLock,
  beginDeviceAuthorization,
  createBrowserOpener,
  createSystemCredentialStore,
  credentialSourceLabel,
  getDmfasterAgentScopes,
  getRemoteAuthStatus,
  pollDeviceAuthorization,
  revokeRemoteCredential,
  type CredentialStore,
  type DeviceAuthAdapters,
  type DmfasterAgentAccessProfile,
  type AcquireLoginLock,
  type OpenBrowser,
} from "@dmfaster/local-auth";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { parseSavedListCommand } from "./saved-lists.ts";
import { parseInstagramUsernameFile } from "./list-import.ts";

import { resolveCliConfig, type ResolvedCliConfig } from "./config.ts";

export const CLI_VERSION = "1.5.0";

function agentCommandHelp() {
  const sections = new Map<string, string[]>();
  for (const tool of AGENT_TOOL_NAMES) {
    const { section, usage } = AGENT_TOOL_DEFINITIONS[tool].cli;
    const commands = sections.get(section) || [];
    commands.push(`  ${usage}`);
    sections.set(section, commands);
  }
  return [...sections]
    .map(([section, commands]) => `${section}:\n${commands.join("\n")}`)
    .join("\n\n");
}

const HELP = `DM Faster CLI ${CLI_VERSION}

Usage:
  dmfaster [--json] <command>

Configuration:
  config show
  auth login [--access read|plan|draft|full]
  auth upgrade [--access read|plan|draft|full]
  auth status
  auth logout
  doctor
  describe COMMAND

${agentCommandHelp()}

Agent quick start:
  Begin with 'workspace briefing --json'. For a new campaign, create one complete
  state and run validate, then save and review the exact audience preview. Pass
  that preview JSON with --reviewed-audience when preparing a private draft. Set
  brief.excludePreviouslyContacted to true to have the exact preview and saved
  list exclude companies already contacted in this workspace.
  Launch preflight may return setup_required; show setup.setupUrl to the user and
  repeat setup.resume exactly after browser setup. Never treat setup or preparation
  as launch approval.

Environment:
  DMFASTER_TOKEN       Scoped token override for headless use and CI
  DMFASTER_API_URL     Compatible Agent API base URL (default: https://app.dmfaster.com)
  DMFASTER_CONFIG      Optional config JSON path

Run 'dmfaster auth login' for secure browser sign-in, or 'dmfaster auth upgrade'
to replace a stored credential without disconnecting first. Tokens are stored
in the OS credential store, never in the config file. Full access includes direct
campaign control on explicit user instructions. Preflight binds the campaign version.
Use '-' instead of FILE to read one input from standard input.`;

type Output = {
  write(value: string): unknown;
};

type AgentInvoker = {
  invoke<Name extends AgentToolName>(
    tool: Name,
    input: AgentToolInputMap[Name],
    options?: { signal?: AbortSignal },
  ): Promise<AgentToolResult>;
};

export type CliContext = {
  stdout?: Output;
  stderr?: Output;
  stdin?: AsyncIterable<string | Uint8Array>;
  env?: NodeJS.ProcessEnv;
  homeDirectory?: string;
  resolveConfig?: () => Promise<ResolvedCliConfig>;
  createClient?: (options: DmfasterClientOptions) => AgentInvoker;
  credentialStore?: CredentialStore;
  openBrowser?: OpenBrowser;
  fetch?: typeof globalThis.fetch;
  deviceAuthAdapters?: Omit<DeviceAuthAdapters, "fetch">;
  acquireLoginLock?: AcquireLoginLock;
  readTextFile?: (path: string) => Promise<string>;
  sleep?: (milliseconds: number) => Promise<void>;
};

class UsageError extends Error {}

async function readInputSource(path: string, context: CliContext, maxBytes: number) {
  if (path !== "-") {
    return (context.readTextFile ?? ((filePath: string) => readFile(filePath, "utf8")))(path);
  }
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of context.stdin ?? process.stdin) {
    const buffer = Buffer.from(chunk);
    total += buffer.byteLength;
    if (total > maxBytes) {
      throw new UsageError(`Standard input cannot exceed ${maxBytes} bytes.`);
    }
    chunks.push(buffer);
  }
  return Buffer.concat(chunks, total).toString("utf8");
}

function line(output: Output, value: string) {
  output.write(`${value}\n`);
}

function exactCommandTool(words: string[]): AgentToolName | null {
  if (words.length === 1 && (AGENT_TOOL_NAMES as readonly string[]).includes(words[0]!)) {
    return words[0] as AgentToolName;
  }
  return (
    AGENT_TOOL_NAMES.find(
      (name) => AGENT_TOOL_DEFINITIONS[name].cli.command.join(" ") === words.join(" "),
    ) ?? null
  );
}

function describedInputSchema(tool: AgentToolName) {
  const definitions = AGENT_INPUT_SCHEMA_DEFINITIONS as Record<string, unknown>;
  const used: Record<string, unknown> = {};
  const convert = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(convert);
    if (!value || typeof value !== "object") return value;
    const object = value as Record<string, unknown>;
    const ref = object.$ref;
    if (typeof ref === "string" && ref.startsWith("#/components/schemas/")) {
      const name = ref.slice("#/components/schemas/".length);
      if (!Object.hasOwn(used, name)) {
        used[name] = null;
        used[name] = convert(definitions[name]);
      }
      return { ...object, $ref: `#/$defs/${name}` };
    }
    return Object.fromEntries(Object.entries(object).map(([key, child]) => [key, convert(child)]));
  };
  return { ...(convert(AGENT_TOOL_INPUT_SCHEMAS[tool]) as Record<string, unknown>), $defs: used };
}

function describeCommand(tool: AgentToolName) {
  const definition = AGENT_TOOL_DEFINITIONS[tool];
  return {
    tool,
    mcpTool: definition.mcp.name,
    description: definition.mcp.description,
    usage: definition.cli.usage,
    scopes: AGENT_TOOL_SCOPES[tool],
    effect: AGENT_TOOL_POLICIES[tool].effect,
    inputSchema: describedInputSchema(tool),
  };
}

function parseInteger(value: string | undefined, option: string, maximum: number) {
  if (!value || !/^\d+$/.test(value)) {
    throw new UsageError(`${option} requires a positive integer.`);
  }
  const parsed = Number(value);
  if (parsed < 1 || parsed > maximum) {
    throw new UsageError(`${option} must be from 1 to ${maximum}.`);
  }
  return parsed;
}

function requireNoArguments(args: string[], command: string) {
  if (args.length > 0) throw new UsageError(`${command} does not accept additional arguments.`);
}

const AUTH_ACCESS_PROFILES = ["read", "plan", "draft", "full"] as const;

function parseAuthLoginAccess(args: string[]): DmfasterAgentAccessProfile {
  let access: DmfasterAgentAccessProfile = "full";
  let seen = false;
  for (let index = 0; index < args.length; index += 1) {
    const option = args[index] || "";
    let candidate: string | undefined;
    if (option === "--access") {
      candidate = args[index + 1];
      index += 1;
    } else if (option.startsWith("--access=")) {
      candidate = option.slice("--access=".length);
    } else {
      throw new UsageError(`Unknown auth login option: ${option || "(empty)"}.`);
    }
    if (seen) throw new UsageError("--access can be provided only once.");
    if (!AUTH_ACCESS_PROFILES.includes(candidate as DmfasterAgentAccessProfile)) {
      throw new UsageError(`--access must be one of: ${AUTH_ACCESS_PROFILES.join(", ")}.`);
    }
    access = candidate as DmfasterAgentAccessProfile;
    seen = true;
  }
  return access;
}

function parseOptionalCampaignId(args: string[], command: string) {
  if (args.length > 1) throw new UsageError(`${command} accepts at most one campaign reference.`);
  if (args.length === 1 && !args[0]?.trim()) {
    throw new UsageError("Campaign identifiers cannot be empty.");
  }
  const campaignId = args[0]?.trim();
  if (campaignId && campaignId.length > 160) {
    throw new UsageError("Campaign identifiers cannot exceed 160 characters.");
  }
  return campaignId ? { campaignId } : {};
}

function parseAnalyticsSummary(args: string[]): AgentToolInputMap["analytics.summary"] {
  let scope: AgentToolInputMap["analytics.summary"]["scope"] | undefined;
  let campaign: string | undefined;
  const scopes = ["today", "last_24_hours", "campaign_to_date"] as const;
  for (let index = 0; index < args.length; index += 1) {
    const option = args[index];
    if (option === "--scope") {
      const candidate = args[index + 1];
      if (!scopes.includes(candidate as (typeof scopes)[number])) {
        throw new UsageError(`--scope must be one of: ${scopes.join(", ")}.`);
      }
      scope = candidate as (typeof scopes)[number];
      index += 1;
    } else if (option === "--campaign") {
      const candidate = args[index + 1]?.trim() || "";
      if (!candidate || candidate.startsWith("--")) {
        throw new UsageError("--campaign requires a campaign identifier or exact name.");
      }
      if (candidate.length > 160) {
        throw new UsageError("Campaign references cannot exceed 160 characters.");
      }
      campaign = candidate;
      index += 1;
    } else {
      throw new UsageError(`Unknown analytics summary option: ${option || "(empty)"}.`);
    }
  }
  if (!scope) throw new UsageError("analytics summary requires --scope.");
  return { scope, ...(campaign ? { campaign } : {}) };
}

function parseCampaignList(args: string[]): AgentToolInputMap["campaigns.list"] {
  const input: AgentToolInputMap["campaigns.list"] = {};
  const statuses: CampaignStatus[] = [
    "Draft",
    "Queued",
    "Running",
    "Paused",
    "Cooldown",
    "Completed",
  ];
  for (let index = 0; index < args.length; index += 1) {
    const option = args[index];
    if (option === "--status") {
      const value = args[index + 1];
      const status = statuses.find((candidate) => candidate.toLowerCase() === value?.toLowerCase());
      if (!status) throw new UsageError(`--status must be one of: ${statuses.join(", ")}.`);
      input.status = status;
      index += 1;
    } else if (option === "--limit") {
      input.limit = parseInteger(args[index + 1], "--limit", 25);
      index += 1;
    } else if (option === "--query") {
      const query = args[index + 1]?.trim();
      if (!query || query.startsWith("--") || query.length > 120) {
        throw new UsageError("--query requires campaign name text of at most 120 characters.");
      }
      input.query = query;
      index += 1;
    } else if (option === "--channel") {
      const channel = args[index + 1]?.trim().toLowerCase();
      if (!channel || !["instagram", "facebook", "linkedin", "gmail", "sms"].includes(channel)) {
        throw new UsageError("--channel must be instagram, facebook, linkedin, gmail, or sms.");
      }
      input.channel = channel as NonNullable<AgentToolInputMap["campaigns.list"]["channel"]>;
      index += 1;
    } else if (option === "--cursor") {
      const cursor = args[index + 1]?.trim();
      if (!cursor || !/^[A-Za-z0-9_-]{1,500}$/.test(cursor)) {
        throw new UsageError("--cursor requires the opaque nextCursor from the previous page.");
      }
      input.cursor = cursor;
      index += 1;
    } else {
      throw new UsageError(`Unknown campaigns list option: ${option || "(empty)"}.`);
    }
  }
  return input;
}

function parseRepliesList(args: string[]): AgentToolInputMap["replies.list"] {
  const input: AgentToolInputMap["replies.list"] = {};
  let positionalCampaignId: string | undefined;
  for (let index = 0; index < args.length; index += 1) {
    const option = args[index];
    if (option === "--limit") {
      input.limit = parseInteger(args[index + 1], "--limit", 20);
      index += 1;
    } else if (option === "--query") {
      const query = args[index + 1]?.trim();
      if (!query || query.startsWith("--")) throw new UsageError("--query requires search text.");
      if (query.length > 120) throw new UsageError("--query cannot exceed 120 characters.");
      input.query = query;
      index += 1;
    } else if (option?.startsWith("--")) {
      throw new UsageError(`Unknown replies list option: ${option}.`);
    } else if (option) {
      if (positionalCampaignId) {
        throw new UsageError("replies list accepts at most one campaign identifier.");
      }
      const campaignId = option.trim();
      if (!campaignId) throw new UsageError("Campaign identifiers cannot be empty.");
      if (campaignId.length > 160)
        throw new UsageError("Campaign identifiers cannot exceed 160 characters.");
      positionalCampaignId = campaignId;
    } else {
      throw new UsageError(`Unknown replies list option: ${option || "(empty)"}.`);
    }
  }
  if (positionalCampaignId) input.campaignId = positionalCampaignId;
  return input;
}

function parseCompanyTimeline(args: string[]): AgentToolInputMap["company.timeline"] {
  if (args.length !== 2) {
    throw new UsageError("company timeline requires CAMPAIGN_ID and COMPANY_OUTREACH_ID.");
  }
  const campaignId = args[0]?.trim() || "";
  const companyOutreachId = args[1]?.trim() || "";
  if (!campaignId || !companyOutreachId) {
    throw new UsageError("company timeline identifiers cannot be empty.");
  }
  if (campaignId.length > 160 || companyOutreachId.length > 160) {
    throw new UsageError("company timeline identifiers cannot exceed 160 characters.");
  }
  return { campaignId, companyOutreachId };
}

function parseIdempotencyKey(value: string | undefined) {
  const normalized = value?.trim() || "";
  if (!/^[A-Za-z0-9._:-]{1,160}$/.test(normalized)) {
    throw new UsageError(
      "--idempotency-key requires 1 to 160 letters, numbers, dots, colons, underscores, or dashes.",
    );
  }
  return normalized;
}

function parseIndustryLookup(args: string[]): AgentToolInputMap["industry.lookup"] {
  const queryParts: string[] = [];
  let version: "2008" | "2025" | undefined;
  let language: "en" | "fi" | undefined;
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === "--version") {
      const candidate = args[index + 1];
      if (candidate !== "2008" && candidate !== "2025") {
        throw new UsageError("--version must be 2008 or 2025.");
      }
      version = candidate;
      index += 1;
    } else if (value === "--language") {
      const candidate = args[index + 1];
      if (candidate !== "en" && candidate !== "fi") {
        throw new UsageError("--language must be en or fi.");
      }
      language = candidate;
      index += 1;
    } else if (value?.startsWith("--")) {
      throw new UsageError(`Unknown industry lookup option: ${value}.`);
    } else if (value) {
      queryParts.push(value);
    }
  }
  const query = queryParts.join(" ").trim();
  if (!query || query.length > 800) {
    throw new UsageError("industry lookup requires a query of at most 800 characters.");
  }
  return { query, ...(version ? { version } : {}), ...(language ? { language } : {}) };
}

async function parseCampaignStateFile(path: string, context: CliContext) {
  let source: string;
  try {
    source = await readInputSource(path, context, 64 * 1024);
  } catch (cause) {
    throw new UsageError(
      `Could not read campaign state file ${path}: ${cause instanceof Error ? cause.message : "read failed"}`,
    );
  }
  if (Buffer.byteLength(source, "utf8") > 64 * 1024) {
    throw new UsageError("Campaign state files cannot exceed 64 KiB.");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(source);
  } catch {
    throw new UsageError("Campaign state must be valid JSON.");
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new UsageError("Campaign state must be a JSON object.");
  }
  const candidate = parsed as Record<string, unknown>;
  const state =
    candidate.state && typeof candidate.state === "object" ? candidate.state : candidate;
  return state;
}

function asJsonObject(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

async function parseReviewedAudienceFile(
  path: string,
  context: CliContext,
): Promise<AgentToolInputMap["campaign.prepare"]["reviewedAudience"]> {
  let source: string;
  try {
    source = await readInputSource(path, context, 256 * 1024);
  } catch (cause) {
    throw new UsageError(
      `Could not read reviewed audience file ${path}: ${cause instanceof Error ? cause.message : "read failed"}`,
    );
  }
  if (Buffer.byteLength(source, "utf8") > 256 * 1024) {
    throw new UsageError("Reviewed audience files cannot exceed 256 KiB.");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(source);
  } catch {
    throw new UsageError("Reviewed audience files must be valid JSON.");
  }

  const root = asJsonObject(parsed);
  const data = asJsonObject(root?.data);
  const harnessData = asJsonObject(data?.data);
  const structured = asJsonObject(root?.structuredContent);
  const structuredData = asJsonObject(structured?.data);
  const structuredHarnessData = asJsonObject(structuredData?.data);
  const candidates = [root, data, harnessData, structured, structuredData, structuredHarnessData];
  const reviewed =
    candidates.map((candidate) => asJsonObject(candidate?.reviewedAudience)).find(Boolean) || null;
  const freshness = asJsonObject(reviewed?.dataFreshness);
  if (
    !reviewed ||
    Object.keys(reviewed).some(
      (key) =>
        key !== "querySignature" && key !== "dataFreshness" && key !== "excludePreviouslyContacted",
    ) ||
    (reviewed.excludePreviouslyContacted !== undefined &&
      typeof reviewed.excludePreviouslyContacted !== "boolean") ||
    typeof reviewed.querySignature !== "string" ||
    !reviewed.querySignature.trim() ||
    reviewed.querySignature.length > 200 ||
    !freshness ||
    Object.keys(freshness).some((key) => key !== "engine" && key !== "revision") ||
    freshness.engine !== "search_facts" ||
    typeof freshness.revision !== "string" ||
    !freshness.revision.trim() ||
    freshness.revision.length > 200
  ) {
    throw new UsageError(
      "The reviewed audience file must be an unmodified successful exact audience preview containing a server-issued reviewedAudience.",
    );
  }
  return reviewed as AgentToolInputMap["campaign.prepare"]["reviewedAudience"];
}

async function parseStateCommand(
  args: string[],
  context: CliContext,
  options: { requireReviewedAudience?: boolean } = {},
): Promise<{
  state: AgentToolInputMap["campaign.validate"]["state"];
  sampleSize?: number;
  idempotencyKey?: string;
  reviewedAudience?: AgentToolInputMap["campaign.prepare"]["reviewedAudience"];
}> {
  let statePath = "";
  let reviewedAudiencePath = "";
  let sampleSize: number | undefined;
  let idempotencyKeyValue: string | undefined;
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === "--state") {
      statePath = args[index + 1]?.trim() || "";
      index += 1;
    } else if (value === "--sample-size") {
      sampleSize = parseInteger(args[index + 1], "--sample-size", 25);
      index += 1;
    } else if (value === "--idempotency-key") {
      idempotencyKeyValue = parseIdempotencyKey(args[index + 1]);
      index += 1;
    } else if (value === "--reviewed-audience" && options.requireReviewedAudience) {
      reviewedAudiencePath = args[index + 1]?.trim() || "";
      index += 1;
    } else {
      throw new UsageError(`Unknown campaign state option: ${value || "(empty)"}.`);
    }
  }
  if (!statePath) throw new UsageError("--state FILE is required.");
  if (options.requireReviewedAudience && !reviewedAudiencePath) {
    throw new UsageError(
      "--reviewed-audience PREVIEW_JSON is required. Run audience preview, review its exact result, and save that JSON first.",
    );
  }
  if (statePath === "-" && reviewedAudiencePath === "-") {
    throw new UsageError("Use standard input for either --state or --reviewed-audience, not both.");
  }
  const state = (await parseCampaignStateFile(
    statePath,
    context,
  )) as AgentToolInputMap["campaign.validate"]["state"];
  const reviewedAudience = reviewedAudiencePath
    ? await parseReviewedAudienceFile(reviewedAudiencePath, context)
    : undefined;
  return {
    state,
    ...(sampleSize ? { sampleSize } : {}),
    ...(idempotencyKeyValue ? { idempotencyKey: idempotencyKeyValue } : {}),
    ...(reviewedAudience ? { reviewedAudience } : {}),
  };
}

function parseCampaignAction(args: string[], options: { execute: boolean }) {
  const campaignIdValue = args[0]?.trim() || "";
  if (!campaignIdValue || campaignIdValue.length > 160 || campaignIdValue.startsWith("--")) {
    throw new UsageError("A campaign identifier of at most 160 characters is required.");
  }
  let idempotencyKeyValue = "";
  let authorizationIdValue = "";
  for (let index = 1; index < args.length; index += 1) {
    const value = args[index];
    if (value === "--idempotency-key") {
      idempotencyKeyValue = parseIdempotencyKey(args[index + 1]);
      index += 1;
    } else if (value === "--authorization-id") {
      const candidate = args[index + 1]?.trim() || "";
      if (!/^agent_action_[a-f0-9]{32}$/.test(candidate)) {
        throw new UsageError("--authorization-id must be returned by the matching preflight.");
      }
      authorizationIdValue = candidate;
      index += 1;
    } else {
      throw new UsageError(`Unknown campaign action option: ${value || "(empty)"}.`);
    }
  }
  if (!idempotencyKeyValue) {
    throw new UsageError("--idempotency-key KEY is required.");
  }
  if (options.execute && !authorizationIdValue) {
    throw new UsageError("--authorization-id ID from a ready or approved preflight is required.");
  }
  return {
    campaignId: campaignIdValue,
    idempotencyKey: idempotencyKeyValue,
    ...(options.execute ? { authorizationId: authorizationIdValue } : {}),
  };
}

async function commandFromArgs(
  args: string[],
  context: CliContext,
): Promise<{
  tool: AgentToolName;
  input: AgentToolInputMap[AgentToolName];
}> {
  const tool = [...AGENT_TOOL_NAMES]
    .sort((a, b) => b.split(".").length - a.split(".").length)
    .find((name) =>
      AGENT_TOOL_DEFINITIONS[name].cli.command.every((word, index) => args[index] === word),
    );
  if (!tool)
    throw new UsageError(`Unknown command: ${args.join(" ") || "(none)"}. Run dmfaster --help.`);
  const rest = args.slice(AGENT_TOOL_DEFINITIONS[tool].cli.command.length);
  const jsonInput = async (): Promise<AgentToolInputMap[AgentToolName]> => {
    if (rest.length !== 2 || rest[0] !== "--input" || !rest[1] || rest[1].startsWith("--"))
      throw new UsageError(`Use ${tool.replaceAll(".", " ")} --input FILE.`);
    const source = await readInputSource(rest[1], context, 64_000);
    if (Buffer.byteLength(source, "utf8") > 64_000)
      throw new UsageError("Tool input must not exceed 64,000 bytes.");
    try {
      const value: unknown = JSON.parse(source);
      if (!value || typeof value !== "object" || Array.isArray(value))
        throw new Error("Expected a JSON object.");
      return value as AgentToolInputMap[AgentToolName];
    } catch {
      throw new UsageError("Tool input must contain a JSON object.");
    }
  };
  if (tool === "conversations.list" || tool === "conversation.inspect") {
    if (rest[0] === "--input") return { tool, input: await jsonInput() };
    if (tool === "conversation.inspect") {
      const conversationId = rest[0]?.trim();
      if (!conversationId || conversationId.startsWith("--") || conversationId.length > 160)
        throw new UsageError("conversation inspect requires an exact conversation ID.");
      const input: AgentToolInputMap["conversation.inspect"] = { conversationId };
      const seen = new Set<string>();
      for (let index = 1; index < rest.length; index += 2) {
        const option = rest[index];
        const value = rest[index + 1]?.trim();
        if (!value || value.startsWith("--"))
          throw new UsageError(`${option || "Option"} requires a value.`);
        if (seen.has(option!)) throw new UsageError(`Use ${option} only once.`);
        seen.add(option!);
        if (option === "--cursor") {
          if (value.length > 2000) throw new UsageError("--cursor is too long.");
          input.cursor = value;
        } else if (option === "--limit") input.limit = parseInteger(value, option, 100);
        else throw new UsageError(`Unknown conversation inspect option: ${option}.`);
      }
      return { tool, input };
    }
    const input: AgentToolInputMap["conversations.list"] = {};
    const allowed = {
      "--filter": ["all", "needs_reply", "waiting", "unread", "snoozed", "closed"],
      "--interest": ["positive", "neutral", "negative", "needs_review"],
      "--intent": [
        "interested",
        "information_requested",
        "meeting_intent",
        "not_now",
        "wrong_person",
        "not_interested",
        "opt_out",
        "acknowledgement",
        "unclear",
      ],
      "--channel": ["instagram", "facebook", "linkedin", "gmail", "outlook", "email", "sms"],
    } as const;
    const seen = new Set<string>();
    for (let index = 0; index < rest.length; index += 1) {
      const option = rest[index];
      if (seen.has(option!)) throw new UsageError(`Use ${option} only once.`);
      seen.add(option!);
      if (option === "--include-automatic-responses") {
        input.includeAutomaticResponses = true;
        continue;
      }
      const value = rest[index + 1]?.trim();
      if (!value || value.startsWith("--"))
        throw new UsageError(`${option || "Option"} requires a value.`);
      if (
        option === "--filter" ||
        option === "--interest" ||
        option === "--intent" ||
        option === "--channel"
      ) {
        if (!(allowed[option] as readonly string[]).includes(value))
          throw new UsageError(`${option} must be one of: ${allowed[option].join(", ")}.`);
        Object.assign(input, { [option.slice(2)]: value });
      } else if (option === "--campaign-id" || option === "--mailbox-id") {
        if (value.length > 160) throw new UsageError(`${option} is too long.`);
        if (option === "--campaign-id") input.campaignId = value;
        else input.mailboxId = value;
      } else if (option === "--query") {
        if (value.length > 120) throw new UsageError("--query is too long.");
        input.query = value;
      } else if (option === "--cursor") {
        if (value.length > 2000) throw new UsageError("--cursor is too long.");
        input.cursor = value;
      } else if (option === "--limit") input.limit = parseInteger(value, option, 60);
      else throw new UsageError(`Unknown conversations list option: ${option}.`);
      index += 1;
    }
    return { tool, input };
  }
  if (
    AGENT_TOOL_DEFINITIONS[tool].cli.usage.includes("--input FILE") &&
    tool !== "campaign.draft.prepare" &&
    tool !== "campaign.draft.update"
  ) {
    return { tool, input: await jsonInput() };
  }
  if (
    tool === "lists.list" ||
    tool === "list.inspect" ||
    tool === "list.target.remove" ||
    tool === "campaign.draft.update" ||
    tool === "campaign.draft.prepare"
  ) {
    try {
      return {
        tool,
        input: await parseSavedListCommand(
          tool,
          rest,
          context.readTextFile ?? ((file) => readFile(file, "utf8")),
        ),
      };
    } catch (error) {
      throw new UsageError(error instanceof Error ? error.message : "Invalid saved-list command.");
    }
  }
  if (tool === "analytics.summary") {
    return { tool: "analytics.summary", input: parseAnalyticsSummary(rest) };
  }
  if (tool === "workspace.briefing") {
    requireNoArguments(rest, "workspace briefing");
    return { tool: "workspace.briefing", input: {} };
  }
  if (tool === "campaigns.list") {
    return { tool: "campaigns.list", input: parseCampaignList(rest) };
  }
  if (tool === "campaign.inspect") {
    return { tool: "campaign.inspect", input: parseOptionalCampaignId(rest, "campaign inspect") };
  }
  if (tool === "sending.inspect") {
    return { tool: "sending.inspect", input: parseOptionalCampaignId(rest, "sending inspect") };
  }
  if (tool === "replies.list") {
    return { tool: "replies.list", input: parseRepliesList(rest) };
  }
  if (tool === "pipeline.inspect") {
    return { tool: "pipeline.inspect", input: parseOptionalCampaignId(rest, "pipeline inspect") };
  }
  if (tool === "company.timeline") {
    return { tool: "company.timeline", input: parseCompanyTimeline(rest) };
  }
  if (tool === "industry.lookup") {
    return { tool: "industry.lookup", input: parseIndustryLookup(rest) };
  }
  if (tool === "campaign.validate") {
    const input = await parseStateCommand(rest, context);
    return { tool: "campaign.validate", input: { state: input.state } };
  }
  if (tool === "audience.preview") {
    const input = await parseStateCommand(rest, context);
    return {
      tool: "audience.preview",
      input: { state: input.state, ...(input.sampleSize ? { sampleSize: input.sampleSize } : {}) },
    };
  }
  if (tool === "list.import") {
    const options = new Map<string, string>();
    for (let index = 0; index < rest.length; index += 2) {
      const option = rest[index];
      const value = rest[index + 1];
      if (
        !["--name", "--file", "--idempotency-key"].includes(option || "") ||
        !value ||
        value.startsWith("--") ||
        options.has(option!)
      ) {
        throw new UsageError(
          "Use list import --name NAME --file FILE [--idempotency-key KEY], with each option once.",
        );
      }
      options.set(option!, value);
    }
    const name = options.get("--name")?.trim();
    const file = options.get("--file");
    if (!name || name.length > 120 || !file)
      throw new UsageError("A list name of 1–120 characters and --file are required.");
    let usernames: string[];
    try {
      const text = await readInputSource(file, context, 64 * 1024);
      usernames = parseInstagramUsernameFile(text);
    } catch (error) {
      throw new UsageError(
        error instanceof Error ? error.message : "The username file could not be read.",
      );
    }
    const idempotencyKey =
      options.get("--idempotency-key") ||
      `instagram-import:${createHash("sha256")
        .update(JSON.stringify([name, [...new Set(usernames)].sort()]))
        .digest("hex")}`;
    if (!/^[A-Za-z0-9._:-]{1,160}$/.test(idempotencyKey))
      throw new UsageError(
        "Invalid --idempotency-key; use 1–160 letters, numbers, dots, underscores, colons or hyphens.",
      );
    return { tool: "list.import", input: { name, usernames, idempotencyKey } };
  }
  if (tool === "list.prepare") {
    const input = await parseStateCommand(rest, context, { requireReviewedAudience: true });
    return {
      tool: "list.prepare",
      input: { ...input, reviewedAudience: input.reviewedAudience! },
    };
  }
  if (tool === "campaign.prepare") {
    const input = await parseStateCommand(rest, context, { requireReviewedAudience: true });
    return {
      tool: "campaign.prepare",
      input: { ...input, reviewedAudience: input.reviewedAudience! },
    };
  }
  if (tool === "campaign.launch.preflight") {
    return {
      tool: "campaign.launch.preflight",
      input: parseCampaignAction(rest, { execute: false }),
    };
  }
  if (tool === "campaign.launch") {
    return {
      tool: "campaign.launch",
      input: parseCampaignAction(rest, { execute: true }) as AgentToolInputMap["campaign.launch"],
    };
  }
  if (tool === "campaign.pause.preflight") {
    return {
      tool: "campaign.pause.preflight",
      input: parseCampaignAction(rest, { execute: false }),
    };
  }
  if (tool === "campaign.pause") {
    return {
      tool: "campaign.pause",
      input: parseCampaignAction(rest, { execute: true }) as AgentToolInputMap["campaign.pause"],
    };
  }
  throw new UsageError(`Unknown command: ${args.join(" ") || "(none)"}. Run dmfaster --help.`);
}

function missingTokenMessage(config: ResolvedCliConfig) {
  return [
    "DM Faster is not signed in.",
    "Run `dmfaster auth login`, or set DMFASTER_TOKEN for headless CI.",
    config.credentialStoreError || "Plaintext tokens are never accepted in the config file.",
  ].join(" ");
}

function publicIdentity(identity: Awaited<ReturnType<typeof getRemoteAuthStatus>>) {
  return {
    workspace: identity.workspace,
    user: identity.user,
    credential: identity.credential,
  };
}

function authAdapters(context: CliContext): DeviceAuthAdapters {
  return {
    ...(context.deviceAuthAdapters ?? {}),
    ...(context.fetch ? { fetch: context.fetch } : {}),
  };
}

function publicClientError(error: DmfasterSdkError | AgentAuthError) {
  const httpError = error instanceof DmfasterHttpError ? error : null;
  const authError = error instanceof AgentAuthError ? error : null;
  return {
    error: {
      code: error.code,
      message: error.message,
      ...(typeof httpError?.retryable === "boolean" ? { retryable: httpError.retryable } : {}),
      ...(httpError?.requestId ? { requestId: httpError.requestId } : {}),
      ...(typeof (httpError?.retryAfterSeconds ?? authError?.retryAfterSeconds) === "number"
        ? { retryAfterSeconds: httpError?.retryAfterSeconds ?? authError?.retryAfterSeconds }
        : {}),
      ...(httpError?.details ? { details: httpError.details } : {}),
      ...(typeof (httpError?.status ?? authError?.status) === "number"
        ? { status: httpError?.status ?? authError?.status }
        : {}),
    },
  };
}

function printClientError(
  output: Output,
  error: DmfasterSdkError | AgentAuthError,
  jsonOutput: boolean,
) {
  const body = publicClientError(error);
  if (jsonOutput) {
    line(output, JSON.stringify(body, null, 2));
    return;
  }
  const metadata = body.error;
  const context = [
    `code: ${metadata.code}`,
    ...(typeof metadata.retryable === "boolean" ? [`retryable: ${metadata.retryable}`] : []),
    ...(metadata.requestId ? [`request: ${metadata.requestId}`] : []),
    ...(typeof metadata.retryAfterSeconds === "number"
      ? [`retry after: ${metadata.retryAfterSeconds}s`]
      : []),
  ];
  line(output, `error: ${metadata.message} (${context.join(", ")})`);
}

async function cleanupIssuedRemoteCredential(input: {
  baseUrl: string;
  token: string;
  context: CliContext;
  stderr: Output;
}) {
  const cleanupSleep =
    input.context.deviceAuthAdapters?.sleep ??
    ((milliseconds: number) => new Promise<void>((resolve) => setTimeout(resolve, milliseconds)));
  let lastError: unknown = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await revokeRemoteCredential({
        baseUrl: input.baseUrl,
        token: input.token,
        ...(input.context.fetch ? { fetch: input.context.fetch } : {}),
      });
      return true;
    } catch (error) {
      if (error instanceof AgentAuthError && error.code === "unauthorized") {
        return true;
      }
      lastError = error;
      if (attempt < 2) await cleanupSleep(250 * 2 ** attempt);
    }
  }
  const detail =
    lastError instanceof Error ? lastError.message : "Remote revocation was unavailable.";
  line(
    input.stderr,
    `warning: The unused remote DM Faster credential could not be revoked after 3 attempts. Revoke the new CLI session from Agent access settings. ${detail}`,
  );
  return false;
}

async function runAuthLogin(input: {
  config: ResolvedCliConfig;
  context: CliContext;
  stdout: Output;
  stderr: Output;
  access: DmfasterAgentAccessProfile;
  upgrade?: boolean;
}) {
  if (input.config.tokenSource === "DMFASTER_TOKEN") {
    throw new UsageError(
      `DMFASTER_TOKEN is set and overrides secure browser login. Unset it before running \`dmfaster auth ${input.upgrade ? "upgrade" : "login"}\`.`,
    );
  }
  if (input.upgrade && !input.config.token) {
    throw new UsageError(
      "DM Faster has no stored credential to upgrade. Run `dmfaster auth login`.",
    );
  }
  if (!input.upgrade && input.config.token) {
    throw new UsageError(
      "DM Faster is already signed in on this API origin. Run `dmfaster auth status` or `dmfaster auth upgrade` to replace the credential.",
    );
  }
  if (input.config.credentialStoreError) {
    throw new UsageError(input.config.credentialStoreError);
  }

  const store = input.context.credentialStore ?? createSystemCredentialStore();
  const acquireLock =
    input.context.acquireLoginLock ??
    ((baseUrl: string) =>
      acquireSystemLoginLock({
        baseUrl,
        ...(input.context.env ? { env: input.context.env } : {}),
        ...(input.context.homeDirectory ? { homeDirectory: input.context.homeDirectory } : {}),
      }));
  const loginLock = await acquireLock(input.config.baseUrl);
  let priorCredentialRevoked: boolean | null = null;
  const result = await (async () => {
    let persisted = false;
    let failed = false;
    let oldToken: string | null = null;
    try {
      // Re-read under the cross-process lock. Another CLI may have completed
      // between initial config resolution and lock acquisition.
      oldToken = await store.get(input.config.baseUrl);
      if (input.upgrade) {
        if (!oldToken || oldToken !== input.config.token) {
          throw new UsageError(
            "The stored credential changed. Run `dmfaster auth status` and retry the upgrade.",
          );
        }
      } else if (oldToken) {
        throw new UsageError(
          "DM Faster is already signed in on this API origin. Run `dmfaster auth status` or `dmfaster auth upgrade` to replace the credential.",
        );
      }

      const authorization = await beginDeviceAuthorization({
        baseUrl: input.config.baseUrl,
        access: input.access,
        adapters: authAdapters(input.context),
      });
      line(
        input.stdout,
        JSON.stringify({
          event: "authorization_required",
          confirmationCode: authorization.confirmationCode,
          verificationUrl: authorization.verificationUrl,
          expiresIn: authorization.expiresIn,
          requestedAccess: input.access,
        }),
      );
      line(input.stderr, `Confirmation code: ${authorization.confirmationCode}`);
      line(input.stderr, `Requested access: ${input.access}`);
      line(input.stderr, "Check that this code matches in the browser before approving.");
      line(input.stderr, `Open: ${authorization.verificationUrl}`);

      const openBrowser = input.context.openBrowser ?? createBrowserOpener();
      try {
        await openBrowser(authorization.verificationUrl);
      } catch (error) {
        line(
          input.stderr,
          `warning: ${error instanceof Error ? error.message : "Could not open the browser."}`,
        );
      }
      line(input.stderr, "Waiting for browser approval…");

      const authorized = await pollDeviceAuthorization({
        baseUrl: input.config.baseUrl,
        authorization,
        adapters: authAdapters(input.context),
      });

      const missingScopes = getDmfasterAgentScopes(input.access).filter(
        (scope) => !authorized.credential.scopes.includes(scope),
      );
      if (missingScopes.length > 0) {
        await cleanupIssuedRemoteCredential({
          baseUrl: input.config.baseUrl,
          token: authorized.accessToken,
          context: input.context,
          stderr: input.stderr,
        });
        throw new AgentAuthError(
          "scope_mismatch",
          "DM Faster issued a credential without the requested access profile. The new credential was not saved.",
        );
      }
      if (input.upgrade) {
        let verified: Awaited<ReturnType<typeof getRemoteAuthStatus>>;
        try {
          verified = await getRemoteAuthStatus({
            baseUrl: input.config.baseUrl,
            token: authorized.accessToken,
            ...(input.context.fetch ? { fetch: input.context.fetch } : {}),
          });
        } catch (error) {
          await cleanupIssuedRemoteCredential({
            baseUrl: input.config.baseUrl,
            token: authorized.accessToken,
            context: input.context,
            stderr: input.stderr,
          });
          throw error;
        }
        if (
          verified.workspace.id !== authorized.workspace.id ||
          verified.credential.id !== authorized.credential.id ||
          getDmfasterAgentScopes(input.access).some(
            (scope) => !verified.credential.scopes.includes(scope),
          )
        ) {
          await cleanupIssuedRemoteCredential({
            baseUrl: input.config.baseUrl,
            token: authorized.accessToken,
            context: input.context,
            stderr: input.stderr,
          });
          throw new AgentAuthError(
            "credential_mismatch",
            "The upgraded credential could not be verified against the approved workspace and scopes. The old connection was preserved.",
          );
        }
      }

      try {
        await loginLock.assertOwned();
      } catch (lockError) {
        await cleanupIssuedRemoteCredential({
          baseUrl: input.config.baseUrl,
          token: authorized.accessToken,
          context: input.context,
          stderr: input.stderr,
        });
        throw lockError;
      }

      let unchanged: boolean;
      try {
        unchanged = (await store.get(input.config.baseUrl)) === oldToken;
      } catch (storeError) {
        await cleanupIssuedRemoteCredential({
          baseUrl: input.config.baseUrl,
          token: authorized.accessToken,
          context: input.context,
          stderr: input.stderr,
        });
        throw storeError;
      }
      if (!unchanged) {
        await cleanupIssuedRemoteCredential({
          baseUrl: input.config.baseUrl,
          token: authorized.accessToken,
          context: input.context,
          stderr: input.stderr,
        });
        throw new UsageError(
          "The stored credential changed during browser approval. Retry authentication.",
        );
      }

      try {
        await store.set(input.config.baseUrl, authorized.accessToken);
        if (input.upgrade && (await store.get(input.config.baseUrl)) !== authorized.accessToken) {
          throw new Error("The upgraded credential was not confirmed in secure storage.");
        }
      } catch (storeError) {
        // A secure-store command may write successfully and then report an
        // error. Never revoke a token that may be the only stored connection.
        let storedToken: string | null | undefined;
        try {
          storedToken = await store.get(input.config.baseUrl);
        } catch {
          storedToken = undefined;
        }
        if (storedToken === authorized.accessToken) {
          persisted = true;
          line(
            input.stderr,
            "warning: Secure storage reported an error after saving the new credential. The stored credential was verified.",
          );
        } else {
          if (input.upgrade && oldToken && storedToken !== oldToken) {
            try {
              await store.set(input.config.baseUrl, oldToken);
              storedToken = await store.get(input.config.baseUrl);
            } catch {
              storedToken = undefined;
            }
          }
          if (storedToken === oldToken) {
            await cleanupIssuedRemoteCredential({
              baseUrl: input.config.baseUrl,
              token: authorized.accessToken,
              context: input.context,
              stderr: input.stderr,
            });
          } else {
            line(
              input.stderr,
              "warning: Secure storage could not be verified. Check `dmfaster auth status` and Agent access settings; both remote credentials remain active.",
            );
          }
          throw storeError;
        }
      }
      persisted = true;
      if (input.upgrade && oldToken) {
        try {
          await revokeRemoteCredential({
            baseUrl: input.config.baseUrl,
            token: oldToken,
            ...(input.context.fetch ? { fetch: input.context.fetch } : {}),
          });
          priorCredentialRevoked = true;
        } catch (error) {
          priorCredentialRevoked = error instanceof AgentAuthError && error.code === "unauthorized";
          if (!priorCredentialRevoked) {
            line(
              input.stderr,
              "warning: The new credential is active, but the prior remote credential could not be revoked. Revoke the old CLI session in Agent access settings.",
            );
          }
        }
      }
      return authorized;
    } catch (error) {
      failed = true;
      throw error;
    } finally {
      try {
        await loginLock.release();
      } catch (cleanupError) {
        if (persisted) {
          const detail =
            cleanupError instanceof Error
              ? cleanupError.message
              : "Could not remove the browser-login lock.";
          line(
            input.stderr,
            `warning: Authentication succeeded, but browser-login lock cleanup failed. ${detail}`,
          );
        } else if (!failed) {
          throw cleanupError;
        }
      }
    }
  })();

  line(
    input.stdout,
    JSON.stringify({
      event: "authenticated",
      status: "authenticated",
      ...(input.upgrade ? { upgraded: true, priorCredentialRevoked } : {}),
      verifiedRemotely: true,
      credentialSource: credentialSourceLabel(store.kind),
      baseUrl: input.config.baseUrl,
      ...publicIdentity(result),
    }),
  );
  return 0;
}

async function runAuthStatus(input: {
  config: ResolvedCliConfig;
  context: CliContext;
  stdout: Output;
  stderr: Output;
}) {
  if (!input.config.token) {
    line(
      input.stdout,
      JSON.stringify(
        {
          status: "not_authenticated",
          verifiedRemotely: false,
          credentialSource: null,
          baseUrl: input.config.baseUrl,
        },
        null,
        2,
      ),
    );
    line(input.stderr, missingTokenMessage(input.config));
    return 1;
  }

  try {
    const identity = await getRemoteAuthStatus({
      baseUrl: input.config.baseUrl,
      token: input.config.token,
      ...(input.context.fetch ? { fetch: input.context.fetch } : {}),
    });
    line(
      input.stdout,
      JSON.stringify(
        {
          status: "authenticated",
          verifiedRemotely: true,
          credentialSource: input.config.tokenSource,
          baseUrl: input.config.baseUrl,
          ...publicIdentity(identity),
        },
        null,
        2,
      ),
    );
    return 0;
  } catch (error) {
    const invalid =
      error instanceof AgentAuthError &&
      (error.code === "unauthorized" || error.code === "workspace_access_denied");
    line(
      input.stdout,
      JSON.stringify(
        {
          status: invalid ? "invalid" : "unavailable",
          verifiedRemotely: invalid,
          credentialSource: input.config.tokenSource,
          baseUrl: input.config.baseUrl,
        },
        null,
        2,
      ),
    );
    if (error instanceof AgentAuthError) throw error;
    line(
      input.stderr,
      `error: ${error instanceof Error ? error.message : "Could not verify DM Faster login."}`,
    );
    return 1;
  }
}

async function runDoctor(input: {
  config: ResolvedCliConfig;
  context: CliContext;
  stdout: Output;
}) {
  const nodeVersion = process.versions.node;
  const supportedRuntime = Number(nodeVersion.split(".")[0]) === 24;
  const actions: string[] = [];
  if (!supportedRuntime) actions.push("Install Node.js 24 and rerun `dmfaster doctor`.");
  if (input.config.credentialStoreError && input.config.tokenSource !== "DMFASTER_TOKEN") {
    actions.push(input.config.credentialStoreError);
  }
  let authentication: Record<string, unknown>;
  if (!input.config.token) {
    authentication = { status: "not_authenticated" };
    actions.push("Run `dmfaster auth login` and approve the browser request.");
  } else {
    try {
      const identity = await getRemoteAuthStatus({
        baseUrl: input.config.baseUrl,
        token: input.config.token,
        ...(input.context.fetch ? { fetch: input.context.fetch } : {}),
      });
      const scopes = new Set(identity.credential.scopes);
      authentication = {
        status: "authenticated",
        workspace: identity.workspace,
        user: identity.user,
        credential: identity.credential,
        scopeEligibleTools: AGENT_TOOL_NAMES.filter((tool) =>
          AGENT_TOOL_SCOPES[tool].every((scope) => scopes.has(scope)),
        ),
        authorizationNote:
          "Workspace role, plan and action preconditions are checked when each tool runs.",
      };
    } catch (error) {
      const invalid =
        error instanceof AgentAuthError &&
        (error.code === "unauthorized" || error.code === "workspace_access_denied");
      authentication = {
        status: invalid ? "invalid" : "unavailable",
        errorCode: error instanceof AgentAuthError ? error.code : "connection_check_failed",
      };
      actions.push(
        invalid
          ? "Run `dmfaster auth upgrade` to reconnect, or revoke the old connection in Agent access settings."
          : "Check network access to the API URL and retry `dmfaster doctor`.",
      );
    }
  }
  const status =
    supportedRuntime &&
    authentication.status === "authenticated" &&
    (!input.config.credentialStoreError || input.config.tokenSource === "DMFASTER_TOKEN")
      ? "ready"
      : "action_required";
  line(
    input.stdout,
    JSON.stringify(
      {
        status,
        cliVersion: CLI_VERSION,
        nodeVersion,
        platform: process.platform,
        supportedMcpProtocol: "2026-07-28",
        baseUrl: input.config.baseUrl,
        credentialSource: input.config.tokenSource,
        secureCredentialStoreAvailable: !input.config.credentialStoreError,
        authentication,
        actions,
      },
      null,
      2,
    ),
  );
  return status === "ready" ? 0 : 1;
}

async function runAuthLogout(input: {
  config: ResolvedCliConfig;
  context: CliContext;
  stdout: Output;
  stderr: Output;
}) {
  if (input.config.tokenSource === "DMFASTER_TOKEN") {
    if (!input.config.token) {
      line(input.stdout, JSON.stringify({ status: "not_authenticated", revoked: false }, null, 2));
      return 0;
    }
    try {
      await revokeRemoteCredential({
        baseUrl: input.config.baseUrl,
        token: input.config.token,
        ...(input.context.fetch ? { fetch: input.context.fetch } : {}),
      });
    } catch (error) {
      if (!(error instanceof AgentAuthError) || error.code !== "unauthorized") throw error;
    }
    line(
      input.stdout,
      JSON.stringify(
        {
          status: "revoked",
          revoked: true,
          localCredentialRemoved: false,
          credentialSource: "DMFASTER_TOKEN",
          actionRequired: "Unset DMFASTER_TOKEN in the parent process.",
        },
        null,
        2,
      ),
    );
    return 0;
  }

  if (input.config.credentialStoreError) throw new UsageError(input.config.credentialStoreError);
  const store = input.context.credentialStore ?? createSystemCredentialStore();
  const acquireLock =
    input.context.acquireLoginLock ??
    ((baseUrl: string) =>
      acquireSystemLoginLock({
        baseUrl,
        ...(input.context.env ? { env: input.context.env } : {}),
        ...(input.context.homeDirectory ? { homeDirectory: input.context.homeDirectory } : {}),
      }));
  const loginLock = await acquireLock(input.config.baseUrl);
  let completed = false;
  try {
    const token = (await store.get(input.config.baseUrl)) ?? input.config.token;
    if (!token) {
      line(input.stdout, JSON.stringify({ status: "not_authenticated", revoked: false }, null, 2));
      completed = true;
      return 0;
    }

    try {
      await revokeRemoteCredential({
        baseUrl: input.config.baseUrl,
        token,
        ...(input.context.fetch ? { fetch: input.context.fetch } : {}),
      });
    } catch (error) {
      // An unauthorized token is already unusable remotely, so it is safe to
      // remove a matching stored credential. Other failures remain retryable.
      if (!(error instanceof AgentAuthError) || error.code !== "unauthorized") throw error;
    }

    await store.delete(input.config.baseUrl);
    line(
      input.stdout,
      JSON.stringify(
        {
          status: "logged_out",
          revoked: true,
          localCredentialRemoved: true,
          credentialSource: input.config.tokenSource ?? credentialSourceLabel(store.kind),
        },
        null,
        2,
      ),
    );
    completed = true;
    return 0;
  } finally {
    try {
      await loginLock.release();
    } catch (error) {
      if (!completed) throw error;
      line(
        input.stderr,
        `warning: Logout succeeded, but browser-login lock cleanup failed. ${error instanceof Error ? error.message : "Remove the stale lock before the next login."}`,
      );
    }
  }
}

export async function runCli(argv: string[], context: CliContext = {}) {
  const stdout = context.stdout ?? process.stdout;
  const stderr = context.stderr ?? process.stderr;
  const jsonOutput = argv.includes("--json");
  const args = argv.filter((value) => value !== "--json");

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    const words = args.filter((value) => value !== "--help" && value !== "-h");
    const tool = exactCommandTool(words);
    line(
      stdout,
      tool
        ? `${AGENT_TOOL_DEFINITIONS[tool].cli.usage}\n\n${AGENT_TOOL_DEFINITIONS[tool].mcp.description}\n\nRequired scopes: ${AGENT_TOOL_SCOPES[tool].join(", ")}\nUse 'dmfaster describe ${words.join(" ")}' for the input schema.`
        : HELP,
    );
    return 0;
  }
  if (args[0] === "describe") {
    const tool = exactCommandTool(args.slice(1));
    if (!tool) {
      line(stderr, "error: describe requires an exact command or public tool name.");
      return 2;
    }
    line(stdout, JSON.stringify(describeCommand(tool), null, 2));
    return 0;
  }
  if (args.length === 1 && (args[0] === "--version" || args[0] === "-V")) {
    line(stdout, CLI_VERSION);
    return 0;
  }

  try {
    const credentialStore = context.credentialStore ?? createSystemCredentialStore();
    const config = context.resolveConfig
      ? await context.resolveConfig()
      : await resolveCliConfig({
          ...(context.env ? { env: context.env } : {}),
          ...(context.homeDirectory ? { homeDirectory: context.homeDirectory } : {}),
          credentialStore,
        });

    if (args[0] === "config" && args[1] === "show") {
      requireNoArguments(args.slice(2), "config show");
      line(
        stdout,
        JSON.stringify(
          {
            baseUrl: config.baseUrl,
            baseUrlSource: config.baseUrlSource,
            tokenConfigured: Boolean(config.token),
            tokenSource: config.tokenSource,
            secureCredentialStoreAvailable: !config.credentialStoreError,
            configPath: config.configPath,
          },
          null,
          2,
        ),
      );
      return 0;
    }
    if (args[0] === "doctor") {
      requireNoArguments(args.slice(1), "doctor");
      return await runDoctor({ config, context, stdout });
    }
    if (args[0] === "auth" && args[1] === "login") {
      const access = parseAuthLoginAccess(args.slice(2));
      return await runAuthLogin({
        config,
        context: { ...context, credentialStore },
        stdout,
        stderr,
        access,
      });
    }
    if (args[0] === "auth" && args[1] === "upgrade") {
      const access = parseAuthLoginAccess(args.slice(2));
      return await runAuthLogin({
        config,
        context: { ...context, credentialStore },
        stdout,
        stderr,
        access,
        upgrade: true,
      });
    }
    if (args[0] === "auth" && args[1] === "status") {
      requireNoArguments(args.slice(2), "auth status");
      return await runAuthStatus({ config, context, stdout, stderr });
    }
    if (args[0] === "auth" && args[1] === "logout") {
      requireNoArguments(args.slice(2), "auth logout");
      return await runAuthLogout({
        config,
        context: { ...context, credentialStore },
        stdout,
        stderr,
      });
    }

    let waitSeconds = 0;
    let commandArgs = args;
    if (args.slice(0, 3).join(" ") === "campaign operation inspect" && args.includes("--wait")) {
      const waitIndex = args.indexOf("--wait");
      if (waitIndex !== args.length - 2)
        throw new UsageError("Use campaign operation inspect --input FILE --wait SECONDS (1–60).");
      waitSeconds = parseInteger(args[waitIndex + 1], "--wait", 60);
      commandArgs = args.slice(0, waitIndex);
    }
    const command = await commandFromArgs(commandArgs, context);
    if (!config.token) throw new UsageError(missingTokenMessage(config));
    const createClient = context.createClient ?? createDmfasterClient;
    const client = createClient({ baseUrl: config.baseUrl, token: config.token });
    const waitDeadline = Date.now() + waitSeconds * 1000;
    const waitSignal = waitSeconds ? AbortSignal.timeout(waitSeconds * 1000) : undefined;
    let result = await client.invoke(
      command.tool,
      command.input as never,
      waitSignal ? { signal: waitSignal } : undefined,
    );
    const operationState = () =>
      result.data && typeof result.data === "object" && "state" in result.data
        ? String(result.data.state)
        : "";
    const pending = () =>
      result.ok && ["preparing_queue", "awaiting_sender"].includes(operationState());
    for (let remaining = waitSeconds * 1000; waitSeconds && pending() && remaining > 0;) {
      const delay = Math.max(0, Math.min(2000, remaining, waitDeadline - Date.now()));
      await (context.sleep ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms))))(delay);
      remaining -= delay;
      if (waitSignal?.aborted || Date.now() >= waitDeadline) break;
      try {
        result = await client.invoke(
          command.tool,
          command.input as never,
          waitSignal ? { signal: waitSignal } : undefined,
        );
      } catch (error) {
        if (waitSignal?.aborted) break;
        throw error;
      }
    }
    line(stdout, JSON.stringify(result, null, 2));
    if (waitSeconds && pending()) {
      line(
        stderr,
        "Operation is still pending. Repeat this inspection with the same campaignId and commandId.",
      );
      return 1;
    }
    if (waitSeconds && ["blocked", "superseded"].includes(operationState())) return 1;
    return result.ok ? 0 : 1;
  } catch (error) {
    if (error instanceof UsageError) {
      line(
        stderr,
        jsonOutput
          ? JSON.stringify({ error: { code: "usage_error", message: error.message } }, null, 2)
          : `error: ${error.message}`,
      );
      return 2;
    }
    if (error instanceof DmfasterSdkError || error instanceof AgentAuthError) {
      printClientError(stderr, error, jsonOutput);
      return 1;
    }
    const message = error instanceof Error ? error.message : "Unexpected CLI failure.";
    line(
      stderr,
      jsonOutput
        ? JSON.stringify({ error: { code: "unexpected_error", message } }, null, 2)
        : `error: ${message}`,
    );
    return 1;
  }
}
