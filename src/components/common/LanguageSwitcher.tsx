import { SUPPORTED_LOCALES, type AppLocale } from "../../i18n/config";
import { useI18n } from "../../i18n/I18nProvider";

type LanguageSwitcherProps = {
  compact?: boolean;
};

export default function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n();

  return (
    <label className={`flex items-center gap-2 ${compact ? "text-xs" : "text-sm"}`}>
      <span className="text-[var(--theme-muted)]">{t("language.label")}</span>
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as AppLocale)}
        className="rounded-full border border-[var(--theme-line)] bg-[var(--theme-surface)] px-3 py-2 text-[var(--theme-ink)] outline-none transition hover:border-[var(--theme-line-strong)]"
        aria-label={t("language.label")}
      >
        {SUPPORTED_LOCALES.map((item) => (
          <option key={item} value={item}>
            {t(`language.${item}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
