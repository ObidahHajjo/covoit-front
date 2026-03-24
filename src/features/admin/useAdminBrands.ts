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

export async function fetchBrands(page: number, perPage: number): Promise<PaginatedBrands> {
  const res = await apiClient.get(`/admin/brands?page=${page}&per_page=${perPage}`);
  return {
    data: res.data.data || res.data,
    total: res.data.total,
    last_page: res.data.last_page,
  };
}

export async function createBrand(name: string): Promise<void> {
  await apiClient.post("/admin/brands", { name });
}

export async function updateBrand(id: number, name: string): Promise<void> {
  await apiClient.put(`/admin/brands/${id}`, { name });
}

export async function deleteBrand(id: number): Promise<void> {
  await apiClient.delete(`/admin/brands/${id}`);
}
