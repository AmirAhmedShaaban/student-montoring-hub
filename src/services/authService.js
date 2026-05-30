import API from "./axiosConfig";
import { authMockUsers } from "../mocks/authData.mock";

const AUTH_STORAGE_KEY = "student-behavior-dashboard-auth";
const TOKEN_KEY = "student-behavior-dashboard-token";

/**
 * Restores the fallback hint logic so other dependent components don't break
 * @returns {{email: string, password: string}}
 */
export function getLoginHint() {
  const [primaryUser] = authMockUsers;

  return primaryUser
    ? {
        email: primaryUser.email,
        password: primaryUser.password,
      }
    : { email: "", password: "" };
}

/**
 * Helper to write a JSON value safely to localStorage
 * @param {string} key
 * @param {any} value
 */
function writeJsonValue(key, value) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Retrieves the currently logged-in user profile from session storage
 * @returns {object|null}
 */
export function getCurrentUser() {
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

/**
 * Checks if a user session exists and is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  return Boolean(getCurrentUser());
}

/**
 * Authenticates user with the live backend API
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{success: boolean, session?: object, message?: string}>}
 */
export async function login(email, password) {
  console.log("LOGIN FUNCTION CALLED");

  try {
    const response = await API.post("/Auth/login", {
      email: email.trim(),
      password: password,
    });

    console.log("AXIOS RESPONSE");
    console.log(response);

    const result = response.data;

    console.log("RESULT");
    console.log(result);

    if (result && result.succeeded) {
      const serverData = result.data;

      console.log("Full Data from Server", serverData);

      // Persisting the access token securely
      window.localStorage.setItem(TOKEN_KEY, serverData.token);

      // Dynamic Extraction mapping: Check lowercase, PascalCase, or custom response shapes
      const extractedName =
        serverData.fullName ||
        serverData.FullName ||
        serverData.name ||
        serverData.Name ||
        serverData.username ||
        serverData.Username ||
        "Authenticated User";

      const extractedRole =
        serverData.role || serverData.Role || serverData.userRole || "Admin";

      const session = {
        name: extractedName,
        email: email.trim().toLowerCase(),
        role: extractedRole,
        signedInAt: new Date().toISOString(),
      };

      writeJsonValue(AUTH_STORAGE_KEY, session);

      return {
        success: true,
        session,
      };
    }

    return {
      success: false,
      message: result.message || "Invalid credentials.",
    };
  } catch (error) {
    if (error.response && error.response.data) {
      return {
        success: false,
        message: error.response.data.message || "Authentication failed.",
      };
    }
    return {
      success: false,
      message: "The server is unreachable. Please verify your connection.",
    };
  }
}

/**
 * Registers a new administrative user and auto-logs them in locally
 * @param {object} userData
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function register(userData) {
  try {
    const response = await API.post("/Auth/register", {
      fullName: userData.fullName.trim(),
      email: userData.email.trim(),
      role: userData.role,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
      agreeToTerms: userData.agreeToTerms,
    });

    const result = response.data;
    console.log("LOGIN RESPONSE:", response.data);

    if (
      response.status === 200 ||
      response.status === 201 ||
      (result && result.succeeded)
    ) {
      // If the register endpoint drops a token directly, preserve it
      if (result.data?.token) {
        window.localStorage.setItem(TOKEN_KEY, result.data.token);
      }

      // Establish session payload instantly from the form values
      const session = {
        name: userData.fullName.trim(),
        email: userData.email.trim().toLowerCase(),
        role: userData.role || "Admin",
        signedInAt: new Date().toISOString(),
      };

      writeJsonValue(AUTH_STORAGE_KEY, session);

      return { success: true };
    }

    return {
      success: false,
      message: result.message || "Registration failed due to server rejection.",
    };
  } catch (error) {
    if (error.response && error.response.data) {
      const serverData = error.response.data;

      if (serverData.errors) {
        const errorMessages = Object.entries(serverData.errors)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join(" | ");

        return {
          success: false,
          message: errorMessages,
        };
      }

      return {
        success: false,
        message:
          serverData.message || "An account registration error occurred.",
      };
    }
    return {
      success: false,
      message: "Failed to connect to the authentication server.",
    };
  }
}

/**
 * Terminates user session, notifies the API backend, and clears local browser state
 */
export async function logout() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    await API.post("/Auth/logout");
  } catch (error) {
    console.error("Backend logout synchronization error:", error);
  } finally {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Local utility to calculate relative entropy/strength of a password input
 */
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

  if (score <= 2) return { label: "Weak", score: 1 };
  if (score === 3 || score === 4) return { label: "Moderate", score: 2 };
  return { label: "Strong", score: 3 };
}
