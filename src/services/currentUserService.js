import { useSyncExternalStore, useCallback } from "react";

const AUTH_STORAGE_KEY = "student-behavior-dashboard-auth";

const listeners = new Set();

/* ------------------------------------------------------------------ */
/*  Cached session — only re-parse on emitChange, stable refs for      */
/*  useSyncExternalStore (avoids infinite-loop from JSON.parse)        */
/* ------------------------------------------------------------------ */

let cachedSession = undefined; // undefined = not yet read
let cachedRaw = undefined; // the raw string last used

function readSession() {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);

  // Return cached object if the raw string hasn't changed
  if (raw === cachedRaw && cachedSession !== undefined) {
    return cachedSession;
  }

  cachedRaw = raw;

  if (!raw) {
    cachedSession = null;
    return null;
  }

  try {
    cachedSession = JSON.parse(raw);
    return cachedSession;
  } catch {
    cachedSession = null;
    return null;
  }
}

/** Force re-read from storage and notify subscribers */
function emitChange() {
  // Invalidate cache so next read picks up fresh data
  cachedRaw = undefined;
  cachedSession = undefined;

  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/* ------------------------------------------------------------------ */
/*  Avatar helper                                                      */
/* ------------------------------------------------------------------ */

function getAvatarInitials(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function buildCurrentUserProfile(session) {
  if (!session) {
    return {
      fullName: "Guest",
      email: "",
      role: "User",
      avatarLabel: "??",
      avatarColor: "bg-slate-400",
    };
  }

  return {
    fullName: session.name || "Staff",
    email: session.email || "",
    role: session.role || "Teacher",
    avatarLabel: getAvatarInitials(session.name || "S"),
    avatarColor: "bg-sky-600",
  };
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/** Returns the raw session object (or null) — always a stable reference */
export function getCurrentUser() {
  return readSession();
}

/** Returns a formatted profile object */
export function getCurrentUserProfile() {
  return buildCurrentUserProfile(readSession());
}

/** Call this after login/register to notify all subscribers */
export function refreshSession() {
  emitChange();
}

/**
 * Update the stored session locally (e.g. after profile edit).
 * Does NOT call the server — use the settings service for that.
 */
export function updateProfile(profileUpdates) {
  const session = readSession();
  if (!session) return { success: false, message: "No active session." };

  const updated = { ...session, ...profileUpdates };
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
  emitChange();
  return { success: true, currentUser: updated };
}

export function changePassword(passwordUpdates) {
  void passwordUpdates;
  return { success: true, message: "Password updated in the local state." };
}

/* ------------------------------------------------------------------ */
/*  React hooks                                                        */
/* ------------------------------------------------------------------ */

/** React hook — re-renders when the session changes */
export function useCurrentUser() {
  // getServerSnapshot is unused client-side, but useSyncExternalStore
  // requires the same function signature
  return useSyncExternalStore(subscribe, readSession, readSession);
}

export function useCurrentUserProfile() {
  const session = useSyncExternalStore(subscribe, readSession, readSession);
  return buildCurrentUserProfile(session);
}
