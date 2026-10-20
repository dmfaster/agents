import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveLanguage } from "../ui/locale.ts";

test("company locale recognizes BCP47 Finnish and safely falls back for unsupported values", () => {
  for (const locale of ["fi", "fi-FI", "FI-fi", "fi-Latn-FI"])
    assert.equal(resolveLanguage(locale), "fi");
  for (const locale of ["en", "en-GB", "sv-FI", "de-DE", "bad_locale", "", null, 123])
    assert.equal(resolveLanguage(locale), "en");
});
