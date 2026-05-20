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

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse>(`/applications/${id}`);
    return response.data;
  },

  deleteMany: async (ids: string[]) => {
    const response = await api.post<ApiResponse<{ deletedCount: number }>>(
      "/applications/admin/bulk-delete",
      { ids }
    );
    return response.data;
  },
};
