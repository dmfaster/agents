"use client";

import * as React from "react";
import type { ReactNode } from "react";
import { useIsMobile } from "./hooks/use-mobile";
import { Sheet, SheetContent, SheetTitle } from "./sheet";
import { cn } from "cn";

/** A single form instance: inline on desktop, accessible sheet on mobile. */
function ResponsiveSheet({
  open,
  onOpenChange,
  title,
  className,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  className?: string;
  children: ReactNode;
}) {
  const mobile = useIsMobile();
  if (!mobile) return <div className={cn("hidden lg:block", className)}>{children}</div>;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="max-h-[calc(var(--dmf-visual-viewport-height,100dvh)-1rem)] overflow-y-auto overscroll-contain p-4"
      >
        <SheetTitle className="sr-only">{title}</SheetTitle>
        {children}
      </SheetContent>
    </Sheet>
  );
}

export { ResponsiveSheet };
