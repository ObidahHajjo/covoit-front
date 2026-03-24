import { useAdminBrands } from "../../hooks/Admin/useAdminBrands";
import { AdminBrandsSection } from "../../components/ui/Admin/AdminBrandsSection";

export default function AdminBrandsPage() {
  const {
    brands,
    loading,
    name,
    setName,
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
  } = useAdminBrands();

  return (
    <AdminBrandsSection
      brands={brands}
      loading={loading}
      name={name}
      onNameChange={setName}
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
