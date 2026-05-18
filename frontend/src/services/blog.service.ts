import api from "@/lib/api";
import type { ApiResponse, Blog } from "@/types";

export const blogService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Blog[]>>("/blogs");
    return response.data;
  },

  create: async (data: Partial<Blog>) => {
    const response = await api.post<ApiResponse<Blog>>("/blogs", data);
    return response.data;
  },

  update: async (id: string, data: Partial<Blog>) => {
    const response = await api.put<ApiResponse<Blog>>(`/blogs/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse>(`/blogs/${id}`);
    return response.data;
  },
};
