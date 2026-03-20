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
    <div className="min-h-dvh bg-[#fafafa] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="bg-white p-6 sm:p-8 lg:p-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#666]">
            <span className="h-2 w-2 rounded-full bg-[#4ade80]" />
            Password refresh
          </div>
          <h1 className="mt-6 max-w-[11ch] text-[clamp(2rem,5vw,3.5rem)] font-medium leading-tight tracking-tight text-[#222]">
            Set a new password.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-[#888] sm:text-base">
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
                className="border-b border-[#eee] px-4 py-4 text-sm text-[#666]"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-5 sm:p-7 lg:p-10">
          <div className="border-b border-[#eee] pb-6">
            <p className="text-xs font-medium uppercase tracking-wider text-[#999]">Reset password</p>
            <h2 className="mt-2 text-2xl font-medium tracking-tight text-[#222]">
              Confirm your new password.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#888]">
              Enter your new password below to complete the recovery process.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="reset-email" className="block text-xs font-medium uppercase tracking-wider text-[#999]">
                  Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  readOnly
                  autoComplete="email"
                  className="w-full border-b border-[#eee] bg-[#fafafa] px-4 py-3 text-sm text-[#666] outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="reset-password" className="block text-xs font-medium uppercase tracking-wider text-[#999]">
                    New password
                  </label>
                  <input
                    id="reset-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password"
                    autoComplete="new-password"
                    className="w-full border-b border-[#eee] bg-white px-4 py-3 text-sm text-[#222] outline-none transition placeholder:text-[#bbb] focus:border-[#222]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="reset-password-confirmation" className="block text-xs font-medium uppercase tracking-wider text-[#999]">
                    Confirm password
                  </label>
                  <input
                    id="reset-password-confirmation"
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    className="w-full border-b border-[#eee] bg-white px-4 py-3 text-sm text-[#222] outline-none transition placeholder:text-[#bbb] focus:border-[#222]"
                    required
                  />
                </div>
              </div>

              {!token || !email ? (
                <div className="border-l-2 border-[#f472b6] bg-[#fdf2f8] px-4 py-3 text-sm text-[#222]">
                  The reset link is incomplete. Request a new recovery email and try again.
                </div>
              ) : null}

              {message && (
                <div className="border-l-2 border-[#4ade80] bg-[#f0fdf4] px-4 py-3 text-sm text-[#222]">
                  {message}
                </div>
              )}

              {error && (
                <div className="border-l-2 border-[#f472b6] bg-[#fdf2f8] px-4 py-3 text-sm text-[#222]">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !token || !email}
                className="w-full rounded-full bg-[#222] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-50"
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
