import { useEffect, useState, useCallback } from "react";
import {
  fetchBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  type Brand,
} from "../../features/admin/useAdminBrands";
import { useI18n } from "../../i18n/I18nProvider";

/**
 * Hook to manage vehicle brands from the admin interface.
 * Handles fetching, creating, updating, and deleting brands with pagination.
 *
 * @returns State and handlers for brand management.
 */
export function useAdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const { t } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 15;

  /**
   * Loads the list of brands for the current page.
   */
  const loadBrands = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchBrands(currentPage, perPage);
      setBrands(res.data);
      setTotal(res.total);
      setTotalPages(res.last_page);
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage]);

  useEffect(() => {
    void loadBrands();
  }, [loadBrands]);

  /**
   * Handles the submission of the brand creation or update form.
   *
   * @param e - The React form event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateBrand(editingId, name);
      } else {
        await createBrand(name);
      }
      setName("");
      setEditingId(null);
      await loadBrands();
    } catch (err) {
      alert(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          t(editingId ? "admin.errorUpdating" : "admin.errorCreating"),
      );
    }
  };

  /**
   * Deletes a brand after user confirmation.
   *
   * @param id - The ID of the brand to delete.
   */
  const handleDelete = async (id: number) => {
    if (!window.confirm(t("admin.confirmDeleteBrand"))) return;
    try {
      await deleteBrand(id);
      await loadBrands();
    } catch (err) {
      alert(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          t("admin.deleteError"),
      );
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingId(brand.id);
    setName(brand.name);
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    brands,
    loading,
    name,
    setName,
    editingId,
    currentPage,
    totalPages,
    total,
    perPage,
    onSubmit: handleSubmit,
    onDelete: handleDelete,
    onEdit: handleEdit,
    onCancel: handleCancel,
    onPageChange: handlePageChange,
  };
}
