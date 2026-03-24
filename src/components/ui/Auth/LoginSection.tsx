import type React from "react";
import { Notice, SereneButton, SurfaceCard } from "../../common/SerenePrimitives.tsx";
import { useI18n } from "../../../i18n/I18nProvider.tsx";
import LanguageSwitcher from "../../common/LanguageSwitcher.tsx";

type Props = {
  email: string;
  onEmailChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  isSubmitting: boolean;
  canSubmit: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
  onNavigateToLanding: () => void;
};

const trustNotesBase = [
  {
    label: "Verified profiles",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m9 12 2 2 4-4" />
        <path d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4Z" />
      </svg>
    ),
  },
  {
    label: "Transparent pricing",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 1v22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    label: "Active community",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="7" r="3" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 4.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

/**
 * Render the sign-in experience for returning users.
 *
 * @param props - Component props for the login form and related actions.
 * @param props.email - Current email field value.
 * @param props.onEmailChange - Callback fired when the email changes.
 * @param props.password - Current password field value.
 * @param props.onPasswordChange - Callback fired when the password changes.
 * @param props.showPassword - Whether the password is currently visible.
 * @param props.onTogglePassword - Callback fired when password visibility is toggled.
 * @param props.isSubmitting - Whether the sign-in request is in progress.
 * @param props.canSubmit - Whether the sign-in button should be enabled.
 * @param props.error - Optional error message shown in an inline notice.
 * @param props.onSubmit - Form submit handler for signing in.
 * @param props.onClear - Callback fired when the form is cleared.
 * @param props.onNavigateToRegister - Callback fired when the user opens registration.
 * @param props.onNavigateToForgotPassword - Callback fired when the user opens password recovery.
 * @param props.onNavigateToLanding - Callback fired when the user returns to the landing page.
 * @returns The rendered login screen.
 */
export function LoginSection({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  showPassword,
  onTogglePassword,
  isSubmitting,
  canSubmit,
  error,
  onSubmit,
  onClear,
  onNavigateToRegister,
  onNavigateToForgotPassword,
  onNavigateToLanding,
}: Props) {
  const { t } = useI18n();
  const trustNotes = [
    { label: t("auth.verifiedProfiles"), icon: trustNotesBase[0].icon },
    { label: t("auth.transparentPricing"), icon: trustNotesBase[1].icon },
    { label: t("auth.activeCommunity"), icon: trustNotesBase[2].icon },
  ];

  return (
    <div className="min-h-dvh bg-transparent px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <SurfaceCard className="mx-auto grid w-full max-w-6xl overflow-hidden bg-[rgba(255,255,255,0.92)] md:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden min-h-[720px] overflow-hidden border-r border-[var(--theme-line)] md:flex md:flex-col md:justify-between">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(235,239,236,0.78)_0%,rgba(249,250,248,0.42)_100%)]" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-35" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,233,197,0.75),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(212,229,239,0.4),transparent_28%)]" />
          <div className="absolute -left-20 bottom-20 h-64 w-64 rounded-full bg-[rgba(212,233,197,0.45)] blur-3xl" />
          <div className="relative z-10 flex flex-1 flex-col p-12 lg:p-14">
            <div className="max-w-xl">
              <div className="flex flex-wrap items-center justify-center gap-3 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(255,255,255,0.78)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--theme-muted-strong)] shadow-[var(--theme-shadow-warm)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--theme-primary)]" />
                  {t("auth.serenePath")}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <LanguageSwitcher compact />
                  <div className="serene-chip bg-[rgba(255,255,255,0.72)] shadow-[var(--theme-shadow-warm)]">
                    {t("auth.editorialSerenity")}
                  </div>
                </div>
              </div>

              <h1 className="mt-8 max-w-[8ch] font-heading text-[clamp(3.8rem,6vw,6rem)] font-extrabold leading-[0.92] tracking-[-0.06em] text-[var(--theme-ink)]">
                {t("auth.welcomeBack")}
              </h1>

              <p className="mt-6 max-w-md text-lg leading-8 text-[var(--theme-muted-strong)]">
                {t("auth.welcomeBackBody")}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {trustNotes.map((item) => (
                  <span
                    key={item.label}
                    className="serene-chip gap-2.5 bg-[rgba(255,255,255,0.76)] shadow-[var(--theme-shadow-warm)] normal-case tracking-[0.04em]"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(82,100,72,0.1)] text-[var(--theme-primary)]">
                      {item.icon}
                    </span>
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative flex flex-col justify-center p-5 sm:p-8 lg:p-12">
          <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(212,233,197,0.28),transparent_72%)] md:hidden" />

          <div className="relative z-10 mx-auto w-full max-w-md">
            <div className="mb-5 flex items-center justify-between md:hidden">
              <button
                type="button"
                onClick={onNavigateToLanding}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--theme-line)] bg-[var(--theme-surface)] text-[var(--theme-ink)] transition hover:border-[var(--theme-line-strong)]"
                aria-label={t("common.back")}
              >
                <span className="text-lg leading-none">←</span>
              </button>
              <LanguageSwitcher compact />
            </div>

            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="serene-kicker">{t("auth.authentication")}</p>
                <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-[-0.04em] text-[var(--theme-ink)]">
                  {t("auth.signInGently")}
                </h2>
              </div>
              <div className="hidden items-center gap-3 md:flex">
                <button
                  type="button"
                  onClick={onNavigateToLanding}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--theme-line)] bg-[var(--theme-surface)] text-[var(--theme-ink)] transition hover:border-[var(--theme-line-strong)]"
                  aria-label={t("common.back")}
                >
                  <span className="text-lg leading-none">←</span>
                </button>
                <span className="serene-chip">{t("auth.liveAccess")}</span>
              </div>
              <span className="serene-chip md:hidden">{t("auth.liveAccess")}</span>
            </div>

            <div className="rounded-[2rem] border border-[var(--theme-line)] bg-[rgba(249,250,248,0.72)] p-5 shadow-[var(--theme-shadow-warm)] backdrop-blur-xl sm:p-6">
              <div>
                <p className="serene-kicker">{t("auth.continueRoute")}</p>
                <p className="mt-3 text-sm leading-7 text-[var(--theme-muted)]">
                  {t("auth.signInBody")}
                </p>
              </div>

              <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-5">
                <label htmlFor="email" className="grid gap-2">
                  <span className="serene-label">{t("auth.emailAddress")}</span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--theme-subtle)]">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </span>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => onEmailChange(e.target.value)}
                      className="serene-input pl-12"
                    />
                  </div>
                </label>

                <label htmlFor="password" className="grid gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="serene-label">{t("auth.password")}</span>
                    <span className="text-xs font-medium text-[var(--theme-primary)]">
                      {t("auth.secureField")}
                    </span>
                  </div>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--theme-subtle)]">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder={t("auth.enterPassword")}
                      value={password}
                      onChange={(e) => onPasswordChange(e.target.value)}
                      className="serene-input pl-12 pr-12"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                      onClick={onTogglePassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[var(--theme-subtle)] transition hover:bg-[rgba(82,100,72,0.08)] hover:text-[var(--theme-ink)]"
                    >
                      {showPassword ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </label>

                <div className="-mt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={onNavigateToForgotPassword}
                    className="text-sm font-medium text-[var(--theme-primary)] transition hover:text-[var(--theme-primary-dim)]"
                  >
                    {t("auth.forgotPassword")}
                  </button>
                </div>

                {error ? <Notice tone="error">{error}</Notice> : null}

                <SereneButton type="submit" disabled={!canSubmit} className="mt-1 w-full">
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                      {t("auth.signingIn")}
                    </>
                  ) : (
                    <>
                      {t("auth.signIn")}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </>
                  )}
                </SereneButton>

                <div className="grid gap-3 sm:grid-cols-2">
                  <SereneButton
                    type="button"
                    variant="secondary"
                    onClick={onNavigateToRegister}
                    className="w-full"
                  >
                    {t("auth.createAccount")}
                  </SereneButton>
                  <SereneButton
                    type="button"
                    variant="secondary"
                    onClick={onClear}
                    className="w-full bg-[var(--theme-bg-soft)]"
                  >
                    {t("auth.clearForm")}
                  </SereneButton>
                </div>
              </form>
            </div>
          </div>
        </section>
      </SurfaceCard>
    </div>
  );
}
