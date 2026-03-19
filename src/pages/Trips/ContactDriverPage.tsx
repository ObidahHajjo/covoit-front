import { useContactDriver } from "../../context/Contact/useContactDriver";
import { ContactDriverSection } from "../../components/ui/ContactDriverSection";

export default function ContactDriverPage() {
  const {
    subject,
    setSubject,
    message,
    setMessage,
    success,
    error,
    handleSubmit,
  } = useContactDriver();

  return (
    <ContactDriverSection
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