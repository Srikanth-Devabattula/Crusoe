import api from "@/lib/api";
import type { ApiResponse, News, NewsFormData } from "@/types";

type NewsMutationOptions = {
  coverFile?: File | null;
  removeCoverImage?: boolean;
};

function appendNewsFields(formData: FormData, data: Partial<NewsFormData>) {
  if (data.title !== undefined) formData.append("title", data.title);
  if (data.slug !== undefined && data.slug !== "") formData.append("slug", data.slug);
  if (data.excerpt !== undefined) formData.append("excerpt", data.excerpt);
  if (data.content !== undefined) formData.append("content", data.content);
  if (data.category !== undefined) formData.append("category", data.category);
  if (data.coverImage !== undefined) formData.append("coverImage", data.coverImage);
  if (data.featured !== undefined) formData.append("featured", String(data.featured));
  if (data.published !== undefined) formData.append("published", String(data.published));
}

function buildNewsFormData(data: Partial<NewsFormData>, options?: NewsMutationOptions) {
  const formData = new FormData();
  appendNewsFields(formData, data);
  if (options?.removeCoverImage) formData.append("removeCoverImage", "true");
  if (options?.coverFile) formData.append("coverImageFile", options.coverFile);
  return formData;
}

export const newsService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<News[]>>("/news");
    return response.data;
  },

  getPublished: async (category?: string) => {
    const params = category && category !== "all" ? { category } : undefined;
    const response = await api.get<ApiResponse<News[]>>("/news/public", { params });
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get<ApiResponse<News>>(`/news/slug/${slug}`);
    return response.data;
  },

  create: async (data: NewsFormData, options?: NewsMutationOptions) => {
    if (options?.coverFile || options?.removeCoverImage) {
      const response = await api.post<ApiResponse<News>>(
        "/news",
        buildNewsFormData(data, options)
      );
      return response.data;
    }
    const response = await api.post<ApiResponse<News>>("/news", data);
    return response.data;
  },

  update: async (id: string, data: Partial<NewsFormData>, options?: NewsMutationOptions) => {
    if (options?.coverFile || options?.removeCoverImage) {
      const response = await api.put<ApiResponse<News>>(
        `/news/${id}`,
        buildNewsFormData(data, options)
      );
      return response.data;
    }
    const response = await api.put<ApiResponse<News>>(`/news/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse>(`/news/${id}`);
    return response.data;
  },
};
