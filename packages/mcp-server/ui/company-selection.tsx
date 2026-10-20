import { useEffect, useRef, useState } from "react";
import { t } from "./locale.ts";
import { identity, type CompanyRow } from "./companies-data.ts";

export const SELECTION_LIMIT = 50;
export type CompanySelectionScope = {
  count: number;
  key: string;
  blocked: boolean;
  resolve(): Promise<CompanyRow[]>;
};

// Selection is atomic: a short, stale or repeating response never becomes a
// silently truncated audience. No list or campaign is created by this reader.
export async function collectSelection<
  P extends { companies: CompanyRow[]; hasNextPage: boolean; nextCursor: string | null },
>(count: number, read: (cursor?: string) => Promise<P>): Promise<CompanyRow[]> {
  if (!Number.isSafeInteger(count) || count < 1) throw new Error(t("Exact count unavailable"));
  const rows = new Map<string, CompanyRow>();
  const cursors = new Set<string>();
  let cursor: string | undefined;
  for (let pages = 0; pages < SELECTION_LIMIT; pages++) {
    const page = await read(cursor);
    for (const row of page.companies) {
      rows.set(identity(row), row);
      if (rows.size === count) return [...rows.values()];
    }
    if (!page.hasNextPage || !page.nextCursor || cursors.has(page.nextCursor)) break;
    cursors.add(page.nextCursor);
    cursor = page.nextCursor;
  }
  throw new Error(t("Not enough results could be loaded. Your selection has not changed."));
}

export function CompanySelection({
  label,
  selected,
  pageRows,
  total,
  disabled,
  load,
  onChange,
  onSelectAll,
  selectedCount = selected.size,
}: {
  label: string;
  selected: Map<string, CompanyRow>;
  pageRows: CompanyRow[];
  total: number | null;
  disabled: boolean;
  load(count: number): Promise<CompanyRow[]>;
  onChange(rows: Map<string, CompanyRow>): void;
  onSelectAll?(): void;
  selectedCount?: number;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const alive = useRef(true);
  const [mode, setMode] = useState("number");
  const [count, setCount] = useState("10");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const maximum = Math.min(SELECTION_LIMIT, total ?? SELECTION_LIMIT);
  const number = Number(count);
  const valid = mode !== "number" || (Number.isInteger(number) && number > 0 && number <= maximum);
  const allAvailable =
    total !== null && total > 0 && (total <= SELECTION_LIMIT || Boolean(onSelectAll));
  async function apply() {
    if (!valid || busy || disabled) return;
    if (mode === "all" && onSelectAll) {
      onSelectAll();
      dialog.current?.close();
      return;
    }
    setBusy(true);
    setError("");
    try {
      const rows =
        mode === "clear"
          ? []
          : mode === "page"
            ? pageRows
            : await load(mode === "all" ? total! : number);
      if (!alive.current) return;
      onChange(new Map(rows.map((row) => [identity(row), row])));
      dialog.current?.close();
    } catch (error) {
      if (alive.current) setError(error instanceof Error ? error.message : String(error));
    } finally {
      if (alive.current) setBusy(false);
    }
  }
  return (
    <>
      <button
        type="button"
        className="company-selection-button"
        aria-label={t("Select companies")}
        aria-haspopup="dialog"
        aria-description={label}
        disabled={disabled}
        onClick={() => {
          setError("");
          setCount(String(Math.min(10, maximum)));
          dialog.current?.showModal();
        }}
      >
        {label}
      </button>
      <dialog
        ref={dialog}
        className="company-selection-dialog"
        aria-label={t("Select companies")}
        onCancel={(event) => {
          if (busy) event.preventDefault();
        }}
      >
        <h2>{t("Select companies")}</h2>
        <label>
          <input
            type="radio"
            name="company-selection"
            checked={mode === "number"}
            disabled={busy}
            onChange={() => setMode("number")}
          />
          {t("Select number")}
          <input
            type="number"
            aria-label={t("Number of companies")}
            value={count}
            min={1}
            max={maximum}
            disabled={busy}
            onFocus={() => setMode("number")}
            onChange={(event) => setCount(event.target.value)}
          />
        </label>
        <label>
          <input
            type="radio"
            name="company-selection"
            checked={mode === "page"}
            disabled={busy || !pageRows.length || pageRows.length > SELECTION_LIMIT}
            onChange={() => setMode("page")}
          />
          {t("This page ({count})", { count: pageRows.length })}
        </label>
        <label>
          <input
            type="radio"
            name="company-selection"
            checked={mode === "all"}
            disabled={busy || !allAvailable}
            onChange={() => setMode("all")}
          />
          {total === null ? t("All results") : t("All results ({count})", { count: total })}
        </label>
        {selectedCount ? (
          <label>
            <input
              type="radio"
              name="company-selection"
              checked={mode === "clear"}
              disabled={busy}
              onChange={() => setMode("clear")}
            />
            {t("Clear selection")}
          </label>
        ) : null}
        <small>
          {t("Up to 50 companies per campaign.")}
          {total === null ? ` ${t("Select all requires an exact result count.")}` : ""}
        </small>
        {error ? <p role="alert">{error}</p> : null}
        <footer>
          <button
            type="button"
            className="workspace-link"
            disabled={busy}
            onClick={() => dialog.current?.close()}
          >
            {t("Cancel")}
          </button>
          <button
            type="button"
            className="workspace-button"
            disabled={busy || disabled || !valid || (mode === "all" && !allAvailable)}
            onClick={() => void apply()}
          >
            {busy ? t("Loading…") : t("Apply")}
          </button>
        </footer>
      </dialog>
    </>
  );
}
