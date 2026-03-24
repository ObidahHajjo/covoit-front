import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  fetchAdminSession,
  getAdminMessages,
  adminSendMessage,
  adminCloseSession,
  adminMarkAsRead,
  adminSetTyping,
  type AdminSupportSession,
} from "../../features/admin/useAdminSupportChatApi";
import { useAdminSessionRealtime } from "../../features/admin/useAdminSessionRealtime";
import { translate } from "../../i18n/config";
import type { ChatMessage } from "../../types/Chat";

export type ConnectionStatus = "connecting" | "connected" | "disconnected";

export function useAdminSupportChat(sessionId: number | null) {
  const [session, setSession] = useState<AdminSupportSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [closing, setClosing] = useState(false);
  const typingTimeoutRef = useRef<number | null>(null);
  const typingDebounceRef = useRef<number | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!sessionId) return;
    try {
      if (!silent) {
        setLoading(true);
        setConnectionStatus("connecting");
      }
      setError(null);
      const [sessionData, msgs] = await Promise.all([
        fetchAdminSession(sessionId),
        getAdminMessages(sessionId),
      ]);
      setSession(sessionData);
      setMessages(msgs);
      setConnectionStatus("connected");
      void adminMarkAsRead(sessionId);
    } catch (err) {
      setConnectionStatus("disconnected");
      setError(err instanceof Error ? err.message : translate("chat.loadFailed"));
    } finally {
      if (!silent) setLoading(false);
    }
  }, [sessionId]);

  useAdminSessionRealtime(sessionId, (event) => {
    const typed = event as { type?: string; data?: { message?: ChatMessage; typing?: boolean; is_admin?: boolean } };
    if (typed.type === "message.sent" && typed.data?.message) {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === typed.data!.message!.id);
        if (exists) return prev;
        return [...prev, typed.data!.message!];
      });
      void adminMarkAsRead(sessionId!);
    }
    if (typed.type === "typing" && typed.data) {
      const isAdmin = typed.data.is_admin;
      if (!isAdmin) {
        setIsUserTyping(!!typed.data.typing);
        if (typed.data.typing) {
          if (typingTimeoutRef.current !== null) {
            window.clearTimeout(typingTimeoutRef.current);
          }
          typingTimeoutRef.current = window.setTimeout(() => {
            setIsUserTyping(false);
          }, 3000);
        }
      }
    }
  });

  useEffect(() => {
    void load();
  }, [load]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!sessionId) return;

      const content = draft.trim();
      if (!content && selectedFiles.length === 0) return;

      try {
        setError(null);
        setSending(true);
        const created = await adminSendMessage(sessionId, content, selectedFiles);
        setMessages((prev) => [...prev, created]);
        setDraft("");
        setSelectedFiles([]);
      } catch (err) {
        setError(err instanceof Error ? err.message : translate("supportChat.sendFailed"));
      } finally {
        setSending(false);
      }
    },
    [sessionId, draft, selectedFiles]
  );

  const handleCloseSession = useCallback(async () => {
    if (!sessionId) return;
    try {
      setClosing(true);
      setError(null);
      await adminCloseSession(sessionId);
      setSession((prev) => (prev ? { ...prev, status: "closed" } : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to close session");
    } finally {
      setClosing(false);
    }
  }, [sessionId]);

  const handleTyping = useCallback(() => {
    if (!sessionId) return;
    if (typingDebounceRef.current !== null) {
      window.clearTimeout(typingDebounceRef.current);
    }
    typingDebounceRef.current = window.setTimeout(() => {
      void adminSetTyping(sessionId, true);
      typingDebounceRef.current = window.setTimeout(() => {
        void adminSetTyping(sessionId, false);
      }, 2000);
    }, 300);
  }, [sessionId]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current !== null) {
        window.clearTimeout(typingTimeoutRef.current);
      }
      if (typingDebounceRef.current !== null) {
        window.clearTimeout(typingDebounceRef.current);
      }
    };
  }, []);

  return {
    session,
    messages,
    loading,
    draft,
    setDraft,
    selectedFiles,
    setSelectedFiles,
    sending,
    error,
    connectionStatus,
    isUserTyping,
    closing,
    handleCloseSession,
    handleSubmit,
    handleTyping,
    refresh: load,
  };
}
