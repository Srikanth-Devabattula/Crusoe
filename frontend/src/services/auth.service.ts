import api from "@/lib/api";
import type { ApiResponse, User, VerifyOtpFormData } from "@/types";

interface AuthData {
  user: User;
  token: string;
}

export const authService = {
  sendOtp: async (email: string) => {
    const response = await api.post<ApiResponse>("/auth/send-otp", { email });
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpFormData) => {
    const response = await api.post<ApiResponse<AuthData>>("/auth/verify-otp", data);
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
