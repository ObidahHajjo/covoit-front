import type React from "react";
import { useI18n } from "../../../i18n/I18nProvider";
import LanguageSwitcher from "../../common/LanguageSwitcher";

type Props = {
  email: string;
  onEmailChange: (value: string) => void;
  message: string | null;
  error: string | null;
  loading: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onNavigateToLogin: () => void;
};

/**
 * Render the forgot-password page layout and form.
 *
 * @param props - Component props for the recovery flow.
 * @returns The rendered recovery page.
 */
export function ForgotPasswordSection({
  email,
  onEmailChange,
  message,
  error,
  loading,
  onSubmit,
  onNavigateToLogin,
}: Props) {
  const { t } = useI18n();

  return (
    <div className="min-h-dvh bg-[var(--theme-bg-soft)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="bg-[var(--theme-surface)] p-6 sm:p-8 lg:p-10">
          <div className="flex justify-end">
            <LanguageSwitcher compact />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider text-[var(--theme-muted-strong)]">
            <span className="h-2 w-2 rounded-full bg-[#60a5fa]" />
            {t("auth.accountRecovery")}
          </div>
          <h1 className="mt-6 max-w-[11ch] text-[clamp(2rem,5vw,3.5rem)] font-medium leading-tight tracking-tight text-[var(--theme-ink)]">
            {t("auth.findWayBack")}
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-[var(--theme-muted)] sm:text-base">
            {t("auth.recoveryBody")}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[t("auth.secureResetFlow"), t("auth.emailVerification"), t("auth.quickRecovery")].map(
              (item) => (
                <div
                  key={item}
                  className="border-b border-[var(--theme-line)] px-4 py-4 text-sm text-[var(--theme-muted-strong)]"
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </section>

        <section className="bg-[var(--theme-surface)] p-5 sm:p-7 lg:p-10">
          <div className="border-b border-[var(--theme-line)] pb-6">
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--theme-primary)] transition hover:text-[var(--theme-primary-dim)]"
            >
              <span aria-hidden="true">&larr;</span>
              {t("common.back")}
            </button>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--theme-subtle)]">
              {t("auth.forgotPassword")}
            </p>
            <h2 className="mt-2 text-2xl font-medium tracking-tight text-[var(--theme-ink)]">
              {t("auth.sendResetLink")}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--theme-muted)]">
              {t("auth.sendResetBody")}
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="forgot-email"
                  className="block text-xs font-medium uppercase tracking-wider text-[var(--theme-subtle)]"
                >
                  {t("common.email")}
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(event) => onEmailChange(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full border-b border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-3 text-sm text-[var(--theme-ink)] outline-none transition placeholder:text-[rgba(118,124,122,0.5)] focus:border-[var(--theme-primary)]"
                  required
                />
              </div>

              {message ? (
                <div className="border-l-2 border-[#4ade80] bg-[#f0fdf4] px-4 py-3 text-sm text-[var(--theme-ink)]">
                  {message}
                </div>
              ) : null}

              {error ? (
                <div className="border-l-2 border-[#f472b6] bg-[#fdf2f8] px-4 py-3 text-sm text-[var(--theme-ink)]">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[var(--theme-primary)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[var(--theme-primary-dim)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? t("auth.sendingLink") : t("auth.sendResetLinkButton")}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
