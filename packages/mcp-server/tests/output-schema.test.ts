import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { z } from "zod";
import { lazyOutputSchema } from "../src/output-schema.ts";
import { AGENT_OUTPUT_SCHEMAS } from "../src/generated/output-schemas.ts";

test("every lazy output schema preserves the full canonical contract in both directions", () => {
  const contract = parse(
    readFileSync(new URL("../../public-api/openapi.yaml", import.meta.url), "utf8"),
  );
  const names: string[] = [];
  for (const [path, methods] of Object.entries(contract.paths) as [string, any][]) {
    if (!path.startsWith("/api/v1/agent/tools/")) continue;
    const name = path.slice("/api/v1/agent/tools/".length) as keyof typeof AGENT_OUTPUT_SCHEMAS;
    names.push(name);
    // Independent eager reference implementation: the original per-tool bundling.
    const definitions: Record<string, any> = {};
    function convert(value: any): any {
      if (Array.isArray(value)) return value.map(convert);
      if (!value || typeof value !== "object") return value;
      if (typeof value.$ref === "string") {
        const key = value.$ref.split("/").at(-1);
        if (!Object.hasOwn(definitions, key)) {
          definitions[key] = null;
          definitions[key] = convert(contract.components.schemas[key]);
        }
        return { ...value, $ref: `#/$defs/${key}` };
      }
      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, convert(item)]));
    }
    const root = convert(methods.post.responses["200"].content["application/json"].schema);
    const eager = z.fromJSONSchema({ ...root, $defs: definitions });
    const lazy = AGENT_OUTPUT_SCHEMAS[name];
    for (const direction of ["input", "output"] as const) {
      for (const target of ["draft-2020-12", "draft-07"] as const) {
        assert.deepEqual(
          lazy["~standard"].jsonSchema[direction]({ target }),
          eager["~standard"].jsonSchema[direction]({ target }),
          `${name} ${direction} ${target}`,
        );
      }
    }
    for (const invalid of [null, {}, { ok: "yes" }])
      assert.equal(lazy.safeParse(invalid).success, eager.safeParse(invalid).success, name);
  }
  assert.deepEqual(Object.keys(AGENT_OUTPUT_SCHEMAS), names);
});

test("unused definitions stay unconstructed while validation retains strictness and references", () => {
  let reads = 0;
  const definitions = {
    Result: {
      type: "object",
      additionalProperties: false,
      required: ["value"],
      properties: { value: { type: "integer", minimum: 1 } },
    },
    get Unused() {
      reads++;
      throw new Error("Unused contract compiled");
    },
  } as Record<string, z.core.JSONSchema.JSONSchema>;
  const schema = lazyOutputSchema({ $ref: "#/$defs/Result" }, definitions);
  assert.equal(reads, 0);
  assert.deepEqual(schema.parse({ value: 1 }), { value: 1 });
  for (const value of [{ value: 0 }, { value: "1" }, { value: 1, unexpected: true }])
    assert.equal(schema.safeParse(value).success, false);
  assert.equal(reads, 0);
  assert.throws(
    () => lazyOutputSchema({ $ref: "#/$defs/Missing" }, {}).parse({}),
    /Missing output schema/,
  );
});

test("campaign navigation URLs allow HTTPS and loopback HTTP only", () => {
  const contract = parse(
    readFileSync(new URL("../../public-api/openapi.yaml", import.meta.url), "utf8"),
  );
  for (const [name, field] of [
    ["CampaignActionApprovalRequiredOutput", "approvalUrl"],
    ["BrowserWorkerSetupRequirement", "setupUrl"],
  ]) {
    const schema = z.fromJSONSchema(contract.components.schemas[name].properties[field]);
    for (const url of [
      "https://app.dmfaster.com/campaigns",
      "http://localhost:3060/campaigns",
      "http://127.0.0.1:3060/campaigns",
      "http://[::1]:3060/campaigns",
    ]) {
      assert.equal(schema.safeParse(url).success, true, url);
    }
    for (const url of [
      "http://app.dmfaster.com/campaigns",
      "http://localhost.evil.test/",
      "http://127.0.0.1@evil.test/",
      "http://127.0.0.10/",
      "javascript:alert(1)",
    ]) {
      assert.equal(schema.safeParse(url).success, false, url);
    }
  }
});
