import type React from "react";

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
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100";

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
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 text-2xl shadow-lg">
            👤
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Complete your profile</h1>
          <p className="mt-1 text-sm text-slate-400">Just a few details to get you started</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Email</p>
            <p className="mt-0.5 text-sm font-medium text-slate-700 break-all">{email || "—"}</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                  First name
                </label>
                <input
                  className={inputClass}
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => onFirstNameChange(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Last name
                </label>
                <input
                  className={inputClass}
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => onLastNameChange(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                Pseudo
              </label>
              <input
                className={inputClass}
                placeholder="Your username"
                value={pseudo}
                onChange={(e) => onPseudoChange(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                Phone <span className="normal-case font-normal text-slate-400">(optional)</span>
              </label>
              <input
                className={inputClass}
                placeholder="+33 6 00 00 00 00"
                type="tel"
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
              />
            </div>

            {error && (
              <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white text-xs">!</span>
                <p className="text-sm font-medium text-rose-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:from-violet-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmitting ? "Saving…" : "Save profile"}
            </button>

            {!email && (
              <p className="text-center text-xs text-slate-400">
                Missing email — go back to register.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
