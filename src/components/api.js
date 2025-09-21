import axios from "axios";

// Global handler for session expiration - will be set by App component
let sessionExpirationHandler = null;
let isHandlingSessionExpiration = false;
let redirectInProgress = false;

// Function to set the handler from components that have access to toast/navigation
export const setSessionExpirationHandler = (handler) => {
  sessionExpirationHandler = handler;
};

let url = import.meta.env.VITE_Backend_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: url,
  withCredentials: true,
});

// 🔄 Interceptor to handle expired access token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if we need to handle session expiration
    const isRefreshTokenError =
      error.response?.data?.message === "Refresh token is not present" ||
      error.response?.data?.message ===
        "Invalid Refresh Token: Refresh Token Not Found";

    // If redirect is already in progress, don't try to handle auth errors again
    if (redirectInProgress) {
      return Promise.reject(error);
    }

    if (isRefreshTokenError && !isHandlingSessionExpiration) {
      // Prevent multiple calls
      isHandlingSessionExpiration = true;
      redirectInProgress = true;

      // Use the session expiration handler if available
      if (sessionExpirationHandler) {
        sessionExpirationHandler();
      }

      return Promise.reject(error);
    }
    // If access token is invalid/expired and we haven't retried yet
    if (
      !redirectInProgress &&
      ((error.response?.status === 403 && !originalRequest._retry) ||
        error.response?.data?.message === "Access token is not present")
    ) {
      if (originalRequest) originalRequest._retry = true;
      try {
        // Call refresh route
        let response = await api.get("/refresh");
        if (response.data) {
          let { username, email } = response.data;
          // Update localStorage with new user info
          localStorage.setItem("username", username);
          localStorage.setItem("email", email);
        }
        // Retry the original request with new cookies
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);

        // Handle session expiration if refresh token fails
        if (sessionExpirationHandler && !isHandlingSessionExpiration) {
          isHandlingSessionExpiration = true;
          redirectInProgress = true;
          sessionExpirationHandler();
        }
      }
    }

    return Promise.reject(error);
  }
);

// Reset auth handling state when app restarts or reloads
window.addEventListener("beforeunload", () => {
  isHandlingSessionExpiration = false;
  redirectInProgress = false;
});

export default api;
