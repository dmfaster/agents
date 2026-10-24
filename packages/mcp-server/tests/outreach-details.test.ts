import assert from "node:assert/strict";
import test from "node:test";
import {
  CLIENT_CAPABILITIES_META_KEY,
  PROTOCOL_VERSION_META_KEY,
  type ServerContext,
} from "@modelcontextprotocol/server";
import type { AgentToolResult } from "@dmfaster/sdk";
import type { AgentInvoker } from "../src/tools.ts";
import { collectOutreachDetails } from "../src/outreach-details.ts";
const senders = {
  emailAvailable: true,
  mailboxes: [
    {
      id: "mailbox",
      emailAddress: "owner@example.invalid",
      status: "healthy",
      sendEnabled: true,
      canSend: true,
      needsReauthorization: false,
    },
  ],
  browserProfiles: [],
  sms: { available: false, configured: false, enabled: false, phoneNumber: "" },
};
function fixture() {
  const calls: string[] = [];
  const client: AgentInvoker = {
    async invoke(tool) {
      calls.push(tool);
      return { ok: true, data: structuredClone(senders) } as unknown as AgentToolResult;
    },
  };
  return { client, calls };
}
function context(capabilities: unknown, answer?: unknown): ServerContext {
  return {
    mcpReq: {
      envelope: {
        [CLIENT_CAPABILITIES_META_KEY]: capabilities,
        [PROTOCOL_VERSION_META_KEY]: "2026-07-28",
      },
      inputResponses: answer ? { outreach: answer } : undefined,
    },
  } as unknown as ServerContext;
}
const details = {
  channel: "gmail",
  name: "Agency outreach",
  body: "Hello there",
  subject: "A question",
  mailboxId: "mailbox",
  dailyCap: 20,
};
test("modern extended forms return input_required with both capability gates and the schema in metadata", async () => {
  const { client, calls } = fixture();
  const result = await collectOutreachDetails(
    client,
    {},
    context({ elicitation: { form: {} }, extensions: { "openai/elicitation": { form: {} } } }),
  );
  assert.equal(result.resultType, "input_required");
  assert.equal("requestState" in result, false);
  const request = result.inputRequests!.outreach!;
  assert.equal(request.method, "elicitation/create");
  const params = request.params as Record<string, any>;
  assert.deepEqual(params.requestedSchema, { type: "object", properties: {} });
  assert(params._meta["openai/elicitation"].requestedSchema.properties.mailboxId);
  assert.deepEqual(calls, ["senders.inspect"]);
});
test("standard forms use the core schema and never advertise unavailable email or SMS choices", async () => {
  const { client } = fixture();
  const result = await collectOutreachDetails(client, {}, context({ elicitation: { form: {} } }));
  const params = result.inputRequests!.outreach!.params as Record<string, any>;
  assert.equal(params._meta, undefined);
  assert(!params.requestedSchema.properties.channel.oneOf.some((v: any) => v.const === "sms"));
});
test("unsupported hosts receive a chat fallback without sender reads or side effects", async () => {
  const { client, calls } = fixture();
  for (const capabilities of [{}, { extensions: { "openai/elicitation": { form: {} } } }]) {
    const result = await collectOutreachDetails(client, {}, context(capabilities));
    assert.equal(result.structuredContent!.status, "unsupported");
  }
  assert.deepEqual(calls, []);
  const legacy = context({ elicitation: { form: {} } });
  (legacy.mcpReq.envelope as Record<string, unknown>)[PROTOCOL_VERSION_META_KEY] = "2025-11-25";
  assert.equal(
    (await collectOutreachDetails(client, {}, legacy)).structuredContent!.status,
    "unsupported",
  );
  assert.deepEqual(calls, []);
});
test("resumed answers recheck senders, validate identities and return review-only typed details", async () => {
  const { client, calls } = fixture();
  const result = await collectOutreachDetails(
    client,
    {},
    context({ elicitation: { form: {} } }, { action: "accept", content: details }),
  );
  assert.deepEqual(result.structuredContent, {
    status: "collected",
    details,
    contextOnly: true,
    preparationStartsSending: false,
  });
  assert.deepEqual(calls, ["senders.inspect"]);
  for (const invalid of [
    { ...details, mailboxId: "foreign" },
    { ...details, subject: "" },
    { ...details, dailyCap: -1 },
    { ...details, channel: "sms" },
    { ...details, launch: true },
  ]) {
    await assert.rejects(
      collectOutreachDetails(
        client,
        {},
        context({ elicitation: { form: {} } }, { action: "accept", content: invalid }),
      ),
    );
  }
});
test("cancel and decline never prepare a draft and non-email answers discard hidden email fields", async () => {
  const { client, calls } = fixture();
  for (const action of ["decline", "cancel"]) {
    const result = await collectOutreachDetails(
      client,
      {},
      context({ elicitation: { form: {} } }, { action }),
    );
    assert.equal(result.structuredContent!.status, "cancelled");
  }
  const result = await collectOutreachDetails(
    client,
    {},
    context(
      { elicitation: { form: {} } },
      { action: "accept", content: { ...details, channel: "instagram" } },
    ),
  );
  assert.equal((result.structuredContent!.details as Record<string, unknown>).mailboxId, undefined);
  assert(calls.every((tool) => tool === "senders.inspect"));
});
