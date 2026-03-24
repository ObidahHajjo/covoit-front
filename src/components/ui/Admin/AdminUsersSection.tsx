import { useI18n } from "../../../i18n/I18nProvider";
import Pagination from "../../common/Pagination";
import type { User } from "../../../features/admin/useAdminUsers";

type Props = {
  users: User[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  total: number;
  perPage: number;
  onDeleteUser: (id: number) => void;
  onPageChange: (page: number) => void;
};

export function AdminUsersSection({
  users,
  loading,
  error,
  currentPage,
  totalPages,
  total,
  perPage,
  onDeleteUser,
  onPageChange,
}: Props) {
  const { t } = useI18n();

  if (loading) return <div className="text-gray-500">{t("admin.loadingUsers")}</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4 lg:space-y-6">
      <h1 className="text-xl font-semibold text-gray-800 lg:text-2xl">{t("admin.manageUsers")}</h1>

      <div className="space-y-3 lg:hidden">
        {users.map((user) => (
          <div key={user.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400">#{user.id}</p>
                <p className="truncate font-medium text-gray-900">{user.email}</p>
                <p className="mt-1 text-sm text-gray-500">{user.role?.name || "N/A"}</p>
              </div>
              <button
                onClick={() => onDeleteUser(user.id)}
                className="ml-3 rounded-md px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                {t("admin.delete")}
              </button>
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
                {t("admin.email")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t("admin.role")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t("admin.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{user.id}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.email}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {user.role?.name || "N/A"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <button
                    onClick={() => onDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    {t("admin.delete")}
                  </button>
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
