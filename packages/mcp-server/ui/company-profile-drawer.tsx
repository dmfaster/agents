import { Button } from "@dmfaster/product-ui/components/button";
import { t } from "./locale.ts";
import { useEffect, useRef } from "react";
import { CompanyIcon } from "./company-icon.tsx";
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
  onDraftChat,
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
  onDraftChat?: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const company = detail?.profile ?? row;
  const person =
    text(row.decisionMakerPrimaryName) || text(detail?.profile.decisionMakers[0]?.name);
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
      aria-label={t("Company details")}
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
            {person ? <p>{person}</p> : null}
          </div>
          <button
            type="button"
            className="company-drawer-close"
            aria-label={t("Close company details")}
            onClick={onClose}
          >
            <CompanyIcon name="close" />
          </button>
        </header>
        <div className="company-drawer-body">
          {notice ? (
            <p className="workspace-notice" role="status">
              {t(notice)}
            </p>
          ) : null}
          <CompanyProfile
            row={row}
            detail={detail}
            loading={loading}
            error={error}
            onRetry={onRetry}
          />
          <div className="company-profile-chat-actions">
            <Button
              variant="link"
              size="sm"
              aria-label={t("Refresh profile")}
              title={t("Refresh profile")}
              disabled={loading}
              onClick={onRetry}
            >
              {t("Refresh profile")}
            </Button>
            <Button variant="link" size="sm" disabled={contextDisabled} onClick={onUseInChat}>
              {t("Use this company in chat")}
            </Button>
            {onDraftChat ? (
              <Button variant="link" size="sm" disabled={contextDisabled} onClick={onDraftChat}>
                {t("Draft chat request")}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </dialog>
  );
}
