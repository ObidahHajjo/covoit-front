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

/**
 * Fetches a paginated list of application users.
 *
 * @param page - The page number to retrieve.
 * @param perPage - Number of users per page.
 * @returns A paginated user response.
 */
export async function fetchUsers(page: number, perPage: number): Promise<PaginatedUsers> {
  const res = await apiClient.get(`/admin/users?page=${page}&per_page=${perPage}`);
  return {
    data: res.data.data,
    total: res.data.total,
    last_page: res.data.last_page,
  };
}

/**
 * Deletes a user account andrevokes their access.
 *
 * @param id - The ID of the user to delete.
 */
export async function deleteUser(id: number): Promise<void> {
  await apiClient.delete(`/admin/users/${id}`);
}
