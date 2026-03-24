import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import type { AxiosError } from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiClient } from "../../app/apiClient";
import { translate } from "../../i18n/config";

/**
 * Manages the password reset flow using the token and email carried in the URL.
 *
 * @returns Reset-password state, derived URL values, and the submit handler.
 */
export function useResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);
  const email = useMemo(() => searchParams.get("email") ?? "", [searchParams]);

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Submits the new password using the reset token and email from the URL.
   *
   * @param event - Form submission event from the reset-password form.
   * @returns A promise that resolves once the reset request finishes.
   */
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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

      setMessage(data.message ?? translate("auth.passwordResetSuccess"));
      window.setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message ?? translate("auth.unableToResetPassword"));
    } finally {
      setLoading(false);
    }
  }

  /**
   * Returns the user to the login page.
   *
   * @returns Nothing.
   */
  function onNavigateToLogin() {
    navigate("/login");
  }

  /**
   * Returns the user to the landing page.
   *
   * @returns Nothing.
   */
  function onNavigateToLanding() {
    navigate("/");
  }

  return {
    token,
    email,
    password,
    setPassword,
    passwordConfirmation,
    setPasswordConfirmation,
    message,
    error,
    loading,
    onSubmit,
    onNavigateToLogin,
    onNavigateToLanding,
  };
}
