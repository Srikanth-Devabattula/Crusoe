import api from "@/lib/api";
import type { ApiResponse, LoginFormData, User } from "@/types";

interface AuthData {
  user: User;
  token: string;
}

export const authService = {
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
