"use client";

import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";
import { Button } from "./button";
import type { ConfirmationOptions } from "./confirmation-dialog";

function ConfirmationDialogContent({
  open,
  options,
  onSettle,
}: {
  open: boolean;
  options: ConfirmationOptions;
  onSettle: (confirmed: boolean) => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <AlertDialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onSettle(false);
      }}
    >
      <AlertDialogContent initialFocus={cancelRef} finalFocus={options.finalFocus}>
        <AlertDialogHeader>
          <AlertDialogTitle>{options.title}</AlertDialogTitle>
          <AlertDialogDescription>{options.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button ref={cancelRef} variant="outline" onClick={() => onSettle(false)}>
            {options.cancelLabel}
          </Button>
          <Button
            variant={options.destructive ? "destructive-solid" : "default"}
            onClick={() => onSettle(true)}
          >
            {options.confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { ConfirmationDialogContent };
