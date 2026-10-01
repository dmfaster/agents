/**
 * businessId is also the imported record key, including hashes and opaque IDs.
 * Only the Finnish registry-backed, formatted value is a public business number.
 * Other countries need a separate registry identifier with source provenance.
 */
export function publicFinnishBusinessId(country: string, businessId: string): string {
  if (country.trim().toUpperCase() !== "FI") return "";
  const value = businessId.trim();
  return /^\d{7}-\d$/.test(value) ? value : "";
}
