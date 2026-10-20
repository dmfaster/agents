"use client";

import type * as React from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./sheet";

/** Desktop sidebar primitives do not need the mobile dialog implementation. */
export function SidebarMobileSheet({
  children,
  dir,
  side,
  ...props
}: Omit<React.ComponentProps<typeof Sheet>, "children"> & {
  children: React.ReactNode;
  dir?: React.ComponentProps<typeof SheetContent>["dir"];
  side: "left" | "right";
}) {
  return (
    <Sheet {...props}>
      <SheetContent
        dir={dir}
        side={side}
        data-sidebar="sidebar"
        data-slot="sidebar"
        data-mobile="true"
        className="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
        style={{ "--sidebar-width": "18rem" } as React.CSSProperties}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Sidebar</SheetTitle>
          <SheetDescription>Displays the mobile sidebar.</SheetDescription>
        </SheetHeader>
        <div className="flex h-full w-full flex-col">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
