import API from "./axiosConfig";

const AUTH_STORAGE_KEY = "student-behavior-dashboard-auth";
const TOKEN_KEY = "student-behavior-dashboard-token";

function writeJsonValue(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function parseJwtPayload(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function extractRoleFromJwt(token) {
  const claims = parseJwtPayload(token);
  if (!claims) return null;
  return (
    claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    claims.role ||
    claims.Role ||
    null
  );
}

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getCurrentUser());
}

export async function login(email, password) {
  try {
    const response = await API.post("/Auth/login", {
      email: email.trim(),
      password: password,
    });

    const result = response.data;

    if (result && result.succeeded) {
      const serverData = result.data || {};
      const token = serverData.token;

      if (!token) {
        return {
          success: false,
          message: "Authentication succeeded, but no token was received.",
        };
      }

      window.localStorage.setItem(TOKEN_KEY, token);

      const jwtRole = extractRoleFromJwt(token);

      let role;
      if (Array.isArray(serverData.roles) && serverData.roles.length > 0) {
        role = serverData.roles[0];
      } else if (serverData.role) {
        role = serverData.role;
      } else if (serverData.Role) {
        role = serverData.Role;
      } else if (jwtRole) {
        role = jwtRole;
      }

      const session = {
        userId: serverData.id,
        name: serverData.fullName || "Authenticated User",
        email: email.trim().toLowerCase(),
        role,
        token,
        profilePicture: serverData.profilePicture || null,
        signedInAt: new Date().toISOString(),
      };

      writeJsonValue(AUTH_STORAGE_KEY, session);
      return { success: true, session };
    }

    return {
      success: false,
      message: result.message || "Invalid credentials.",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "The server is unreachable.",
    };
  }
}

export async function register(userData) {
  try {
    const response = await API.post("/Auth/register", {
      fullName: userData.fullName.trim(),
      email: userData.email.trim().toLowerCase(),
      role: userData.role,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
      agreeToTerms: userData.agreeToTerms,
    });

    const result = response.data;

    if (
      response.status === 200 ||
      response.status === 201 ||
      (result && result.succeeded)
    ) {
      const serverData = result.data || {};
      const token = serverData.token;

      if (token) window.localStorage.setItem(TOKEN_KEY, token);

      const jwtRole = token ? extractRoleFromJwt(token) : null;
      const role = jwtRole || userData.role || "Staff";

      const session = {
        userId: serverData.id || null,
        name: userData.fullName.trim(),
        email: userData.email.trim().toLowerCase(),
        role,
        token: token ?? null,
        profilePicture: serverData.profilePicture || null,
        signedInAt: new Date().toISOString(),
      };

      writeJsonValue(AUTH_STORAGE_KEY, session);
      return { success: true };
    }

    return {
      success: false,
      message: result.message || "Registration failed.",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to connect.",
    };
  }
}

export async function logout() {
  if (typeof window === "undefined") return;

  try {
    // Attempt to notify the backend. This may fail if the token is already
    // invalid (e.g. the session was replaced by a login from another device).
    await API.post("/Auth/logout");
  } catch (error) {
    // The logout call failing is non-critical; we clear the session anyway.
    console.log(error);
  } finally {
    // Always clear local auth data, regardless of the API result.
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

export function updateProfile(profileUpdates) {
  const session = getCurrentUser();
  if (!session) {
    return { success: false, message: "No active session found." };
  }

  const updatedSession = {
    ...session,
    ...profileUpdates,
  };

  writeJsonValue(AUTH_STORAGE_KEY, updatedSession);
  return { success: true, session: updatedSession };
}

export function getPasswordStrength(password) {
  if (!password) return { label: "Weak", score: 0 };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (score <= 2) return { label: "Weak", score: 1 };
  if (score === 3 || score === 4) return { label: "Moderate", score: 2 };
  return { label: "Strong", score: 3 };
}
