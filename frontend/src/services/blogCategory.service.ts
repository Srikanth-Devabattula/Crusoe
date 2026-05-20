import api from "@/lib/api";
import type { ApiResponse, BlogCategoryItem } from "@/types";

export interface BlogCategoryFormData {
  name: string;
  slug?: string;
}

export const blogCategoryService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<BlogCategoryItem[]>>(
      "/blog-categories"
    );
    return response.data;
  },

  create: async (data: BlogCategoryFormData) => {
    const response = await api.post<ApiResponse<BlogCategoryItem>>(
      "/blog-categories",
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse>(`/blog-categories/${id}`);
    return response.data;
  },
};
