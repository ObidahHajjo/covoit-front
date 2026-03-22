import { type FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { clearConversation, clearConversationMessages, getConversation, sendConversationMessage } from "../../features/chat/chatApi";
import { markConversationRead, syncConversationUnread } from "../../features/chat/chatReadState";
import { useChatRealtime } from "../../features/chat/useChatRealtime";
import type { ChatConversation } from "../../types/Chat";
import { translate } from "../../i18n/config";
import { useI18n } from "../../i18n/I18nProvider";

/**
 * Manages a single chat conversation, including polling, realtime refresh, and sending.
 *
 * @returns Conversation state and handlers for the active chat thread.
 */
export function useChatConversation() {
  const { t } = useI18n();
  const { conversationId } = useParams();
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [clearingMessageIds, setClearingMessageIds] = useState<number[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Loads the active conversation and synchronizes its unread state.
   *
   * @param isSilent - Whether to refresh without showing the full loading state.
   * @returns A promise that resolves once the conversation state has been updated.
   */
  const load = useCallback(async (isSilent = false) => {
    if (!conversationId) {
      setLoading(false);
      setError(translate("chat.conversationNotFound"));
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
      setError(err instanceof Error ? err.message : translate("chat.loadFailed"));
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

  /**
   * Sends the current draft to the active conversation.
   *
   * @param event - Form submission event from the chat composer.
   * @returns A promise that resolves once the send flow completes.
   */
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
          clearedAt: prev.clearedAt,
          latestMessage: created,
          messages: [...prev.messages, created],
        };
      });

      setDraft("");
      setSuccess(translate("chat.messageSent"));
    } catch (err) {
      setError(err instanceof Error ? err.message : translate("chat.sendFailed"));
    } finally {
      setSending(false);
    }
  }

  /**
   * Clears the current conversation only for the authenticated user.
   *
   * @returns A promise that resolves when the conversation has been cleared locally.
   */
  async function handleClearConversation() {
    if (!conversationId || !conversation) return;

    if (!window.confirm(t("chat.clearConfirm"))) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      setClearing(true);

      const result = await clearConversation(Number(conversationId));
      setConversation(result.conversation);
      syncConversationUnread(
        result.conversation.id,
        result.conversation.updatedAt,
        result.conversation.latestMessage?.id,
        result.conversation.latestMessage?.sender,
      );
      markConversationRead(result.conversation.id, result.conversation.updatedAt, result.conversation.latestMessage?.id);
      setSuccess(result.message || t("chat.clearSuccess"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("chat.clearFailed"));
    } finally {
      setClearing(false);
    }
  }

  /**
   * Clears a single message only for the authenticated user.
   *
   * @param messageId - Identifier of the message to hide in the current conversation.
   * @returns A promise that resolves after the message is cleared locally.
   */
  async function handleClearMessages(messageIds: number[]) {
    if (!conversationId || !conversation) return;
    if (messageIds.length === 0) return;

    if (!window.confirm(t("chat.clearMessageConfirm", { count: messageIds.length }))) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      setClearingMessageIds(messageIds);

      const result = await clearConversationMessages(Number(conversationId), messageIds);
      setConversation(result.conversation);
      syncConversationUnread(
        result.conversation.id,
        result.conversation.updatedAt,
        result.conversation.latestMessage?.id,
        result.conversation.latestMessage?.sender,
      );
      markConversationRead(result.conversation.id, result.conversation.updatedAt, result.conversation.latestMessage?.id);
      setSuccess(result.message || t("chat.clearMessageSuccess"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("chat.clearMessageFailed"));
    } finally {
      setClearingMessageIds([]);
    }
  }

  return {
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
  };
}
