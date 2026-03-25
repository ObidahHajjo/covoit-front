import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import FloatingToast from "../../common/FloatingToast";
import { useI18n } from "../../../i18n/I18nProvider";
import { formatLocaleTime } from "../../../i18n/config";
import type { ChatMessage } from "../../../types/Chat";
import type { ConnectionStatus } from "../../../hooks/Support/useSupportChat";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  draft: string;
  selectedFiles: File[];
  sending: boolean;
  connectionStatus: ConnectionStatus;
  isAdminTyping: boolean;
  success: string | null;
  error: string | null;
  onDraftChange: (value: string) => void;
  onSelectedFilesChange: (files: File[]) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function ConnectionIndicator({ status }: { status: ConnectionStatus }) {
  const { t } = useI18n();

  const statusConfig = {
    connecting: { color: "bg-amber-400", label: t("supportChat.connecting") },
    connected: { color: "bg-green-500", label: t("supportChat.connected") },
    disconnected: { color: "bg-red-500", label: t("supportChat.disconnected") },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${config.color}`} />
      <span className="text-xs font-medium text-[var(--theme-muted)]">{config.label}</span>
    </div>
  );
}

function TypingIndicator() {
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="flex gap-1">
        <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--theme-muted)]" style={{ animationDelay: "0ms" }} />
        <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--theme-muted)]" style={{ animationDelay: "150ms" }} />
        <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--theme-muted)]" style={{ animationDelay: "300ms" }} />
      </div>
      <span className="text-xs text-[var(--theme-muted)]">{t("supportChat.adminTyping")}</span>
    </div>
  );
}

export function SupportChatWidget(props: Props) {
  const { t } = useI18n();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(props.isOpen);

  useEffect(() => {
    if (props.isOpen) {
      setIsVisible(true);
    }
  }, [props.isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [props.messages, props.isAdminTyping]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => props.onClose(), 300);
  };

  const formatFileSize = (sizeBytes: number) => {
    if (sizeBytes < 1024) return `${sizeBytes} B`;
    if (sizeBytes < 1024 * 1024) return `${(sizeBytes / 1024).toFixed(1)} KB`;
    return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFiles = Array.from(event.target.files ?? []);
    if (nextFiles.length === 0) return;
    props.onSelectedFilesChange([...props.selectedFiles, ...nextFiles].slice(0, 5));
    event.target.value = "";
  };

  const removeSelectedFile = (index: number) => {
    props.onSelectedFilesChange(props.selectedFiles.filter((_, fileIndex) => fileIndex !== index));
  };

  const renderAttachments = (attachments: ChatMessage["attachments"] | undefined, isMine: boolean) => {
    if (!attachments || attachments.length === 0) return null;

    return (
      <div className="mt-2 grid gap-1.5">
        {attachments.map((attachment) => (
          <a
            key={attachment.id}
            href={attachment.url}
            target="_blank"
            rel="noreferrer"
            className={`rounded-lg px-2 py-1.5 text-xs transition ${
              isMine
                ? "border border-white/30 bg-white/10 text-white hover:bg-white/15"
                : "border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] text-[var(--theme-ink)] hover:bg-[var(--theme-surface)]"
            }`}
          >
            <span className="block truncate font-medium">{attachment.name}</span>
            <span className={`block text-[10px] ${isMine ? "text-white/70" : "text-[var(--theme-muted)]"}`}>
              {formatFileSize(attachment.sizeBytes)}
            </span>
          </a>
        ))}
      </div>
    );
  };

  if (!isVisible && !props.isOpen) return null;

  return (
    <div
      className={`fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-[var(--theme-line)] bg-[var(--theme-surface)] shadow-[0_24px_48px_-12px_rgba(15,23,42,0.35)] transition-all duration-300 ${
        props.isOpen && isVisible
          ? "bottom-20 right-2 left-2 h-[calc(100dvh-5.5rem)] translate-y-0 opacity-100 sm:bottom-6 sm:left-auto sm:right-6 sm:h-[70vh] sm:max-h-[600px] sm:w-[380px]"
          : "bottom-20 right-2 h-0 w-[calc(100vw-1rem)] max-w-[380px] translate-y-4 opacity-0 sm:bottom-6 sm:right-6 sm:w-[380px]"
      }`}
    >
      <div className="flex flex-col overflow-hidden rounded-t-2xl bg-[linear-gradient(135deg,rgba(212,233,197,0.42),rgba(255,255,255,0.92))]">
        <div className="flex items-center justify-between border-b border-[var(--theme-line)] px-4 py-3">
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-[var(--theme-ink)]">{t("supportChat.title")}</h3>
            <ConnectionIndicator status={props.connectionStatus} />
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-1.5 text-[var(--theme-muted)] transition hover:bg-[var(--theme-bg-soft)] hover:text-[var(--theme-ink)]"
            aria-label={t("common.close")}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-[rgba(246,248,245,0.86)] px-3 py-3">
        <FloatingToast tone="success" message={props.success} durationMs={4000} />
        <FloatingToast tone="error" message={props.error} durationMs={4000} />

        {props.messages.length === 0 ? (
          <div className="flex h-full min-h-[180px] items-center justify-center">
            <div className="rounded-xl border border-dashed border-[var(--theme-line)] bg-white/60 px-4 py-4 text-center">
              <p className="text-sm font-medium text-[var(--theme-ink)]">{t("supportChat.welcome")}</p>
              <p className="mt-1 text-xs text-[var(--theme-muted)]">{t("supportChat.welcomeBody")}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {props.messages.map((message) => {
              const isMine = message.sender === "me";

              return (
                <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 shadow-sm ${
                      isMine
                        ? "rounded-br-md bg-[var(--theme-primary)] text-white"
                        : "rounded-bl-md border border-[var(--theme-line)] bg-[var(--theme-surface)] text-[var(--theme-ink)]"
                    }`}
                  >
                    {message.body ? <p className="text-sm leading-5">{message.body}</p> : null}
                    {renderAttachments(message.attachments, isMine)}
                    <p className={`mt-1 text-[10px] font-medium ${isMine ? "text-white/70" : "text-[var(--theme-muted)]"}`}>
                      {formatLocaleTime(message.createdAt, undefined, t("common.now"))}
                    </p>
                  </div>
                </div>
              );
            })}
            {props.isAdminTyping ? <TypingIndicator /> : null}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form onSubmit={props.onSubmit} className="border-t border-[var(--theme-line)] bg-[var(--theme-surface)] p-3">
        {props.selectedFiles.length > 0 ? (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {props.selectedFiles.map((file, index) => (
              <span
                key={`${file.name}-${file.size}-${index}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-2 py-1 text-xs font-medium text-[var(--theme-ink)]"
              >
                <span className="max-w-[8rem] truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeSelectedFile(index)}
                  className="rounded-full text-[var(--theme-muted)] transition hover:text-[var(--theme-ink)]"
                >
                  x
                </button>
              </span>
            ))}
          </div>
        ) : null}

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="sr-only">{t("common.message")}</label>
            <textarea
              value={props.draft}
              onChange={(event) => props.onDraftChange(event.target.value)}
              rows={1}
              placeholder={t("supportChat.inputPlaceholder")}
              className="w-full resize-none rounded-xl border border-[var(--theme-line)] bg-[rgba(246,248,245,0.86)] px-3 py-2 text-sm text-[var(--theme-ink)] outline-none transition placeholder:text-[var(--theme-subtle)] focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[rgba(82,100,72,0.12)]"
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  if (props.draft.trim() || props.selectedFiles.length > 0) {
                    const form = event.currentTarget.form;
                    if (form) {
                      form.requestSubmit();
                    }
                  }
                }
              }}
            />
          </div>
          <div className="flex gap-1.5">
            <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-[var(--theme-line)] bg-[var(--theme-surface)] p-2 transition hover:border-[var(--theme-line-strong)]">
              <input type="file" multiple className="hidden" onChange={handleFileSelection} />
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-[var(--theme-muted-strong)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.49" />
              </svg>
            </label>
            <button
              type="submit"
              disabled={props.sending || (props.draft.trim().length === 0 && props.selectedFiles.length === 0)}
              className="inline-flex items-center justify-center rounded-full bg-[var(--theme-primary)] p-2 text-white transition hover:bg-[var(--theme-primary-dim)] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={t("common.send")}
            >
              {props.sending ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export function SupportChatTrigger(props: { onClick: () => void; hasUnread?: boolean }) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={props.onClick}
      className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--theme-primary)] text-white shadow-[0_8px_24px_-4px_rgba(82,100,72,0.5)] transition hover:bg-[var(--theme-primary-dim)] sm:bottom-6 sm:right-6"
      aria-label={t("supportChat.openChat")}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
      {props.hasUnread ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          !
        </span>
      ) : null}
    </button>
  );
}
