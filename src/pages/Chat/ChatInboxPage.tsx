import PageLoadingState from "../../components/common/PageLoadingState";
import { ChatInboxSection } from "../../components/ui/ChatInboxSection";
import { useChatInbox } from "../../context/Chat/useChatInbox";
import { useI18n } from "../../i18n/I18nProvider";

/**
 * Render the chat inbox page listing the user's conversations and realtime connection state.
 *
 * @returns The inbox conversation list or a loading state while conversations are being fetched.
 */
export default function ChatInboxPage() {
  const { t } = useI18n();
  const { conversations, loading, error, isRealtimeConnected } = useChatInbox();

  if (loading) {
    return <PageLoadingState title={t("loading.chats")} />;
  }

  return <ChatInboxSection conversations={conversations} error={error} isRealtimeConnected={isRealtimeConnected} />;
}
