import api from "@/lib/api";
import type { ApiResponse } from "@/types";

export const applicationService = {
  submit: async (formData: FormData) => {
    const response = await api.post<ApiResponse>("/applications", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
