import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../features/auth/authApi.ts";
import { useAuth } from "./useAuth.ts";
import { translate } from "../../i18n/config.ts";

/**
 * Manages login form state and session restoration after authentication.
 *
 * @returns Login form state, derived flags, and event handlers.
 */
export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { refreshMe } = useAuth();

  const canSubmit = email.trim().length > 7 && password.length > 7 && !isSubmitting;

  /**
   * Submits the login form and refreshes the authenticated user state.
   *
   * @param event - Form submission event from the login form.
   * @returns A promise that resolves once the submission flow finishes.
   */
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setError(null);
    try {
      setIsSubmitting(true);
      const data = await login({ email: email.trim(), password, password_confirmation: null });
      if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
      if (data.person_id) sessionStorage.setItem("personId", String(data.person_id));
      const authenticated = await refreshMe();
      if (!authenticated) {
        throw new Error(translate("auth.loginRestoreFailed"));
      }
      navigate("/");
    } catch (err) {
      const msg = err instanceof Error ? err.message : translate("auth.loginFailed");
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  /**
   * Clears the login form inputs and any current error message.
   *
   * @returns Nothing.
   */
  function onClear() {
    setEmail("");
    setPassword("");
    setError(null);
  }

  /**
   * Toggles visibility of the password field.
   *
   * @returns Nothing.
   */
  function onTogglePassword() {
    setShowPassword((v) => !v);
  }

  /**
   * Navigates from the login flow to the registration page.
   *
   * @returns Nothing.
   */
  function onNavigateToRegister() {
    navigate("/register");
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    error,
    showPassword,
    canSubmit,
    onSubmit,
    onClear,
    onTogglePassword,
    onNavigateToRegister,
  };
}
