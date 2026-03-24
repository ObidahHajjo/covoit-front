import { useEffect, useState, useCallback } from "react";
import {
  fetchModels,
  fetchBrandsForModels,
  fetchTypes,
  createModel,
  updateModel,
  deleteModel,
  type CarModel,
  type Brand,
  type CarType,
} from "../../features/admin/useAdminModels";
import { useI18n } from "../../i18n/I18nProvider";

export function useAdminModels() {
  const [models, setModels] = useState<CarModel[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [types, setTypes] = useState<CarType[]>([]);
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

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [modelsRes, brandsRes, typesRes] = await Promise.all([
        fetchModels(currentPage, perPage),
        fetchBrandsForModels(),
        fetchTypes(),
      ]);
      setModels(modelsRes.data);
      setTotal(modelsRes.total);
      setTotalPages(modelsRes.last_page);
      setBrands(brandsRes);
      setTypes(typesRes);
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, brand_id: brandId, type_id: typeId };
    try {
      if (editingId) {
        await updateModel(editingId, payload);
      } else {
        await createModel(payload);
      }
      resetForm();
      await loadAll();
    } catch (err) {
      alert(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          t(editingId ? "admin.errorUpdating" : "admin.errorCreating"),
      );
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setBrandId("");
    setTypeId("");
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t("admin.confirmDeleteModel"))) return;
    try {
      await deleteModel(id);
      await loadAll();
    } catch (err) {
      alert(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          t("admin.deleteError"),
      );
    }
  };

  const handleEdit = (model: CarModel) => {
    setEditingId(model.id);
    setName(model.name);
    setBrandId(String(model.brand_id));
    setTypeId(String(model.type_id));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    models,
    brands,
    types,
    loading,
    name,
    setName,
    brandId,
    setBrandId,
    typeId,
    setTypeId,
    editingId,
    currentPage,
    totalPages,
    total,
    perPage,
    onSubmit: handleSubmit,
    onDelete: handleDelete,
    onEdit: handleEdit,
    onCancel: resetForm,
    onPageChange: handlePageChange,
  };
}
