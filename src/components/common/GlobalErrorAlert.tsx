import { useError } from "../../context/ErrorContext.ts";
import { useI18n } from "../../i18n/I18nProvider";
import { Notice, SereneButton } from "./SerenePrimitives";

/**
 * Show the current app-level error at the top of the page.
 *
 * @returns The rendered global error banner, or `null` when no error is active.
 */
export default function GlobalErrorAlert() {
  const { error, clearError } = useError();
  const { t } = useI18n();

  if (!error) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <Notice tone="error" className="mx-auto flex max-w-5xl items-start justify-between gap-4 px-5 py-4">
        <div>
          <p className="serene-kicker">{t("error.title")}</p>
          <p className="mt-1 text-sm text-[var(--theme-ink)] sm:text-base">{error.message}</p>
        </div>

        <SereneButton type="button" variant="secondary" onClick={clearError} className="min-h-0 px-4 py-2">
          {t("common.close")}
        </SereneButton>
      </Notice>
    </div>
  );
}
