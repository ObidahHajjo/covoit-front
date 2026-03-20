import type React from "react";

type Props = {
  email: string;
  onEmailChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  passwordConfirm: string;
  onPasswordConfirmChange: (value: string) => void;
  isSubmitting: boolean;
  canSubmit: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onGoBack: () => void;
  onNavigateToLogin: () => void;
};

export function RegisterSection({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  passwordConfirm,
  onPasswordConfirmChange,
  isSubmitting,
  canSubmit,
  error,
  onSubmit,
  onCancel,
  onGoBack,
  onNavigateToLogin,
}: Props) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[linear-gradient(180deg,#fff8ee_0%,#fff3db_54%,#ffe8bf_100%)] px-4 py-6 text-[#17301f] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-10 h-64 w-64 rounded-full bg-[#91d7ff]/35 blur-3xl" />
        <div className="absolute right-10 top-20 h-72 w-72 rounded-full bg-[#d5f06b]/45 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#ff7a59]/20 blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-[36px] border border-[#17301f]/10 bg-[rgba(255,251,243,0.84)] shadow-[0_24px_70px_rgba(112,72,32,0.16)] backdrop-blur lg:grid-cols-[0.96fr_1.04fr]">
        <section className="relative flex flex-col justify-between border-b border-[#17301f]/10 p-6 sm:p-8 lg:min-h-[760px] lg:border-b-0 lg:border-r lg:p-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#17301f]/10 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#eb5a36]">
              <span className="h-2 w-2 rounded-full bg-[#ff7a59]" />
              Route /3 onboarding
            </div>
            <h1 className="mt-6 max-w-[11ch] text-[clamp(2.7rem,7vw,5.6rem)] font-black leading-[0.94] tracking-[-0.04em] text-[#17301f]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Build a ride circle people trust.
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[#5f6f61] sm:text-base">
              Registration stays lightweight, but the experience still feels social, polished, and ready for a real production flow.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {[
              ["Recurring routes", "Set up your access once, then step into trusted commute groups."],
              ["Transparent access", "Forms are readable on mobile and spacious on desktop."],
              ["Friendly profile cues", "The flow matches the warm and community-forward landing mood."],
              ["Ready for profile completion", "New accounts move naturally into the next step."],
            ].map(([title, copy]) => (
              <article
                key={title}
                className="rounded-[26px] border border-[#17301f]/10 bg-white/70 p-5 shadow-[0_16px_40px_rgba(112,72,32,0.08)]"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#eb5a36]">Community signal</p>
                <h2 className="mt-2 text-lg font-bold text-[#17301f]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#5f6f61]">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="p-5 sm:p-7 lg:p-10">
          <div className="flex items-center gap-3 border-b border-[#17301f]/10 pb-5">
            <button
              type="button"
              onClick={onGoBack}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#17301f]/12 bg-white/75 text-[#17301f] transition hover:-translate-y-0.5 hover:bg-white"
              aria-label="Back"
            >
              <span className="text-lg leading-none">←</span>
            </button>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#eb5a36]">Registration</p>
              <p className="mt-1 text-2xl font-bold tracking-[-0.03em] text-[#17301f]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                Create your account
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[32px] border border-[#17301f]/10 bg-white/70 p-5 shadow-[0_16px_40px_rgba(112,72,32,0.08)] sm:p-6 lg:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#eb5a36]">Start here</p>
                <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#17301f]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                  Join the route.
                </h2>
              </div>
              <div className="rounded-full bg-[#d5f06b] px-3 py-2 text-xs font-semibold text-[#17301f]">
                Warm and responsive
              </div>
            </div>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="register-email" className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5f6f61]">Email</label>
                <input
                  id="register-email"
                  name="email"
                  className="w-full rounded-[22px] border border-[#17301f]/12 bg-[#fffaf1] px-4 py-3.5 text-sm text-[#17301f] outline-none transition placeholder:text-[#5f6f61]/65 focus:border-[#ff7a59] focus:bg-white focus:ring-4 focus:ring-[#ff7a59]/15"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  autoComplete="email"
                />
                <p className="text-xs text-[#5f6f61]">Use the email you want tied to your ride history.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="register-password" className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5f6f61]">Password</label>
                  <input
                    id="register-password"
                    name="password"
                    className="w-full rounded-[22px] border border-[#17301f]/12 bg-[#fffaf1] px-4 py-3.5 text-sm text-[#17301f] outline-none transition placeholder:text-[#5f6f61]/65 focus:border-[#ff7a59] focus:bg-white focus:ring-4 focus:ring-[#ff7a59]/15"
                    type="password"
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-[#5f6f61]">At least 6 characters.</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="register-password-confirm" className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5f6f61]">Confirm</label>
                  <input
                    id="register-password-confirm"
                    name="passwordConfirmation"
                    className="w-full rounded-[22px] border border-[#17301f]/12 bg-[#fffaf1] px-4 py-3.5 text-sm text-[#17301f] outline-none transition placeholder:text-[#5f6f61]/65 focus:border-[#ff7a59] focus:bg-white focus:ring-4 focus:ring-[#ff7a59]/15"
                    type="password"
                    placeholder="Repeat password"
                    value={passwordConfirm}
                    onChange={(e) => onPasswordConfirmChange(e.target.value)}
                    autoComplete="new-password"
                  />
                  {passwordConfirm.length > 0 && password !== passwordConfirm && (
                    <p className="text-xs text-[#9c3113]">Passwords do not match yet.</p>
                  )}
                </div>
              </div>

              {error && (
                <div className="rounded-[22px] border border-[#eb5a36]/20 bg-[#ff7a59]/10 px-4 py-3 text-sm text-[#9c3113]">
                  {error}
                </div>
              )}

              <div className="grid gap-3 pt-2 sm:grid-cols-2">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="rounded-full bg-[#17301f] px-4 py-3.5 text-sm font-semibold text-[#fff8ee] shadow-[0_14px_28px_rgba(23,48,31,0.18)] transition hover:-translate-y-0.5 hover:bg-[#214129] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                >
                  {isSubmitting ? "Creating account..." : "Create account"}
                </button>

                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-full border border-[#17301f]/12 bg-[#fff4dd] px-4 py-3.5 text-sm font-semibold text-[#5f6f61] transition hover:-translate-y-0.5 hover:border-[#17301f]/20 hover:text-[#17301f]"
                >
                  Cancel
                </button>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#17301f]/10 pt-4 text-sm text-[#5f6f61]">
              <span>Already have a ride account?</span>
              <button
                className="font-semibold text-[#17301f] underline underline-offset-4 transition hover:text-[#eb5a36]"
                onClick={onNavigateToLogin}
                type="button"
              >
                Sign in
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
