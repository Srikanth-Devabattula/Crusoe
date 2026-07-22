import api from "@/lib/api";
import type { AdminPermission, ApiResponse, StaffUser, StaffUserFormData } from "@/types";

function toPayload(data: StaffUserFormData | Partial<StaffUserFormData>) {
  const payload: Record<string, unknown> = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.email !== undefined) payload.email = data.email;
  if (data.password !== undefined && data.password.trim()) {
    payload.password = data.password;
  }
  if (data.permissions) {
    (Object.keys(data.permissions) as AdminPermission[]).forEach((key) => {
      payload[key] = data.permissions![key];
    });
  }
  return payload;
}

export const userService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<StaffUser[]>>("/users");
    return response.data;
  },

  create: async (data: StaffUserFormData) => {
    const response = await api.post<ApiResponse<StaffUser>>("/users", toPayload(data));
    return response.data;
  },

  update: async (id: string, data: Partial<StaffUserFormData>) => {
    const response = await api.put<ApiResponse<StaffUser>>(`/users/${id}`, toPayload(data));
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse>(`/users/${id}`);
    return response.data;
  },
};
