import { useI18n } from "../../../i18n/I18nProvider";
import Pagination from "../../common/Pagination";
import type { Brand } from "../../../features/admin/useAdminBrands";

type Props = {
  brands: Brand[];
  loading: boolean;
  name: string;
  onNameChange: (value: string) => void;
  editingId: number | null;
  currentPage: number;
  totalPages: number;
  total: number;
  perPage: number;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: (id: number) => void;
  onEdit: (brand: Brand) => void;
  onCancel: () => void;
  onPageChange: (page: number) => void;
};

export function AdminBrandsSection({
  brands,
  loading,
  name,
  onNameChange,
  editingId,
  currentPage,
  totalPages,
  total,
  perPage,
  onSubmit,
  onDelete,
  onEdit,
  onCancel,
  onPageChange,
}: Props) {
  const { t } = useI18n();

  if (loading) return <div className="text-gray-500">{t("admin.loadingBrands")}</div>;

  return (
    <div className="space-y-4 lg:space-y-6">
      <h1 className="text-xl font-semibold text-gray-800 lg:text-2xl">{t("admin.manageBrands")}</h1>

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:gap-4 lg:p-4"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={t("admin.brandNamePlaceholder")}
          className="flex-1 rounded-md border-gray-300 px-4 py-2 text-sm shadow-sm outline-none focus:border-[var(--theme-primary)] focus:ring-[var(--theme-primary)]"
          required
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 sm:flex-none"
          >
            {editingId ? t("admin.updateBrand") : t("admin.addBrand")}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-300"
            >
              {t("admin.cancel")}
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3 lg:hidden">
        {brands.map((brand) => (
          <div key={brand.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">#{brand.id}</p>
                <p className="font-medium text-gray-900">{brand.name}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(brand)}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                >
                  {t("admin.edit")}
                </button>
                <button
                  onClick={() => onDelete(brand.id)}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  {t("admin.delete")}
                </button>
              </div>
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
                {t("admin.name")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t("admin.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {brands.map((brand) => (
              <tr key={brand.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{brand.id}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {brand.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <div className="flex gap-4">
                    <button
                      onClick={() => onEdit(brand)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {t("admin.edit")}
                    </button>
                    <button
                      onClick={() => onDelete(brand.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      {t("admin.delete")}
                    </button>
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
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
