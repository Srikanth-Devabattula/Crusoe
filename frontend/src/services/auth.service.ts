import api from "@/lib/api";
import type { ApiResponse, LoginFormData, User } from "@/types";

export const authService = {
  login: async (data: LoginFormData) => {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>(
      "/auth/login",
      data
    );
    return response.data;
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }
  },
};
