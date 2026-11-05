"use client";
import type { ReactNode } from "react";
import { Button } from "./button";

/** Presentation only: the caller owns selection and all data access. */
export function InboxThreadRow({
  name,
  active,
  onSelect,
  avatar,
  timestamp,
  preview,
  metadata,
  unread = false,
}: {
  name: string;
  active: boolean;
  onSelect: () => void;
  avatar: ReactNode;
  timestamp: ReactNode;
  preview: string;
  metadata: ReactNode;
  unread?: boolean;
}) {
  return (
    <Button
      variant="conversation"
      size="row"
      type="button"
      onClick={onSelect}
      className="w-full min-w-0 px-3 py-3.5"
      aria-pressed={active}
    >
      <div className="flex min-w-0 items-start gap-3">
        {avatar}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p
              className={`min-w-0 flex-1 truncate text-sm ${unread ? "font-semibold text-foreground" : "font-medium text-foreground"}`}
            >
              {name}
            </p>
            <span className="shrink-0 text-xs text-muted-foreground">{timestamp}</span>
          </div>
          <p
            className={`mt-1 truncate text-xs ${unread ? "font-medium text-foreground" : "text-muted-foreground"}`}
          >
            {preview}
          </p>
          {metadata}
        </div>
      </div>
    </Button>
  );
}
