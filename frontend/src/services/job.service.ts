import api from "@/lib/api";
import type { ApiResponse, Job, JobFormData } from "@/types";

export const jobService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Job[]>>("/jobs");
    return response.data;
  },

  create: async (data: JobFormData) => {
    const response = await api.post<ApiResponse<Job>>("/jobs", data);
    return response.data;
  },

  update: async (id: string, data: Partial<JobFormData>) => {
    const response = await api.put<ApiResponse<Job>>(`/jobs/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse>(`/jobs/${id}`);
    return response.data;
  },
};
