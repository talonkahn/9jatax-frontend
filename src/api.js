import axios from "axios";

const API_BASE_URL = "https://ninejatax-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Attach JWT to requests EXCEPT auth routes
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("9jatax_token");

    if (
      token &&
      !config.url.includes("/auth/login") &&
      !config.url.includes("/auth/signup")
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;