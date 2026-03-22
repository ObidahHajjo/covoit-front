import type { FormEvent, ReactNode } from "react";
import type { Person } from "../../types/Person";
import type { ProfileFormState } from "../../context/Account/UseMyAccount";
import FloatingToast from "../common/FloatingToast";

type Props = {
  person: Person | null;
  form: ProfileFormState;
  saving: boolean;
  success: string | null;
  error: string | null;
  deleteAccountError: string | null;
  accountDeleting: boolean;
  getFieldError: (...keys: string[]) => string | null;
  onFieldChange: <K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
  onDeleteAccount: () => void;
};

/**
 * Pair a profile form control with its label and error.
 *
 * @param props - Component props for the field wrapper.
 * @param props.label - Visible field label.
 * @param props.error - Optional validation message shown below the field.
 * @param props.children - Form control rendered inside the field.
 * @returns The rendered field wrapper.
 */
function Field({ label, error, children }: { label: string; error?: string | null; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">{label}</label>
      {children}
      {error ? <p className="text-xs font-medium text-[var(--theme-subtle)]">{error}</p> : null}
    </div>
  );
}

/**
 * Manage editable profile details and account deletion.
 *
 * @param props - Component props for the profile-management form.
 * @param props.person - Current persisted person data used for read-only details.
 * @param props.form - Current editable profile form state.
 * @param props.saving - Whether the profile save request is in progress.
 * @param props.success - Optional success message shown in a toast.
 * @param props.error - Optional error message shown in a toast.
 * @param props.deleteAccountError - Optional error shown when account deletion fails.
 * @param props.accountDeleting - Whether the account deletion request is in progress.
 * @param props.getFieldError - Helper that returns a validation message for one or more field keys.
 * @param props.onFieldChange - Callback fired when a form field changes.
 * @param props.onSubmit - Form submit handler for saving the profile.
 * @param props.onReset - Callback fired when the form resets to persisted values.
 * @param props.onDeleteAccount - Callback fired when account deletion is requested.
 * @returns The rendered profile-management form.
 */
export function ProfileSection({
  person,
  form,
  saving,
  success,
  error,
  deleteAccountError,
  accountDeleting,
  getFieldError,
  onFieldChange,
  onSubmit,
  onReset,
  onDeleteAccount,
}: Props) {
  const inputClass =
    "w-full rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-3.5 text-sm text-[var(--theme-ink)] outline-none transition placeholder:text-[var(--theme-subtle)] focus:border-[#ccc] focus:ring-2 focus:ring-[rgba(82,100,72,0.12)]";

  return (
    <form onSubmit={onSubmit} className="space-y-5 xl:grid xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] xl:gap-6 xl:space-y-0">
      <FloatingToast tone="success" message={success} durationMs={6500} />
      <FloatingToast tone="error" message={error} durationMs={6500} />
      <div className="space-y-5">
        <div className="flex items-center gap-4 rounded-xl border border-[var(--theme-line)] bg-[var(--theme-surface)] p-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[var(--theme-bg-soft)] text-2xl font-medium text-[var(--theme-muted)]">
            {(form.first_name?.[0] ?? form.pseudo?.[0] ?? "?").toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-medium text-[var(--theme-ink)]">
              {form.first_name || form.pseudo || "Your profile"}
              {form.last_name ? ` ${form.last_name}` : ""}
            </p>
            <p className="mt-1 text-sm text-[var(--theme-muted)]">{person?.email ?? ""}</p>
          </div>
        </div>

        <div className="grid gap-4 rounded-xl border border-[var(--theme-line)] bg-[var(--theme-surface)] p-5 sm:p-6">
          <Field label="Email">
            <input value={person?.email ?? ""} readOnly className={`${inputClass} cursor-not-allowed opacity-60`} />
          </Field>

          <Field label="Pseudo" error={getFieldError("pseudo")}>
            <input value={form.pseudo} onChange={(e) => onFieldChange("pseudo", e.target.value)} placeholder="Your username" className={inputClass} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" error={getFieldError("first_name")}>
              <input value={form.first_name} onChange={(e) => onFieldChange("first_name", e.target.value)} placeholder="First name" className={inputClass} />
            </Field>

            <Field label="Last name" error={getFieldError("last_name")}>
              <input value={form.last_name} onChange={(e) => onFieldChange("last_name", e.target.value)} placeholder="Last name" className={inputClass} />
            </Field>
          </div>

          <Field label="Phone" error={getFieldError("phone")}>
            <input value={form.phone} onChange={(e) => onFieldChange("phone", e.target.value)} placeholder="+1 234 567 890" type="tel" className={inputClass} />
          </Field>

          <div className="grid gap-3 pt-1 sm:grid-cols-2">
            <button
              type="button"
              onClick={onReset}
              disabled={saving}
              className="rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-3.5 text-sm font-medium text-[var(--theme-muted-strong)] transition hover:border-[var(--theme-line-strong)] hover:text-[var(--theme-ink)] disabled:opacity-40"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[var(--theme-primary)] px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[var(--theme-primary-dim)] disabled:opacity-40"
            >
              {saving ? "Saving..." : "Save profile"}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-5 xl:sticky xl:top-8 xl:self-start">
        <div className="rounded-xl border border-[var(--theme-line)] bg-[var(--theme-surface)] p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">Profile notes</p>
          <div className="mt-3 space-y-2 text-sm leading-6 text-[var(--theme-muted-strong)]">
            <p>Use your real first and last name so drivers and passengers can spot you quickly.</p>
            <p>Keep your phone number current for smoother coordination close to departure.</p>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] p-5">
          <div className="flex items-center gap-2">
            <span className="text-[var(--theme-subtle)]">⚠</span>
            <h3 className="text-lg font-medium text-[var(--theme-ink)]">Danger zone</h3>
          </div>
          {deleteAccountError ? <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{deleteAccountError}</p> : null}
          <p className="mt-3 text-sm leading-6 text-[var(--theme-muted)]">Deleting your account starts a 90-day grace period. Sign in again during that window to restore access.</p>
          <button
            type="button"
            onClick={onDeleteAccount}
            disabled={accountDeleting}
            className="mt-4 rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-3 text-sm font-medium text-[var(--theme-muted-strong)] transition hover:border-[var(--theme-line-strong)] hover:text-[var(--theme-ink)] disabled:opacity-40"
          >
            {accountDeleting ? "Deleting..." : "Delete my account"}
          </button>
        </div>
      </div>
    </form>
  );
}
