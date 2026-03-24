import { useEffect, useState } from "react";
import { apiClient } from "../../app/apiClient";
import { useI18n } from "../../i18n/I18nProvider";

export default function AdminTripsPage() {
	const [trips, setTrips] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const { t } = useI18n();

	const fetchTrips = () => {
		apiClient.get("/admin/trips")
			.then(res => setTrips(res.data.data))
			.catch(err => console.error(err))
			.finally(() => setLoading(false));
	};

	useEffect(() => fetchTrips(), []);

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

	if (loading) return <div>{t("admin.loadingTrips")}</div>;

	return (
		<div className="space-y-6">
		<h1 className="text-2xl font-semibold text-gray-800">{t("admin.manageTrips")}</h1>
		<div className="overflow-hidden rounded-xl border bg-white shadow-sm">
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
		</div>
	);
}
