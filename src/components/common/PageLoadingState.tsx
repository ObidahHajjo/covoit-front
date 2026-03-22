import { useLoading } from "../../context/LoadingContext";
import { useI18n } from "../../i18n/I18nProvider";

type PageLoadingStateProps = {
  title: string;
  compact?: boolean;
};

/**
 * Show a page-scoped loading panel when local data is pending.
 *
 * @param props - Component props controlling the loading panel copy and size.
 * @param props.title - Primary loading title displayed in the panel.
 * @param props.compact - Whether to use a shorter minimum height for compact layouts.
 * @returns The rendered loading panel, or `null` while the global loading overlay is active.
 */
export default function PageLoadingState({ title, compact = false }: PageLoadingStateProps) {
  const { isLoading } = useLoading();
  const { t } = useI18n();

  if (isLoading) {
    return null;
  }

  return (
    <div className={`flex ${compact ? "min-h-[30vh]" : "min-h-[60vh]"} items-center justify-center px-4`}>
      <div className="serene-panel w-full max-w-md px-8 py-10 text-center backdrop-blur-xl">
        <div className="serene-spinner mx-auto h-10 w-10" />
        <p className="mt-4 font-heading text-2xl font-bold text-[var(--theme-ink)]">{title}</p>
        <p className="mt-2 text-sm text-[var(--theme-muted)]">{t("app.preparingRoute")}</p>
      </div>
    </div>
  );
}
