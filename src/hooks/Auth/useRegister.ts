import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../features/auth/authApi.ts";
import { validatePassword } from "../../features/auth/passwordValidation.ts";
import { translate } from "../../i18n/config.ts";

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
  const passwordValidation = useMemo(() => validatePassword(password), [password]);
  const passwordsMatch = password === passwordConfirm;
  const passwordError =
    password.length > 0 && !passwordValidation.isValid
      ? translate("auth.passwordStrengthInvalid")
      : null;
  const passwordConfirmError =
    passwordConfirm.length > 0 && !passwordsMatch ? translate("auth.passwordsMismatch") : null;

  const canSubmit = useMemo(() => {
    if (isSubmitting) return false;
    if (email.trim().length < 7) return false;
    if (!password.trim() || !passwordConfirm.trim()) return false;
    if (!passwordValidation.isValid) return false;
    if (!passwordsMatch) return false;
    return true;
  }, [email, password, passwordConfirm, isSubmitting, passwordValidation.isValid, passwordsMatch]);

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
    navigate("/");
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
    passwordError,
    passwordConfirmError,
    canSubmit,
    onSubmit,
    onCancel,
    onGoBack,
    onNavigateToLogin,
  };
}
