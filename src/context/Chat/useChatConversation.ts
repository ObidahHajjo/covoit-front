import { type FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getConversation, sendConversationMessage } from "../../features/chat/chatApi";
import { markConversationRead, syncConversationUnread } from "../../features/chat/chatReadState";
import { useChatRealtime } from "../../features/chat/useChatRealtime";
import type { ChatConversation } from "../../types/Chat";

export function useChatConversation() {
  const { conversationId } = useParams();
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isSilent = false) => {
    if (!conversationId) {
      setLoading(false);
      setError("Conversation not found");
      return;
    }

    try {
      if (!isSilent) {
        setLoading(true);
      }
      setError(null);
      const nextConversation = await getConversation(Number(conversationId));
      setConversation(nextConversation);
      syncConversationUnread(
        nextConversation.id,
        nextConversation.updatedAt,
        nextConversation.latestMessage?.id,
        nextConversation.latestMessage?.sender,
      );
      markConversationRead(nextConversation.id, nextConversation.updatedAt, nextConversation.latestMessage?.id);
    } catch (err) {
      setConversation(null);
      setError(err instanceof Error ? err.message : "Failed to load conversation");
    } finally {
      if (!isSilent) {
        setLoading(false);
      }
    }
  }, [conversationId]);

  useEffect(() => {
    void load();

    const interval = window.setInterval(() => {
      void load(true);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [load]);

  const { isRealtimeConnected } = useChatRealtime(
    conversationId ? `chat.conversation.${conversationId}` : null,
    () => {
      void load(true);
    },
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!conversationId || !conversation) return;

    const content = draft.trim();
    if (!content) return;

    try {
      setError(null);
      setSuccess(null);
      setSending(true);

      const created = await sendConversationMessage(Number(conversationId), content);

      setConversation((prev) => {
        if (!prev) return prev;

        markConversationRead(prev.id, created.createdAt, created.id);

        return {
          ...prev,
          updatedAt: created.createdAt,
          latestMessage: created,
          messages: [...prev.messages, created],
        };
      });

      setDraft("");
      setSuccess("Message sent in chat.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  }

  return {
    conversation,
    loading,
    draft,
    setDraft,
    sending,
    success,
    error,
    handleSubmit,
    isRealtimeConnected,
  };
}
