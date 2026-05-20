import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "@/constants";
import { getApiErrorMessage } from "@/lib/api-error";
import { ADMIN_TOKEN_KEY, getStoredToken } from "@/lib/auth-storage";

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
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      sessionStorage.removeItem("adminUser");
    }
    return Promise.reject(new Error(getApiErrorMessage(error)));
  }
);

export default api;
export { getApiErrorMessage };
