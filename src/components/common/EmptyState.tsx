type EmptyStateProps = {
  title: string;
  description: string;
};

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="serene-empty sm:p-8">
      <div className="mx-auto h-14 w-14 rounded-full bg-[radial-gradient(circle_at_30%_30%,var(--theme-primary-soft)_0%,rgba(255,255,255,0.96)_72%)] shadow-[var(--theme-shadow-warm)]" />
      <h2 className="mt-4 font-heading text-xl font-bold text-[var(--theme-ink)]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--theme-muted)] sm:text-base">{description}</p>
    </div>
  );
}
