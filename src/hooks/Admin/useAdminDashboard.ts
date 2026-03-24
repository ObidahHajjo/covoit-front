import { useEffect, useState } from "react";
import { fetchDashboardStats, type DashboardStats } from "../../features/admin/useAdminDashboard";

export function useAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    total_users: 0,
    total_trips: 0,
    total_cars: 0,
    total_brands: 0,
    total_models: 0,
    waitingSessions: 0,
    activeSessions: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch {
        console.error();
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  return {
    stats,
    loading,
  };
}
