import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@dmfaster/product-ui/components/button";
import { Input } from "@dmfaster/product-ui/components/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@dmfaster/product-ui/components/field";
import type { McpAppBridge } from "./bridge.ts";
import { mutationRejected, type CompanyRow } from "./companies-data.ts";
import {
  checkedSelection,
  inspectShortlist,
  verifiedShortlist,
  type Shortlist,
  type ShortlistRequest,
} from "./company-shortlist-data.ts";
import { useWorkspaceContext } from "./use-workspace-context.ts";
import { t } from "./locale.ts";

export function CompanyShortlist({
  bridge,
  count,
  selectionKey,
  disabled,
  resolve,
  onLocked,
  onOpen,
}: {
  bridge: McpAppBridge;
  count: number;
  selectionKey: string;
  disabled: boolean;
  resolve(): Promise<CompanyRow[]>;
  onLocked(locked: boolean): void;
  onOpen(list: Shortlist): Promise<void>;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<Shortlist | null>(null);
  const request = useRef<ShortlistRequest | null>(null);
  const lock = useRef(false);
  const current = useRef(selectionKey);
  current.current = selectionKey;
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const pending = Boolean(request.current && !saved);
  useEffect(() => {
    onLocked(busy || pending);
  }, [busy, pending, onLocked]);
  useWorkspaceContext(
    bridge,
    "shortlist",
    open
      ? {
          status: saved ? "saved" : pending ? "save_unverified" : busy ? "inspecting" : "editing",
          listId: saved?.listId ?? null,
          name: saved?.name ?? request.current?.name ?? name,
          total: saved?.total ?? request.current?.companies.length ?? count,
          expectedUpdatedAt: saved?.expectedUpdatedAt ?? null,
          lastError: error || null,
          recovery: pending ? { tool: "companies_list_prepare", input: request.current } : null,
          sendingStarted: false,
        }
      : null,
  );
  async function save() {
    if (
      lock.current ||
      saved ||
      (!request.current && (disabled || !name.trim() || name.trim().length > 120))
    )
      return;
    lock.current = true;
    setBusy(true);
    setError("");
    const wasUnverified = Boolean(request.current);
    try {
      if (!request.current) {
        const key = selectionKey;
        const isCurrent = () => alive.current && current.current === key;
        const rows = checkedSelection(await resolve(), count);
        request.current = await inspectShortlist(bridge, rows, name, isCurrent);
      }
      const submitted = request.current;
      const response = await bridge.callTool("companies_list_prepare", submitted);
      if (
        !wasUnverified &&
        mutationRejected(response, [
          "company_changed",
          "company_not_found",
          "invalid_company_selection",
          "duplicate_company",
          "invalid_input",
          "owner_required",
        ])
      ) {
        request.current = null;
      }
      const result = verifiedShortlist(response, submitted);
      if (alive.current) setSaved(result);
    } catch (e) {
      if (alive.current) setError(e instanceof Error ? e.message : String(e));
    } finally {
      lock.current = false;
      if (alive.current) setBusy(false);
    }
  }
  async function openSaved() {
    if (!saved || lock.current) return;
    lock.current = true;
    setBusy(true);
    try {
      await onOpen(saved);
    } finally {
      lock.current = false;
      if (alive.current) setBusy(false);
    }
  }
  return (
    <section className="company-shortlist" aria-label={t("Research shortlist")}>
      {!open ? (
        <Button
          variant="outline"
          disabled={disabled || !bridge.canCallTools()}
          onClick={() => {
            setOpen(true);
            setError("");
            setSaved(null);
            request.current = null;
          }}
        >
          {t("Save shortlist")}
        </Button>
      ) : saved ? (
        <div className="flex flex-wrap items-center gap-3">
          <p role="status">
            {t("Saved {count} companies to {name}.", { count: saved.total, name: saved.name })}
          </p>
          <Button
            variant="outline"
            disabled={busy || !bridge.canCallTools()}
            onClick={() => void openSaved()}
          >
            {t("Open saved shortlist")}
          </Button>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            {t("Close")}
          </Button>
        </div>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void save();
          }}
        >
          <FieldGroup>
            <Field data-disabled={busy || pending}>
              <FieldLabel htmlFor={id}>{t("Shortlist name")}</FieldLabel>
              <Input
                id={id}
                value={request.current?.name ?? name}
                maxLength={120}
                disabled={busy || pending}
                onChange={(event) => setName(event.target.value)}
              />
              <FieldDescription>
                {t("Save {count} selected companies for research. No campaign is created.", {
                  count: request.current?.companies.length ?? count,
                })}
              </FieldDescription>
            </Field>
          </FieldGroup>
          {error ? <p role="alert">{t(error)}</p> : null}
          {pending && !busy ? (
            <p className="workspace-muted">
              {t("Retry checks the same shortlist without creating a duplicate.")}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={busy || (!pending && (disabled || !name.trim()))}>
              {busy
                ? t("Saving shortlist…")
                : pending
                  ? t("Retry save")
                  : t("Save selected companies")}
            </Button>
            <Button variant="ghost" disabled={busy || pending} onClick={() => setOpen(false)}>
              {t("Cancel")}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
