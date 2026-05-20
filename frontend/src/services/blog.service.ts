import api from "@/lib/api";
import type { ApiResponse, Blog, BlogCategory, BlogFormData } from "@/types";

type BlogMutationOptions = {
  coverFile?: File | null;
  removeCoverImage?: boolean;
};

function appendBlogFields(formData: FormData, data: Partial<BlogFormData>) {
  if (data.title !== undefined) formData.append("title", data.title);
  if (data.slug !== undefined && data.slug !== "") formData.append("slug", data.slug);
  if (data.excerpt !== undefined) formData.append("excerpt", data.excerpt);
  if (data.content !== undefined) formData.append("content", data.content);
  if (data.category !== undefined) formData.append("category", data.category);
  if (data.coverImage !== undefined) formData.append("coverImage", data.coverImage);
  if (data.featured !== undefined) formData.append("featured", String(data.featured));
  if (data.published !== undefined) formData.append("published", String(data.published));
}

function buildBlogFormData(
  data: Partial<BlogFormData>,
  options?: BlogMutationOptions
): FormData {
  const formData = new FormData();
  appendBlogFields(formData, data);

  if (options?.removeCoverImage) {
    formData.append("removeCoverImage", "true");
  }

  if (options?.coverFile) {
    formData.append("coverImageFile", options.coverFile);
  }

  return formData;
}

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

  create: async (data: BlogFormData, options?: BlogMutationOptions) => {
    if (options?.coverFile || options?.removeCoverImage) {
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
    options?: BlogMutationOptions
  ) => {
    if (options?.coverFile || options?.removeCoverImage) {
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
