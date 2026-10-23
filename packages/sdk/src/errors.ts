import { AGENT_ERROR_CATALOG } from "./generated/tools.ts";

export function agentErrorRecovery(code: string, retryable: boolean) {
  const entry = (AGENT_ERROR_CATALOG as Record<string, { nextAction: string; docsUrl: string }>)[
    code
  ];
  return (
    entry || {
      nextAction: retryable
        ? "Retry after a short delay with the same idempotency key; inspect any accepted action first."
        : "Review the error and the tool documentation, inspect the current resource, and correct the request before retrying.",
      docsUrl: "https://dmfaster.com/docs/agents#errors",
    }
  );
}

export class DmfasterSdkError extends Error {
  readonly code: string;

  constructor(message: string, code: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "DmfasterSdkError";
    this.code = code;
  }
}

/** An in-process server adapter failed; this is not a remote network failure. */
export class DmfasterAdapterError extends DmfasterSdkError {
  readonly retryable = false;
  readonly requestId: string;
  constructor(requestId: string, options?: ErrorOptions) {
    super(
      "DM Faster could not execute the tool request because its server adapter failed. Contact support with the request reference.",
      "request_adapter_error",
      options,
    );
    this.name = "DmfasterAdapterError";
    this.requestId = requestId;
  }
}

export class DmfasterHttpError extends DmfasterSdkError {
  readonly status: number;
  readonly responseBody: unknown;
  readonly retryable: boolean | null;
  readonly requestId: string | null;
  readonly retryAfterSeconds: number | null;
  readonly details: Record<string, unknown> | null;
  readonly nextAction: string | null;
  readonly docsUrl: string | null;

  constructor(input: {
    message: string;
    status: number;
    responseBody: unknown;
    code?: string;
    retryable?: boolean | null;
    requestId?: string | null;
    retryAfterSeconds?: number | null;
    details?: Record<string, unknown> | null;
    nextAction?: string | null;
    docsUrl?: string | null;
  }) {
    super(input.message, input.code || "http_error");
    this.name = "DmfasterHttpError";
    this.status = input.status;
    this.responseBody = input.responseBody;
    this.retryable = input.retryable ?? null;
    this.requestId = input.requestId ?? null;
    this.retryAfterSeconds = input.retryAfterSeconds ?? null;
    this.details = input.details ?? null;
    this.nextAction = input.nextAction ?? null;
    this.docsUrl = input.docsUrl ?? null;
  }
}

export class DmfasterTimeoutError extends DmfasterSdkError {
  readonly timeoutMs: number;

  constructor(timeoutMs: number, options?: ErrorOptions) {
    super(`DM Faster request timed out after ${timeoutMs} ms.`, "request_timeout", options);
    this.name = "DmfasterTimeoutError";
    this.timeoutMs = timeoutMs;
  }
}

export class DmfasterProtocolError extends DmfasterSdkError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, "invalid_response", options);
    this.name = "DmfasterProtocolError";
  }
}
