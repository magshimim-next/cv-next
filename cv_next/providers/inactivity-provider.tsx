"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { createClientComponent } from "@/helpers/supabaseBrowserHelper";
import InactivityWarningModal from "@/components/ui/InactivityWarningModal";
import DisconnectedModal from "@/components/ui/DisconnectedModal";

const FEED_IDLE_MS = 5 * 60 * 1000;
const DEFAULT_IDLE_MS = 15 * 60 * 1000;
const COUNTDOWN_SECONDS = 120;

const PROTECTED_PREFIXES = [
  "/feed",
  "/cv/",
  "/profile/",
  "/upload",
  "/first_login/",
  "/admin",
  "/redirect",
];

/**
 * Returns true if the pathname is a protected route that should trigger
 * inactivity tracking. Matches the same routes as the Next.js middleware matcher.
 * @param {string} pathname - The current URL pathname.
 * @returns {boolean} True if the pathname is protected, false otherwise.
 */
function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix)
  );
}

/**
 * Watches for mouse inactivity on protected routes and signs the user out
 * if they remain idle too long. Shows a warning modal with a countdown before
 * signing out, then a disconnected modal afterward.
 *
 * Timeouts are page-specific: FEED_IDLE_MS on /feed, DEFAULT_IDLE_MS elsewhere.
 * Only active when the user is logged in and on a protected route.
 * @param {{ children: React.ReactNode }} root0 - Component props.
 * @param {React.ReactNode} root0.children - Child nodes to render.
 * @returns {JSX.Element} The provider component wrapping its children and modals.
 */
export function InactivityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { loginState, mutateUser, mutateUserIsAdmin } = useUser();
  const supabase = createClientComponent();

  const [showWarning, setShowWarning] = useState(false);
  const [showDisconnected, setShowDisconnected] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const showWarningRef = useRef(false);

  const isProtected = isProtectedPath(pathname);
  const idleMs = pathname === "/feed" ? FEED_IDLE_MS : DEFAULT_IDLE_MS;

  const clearCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const performSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    await mutateUser();
    await mutateUserIsAdmin();
  }, [supabase.auth, mutateUser, mutateUserIsAdmin]);

  const startIdleTimer = useCallback(
    (ms: number) => {
      clearIdleTimer();
      idleTimerRef.current = setTimeout(() => {
        showWarningRef.current = true;
        setShowWarning(true);
        setSecondsLeft(COUNTDOWN_SECONDS);

        countdownRef.current = setInterval(() => {
          setSecondsLeft((prev) => {
            if (prev <= 1) {
              clearInterval(countdownRef.current!);
              countdownRef.current = null;
              showWarningRef.current = false;
              setShowWarning(false);
              performSignOut().then(() => setShowDisconnected(true));
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, ms);
    },
    [clearIdleTimer, performSignOut]
  );

  const handleActivity = useCallback(() => {
    if (!showWarningRef.current) {
      startIdleTimer(idleMs);
    }
  }, [startIdleTimer, idleMs]);

  const handleStillHere = useCallback(() => {
    showWarningRef.current = false;
    setShowWarning(false);
    clearCountdown();
    startIdleTimer(idleMs);
  }, [clearCountdown, startIdleTimer, idleMs]);

  const handleDisconnectedDismiss = useCallback(() => {
    setShowDisconnected(false);
    router.push("/");
  }, [router]);

  useEffect(() => {
    if (!isProtected || !loginState) {
      clearIdleTimer();
      clearCountdown();
      return;
    }

    // Reset warning modal on navigation
    if (showWarningRef.current) {
      showWarningRef.current = false;
      setShowWarning(false);
      clearCountdown();
    }

    startIdleTimer(idleMs);
    window.addEventListener("mousemove", handleActivity);

    return () => {
      clearIdleTimer();
      clearCountdown();
      window.removeEventListener("mousemove", handleActivity);
    };
  }, [
    isProtected,
    loginState,
    pathname,
    idleMs,
    handleActivity,
    startIdleTimer,
    clearIdleTimer,
    clearCountdown,
  ]);

  return (
    <>
      {children}
      {showWarning && (
        <InactivityWarningModal
          secondsLeft={secondsLeft}
          onStillHere={handleStillHere}
        />
      )}
      {showDisconnected && (
        <DisconnectedModal onDismiss={handleDisconnectedDismiss} />
      )}
    </>
  );
}
