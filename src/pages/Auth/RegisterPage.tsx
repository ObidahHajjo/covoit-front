import { useRegister } from "../../context/Auth/useRegister";
import { RegisterSection } from "../../components/ui/RegisterSection";

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