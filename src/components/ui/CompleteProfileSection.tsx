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
  "w-full rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-3.5 text-sm text-[var(--theme-ink)] outline-none transition placeholder:text-[var(--theme-subtle)] focus:border-[#ccc] focus:bg-[var(--theme-surface)] focus:ring-2 focus:ring-[rgba(82,100,72,0.12)]";

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
    <div className="relative min-h-dvh overflow-hidden bg-[var(--theme-bg-soft)] px-4 py-8 text-[var(--theme-ink)] sm:px-6 lg:px-8">
      <div className="relative mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[0.94fr_1.06fr] lg:items-stretch">
        <div className="flex flex-col justify-between rounded-2xl border border-[var(--theme-line)] bg-[var(--theme-surface)] p-6 sm:p-8 lg:p-10">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[var(--theme-bg-soft)] text-2xl">
              👤
            </div>
            <p className="mt-6 text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">Profile completion</p>
            <h1 className="mt-3 max-w-[12ch] text-2xl font-medium leading-tight text-[var(--theme-ink)]">
              Let riders recognize the real you.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--theme-muted-strong)] sm:text-base">
              A complete profile adds the identity cues needed for trusted pickups, smoother conversations, and better route matching.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {[
              ["Visible identity", "Names and a pseudo give other riders a clearer first impression."],
              ["Reliable contact", "Phone stays optional, but useful for pickup coordination."],
              ["Ready for protected routes", "This is the final step before the main app experience opens."],
            ].map(([title, copy]) => (
              <article
                key={title}
                className="rounded-xl border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] p-5"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">Trust cue</p>
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
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">Step 2 of onboarding</p>
                <h2 className="mt-2 text-xl font-medium text-[var(--theme-ink)]">
                  Complete your profile.
                </h2>
              </div>
              <span className="rounded-full border border-[var(--theme-line)] bg-[var(--theme-surface)] px-3 py-2 text-xs font-medium text-[var(--theme-muted-strong)]">
                Community-ready
              </span>
            </div>

            <div className="mt-5 rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-3.5">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">Email</p>
              <p className="mt-1 break-all text-sm font-medium text-[var(--theme-ink)]">{email || "-"}</p>
            </div>

            <form onSubmit={onSubmit} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">
                    First name
                  </label>
                  <input
                    className={inputClass}
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => onFirstNameChange(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">
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

              <div className="space-y-2">
                <label className="block text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">
                  Pseudo
                </label>
                <input
                  className={inputClass}
                  placeholder="How other riders will recognize you"
                  value={pseudo}
                  onChange={(e) => onPseudoChange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">
                  Phone <span className="normal-case font-normal text-[var(--theme-subtle)]">(optional)</span>
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
                <div className="flex items-center gap-3 rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--theme-bg-soft)] text-xs font-medium text-[var(--theme-muted)]">!</span>
                  <p className="text-sm font-medium text-[var(--theme-muted-strong)]">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full rounded-lg bg-[var(--theme-primary)] px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[var(--theme-primary-dim)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting ? "Saving profile..." : "Save profile"}
              </button>

              {!email && (
                <p className="text-center text-xs text-[var(--theme-subtle)]">
                  Missing email - go back to registration before continuing.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
