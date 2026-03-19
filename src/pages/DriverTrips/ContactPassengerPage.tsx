import { useContactPassenger } from "../../context/Contact/useContactPassenger";
import { ContactPassengerSection } from "../../components/ui/ContactPassengerSection";

export default function ContactPassengerPage() {
  const {
    subject,
    setSubject,
    message,
    setMessage,
    success,
    error,
    handleSubmit,
  } = useContactPassenger();

  return (
    <ContactPassengerSection
      subject={subject}
      onSubjectChange={setSubject}
      message={message}
      onMessageChange={setMessage}
      success={success}
      error={error}
      onSubmit={handleSubmit}
    />
  );
}