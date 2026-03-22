import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { ChatInboxContext } from "../context/Chat/ChatInboxContext";
import { listConversations } from "../features/chat/chatApi";
import {
  CHAT_READ_EVENT,
  getConversationUnread,
  getConversationUnreadCount,
  incrementConversationUnread,
  syncConversationUnread,
} from "../features/chat/chatReadState";
import { useChatRealtime } from "../features/chat/useChatRealtime";
import type { ChatConversation } from "../types/Chat";
import { useAuth } from "../context/useAuth";

/**
 * Provides chat inbox data, unread counters, and realtime connection state.
 *
 * @param props - Component props.
 * @param props.children - Descendant React nodes that consume inbox state.
 * @returns The chat inbox context provider wrapping the provided children.
 */
export function ChatInboxProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Loads the current user's conversations and synchronizes local unread metadata.
   *
   * @param isSilent - Whether to refresh without toggling the primary loading state.
   * @returns A promise that resolves once inbox state has been updated.
   */
  const load = useCallback(async (isSilent = false) => {
    if (!user?.person?.id) {
      setConversations([]);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      if (!isSilent) setLoading(true);
      setError(null);
      const nextConversations = await listConversations();
      nextConversations.forEach((conversation) => {
        syncConversationUnread(
          conversation.id,
          conversation.updatedAt,
          conversation.latestMessage?.id,
          conversation.latestMessage?.sender,
        );
      });
      setConversations(nextConversations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chats");
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [user?.person?.id]);

  useEffect(() => {
    void load();

    if (!user?.person?.id) {
      return;
    }

    const interval = window.setInterval(() => {
      void load(true);
    }, 8000);

    return () => window.clearInterval(interval);
  }, [load, user?.person?.id]);

  useEffect(() => {
    /**
     * Forces a shallow inbox refresh after persisted read-state changes.
     *
     * @returns Nothing.
     */
    const handleReadChange = () => {
      setConversations((prev) => [...prev]);
    };

    window.addEventListener(CHAT_READ_EVENT, handleReadChange);
    return () => window.removeEventListener(CHAT_READ_EVENT, handleReadChange);
  }, []);

  /**
   * Handles incoming realtime inbox events and refreshes unread counts defensively.
   *
   * @param payload - Broadcast payload emitted by the chat backend.
   * @returns Nothing.
   */
  const { isRealtimeConnected } = useChatRealtime(user?.person?.id ? `chat.user.${user.person.id}` : null, (payload) => {
    const messageSenderId = typeof payload === "object" && payload !== null && "message" in payload
      ? (payload as { message?: { sender_person_id?: number }; conversation_id?: number }).message?.sender_person_id
      : undefined;
    const conversationId = typeof payload === "object" && payload !== null && "conversation_id" in payload
      ? (payload as { conversation_id?: number }).conversation_id
      : undefined;

    if (conversationId && user?.person?.id && messageSenderId && messageSenderId !== user.person.id) {
      incrementConversationUnread(conversationId);
      setConversations((prev) => [...prev]);
    }

    void load(true);
  });

  const unreadCount = useMemo(
    () => conversations.reduce((total, conversation) => {
      if (getConversationUnread(
        conversation.id,
        conversation.updatedAt,
        conversation.latestMessage?.id,
        conversation.latestMessage?.sender,
      )) {
        return total + Math.max(getConversationUnreadCount(conversation.id), 1);
      }

      return total;
    }, 0),
    [conversations],
  );

  const value = useMemo(
    () => ({
      conversations,
      loading,
      error,
      unreadCount,
      isRealtimeConnected,
      reload: load,
    }),
    [conversations, loading, error, unreadCount, isRealtimeConnected, load],
  );

  return <ChatInboxContext.Provider value={value}>{children}</ChatInboxContext.Provider>;
}
