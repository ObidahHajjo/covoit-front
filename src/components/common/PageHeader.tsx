type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="mb-6 rounded-xl border border-[#eee] bg-white px-5 py-4 sm:px-6">
      <h1 className="font-medium text-2xl text-[#222] sm:text-3xl">{title}</h1>
      {subtitle ? <p className="mt-2 max-w-2xl text-sm text-[#888] sm:text-base">{subtitle}</p> : null}
    </header>
  );
}
