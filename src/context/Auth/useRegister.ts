import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../features/auth/authApi";
import { translate } from "../../i18n/config";

/**
 * Manages registration form state and redirects the user into profile completion.
 *
 * @returns Registration form state, derived flags, and navigation handlers.
 */
export function useRegister() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    if (isSubmitting) return false;
    if (email.trim().length < 7) return false;
    if (password.length < 6) return false;
    if (passwordConfirm.length < 6) return false;
    if (password !== passwordConfirm) return false;
    return true;
  }, [email, password, passwordConfirm, isSubmitting]);

  /**
   * Submits the registration form and stores onboarding state for the next step.
   *
   * @param event - Form submission event from the registration form.
   * @returns A promise that resolves once the registration flow completes.
   */
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setError(null);

    try {
      setIsSubmitting(true);

      const data = await register({
        email: email,
        password,
        password_confirmation: passwordConfirm,
      });

      sessionStorage.setItem("personId", String(data.person_id));
      sessionStorage.setItem("pending_profile_email", email.trim());
      navigate("/complete-profile", { state: { email: email.trim() } });
    } catch (err) {
      setError(err instanceof Error ? err.message : translate("auth.registerFailed"));
    } finally {
      setIsSubmitting(false);
    }
  }

  /**
   * Cancels registration and returns the user to the login page.
   *
   * @returns Nothing.
   */
  function onCancel() {
    navigate("/login");
  }

  /**
   * Navigates back to the previous history entry.
   *
   * @returns Nothing.
   */
  function onGoBack() {
    navigate(-1);
  }

  /**
   * Navigates directly to the login page.
   *
   * @returns Nothing.
   */
  function onNavigateToLogin() {
    navigate("/login");
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    isSubmitting,
    error,
    canSubmit,
    onSubmit,
    onCancel,
    onGoBack,
    onNavigateToLogin,
  };
}
