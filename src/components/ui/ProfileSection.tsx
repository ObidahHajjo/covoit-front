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
            <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-[#b06f60]">{label}</label>
            {children}
            {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}
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
        "w-full rounded-[20px] border border-[#e5d8c8] bg-white px-4 py-3.5 text-sm text-[#18352d] outline-none transition placeholder:text-[#8ea198] focus:border-[#f3b8ab] focus:ring-4 focus:ring-[#f7d7cf]";

    return (
        <form onSubmit={onSubmit} className="space-y-5 xl:grid xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] xl:gap-6 xl:space-y-0">
            <div className="space-y-5">
                {success ? <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm font-medium text-emerald-700">{success}</div> : null}
                {error ? <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm font-medium text-rose-700">{error}</div> : null}

                <div className="flex items-center gap-4 rounded-[28px] border border-white/70 bg-white/70 p-5 shadow-[0_20px_52px_-34px_rgba(24,53,45,0.3)] backdrop-blur-xl">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#f26f5a] to-[#de8f62] text-2xl font-bold text-white shadow-[0_16px_34px_-18px_rgba(242,111,90,0.75)]">
                        {(form.first_name?.[0] ?? form.pseudo?.[0] ?? "?").toUpperCase()}
                    </div>
                    <div>
                        <p className="font-serif text-2xl text-[#18352d]">
                            {form.first_name || form.pseudo || "Your profile"}
                            {form.last_name ? ` ${form.last_name}` : ""}
                        </p>
                        <p className="mt-1 text-sm text-[#5d746b]">{person?.email ?? ""}</p>
                    </div>
                </div>

                <div className="grid gap-4 rounded-[30px] border border-white/70 bg-white/60 p-5 shadow-[0_24px_64px_-40px_rgba(24,53,45,0.35)] backdrop-blur-xl sm:p-6">
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
                            className="rounded-full border border-[#d8cfc2] bg-[#fff9f4] px-4 py-3.5 text-sm font-semibold text-[#335246] transition hover:border-[#f3b8ab] hover:text-[#8c4d3f] disabled:opacity-40"
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-full bg-[#f26f5a] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_18px_38px_-20px_rgba(242,111,90,0.75)] transition hover:bg-[#e4604b] disabled:opacity-40"
                        >
                            {saving ? "Saving..." : "Save profile"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-5 xl:sticky xl:top-8 xl:self-start">
                <div className="rounded-[30px] border border-white/70 bg-white/60 p-5 shadow-[0_24px_64px_-40px_rgba(24,53,45,0.35)] backdrop-blur-xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b06f60]">Profile notes</p>
                    <div className="mt-3 space-y-2 text-sm leading-6 text-[#4c655b]">
                        <p>Use your real first and last name so drivers and passengers can spot you quickly.</p>
                        <p>Keep your phone number current for smoother coordination close to departure.</p>
                    </div>
                </div>

                <div className="rounded-[30px] border border-rose-200 bg-rose-50/80 p-5">
                    <div className="flex items-center gap-2">
                        <span className="text-rose-500">⚠</span>
                        <h3 className="font-serif text-xl text-rose-700">Danger zone</h3>
                    </div>
                    {deleteAccountError ? <p className="mt-3 text-sm text-rose-600">{deleteAccountError}</p> : null}
                    <p className="mt-3 text-sm leading-6 text-rose-700/80">Deleting your account starts a 90-day grace period. Sign in again during that window to restore access.</p>
                    <button
                        type="button"
                        onClick={onDeleteAccount}
                        disabled={accountDeleting}
                        className="mt-4 rounded-full bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-40"
                    >
                        {accountDeleting ? "Deleting..." : "Delete my account"}
                    </button>
                </div>
            </div>
        </form>
    );
}
