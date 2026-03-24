import { useEffect, useState, useCallback } from "react";
import { apiClient as api } from "../../app/apiClient";
import { useI18n } from "../../i18n/I18nProvider";
import Pagination from "../../components/common/Pagination";

export default function AdminCarsPage() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 15;

  const fetchCars = useCallback(() => {
    setLoading(true);
    api.get(`/admin/cars?page=${currentPage}&per_page=${perPage}`)
      .then((res) => {
        setCars(res.data.data || res.data);
        setTotal(res.data.total);
        setTotalPages(res.data.last_page);
      })
      .finally(() => setLoading(false));
  }, [currentPage]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const deleteCar = (id: number) => {
    if (!window.confirm(t("admin.confirmDeleteCar"))) return;
    api.delete(`/admin/cars/${id}`)
      .then(fetchCars)
      .catch((e) => alert(e.response?.data?.message || t("admin.deleteError")));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <div className="text-gray-500">{t("admin.loadingCars")}</div>;

  return (
    <div className="space-y-4 lg:space-y-6">
      <h1 className="text-xl font-semibold text-gray-800 lg:text-2xl">{t("admin.registeredVehicles")}</h1>

      {/* Mobile Card View */}
      <div className="space-y-3 lg:hidden">
        {cars.map((car: any) => (
          <div key={car.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400">#{car.id}</p>
                <p className="truncate font-medium text-gray-900">{car.license_plate}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {car.model?.brand?.name || "N/A"} {car.model?.name || "N/A"}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {car.color?.name || "N/A"}
                  </span>
                  <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {car.seats} {t("admin.seats")}
                  </span>
                </div>
              </div>
              <button
                onClick={() => deleteCar(car.id)}
                className="ml-3 rounded-md px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                {t("admin.delete")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden overflow-hidden rounded-xl border bg-white shadow-sm lg:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t("admin.id")}</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t("admin.licensePlate")}</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t("admin.brandModel")}</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t("admin.color")}</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t("admin.seats")}</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t("admin.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {cars.map((car: any) => (
              <tr key={car.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{car.id}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{car.license_plate}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {car.model?.brand?.name || "N/A"} {car.model?.name || "N/A"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{car.color?.name || "N/A"}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{car.seats}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <button onClick={() => deleteCar(car.id)} className="text-red-600 hover:text-red-900">{t("admin.delete")}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border bg-white lg:border-0 lg:bg-transparent">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          perPage={perPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
