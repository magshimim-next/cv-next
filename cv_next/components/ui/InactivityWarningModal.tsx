"use client";

import { Button } from "@/components/ui/button";

interface InactivityWarningModalProps {
  secondsLeft: number;
  onStillHere: () => void;
}

/**
 * Blocking modal shown when the user has been idle for the inactivity threshold.
 * Displays a live countdown and requires the user to confirm they are still present.
 * If ignored until the countdown reaches zero, the parent handles sign-out.
 * @param {InactivityWarningModalProps} root0 - Component props.
 * @param {number} root0.secondsLeft - Remaining seconds before automatic sign-out.
 * @param {() => void} root0.onStillHere - Called when the user confirms they are still present.
 * @returns {JSX.Element} The modal component.
 */
export default function InactivityWarningModal({
  secondsLeft,
  onStillHere,
}: InactivityWarningModalProps) {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeDisplay =
    minutes > 0
      ? `${minutes}:${seconds.toString().padStart(2, "0")}`
      : `${seconds}s`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-sm rounded-xl bg-theme-700 p-8 text-center shadow-2xl">
        <h2 className="mb-2 text-xl font-semibold text-white">
          Are you still there?
        </h2>
        <p className="mb-6 text-sm text-white/70">
          You will be signed out in{" "}
          <span className="font-mono font-semibold text-white">
            {timeDisplay}
          </span>
        </p>
        <Button onClick={onStillHere} variant="secondary" className="w-full">
          I&apos;m still here
        </Button>
      </div>
    </div>
  );
}
