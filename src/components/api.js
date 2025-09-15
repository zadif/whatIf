import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// 🔄 Interceptor to handle expired access token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log(error.response.data.message);
    if (error.response.data.message == "Refresh token is not present") {
      alert("Login again");
      return;
    }
    // If access token is invalid/expired and we haven't retried yet
    if (
      (error.response?.status === 403 && !originalRequest._retry) ||
      error.response.data.message === "Access token is not present"
    ) {
      if (originalRequest) originalRequest._retry = true;
      try {
        // Call refresh route
        await api.get("/refresh");

        // Retry the original request with new cookies
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        // maybe redirect user to login page
      }
    }

    return Promise.reject(error);
  }
);

export default api;
