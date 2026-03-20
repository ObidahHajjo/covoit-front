import { type FormEvent, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiClient } from "../../app/apiClient";
import type { AxiosError } from "axios";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);
  const email = useMemo(() => searchParams.get("email") ?? "", [searchParams]);

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const { data } = await apiClient.post("/auth/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      setMessage(data.message ?? "Password reset successfully.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message ?? "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[linear-gradient(180deg,#fff8ee_0%,#fff3db_54%,#ffe8bf_100%)] px-4 py-8 text-[#17301f] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-10 top-20 h-64 w-64 rounded-full bg-[#91d7ff]/35 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#d5f06b]/45 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#ff7a59]/20 blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[0.94fr_1.06fr]">
        <section className="rounded-[36px] border border-[#17301f]/10 bg-[rgba(255,251,243,0.84)] p-6 shadow-[0_24px_70px_rgba(112,72,32,0.16)] backdrop-blur sm:p-8 lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#17301f]/10 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#eb5a36]">
            <span className="h-2 w-2 rounded-full bg-[#ff7a59]" />
            Password refresh
          </div>
          <h1 className="mt-6 max-w-[11ch] text-[clamp(2.8rem,7vw,5.4rem)] font-black leading-[0.95] tracking-[-0.04em] text-[#17301f]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Set a new key for your next trip.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-[#5f6f61] sm:text-base">
            Choose a new password, confirm it once, and we will guide you back to login after the update succeeds.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              token ? "Reset token detected" : "Missing token",
              email ? "Email pre-filled" : "Missing email",
              "Automatic redirect on success",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[24px] border border-[#17301f]/10 bg-white/70 px-4 py-4 text-sm text-[#17301f] shadow-[0_16px_40px_rgba(112,72,32,0.08)]"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[36px] border border-[#17301f]/10 bg-[rgba(255,251,243,0.84)] p-5 shadow-[0_24px_70px_rgba(112,72,32,0.16)] backdrop-blur sm:p-7 lg:p-10">
          <div className="rounded-[30px] border border-[#17301f]/10 bg-white/70 p-5 shadow-[0_16px_40px_rgba(112,72,32,0.08)] sm:p-6 lg:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#eb5a36]">Reset password</p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#17301f]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Confirm your new password.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#5f6f61]">
              This page keeps the recovery flow on-brand instead of dropping into a plain placeholder.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="reset-email" className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5f6f61]">
                  Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  readOnly
                  autoComplete="email"
                  className="w-full rounded-[22px] border border-[#17301f]/12 bg-[#f6efdc] px-4 py-3.5 text-sm text-[#17301f] outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="reset-password" className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5f6f61]">
                    New password
                  </label>
                  <input
                    id="reset-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password"
                    autoComplete="new-password"
                    className="w-full rounded-[22px] border border-[#17301f]/12 bg-[#fffaf1] px-4 py-3.5 text-sm text-[#17301f] outline-none transition placeholder:text-[#5f6f61]/65 focus:border-[#ff7a59] focus:bg-white focus:ring-4 focus:ring-[#ff7a59]/15"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="reset-password-confirmation" className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5f6f61]">
                    Confirm password
                  </label>
                  <input
                    id="reset-password-confirmation"
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    className="w-full rounded-[22px] border border-[#17301f]/12 bg-[#fffaf1] px-4 py-3.5 text-sm text-[#17301f] outline-none transition placeholder:text-[#5f6f61]/65 focus:border-[#ff7a59] focus:bg-white focus:ring-4 focus:ring-[#ff7a59]/15"
                    required
                  />
                </div>
              </div>

              {!token || !email ? (
                <div className="rounded-[22px] border border-[#eb5a36]/20 bg-[#ff7a59]/10 px-4 py-3 text-sm text-[#9c3113]">
                  The reset link is incomplete. Request a new recovery email and try again.
                </div>
              ) : null}

              {message && (
                <div className="rounded-[22px] border border-[#17301f]/12 bg-[#d5f06b]/35 px-4 py-3 text-sm text-[#17301f]">
                  {message}
                </div>
              )}

              {error && (
                <div className="rounded-[22px] border border-[#eb5a36]/20 bg-[#ff7a59]/10 px-4 py-3 text-sm text-[#9c3113]">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !token || !email}
                className="w-full rounded-full bg-[#17301f] px-4 py-3.5 text-sm font-semibold text-[#fff8ee] shadow-[0_14px_28px_rgba(23,48,31,0.18)] transition hover:-translate-y-0.5 hover:bg-[#214129] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                {loading ? "Resetting password..." : "Reset password"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
