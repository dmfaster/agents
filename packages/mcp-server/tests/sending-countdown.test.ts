import assert from "node:assert/strict";
import test from "node:test";
import { sendingCountdown } from "../ui/sending-countdown.ts";
const observedAt = "2026-10-02T00:00:00.000Z";
const now = Date.parse(observedAt),
  nextEligibleAt = new Date(now + 391000).toISOString();
test("countdown distinguishes eligibility from a lower bound and expires stale observations", () => {
  assert.equal(
    sendingCountdown({ observedAt, nextEligibleAt, deadlineKind: "eligibility", now }),
    "Next eligible attempt in 6 minutes 31 seconds.",
  );
  assert.match(
    sendingCountdown({ observedAt, nextEligibleAt, deadlineKind: "lower_bound", now }),
    /^At least 6 minutes 31 seconds/,
  );
  assert.match(
    sendingCountdown({ observedAt, nextEligibleAt, deadlineKind: "eligibility", now: now + 90000 }),
    /stale/,
  );
  assert.match(
    sendingCountdown({ observedAt, nextEligibleAt: observedAt, deadlineKind: "eligibility", now }),
    /refresh status/,
  );
  assert.match(
    sendingCountdown({ observedAt, nextEligibleAt: null, deadlineKind: "unknown", now }),
    /No confirmed/,
  );
});

test("active provider clocks distinguish a delay, timeout, overdue state and stale evidence", async () => {
  const { providerCountdown } = await import("../ui/sending-countdown.ts");
  const activity = {
    step: "preparation:before-thread",
    kind: "delay",
    timingAvailable: true,
    observedAt,
    deadlineAt: nextEligibleAt,
  };
  assert.equal(
    providerCountdown({ observedAt, activity, now }),
    "preparation before thread: delay in 6 minutes 31 seconds.",
  );
  assert.match(
    providerCountdown({ observedAt, activity: { ...activity, kind: "timeout" }, now }),
    /timeout in/,
  );
  assert.match(
    providerCountdown({
      observedAt,
      activity: { ...activity, deadlineAt: observedAt, phase: "overdue" },
      now,
    }),
    /overdue/,
  );
  assert.match(providerCountdown({ observedAt, activity, now: now + 91000 }), /stale/);
  assert.match(
    providerCountdown({
      observedAt,
      activity: { ...activity, watchdogAt: observedAt, phase: "overdue" },
      now,
    }),
    /watchdog overdue/,
  );
  assert.match(
    providerCountdown({
      observedAt,
      activity: { ...activity, timingAvailable: false, kind: "watchdog" },
      now,
    }),
    /Provider step unavailable; watchdog/,
  );
});
