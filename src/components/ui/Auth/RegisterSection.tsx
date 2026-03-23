import type React from "react";
import { useI18n } from "../../../i18n/I18nProvider.tsx";
import LanguageSwitcher from "../../common/LanguageSwitcher.tsx";

type Props = {
  email: string;
  onEmailChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  passwordConfirm: string;
  onPasswordConfirmChange: (value: string) => void;
  isSubmitting: boolean;
  canSubmit: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onGoBack: () => void;
  onNavigateToLogin: () => void;
};

/**
 * Render the account registration screen.
 *
 * @param props - Component props for the registration form and navigation actions.
 * @param props.email - Current email field value.
 * @param props.onEmailChange - Callback fired when the email changes.
 * @param props.password - Current password field value.
 * @param props.onPasswordChange - Callback fired when the password changes.
 * @param props.passwordConfirm - Current password-confirmation value.
 * @param props.onPasswordConfirmChange - Callback fired when the confirmation changes.
 * @param props.isSubmitting - Whether the registration request is in progress.
 * @param props.canSubmit - Whether the create-account button should be enabled.
 * @param props.error - Optional error message shown inline.
 * @param props.onSubmit - Form submit handler for creating the account.
 * @param props.onCancel - Callback fired when registration is cancelled.
 * @param props.onGoBack - Callback fired when the back control is used.
 * @param props.onNavigateToLogin - Callback fired when the user switches to login.
 * @returns The rendered registration screen.
 */
export function RegisterSection({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  passwordConfirm,
  onPasswordConfirmChange,
  isSubmitting,
  canSubmit,
  error,
  onSubmit,
  onCancel,
  onGoBack,
  onNavigateToLogin,
}: Props) {
  const { t } = useI18n();

  return (
    <div className="min-h-dvh bg-[var(--theme-bg-soft)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden bg-[var(--theme-surface)] lg:grid-cols-[1fr_1fr]">
        <section className="relative hidden flex-col justify-between border-b border-[var(--theme-line)] p-6 sm:p-8 lg:flex lg:min-h-[640px] lg:border-b-0 lg:border-r lg:p-10">
          <div className="absolute right-6 top-6">
            <LanguageSwitcher compact />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider text-[var(--theme-muted-strong)]">
              <span className="h-2 w-2 rounded-full bg-[#4ade80]" />
              {t("auth.createAccount")}
            </div>
            <h1 className="mt-6 max-w-[11ch] text-[clamp(2rem,5vw,3.5rem)] font-medium leading-tight tracking-tight text-[var(--theme-ink)]">
              {t("auth.joinCommunity")}
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[var(--theme-muted)] sm:text-base">
              {t("auth.registerBody")}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {[
              [t("auth.quickSetup"), t("auth.quickSetupBody")],
              [t("auth.secureAccess"), t("auth.secureAccessBody")],
              [t("auth.activeCommunity"), t("auth.activeCommunity")],
              [t("auth.profileReady"), t("auth.profileReadyBody")],
            ].map(([title, copy]) => (
              <article
                key={title}
                className="border-b border-[var(--theme-line)] p-4"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--theme-subtle)]">{t("auth.feature")}</p>
                <h2 className="mt-2 text-base font-medium text-[var(--theme-ink)]">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--theme-muted)]">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="p-5 sm:p-7 lg:p-10">
          <div className="mb-5 flex items-center justify-between gap-3 lg:hidden">
            <button
              type="button"
              onClick={onGoBack}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--theme-line)] bg-[var(--theme-surface)] text-[var(--theme-ink)] transition hover:border-[var(--theme-line-strong)]"
              aria-label={t("common.back")}
            >
              <span className="text-lg leading-none">←</span>
            </button>
            <LanguageSwitcher compact />
          </div>

          <div className="hidden items-center gap-3 border-b border-[var(--theme-line)] pb-5 lg:flex">
            <button
              type="button"
              onClick={onGoBack}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--theme-line)] bg-[var(--theme-surface)] text-[var(--theme-ink)] transition hover:border-[var(--theme-line-strong)]"
              aria-label={t("common.back")}
            >
              <span className="text-lg leading-none">←</span>
            </button>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--theme-subtle)]">{t("auth.registration")}</p>
              <p className="mt-1 text-xl font-medium tracking-tight text-[var(--theme-ink)]">
                {t("auth.createAccount")}
              </p>
            </div>
          </div>

          <div className="mt-0 pb-0 lg:mt-6 lg:border-b lg:border-[var(--theme-line)] lg:pb-6">
            <div className="hidden flex-wrap items-center justify-between gap-3 lg:flex">
              <div>
                 <p className="text-xs font-medium uppercase tracking-wider text-[var(--theme-subtle)]">{t("auth.startHere")}</p>
                 <h2 className="mt-2 text-2xl font-medium tracking-tight text-[var(--theme-ink)]">
                   {t("auth.joinRoute")}
                 </h2>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4 lg:mt-6">
              <div className="space-y-2">
                 <label htmlFor="register-email" className="text-xs font-medium uppercase tracking-wider text-[var(--theme-subtle)]">{t("common.email")}</label>
                <input
                  id="register-email"
                  name="email"
                  className="w-full border-b border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-3.5 text-sm text-[var(--theme-ink)] outline-none transition placeholder:text-[rgba(118,124,122,0.5)] focus:border-[var(--theme-primary)]"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  autoComplete="email"
                />
                 <p className="text-xs text-[var(--theme-muted)]">{t("auth.useRideHistoryEmail")}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                   <label htmlFor="register-password" className="text-xs font-medium uppercase tracking-wider text-[var(--theme-subtle)]">{t("common.password")}</label>
                  <input
                    id="register-password"
                    name="password"
                    className="w-full border-b border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-3.5 text-sm text-[var(--theme-ink)] outline-none transition placeholder:text-[rgba(118,124,122,0.5)] focus:border-[var(--theme-primary)]"
                    type="password"
                     placeholder={t("auth.createPassword")}
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    autoComplete="new-password"
                  />
                   <p className="text-xs text-[var(--theme-muted)]">{t("auth.passwordMin")}</p>
                </div>

                <div className="space-y-2">
                   <label htmlFor="register-password-confirm" className="text-xs font-medium uppercase tracking-wider text-[var(--theme-subtle)]">{t("common.confirm")}</label>
                  <input
                    id="register-password-confirm"
                    name="passwordConfirmation"
                    className="w-full border-b border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-3.5 text-sm text-[var(--theme-ink)] outline-none transition placeholder:text-[rgba(118,124,122,0.5)] focus:border-[var(--theme-primary)]"
                    type="password"
                     placeholder={t("auth.repeatPassword")}
                    value={passwordConfirm}
                    onChange={(e) => onPasswordConfirmChange(e.target.value)}
                    autoComplete="new-password"
                  />
                  {passwordConfirm.length > 0 && password !== passwordConfirm && (
                     <p className="text-xs text-[#f472b6]">{t("auth.passwordsMismatch")}</p>
                  )}
                </div>
              </div>

              {error && (
                <div className="border-l-2 border-[#f472b6] bg-[#fdf2f8] px-4 py-3 text-sm text-[var(--theme-ink)]">
                  {error}
                </div>
              )}

              <div className="grid gap-3 pt-2 sm:grid-cols-2">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="rounded-full bg-[var(--theme-primary)] px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[var(--theme-primary-dim)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                   {isSubmitting ? t("auth.creatingAccount") : t("auth.createAccount")}
                </button>

                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-full border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-4 py-3.5 text-sm font-medium text-[var(--theme-muted-strong)] transition hover:border-[var(--theme-line-strong)]"
                >
                   {t("common.cancel")}
                </button>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--theme-line)] pt-4 text-sm text-[var(--theme-muted)]">
               <span>{t("auth.alreadyHaveAccount")}</span>
              <button
                className="font-medium text-[var(--theme-ink)] underline underline-offset-4 transition hover:text-[var(--theme-muted-strong)]"
                onClick={onNavigateToLogin}
                type="button"
              >
                 {t("auth.signIn")}
               </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
