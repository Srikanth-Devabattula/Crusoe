import axios from "axios";
import { API_BASE_URL } from "@/constants";

/**
 * Shared Axios instance for API requests.
 * Attaches auth token from localStorage when available (client-side only).
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error logging — extend with toast/redirect as needed
    if (process.env.NODE_ENV === "development") {
      console.error("[API Error]", error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
