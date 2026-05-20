import api from "@/lib/api";
import type { ApiResponse, JobWithApplications } from "@/types";

export const applicationService = {
  submit: async (formData: FormData) => {
    const response = await api.post<ApiResponse>("/applications", formData);
    return response.data;
  },

  getAdminGrouped: async () => {
    const response = await api.get<ApiResponse<JobWithApplications[]>>(
      "/applications/admin"
    );
    return response.data;
  },
};
