import { useEffect, useState, useCallback } from "react";
import { fetchUsers, deleteUser, type User } from "../../features/admin/useAdminUsers";
import { useI18n } from "../../i18n/I18nProvider";

/**
 * Hook to manage application users from the admin interface.
 * Handles fetching and deleting user accounts with pagination.
 *
 * @returns State and handlers for user management.
 */
export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 15;

  /**
   * Loads the list of users for the current page.
   */
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchUsers(currentPage, perPage);
      setUsers(res.data);
      setTotal(res.total);
      setTotalPages(res.last_page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  /**
   * Deletes a user account after user confirmation.
   *
   * @param id - The ID of the user to delete.
   */
  const handleDeleteUser = async (id: number) => {
    if (!window.confirm(t("admin.confirmDelete"))) return;
    try {
      await deleteUser(id);
      await loadUsers();
    } catch (err) {
      alert(t("admin.deleteError") + ". " + (err instanceof Error ? err.message : ""));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    users,
    loading,
    error,
    currentPage,
    totalPages,
    total,
    perPage,
    onDeleteUser: handleDeleteUser,
    onPageChange: handlePageChange,
  };
}
