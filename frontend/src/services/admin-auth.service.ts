import api from "@/lib/api";
import type { ApiResponse, User, VerifyOtpFormData } from "@/types";

interface AuthData {
  user: User;
  token: string;
}

export const adminAuthService = {
  sendOtp: async (email: string) => {
    const response = await api.post<ApiResponse<{ expiresInMinutes: number }>>(
      "/admin/send-otp",
      { email }
    );
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpFormData) => {
    const response = await api.post<ApiResponse<AuthData>>("/admin/verify-otp", data);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get<ApiResponse<{ user: User }>>("/admin/me");
    return response.data;
  },

  logout: async () => {
    try {
      await api.post<ApiResponse>("/admin/logout");
    } catch {
      // Clear local session even if API fails
    }
  },
};
