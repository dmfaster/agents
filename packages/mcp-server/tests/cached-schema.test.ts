import assert from "node:assert/strict";
import test from "node:test";
import { z } from "zod";
import { cachedMcpSchema } from "../src/cached-schema.ts";
import { AGENT_INPUT_SCHEMAS } from "../src/generated/input-schemas.ts";
import { AGENT_OUTPUT_SCHEMAS } from "../src/generated/output-schemas.ts";

test("cached descriptions preserve every public input and output schema", () => {
  for (const schema of [
    ...Object.values(AGENT_INPUT_SCHEMAS),
    ...Object.values(AGENT_OUTPUT_SCHEMAS),
  ]) {
    const cached = cachedMcpSchema(schema);
    assert.equal(cachedMcpSchema(schema), cached);
    for (const direction of ["input", "output"] as const) {
      for (const target of ["draft-2020-12", "draft-07"] as const) {
        const description = cached["~standard"].jsonSchema[direction]({ target });
        assert.deepEqual(description, schema["~standard"].jsonSchema[direction]({ target }));
        assert.equal(cached["~standard"].jsonSchema[direction]({ target }), description);
      }
    }
  }
});

test("description reuse does not cache validation or bypass strictness and refinements", async () => {
  let validations = 0;
  const schema = z
    .object({ value: z.string() })
    .strict()
    .refine(async ({ value }) => {
      validations += 1;
      return value === "allowed";
    });
  const cached = cachedMcpSchema(schema)["~standard"];
  assert.deepEqual(await cached.validate({ value: "allowed" }), { value: { value: "allowed" } });
  const afterFirst = validations;
  assert.ok((await cached.validate({ value: "denied" })).issues);
  assert.ok(validations > afterFirst);
  const afterDenied = validations;
  assert.deepEqual(await cached.validate({ value: "allowed" }), { value: { value: "allowed" } });
  assert.ok(validations > afterDenied);
  assert.ok((await cached.validate({ value: "allowed", unexpected: true })).issues);
});

test("schema identity, direction, target and custom converter settings stay separate", () => {
  const schema = z.object({ value: z.string().default("default") });
  const other = cachedMcpSchema(z.object({ value: z.number() }))["~standard"];
  const cached = cachedMcpSchema(schema)["~standard"].jsonSchema;
  const options = { target: "draft-2020-12" };
  assert.notDeepEqual(cached.input(options), cached.output(options));
  assert.notDeepEqual(cached.input(options), other.jsonSchema.input(options));
  assert.notDeepEqual(cached.input(options), cached.input({ target: "draft-07" }));
  const custom = { ...options, libraryOptions: { unrepresentable: "any" } };
  assert.deepEqual(cached.input(custom), schema["~standard"].jsonSchema.input(custom));
  assert.notEqual(cached.input(custom), cached.input(custom));
});

test("a failing conversion cannot leave a cached successful description", () => {
  const cached = cachedMcpSchema(z.object({ value: z.date() }))["~standard"].jsonSchema;
  for (let i = 0; i < 2; i += 1) assert.throws(() => cached.output({ target: "draft-2020-12" }));
});
