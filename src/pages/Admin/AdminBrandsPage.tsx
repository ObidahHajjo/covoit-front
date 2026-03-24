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

  if (loading) return <div className="text-gray-500">{t("admin.loadingBrands")}</div>;

  return (
    <div className="space-y-4 lg:space-y-6">
      <h1 className="text-xl font-semibold text-gray-800 lg:text-2xl">{t("admin.manageBrands")}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:gap-4 lg:p-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("admin.brandNamePlaceholder")}
          className="flex-1 rounded-md border-gray-300 px-4 py-2 text-sm shadow-sm outline-none focus:border-[var(--theme-primary)] focus:ring-[var(--theme-primary)]"
          required
        />
        <div className="flex gap-2">
          <button type="submit" className="flex-1 rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 sm:flex-none">
            {editingId ? t("admin.updateBrand") : t("admin.addBrand")}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setName(""); }} className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-300">
              {t("admin.cancel")}
            </button>
          )}
        </div>
      </form>

      {/* Mobile Card View */}
      <div className="space-y-3 lg:hidden">
        {brands.map((brand: any) => (
          <div key={brand.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">#{brand.id}</p>
                <p className="font-medium text-gray-900">{brand.name}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditingId(brand.id); setName(brand.name); }} className="rounded-md px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50">
                  {t("admin.edit")}
                </button>
                <button onClick={() => deleteBrand(brand.id)} className="rounded-md px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
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
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t("admin.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {brands.map((brand: any) => (
              <tr key={brand.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{brand.id}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{brand.name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <div className="flex gap-4">
                    <button onClick={() => { setEditingId(brand.id); setName(brand.name); }} className="text-blue-600 hover:text-blue-900">{t("admin.edit")}</button>
                    <button onClick={() => deleteBrand(brand.id)} className="text-red-600 hover:text-red-900">{t("admin.delete")}</button>
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
