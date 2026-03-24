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

export async function fetchCars(page: number, perPage: number): Promise<PaginatedCars> {
  const res = await apiClient.get(`/admin/cars?page=${page}&per_page=${perPage}`);
  return {
    data: res.data.data || res.data,
    total: res.data.total,
    last_page: res.data.last_page,
  };
}

export async function deleteCar(id: number): Promise<void> {
  await apiClient.delete(`/admin/cars/${id}`);
}
