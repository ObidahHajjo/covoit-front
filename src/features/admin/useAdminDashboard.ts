import { apiClient } from "../../app/apiClient";

export interface DashboardStats {
  total_users: number;
  total_trips: number;
  total_cars: number;
  total_brands: number;
  total_models: number;
  waitingSessions: number;
  activeSessions: number;
  unreadMessages: number;
}

/**
 * Retrieves global administration statistics from the backend.
 *
 * @returns A promise resolving to the dashboard stats.
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await apiClient.get("/admin/stats");
  return res.data;
}
