import { useI18n } from "../../../i18n/I18nProvider";
import Pagination from "../../common/Pagination";
import type { Trip } from "../../../features/admin/useAdminTrips";

type Props = {
  trips: Trip[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  total: number;
  perPage: number;
  onDelete: (id: number) => void;
  onPageChange: (page: number) => void;
};

function formatDate(dateString?: string) {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "N/A";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatShortDate(dateString?: string) {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "N/A";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function AdminTripsSection({
  trips,
  loading,
  currentPage,
  totalPages,
  total,
  perPage,
  onDelete,
  onPageChange,
}: Props) {
  const { t } = useI18n();

  if (loading) return <div className="text-gray-500">{t("admin.loadingTrips")}</div>;

  return (
    <div className="space-y-4 lg:space-y-6">
      <h1 className="text-xl font-semibold text-gray-800 lg:text-2xl">{t("admin.manageTrips")}</h1>

      <div className="space-y-3 lg:hidden">
        {trips.map((trip) => (
          <div key={trip.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400">#{trip.id}</p>
                <p className="font-medium text-gray-900">{trip.driver?.first_name || "N/A"}</p>
                <div className="mt-2 space-y-1 text-sm text-gray-500">
                  <p>
                    <span className="font-medium text-gray-700">{t("admin.from")}:</span>{" "}
                    {trip.departure_address?.city?.name || "Unknown"}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">{t("admin.to")}:</span>{" "}
                    {trip.arrival_address?.city?.name || "Unknown"}
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
                onClick={() => onDelete(trip.id)}
                className="ml-3 rounded-md px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                {t("admin.delete")}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-xl border bg-white shadow-sm lg:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t("admin.id")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t("admin.driver")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t("admin.dateTime")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t("admin.route")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t("admin.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {trips.map((trip) => (
              <tr key={trip.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{trip.id}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {trip.driver?.first_name || "N/A"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {formatDate(trip.departure_time)}
                  <br />➔ {formatDate(trip.arrival_time)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {trip.departure_address?.city?.name || "Unknown"}
                  <br />➔ {trip.arrival_address?.city?.name || "Unknown"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <button
                    onClick={() => onDelete(trip.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    {t("admin.delete")}
                  </button>
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
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
