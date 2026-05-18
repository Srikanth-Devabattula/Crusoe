import api from "@/lib/api";
import type { ApiResponse } from "@/types";

export interface HealthData {
  database?: {
    connected: boolean;
    name: string | null;
  };
}

export const healthService = {
  check: async () => {
    const response = await api.get<ApiResponse<HealthData>>("/health");
    return response.data;
  },
};
