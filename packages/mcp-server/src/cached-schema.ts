import type { z } from "zod";

type McpSchema = Pick<z.ZodType, "~standard">;
const schemas = new WeakMap<z.ZodType, McpSchema>();

/** Reuse public schema descriptions, never a server, callback or account state. */
export function cachedMcpSchema(schema: z.ZodType): McpSchema {
  const existing = schemas.get(schema);
  if (existing) return existing;

  const standard = schema["~standard"];
  const memoize = (convert: typeof standard.jsonSchema.input) => {
    const descriptions = new Map<string, ReturnType<typeof convert>>();
    return (options: Parameters<typeof convert>[0]) => {
      // Additional conversion options may contain functions. Do not collapse
      // them into a JSON key or accidentally reuse another caller's settings.
      if (Object.keys(options).some((key) => key !== "target")) return convert(options);
      const existing = descriptions.get(options.target);
      if (existing) return existing;
      const description = compactSchema(convert(options));
      descriptions.set(options.target, description);
      return description;
    };
  };
  const cached = {
    "~standard": {
      ...standard,
      jsonSchema: {
        input: memoize(standard.jsonSchema.input),
        output: memoize(standard.jsonSchema.output),
      },
    },
  };
  schemas.set(schema, cached);
  return cached;
}

/** Equivalent enum forms avoid repeating scalar const branches in every tool. */
function compactSchema<T>(value: T): T {
  if (Array.isArray(value)) return value.map(compactSchema) as T;
  if (!value || typeof value !== "object") return value;
  const node = value as Record<string, unknown>;
  const alternatives = node.anyOf || node.oneOf;
  if (
    Array.isArray(alternatives) &&
    alternatives.length &&
    alternatives.every(
      (v) =>
        v &&
        typeof v === "object" &&
        Object.keys(v).every((k) => ["const", "type"].includes(k)) &&
        "const" in v,
    )
  ) {
    const constants = alternatives.map((v) => v.const);
    if (new Set(constants.map((v) => JSON.stringify(v))).size === constants.length) {
      const { anyOf: _a, oneOf: _o, ...rest } = node;
      return { ...rest, enum: constants } as T;
    }
  }
  return Object.fromEntries(Object.entries(node).map(([key, v]) => [key, compactSchema(v)])) as T;
}
