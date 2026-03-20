type EmptyStateProps = {
  title: string;
  description: string;
};

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-[#eee] bg-[#fafafa] p-6 text-center sm:p-8">
      <h2 className="font-medium text-lg text-[#222]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm text-[#888] sm:text-base">{description}</p>
    </div>
  );
}
