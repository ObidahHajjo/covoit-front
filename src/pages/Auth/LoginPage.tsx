import { useLocation } from "react-router-dom";
import { useLogin } from "../../hooks/Auth/useLogin";
import { LoginSection } from "../../components/ui/Auth/LoginSection.tsx";
import FloatingToast from "../../components/common/FloatingToast";

/**
 * Render the sign-in page with credential fields, validation state, and navigation to account creation.
 *
 * @returns The login form section wired to the authentication workflow.
 */
export default function LoginPage() {
  const location = useLocation();
  const flash = (location.state as { flash?: string } | null)?.flash ?? null;

  const {
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
    onNavigateToForgotPassword,
    onNavigateToLanding,
  } = useLogin();

  return (
    <>
      <FloatingToast message={flash} tone="error" durationMs={5000} />
      <LoginSection
      email={email}
      onEmailChange={setEmail}
      password={password}
      onPasswordChange={setPassword}
      showPassword={showPassword}
      onTogglePassword={onTogglePassword}
      isSubmitting={isSubmitting}
      canSubmit={canSubmit}
      error={error}
      onSubmit={onSubmit}
      onClear={onClear}
      onNavigateToRegister={onNavigateToRegister}
      onNavigateToForgotPassword={onNavigateToForgotPassword}
      onNavigateToLanding={onNavigateToLanding}
    />
    </>
  );
}
