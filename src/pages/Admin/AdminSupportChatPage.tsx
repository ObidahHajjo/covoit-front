import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminSupportChat } from "../../hooks/Admin/useAdminSupportChat";
import { useI18n } from "../../i18n/I18nProvider";
import { AdminChatMessage } from "../../components/ui/Admin/Support/AdminChatMessage";
import { AdminChatInput } from "../../components/ui/Admin/Support/AdminChatInput";
import FloatingToast from "../../components/common/FloatingToast";

export default function AdminSupportChatPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { sessionId: rawSessionId } = useParams<{ sessionId: string }>();
  const sessionId = rawSessionId ? Number(rawSessionId) : null;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
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
  } = useAdminSupportChat(sessionId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isUserTyping]);

  const userName = session?.user?.name ?? session?.user?.email ?? t("admin.unknownUser");
  const isActive = session?.status === "active";
  const isClosed = session?.status === "closed";

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[var(--theme-coral)] border-t-transparent" />
          <p className="mt-3 text-sm text-gray-500">{t("admin.loadingSession")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-xl border border-[var(--theme-line)] bg-white shadow-sm">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--theme-line)] px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/support")}
            className="rounded-full p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label={t("admin.backToInbox")}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-sm font-semibold text-gray-800">{userName}</h2>
            <div className="flex items-center gap-1.5">
              <span
                className={`h-2 w-2 rounded-full ${connectionStatus === "connected" ? "bg-green-500" : connectionStatus === "connecting" ? "bg-amber-400" : "bg-red-500"
                  }`}
              />
              <span className="text-xs text-gray-400">
                {connectionStatus === "connected"
                  ? t("supportChat.connected")
                  : connectionStatus === "connecting"
                    ? t("supportChat.connecting")
                    : t("supportChat.disconnected")}
              </span>
            </div>
          </div>
        </div>

        {(isActive || session?.status === "waiting") && (
          <button
            type="button"
            onClick={handleCloseSession}
            disabled={closing}
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {closing ? t("admin.closing") : t("admin.closeSession")}
          </button>
        )}
      </div>

      {/* User Info Bar */}
      {session?.user && (
        <div className="shrink-0 border-b border-[var(--theme-line)] bg-gray-50 px-4 py-2">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{t("admin.email")}: {session.user.email}</span>
            {session.subject && <span>{t("admin.subject")}: {session.subject}</span>}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50/50 px-4 py-3">
        <FloatingToast tone="error" message={error} durationMs={4000} />

        {isClosed && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-700">
            {t("admin.sessionClosed")}
          </div>
        )}

        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="rounded-xl border border-dashed border-gray-300 bg-white/60 px-4 py-4 text-center">
              <p className="text-sm font-medium text-gray-600">{t("admin.noMessagesYet")}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message) => (
              <AdminChatMessage key={message.id} message={message} />
            ))}
            {isUserTyping && !isClosed && (
              <div className="flex items-center gap-2 px-1 py-1">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-xs text-gray-400">{t("admin.userTyping")}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      {!isClosed && (
        <AdminChatInput
          draft={draft}
          selectedFiles={selectedFiles}
          sending={sending}
          disabled={!isActive}
          onDraftChange={setDraft}
          onSelectedFilesChange={setSelectedFiles}
          onSubmit={handleSubmit}
          onTyping={handleTyping}
        />
      )}
    </div>
  );
}
