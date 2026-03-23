import type React from "react";
import FloatingToast from "../../common/FloatingToast.tsx";
import { useI18n } from "../../../i18n/I18nProvider.tsx";
import LanguageSwitcher from "../../common/LanguageSwitcher.tsx";

type Props = {
  email: string;
  firstName: string;
  onFirstNameChange: (value: string) => void;
  lastName: string;
  onLastNameChange: (value: string) => void;
  pseudo: string;
  onPseudoChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  isSubmitting: boolean;
  error: string | null;
  canSubmit: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const inputClass =
  "w-full rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-3.5 text-sm text-[var(--theme-ink)] outline-none transition placeholder:text-[var(--theme-subtle)] focus:border-[#ccc] focus:bg-[var(--theme-surface)] focus:ring-2 focus:ring-[rgba(82,100,72,0.12)]";

/**
 * Collect the profile fields required to finish onboarding.
 *
 * @param props - Component props for the profile-completion form.
 * @param props.email - Email address shown as a read-only onboarding reference.
 * @param props.firstName - Current first-name field value.
 * @param props.onFirstNameChange - Callback fired when the first name changes.
 * @param props.lastName - Current last-name field value.
 * @param props.onLastNameChange - Callback fired when the last name changes.
 * @param props.pseudo - Current pseudo field value.
 * @param props.onPseudoChange - Callback fired when the pseudo changes.
 * @param props.phone - Current phone field value.
 * @param props.onPhoneChange - Callback fired when the phone changes.
 * @param props.isSubmitting - Whether the profile save request is in progress.
 * @param props.error - Optional error message shown in a toast.
 * @param props.canSubmit - Whether the submit button should be enabled.
 * @param props.onSubmit - Form submit handler for saving the profile.
 * @returns The rendered onboarding profile form.
 */
export function CompleteProfileSection({
  email,
  firstName,
  onFirstNameChange,
  lastName,
  onLastNameChange,
  pseudo,
  onPseudoChange,
  phone,
  onPhoneChange,
  isSubmitting,
  error,
  canSubmit,
  onSubmit,
}: Props) {
  const { t } = useI18n();

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[var(--theme-bg-soft)] px-4 py-8 text-[var(--theme-ink)] sm:px-6 lg:px-8">
      <FloatingToast tone="error" message={error} durationMs={6500} />
      <div className="relative mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[0.94fr_1.06fr] lg:items-stretch">
        <div className="flex flex-col justify-between rounded-2xl border border-[var(--theme-line)] bg-[var(--theme-surface)] p-6 sm:p-8 lg:p-10">
          <div className="mb-6 flex justify-end">
            <LanguageSwitcher compact />
          </div>
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[var(--theme-bg-soft)] text-2xl">
              👤
            </div>
            <p className="mt-6 text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">{t("profile.completion")}</p>
            <h1 className="mt-3 max-w-[12ch] text-2xl font-medium leading-tight text-[var(--theme-ink)]">
              {t("profile.recognizeRealYou")}
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--theme-muted-strong)] sm:text-base">
              {t("profile.completionBody")}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {[
              [t("profile.visibleIdentity"), t("profile.visibleIdentityBody")],
              [t("profile.reliableContact"), t("profile.reliableContactBody")],
              [t("profile.readyForProtectedRoutes"), t("profile.readyForProtectedRoutesBody")],
            ].map(([title, copy]) => (
              <article
                key={title}
                className="rounded-xl border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] p-5"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">{t("profile.trustCue")}</p>
                <h2 className="mt-2 text-base font-medium text-[var(--theme-ink)]">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--theme-muted-strong)]">{copy}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--theme-line)] bg-[var(--theme-surface)] p-5 sm:p-7 lg:p-10">
          <div className="rounded-xl border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] p-5 sm:p-6 lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">{t("profile.step2")}</p>
                <h2 className="mt-2 text-xl font-medium text-[var(--theme-ink)]">
                  {t("profile.completeProfile")}
                </h2>
              </div>
              <span className="rounded-full border border-[var(--theme-line)] bg-[var(--theme-surface)] px-3 py-2 text-xs font-medium text-[var(--theme-muted-strong)]">
                {t("profile.communityReady")}
              </span>
            </div>

            <div className="mt-5 rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-3.5">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">{t("common.email")}</p>
              <p className="mt-1 break-all text-sm font-medium text-[var(--theme-ink)]">{email || "-"}</p>
            </div>

            <form onSubmit={onSubmit} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">
                     {t("profile.firstName")}
                  </label>
                  <input
                    className={inputClass}
                     placeholder={t("profile.firstName")}
                    value={firstName}
                    onChange={(e) => onFirstNameChange(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">
                     {t("profile.lastName")}
                  </label>
                  <input
                    className={inputClass}
                     placeholder={t("profile.lastName")}
                    value={lastName}
                    onChange={(e) => onLastNameChange(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">
                   {t("profile.pseudo")}
                </label>
                <input
                  className={inputClass}
                   placeholder={t("profile.pseudoPlaceholder")}
                  value={pseudo}
                  onChange={(e) => onPseudoChange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">
                   {t("profile.phone")} <span className="normal-case font-normal text-[var(--theme-subtle)]">({t("common.optional")})</span>
                </label>
                <input
                  className={inputClass}
                  placeholder="+33 6 00 00 00 00"
                  type="tel"
                  value={phone}
                  onChange={(e) => onPhoneChange(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full rounded-lg bg-[var(--theme-primary)] px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[var(--theme-primary-dim)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                 {isSubmitting ? t("profile.savingProfile") : t("profile.saveProfile")}
              </button>

              {!email && (
                <p className="text-center text-xs text-[var(--theme-subtle)]">
                  {t("profile.missingEmail")}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
