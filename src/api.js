import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? ${import.meta.env.VITE_API_URL}/api
    : "http://localhost:4000/api",
});

/**
 * Automatically attach JWT to every request
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("9jatax_token");

    if (token) {
      config.headers.Authorization = Bearer ${token};
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;