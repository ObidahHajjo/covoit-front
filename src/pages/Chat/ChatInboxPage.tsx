import PageLoadingState from "../../components/common/PageLoadingState";
import { ChatInboxSection } from "../../components/ui/ChatInboxSection";
import { useChatInbox } from "../../context/Chat/useChatInbox";

/**
 * Render the chat inbox page listing the user's conversations and realtime connection state.
 *
 * @returns The inbox conversation list or a loading state while conversations are being fetched.
 */
export default function ChatInboxPage() {
  const { conversations, loading, error, isRealtimeConnected } = useChatInbox();

  if (loading) {
    return <PageLoadingState title="Loading your chats" />;
  }

  return <ChatInboxSection conversations={conversations} error={error} isRealtimeConnected={isRealtimeConnected} />;
}
