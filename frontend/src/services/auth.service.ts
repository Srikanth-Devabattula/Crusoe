import api from "@/lib/api";
import type { ApiResponse, LoginFormData, RegisterFormData, User } from "@/types";

interface AuthData {
  user: User;
  token: string;
}

interface HasAdminData {
  hasAdmin: boolean;
}

export const authService = {
  hasAdmin: async () => {
    const response = await api.get<ApiResponse<HasAdminData>>("/auth/has-admin");
    return response.data;
  },

  register: async (data: RegisterFormData) => {
    const response = await api.post<ApiResponse<AuthData>>("/auth/register", data);
    return response.data;
  },

  login: async (data: LoginFormData) => {
    const response = await api.post<ApiResponse<AuthData>>("/auth/login", data);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get<ApiResponse<{ user: User }>>("/auth/me");
    return response.data;
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      document.cookie = "authToken=; path=/; max-age=0; SameSite=Lax";
    }
  },
};
