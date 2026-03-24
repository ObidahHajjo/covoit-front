import { useEffect, useState, useCallback } from "react";
import { apiClient as api } from "../../app/apiClient";
import { useI18n } from "../../i18n/I18nProvider";
import Pagination from "../../components/common/Pagination";

export default function AdminModelsPage() {
  const [models, setModels] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 15;

  const [name, setName] = useState("");
  const [brandId, setBrandId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchAll = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get(`/admin/models?page=${currentPage}&per_page=${perPage}`),
      api.get("/admin/brands?per_page=100"),
      api.get("/types")
    ]).then(([modelsRes, brandsRes, typesRes]) => {
      setModels(modelsRes.data.data || modelsRes.data);
      setTotal(modelsRes.data.total);
      setTotalPages(modelsRes.data.last_page);
      setBrands(brandsRes.data.data || brandsRes.data);
      setTypes(typesRes.data.data || typesRes.data);
    }).finally(() => setLoading(false));
  }, [currentPage]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <div className="text-gray-500">{t("admin.loadingModels")}</div>;

  return (
    <div className="space-y-4 lg:space-y-6">
      <h1 className="text-xl font-semibold text-gray-800 lg:text-2xl">{t("admin.manageModels")}</h1>

      <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-4 shadow-sm lg:flex lg:gap-4 lg:flex-wrap lg:items-center">
        <div className="flex flex-col gap-3 lg:flex-row lg:gap-4 lg:flex-wrap">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("admin.modelNamePlaceholder")}
            className="min-w-0 flex-1 rounded-md border-gray-300 px-4 py-2 text-sm outline-none focus:border-[var(--theme-primary)] lg:min-w-[200px]"
            required
          />
          <select
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            className="rounded-md border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-[var(--theme-primary)]"
            required
          >
            <option value="" disabled>{t("admin.selectBrand")}</option>
            {brands.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <select
            value={typeId}
            onChange={(e) => setTypeId(e.target.value)}
            className="rounded-md border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-[var(--theme-primary)]"
            required
          >
            <option value="" disabled>{t("admin.selectType")}</option>
            {types.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div className="mt-3 flex gap-2 lg:mt-0">
          <button type="submit" className="flex-1 rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 lg:flex-none lg:whitespace-nowrap">
            {editingId ? t("admin.updateModel") : t("admin.addModel")}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-300 lg:whitespace-nowrap">
              {t("admin.cancel")}
            </button>
          )}
        </div>
      </form>

      {/* Mobile Card View */}
      <div className="space-y-3 lg:hidden">
        {models.map((m: any) => (
          <div key={m.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400">#{m.id}</p>
                <p className="font-medium text-gray-900">{m.name}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {m.brand?.name || "N/A"}
                  </span>
                  <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {m.type?.name || "N/A"}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex gap-2">
                <button
                  onClick={() => { setEditingId(m.id); setName(m.name); setBrandId(m.brand_id); setTypeId(m.type_id); }}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                >
                  {t("admin.edit")}
                </button>
                <button
                  onClick={() => deleteModel(m.id)}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  {t("admin.delete")}
                </button>
              </div>
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
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{m.name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{m.brand?.name || "N/A"}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{m.type?.name || "N/A"}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <div className="flex gap-4">
                    <button onClick={() => { setEditingId(m.id); setName(m.name); setBrandId(m.brand_id); setTypeId(m.type_id); }} className="text-blue-600 hover:text-blue-900">{t("admin.edit")}</button>
                    <button onClick={() => deleteModel(m.id)} className="text-red-600 hover:text-red-900">{t("admin.delete")}</button>
                  </div>
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
