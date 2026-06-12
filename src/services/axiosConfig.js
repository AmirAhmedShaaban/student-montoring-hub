import axios from "axios";

const TOKEN_KEY = "student-behavior-dashboard-token";
const AUTH_STORAGE_KEY = "student-behavior-dashboard-auth";

const API = axios.create({
  baseURL: "/api",
});

// Attach the bearer token to every request when available.
API.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Handle Content-Type intelligently:
  // - FormData: let browser set multipart/form-data with correct boundary
  // - JSON/objects: set application/json
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else if (config.data && !config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

// Endpoints where a 401 means "invalid credentials", not an expired session.
// We must NOT redirect for these, so the form can show the error normally.
const AUTH_EXCLUDED_PATHS = ["/Auth/login", "/Auth/register"];

// Handle expired/invalid sessions globally: clear local auth data and force
// a redirect to the login page. Guards prevent redirect loops.
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    const isAuthRequest = AUTH_EXCLUDED_PATHS.some((path) =>
      requestUrl.includes(path),
    );

    const isAlreadyOnLogin =
      typeof window !== "undefined" &&
      window.location.pathname.startsWith("/login");

    // ⛔ ignore non-auth related 401 during initial hydration edge cases
    const isInitialRequest =
      error.config?._isRetry === undefined &&
      performance?.navigation?.type === 0;

    if (
      status === 401 &&
      !isAuthRequest &&
      !isAlreadyOnLogin &&
      !isInitialRequest
    ) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY);

      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

// Separate base URL for file/image/static asset hosting.
// This is intentionally distinct from the Axios API proxy baseURL.
export const FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL || "/files";

export default API;
