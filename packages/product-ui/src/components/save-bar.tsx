import type { ReactNode } from "react";
import { cn } from "cn";

/** Render only while a form has edits or a recoverable save error. */
export function SaveBar({
  status,
  statusRole = "status",
  children,
  className,
}: {
  status: ReactNode;
  statusRole?: "status" | "alert";
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-slot="save-bar"
      className={cn(
        "sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-20 ml-auto flex w-fit max-w-full flex-wrap items-center justify-end gap-3 rounded-lg border border-border bg-card p-2 shadow-sm lg:bottom-4",
        className,
      )}
    >
      <p
        role={statusRole}
        className={cn(
          "mr-auto px-2",
          statusRole === "alert"
            ? "basis-full text-sm text-destructive"
            : "text-xs text-muted-foreground",
        )}
      >
        {status}
      </p>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
