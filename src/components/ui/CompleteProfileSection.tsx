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
  "w-full rounded-lg border border-[#eee] bg-white px-4 py-3.5 text-sm text-[#222] outline-none transition placeholder:text-[#999] focus:border-[#ccc] focus:bg-white focus:ring-2 focus:ring-[#eee]";

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
    <div className="relative min-h-dvh overflow-hidden bg-[#fafafa] px-4 py-8 text-[#222] sm:px-6 lg:px-8">
      <div className="relative mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[0.94fr_1.06fr] lg:items-stretch">
        <div className="flex flex-col justify-between rounded-2xl border border-[#eee] bg-white p-6 sm:p-8 lg:p-10">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#fafafa] text-2xl">
              👤
            </div>
            <p className="mt-6 text-xs font-medium uppercase tracking-wide text-[#888]">Profile completion</p>
            <h1 className="mt-3 max-w-[12ch] text-2xl font-medium leading-tight text-[#222]">
              Let riders recognize the real you.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[#666] sm:text-base">
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
                className="rounded-xl border border-[#eee] bg-[#fafafa] p-5"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-[#888]">Trust cue</p>
                <h2 className="mt-2 text-base font-medium text-[#222]">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#666]">{copy}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#eee] bg-white p-5 sm:p-7 lg:p-10">
          <div className="rounded-xl border border-[#eee] bg-[#fafafa] p-5 sm:p-6 lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#888]">Step 2 of onboarding</p>
                <h2 className="mt-2 text-xl font-medium text-[#222]">
                  Complete your profile.
                </h2>
              </div>
              <span className="rounded-full border border-[#eee] bg-white px-3 py-2 text-xs font-medium text-[#666]">
                Community-ready
              </span>
            </div>

            <div className="mt-5 rounded-lg border border-[#eee] bg-white px-4 py-3.5">
              <p className="text-xs font-medium uppercase tracking-wide text-[#888]">Email</p>
              <p className="mt-1 break-all text-sm font-medium text-[#222]">{email || "-"}</p>
            </div>

            <form onSubmit={onSubmit} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-xs font-medium uppercase tracking-wide text-[#888]">
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
                  <label className="block text-xs font-medium uppercase tracking-wide text-[#888]">
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
                <label className="block text-xs font-medium uppercase tracking-wide text-[#888]">
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
                <label className="block text-xs font-medium uppercase tracking-wide text-[#888]">
                  Phone <span className="normal-case font-normal text-[#999]">(optional)</span>
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
                <div className="flex items-center gap-3 rounded-lg border border-[#eee] bg-white px-4 py-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#fafafa] text-xs font-medium text-[#888]">!</span>
                  <p className="text-sm font-medium text-[#666]">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full rounded-lg bg-[#222] px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting ? "Saving profile..." : "Save profile"}
              </button>

              {!email && (
                <p className="text-center text-xs text-[#999]">
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
