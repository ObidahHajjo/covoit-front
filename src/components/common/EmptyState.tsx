type EmptyStateProps = {
    title: string;
    description: string;
};

export default function EmptyState({ title, description }: EmptyStateProps) {
    return (
        <div className="rounded-[2rem] border border-dashed border-[var(--theme-line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,242,207,0.58))] p-6 text-center shadow-soft backdrop-blur-sm sm:p-8">
            <h2 className="font-heading text-2xl font-semibold text-[var(--theme-ink)]">{title}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--theme-muted)] sm:text-base">{description}</p>
        </div>
    );
}
