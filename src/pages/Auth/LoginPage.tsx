import { useLogin } from "../../hooks/Auth/useLogin";
import { LoginSection } from "../../components/ui/Auth/LoginSection.tsx";

/**
 * Render the sign-in page with credential fields, validation state, and navigation to account creation.
 *
 * @returns The login form section wired to the authentication workflow.
 */
export default function LoginPage() {
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
  } = useLogin();

  return (
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
    />
  );
}
