"use client";

import type { ComponentProps, ReactElement } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export function SidebarMenuTooltip({
  trigger,
  hidden,
  tooltip,
}: {
  trigger: ReactElement;
  hidden: boolean;
  tooltip: ComponentProps<typeof TooltipContent>;
}) {
  return (
    <Tooltip>
      <TooltipTrigger render={trigger} />
      <TooltipContent side="right" align="center" hidden={hidden} {...tooltip} />
    </Tooltip>
  );
}
