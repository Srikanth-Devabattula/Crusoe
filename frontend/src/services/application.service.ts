import api from "@/lib/api";
import type { ApiResponse, ApplicationStatus, JobApplication } from "@/types";

export const applicationService = {
  submit: async (formData: FormData) => {
    const response = await api.post<ApiResponse>("/applications", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getAll: async () => {
    const response = await api.get<ApiResponse<JobApplication[]>>("/applications");
    return response.data;
  },

  updateStatus: async (id: string, status: ApplicationStatus) => {
    const response = await api.patch<ApiResponse<JobApplication>>(`/applications/${id}`, {
      status,
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse>(`/applications/${id}`);
    return response.data;
  },

  deleteMany: async (ids: string[]) => {
    await Promise.all(ids.map((id) => api.delete<ApiResponse>(`/applications/${id}`)));
  },
};
