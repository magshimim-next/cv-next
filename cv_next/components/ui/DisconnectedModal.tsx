"use client";

import { Button } from "@/components/ui/button";

interface DisconnectedModalProps {
  onDismiss: () => void;
}

/**
 * Blocking modal shown after the user has been automatically signed out due to
 * inactivity. Requires acknowledgement before redirecting to the home page.
 * @param {DisconnectedModalProps} root0 - Component props.
 * @param {() => void} root0.onDismiss - Called when the user dismisses the modal.
 * @returns {JSX.Element} The modal component.
 */
export default function DisconnectedModal({
  onDismiss,
}: DisconnectedModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-sm rounded-xl bg-theme-700 p-8 text-center shadow-2xl">
        <h2 className="mb-2 text-xl font-semibold text-white">
          You have been disconnected
        </h2>
        <p className="mb-6 text-sm text-white/70">
          You were signed out due to inactivity.
        </p>
        <Button onClick={onDismiss} variant="secondary" className="w-full">
          OK
        </Button>
      </div>
    </div>
  );
}
