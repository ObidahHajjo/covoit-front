import { Navigate } from "react-router-dom";
import { isProfileComplete } from "../../auth/profileCompletion";
import { useAuth } from "../../hooks/Auth/useAuth.ts";
import { useCompleteProfile } from "../../hooks/Person/useCompleteProfile";
import { CompleteProfileSection } from "../../components/ui/Auth/CompleteProfileSection.tsx";
import { useI18n } from "../../i18n/I18nProvider";

/**
 * Render the profile completion page that finalizes required user information after authentication.
 *
 * @returns The profile completion form, a loading state, or a redirect when the user is ineligible for this step.
 */
export default function CompleteProfilePage() {
  const { status, user } = useAuth();
  const { t } = useI18n();
  const {
    email,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    pseudo,
    setPseudo,
    phone,
    setPhone,
    isSubmitting,
    error,
    canSubmit,
    onSubmit,
    onNavigateToLanding,
  } = useCompleteProfile();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--theme-bg-soft)] px-6 text-[var(--theme-muted)]">
        <div className="rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)] px-5 py-3 text-sm">
          {t("loading.profileSetup")}
        </div>
      </div>
    );
  }

  if (status === "guest") {
    return <Navigate to="/login" replace />;
  }

  if (isProfileComplete(user)) {
    return <Navigate to="/home" replace />;
  }

  return (
    <CompleteProfileSection
      email={email}
      firstName={firstName}
      onFirstNameChange={setFirstName}
      lastName={lastName}
      onLastNameChange={setLastName}
      pseudo={pseudo}
      onPseudoChange={setPseudo}
      phone={phone}
      onPhoneChange={setPhone}
      isSubmitting={isSubmitting}
      error={error}
      canSubmit={canSubmit}
      onSubmit={onSubmit}
      onNavigateToLanding={onNavigateToLanding}
    />
  );
}
