import api from "@/lib/api";
import type { ApiResponse, HeroSlide, HeroSlideFormData } from "@/types";

type HeroSlideMediaOptions = {
  imageFile?: File | null;
  iconFile?: File | null;
  removeImage?: boolean;
  removeIcon?: boolean;
};

function appendFields(formData: FormData, data: Partial<HeroSlideFormData>) {
  if (data.title !== undefined) formData.append("title", data.title);
  if (data.description !== undefined) formData.append("description", data.description);
  if (data.image !== undefined) formData.append("image", data.image);
  if (data.icon !== undefined) formData.append("icon", data.icon);
  if (data.published !== undefined) formData.append("published", String(data.published));
  if (data.sortOrder !== undefined) formData.append("sortOrder", String(data.sortOrder));
  if (data.ctaLink !== undefined) formData.append("ctaLink", data.ctaLink);
}

function needsFormData(data: Partial<HeroSlideFormData>, options?: HeroSlideMediaOptions) {
  return Boolean(
    options?.imageFile ||
      options?.iconFile ||
      options?.removeImage ||
      options?.removeIcon ||
      data.image !== undefined ||
      data.icon !== undefined
  );
}

function buildFormData(data: Partial<HeroSlideFormData>, options?: HeroSlideMediaOptions) {
  const formData = new FormData();
  appendFields(formData, data);
  if (options?.removeImage) formData.append("removeImage", "true");
  if (options?.removeIcon) formData.append("removeIcon", "true");
  if (options?.imageFile) formData.append("imageFile", options.imageFile);
  if (options?.iconFile) formData.append("iconFile", options.iconFile);
  return formData;
}

export const heroSlideService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<HeroSlide[]>>("/hero-slides");
    return response.data;
  },

  getPublished: async () => {
    const response = await api.get<ApiResponse<HeroSlide[]>>("/hero-slides/public");
    return response.data;
  },

  create: async (data: HeroSlideFormData, options?: HeroSlideMediaOptions) => {
    if (needsFormData(data, options)) {
      const response = await api.post<ApiResponse<HeroSlide>>(
        "/hero-slides",
        buildFormData(data, options)
      );
      return response.data;
    }
    const response = await api.post<ApiResponse<HeroSlide>>("/hero-slides", data);
    return response.data;
  },

  update: async (id: string, data: Partial<HeroSlideFormData>, options?: HeroSlideMediaOptions) => {
    if (needsFormData(data, options)) {
      const response = await api.put<ApiResponse<HeroSlide>>(
        `/hero-slides/${id}`,
        buildFormData(data, options)
      );
      return response.data;
    }
    const response = await api.put<ApiResponse<HeroSlide>>(`/hero-slides/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse>(`/hero-slides/${id}`);
    return response.data;
  },
};
