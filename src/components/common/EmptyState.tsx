type EmptyStateProps = {
    title: string;
    description: string;
};

export default function EmptyState({ title, description }: EmptyStateProps) {
    return (
        <div className="rounded-2xl border border-dashed bg-white p-6 text-center">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
    );
}