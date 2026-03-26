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

/**
 * Fetches a paginated list of vehicle models.
 *
 * @param page - The page number to retrieve.
 * @param perPage - Number of models per page.
 * @returns A paginated model response.
 */
export async function fetchModels(page: number, perPage: number): Promise<PaginatedModels> {
  const res = await apiClient.get(`/admin/models?page=${page}&per_page=${perPage}`);
  return {
    data: res.data.data || res.data,
    total: res.data.total,
    last_page: res.data.last_page,
  };
}

/**
 * Fetches all available brands for model selection.
 *
 * @returns A list of brand records.
 */
export async function fetchBrandsForModels(): Promise<Brand[]> {
  const res = await apiClient.get("/admin/brands?per_page=100");
  return res.data.data || res.data;
}

/**
 * Fetches all available vehicle types (e.g., Sedan, SUV).
 *
 * @returns A list of vehicle type records.
 */
export async function fetchTypes(): Promise<CarType[]> {
  const res = await apiClient.get("/types");
  return res.data.data || res.data;
}

/**
 * Creates a new vehicle model associated with a brand and type.
 *
 * @param payload - Model details including name, brand ID, and type ID.
 */
export async function createModel(payload: {
  name: string;
  brand_id: string;
  type_id: string;
}): Promise<void> {
  await apiClient.post("/admin/models", payload);
}

/**
 * Updates an existing vehicle model.
 *
 * @param id - The ID of the model to update.
 * @param payload - New model details.
 */
export async function updateModel(
  id: number,
  payload: { name: string; brand_id: string; type_id: string },
): Promise<void> {
  await apiClient.put(`/admin/models/${id}`, payload);
}

/**
 * Deletes a vehicle model by its ID.
 *
 * @param id - The ID of the model to delete.
 */
export async function deleteModel(id: number): Promise<void> {
  await apiClient.delete(`/admin/models/${id}`);
}
