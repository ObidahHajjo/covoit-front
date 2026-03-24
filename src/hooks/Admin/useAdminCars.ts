import { useEffect, useState, useCallback } from "react";
import { fetchCars, deleteCar, type Car } from "../../features/admin/useAdminCars";
import { useI18n } from "../../i18n/I18nProvider";

export function useAdminCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 15;

  const loadCars = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchCars(currentPage, perPage);
      setCars(res.data);
      setTotal(res.total);
      setTotalPages(res.last_page);
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage]);

  useEffect(() => {
    void loadCars();
  }, [loadCars]);

  const handleDelete = async (id: number) => {
    if (!window.confirm(t("admin.confirmDeleteCar"))) return;
    try {
      await deleteCar(id);
      await loadCars();
    } catch (err) {
      alert(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          t("admin.deleteError"),
      );
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    cars,
    loading,
    currentPage,
    totalPages,
    total,
    perPage,
    onDelete: handleDelete,
    onPageChange: handlePageChange,
  };
}
