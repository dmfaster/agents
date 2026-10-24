import assert from "node:assert/strict";
import test from "node:test";
import { createDmfasterClient, DmfasterHttpError } from "@dmfaster/sdk";
import { toolFailure } from "../src/core.ts";
import { toolFailureSchema } from "../src/presentation-schemas.ts";

test("a fake recorder 403 keeps scope and recovery metadata across SDK and MCP", async () => {
  const client = createDmfasterClient({
    baseUrl: "https://example.test",
    token: "synthetic",
    fetch: async () =>
      Response.json(
        {
          error: {
            code: "call_access_denied",
            message: "Call is not shared",
            retryable: false,
            requiredScope: "calls:transcripts:read",
            reason: "no_call_access",
            setupUrl: "https://example.test/settings",
            requiredConnection: "calendar",
            retryAfterMs: 1200,
            nextAction: "Ask the organizer to share",
            docsUrl: "https://example.test/docs",
          },
        },
        { status: 403 },
      ),
  });
  await assert.rejects(
    client.invoke("call.transcript.get", { meetingId: "fake-meeting" }),
    (error) => {
      assert.ok(error instanceof DmfasterHttpError);
      assert.equal(error.requiredScope, "calls:transcripts:read");
      const failure = toolFailure(error);
      const body = toolFailureSchema.parse(failure.structuredContent);
      assert.equal(body.error.requiredScope, "calls:transcripts:read");
      assert.equal(body.error.reason, "no_call_access");
      assert.equal(body.error.retryAfterMs, 1200);
      assert.equal(body.error.status, 403);
      return true;
    },
  );
});
