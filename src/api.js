// src/api.js
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "https://ninejatax-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Attach JWT to requests EXCEPT auth routes
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("9jatax_token");

    const isAuthRoute =
      config.url?.startsWith("/auth/login") ||
      config.url?.startsWith("/auth/signup") ||
      config.url?.startsWith("/auth/refresh");

    if (token && !isAuthRoute) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;