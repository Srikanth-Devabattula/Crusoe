import api from "@/lib/api";
import type { ApiResponse, NewsCategoryItem } from "@/types";

export const newsCategoryService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<NewsCategoryItem[]>>("/news-categories");
    return response.data;
  },

  create: async (data: { name: string; slug?: string }) => {
    const response = await api.post<ApiResponse<NewsCategoryItem>>(
      "/news-categories",
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse>(`/news-categories/${id}`);
    return response.data;
  },
};
