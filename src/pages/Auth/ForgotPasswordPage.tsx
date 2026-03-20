import { type FormEvent, useState } from "react";
import { apiClient } from "../../app/apiClient";
import type { AxiosError } from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const { data } = await apiClient.post("/auth/forgot-password", { email });
      setMessage(data.message ?? "If an account exists for this email, a reset link has been sent.");
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message ?? "Unable to send reset link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-[var(--theme-bg-soft)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="bg-[var(--theme-surface)] p-6 sm:p-8 lg:p-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider text-[var(--theme-muted-strong)]">
            <span className="h-2 w-2 rounded-full bg-[#60a5fa]" />
            Account recovery
          </div>
          <h1 className="mt-6 max-w-[11ch] text-[clamp(2rem,5vw,3.5rem)] font-medium leading-tight tracking-tight text-[var(--theme-ink)]">
            Find your way back.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-[var(--theme-muted)] sm:text-base">
            Enter the email linked to your account and we will send a reset link so you can get back in.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {["Secure reset flow", "Email verification", "Quick recovery"].map((item) => (
              <div
                key={item}
                className="border-b border-[var(--theme-line)] px-4 py-4 text-sm text-[var(--theme-muted-strong)]"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[var(--theme-surface)] p-5 sm:p-7 lg:p-10">
          <div className="border-b border-[var(--theme-line)] pb-6">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--theme-subtle)]">Forgot password</p>
            <h2 className="mt-2 text-2xl font-medium tracking-tight text-[var(--theme-ink)]">
              Send a reset link.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--theme-muted)]">
              We will email reset instructions if an account exists for this address.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="forgot-email" className="block text-xs font-medium uppercase tracking-wider text-[var(--theme-subtle)]">
                  Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border-b border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-3 text-sm text-[var(--theme-ink)] outline-none transition placeholder:text-[rgba(118,124,122,0.5)] focus:border-[var(--theme-primary)]"
                  required
                />
              </div>

              {message && (
                <div className="border-l-2 border-[#4ade80] bg-[#f0fdf4] px-4 py-3 text-sm text-[var(--theme-ink)]">
                  {message}
                </div>
              )}

              {error && (
                <div className="border-l-2 border-[#f472b6] bg-[#fdf2f8] px-4 py-3 text-sm text-[var(--theme-ink)]">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[var(--theme-primary)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[var(--theme-primary-dim)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Sending link..." : "Send reset link"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
