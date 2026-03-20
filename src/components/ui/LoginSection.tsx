import type React from "react";

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
    <div className="min-h-dvh bg-[#fafafa] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden bg-white md:grid-cols-[1fr_1fr]">
        <section className="relative flex min-h-[320px] flex-col justify-between border-b border-[#eee] p-6 sm:p-8 md:min-h-[640px] md:border-b-0 md:border-r lg:p-10">
          <div className="absolute right-5 top-5 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-[#999]">
            Community-first
          </div>

          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#666]">
              <span className="h-2 w-2 rounded-full bg-[#60a5fa]" />
              Sign in
            </div>
            <h1 className="mt-6 max-w-[10ch] text-[clamp(2rem,5vw,3.5rem)] font-medium leading-tight tracking-tight text-[#222]">
              Welcome back.
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[#888] sm:text-base">
              Sign in to continue your journey with trusted riders and shared routes.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-[#666]">
              {["Verified profiles", "Transparent pricing", "Active community"].map((item) => (
                <span
                  key={item}
                  className="border-b border-[#eee] px-3 py-2"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mt-10 border-t border-[#eee] pt-6">
            <div className="flex items-center justify-between gap-4 text-lg font-medium text-[#222]">
              <span>Papeete</span>
              <span className="h-2 flex-1 border-b border-dotted border-[#ddd]" />
              <span>Faaa</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#888]">
              Join trusted riders on familiar routes.
            </p>
          </div>
        </section>

        <section className="flex flex-col justify-between p-5 sm:p-7 lg:p-10">
          <div className="flex items-center justify-between gap-4 border-b border-[#eee] pb-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#999]">Authentication</p>
              <p className="mt-2 text-xl font-medium tracking-tight text-[#222]">
                Bon retour
              </p>
            </div>
            <span className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-[#666]">
              Live access
            </span>
          </div>

          <div className="mt-6 border-b border-[#eee] pb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#999]">Sign in</p>
                <h2 className="mt-2 text-2xl font-medium tracking-tight text-[#222]">
                  Continue your route.
                </h2>
              </div>
            </div>

            <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-5">
              <div className="grid gap-4">
                <label htmlFor="email" className="grid gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-[#999]">Email</span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#999]">
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
                      className="w-full border-b border-[#eee] bg-white py-3.5 pl-12 pr-4 text-sm text-[#222] outline-none transition placeholder:text-[#bbb] focus:border-[#222]"
                    />
                  </div>
                </label>

                <label htmlFor="password" className="grid gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-[#999]">Password</span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#999]">
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
                      className="w-full border-b border-[#eee] bg-white py-3.5 pl-12 pr-12 text-sm text-[#222] outline-none transition placeholder:text-[#bbb] focus:border-[#222]"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={showPassword ? "Masquer" : "Afficher"}
                      onClick={onTogglePassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#999] transition hover:text-[#222]"
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
                <div className="flex items-start gap-3 border-l-2 border-[#f472b6] bg-[#fdf2f8] px-4 py-3 text-sm text-[#222]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f472b6] text-xs font-medium text-white">
                    !
                  </span>
                  <p>{error}</p>
                </div>
              )}

              <div className="grid gap-3">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#222] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={onNavigateToRegister}
                    className="rounded-full border border-[#eee] bg-white px-4 py-3 text-sm font-medium text-[#222] transition hover:border-[#ddd]"
                  >
                    Create account
                  </button>
                  <button
                    type="button"
                    onClick={onClear}
                    className="rounded-full border border-[#eee] bg-[#fafafa] px-4 py-3 text-sm font-medium text-[#666] transition hover:border-[#ddd]"
                  >
                    Clear form
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#eee] pt-4 text-xs text-[#999]">
              <span>Minimal and clean design.</span>
              <span className="truncate">API: {import.meta.env.VITE_API_BASE_URL}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
