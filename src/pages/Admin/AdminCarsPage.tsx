import { useEffect, useState } from "react";
import { apiClient as api } from "../../app/apiClient";
import { useI18n } from "../../i18n/I18nProvider";

export default function AdminCarsPage() {
	const [cars, setCars] = useState([]);
	const [loading, setLoading] = useState(true);
	const { t } = useI18n();

	const fetchCars = () => {
		api.get("/admin/cars")
			.then((res) => setCars(res.data.data || res.data))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchCars();
	}, []);

	const deleteCar = (id: number) => {
		if (!window.confirm(t("admin.confirmDeleteCar"))) return;
		api.delete(`/admin/cars/${id}`)
			.then(fetchCars)
			.catch((e) => alert(e.response?.data?.message || t("admin.deleteError")));
	};

	if (loading) return <div>{t("admin.loadingCars")}</div>;

	return (
		<div className="space-y-6">
		<h1 className="text-2xl font-semibold text-gray-800">{t("admin.registeredVehicles")}</h1>

		<div className="overflow-hidden rounded-xl border bg-white shadow-sm">
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
		</div>
	);
}
