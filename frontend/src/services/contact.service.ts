import api from "@/lib/api";
import type { ApiResponse, ContactFormData } from "@/types";

export const contactService = {
  submit: async (data: ContactFormData) => {
    const response = await api.post<ApiResponse>("/contact", data);
    return response.data;
  },
};
