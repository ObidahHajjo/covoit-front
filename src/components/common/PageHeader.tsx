type PageHeaderProps = {
    title: string;
    subtitle?: string;
};

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
    return (
        <header className="mb-6 rounded-[1.75rem] border border-[var(--theme-line)] bg-[rgba(255,251,243,0.72)] px-5 py-4 shadow-soft backdrop-blur-sm sm:px-6">
            <h1 className="font-heading text-3xl font-semibold leading-tight text-[var(--theme-ink)] sm:text-4xl">{title}</h1>
            {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--theme-muted)] sm:text-base">{subtitle}</p> : null}
        </header>
    );
}
