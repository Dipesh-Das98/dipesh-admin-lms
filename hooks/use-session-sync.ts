"use client";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useCallback } from "react";

/**
 * Hook to synchronize session state after authentication
 * This helps ensure the session is properly updated after login
 */
export const useSessionSync = () => {
  const { data: session, status, update } = useSession();
  const lastStatusRef = useRef(status);
  const lastUpdateRef = useRef<number>(0);
  const updateCountRef = useRef<number>(0);
  
  // Debounce time (5 seconds between updates)
  const DEBOUNCE_TIME = 5000;
  // Max retries to prevent infinite loops
  const MAX_RETRIES = 3;

  // Helper function to perform update with tracking
  const performUpdate = useCallback((reason: string) => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;
    
    if (timeSinceLastUpdate < DEBOUNCE_TIME) {
      console.log("[SessionSync] Update blocked - too soon since last update");
      return;
    }
    
    if (updateCountRef.current >= MAX_RETRIES) {
      console.log("[SessionSync] Update blocked - max retries reached");
      return;
    }
    
    console.log(`[SessionSync] ${reason}`);
    lastUpdateRef.current = now;
    updateCountRef.current += 1;
    update();
  }, [update]);

  useEffect(() => {
    // Reset retry counter when session becomes authenticated
    if (status === "authenticated") {
      updateCountRef.current = 0;
      console.log("[SessionSync] Session authenticated - reset retry counter");
    }
    
    // Only refresh if we just logged in and session is still loading
    // Remove the aggressive loading->unauthenticated refresh
    if (lastStatusRef.current === "unauthenticated" && status === "loading") {
      // This is likely a legitimate session check, don't interfere
      console.log("[SessionSync] Session checking...");
    }
    
    console.log("[SessionSync] Session status updated:", status);
    lastStatusRef.current = status;
  }, [status]);

  // Listen for storage events (e.g., from other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "nextauth.message") {
        performUpdate("Received session update from storage");
      }
    };
    console.log("[Listening for storage changes]");

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [performUpdate]);

  // Listen for visibility change to refresh session when tab becomes visible
  // This is the main culprit for sleep/wake infinite loops
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Only refresh if user was authenticated before sleep
      // and only after a reasonable delay to avoid loops
      if (!document.hidden && status === "unauthenticated" && session) {
        // Add extra delay for sleep/wake scenarios
        setTimeout(() => {
          performUpdate("Refreshing session on tab focus after sleep/wake");
        }, 2000);
      }
    };
    console.log("[Listening for visibility changes]");

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [status, session, performUpdate]);

  return {
    session,
    status,
    refreshSession: update,
  };
};
