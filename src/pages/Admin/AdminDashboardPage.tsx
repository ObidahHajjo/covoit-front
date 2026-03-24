import { useEffect, useState } from "react";
import { apiClient } from "../../app/apiClient";
import { useI18n } from "../../i18n/I18nProvider";

export default function AdminDashboardPage() {
	const [stats, setStats] = useState({ total_users: 0, total_trips: 0 });
	const [loading, setLoading] = useState(true);
	const { t } = useI18n();

	useEffect(() => {
		apiClient.get("/admin/stats")
			.then(res => setStats(res.data))
			.catch(err => console.error(err))
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <div className="p-4">{t("admin.loadingStats")}</div>;

	return (
		<div className="space-y-6">
		<h1 className="text-2xl font-semibold text-gray-800">{t("admin.overview")}</h1>
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
		<div className="overflow-hidden rounded-xl border bg-white p-6 shadow-sm">
		<div className="flex items-center gap-4">
		<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
		<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
		</div>
		<div>
		<p className="text-sm font-medium text-gray-500">{t("admin.totalUsers")}</p>
		<p className="text-3xl font-bold text-gray-900">{stats.total_users}</p>
		</div>
		</div>
		</div>
		<div className="overflow-hidden rounded-xl border bg-white p-6 shadow-sm">
		<div className="flex items-center gap-4">
		<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
		<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
		</div>
		<div>
		<p className="text-sm font-medium text-gray-500">{t("admin.totalTrips")}</p>
		<p className="text-3xl font-bold text-gray-900">{stats.total_trips}</p>
		</div>
		</div>
		</div>
		</div>
		</div>
	);
}
