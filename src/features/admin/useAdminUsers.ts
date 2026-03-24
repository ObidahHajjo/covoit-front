import { apiClient } from "../../app/apiClient";

export interface User {
  id: number;
  email: string;
  role?: {
    name: string;
  };
}

export interface PaginatedUsers {
  data: User[];
  total: number;
  last_page: number;
}

export async function fetchUsers(page: number, perPage: number): Promise<PaginatedUsers> {
  const res = await apiClient.get(`/admin/users?page=${page}&per_page=${perPage}`);
  return {
    data: res.data.data,
    total: res.data.total,
    last_page: res.data.last_page,
  };
}

export async function deleteUser(id: number): Promise<void> {
  await apiClient.delete(`/admin/users/${id}`);
}
