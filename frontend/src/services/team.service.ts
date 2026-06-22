import api from "@/lib/api";
import type { ApiResponse, TeamMember, TeamMemberFormData } from "@/types";

type PhotoOptions = {
  photoFile?: File | null;
  removePhoto?: boolean;
};

function appendFields(formData: FormData, data: Partial<TeamMemberFormData>) {
  if (data.name !== undefined) formData.append("name", data.name);
  if (data.role !== undefined) formData.append("role", data.role);
  if (data.bio !== undefined) formData.append("bio", data.bio);
  if (data.photo !== undefined) formData.append("photo", data.photo);
  if (data.linkedIn !== undefined) formData.append("linkedIn", data.linkedIn);
  if (data.twitter !== undefined) formData.append("twitter", data.twitter);
  if (data.email !== undefined) formData.append("email", data.email);
  if (data.published !== undefined) formData.append("published", String(data.published));
  if (data.sortOrder !== undefined) formData.append("sortOrder", String(data.sortOrder));
}

function needsFormData(data: Partial<TeamMemberFormData>, options?: PhotoOptions) {
  return Boolean(options?.photoFile || options?.removePhoto || data.photo !== undefined);
}

function buildFormData(data: Partial<TeamMemberFormData>, options?: PhotoOptions) {
  const formData = new FormData();
  appendFields(formData, data);
  if (options?.removePhoto) formData.append("removePhoto", "true");
  if (options?.photoFile) formData.append("photoFile", options.photoFile);
  return formData;
}

export const teamService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<TeamMember[]>>("/team");
    return response.data;
  },

  getPublished: async () => {
    const response = await api.get<ApiResponse<TeamMember[]>>("/team/public");
    return response.data;
  },

  create: async (data: TeamMemberFormData, options?: PhotoOptions) => {
    if (needsFormData(data, options)) {
      const response = await api.post<ApiResponse<TeamMember>>(
        "/team",
        buildFormData(data, options)
      );
      return response.data;
    }
    const response = await api.post<ApiResponse<TeamMember>>("/team", data);
    return response.data;
  },

  update: async (id: string, data: Partial<TeamMemberFormData>, options?: PhotoOptions) => {
    if (needsFormData(data, options)) {
      const response = await api.put<ApiResponse<TeamMember>>(
        `/team/${id}`,
        buildFormData(data, options)
      );
      return response.data;
    }
    const response = await api.put<ApiResponse<TeamMember>>(`/team/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse>(`/team/${id}`);
    return response.data;
  },
};
