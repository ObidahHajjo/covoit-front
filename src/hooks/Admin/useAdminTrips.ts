import { useEffect, useState, useCallback } from "react";
import { fetchTrips, deleteTrip, type Trip } from "../../features/admin/useAdminTrips";
import { useI18n } from "../../i18n/I18nProvider";

export function useAdminTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 15;

  const loadTrips = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchTrips(currentPage, perPage);
      setTrips(res.data);
      setTotal(res.total);
      setTotalPages(res.last_page);
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage]);

  useEffect(() => {
    void loadTrips();
  }, [loadTrips]);

  const handleDelete = async (id: number) => {
    if (!window.confirm(t("admin.confirmDeleteTrip"))) return;
    try {
      await deleteTrip(id);
      await loadTrips();
    } catch {
      alert(t("admin.deleteError"));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    trips,
    loading,
    currentPage,
    totalPages,
    total,
    perPage,
    onDelete: handleDelete,
    onPageChange: handlePageChange,
  };
}
