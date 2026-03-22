import { useI18n } from "../../i18n/I18nProvider";

/**
 * Render a centered inline loading placeholder.
 *
 * @returns The rendered loading placeholder.
 */
export default function LoadingState() {
  const { t } = useI18n();

  return (
    <div className="serene-alert flex flex-col items-center justify-center gap-3 p-6 text-center text-sm text-[var(--theme-muted)]">
      <div className="serene-spinner h-8 w-8" />
      <span>{t("app.loading")}</span>
    </div>
  );
}
