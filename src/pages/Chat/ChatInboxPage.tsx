import PageLoadingState from "../../components/common/PageLoadingState";
import { ChatInboxSection } from "../../components/ui/ChatInboxSection";
import { useChatInbox } from "../../context/Chat/useChatInbox";

export default function ChatInboxPage() {
  const { conversations, loading, error, isRealtimeConnected } = useChatInbox();

  if (loading) {
    return <PageLoadingState title="Loading your chats" />;
  }

  return <ChatInboxSection conversations={conversations} error={error} isRealtimeConnected={isRealtimeConnected} />;
}
