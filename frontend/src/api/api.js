import axios from "axios";

// Read dynamically from environment (Vercel)
const API_BASE = import.meta.env.VITE_API_URL || "https://kicks-tkmv.onrender.com";

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;