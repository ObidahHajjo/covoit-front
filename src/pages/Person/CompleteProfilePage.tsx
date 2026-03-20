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
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#fff8ee_0%,#fff3db_54%,#ffe8bf_100%)] px-6 text-[#5f6f61]">
        <div className="rounded-full border border-[#17301f]/10 bg-white/70 px-5 py-3 text-sm shadow-[0_12px_30px_rgba(112,72,32,0.08)]">
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
