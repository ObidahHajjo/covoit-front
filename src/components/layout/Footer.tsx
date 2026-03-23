import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/Auth/useAuth.ts";
import { useI18n } from "../../i18n/I18nProvider";
import { navItems } from "./BottomNav";

/**
 * Render the shared application footer.
 *
 * @returns The footer with quick links and brand copy.
 */
export default function Footer() {
  const { user } = useAuth();
  const { t } = useI18n();
  const visibleItems = navItems.filter((item) => item.visible(user));

  return (
    <footer className="relative z-10 border-t border-[var(--theme-line)] bg-[rgba(255,255,255,0.74)] backdrop-blur-xl">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 pb-28 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pb-10">
        <div className="space-y-3">
          <div className="serene-chip w-fit bg-[rgba(255,255,255,0.85)]">{t("app.name")}</div>
          <p className="max-w-xl font-heading text-2xl font-bold tracking-[-0.04em] text-[var(--theme-ink)] sm:text-[2rem]">
            {t("footer.note")}
          </p>
          <p className="max-w-2xl text-sm leading-7 text-[var(--theme-muted)] sm:text-base">
            {t("footer.tagline")}
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:items-end">
          <div className="space-y-3 lg:text-right">
            <p className="serene-kicker">{t("footer.quickLinks")}</p>
            <nav className="flex flex-wrap gap-2 lg:justify-end">
              {visibleItems.map((item) => (
                <NavLink
                  key={`footer-${item.to}`}
                  to={item.to}
                  className="rounded-full border border-[var(--theme-line)] bg-[rgba(255,255,255,0.78)] px-4 py-2 text-sm font-medium text-[var(--theme-muted-strong)] transition hover:border-[var(--theme-primary)] hover:bg-[var(--theme-primary)] hover:text-white hover:shadow-[0_12px_28px_-18px_rgba(82,100,72,0.85)]"
                >
                  {t(item.labelKey)}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        <div className="text-center text-sm text-[var(--theme-subtle)] lg:col-span-2">
          @CopyRight 2026 {t("app.name")}
        </div>
      </div>
    </footer>
  );
}
