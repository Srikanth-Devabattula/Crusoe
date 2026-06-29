import api from "@/lib/api";
import type { ApiResponse, ContactFormData, ContactSubmission, ContactStatus } from "@/types";

export const contactService = {
  submit: async (data: ContactFormData) => {
    const response = await api.post<ApiResponse>("/contact", data);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get<ApiResponse<ContactSubmission[]>>("/contact");
    return response.data;
  },

  updateStatus: async (id: string, status: ContactStatus) => {
    const response = await api.patch<ApiResponse<ContactSubmission>>(`/contact/${id}`, {
      status,
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse>(`/contact/${id}`);
    return response.data;
  },

  deleteMany: async (ids: string[]) => {
    await Promise.all(ids.map((id) => api.delete<ApiResponse>(`/contact/${id}`)));
  },
};
