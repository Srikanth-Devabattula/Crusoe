import api from "@/lib/api";
import type {
  AdminUserRecord,
  ApiResponse,
  CreateAdminUserPayload,
  UpdateAdminUserPayload,
} from "@/types";

export const userService = {
  list: async () => {
    const response = await api.get<ApiResponse<{ users: AdminUserRecord[] }>>("/users");
    return response.data;
  },

  create: async (data: CreateAdminUserPayload) => {
    const response = await api.post<ApiResponse<{ user: AdminUserRecord }>>("/users", data);
    return response.data;
  },

  update: async (id: string, data: UpdateAdminUserPayload) => {
    const response = await api.put<ApiResponse<{ user: AdminUserRecord }>>(
      `/users/${id}`,
      data
    );
    return response.data;
  },

  remove: async (id: string) => {
    const response = await api.delete<ApiResponse>(`/users/${id}`);
    return response.data;
  },
};
