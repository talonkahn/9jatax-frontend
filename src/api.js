import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://ninejatax-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Automatically attach JWT to every request
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("9jatax_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;