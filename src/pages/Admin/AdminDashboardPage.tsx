import { useAdminDashboard } from "../../hooks/Admin/useAdminDashboard";
import { AdminDashboardSection } from "../../components/ui/Admin/AdminDashboardSection";

export default function AdminDashboardPage() {
  const { stats, loading } = useAdminDashboard();

  return <AdminDashboardSection stats={stats} loading={loading} />;
}
