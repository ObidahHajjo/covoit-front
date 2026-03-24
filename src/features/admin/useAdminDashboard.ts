import { apiClient } from "../../app/apiClient";

export interface DashboardStats {
  total_users: number;
  total_trips: number;
  total_cars: number;
  total_brands: number;
  total_models: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await apiClient.get("/admin/stats");
  return res.data;
}
