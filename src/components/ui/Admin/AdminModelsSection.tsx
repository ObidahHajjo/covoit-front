import { useI18n } from "../../../i18n/I18nProvider";
import Pagination from "../../common/Pagination";
import type { CarModel, Brand, CarType } from "../../../features/admin/useAdminModels";

type Props = {
  models: CarModel[];
  brands: Brand[];
  types: CarType[];
  loading: boolean;
  name: string;
  onNameChange: (value: string) => void;
  brandId: string;
  onBrandIdChange: (value: string) => void;
  typeId: string;
  onTypeIdChange: (value: string) => void;
  editingId: number | null;
  currentPage: number;
  totalPages: number;
  total: number;
  perPage: number;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: (id: number) => void;
  onEdit: (model: CarModel) => void;
  onCancel: () => void;
  onPageChange: (page: number) => void;
};

export function AdminModelsSection({
  models,
  brands,
  types,
  loading,
  name,
  onNameChange,
  brandId,
  onBrandIdChange,
  typeId,
  onTypeIdChange,
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

  if (loading) return <div className="text-gray-500">{t("admin.loadingModels")}</div>;

  return (
    <div className="space-y-4 lg:space-y-6">
      <h1 className="text-xl font-semibold text-gray-800 lg:text-2xl">{t("admin.manageModels")}</h1>

      <form
        onSubmit={onSubmit}
        className="rounded-xl border bg-white p-4 shadow-sm lg:flex lg:gap-4 lg:flex-wrap lg:items-center"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:gap-4 lg:flex-wrap">
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder={t("admin.modelNamePlaceholder")}
            className="min-w-0 flex-1 rounded-md border-gray-300 px-4 py-2 text-sm outline-none focus:border-[var(--theme-primary)] lg:min-w-[200px]"
            required
          />
          <select
            value={brandId}
            onChange={(e) => onBrandIdChange(e.target.value)}
            className="rounded-md border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-[var(--theme-primary)]"
            required
          >
            <option value="" disabled>
              {t("admin.selectBrand")}
            </option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <select
            value={typeId}
            onChange={(e) => onTypeIdChange(e.target.value)}
            className="rounded-md border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-[var(--theme-primary)]"
            required
          >
            <option value="" disabled>
              {t("admin.selectType")}
            </option>
            {types.map((t_item) => (
              <option key={t_item.id} value={t_item.id}>
                {t_item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex gap-2 lg:mt-0">
          <button
            type="submit"
            className="flex-1 rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 lg:flex-none lg:whitespace-nowrap"
          >
            {editingId ? t("admin.updateModel") : t("admin.addModel")}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-300 lg:whitespace-nowrap"
            >
              {t("admin.cancel")}
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3 lg:hidden">
        {models.map((m) => (
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
                  onClick={() => onEdit(m)}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                >
                  {t("admin.edit")}
                </button>
                <button
                  onClick={() => onDelete(m.id)}
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
                {t("admin.brand")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t("admin.type")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t("admin.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {models.map((m) => (
              <tr key={m.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{m.id}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {m.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {m.brand?.name || "N/A"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {m.type?.name || "N/A"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <div className="flex gap-4">
                    <button onClick={() => onEdit(m)} className="text-blue-600 hover:text-blue-900">
                      {t("admin.edit")}
                    </button>
                    <button
                      onClick={() => onDelete(m.id)}
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
