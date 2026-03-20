import { Navigate } from "react-router-dom";
import { isProfileComplete } from "../../auth/profileCompletion";
import { useAuth } from "../../context/useAuth";
import { useCompleteProfile } from "../../context/Person/useCompleteProfile";
import { CompleteProfileSection } from "../../components/ui/CompleteProfileSection";

export default function CompleteProfilePage() {
  const { status, user } = useAuth();
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
  } = useCompleteProfile();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--theme-bg-soft)] px-6 text-[var(--theme-muted)]">
        <div className="rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)] px-5 py-3 text-sm">
          Loading profile setup...
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
    />
  );
}
