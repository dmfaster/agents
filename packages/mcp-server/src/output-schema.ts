import { z } from "zod";

type JsonSchema = z.core.JSONSchema.JSONSchema;

/** Keep shared contract data once; compile only schemas a caller validates or describes. */
export function lazyOutputSchema(root: JsonSchema, definitions: Record<string, JsonSchema>) {
  let compiled: z.ZodType | undefined;
  return z.lazy(() => {
    if (compiled) return compiled;
    const selected: Record<string, JsonSchema> = {};
    function collect(value: unknown) {
      if (Array.isArray(value)) {
        value.forEach(collect);
        return;
      }
      if (!value || typeof value !== "object") return;
      if ("$ref" in value && typeof value.$ref === "string") {
        const name = /^#\/\$defs\/([A-Za-z][A-Za-z0-9]*)$/.exec(value.$ref)?.[1];
        if (!name || !Object.hasOwn(definitions, name))
          throw new Error(`Missing output schema reference: ${value.$ref}`);
        if (!Object.hasOwn(selected, name)) {
          selected[name] = definitions[name]!;
          collect(selected[name]);
        }
      }
      Object.values(value).forEach(collect);
    }
    collect(root);
    compiled = z.fromJSONSchema({ ...root, $defs: selected });
    return compiled;
  });
}
