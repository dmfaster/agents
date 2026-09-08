import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { compileAgentContract } from "./lib/agent-contract-generation.mjs";
const original = parse(
  readFileSync(new URL("../packages/public-api/openapi.yaml", import.meta.url), "utf8"),
);
const contract = () => structuredClone(original);

test("generation is deterministic and includes every adapter without private code", () => {
  const first = compileAgentContract(contract()),
    second = compileAgentContract(contract());
  assert.deepEqual(first, second);
  assert.equal(first.size, 3);
  assert.equal(compileAgentContract(contract(), { includeServer: true }).size, 5);
  assert.equal(
    compileAgentContract(contract(), { includeServer: true }).get(
      "site/src/lib/agent-platform/public-input-schemas.generated.ts",
    ),
    first.get("packages/mcp-server/src/generated/input-schemas.ts"),
  );
  for (const source of first.values()) {
    assert.match(source, /Generated from packages\/public-api\/openapi.yaml/);
    assert.doesNotMatch(source, /DATABASE_URL|browser_worker_token|site\/src\/lib\/server/);
  }
  assert.match(first.get("packages/sdk/src/generated/tool-types.ts"), /operations\["listImport"\]/);
  assert.match(first.get("packages/mcp-server/src/generated/input-schemas.ts"), /\.strict\(\)/);
});

test("a contract-only tool addition flows to SDK, MCP and server catalogs", () => {
  const d = contract();
  const op = structuredClone(d.paths["/api/v1/agent/tools/workspace.briefing"].post);
  op.operationId = "workspaceExample";
  op["x-dmfaster-mcp"].name = "workspace_example";
  op["x-dmfaster-cli"].usage = "workspace example";
  d.paths["/api/v1/agent/tools/workspace.example"] = { post: op };
  d.components.schemas.AgentToolName.enum.push("workspace.example");
  const outputs = compileAgentContract(d);
  for (const source of outputs.values()) assert.match(source, /workspace\.example/);
  assert.match(outputs.get("packages/sdk/src/generated/tools.ts"), /workspace example/);
});

test("unknown schema keywords, references and cycles fail instead of weakening validation", () => {
  for (const mutate of [
    (d) => (d.components.schemas.ListImportInput.properties.usernames.uniqueItems = true),
    (d) =>
      (d.components.schemas.ListImportInput.properties.name = {
        $ref: "https://external.invalid/schema",
      }),
    (d) =>
      (d.components.schemas.ListImportInput.properties.name = {
        $ref: "#/components/schemas/Missing",
      }),
    (d) =>
      (d.components.schemas.ListImportInput.properties.name = {
        $ref: "#/components/schemas/ListImportInput",
      }),
    (d) => delete d.components.schemas.ListImportInput.additionalProperties,
    (d) => {
      d.components.schemas.ResourceId.enum = ["id"];
    },
    (d) => {
      d.components.schemas.AgentBusinessProfile.properties.version.type = "string";
    },
    (d) => {
      d.components.schemas.ResourceId.maxLength = "not-a-number";
    },
  ]) {
    const d = contract();
    mutate(d);
    assert.throws(() => compileAgentContract(d));
  }
});

test("missing permissions, unsafe action hints and duplicate aliases fail generation", () => {
  for (const mutate of [
    (op) => delete op["x-dmfaster-approval"],
    (op) => (op["x-dmfaster-required-scopes"] = ["unknown:scope"]),
    (op) => (op["x-dmfaster-owner-only"] = false),
    (op) => (op["x-dmfaster-mcp"].annotations.readOnlyHint = true),
    (op) => (op["x-dmfaster-mcp"].name = "workspace_briefing"),
    (op) => delete op["x-dmfaster-cli"],
  ]) {
    const d = contract();
    mutate(d.paths["/api/v1/agent/tools/list.import"].post);
    assert.throws(() => compileAgentContract(d));
  }
});

test("object minimum properties are enforced and invalid constraints fail generation", () => {
  const source = compileAgentContract(contract()).get(
    "packages/mcp-server/src/generated/input-schemas.ts",
  );
  assert.match(source, /Object.keys\(value\).length >= 1/);
  for (const value of [-1, 0.5, "1"]) {
    const d = contract();
    d.components.schemas.CampaignDraftUpdateInput.properties.updates.minProperties = value;
    assert.throws(() => compileAgentContract(d));
  }
});
