import * as React from "react";
import { cn } from "cn";

function Skeleton({
  className,
  as: Element = "div",
  ...props
}: React.ComponentProps<"div"> & { as?: "div" | "span" }) {
  return (
    <Element
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
