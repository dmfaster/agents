import {
  decideProspect,
  evaluateCriterion,
  splitForProfile,
  validateSpec,
  type ProspectingRequest,
  type ReviewedLabels,
  type TargetSpec,
} from "./instagram-prospecting.ts";

/** Policy experiments only. Never tune from holdout observations or select a policy automatically. */
export function calibrateInstagramPolicy(input: {
  spec: TargetSpec;
  labels: ReviewedLabels[];
  recordings: {
    profileId: string;
    evidenceHash: string;
    request: ProspectingRequest;
    output: unknown;
  }[];
  judgmentThresholds?: number[];
  evidenceThresholds?: number[];
}) {
  const labels = input.labels.filter((label) => label.split === "development");
  const recordings = input.recordings.filter(
    (row) => splitForProfile(row.profileId) === "development",
  );
  const grid = [];
  for (const threshold of input.judgmentThresholds ?? [0.7, 0.8, 0.85, 0.9, 0.95])
    for (const evidenceThreshold of input.evidenceThresholds ?? [0.5, 0.7, 0.8, 0.9]) {
      const spec = validateSpec({ ...input.spec, threshold, evidenceThreshold });
      const observations = recordings.map((row) => ({
        ...row,
        decision: decideProspect(spec, row.request, row.output),
      }));
      const metrics = spec.criteria.map((criterion) =>
        evaluateCriterion(
          labels,
          observations,
          criterion.id,
          "development",
          threshold,
          evidenceThreshold,
        ),
      );
      grid.push({
        threshold,
        evidenceThreshold,
        observedProfiles: observations.length,
        counts: {
          accept: observations.filter((r) => r.decision.status === "accept").length,
          exclude: observations.filter((r) => r.decision.status === "exclude").length,
          review: observations.filter((r) => r.decision.status === "review").length,
        },
        metrics,
      });
    }
  return {
    split: "development" as const,
    labeledProfiles: labels.length,
    ignoredHoldoutLabels: input.labels.length - labels.length,
    ignoredHoldoutRecordings: input.recordings.length - recordings.length,
    selectedPolicy: null,
    inferenceCalls: 0,
    grid,
    note: "A policy comparison, not a readiness claim. Preserve independent labels and an untouched holdout. No policy is promoted automatically.",
  };
}
