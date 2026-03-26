import { apiClient } from "../../app/apiClient";

export interface Brand {
  id: number;
  name: string;
}

export interface PaginatedBrands {
  data: Brand[];
  total: number;
  last_page: number;
}

/**
 * Fetches a paginated list of vehicle brands.
 *
 * @param page - The page number to retrieve.
 * @param perPage - Number of brands per page.
 * @returns A paginated brand response.
 */
export async function fetchBrands(page: number, perPage: number): Promise<PaginatedBrands> {
  const res = await apiClient.get(`/admin/brands?page=${page}&per_page=${perPage}`);
  return {
    data: res.data.data || res.data,
    total: res.data.total,
    last_page: res.data.last_page,
  };
}

/**
 * Creates a new vehicle brand.
 *
 * @param name - The name of the brand to create.
 */
export async function createBrand(name: string): Promise<void> {
  await apiClient.post("/admin/brands", { name });
}

/**
 * Updates an existing vehicle brand's name.
 *
 * @param id - The ID of the brand to update.
 * @param name - The new name for the brand.
 */
export async function updateBrand(id: number, name: string): Promise<void> {
  await apiClient.put(`/admin/brands/${id}`, { name });
}

/**
 * Deletes a vehicle brand by its ID.
 *
 * @param id - The ID of the brand to delete.
 */
export async function deleteBrand(id: number): Promise<void> {
  await apiClient.delete(`/admin/brands/${id}`);
}
