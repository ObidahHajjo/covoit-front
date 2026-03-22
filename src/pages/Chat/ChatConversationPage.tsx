import PageLoadingState from "../../components/common/PageLoadingState";
import { LiveChatSection } from "../../components/ui/LiveChatSection";
import { useChatConversation } from "../../context/Chat/useChatConversation";

export default function ChatConversationPage() {
  const { conversation, draft, setDraft, sending, success, error, handleSubmit, isRealtimeConnected } = useChatConversation();

  if (!conversation) {
    return <PageLoadingState title="Loading conversation" />;
  }

  return (
    <LiveChatSection
      title={conversation.participantName}
      subtitle={`Direct conversation${conversation.tripLabel ? ` · ${conversation.tripLabel}` : ""}`}
      counterpartLabel={conversation.participantSubtitle || "Conversation"}
      messages={conversation.messages}
      isRealtimeConnected={isRealtimeConnected}
      draft={draft}
      sending={sending}
      success={success}
      error={error}
      onDraftChange={setDraft}
      onSubmit={handleSubmit}
    />
  );
}
