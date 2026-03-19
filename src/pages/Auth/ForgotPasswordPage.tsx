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
        <div className="mx-auto max-w-md p-6">
            <h1 className="mb-4 text-2xl font-bold">Forgot password</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full rounded border px-3 py-2"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded bg-slate-900 px-4 py-2 text-white"
                >
                    {loading ? "Sending..." : "Send reset link"}
                </button>
            </form>

            {message && <p className="mt-4 text-green-600">{message}</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
    );
}