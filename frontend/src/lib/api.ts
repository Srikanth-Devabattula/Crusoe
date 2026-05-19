import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "@/constants";
import { getApiErrorMessage } from "@/lib/api-error";

/**
 * Shared Axios instance — base URL from NEXT_PUBLIC_API_URL
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 30000,
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
  (error: AxiosError) => {
    const message = getApiErrorMessage(error);
    return Promise.reject(new Error(message));
  }
);

export default api;
export { getApiErrorMessage };
