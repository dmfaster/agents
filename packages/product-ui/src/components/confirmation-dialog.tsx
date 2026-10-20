"use client";

import { useCallback, useEffect, useRef, useState, type ComponentProps } from "react";
import type { AlertDialogContent } from "./alert-dialog";

type DialogModule = typeof import("./confirmation-dialog-content");
let loadedDialog: DialogModule | null = null;
let dialogPromise: Promise<DialogModule> | null = null;
function loadDialog() {
  return (dialogPromise ??= import("./confirmation-dialog-content")
    .then((module) => {
      loadedDialog = module;
      return module;
    })
    .catch((error) => {
      dialogPromise = null;
      throw error;
    }));
}

type ConfirmationOptions = {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive?: boolean;
  finalFocus?: ComponentProps<typeof AlertDialogContent>["finalFocus"];
};

/** Await a deliberate UI choice. Execution and permission checks remain with the caller. */
function useConfirmationDialog() {
  const [options, setOptions] = useState<ConfirmationOptions | null>(null);
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState(() => loadedDialog);
  const resolveRef = useRef<((confirmed: boolean) => void) | null>(null);
  const confirm = useCallback((next: ConfirmationOptions): Promise<boolean> => {
    // A second request must never replace the decision currently on screen.
    if (resolveRef.current) return Promise.resolve(false);
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setOptions(next);
      setOpen(true);
      void loadDialog()
        .then((module) => {
          if (resolveRef.current === resolve) setDialog(module);
        })
        .catch(() => {
          // A failed download cannot authorize the caller's mutation. Clear the
          // pending request so a later deliberate attempt can retry the download.
          if (resolveRef.current !== resolve) return;
          resolveRef.current = null;
          setOpen(false);
          setOptions(null);
          resolve(false);
        });
    });
  }, []);
  const settle = useCallback((confirmed: boolean) => {
    const resolve = resolveRef.current;
    resolveRef.current = null;
    setOpen(false);
    resolve?.(confirmed);
  }, []);
  useEffect(
    () => () => {
      resolveRef.current?.(false);
      resolveRef.current = null;
    },
    [],
  );

  // Keep the closing surface mounted once requested, including focus restoration.
  const ConfirmationDialogContent = dialog?.ConfirmationDialogContent;
  const confirmationDialog =
    options && ConfirmationDialogContent ? (
      <ConfirmationDialogContent open={open} options={options} onSettle={settle} />
    ) : null;
  return { confirm, confirmationDialog };
}

export { useConfirmationDialog };
export type { ConfirmationOptions };
