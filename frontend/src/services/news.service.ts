import api from "@/lib/api";
import type { ApiResponse, News, NewsFormData } from "@/types";

export type NewsMediaOptions = {
  galleryFiles?: File[];
  keepImages?: string[];
  removeImages?: string[];
  imageUrls?: string[];
  removeAllImages?: boolean;
};

function appendNewsFields(formData: FormData, data: Partial<NewsFormData>) {
  if (data.title !== undefined) formData.append("title", data.title);
  if (data.slug !== undefined && data.slug !== "") formData.append("slug", data.slug);
  if (data.excerpt !== undefined) formData.append("excerpt", data.excerpt);
  if (data.content !== undefined) formData.append("content", data.content);
  if (data.category !== undefined) formData.append("category", data.category);
  if (data.coverImage !== undefined) formData.append("coverImage", data.coverImage);
  if (data.videoUrl !== undefined) formData.append("videoUrl", data.videoUrl);
  if (data.videoUrls !== undefined) {
    formData.append("videoUrls", JSON.stringify(data.videoUrls));
  }
  if (data.featured !== undefined) formData.append("featured", String(data.featured));
  if (data.published !== undefined) formData.append("published", String(data.published));
}

function appendNewsMediaFields(formData: FormData, options?: NewsMediaOptions) {
  if (options?.keepImages !== undefined) {
    formData.append("keepImages", JSON.stringify(options.keepImages));
  }
  if (options?.removeImages?.length) {
    formData.append("removeImages", JSON.stringify(options.removeImages));
  }
  if (options?.imageUrls?.length) {
    formData.append("imageUrls", JSON.stringify(options.imageUrls));
  }
  if (options?.removeAllImages) {
    formData.append("removeAllImages", "true");
  }
  if (options?.galleryFiles?.length) {
    for (const file of options.galleryFiles) {
      formData.append("galleryImages", file);
    }
  }
}

function needsNewsFormData(data: Partial<NewsFormData>, options?: NewsMediaOptions) {
  return Boolean(
    options?.galleryFiles?.length ||
      options?.keepImages !== undefined ||
      options?.removeImages?.length ||
      options?.imageUrls?.length ||
      options?.removeAllImages ||
      data.videoUrl !== undefined ||
      data.videoUrls !== undefined
  );
}

function buildNewsFormData(data: Partial<NewsFormData>, options?: NewsMediaOptions) {
  const formData = new FormData();
  appendNewsFields(formData, data);
  appendNewsMediaFields(formData, options);
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

  create: async (data: NewsFormData, options?: NewsMediaOptions) => {
    if (needsNewsFormData(data, options)) {
      const response = await api.post<ApiResponse<News>>(
        "/news",
        buildNewsFormData(data, options)
      );
      return response.data;
    }
    const response = await api.post<ApiResponse<News>>("/news", data);
    return response.data;
  },

  update: async (id: string, data: Partial<NewsFormData>, options?: NewsMediaOptions) => {
    if (needsNewsFormData(data, options)) {
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
