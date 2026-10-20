"use client";

import * as React from "react";
import { memo } from "react";
import { Switch } from "./switch";

/** Controlled UI only; the caller owns execution, pending state and permissions. */
export const CampaignToggle = memo(function CampaignToggle({
  checked,
  ariaLabel,
  disabled = false,
  pending = false,
  testId,
  onChange,
}: {
  checked: boolean;
  ariaLabel?: string;
  disabled?: boolean;
  pending?: boolean;
  testId?: string;
  onChange: (nextChecked: boolean) => void;
}) {
  return (
    <Switch
      checked={checked}
      aria-label={ariaLabel}
      aria-busy={pending}
      disabled={disabled}
      data-testid={testId}
      onCheckedChange={onChange}
    />
  );
});
