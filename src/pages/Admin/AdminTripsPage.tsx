import { useEffect, useState, useCallback } from "react";
import { apiClient } from "../../app/apiClient";
import { useI18n } from "../../i18n/I18nProvider";
import Pagination from "../../components/common/Pagination";

export default function AdminTripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 15;

  const fetchTrips = useCallback(() => {
    setLoading(true);
    apiClient.get(`/admin/trips?page=${currentPage}&per_page=${perPage}`)
      .then(res => {
        setTrips(res.data.data);
        setTotal(res.data.total);
        setTotalPages(res.data.last_page);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [currentPage]);

  useEffect(() => fetchTrips(), [fetchTrips]);

  const deleteTrip = (id: number) => {
    if (!window.confirm(t("admin.confirmDeleteTrip"))) return;
    apiClient.delete(`/admin/trips/${id}`)
      .then(() => fetchTrips())
      .catch(() => alert(t("admin.deleteError")));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "N/A";
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const formatShortDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "N/A";
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <div className="text-gray-500">{t("admin.loadingTrips")}</div>;

  return (
    <div className="space-y-4 lg:space-y-6">
      <h1 className="text-xl font-semibold text-gray-800 lg:text-2xl">{t("admin.manageTrips")}</h1>

      {/* Mobile Card View */}
      <div className="space-y-3 lg:hidden">
        {trips.map((trip: any) => (
          <div key={trip.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400">#{trip.id}</p>
                <p className="font-medium text-gray-900">{trip.driver?.first_name || "N/A"}</p>
                <div className="mt-2 space-y-1 text-sm text-gray-500">
                  <p>
                    <span className="font-medium text-gray-700">{t("admin.from")}:</span>{" "}
                    {trip.departure_address?.city?.name || trip.departureAddress?.city?.name || "Unknown"}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">{t("admin.to")}:</span>{" "}
                    {trip.arrival_address?.city?.name || trip.arrivalAddress?.city?.name || "Unknown"}
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {formatShortDate(trip.departure_time)}
                  </span>
                  <span className="text-xs text-gray-400">→</span>
                  <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {formatShortDate(trip.arrival_time)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => deleteTrip(trip.id)}
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
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t("admin.driver")}</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t("admin.dateTime")}</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t("admin.route")}</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t("admin.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {trips.map((trip: any) => (
              <tr key={trip.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{trip.id}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{trip.driver?.first_name || "N/A"}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {formatDate(trip.departure_time)}<br/>
                  ➔ {formatDate(trip.arrival_time)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {trip.departure_address?.city?.name || trip.departureAddress?.city?.name || "Unknown"}
                  <br/>➔ {trip.arrival_address?.city?.name || trip.arrivalAddress?.city?.name || "Unknown"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <button onClick={() => deleteTrip(trip.id)} className="text-red-600 hover:text-red-900">{t("admin.delete")}</button>
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
