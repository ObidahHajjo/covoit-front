import { useLogin } from "../../context/Auth/useLogin";
import { LoginSection } from "../../components/ui/LoginSection";

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
