import { useCallback, useEffect, useMemo, useState } from "react";
import { listConversations } from "../../features/chat/chatApi";
import { CHAT_READ_EVENT, getConversationUnread } from "../../features/chat/chatReadState";
import { useChatRealtime } from "../../features/chat/useChatRealtime";
import { useAuth } from "../useAuth";
import type { ChatConversation } from "../../types/Chat";

export function useChatInbox() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      setError(null);
      setConversations(await listConversations());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chats");
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();

    const interval = window.setInterval(() => {
      void load(true);
    }, 8000);

    return () => window.clearInterval(interval);
  }, [load]);

  useEffect(() => {
    const handleReadChange = () => {
      setConversations((prev) => [...prev]);
    };

    window.addEventListener(CHAT_READ_EVENT, handleReadChange);
    return () => window.removeEventListener(CHAT_READ_EVENT, handleReadChange);
  }, []);

  const { isRealtimeConnected } = useChatRealtime(user?.person?.id ? `chat.user.${user.person.id}` : null, () => {
    void load(true);
  });

  const unreadCount = useMemo(
    () => conversations.filter((conversation) => getConversationUnread(conversation.id, conversation.updatedAt, conversation.latestMessage?.sender)).length,
    [conversations],
  );

  return {
    conversations,
    loading,
    error,
    unreadCount,
    isRealtimeConnected,
  };
}
