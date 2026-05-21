import api from "@/lib/api";
import type { ApiResponse, ContactFormData, ContactStatus, ContactSubmission } from "@/types";

export const contactService = {
  submit: async (data: ContactFormData) => {
    const response = await api.post<ApiResponse>("/contact", data);
    return response.data;
  },

  getAdminList: async () => {
    const response = await api.get<ApiResponse<ContactSubmission[]>>("/contact/admin");
    return response.data;
  },

  updateStatus: async (id: string, status: ContactStatus) => {
    const response = await api.patch<ApiResponse<ContactSubmission>>(
      `/contact/${id}/status`,
      { status }
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse>(`/contact/${id}`);
    return response.data;
  },

  deleteMany: async (ids: string[]) => {
    const response = await api.post<ApiResponse<{ deletedCount: number }>>(
      "/contact/admin/bulk-delete",
      { ids }
    );
    return response.data;
  },
};
