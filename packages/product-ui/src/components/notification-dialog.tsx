"use client";

import * as React from "react";
import { useCallback, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";
import { Button } from "./button";

type NotificationOptions = { title: string; description: string; dismissLabel: string };

/** Keep actionable feedback visible until acknowledged, including successive errors. */
function useNotificationDialog() {
  const [hasNotified, setHasNotified] = useState(false);
  const [queue, setQueue] = useState<NotificationOptions[]>([]);
  const dismissRef = useRef<HTMLButtonElement>(null);
  const notify = useCallback((notice: NotificationOptions) => {
    setHasNotified(true);
    setQueue((current) => [...current, notice]);
  }, []);
  const dismiss = useCallback(() => setQueue((current) => current.slice(1)), []);
  const current = queue[0];
  // The first notice mounts the surface; later closes retain its focus lifecycle.
  const notificationDialog = hasNotified ? (
    <AlertDialog
      open={Boolean(current)}
      onOpenChange={(open) => {
        if (!open) dismiss();
      }}
    >
      <AlertDialogContent initialFocus={dismissRef}>
        <AlertDialogHeader>
          <AlertDialogTitle>{current?.title}</AlertDialogTitle>
          <AlertDialogDescription>{current?.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button ref={dismissRef} onClick={dismiss}>
            {current?.dismissLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : null;
  return { notify, notificationDialog };
}

export { useNotificationDialog };
export type { NotificationOptions };
