import type { FormEvent } from "react";
import { useState } from "react";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../app/apiClient";
import { translate } from "../../i18n/config";

/**
 * Manages the forgot-password form state and recovery-link request flow.
 *
 * @returns Form state, feedback messages, and the submit handler.
 */
export function useForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Requests a password reset email for the submitted address.
   *
   * @param event - Form submission event from the forgot-password form.
   * @returns A promise that resolves once the recovery request finishes.
   */
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const { data } = await apiClient.post("/auth/forgot-password", { email });
      setMessage(data.message ?? translate("auth.resetEmailSent"));
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message ?? translate("auth.unableToSendReset"));
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
    email,
    setEmail,
    message,
    error,
    loading,
    onSubmit,
    onNavigateToLogin,
    onNavigateToLanding,
  };
}
