import { useAdminModels } from "../../hooks/Admin/useAdminModels";
import { AdminModelsSection } from "../../components/ui/Admin/AdminModelsSection";

export default function AdminModelsPage() {
  const {
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
    onSubmit,
    onDelete,
    onEdit,
    onCancel,
    onPageChange,
  } = useAdminModels();

  return (
    <AdminModelsSection
      models={models}
      brands={brands}
      types={types}
      loading={loading}
      name={name}
      onNameChange={setName}
      brandId={brandId}
      onBrandIdChange={setBrandId}
      typeId={typeId}
      onTypeIdChange={setTypeId}
      editingId={editingId}
      currentPage={currentPage}
      totalPages={totalPages}
      total={total}
      perPage={perPage}
      onSubmit={onSubmit}
      onDelete={onDelete}
      onEdit={onEdit}
      onCancel={onCancel}
      onPageChange={onPageChange}
    />
  );
}
