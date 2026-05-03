"use client";

import { Button } from "@/components/ui/button";

interface DisconnectedModalProps {
  onDismiss: () => void;
}

/**
 *
 * @param root0
 * @param root0.onDismiss
 */
export default function DisconnectedModal({
  onDismiss,
}: DisconnectedModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-sm rounded-xl bg-background p-8 text-center shadow-2xl">
        <h2 className="mb-2 text-xl font-semibold text-primary">
          You have been disconnected
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          You were signed out due to inactivity.
        </p>
        <Button onClick={onDismiss} className="w-full">
          OK
        </Button>
      </div>
    </div>
  );
}
