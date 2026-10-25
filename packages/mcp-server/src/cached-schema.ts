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
      const description = convert(options);
      descriptions.set(options.target, description);
      return description;
    };
  };
  type Result = Awaited<ReturnType<typeof standard.validate>>;
  const shorten = (result: Result): Result =>
    result.issues
      ? {
          issues: result.issues.slice(0, 5).map((issue) => ({
            ...issue,
            message: shortIssueMessage(issue.message),
          })),
        }
      : result;
  const cached = {
    "~standard": {
      ...standard,
      // Long enum dumps (for example every supported country) become a one-line hint.
      validate: (value: unknown) => {
        const result = standard.validate(value);
        return result instanceof Promise ? result.then(shorten) : shorten(result);
      },
      jsonSchema: {
        input: memoize(standard.jsonSchema.input),
        output: memoize(standard.jsonSchema.output),
      },
    },
  };
  schemas.set(schema, cached);
  return cached;
}

export function shortIssueMessage(message: string) {
  if (message.length <= 160) return message;
  const head = message
    .split(/: expected one of|expected one of/i)[0]!
    .slice(0, 80)
    .trim();
  return `${head || "Invalid value"}. Use tools_discover with includeSchema:true for allowed values.`;
}
