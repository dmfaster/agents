import * as React from "react";
import type { ReactNode } from "react";
import { cn } from "cn";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "./card";

/** A shared application panel with a real heading and optional header action. */
export function Panel({
  title,
  description,
  action,
  children,
  className,
  contentClassName = "p-4 sm:p-5",
  ariaLabel,
  layout = "stacked",
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  ariaLabel?: string;
  layout?: "stacked" | "setting";
}) {
  const hasHeader = Boolean(title || description || action);
  const label = ariaLabel || (!title ? description : undefined);
  return (
    <Card
      role={label ? "region" : undefined}
      aria-label={label}
      className={cn(
        "gap-0 py-0",
        layout === "setting" &&
          "lg:grid lg:grid-cols-[minmax(12rem,0.8fr)_minmax(0,1.2fr)] lg:items-start",
        className,
      )}
    >
      {hasHeader && (
        <CardHeader
          className={cn(
            "border-b border-border p-4 sm:p-5",
            layout === "setting" && "lg:border-b-0",
          )}
        >
          {title && (
            <CardTitle>
              <h2>{title}</h2>
            </CardTitle>
          )}
          {description && <CardDescription>{description}</CardDescription>}
          {action && <CardAction>{action}</CardAction>}
        </CardHeader>
      )}
      <CardContent className={cn("min-w-0", contentClassName)}>{children}</CardContent>
    </Card>
  );
}
