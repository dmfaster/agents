const header =
  "// Generated from packages/public-api/openapi.yaml. Run npm run generate:agent-api.\n";
const json = (value) => JSON.stringify(value, null, 2);

/** Compile only the input-schema vocabulary we explicitly support; new keywords fail closed. */
export function compileAgentContract(document, { includeServer = false } = {}) {
  const schemas = document.components.schemas;
  const declarations = new Map();
  const active = new Set();
  const allowed = new Set([
    "$ref",
    "type",
    "additionalProperties",
    "required",
    "properties",
    "items",
    "enum",
    "const",
    "allOf",
    "oneOf",
    "anyOf",
    "description",
    "minLength",
    "maxLength",
    "pattern",
    "minimum",
    "maximum",
    "minItems",
    "maxItems",
    "x-dmfaster-trim",
    "x-dmfaster-max-serialized-chars",
  ]);
  function reference(ref) {
    if (!/^#\/components\/schemas\/[A-Za-z][A-Za-z0-9]*$/.test(ref))
      throw Error(`Unsupported schema reference: ${ref}`);
    const name = ref.split("/").at(-1);
    if (!schemas[name]) throw Error(`Missing schema: ${name}`);
    if (active.has(name)) throw Error(`Recursive input schema: ${name}`);
    if (!declarations.has(name)) {
      active.add(name);
      const expression = compile(schemas[name]);
      active.delete(name);
      declarations.set(name, `export const ${name}Schema = ${expression};`);
    }
    return `${name}Schema`;
  }
  function compile(schema) {
    for (const key of Object.keys(schema))
      if (!allowed.has(key)) throw Error(`Unsupported input-schema keyword: ${key}`);
    const selector = ["$ref", "const", "enum", "allOf", "oneOf", "anyOf"].filter(
      (key) => schema[key] !== undefined,
    );
    if (selector.length > 1)
      throw Error("Combined schema selectors require explicit compiler support");
    if (selector.length) {
      const permitted = new Set([selector[0], "description", "x-dmfaster-max-serialized-chars"]);
      if (selector[0] === "const" || selector[0] === "enum") permitted.add("type");
      for (const key of Object.keys(schema))
        if (!permitted.has(key)) throw Error(`Unsupported sibling constraint: ${key}`);
    }
    for (const key of [
      "minLength",
      "maxLength",
      "minimum",
      "maximum",
      "minItems",
      "maxItems",
      "x-dmfaster-max-serialized-chars",
    ]) {
      if (
        schema[key] !== undefined &&
        (typeof schema[key] !== "number" || !Number.isFinite(schema[key]))
      )
        throw Error(`Invalid numeric constraint: ${key}`);
    }
    if (
      schema["x-dmfaster-trim"] !== undefined &&
      (schema.type !== "string" || schema["x-dmfaster-trim"] !== true)
    )
      throw Error("Trim requires a string schema and true");
    for (const value of schema.enum || (schema.const !== undefined ? [schema.const] : [])) {
      const type = value === null ? "null" : typeof value;
      if (
        !["string", "number", "boolean", "null"].includes(type) ||
        (schema.type &&
          schema.type !== type &&
          !(schema.type === "integer" && Number.isInteger(value)))
      )
        throw Error("Literal does not match its declared primitive type");
    }
    let result;
    if (schema.$ref) result = reference(schema.$ref);
    else if (schema.const !== undefined) result = `z.literal(${json(schema.const)})`;
    else if (schema.enum) {
      if (!schema.enum.length) throw Error("Empty enum");
      result = `z.union([${schema.enum.map((v) => `z.literal(${json(v)})`).join(",")}])`;
    } else if (schema.allOf) {
      if (!schema.allOf.length) throw Error("Empty allOf");
      result = schema.allOf.map(compile).reduce((a, b) => `z.intersection(${a},${b})`);
    } else if (schema.oneOf || schema.anyOf) {
      const variants = schema.oneOf || schema.anyOf;
      if (!variants.length) throw Error("Empty union");
      const expressions = variants.map(compile);
      result = `z.union([${expressions.join(",")}])`;
      // JSON Schema oneOf requires exactly one match, unlike a normal union.
      if (schema.oneOf)
        result += `.refine((value) => [${expressions.join(",")}].filter((candidate) => candidate.safeParse(value).success).length === 1, "Expected exactly one schema match")`;
    } else if (Array.isArray(schema.type)) {
      result = `z.union([${schema.type.map((type) => compile({ ...schema, type })).join(",")}])`;
    } else if (schema.type === "object") {
      const properties = Object.entries(schema.properties || {}).map(
        ([key, value]) =>
          `${json(key)}:${compile(value)}${schema.required?.includes(key) ? "" : ".optional()"}`,
      );
      if ((schema.required || []).some((key) => !Object.hasOwn(schema.properties || {}, key)))
        throw Error("Required property has no schema");
      if (schema.additionalProperties !== false)
        throw Error("Public input objects must reject unknown properties");
      result = `z.object({${properties.join(",")}}).strict()`;
    } else if (schema.type === "string") {
      result = "z.string()";
      if (schema["x-dmfaster-trim"]) result += ".trim()";
      if (schema.minLength !== undefined) result += `.min(${schema.minLength})`;
      if (schema.maxLength !== undefined) result += `.max(${schema.maxLength})`;
      if (schema.pattern) result += `.regex(new RegExp(${json(schema.pattern)}))`;
    } else if (schema.type === "number" || schema.type === "integer") {
      result = schema.type === "integer" ? "z.number().int()" : "z.number()";
      if (schema.minimum !== undefined) result += `.min(${schema.minimum})`;
      if (schema.maximum !== undefined) result += `.max(${schema.maximum})`;
    } else if (schema.type === "boolean") result = "z.boolean()";
    else if (schema.type === "null") result = "z.null()";
    else if (schema.type === "array") {
      if (!schema.items) throw Error("Array items must have a schema");
      result = `z.array(${compile(schema.items)})`;
      if (schema.minItems !== undefined) result += `.min(${schema.minItems})`;
      if (schema.maxItems !== undefined) result += `.max(${schema.maxItems})`;
    } else throw Error(`Unsupported input schema: ${json(schema)}`);
    if (schema["x-dmfaster-max-serialized-chars"])
      result += `.refine((value) => JSON.stringify(value).length <= ${schema["x-dmfaster-max-serialized-chars"]}, "Input exceeds its serialized size limit")`;
    if (schema.description) result += `.describe(${json(schema.description)})`;
    return result;
  }
  const names = [],
    definitions = {},
    policies = {},
    scopes = {},
    ownerOnly = [],
    inputs = [],
    data = [],
    mcpSchemas = [];
  const seenAliases = new Set();
  for (const [path, methods] of Object.entries(document.paths)) {
    if (!path.startsWith("/api/v1/agent/tools/")) continue;
    const name = path.split("/").at(-1),
      operation = methods.post;
    if (!operation || Object.keys(methods).some((method) => method !== "post"))
      throw Error(`Expected one POST tool: ${path}`);
    const effect = operation["x-dmfaster-effect"],
      approval = operation["x-dmfaster-approval"];
    const owner = operation["x-dmfaster-owner-only"],
      mcp = operation["x-dmfaster-mcp"],
      cli = operation["x-dmfaster-cli"];
    if (
      !["read", "draft", "write", "external"].includes(effect) ||
      !["none", "human_confirmation"].includes(approval) ||
      typeof owner !== "boolean"
    )
      throw Error(`Missing safety metadata: ${name}`);
    if (
      !mcp?.name ||
      !mcp.title ||
      !mcp.description ||
      !mcp.annotations ||
      !cli?.usage ||
      !cli.section
    )
      throw Error(`Missing adapter metadata: ${name}`);
    if (!/^[a-z][a-z0-9_]*$/.test(mcp.name) || seenAliases.has(mcp.name))
      throw Error(`Invalid or duplicate MCP alias: ${mcp.name}`);
    seenAliases.add(mcp.name);
    if (
      ["readOnlyHint", "destructiveHint", "idempotentHint", "openWorldHint"].some(
        (key) => typeof mcp.annotations[key] !== "boolean",
      ) ||
      mcp.annotations.openWorldHint !== (effect === "external") ||
      (effect === "external" && !mcp.annotations.destructiveHint) ||
      (["read", "draft"].includes(effect) && mcp.annotations.destructiveHint) ||
      (approval === "human_confirmation" && !["write", "external"].includes(effect))
    )
      throw Error(`Unsafe MCP annotations: ${name}`);

    if (
      mcp.annotations.readOnlyHint !== (effect === "read") ||
      (effect !== "read" && !owner) ||
      (effect === "external" && approval !== "human_confirmation")
    )
      throw Error(`Unsafe metadata: ${name}`);
    const requiredScopes = operation["x-dmfaster-required-scopes"];
    if (
      !requiredScopes?.length ||
      requiredScopes.some(
        (scope) => !document.components.schemas.AgentApiScope.enum.includes(scope),
      )
    )
      throw Error(`Invalid scopes: ${name}`);
    const command = name.split(".");
    if (!cli.usage.startsWith(command.join(" "))) throw Error(`CLI command mismatch: ${name}`);
    names.push(name);
    policies[name] = { effect, approval, exposure: "public_api" };
    scopes[name] = requiredScopes;
    if (owner) ownerOnly.push(name);
    definitions[name] = { mcp, cli: { ...cli, command } };
    const id = json(operation.operationId);
    inputs.push(`${json(name)}: operations[${id}]["requestBody"]["content"]["application/json"];`);
    data.push(
      `${json(name)}: NonNullable<operations[${id}]["responses"][200]["content"]["application/json"]["data"]>;`,
    );
    mcpSchemas.push(
      `${json(name)}: ${compile(operation.requestBody.content["application/json"].schema)}`,
    );
  }
  if (json(names) !== json(document.components.schemas.AgentToolName.enum))
    throw Error("AgentToolName enum differs from operations");
  // Also used by the optional MCP App; its shape comes from the same contract.
  reference("#/components/schemas/ResourceId");
  reference("#/components/schemas/AgentCampaignState");
  const common = `${header}export const AGENT_TOOL_NAMES = ${json(names)} as const;\nexport const AGENT_TOOL_POLICIES = Object.freeze(${json(policies)} as const);\nexport const AGENT_TOOL_SCOPES = ${json(scopes)} as const;\nexport const AGENT_OWNER_ONLY_TOOLS = ${json(ownerOnly)} as const;\n`;
  const artifacts = new Map([
    [
      "packages/sdk/src/generated/tools.ts",
      common + `export const AGENT_TOOL_DEFINITIONS = ${json(definitions)} as const;\n`,
    ],
    [
      "packages/sdk/src/generated/tool-types.ts",
      header +
        `import type { operations } from "./api.ts";\nexport type AgentToolInputMap = {${inputs.join("\n")}};\nexport type AgentToolDataMap = {${data.join("\n")}};\n`,
    ],
    [
      "packages/mcp-server/src/generated/input-schemas.ts",
      header +
        'import { z } from "zod";\n' +
        [...declarations.values()].join("\n") +
        `\nexport const AGENT_INPUT_SCHEMAS = {${mcpSchemas.join(",\n")}} as const;\n`,
    ],
    ["site/src/lib/agent-platform/public-contract.generated.ts", common],
  ]);
  if (!includeServer) artifacts.delete("site/src/lib/agent-platform/public-contract.generated.ts");
  return artifacts;
}
