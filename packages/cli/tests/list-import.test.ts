import assert from "node:assert/strict";
import test from "node:test";
import { parseInstagramUsernameFile } from "../src/list-import.ts";

test("reads BOM, quoted CSV, CRLF, optional header, and duplicates", () => {
  assert.deepEqual(
    parseInstagramUsernameFile('\uFEFF"username"\r\n"@Coach.FI"\r\ncoach.fi\r\n\r\nother_coach'),
    ["coach.fi", "coach.fi", "other_coach"],
  );
  assert.deepEqual(parseInstagramUsernameFile("coach\nsecond"), ["coach", "second"]);
});

test("rejects invalid or multi-column records without a partial import", () => {
  for (const input of [
    "",
    "username\n",
    "valid\ninvalid handle",
    "username,email\ncoach,c@example.com",
    "valid\nhttps://instagram.com/coach",
    "coach..fi",
    ".coach",
    "coach.",
    '"coach',
    "a".repeat(31),
    "a\n".repeat(1001),
    " ".repeat(65537),
  ]) {
    assert.throws(() => parseInstagramUsernameFile(input));
  }
});
