import { useEffect, useRef, type ReactNode } from "react";
import { CompanyLogo } from "./company-logo.tsx";
import { CompanyProfile } from "./company-profile.tsx";
import { text, type CompanyDetail, type CompanyRow } from "./companies-data.ts";

export function CompanyProfileDrawer({
  row,
  detail,
  loading,
  error,
  notice,
  contextDisabled,
  onClose,
  onRetry,
  onUseInChat,
  evidence,
}: {
  row: CompanyRow;
  detail: CompanyDetail | null;
  loading: boolean;
  error: string;
  notice: string;
  contextDisabled: boolean;
  onClose: () => void;
  onRetry: () => void;
  onUseInChat: () => void;
  evidence?: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const company = detail?.profile ?? row;
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (!element.open) element.showModal();
    heading.current?.focus();
    return () => element.close();
  }, []);
  useEffect(() => {
    heading.current?.focus();
  }, [row.country, row.businessId]);
  return (
    <dialog
      ref={dialog}
      className="company-drawer"
      aria-label="Company details"
      aria-modal="true"
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            "button, a[href], input, select, textarea, summary, [tabindex]",
          ),
        ).filter(
          (element) =>
            element.tabIndex >= 0 &&
            !element.matches(":disabled") &&
            element.getClientRects().length > 0,
        );
        const first = controls[0];
        const last = controls.at(-1);
        if (!first || !last) {
          event.preventDefault();
          heading.current?.focus();
        } else if (
          event.shiftKey &&
          (document.activeElement === first || document.activeElement === heading.current)
        ) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose();
      }}
    >
      <div className="company-drawer-layout">
        <header className="company-drawer-header">
          <CompanyLogo company={company} large />
          <div className="company-drawer-title">
            <h2 ref={heading} tabIndex={-1}>
              {company.name}
            </h2>
            <p>{[text(company.city), company.country].filter(Boolean).join(" · ")}</p>
          </div>
          <button
            type="button"
            className="company-drawer-close"
            aria-label="Close company details"
            onClick={onClose}
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </header>
        <div className="company-drawer-body">
          {evidence}
          {notice ? (
            <p className="workspace-notice" role="status">
              {notice}
            </p>
          ) : null}
          <CompanyProfile
            row={row}
            detail={detail}
            loading={loading}
            error={error}
            onRetry={onRetry}
          />
        </div>
        <footer className="company-drawer-actions">
          <button className="workspace-link" disabled={loading} onClick={onRetry}>
            Refresh profile
          </button>
          <button className="workspace-button" disabled={contextDisabled} onClick={onUseInChat}>
            Use this company in chat
          </button>
        </footer>
      </div>
    </dialog>
  );
}
