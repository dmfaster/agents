import type { ReactNode } from "react";
import { Badge } from "./components/badge";
import { buttonVariants } from "./components/button";

export { Panel } from "./components/workspace-panel";
export { PageIntro } from "./components/page-intro";
export { CampaignToggle } from "./components/campaign-toggle";

// Compatibility exports for native-anchor compositions. New controls use the
// shared components, whose variants own appearance and focus treatment.

export const subtleButtonClass = buttonVariants({ variant: "outline" });
export const dangerButtonClass = buttonVariants({ variant: "destructive" });
export const primaryButtonClass = buttonVariants();

export function TonePill({
  children,
  tone = "slate",
}: {
  children: ReactNode;
  tone?: "slate" | "green" | "blue" | "amber";
}) {
  return (
    <Badge
      variant={
        tone === "green"
          ? "success"
          : tone === "blue"
            ? "info"
            : tone === "amber"
              ? "warning"
              : "neutral"
      }
      className={
        tone === "slate"
          ? "gap-1.5 text-foreground/85 before:size-1.5 before:shrink-0 before:rounded-full before:bg-muted-foreground/60 before:content-['']"
          : undefined
      }
    >
      {children}
    </Badge>
  );
}
