import api from "@/lib/api";
import type { ApiResponse, Blog, BlogFormData } from "@/types";

export type BlogMediaOptions = {
  galleryFiles?: File[];
  keepImages?: string[];
  removeImages?: string[];
  imageUrls?: string[];
  removeAllImages?: boolean;
};

function appendBlogFields(formData: FormData, data: Partial<BlogFormData>) {
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
  if (data.publishedAt !== undefined) formData.append("publishedAt", data.publishedAt);
}

function appendBlogMediaFields(formData: FormData, options?: BlogMediaOptions) {
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

function needsBlogFormData(data: Partial<BlogFormData>, options?: BlogMediaOptions) {
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

function buildBlogFormData(
  data: Partial<BlogFormData>,
  options?: BlogMediaOptions
): FormData {
  const formData = new FormData();
  appendBlogFields(formData, data);
  appendBlogMediaFields(formData, options);
  return formData;
}

export const blogService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Blog[]>>("/blogs");
    return response.data;
  },

  getPublished: async (category?: string) => {
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

  create: async (data: BlogFormData, options?: BlogMediaOptions) => {
    if (needsBlogFormData(data, options)) {
      const formData = buildBlogFormData(data, options);
      const response = await api.post<ApiResponse<Blog>>("/blogs", formData);
      return response.data;
    }

    const response = await api.post<ApiResponse<Blog>>("/blogs", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<BlogFormData>,
    options?: BlogMediaOptions
  ) => {
    if (needsBlogFormData(data, options)) {
      const formData = buildBlogFormData(data, options);
      const response = await api.put<ApiResponse<Blog>>(`/blogs/${id}`, formData);
      return response.data;
    }

    const response = await api.put<ApiResponse<Blog>>(`/blogs/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse>(`/blogs/${id}`);
    return response.data;
  },
};
