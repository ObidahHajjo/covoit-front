import { useEffect, useState } from "react";
import { apiClient as api } from "../../app/apiClient";
import { useI18n } from "../../i18n/I18nProvider";

export default function AdminModelsPage() {
	const [models, setModels] = useState([]);
	const [brands, setBrands] = useState([]);
	const [types, setTypes] = useState([]);
	const [loading, setLoading] = useState(true);
	const { t } = useI18n();

	const [name, setName] = useState("");
	const [brandId, setBrandId] = useState("");
	const [typeId, setTypeId] = useState("");
	const [editingId, setEditingId] = useState<number | null>(null);

	const fetchAll = () => {
		Promise.all([
			api.get("/admin/models?per_page=100"),
			api.get("/admin/brands?per_page=100"),
			api.get("/types")
		]).then(([modelsRes, brandsRes, typesRes]) => {
			setModels(modelsRes.data.data || modelsRes.data);
			setBrands(brandsRes.data.data || brandsRes.data);
			setTypes(typesRes.data.data || typesRes.data);
		}).finally(() => setLoading(false));
	};

	useEffect(() => { fetchAll(); }, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const payload = { name, brand_id: brandId, type_id: typeId };
		if (editingId) {
			api.put(`/admin/models/${editingId}`, payload).then(() => {
				resetForm();
				fetchAll();
			}).catch((e: any) => alert(e.response?.data?.message || t("admin.errorUpdating")));
		} else {
			api.post("/admin/models", payload).then(() => {
				resetForm();
				fetchAll();
			}).catch((e: any) => alert(e.response?.data?.message || t("admin.errorCreating")));
		}
	};

	const resetForm = () => {
		setEditingId(null);
		setName("");
		setBrandId("");
		setTypeId("");
	};

	const deleteModel = (id: number) => {
		if (!window.confirm(t("admin.confirmDeleteModel"))) return;
		api.delete(`/admin/models/${id}`)
			.then(fetchAll)
			.catch((e: any) => alert(e.response?.data?.message || t("admin.deleteError")));
	};

	if (loading) return <div>{t("admin.loadingModels")}</div>;

	return (
		<div className="space-y-6">
		<h1 className="text-2xl font-semibold text-gray-800">{t("admin.manageModels")}</h1>

		<form onSubmit={handleSubmit} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border items-center flex-wrap">
		<input
		type="text" value={name} onChange={(e) => setName(e.target.value)}
		placeholder={t("admin.modelNamePlaceholder")}
		className="flex-1 min-w-[200px] rounded-md border-gray-300 px-4 py-2 border outline-none focus:border-[var(--theme-primary)]" required
		/>
		<select value={brandId} onChange={(e) => setBrandId(e.target.value)} className="rounded-md border-gray-300 px-4 py-2 border outline-none bg-white focus:border-[var(--theme-primary)]" required>
		<option value="" disabled>{t("admin.selectBrand")}</option>
		{brands.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
		</select>
		<select value={typeId} onChange={(e) => setTypeId(e.target.value)} className="rounded-md border-gray-300 px-4 py-2 border outline-none bg-white focus:border-[var(--theme-primary)]" required>
		<option value="" disabled>{t("admin.selectType")}</option>
		{types.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
		</select>
		<button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition font-medium whitespace-nowrap">
		{editingId ? t("admin.updateModel") : t("admin.addModel")}
		</button>
		{editingId && (
		<button type="button" onClick={resetForm} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition font-medium whitespace-nowrap">
		{t("admin.cancel")}
		</button>
		)}
		</form>

		<div className="overflow-hidden rounded-xl border bg-white shadow-sm">
		<table className="min-w-full divide-y divide-gray-200">
		<thead className="bg-gray-50">
		<tr>
		<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t("admin.id")}</th>
		<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t("admin.name")}</th>
		<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t("admin.brand")}</th>
		<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t("admin.type")}</th>
		<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t("admin.actions")}</th>
		</tr>
		</thead>
		<tbody className="divide-y divide-gray-200 bg-white">
		{models.map((m: any) => (
		<tr key={m.id}>
		<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{m.id}</td>
		<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 font-medium">{m.name}</td>
		<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{m.brand?.name || "N/A"}</td>
		<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{m.type?.name || "N/A"}</td>
		<td className="whitespace-nowrap px-6 py-4 text-sm font-medium gap-4 flex">
		<button onClick={() => { setEditingId(m.id); setName(m.name); setBrandId(m.brand_id); setTypeId(m.type_id); }} className="text-blue-600 hover:text-blue-900">{t("admin.edit")}</button>
		<button onClick={() => deleteModel(m.id)} className="text-red-600 hover:text-red-900">{t("admin.delete")}</button>
		</td>
		</tr>
		))}
		</tbody>
		</table>
		</div>
		</div>
	);
}
