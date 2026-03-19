import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../features/auth/authApi";
import { useAuth } from "../useAuth";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { refreshMe } = useAuth();

  const canSubmit = email.trim().length > 7 && password.length > 7 && !isSubmitting;

  async function onSubmit() {
    setError(null);
    try {
      setIsSubmitting(true);
      const data = await login({ email: email.trim(), password, password_confirmation: null });
      if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
      if (data.person_id) sessionStorage.setItem("personId", String(data.person_id));
      await refreshMe();
      navigate("/");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  function onClear() {
    setEmail("");
    setPassword("");
    setError(null);
  }

  function onTogglePassword() {
    setShowPassword((v) => !v);
  }

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
