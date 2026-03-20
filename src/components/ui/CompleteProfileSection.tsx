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
  "w-full rounded-[22px] border border-[#17301f]/12 bg-[#fffaf1] px-4 py-3.5 text-sm text-[#17301f] outline-none transition placeholder:text-[#5f6f61]/65 focus:border-[#ff7a59] focus:bg-white focus:ring-4 focus:ring-[#ff7a59]/15";

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
    <div className="relative min-h-dvh overflow-hidden bg-[linear-gradient(180deg,#fff8ee_0%,#fff3db_54%,#ffe8bf_100%)] px-4 py-8 text-[#17301f] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-10 top-16 h-64 w-64 rounded-full bg-[#91d7ff]/35 blur-3xl" />
        <div className="absolute right-4 top-0 h-72 w-72 rounded-full bg-[#d5f06b]/45 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#ff7a59]/20 blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[0.94fr_1.06fr] lg:items-stretch">
        <div className="flex flex-col justify-between rounded-[36px] border border-[#17301f]/10 bg-[rgba(255,251,243,0.84)] p-6 shadow-[0_24px_70px_rgba(112,72,32,0.16)] backdrop-blur sm:p-8 lg:p-10">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-[0_14px_28px_rgba(112,72,32,0.12)]">
              👤
            </div>
            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#eb5a36]">Profile completion</p>
            <h1 className="mt-3 max-w-[12ch] text-[clamp(2.5rem,6vw,4.8rem)] font-black leading-[0.95] tracking-[-0.04em] text-[#17301f]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Let riders recognize the real you.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[#5f6f61] sm:text-base">
              A complete profile adds the identity cues needed for trusted pickups, smoother conversations, and better route matching.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {[
              ["Visible identity", "Names and a pseudo give other riders a clearer first impression."],
              ["Reliable contact", "Phone stays optional, but useful for pickup coordination."],
              ["Ready for protected routes", "This is the final step before the main app experience opens."],
              ["Template 3 warmth", "The visuals stay social and welcoming instead of feeling like a utility form."],
            ].map(([title, copy]) => (
              <article
                key={title}
                className="rounded-[26px] border border-[#17301f]/10 bg-white/70 p-5 shadow-[0_16px_40px_rgba(112,72,32,0.08)]"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#eb5a36]">Trust cue</p>
                <h2 className="mt-2 text-lg font-bold text-[#17301f]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#5f6f61]">{copy}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[36px] border border-[#17301f]/10 bg-[rgba(255,251,243,0.84)] p-5 shadow-[0_24px_70px_rgba(112,72,32,0.16)] backdrop-blur sm:p-7 lg:p-10">
          <div className="rounded-[30px] border border-[#17301f]/10 bg-white/70 p-5 shadow-[0_16px_40px_rgba(112,72,32,0.08)] sm:p-6 lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#eb5a36]">Step 2 of onboarding</p>
                <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#17301f]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                  Complete your profile.
                </h2>
              </div>
              <span className="rounded-full bg-[#d5f06b] px-3 py-2 text-xs font-semibold text-[#17301f]">
                Community-ready
              </span>
            </div>

            <div className="mt-5 rounded-[24px] border border-[#17301f]/10 bg-[#fffaf1] px-4 py-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5f6f61]">Email</p>
              <p className="mt-1 break-all text-sm font-medium text-[#17301f]">{email || "-"}</p>
            </div>

            <form onSubmit={onSubmit} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5f6f61]">
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
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5f6f61]">
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
                <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5f6f61]">
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
                <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5f6f61]">
                  Phone <span className="normal-case font-normal text-[#5f6f61]/70">(optional)</span>
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
                <div className="flex items-center gap-3 rounded-[22px] border border-[#eb5a36]/20 bg-[#ff7a59]/10 px-4 py-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eb5a36] text-xs font-bold text-white">!</span>
                  <p className="text-sm font-medium text-[#9c3113]">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full rounded-full bg-[#17301f] px-4 py-3.5 text-sm font-semibold text-[#fff8ee] shadow-[0_14px_28px_rgba(23,48,31,0.18)] transition hover:-translate-y-0.5 hover:bg-[#214129] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                {isSubmitting ? "Saving profile..." : "Save profile"}
              </button>

              {!email && (
                <p className="text-center text-xs text-[#5f6f61]">
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
