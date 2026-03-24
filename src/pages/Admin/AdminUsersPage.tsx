import { useAdminUsers } from "../../hooks/Admin/useAdminUsers";
import { AdminUsersSection } from "../../components/ui/Admin/AdminUsersSection";

export default function AdminUsersPage() {
  const {
    users,
    loading,
    error,
    currentPage,
    totalPages,
    total,
    perPage,
    onDeleteUser,
    onPageChange,
  } = useAdminUsers();

  return (
    <AdminUsersSection
      users={users}
      loading={loading}
      error={error}
      currentPage={currentPage}
      totalPages={totalPages}
      total={total}
      perPage={perPage}
      onDeleteUser={onDeleteUser}
      onPageChange={onPageChange}
    />
  );
}
