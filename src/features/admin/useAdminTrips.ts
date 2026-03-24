import { apiClient } from "../../app/apiClient";

export interface Trip {
  id: number;
  driver?: {
    first_name: string;
  };
  departure_time?: string;
  arrival_time?: string;
  departure_address?: {
    city?: {
      name: string;
    };
  };
  arrival_address?: {
    city?: {
      name: string;
    };
  };
}

export interface PaginatedTrips {
  data: Trip[];
  total: number;
  last_page: number;
}

export async function fetchTrips(page: number, perPage: number): Promise<PaginatedTrips> {
  const res = await apiClient.get(`/admin/trips?page=${page}&per_page=${perPage}`);
  return {
    data: res.data.data,
    total: res.data.total,
    last_page: res.data.last_page,
  };
}

export async function deleteTrip(id: number): Promise<void> {
  await apiClient.delete(`/admin/trips/${id}`);
}
