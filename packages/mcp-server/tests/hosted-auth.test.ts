import assert from "node:assert/strict";
import test from "node:test";
import { DmfasterHttpError } from "@dmfaster/sdk";
import { oauthToolMetadata, oauthFailureMetadata } from "../src/hosted-auth.ts";

const auth = {
  resourceMetadataUrl: "https://app.dmfaster.test/.well-known/oauth-protected-resource/mcp",
  grantedScopes: ["workspace:read"],
};
const denied = new DmfasterHttpError({
  status: 403,
  code: "insufficient_scope",
  message: "Denied",
  responseBody: {},
});

test("OAuth challenges require missing scopes and never turn role denial into consent loops", () => {
  const challenge = oauthFailureMetadata(denied, auth, ["campaigns:read"])._meta?.[
    "mcp/www_authenticate"
  ]?.[0];
  assert.ok(challenge);
  assert.match(challenge, /error="insufficient_scope"/);
  assert.match(challenge, /scope="campaigns:read"/);
  assert.match(challenge, /error_description=/);
  assert.ok(challenge.includes(auth.resourceMetadataUrl));
  assert.deepEqual(
    oauthFailureMetadata(denied, { ...auth, grantedScopes: ["campaigns:read"] }, [
      "campaigns:read",
    ]),
    {},
  );
  assert.deepEqual(oauthFailureMetadata(denied, undefined, ["campaigns:read"]), {});
  assert.deepEqual(oauthFailureMetadata(new Error("Network failure"), auth, []), {});
});

test("expired grants request reauthorization, while local tools have no OAuth declarations", () => {
  const expired = new DmfasterHttpError({ status: 401, message: "Expired", responseBody: {} });
  assert.match(JSON.stringify(oauthFailureMetadata(expired, auth, [])), /invalid_token/);
  assert.deepEqual(oauthToolMetadata(undefined, ["campaigns:read"]), {});
  assert.deepEqual(oauthToolMetadata(auth, ["campaigns:read"]), {
    securitySchemes: [{ type: "oauth2", scopes: ["campaigns:read"] }],
  });
});
