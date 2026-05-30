import { useSyncExternalStore } from "react";
import { currentUserData } from "../mocks/currentUserData";

const listeners = new Set();

let currentUserState = {
  ...currentUserData,
};

function getAvatarInitials(name) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function buildCurrentUserProfile(user) {
  return {
    fullName: user.name,
    email: user.email,
    role: user.role,
    avatarLabel: getAvatarInitials(user.name),
    avatarColor: "bg-sky-600",
  };
}

function emitChange() {
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

export function getCurrentUser() {
  return currentUserState;
}

export function getCurrentUserProfile() {
  return buildCurrentUserProfile(currentUserState);
}

export function updateProfile(profileUpdates) {
  currentUserState = {
    ...currentUserState,
    ...profileUpdates,
  };

  emitChange();

  return {
    success: true,
    currentUser: currentUserState,
  };
}

export function changePassword(passwordUpdates) {
  void passwordUpdates;

  return {
    success: true,
    message: "Password updated in the local state.",
  };
}

export function useCurrentUser() {
  return useSyncExternalStore(subscribe, getCurrentUser, getCurrentUser);
}

export function useCurrentUserProfile() {
  const currentUser = useCurrentUser();
  return buildCurrentUserProfile(currentUser);
}
