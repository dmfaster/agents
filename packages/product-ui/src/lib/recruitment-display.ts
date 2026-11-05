/** A missed refresh must not erase recently observed employer evidence.
 * This is display grace, not a new verification or an active-hiring filter grant.
 */
export const RECRUITMENT_DISPLAY_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export function recruitmentDisplayUntil(recruitment: {
  snapshotAt: string;
  verifiedUntil: string | null;
}) {
  const observed = Date.parse(recruitment.snapshotAt);
  return recruitment.verifiedUntil && Number.isFinite(observed)
    ? observed + RECRUITMENT_DISPLAY_MAX_AGE_MS
    : 0;
}
