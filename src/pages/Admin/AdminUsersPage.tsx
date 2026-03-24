import { useEffect, useState } from "react";
import { apiClient } from "../../app/apiClient";
import { useI18n } from "../../i18n/I18nProvider";

export default function AdminUsersPage() {
	const [users, setUsers] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { t } = useI18n();

	const fetchUsers = () => {
		apiClient.get("/admin/users")
			.then(res => setUsers(res.data.data))
			.catch(err => setError(err.message))
			.finally(() => setLoading(false));
	};

	useEffect(() => fetchUsers(), []);

	const deleteUser = (id: number) => {
		if (!window.confirm(t("admin.confirmDelete"))) return;
		apiClient.delete(`/admin/users/${id}`)
			.then(() => fetchUsers())
			.catch(err => alert(t("admin.deleteError") + ". " + err.message));
	};

	if (loading) return <div>{t("admin.loadingUsers")}</div>;
	if (error) return <div className="text-red-500">{error}</div>;

	return (
		<div className="space-y-6">
		<h1 className="text-2xl font-semibold text-gray-800">{t("admin.manageUsers")}</h1>
		<div className="overflow-hidden rounded-xl border bg-white shadow-sm">
		<table className="min-w-full divide-y divide-gray-200">
		<thead className="bg-gray-50">
		<tr>
		<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t("admin.id")}</th>
		<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t("admin.email")}</th>
		<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t("admin.role")}</th>
		<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t("admin.actions")}</th>
		</tr>
		</thead>
		<tbody className="divide-y divide-gray-200 bg-white">
		{users.map((user: any) => (
		<tr key={user.id}>
		<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{user.id}</td>
		<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.email}</td>
		<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.role?.name || "N/A"}</td>
		<td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
		<button onClick={() => deleteUser(user.id)} className="text-red-600 hover:text-red-900">{t("admin.delete")}</button>
		</td>
		</tr>
		))}
		</tbody>
		</table>
		</div>
		</div>
	);
}
