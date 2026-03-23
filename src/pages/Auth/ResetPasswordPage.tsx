import { ResetPasswordSection } from "../../components/ui/Auth/ResetPasswordSection";
import { useResetPassword } from "../../hooks/Auth/useResetPassword";

/**
 * Render the password reset confirmation page using the recovery token and email carried in the URL.
 *
 * @returns The reset-password form with success, error, and incomplete-link states.
 */
export default function ResetPasswordPage() {
  const {
    token,
    email,
    password,
    setPassword,
    passwordConfirmation,
    setPasswordConfirmation,
    message,
    error,
    loading,
    onSubmit,
  } = useResetPassword();

  return (
    <ResetPasswordSection
      token={token}
      email={email}
      password={password}
      onPasswordChange={setPassword}
      passwordConfirmation={passwordConfirmation}
      onPasswordConfirmationChange={setPasswordConfirmation}
      message={message}
      error={error}
      loading={loading}
      onSubmit={onSubmit}
    />
  );
}
