export function sendingCountdown(input: {
  observedAt: string;
  nextEligibleAt: string | null;
  deadlineKind: string;
  now: number;
}) {
  const observed = Date.parse(input.observedAt);
  if (!Number.isFinite(observed) || input.now - observed >= 90000 || observed - input.now > 5000)
    return "Timing observation is stale; refresh status.";
  if (!input.nextEligibleAt) return "No confirmed eligibility time.";
  const seconds = Math.ceil((Date.parse(input.nextEligibleAt) - input.now) / 1000);
  if (!Number.isFinite(seconds)) return "No confirmed eligibility time.";
  if (seconds <= 0) return "Eligibility deadline reached; refresh status.";
  const minutes = Math.floor(seconds / 60),
    remainder = seconds % 60;
  const duration = `${minutes} minutes ${remainder} seconds`;
  return input.deadlineKind === "eligibility"
    ? `Next eligible attempt in ${duration}.`
    : `At least ${duration} until the next eligible attempt; other work may still need to finish.`;
}

export function providerCountdown(input: {
  observedAt: string;
  activity: {
    step: string;
    kind: string;
    timingAvailable: boolean;
    phase?: string;
    observedAt: string | null;
    deadlineAt: string | null;
    watchdogAt?: string | null;
  } | null;
  now: number;
}) {
  const fresh = (at: string | null) =>
    at &&
    Number.isFinite(Date.parse(at)) &&
    input.now - Date.parse(at) < 90000 &&
    Date.parse(at) - input.now <= 5000;
  if (!fresh(input.observedAt)) return "Timing observation is stale; refresh status.";
  const activity = input.activity;
  if (!activity || !fresh(activity.observedAt))
    return "Provider step timing is unavailable; inspect the browser.";
  const step = activity.step.replace(/[_:-]+/g, " ");
  const stepDeadline = Date.parse(activity.deadlineAt || "");
  const watchdog = Date.parse(activity.watchdogAt || "");
  const watchdogFirst =
    Number.isFinite(watchdog) && (!Number.isFinite(stepDeadline) || watchdog < stepDeadline);
  const deadline = watchdogFirst ? watchdog : stepDeadline;
  if (!Number.isFinite(deadline)) return `${step}: no confirmed timeout; inspect the browser.`;
  const seconds = Math.ceil((deadline - input.now) / 1000);
  const clock = watchdogFirst
    ? "watchdog"
    : activity.kind === "delay"
      ? "delay"
      : activity.kind === "timeout"
        ? "timeout"
        : "watchdog";
  if (seconds <= 0)
    return activity.phase === "overdue"
      ? `${step}: ${clock} overdue; inspect browser progress.`
      : `${step}: ${clock} deadline reached; refresh status.`;
  const duration = `${Math.floor(seconds / 60)} minutes ${seconds % 60} seconds`;
  return activity.timingAvailable
    ? `${step}: ${clock} in ${duration}.`
    : `Provider step unavailable; watchdog in ${duration}.`;
}
