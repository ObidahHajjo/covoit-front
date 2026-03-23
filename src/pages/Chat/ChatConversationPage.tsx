import PageLoadingState from "../../components/common/PageLoadingState";
import { LiveChatSection } from "../../components/ui/Chat/LiveChatSection.tsx";
import { useChatConversation } from "../../hooks/Chat/useChatConversation";
import { useI18n } from "../../i18n/I18nProvider";

/**
 * Render a live conversation view with message history, draft state, and realtime connectivity feedback.
 *
 * @returns The active conversation interface, a loading state, or an unavailable fallback.
 */
export default function ChatConversationPage() {
  const { t } = useI18n();
  const {
    conversation,
    loading,
    draft,
    setDraft,
    sending,
    clearing,
    clearingMessageIds,
    success,
    error,
    handleSubmit,
    handleClearConversation,
    handleClearMessages,
    isRealtimeConnected,
  } = useChatConversation();

  if (loading) {
    return <PageLoadingState title={t("loading.conversation")} />;
  }

  if (!conversation) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center px-4 py-6 sm:px-6 lg:px-0">
        <div className="serene-panel w-full max-w-xl px-8 py-10 text-center backdrop-blur-xl">
          <p className="font-heading text-2xl font-bold text-[var(--theme-ink)]">{t("chat.unavailable")}</p>
          <p className="mt-3 text-sm text-[var(--theme-muted)]">{error || t("chat.unavailableBody")}</p>
        </div>
      </div>
    );
  }

  return (
    <LiveChatSection
      title={conversation.participantName}
      subtitle={`${t("chat.directConversation")}${conversation.tripLabel ? ` · ${conversation.tripLabel}` : ""}`}
      counterpartLabel={conversation.participantSubtitle || t("chat.defaultCounterpart")}
      messages={conversation.messages}
      isRealtimeConnected={isRealtimeConnected}
      draft={draft}
      sending={sending}
      clearing={clearing}
      clearingMessageIds={clearingMessageIds}
      wasCleared={Boolean(conversation.clearedAt && conversation.messages.length === 0)}
      success={success}
      error={error}
      onDraftChange={setDraft}
      onSubmit={handleSubmit}
      onClearConversation={handleClearConversation}
      onClearMessages={handleClearMessages}
    />
  );
}
