import type { FormEvent } from "react";
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

function Field({
                   label,
                   error,
                   children,
               }: {
    label: string;
    error?: string | null;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                {label}
            </label>
            {children}
            {error ? (
                <p className="flex items-center gap-1.5 text-xs text-rose-500">
                    <span className="inline-block h-1 w-1 rounded-full bg-rose-500" />
                    {error}
                </p>
            ) : null}
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
        "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100";

    return (
        <form onSubmit={onSubmit} className="space-y-5">
            {success ? (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-xs">✓</span>
                    <p className="text-sm font-medium text-emerald-700">{success}</p>
                </div>
            ) : null}

            {error ? (
                <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white text-xs">!</span>
                    <p className="text-sm font-medium text-rose-700">{error}</p>
                </div>
            ) : null}

            {/* Avatar placeholder */}
            <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 p-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-xl font-bold text-white shadow-md">
                    {(form.first_name?.[0] ?? form.pseudo?.[0] ?? "?").toUpperCase()}
                </div>
                <div>
                    <p className="font-semibold text-slate-800">
                        {form.first_name || form.pseudo || "Your name"}
                        {form.last_name ? ` ${form.last_name}` : ""}
                    </p>
                    <p className="text-sm text-slate-400">{person?.email ?? ""}</p>
                </div>
            </div>

            <Field label="Email">
                <input
                    value={person?.email ?? ""}
                    readOnly
                    className={`${inputClass} cursor-not-allowed opacity-60`}
                />
            </Field>

            <Field label="Pseudo" error={getFieldError("pseudo")}>
                <input
                    value={form.pseudo}
                    onChange={(e) => onFieldChange("pseudo", e.target.value)}
                    placeholder="Your username"
                    className={inputClass}
                />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First name" error={getFieldError("first_name")}>
                    <input
                        value={form.first_name}
                        onChange={(e) => onFieldChange("first_name", e.target.value)}
                        placeholder="First name"
                        className={inputClass}
                    />
                </Field>

                <Field label="Last name" error={getFieldError("last_name")}>
                    <input
                        value={form.last_name}
                        onChange={(e) => onFieldChange("last_name", e.target.value)}
                        placeholder="Last name"
                        className={inputClass}
                    />
                </Field>
            </div>

            <Field label="Phone" error={getFieldError("phone")}>
                <input
                    value={form.phone}
                    onChange={(e) => onFieldChange("phone", e.target.value)}
                    placeholder="+1 234 567 890"
                    type="tel"
                    className={inputClass}
                />
            </Field>

            <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                    type="button"
                    onClick={onReset}
                    disabled={saving}
                    className="rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:from-violet-700 hover:to-indigo-700 disabled:opacity-40"
                >
                    {saving ? "Saving…" : "Save profile"}
                </button>
            </div>

            {/* Danger zone */}
            <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4 space-y-3">
                <div className="flex items-center gap-2">
                    <span className="text-rose-500">⚠</span>
                    <h3 className="text-sm font-bold text-rose-700">Danger zone</h3>
                </div>

                {deleteAccountError ? (
                    <p className="text-xs text-rose-600">{deleteAccountError}</p>
                ) : null}

                <p className="text-xs leading-relaxed text-slate-500">
                    Deleting your account starts a 90-day grace period. Sign in within 90 days to restore it, otherwise it will be permanently removed.
                </p>

                <button
                    type="button"
                    onClick={onDeleteAccount}
                    disabled={accountDeleting}
                    className="rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-40"
                >
                    {accountDeleting ? "Deleting…" : "Delete my account"}
                </button>
            </div>
        </form>
    );
}