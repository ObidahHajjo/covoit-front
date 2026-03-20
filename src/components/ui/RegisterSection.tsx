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
    <div className="min-h-dvh bg-[#fafafa] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden bg-white lg:grid-cols-[1fr_1fr]">
        <section className="relative flex flex-col justify-between border-b border-[#eee] p-6 sm:p-8 lg:min-h-[640px] lg:border-b-0 lg:border-r lg:p-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#666]">
              <span className="h-2 w-2 rounded-full bg-[#4ade80]" />
              Create account
            </div>
            <h1 className="mt-6 max-w-[11ch] text-[clamp(2rem,5vw,3.5rem)] font-medium leading-tight tracking-tight text-[#222]">
              Join the community.
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[#888] sm:text-base">
              Registration is simple. Create your account and start sharing rides with trusted people.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {[
              ["Quick setup", "Create your account in seconds."],
              ["Secure access", "Your data stays protected."],
              ["Active community", "Join riders on familiar routes."],
              ["Profile ready", "Complete your profile after signup."],
            ].map(([title, copy]) => (
              <article
                key={title}
                className="border-b border-[#eee] p-4"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-[#999]">Feature</p>
                <h2 className="mt-2 text-base font-medium text-[#222]">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#888]">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="p-5 sm:p-7 lg:p-10">
          <div className="flex items-center gap-3 border-b border-[#eee] pb-5">
            <button
              type="button"
              onClick={onGoBack}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eee] bg-white text-[#222] transition hover:border-[#ddd]"
              aria-label="Back"
            >
              <span className="text-lg leading-none">←</span>
            </button>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#999]">Registration</p>
              <p className="mt-1 text-xl font-medium tracking-tight text-[#222]">
                Create your account
              </p>
            </div>
          </div>

          <div className="mt-6 border-b border-[#eee] pb-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#999]">Start here</p>
                <h2 className="mt-2 text-2xl font-medium tracking-tight text-[#222]">
                  Join the route.
                </h2>
              </div>
            </div>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="register-email" className="text-xs font-medium uppercase tracking-wider text-[#999]">Email</label>
                <input
                  id="register-email"
                  name="email"
                  className="w-full border-b border-[#eee] bg-white px-4 py-3.5 text-sm text-[#222] outline-none transition placeholder:text-[#bbb] focus:border-[#222]"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  autoComplete="email"
                />
                <p className="text-xs text-[#888]">Use the email you want tied to your ride history.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="register-password" className="text-xs font-medium uppercase tracking-wider text-[#999]">Password</label>
                  <input
                    id="register-password"
                    name="password"
                    className="w-full border-b border-[#eee] bg-white px-4 py-3.5 text-sm text-[#222] outline-none transition placeholder:text-[#bbb] focus:border-[#222]"
                    type="password"
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-[#888]">At least 6 characters.</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="register-password-confirm" className="text-xs font-medium uppercase tracking-wider text-[#999]">Confirm</label>
                  <input
                    id="register-password-confirm"
                    name="passwordConfirmation"
                    className="w-full border-b border-[#eee] bg-white px-4 py-3.5 text-sm text-[#222] outline-none transition placeholder:text-[#bbb] focus:border-[#222]"
                    type="password"
                    placeholder="Repeat password"
                    value={passwordConfirm}
                    onChange={(e) => onPasswordConfirmChange(e.target.value)}
                    autoComplete="new-password"
                  />
                  {passwordConfirm.length > 0 && password !== passwordConfirm && (
                    <p className="text-xs text-[#f472b6]">Passwords do not match yet.</p>
                  )}
                </div>
              </div>

              {error && (
                <div className="border-l-2 border-[#f472b6] bg-[#fdf2f8] px-4 py-3 text-sm text-[#222]">
                  {error}
                </div>
              )}

              <div className="grid gap-3 pt-2 sm:grid-cols-2">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="rounded-full bg-[#222] px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Creating account..." : "Create account"}
                </button>

                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-full border border-[#eee] bg-[#fafafa] px-4 py-3.5 text-sm font-medium text-[#666] transition hover:border-[#ddd]"
                >
                  Cancel
                </button>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#eee] pt-4 text-sm text-[#888]">
              <span>Already have an account?</span>
              <button
                className="font-medium text-[#222] underline underline-offset-4 transition hover:text-[#666]"
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
