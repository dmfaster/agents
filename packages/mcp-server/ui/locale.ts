import { finnishCompanyCopy } from "./company-copy.fi.ts";
import { finnishSharedCompanyCopy } from "./company-shared-copy.fi.ts";

export function resolveLanguage(locale: unknown): "fi" | "en" {
  if (typeof locale !== "string" || !locale.trim()) return "en";
  try {
    return new Intl.Locale(locale.trim()).language === "fi" ? "fi" : "en";
  } catch {
    return "en";
  }
}

// MCP Apps hosts mirror their locale onto <html lang>. Older ChatGPT hosts
// expose window.openai.locale. Local previews use the browser's preference.
// An unsupported explicit host language falls back to English, not a different
// language inferred from the company market or source text.
export function language(): "fi" | "en" {
  const host = typeof document === "undefined" ? "" : document.documentElement.lang;
  const compatibility = typeof window === "undefined" ? "" : window.openai?.locale;
  const browser = typeof navigator === "undefined" ? "" : navigator.language;
  return resolveLanguage(host || compatibility || browser || "en");
}
export function numberLocale() {
  return language() === "fi" ? "fi-FI" : "en-US";
}
function interpolate(message: string, values?: Record<string, string | number>) {
  return message.replace(/\{(\w+)\}/g, (token, key: string) =>
    values && Object.hasOwn(values, key) ? String(values[key]) : token,
  );
}
export function t(english: string, values?: Record<string, string | number>) {
  return interpolate(
    language() === "fi" ? (finnishCompanyCopy[english] ?? english) : english,
    values,
  );
}
export function productT(key: string, fallback: string, values?: Record<string, string>) {
  return interpolate(
    language() === "fi" ? (finnishSharedCompanyCopy[key] ?? fallback) : fallback,
    values,
  );
}
