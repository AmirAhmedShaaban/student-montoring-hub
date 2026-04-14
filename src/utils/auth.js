const AUTH_STORAGE_KEY = "student-behavior-dashboard-auth";
const REGISTERED_USERS_STORAGE_KEY =
  "student-behavior-dashboard-registered-users";

export const dummyUsers = [
  {
    name: "Principal Morgan",
    email: "principal@school.edu",
    password: "Admin123!",
    role: "Principal",
  },
  {
    name: "Counselor Lee",
    email: "counselor@school.edu",
    password: "Counselor123!",
    role: "Counselor",
  },
  {
    name: "Teacher Rivera",
    email: "teacher@school.edu",
    password: "Teacher123!",
    role: "Teacher",
  },
];

function readJsonArray(key) {
  if (typeof window === "undefined") {
    return [];
  }

  const storedValue = window.localStorage.getItem(key);

  if (!storedValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(storedValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    window.localStorage.removeItem(key);
    return [];
  }
}

export function getRegisteredUsers() {
  return readJsonArray(REGISTERED_USERS_STORAGE_KEY);
}

function writeRegisteredUsers(users) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    REGISTERED_USERS_STORAGE_KEY,
    JSON.stringify(users),
  );
}

export function getAvailableUsers() {
  return [...dummyUsers, ...getRegisteredUsers()];
}

export function getStoredSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedSession = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    return JSON.parse(storedSession);
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getStoredSession());
}

export function signInWithDummyCredentials(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const matchedUser = getAvailableUsers().find(
    (user) =>
      user.email.toLowerCase() === normalizedEmail &&
      user.password === password,
  );

  if (!matchedUser) {
    return {
      success: false,
      message:
        "Invalid dummy credentials. Try principal@school.edu / Admin123!",
    };
  }

  const session = {
    name: matchedUser.name,
    email: matchedUser.email,
    role: matchedUser.role,
    signedInAt: new Date().toISOString(),
  };

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));

  return {
    success: true,
    session,
  };
}

export function registerDummyUser(userData) {
  const { name, email, password, role } = userData;
  const normalizedEmail = email.trim().toLowerCase();
  const availableUsers = getAvailableUsers();

  if (
    availableUsers.some(
      (user) => user.email.trim().toLowerCase() === normalizedEmail,
    )
  ) {
    return {
      success: false,
      message: "An account with that email already exists.",
    };
  }

  const registeredUsers = getRegisteredUsers();
  const newUser = {
    name: name.trim(),
    email: normalizedEmail,
    password,
    role,
  };

  writeRegisteredUsers([...registeredUsers, newUser]);

  const session = {
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    signedInAt: new Date().toISOString(),
  };

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));

  return {
    success: true,
    session,
  };
}

export function getPasswordStrength(password) {
  if (!password) {
    return { label: "Weak", score: 0 };
  }

  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) {
    return { label: "Weak", score: 1 };
  }

  if (score === 3 || score === 4) {
    return { label: "Moderate", score: 2 };
  }

  return { label: "Strong", score: 3 };
}

export function signOut() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
