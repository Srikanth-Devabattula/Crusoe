import api from "@/lib/api";
import type { ApiResponse, Blog, BlogCategory, BlogFormData } from "@/types";

export const blogService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Blog[]>>("/blogs");
    return response.data;
  },

  getPublished: async (category?: BlogCategory | "all") => {
    const params =
      category && category !== "all" ? { category } : undefined;
    const response = await api.get<ApiResponse<Blog[]>>("/blogs/public", {
      params,
    });
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get<ApiResponse<Blog>>(`/blogs/slug/${slug}`);
    return response.data;
  },

  create: async (data: BlogFormData) => {
    const response = await api.post<ApiResponse<Blog>>("/blogs", data);
    return response.data;
  },

  update: async (id: string, data: Partial<BlogFormData>) => {
    const response = await api.put<ApiResponse<Blog>>(`/blogs/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse>(`/blogs/${id}`);
    return response.data;
  },
};
