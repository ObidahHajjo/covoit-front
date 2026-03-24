import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  closeSupportConversation,
  getOrCreateSupportConversation,
  getMessages,
  sendSupportMessage,
  type SupportConversation,
} from "../../features/chat/supportChatApi";
import { useSupportChatRealtime } from "../../features/chat/useSupportChatRealtime";
import { translate } from "../../i18n/config";
import type { ChatMessage } from "../../types/Chat";

export type ConnectionStatus = "connecting" | "connected" | "disconnected";

export function useSupportChat() {
  const [conversation, setConversation] = useState<SupportConversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const adminTypingTimeoutRef = useRef<number | null>(null);

  const load = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) {
        setLoading(true);
        setConnectionStatus("connecting");
      }
      setError(null);
      const result = await getOrCreateSupportConversation();
      const messages = await getMessages(result.id);
      setConversation({ ...result, messages });
      setConnectionStatus("connected");
    } catch (err) {
      setConnectionStatus("disconnected");
      setError(err instanceof Error ? err.message : translate("chat.loadFailed"));
    } finally {
      if (!isSilent) {
        setLoading(false);
      }
    }
  }, []);

  const { isRealtimeConnected } = useSupportChatRealtime(
    conversation ? conversation.id : null,
    (payload) => {
      const typedPayload = payload as { message?: ChatMessage; typing?: boolean };
      if (typedPayload.message) {
        setConversation((prev) => {
          if (!prev) return prev;
          const exists = prev.messages.some((m) => m.id === typedPayload.message!.id);
          if (exists) return prev;
          return {
            ...prev,
            messages: [...prev.messages, typedPayload.message!],
          };
        });
      }
      if (typeof typedPayload.typing === "boolean") {
        setIsAdminTyping(typedPayload.typing);
        if (typedPayload.typing) {
          if (adminTypingTimeoutRef.current !== null) {
            window.clearTimeout(adminTypingTimeoutRef.current);
          }
          adminTypingTimeoutRef.current = window.setTimeout(() => {
            setIsAdminTyping(false);
          }, 3000);
        }
      }
    }
  );

  useEffect(() => {
    setConnectionStatus(isRealtimeConnected ? "connected" : "connecting");
  }, [isRealtimeConnected]);

  const openChat = useCallback(async () => {
    setIsOpen(true);
    await load();
  }, [load]);

  const closeChat = useCallback(async () => {
    setIsOpen(false);
    if (conversation) {
      try {
        await closeSupportConversation(conversation.id);
      } catch {
        // Silently handle close errors
      }
    }
    setConversation(null);
    setDraft("");
    setSelectedFiles([]);
    setLoading(true);
    setConnectionStatus("connecting");
  }, [conversation]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!conversation) return;

    const content = draft.trim();
    if (!content && selectedFiles.length === 0) return;

    try {
      setError(null);
      setSuccess(null);
      setSending(true);

      const created = await sendSupportMessage(conversation.id, content, selectedFiles);

      setConversation((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...prev.messages, created],
        };
      });

      setDraft("");
      setSelectedFiles([]);
      setSuccess(translate("chat.messageSent"));
    } catch (err) {
      setError(err instanceof Error ? err.message : translate("chat.sendFailed"));
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    return () => {
      if (adminTypingTimeoutRef.current !== null) {
        window.clearTimeout(adminTypingTimeoutRef.current);
      }
    };
  }, []);

  return {
    conversation,
    loading,
    draft,
    setDraft,
    selectedFiles,
    setSelectedFiles,
    sending,
    success,
    error,
    connectionStatus,
    isAdminTyping,
    isOpen,
    openChat,
    closeChat,
    handleSubmit,
  };
}
