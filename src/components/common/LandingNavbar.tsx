import { Link } from "react-router-dom";
import { useI18n } from "../../i18n/I18nProvider";
import LanguageSwitcher from "./LanguageSwitcher";
import { isProfileComplete } from "../../auth/profileCompletion";
import type { AuthUser } from "../../types/MeResponse";

type Props = {
  user: AuthUser | null;
  isAuthenticated: boolean;
};

export function LandingNavbar({ user, isAuthenticated }: Props) {
  const { t } = useI18n();

  const profileComplete = isProfileComplete(user);

  const primaryHref = isAuthenticated
    ? profileComplete
      ? "/home"
      : "/complete-profile"
    : "/register";

  const primaryLabel = isAuthenticated
    ? profileComplete
      ? t("landing.primaryAuthenticated")
      : t("landing.completeProfile")
    : t("landing.primaryGuest");

  const secondaryHref = isAuthenticated ? "/find-trip" : "/login";
  const secondaryLabel = isAuthenticated ? t("landing.secondaryAuthenticated") : t("auth.signIn");

  return (
    <header className="flex flex-col gap-4 rounded-[1.75rem] border border-[var(--theme-line)] bg-[rgba(255,255,255,0.78)] px-4 py-4 shadow-[var(--theme-shadow-warm)] backdrop-blur-xl sm:px-6 sm:py-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:rounded-full">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(145deg,var(--theme-primary),var(--theme-primary-dim))] text-sm font-semibold uppercase tracking-[0.18em] text-[var(--theme-on-primary)] shadow-[0_18px_30px_-18px_rgba(82,100,72,0.9)]">
          CV
        </div>
        <div className="min-w-0">
          <p className="serene-kicker">{t("app.name")}</p>
          <p className="text-sm font-medium leading-6 text-[var(--theme-ink)] sm:truncate">
            {t("landing.headerLine")}
          </p>
        </div>
      </div>
      <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:w-auto lg:justify-end">
        <LanguageSwitcher compact hideLabelOnMobile />
        <Link
          to={secondaryHref}
          className="serene-button-ghost w-full border border-[var(--theme-line)] bg-white/40 sm:w-auto"
        >
          {secondaryLabel}
        </Link>
        <Link
          to={primaryHref}
          className="serene-button-primary min-h-0 w-full px-5 py-3 text-sm sm:w-auto"
        >
          {primaryLabel}
        </Link>
      </div>
    </header>
  );
}
