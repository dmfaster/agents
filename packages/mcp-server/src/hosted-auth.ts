import { DmfasterHttpError } from "@dmfaster/sdk";

export type HostedAuth = {
  resourceMetadataUrl: string;
  grantedScopes: readonly string[];
};

export function oauthToolMetadata(auth: HostedAuth | undefined, scopes: readonly string[]) {
  return auth ? { securitySchemes: [{ type: "oauth2", scopes: [...scopes] }] } : {};
}

export function oauthFailureMetadata(
  error: unknown,
  auth: HostedAuth | undefined,
  scopes: readonly string[],
) {
  if (!auth || !(error instanceof DmfasterHttpError)) return {};
  const expired = error.status === 401;
  // The adapter also uses 403 for role/ownership denial. Reconnecting cannot
  // grant ownership, so challenge only a genuinely missing OAuth scope.
  const missingScope =
    error.code === "insufficient_scope" &&
    scopes.some((scope) => !auth.grantedScopes.includes(scope));
  if (!expired && !missingScope) return {};
  const quote = (value: string) => JSON.stringify(value);
  const challenge = [
    `Bearer resource_metadata=${quote(auth.resourceMetadataUrl)}`,
    `error=${quote(expired ? "invalid_token" : "insufficient_scope")}`,
    `error_description=${quote(expired ? "Reconnect DM Faster to renew access." : "Approve the required DM Faster permissions to continue.")}`,
    ...(scopes.length ? [`scope=${quote(scopes.join(" "))}`] : []),
  ].join(", ");
  return { _meta: { "mcp/www_authenticate": [challenge] } };
}
