import type { AgentToolInputMap, AgentToolName, AgentToolResult } from "./contracts.ts";
import type { AgentToolDataMap } from "./contracts.ts";
import { DmfasterHttpError, DmfasterSdkError } from "./errors.ts";

type Client = {
  invoke<Name extends AgentToolName>(
    tool: Name,
    input: AgentToolInputMap[Name],
    options?: { signal?: AbortSignal },
  ): Promise<AgentToolResult>;
};
export type CompanyFitProgress = AgentToolDataMap["companies.fit.status"]["progress"];
export type CompanyFitRunOptions = {
  signal?: AbortSignal;
  maxDurationMs?: number;
  limit?: number;
  maxRetries?: number;
  onProgress?: (progress: CompanyFitProgress) => void;
  /** Injectable clock and sleeper make recovery behavior testable without real waits. */
  now?: () => number;
  sleep?: (ms: number, signal?: AbortSignal) => Promise<void>;
};
function validateFitProgress(progress: CompanyFitProgress) {
  const counts = [
    progress?.total,
    progress?.complete,
    progress?.pending,
    progress?.processing,
    progress?.strong,
    progress?.possible,
    progress?.poor,
    progress?.unknown,
  ];
  if (
    !progress ||
    counts.some((value) => !Number.isInteger(value) || value < 0) ||
    progress.total < 1 ||
    progress.total > 25000 ||
    progress.complete + progress.pending + progress.processing !== progress.total ||
    progress.strong + progress.possible + progress.poor + progress.unknown !== progress.complete ||
    !/^[a-f0-9]{64}$/.test(progress.version) ||
    !["ready", "cancelled", "stale", "initializing"].includes(progress.status) ||
    progress.readyForProposal !==
      (progress.status === "ready" && progress.complete === progress.total)
  )
    throw new DmfasterSdkError(
      "Review progress did not reconcile to exact saved counts.",
      "review_count_mismatch",
    );
}
const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DmfasterSdkError("Review wait aborted.", "request_aborted"));
      return;
    }
    const aborted = () => {
      clearTimeout(timer);
      reject(new DmfasterSdkError("Review wait aborted.", "request_aborted"));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", aborted);
      resolve();
    }, ms);
    signal?.addEventListener("abort", aborted, { once: true });
  });
const retryable = (error: unknown) =>
  error instanceof DmfasterHttpError
    ? error.retryable === true
    : error instanceof DmfasterSdkError &&
      ["network_error", "request_timeout"].includes(error.code);

/** Only the durable review operations are retried, using the same run identity. */
export async function runCompanyFitReview(
  client: Client,
  runId: string,
  options: CompanyFitRunOptions = {},
) {
  const now = options.now || Date.now,
    pause = options.sleep || sleep;
  const duration = options.maxDurationMs ?? 30 * 60_000,
    maxRetries = options.maxRetries ?? 5;
  if (
    !runId ||
    !Number.isInteger(duration) ||
    duration < 1000 ||
    duration > 30 * 60_000 ||
    !Number.isInteger(maxRetries) ||
    maxRetries < 0 ||
    maxRetries > 5 ||
    (options.limit !== undefined &&
      (!Number.isInteger(options.limit) || options.limit < 1 || options.limit > 8))
  )
    throw new DmfasterSdkError(
      "Use a run ID and bounded review options.",
      "invalid_review_options",
    );
  const deadline = now() + duration;
  const combined = AbortSignal.any([
    AbortSignal.timeout(duration),
    ...(options.signal ? [options.signal] : []),
  ]);
  let last: CompanyFitProgress | null = null,
    failures = 0,
    stalled = 0;
  while (now() < deadline && !combined.aborted) {
    try {
      const result = await client.invoke(
        "companies.fit.run",
        { runId, limit: options.limit || 8 },
        { signal: combined },
      );
      if (!result.ok || !result.data) {
        if (result.error?.retryable)
          throw new DmfasterHttpError({
            message: result.error.message,
            status: 503,
            code: result.error.code,
            retryable: true,
            responseBody: result,
          });
        throw new DmfasterSdkError(
          result.error?.message || "Review operation failed.",
          result.error?.code || "review_failed",
        );
      }
      const next = (result.data as AgentToolDataMap["companies.fit.run"]).progress;
      validateFitProgress(next);
      if (
        next.runId !== runId ||
        (last && (next.total !== last.total || next.complete < last.complete))
      )
        throw new DmfasterSdkError(
          "Review identity or exact progress changed unexpectedly.",
          "review_count_mismatch",
        );
      stalled = last && next.complete === last.complete && !next.processing ? stalled + 1 : 0;
      last = next;
      failures = 0;
      options.onProgress?.(next);
      if (next.readyForProposal) return { runId, progress: next, stopReason: "complete" as const };
      if (next.status === "cancelled")
        return { runId, progress: next, stopReason: "cancelled" as const };
      if (next.status !== "ready")
        throw new DmfasterSdkError(
          "This review needs initialization or a fresh audience snapshot.",
          "review_not_ready",
        );
      if (stalled >= 5)
        throw new DmfasterSdkError(
          "Review made no progress. Inspect this run before resuming.",
          "review_stalled",
        );
      await pause(
        Math.min(Math.max(250, next.pollAfterMs), Math.max(0, deadline - now())),
        combined,
      );
    } catch (error) {
      if (combined.aborted && !options.signal?.aborted) break;
      if (!retryable(error) || ++failures > maxRetries) throw error;
      const retryAfter =
        error instanceof DmfasterHttpError ? (error.retryAfterSeconds || 0) * 1000 : 0;
      try {
        await pause(
          Math.min(Math.max(retryAfter, 500 * 2 ** (failures - 1)), Math.max(0, deadline - now())),
          combined,
        );
      } catch (waitError) {
        if (combined.aborted && !options.signal?.aborted) break;
        throw waitError;
      }
    }
  }
  if (options.signal?.aborted)
    throw new DmfasterSdkError("Review interrupted; resume the same run ID.", "request_aborted");
  return { runId, progress: last, stopReason: "budget" as const };
}

/** Fully reconcile a completed review before yielding an export to a caller. */
export async function collectCompanyFitResults(
  client: Client,
  runId: string,
  options: { signal?: AbortSignal; includeEvidence?: boolean } = {},
) {
  // Read retries preserve the same run and snapshot version; a partial export is never returned.
  const read = async <Name extends AgentToolName>(tool: Name, input: AgentToolInputMap[Name]) => {
    for (let attempt = 0; ; attempt++) {
      try {
        const result = await client.invoke(tool, input, options);
        if (!result.ok && result.error?.retryable)
          throw new DmfasterHttpError({
            message: result.error.message,
            status: 503,
            code: result.error.code,
            retryable: true,
            responseBody: result,
          });
        return result;
      } catch (error) {
        if (!retryable(error) || attempt >= 3 || options.signal?.aborted) throw error;
        const delay = Math.max(
          500 * 2 ** attempt,
          error instanceof DmfasterHttpError ? (error.retryAfterSeconds || 0) * 1000 : 0,
        );
        if (delay > 30_000)
          throw new DmfasterSdkError(
            "The server requested a longer wait; retry the complete export later.",
            "review_export_retry_later",
          );
        await sleep(delay, options.signal);
      }
    }
  };
  const first = await read("companies.fit.status", { runId });
  const data = first.data as AgentToolDataMap["companies.fit.status"] | null;
  if (!first.ok || !data?.progress.readyForProposal)
    throw new DmfasterSdkError(
      "Finish the review before exporting its complete results.",
      "review_incomplete",
    );
  const progress = data.progress;
  validateFitProgress(progress);
  if (progress.runId !== runId)
    throw new DmfasterSdkError("Review identity changed.", "review_export_invalid");
  const items: AgentToolDataMap["companies.fit.results"]["items"] = [];
  const seen = new Set<string>();
  let offset = 0;
  while (items.length < progress.total) {
    const result = await read("companies.fit.results", {
      runId,
      offset,
      limit: 100,
      sort: "priority",
      expectedComplete: progress.complete,
      expectedVersion: progress.version,
      includeEvidence: options.includeEvidence !== false,
    });
    if (!result.ok || !result.data)
      throw new DmfasterSdkError(
        result.error?.message || "Result page failed.",
        result.error?.code || "review_export_failed",
      );
    const page = result.data as AgentToolDataMap["companies.fit.results"];
    validateFitProgress({
      ...page.progress,
      version: page.progressVersion || "",
      maxPages: progress.maxPages,
      pollAfterMs: progress.pollAfterMs,
      expiresAt: progress.expiresAt,
    });
    if (
      page.progress.runId !== runId ||
      page.progressVersion !== progress.version ||
      page.totalMatching !== progress.total ||
      !Array.isArray(page.items) ||
      !page.items.length
    )
      throw new DmfasterSdkError(
        "The review changed or a page is incomplete; restart the export.",
        "review_export_changed",
      );
    for (const item of page.items) {
      const identity = `${item.country}:${item.businessId}`;
      if (!item.country || !item.businessId || seen.has(identity) || item.status !== "complete")
        throw new DmfasterSdkError(
          "Review results are duplicated or incomplete.",
          "review_export_invalid",
        );
      seen.add(identity);
      items.push(item);
    }
    if (page.nextOffset === null) break;
    if (page.nextOffset !== offset + page.items.length)
      throw new DmfasterSdkError("Review pagination stalled.", "review_export_invalid");
    offset = page.nextOffset;
  }
  if (items.length !== progress.total)
    throw new DmfasterSdkError(
      "Review export did not reconcile to the exact company total.",
      "review_export_invalid",
    );
  return { progress, items };
}
