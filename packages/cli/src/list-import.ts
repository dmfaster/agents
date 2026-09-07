/** Parse a one-column CSV or newline-separated Instagram username file. */
export function parseInstagramUsernameFile(text: string): string[] {
  if (Buffer.byteLength(text, "utf8") > 64 * 1024) {
    throw new Error("The import file must be at most 64 KiB.");
  }
  const rows = text
    .replace(/^\uFEFF/, "")
    .split(/\r\n|\n|\r/)
    .filter((row) => row.trim());
  const values = rows
    .map((row, index) => {
      const value = row.trim();
      const cell =
        value.startsWith('"') && value.endsWith('"')
          ? value.slice(1, -1).replaceAll('""', '"')
          : value;
      if (index === 0 && /^(username|instagram_username)$/i.test(cell)) return null;
      const username = cell.trim().replace(/^@/, "").toLowerCase();
      if (!/^[a-z0-9_](?:[a-z0-9_.]{0,28}[a-z0-9_])?$/.test(username) || username.includes("..")) {
        throw new Error(
          `Invalid Instagram username on row ${index + 1}. Use a one-column username CSV or one username per line.`,
        );
      }
      return username;
    })
    .filter((value): value is string => value !== null);
  if (values.length < 1 || values.length > 1000) {
    throw new Error("Import between 1 and 1,000 username rows per list.");
  }
  // Preserve duplicate rows so the server can report the exact removed count.
  return values;
}
