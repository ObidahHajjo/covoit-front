import { apiClient } from "../../app/apiClient";

export interface Car {
  id: number;
  license_plate: string;
  seats: number;
  model?: {
    name: string;
    brand?: {
      name: string;
    };
  };
  color?: {
    name: string;
  };
}

export interface PaginatedCars {
  data: Car[];
  total: number;
  last_page: number;
}

/**
 * Fetches a paginated list of vehicle records.
 *
 * @param page - The page number to retrieve.
 * @param perPage - Number of vehicles per page.
 * @returns A paginated car response.
 */
export async function fetchCars(page: number, perPage: number): Promise<PaginatedCars> {
  const res = await apiClient.get(`/admin/cars?page=${page}&per_page=${perPage}`);
  return {
    data: res.data.data || res.data,
    total: res.data.total,
    last_page: res.data.last_page,
  };
}

/**
 * Deletes a vehicle record by its ID.
 *
 * @param id - The ID of the car to delete.
 */
export async function deleteCar(id: number): Promise<void> {
  await apiClient.delete(`/admin/cars/${id}`);
}
