import { useAdminCars } from "../../hooks/Admin/useAdminCars";
import { AdminCarsSection } from "../../components/ui/Admin/AdminCarsSection";

export default function AdminCarsPage() {
  const { cars, loading, currentPage, totalPages, total, perPage, onDelete, onPageChange } =
    useAdminCars();

  return (
    <AdminCarsSection
      cars={cars}
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
