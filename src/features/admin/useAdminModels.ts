import { apiClient } from "../../app/apiClient";

export interface Brand {
  id: number;
  name: string;
}

export interface CarType {
  id: number;
  name: string;
}

export interface CarModel {
  id: number;
  name: string;
  brand_id: number;
  type_id: number;
  brand?: Brand;
  type?: CarType;
}

export interface PaginatedModels {
  data: CarModel[];
  total: number;
  last_page: number;
}

export async function fetchModels(page: number, perPage: number): Promise<PaginatedModels> {
  const res = await apiClient.get(`/admin/models?page=${page}&per_page=${perPage}`);
  return {
    data: res.data.data || res.data,
    total: res.data.total,
    last_page: res.data.last_page,
  };
}

export async function fetchBrandsForModels(): Promise<Brand[]> {
  const res = await apiClient.get("/admin/brands?per_page=100");
  return res.data.data || res.data;
}

export async function fetchTypes(): Promise<CarType[]> {
  const res = await apiClient.get("/types");
  return res.data.data || res.data;
}

export async function createModel(payload: {
  name: string;
  brand_id: string;
  type_id: string;
}): Promise<void> {
  await apiClient.post("/admin/models", payload);
}

export async function updateModel(
  id: number,
  payload: { name: string; brand_id: string; type_id: string },
): Promise<void> {
  await apiClient.put(`/admin/models/${id}`, payload);
}

export async function deleteModel(id: number): Promise<void> {
  await apiClient.delete(`/admin/models/${id}`);
}
