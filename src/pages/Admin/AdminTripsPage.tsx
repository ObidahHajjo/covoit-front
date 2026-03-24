import { useAdminTrips } from "../../hooks/Admin/useAdminTrips";
import { AdminTripsSection } from "../../components/ui/Admin/AdminTripsSection";

export default function AdminTripsPage() {
  const { trips, loading, currentPage, totalPages, total, perPage, onDelete, onPageChange } =
    useAdminTrips();

  return (
    <AdminTripsSection
      trips={trips}
      loading={loading}
      currentPage={currentPage}
      totalPages={totalPages}
      total={total}
      perPage={perPage}
      onDelete={onDelete}
      onPageChange={onPageChange}
    />
  );
}
