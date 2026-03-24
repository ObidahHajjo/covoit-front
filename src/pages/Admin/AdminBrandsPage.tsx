import { useEffect, useState, useCallback } from "react";
import { apiClient as api } from "../../app/apiClient";
import { useI18n } from "../../i18n/I18nProvider";
import Pagination from "../../components/common/Pagination";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const { t } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 15;

  const fetchBrands = useCallback(() => {
    setLoading(true);
    api.get(`/admin/brands?page=${currentPage}&per_page=${perPage}`)
      .then((res) => {
        setBrands(res.data.data || res.data);
        setTotal(res.data.total);
        setTotalPages(res.data.last_page);
      })
      .finally(() => setLoading(false));
  }, [currentPage]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      api.put(`/admin/brands/${editingId}`, { name }).then(() => {
        setName("");
        setEditingId(null);
        fetchBrands();
      }).catch((e) => alert(e.response?.data?.message || t("admin.errorUpdating")));
    } else {
      api.post("/admin/brands", { name }).then(() => {
        setName("");
        fetchBrands();
      }).catch((e) => alert(e.response?.data?.message || t("admin.errorCreating")));
    }
  };

  const deleteBrand = (id: number) => {
    if (!window.confirm(t("admin.confirmDeleteBrand"))) return;
    api.delete(`/admin/brands/${id}`)
      .then(fetchBrands)
      .catch((e) => alert(e.response?.data?.message || t("admin.deleteError")));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <div>{t("admin.loadingBrands")}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">{t("admin.manageBrands")}</h1>

      <form onSubmit={handleSubmit} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("admin.brandNamePlaceholder")}
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-[var(--theme-primary)] focus:ring-[var(--theme-primary)] sm:text-sm px-4 py-2 border outline-none"
          required
        />
        <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition font-medium">
          {editingId ? t("admin.updateBrand") : t("admin.addBrand")}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setName(""); }} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition font-medium">
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
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t("admin.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {brands.map((brand: any) => (
              <tr key={brand.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{brand.id}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 font-medium">{brand.name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium gap-4 flex">
                  <button onClick={() => { setEditingId(brand.id); setName(brand.name); }} className="text-blue-600 hover:text-blue-900">{t("admin.edit")}</button>
                  <button onClick={() => deleteBrand(brand.id)} className="text-red-600 hover:text-red-900">{t("admin.delete")}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
