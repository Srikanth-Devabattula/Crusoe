import api from "@/lib/api";
import type { ApiResponse, Partner, PartnerFormData } from "@/types";

type LogoOptions = {
  logoFile?: File | null;
  removeLogo?: boolean;
};

function appendFields(formData: FormData, data: Partial<PartnerFormData>) {
  if (data.name !== undefined) formData.append("name", data.name);
  if (data.logo !== undefined) formData.append("logo", data.logo);
  if (data.websiteUrl !== undefined) formData.append("websiteUrl", data.websiteUrl);
  if (data.published !== undefined) formData.append("published", String(data.published));
  if (data.sortOrder !== undefined) formData.append("sortOrder", String(data.sortOrder));
}

function needsFormData(data: Partial<PartnerFormData>, options?: LogoOptions) {
  return Boolean(options?.logoFile || options?.removeLogo || data.logo !== undefined);
}

function buildFormData(data: Partial<PartnerFormData>, options?: LogoOptions) {
  const formData = new FormData();
  appendFields(formData, data);
  if (options?.removeLogo) formData.append("removeLogo", "true");
  if (options?.logoFile) formData.append("logoFile", options.logoFile);
  return formData;
}

export const partnerService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Partner[]>>("/partners");
    return response.data;
  },

  getPublished: async () => {
    const response = await api.get<ApiResponse<Partner[]>>("/partners/public");
    return response.data;
  },

  create: async (data: PartnerFormData, options?: LogoOptions) => {
    if (needsFormData(data, options)) {
      const response = await api.post<ApiResponse<Partner>>(
        "/partners",
        buildFormData(data, options)
      );
      return response.data;
    }
    const response = await api.post<ApiResponse<Partner>>("/partners", data);
    return response.data;
  },

  update: async (id: string, data: Partial<PartnerFormData>, options?: LogoOptions) => {
    if (needsFormData(data, options)) {
      const response = await api.put<ApiResponse<Partner>>(
        `/partners/${id}`,
        buildFormData(data, options)
      );
      return response.data;
    }
    const response = await api.put<ApiResponse<Partner>>(`/partners/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse>(`/partners/${id}`);
    return response.data;
  },
};
