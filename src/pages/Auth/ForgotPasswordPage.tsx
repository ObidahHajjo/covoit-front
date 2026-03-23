import { ForgotPasswordSection } from "../../components/ui/Auth/ForgotPasswordSection";
import { useForgotPassword } from "../../hooks/Auth/useForgotPassword";

/**
 * Render the password recovery page that requests a reset link for the submitted email address.
 *
 * @returns The forgot-password layout with recovery messaging and submission feedback.
 */
export default function ForgotPasswordPage() {
  const { email, setEmail, message, error, loading, onSubmit } = useForgotPassword();

  return (
    <ForgotPasswordSection
      email={email}
      onEmailChange={setEmail}
      message={message}
      error={error}
      loading={loading}
      onSubmit={onSubmit}
    />
  );
}
