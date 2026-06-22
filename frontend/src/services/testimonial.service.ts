import api from "@/lib/api";
import type { ApiResponse, Testimonial, TestimonialFormData } from "@/types";

type PhotoOptions = {
  photoFile?: File | null;
  removePhoto?: boolean;
};

function appendFields(formData: FormData, data: Partial<TestimonialFormData>) {
  if (data.name !== undefined) formData.append("name", data.name);
  if (data.title !== undefined) formData.append("title", data.title);
  if (data.company !== undefined) formData.append("company", data.company);
  if (data.quote !== undefined) formData.append("quote", data.quote);
  if (data.photo !== undefined) formData.append("photo", data.photo);
  if (data.rating !== undefined) formData.append("rating", String(data.rating));
  if (data.type !== undefined) formData.append("type", data.type);
  if (data.videoUrl !== undefined) formData.append("videoUrl", data.videoUrl);
  if (data.published !== undefined) formData.append("published", String(data.published));
  if (data.sortOrder !== undefined) formData.append("sortOrder", String(data.sortOrder));
}

function needsFormData(data: Partial<TestimonialFormData>, options?: PhotoOptions) {
  return Boolean(options?.photoFile || options?.removePhoto || data.photo !== undefined);
}

function buildFormData(data: Partial<TestimonialFormData>, options?: PhotoOptions) {
  const formData = new FormData();
  appendFields(formData, data);
  if (options?.removePhoto) formData.append("removePhoto", "true");
  if (options?.photoFile) formData.append("photoFile", options.photoFile);
  return formData;
}

export const testimonialService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Testimonial[]>>("/testimonials");
    return response.data;
  },

  getPublished: async (type?: "text" | "video") => {
    const params = type ? { type } : undefined;
    const response = await api.get<ApiResponse<Testimonial[]>>("/testimonials/public", {
      params,
    });
    return response.data;
  },

  create: async (data: TestimonialFormData, options?: PhotoOptions) => {
    if (needsFormData(data, options)) {
      const response = await api.post<ApiResponse<Testimonial>>(
        "/testimonials",
        buildFormData(data, options)
      );
      return response.data;
    }
    const response = await api.post<ApiResponse<Testimonial>>("/testimonials", data);
    return response.data;
  },

  update: async (id: string, data: Partial<TestimonialFormData>, options?: PhotoOptions) => {
    if (needsFormData(data, options)) {
      const response = await api.put<ApiResponse<Testimonial>>(
        `/testimonials/${id}`,
        buildFormData(data, options)
      );
      return response.data;
    }
    const response = await api.put<ApiResponse<Testimonial>>(`/testimonials/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse>(`/testimonials/${id}`);
    return response.data;
  },
};
