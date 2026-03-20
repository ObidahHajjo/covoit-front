import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../features/auth/authApi";

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
      setError(err instanceof Error ? err.message : "Register failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  function onCancel() {
    navigate("/login");
  }

  function onGoBack() {
    navigate(-1);
  }

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
