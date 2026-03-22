import { useContactDriver } from "../../context/Contact/useContactDriver";
import { LiveChatSection } from "../../components/ui/LiveChatSection";

export default function ContactDriverPage() {
  const {
    draft,
    setDraft,
    messages,
    sending,
    success,
    error,
    handleSubmit,
  } = useContactDriver();

  return (
    <LiveChatSection
      title="Chat with driver"
      subtitle="Coordinate pickup details and timing directly inside the app instead of sending an email-style form."
      counterpartLabel="Driver"
      messages={messages}
      draft={draft}
      sending={sending}
      success={success}
      error={error}
      onDraftChange={setDraft}
      onSubmit={handleSubmit}
    />
  );
}
