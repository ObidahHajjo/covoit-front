import { useRegister } from "../../context/Auth/useRegister";
import { RegisterSection } from "../../components/ui/Auth/RegisterSection.tsx";

/**
 * Render the account registration page with form state, validation feedback, and navigation back to sign-in.
 *
 * @returns The registration form section for creating a new account.
 */
export default function RegisterPage() {
  const {
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
  } = useRegister();

  return (
    <RegisterSection
      email={email}
      onEmailChange={setEmail}
      password={password}
      onPasswordChange={setPassword}
      passwordConfirm={passwordConfirm}
      onPasswordConfirmChange={setPasswordConfirm}
      isSubmitting={isSubmitting}
      canSubmit={canSubmit}
      error={error}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onGoBack={onGoBack}
      onNavigateToLogin={onNavigateToLogin}
    />
  );
}
