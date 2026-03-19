import { useCompleteProfile } from "../../context/Person/useCompleteProfile";
import { CompleteProfileSection } from "../../components/ui/CompleteProfileSection";

export default function CompleteProfilePage() {
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