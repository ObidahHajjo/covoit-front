import type React from "react";
import banner from "../../assets/login-banner.png";

type Props = {
  email: string;
  onEmailChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  isSubmitting: boolean;
  canSubmit: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
  onNavigateToRegister: () => void;
};

export function LoginSection({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  showPassword,
  onTogglePassword,
  isSubmitting,
  canSubmit,
  error,
  onSubmit,
  onClear,
  onNavigateToRegister,
}: Props) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[linear-gradient(180deg,#fff8ee_0%,#fff3db_54%,#ffe8bf_100%)] px-4 py-6 text-[#17301f] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 top-24 h-56 w-56 rounded-full bg-[#91d7ff]/45 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#d5f06b]/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#ff7a59]/20 blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-[36px] border border-[#17301f]/10 bg-[rgba(255,251,243,0.84)] shadow-[0_24px_70px_rgba(112,72,32,0.16)] backdrop-blur md:grid-cols-[1.08fr_0.92fr]">
        <section className="relative flex min-h-[320px] flex-col justify-between overflow-hidden border-b border-[#17301f]/10 p-6 sm:p-8 md:min-h-[720px] md:border-b-0 md:border-r lg:p-10">
          <div className="absolute right-5 top-5 rounded-full border border-[#17301f]/10 bg-white/65 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#eb5a36]">
            Community-first login
          </div>

          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#17301f]/10 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#eb5a36]">
              <span className="h-2 w-2 rounded-full bg-[#ff7a59]" />
              Route /3 mood
            </div>
            <h1 className="mt-6 max-w-[10ch] text-[clamp(2.8rem,7vw,5.8rem)] font-black leading-[0.93] tracking-[-0.04em] text-[#17301f]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Ride back into good company.
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[#5f6f61] sm:text-base">
              Warm visuals, clear trust cues, and a compact sign-in flow that feels like joining a familiar crew for the next trip.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-[#17301f]">
              {[
                "Verified profiles",
                "Transparent seat pricing",
                "Recurring ride circles",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#17301f]/10 bg-white/70 px-4 py-2 shadow-[0_12px_30px_rgba(112,72,32,0.08)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mt-10 overflow-hidden rounded-[30px] border border-[#17301f]/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,242,207,0.92))] p-4 shadow-[0_24px_70px_rgba(112,72,32,0.12)] sm:p-5">
            <div className="absolute -right-4 -top-4 rounded-full border border-[#17301f]/10 bg-white/75 px-3 py-1 text-[11px] font-semibold text-[#17301f] shadow-[0_10px_24px_rgba(112,72,32,0.10)]">
              2 seats left
            </div>
            <img src={banner} alt="Shared ride community" className="h-48 w-full rounded-[22px] object-cover sm:h-56" />
            <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#eb5a36]">Tonight's route</p>
                <div className="mt-2 flex items-center justify-between gap-4 text-xl font-bold text-[#17301f]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                  <span>Papeete</span>
                  <span className="h-2 flex-1 rounded-full bg-[linear-gradient(90deg,#ff7a59,#91d7ff,#d5f06b)]" />
                  <span>Faaa</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#5f6f61]">
                  Social energy, easy pickup notes, and riders who already know the rhythm of the route.
                </p>
              </div>
              <div className="rounded-[24px] border border-[#17301f]/10 bg-white/75 px-4 py-3 text-sm text-[#5f6f61]">
                <p className="font-semibold text-[#17301f]">4 riders</p>
                <p>Verified and chat-ready</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col justify-between p-5 sm:p-7 lg:p-10">
          <div className="flex items-center justify-between gap-4 border-b border-[#17301f]/10 pb-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#eb5a36]">Authentication</p>
              <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#17301f]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                Bon retour
              </p>
            </div>
            <span className="rounded-full border border-[#17301f]/10 bg-white/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#17301f]">
              Live access
            </span>
          </div>

          <div className="mt-6 rounded-[32px] border border-[#17301f]/10 bg-white/70 p-5 shadow-[0_16px_40px_rgba(112,72,32,0.08)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#eb5a36]">Sign in</p>
                <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#17301f]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                  Continue your shared route.
                </h2>
              </div>
              <div className="hidden rounded-full bg-[#d5f06b] px-3 py-2 text-xs font-semibold text-[#17301f] sm:block">
                Warm + playful
              </div>
            </div>

            <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-5">
              <div className="grid gap-4">
                <label htmlFor="email" className="grid gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5f6f61]">Email</span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5f6f61]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </span>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => onEmailChange(e.target.value)}
                      className="w-full rounded-[22px] border border-[#17301f]/12 bg-[#fffaf1] py-3.5 pl-12 pr-4 text-sm text-[#17301f] outline-none transition placeholder:text-[#5f6f61]/65 focus:border-[#ff7a59] focus:bg-white focus:ring-4 focus:ring-[#ff7a59]/15"
                    />
                  </div>
                </label>

                <label htmlFor="password" className="grid gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5f6f61]">Password</span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5f6f61]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => onPasswordChange(e.target.value)}
                      className="w-full rounded-[22px] border border-[#17301f]/12 bg-[#fffaf1] py-3.5 pl-12 pr-12 text-sm text-[#17301f] outline-none transition placeholder:text-[#5f6f61]/65 focus:border-[#ff7a59] focus:bg-white focus:ring-4 focus:ring-[#ff7a59]/15"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={showPassword ? "Masquer" : "Afficher"}
                      onClick={onTogglePassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[#5f6f61] transition hover:bg-[#17301f]/5 hover:text-[#17301f]"
                    >
                      {showPassword ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </label>
              </div>

              {error && (
                <div className="flex items-start gap-3 rounded-[22px] border border-[#eb5a36]/20 bg-[#ff7a59]/10 px-4 py-3 text-sm text-[#9c3113]">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eb5a36] text-xs font-bold text-white">
                    !
                  </span>
                  <p>{error}</p>
                </div>
              )}

              <div className="grid gap-3">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#17301f] px-5 py-3.5 text-sm font-semibold text-[#fff8ee] shadow-[0_14px_28px_rgba(23,48,31,0.18)] transition hover:-translate-y-0.5 hover:bg-[#214129] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={onNavigateToRegister}
                    className="rounded-full border border-[#17301f]/12 bg-white/70 px-4 py-3 text-sm font-semibold text-[#17301f] transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    Create account
                  </button>
                  <button
                    type="button"
                    onClick={onClear}
                    className="rounded-full border border-[#17301f]/12 bg-[#fff4dd] px-4 py-3 text-sm font-semibold text-[#5f6f61] transition hover:-translate-y-0.5 hover:border-[#17301f]/20 hover:text-[#17301f]"
                  >
                    Clear form
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#17301f]/10 pt-4 text-xs text-[#5f6f61]">
              <span>Template 3 direction: warm, social, trustworthy.</span>
              <span className="truncate">API: {import.meta.env.VITE_API_BASE_URL}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
