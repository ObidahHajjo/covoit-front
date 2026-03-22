import PageLoadingState from "../../components/common/PageLoadingState";
import { LiveChatSection } from "../../components/ui/LiveChatSection";
import { useChatConversation } from "../../context/Chat/useChatConversation";

export default function ChatConversationPage() {
  const { conversation, loading, draft, setDraft, sending, success, error, handleSubmit, isRealtimeConnected } = useChatConversation();

  if (loading) {
    return <PageLoadingState title="Loading conversation" />;
  }

  if (!conversation) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center px-4 py-6 sm:px-6 lg:px-0">
        <div className="serene-panel w-full max-w-xl px-8 py-10 text-center backdrop-blur-xl">
          <p className="font-heading text-2xl font-bold text-[var(--theme-ink)]">Conversation unavailable</p>
          <p className="mt-3 text-sm text-[var(--theme-muted)]">{error || "This conversation could not be loaded."}</p>
        </div>
      </div>
    );
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
