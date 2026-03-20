import type { FormEvent, ReactNode } from "react";
import type { Person } from "../../types/Person";
import type { ProfileFormState } from "../../context/Account/UseMyAccount";

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

function Field({ label, error, children }: { label: string; error?: string | null; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium uppercase tracking-wide text-[#888]">{label}</label>
      {children}
      {error ? <p className="text-xs font-medium text-[#999]">{error}</p> : null}
    </div>
  );
}

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
    "w-full rounded-lg border border-[#eee] bg-white px-4 py-3.5 text-sm text-[#222] outline-none transition placeholder:text-[#999] focus:border-[#ccc] focus:ring-2 focus:ring-[#eee]";

  return (
    <form onSubmit={onSubmit} className="space-y-5 xl:grid xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] xl:gap-6 xl:space-y-0">
      <div className="space-y-5">
        {success ? <div className="rounded-lg border border-[#eee] bg-white px-4 py-3.5 text-sm font-medium text-[#666]">{success}</div> : null}
        {error ? <div className="rounded-lg border border-[#eee] bg-white px-4 py-3.5 text-sm font-medium text-[#666]">{error}</div> : null}

        <div className="flex items-center gap-4 rounded-xl border border-[#eee] bg-white p-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[#fafafa] text-2xl font-medium text-[#888]">
            {(form.first_name?.[0] ?? form.pseudo?.[0] ?? "?").toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-medium text-[#222]">
              {form.first_name || form.pseudo || "Your profile"}
              {form.last_name ? ` ${form.last_name}` : ""}
            </p>
            <p className="mt-1 text-sm text-[#888]">{person?.email ?? ""}</p>
          </div>
        </div>

        <div className="grid gap-4 rounded-xl border border-[#eee] bg-white p-5 sm:p-6">
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
              className="rounded-lg border border-[#eee] bg-white px-4 py-3.5 text-sm font-medium text-[#666] transition hover:border-[#ccc] hover:text-[#222] disabled:opacity-40"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#222] px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[#333] disabled:opacity-40"
            >
              {saving ? "Saving..." : "Save profile"}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-5 xl:sticky xl:top-8 xl:self-start">
        <div className="rounded-xl border border-[#eee] bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-[#888]">Profile notes</p>
          <div className="mt-3 space-y-2 text-sm leading-6 text-[#666]">
            <p>Use your real first and last name so drivers and passengers can spot you quickly.</p>
            <p>Keep your phone number current for smoother coordination close to departure.</p>
          </div>
        </div>

        <div className="rounded-xl border border-[#eee] bg-[#fafafa] p-5">
          <div className="flex items-center gap-2">
            <span className="text-[#999]">⚠</span>
            <h3 className="text-lg font-medium text-[#222]">Danger zone</h3>
          </div>
          {deleteAccountError ? <p className="mt-3 text-sm text-[#999]">{deleteAccountError}</p> : null}
          <p className="mt-3 text-sm leading-6 text-[#888]">Deleting your account starts a 90-day grace period. Sign in again during that window to restore access.</p>
          <button
            type="button"
            onClick={onDeleteAccount}
            disabled={accountDeleting}
            className="mt-4 rounded-lg border border-[#eee] bg-white px-4 py-3 text-sm font-medium text-[#666] transition hover:border-[#ccc] hover:text-[#222] disabled:opacity-40"
          >
            {accountDeleting ? "Deleting..." : "Delete my account"}
          </button>
        </div>
      </div>
    </form>
  );
}
