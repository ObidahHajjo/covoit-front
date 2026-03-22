import { useContactPassenger } from "../../context/Contact/useContactPassenger";
import { LiveChatSection } from "../../components/ui/LiveChatSection";

export default function ContactPassengerPage() {
  const {
    draft,
    setDraft,
    messages,
    sending,
    success,
    error,
    handleSubmit,
  } = useContactPassenger();

  return (
    <LiveChatSection
      title="Chat with passenger"
      subtitle="Keep trip coordination inside a direct chat experience so updates feel immediate and easier to follow."
      counterpartLabel="Passenger"
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
