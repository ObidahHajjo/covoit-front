import { useEffect, useRef, useState, type FormEvent } from "react";
import FloatingToast from "../common/FloatingToast";
import type { ChatMessage } from "../../types/Chat";
import { useI18n } from "../../i18n/I18nProvider";
import { formatLocaleTime } from "../../i18n/config";

type ConfirmDialogState =
  | { kind: null }
  | { kind: "conversation" }
  | { kind: "messages"; messageIds: number[] };

type Props = {
  title: string;
  subtitle: string;
  counterpartLabel: string;
  messages: ChatMessage[];
  isRealtimeConnected?: boolean;
  draft: string;
  sending: boolean;
  clearing?: boolean;
  clearingMessageIds?: number[];
  wasCleared?: boolean;
  success: string | null;
  error: string | null;
  onDraftChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClearConversation?: () => void;
  onClearMessages?: (messageIds: number[]) => void;
};

/**
 * Display a conversation thread with a message composer.
 *
 * @param props - Component props for the live chat screen.
 * @param props.title - Main conversation title.
 * @param props.subtitle - Supporting copy shown under the title.
 * @param props.counterpartLabel - Label describing the other participant.
 * @param props.messages - Messages currently shown in the thread.
 * @param props.isRealtimeConnected - Whether realtime updates are connected.
 * @param props.draft - Current draft message text.
 * @param props.sending - Whether a send action is in progress.
 * @param props.clearing - Whether the clear action is in progress.
 * @param props.clearingMessageIds - Identifiers of the messages currently being cleared.
 * @param props.wasCleared - Whether the visible history was previously cleared for this user.
 * @param props.success - Optional success message shown in a toast.
 * @param props.error - Optional error message shown in a toast.
 * @param props.onDraftChange - Callback fired when the draft changes.
 * @param props.onSubmit - Form submit handler for sending a message.
 * @param props.onClearConversation - Optional callback used to clear the conversation locally.
 * @param props.onClearMessages - Optional callback used to clear selected messages locally.
 * @returns The rendered live chat screen.
 */
export function LiveChatSection({
  title,
  subtitle,
  counterpartLabel,
  messages,
  isRealtimeConnected = false,
  draft,
  sending,
  clearing = false,
  clearingMessageIds = [],
  wasCleared = false,
  success,
  error,
  onDraftChange,
  onSubmit,
  onClearConversation,
  onClearMessages,
}: Props) {
  const { t } = useI18n();
  const [selectedMessageIds, setSelectedMessageIds] = useState<number[]>([]);
  const [selectionBarTop, setSelectionBarTop] = useState(16);
  const [selectionBarRect, setSelectionBarRect] = useState({ left: 8, width: 320 });
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [copyFeedbackTone, setCopyFeedbackTone] = useState<"success" | "error">("success");
  const [isTouchSelectionMode, setIsTouchSelectionMode] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({ kind: null });
  const longPressTimerRef = useRef<number | null>(null);
  const longPressTriggeredRef = useRef(false);

  useEffect(() => {
    if (clearingMessageIds.length === 0) {
      return;
    }

    setSelectedMessageIds(clearingMessageIds);
  }, [clearingMessageIds]);

  useEffect(() => {
    if (selectedMessageIds.length === 0) {
      return;
    }

    setSelectedMessageIds((current) =>
      current.filter((messageId) => messages.some((message) => message.id === messageId)),
    );
  }, [messages, selectedMessageIds.length]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(pointer: coarse)");

    /**
     * Syncs selection interactions with the current pointer mode.
     *
     * @returns Nothing.
     */
    const updateMode = () => setIsTouchSelectionMode(mediaQuery.matches);

    updateMode();
    mediaQuery.addEventListener("change", updateMode);

    return () => mediaQuery.removeEventListener("change", updateMode);
  }, []);

  useEffect(() => {
    if (confirmDialog.kind === null) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setConfirmDialog({ kind: null });
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [confirmDialog.kind]);

  useEffect(() => {
    /**
     * Aligns the floating multi-selection action bar with the visible chat area.
     *
     * @returns Nothing.
     */
    const updateSelectionBarTop = () => {
      const header = document.getElementById("app-shell-header");
      const messageSection = document.getElementById("live-chat-messages");
      const messageSectionTop = messageSection?.getBoundingClientRect().top ?? 0;
      const messageSectionRect = messageSection?.getBoundingClientRect();

      const chatTopOffset = messageSectionTop > 0 ? messageSectionTop + 12 : 12;

      if (messageSectionRect) {
        setSelectionBarRect({
          left: messageSectionRect.left,
          width: messageSectionRect.width,
        });
      }

      if (!header) {
        setSelectionBarTop(chatTopOffset);
        return;
      }

      const rect = header.getBoundingClientRect();
      const headerTopOffset = rect.bottom > 0 ? rect.bottom + 12 : 12;
      const nextTop = Math.max(headerTopOffset, chatTopOffset);
      setSelectionBarTop(nextTop);
    };

    updateSelectionBarTop();
    window.addEventListener("scroll", updateSelectionBarTop, { passive: true });
    window.addEventListener("resize", updateSelectionBarTop);

    return () => {
      window.removeEventListener("scroll", updateSelectionBarTop);
      window.removeEventListener("resize", updateSelectionBarTop);
    };
  }, []);

  /**
   * Add or remove a message from the current multi-selection.
   *
   * @param messageId - Message identifier to toggle.
   * @returns Nothing.
   */
  const toggleMessageSelection = (messageId: number) => {
    setSelectedMessageIds((current) =>
      current.includes(messageId)
        ? current.filter((id) => id !== messageId)
        : [...current, messageId],
    );
  };

  /**
   * Start long-press selection on touch devices.
   *
   * @param messageId - Message identifier to select after the hold delay.
   * @returns Nothing.
   */
  const startLongPressSelection = (messageId: number) => {
    if (!isTouchSelectionMode) {
      return;
    }

    longPressTriggeredRef.current = false;
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
    }

    longPressTimerRef.current = window.setTimeout(() => {
      longPressTriggeredRef.current = true;
      toggleMessageSelection(messageId);
    }, 450);
  };

  /**
   * Cancel any in-flight long-press timer.
   *
   * @returns Nothing.
   */
  const clearLongPressSelection = () => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  /**
   * Toggle message selection when the message bubble is clicked or tapped.
   *
   * @param messageId - Message identifier associated with the clicked bubble.
   * @returns Nothing.
   */
  const handleMessageClick = (messageId: number) => {
    if (!onClearMessages) {
      return;
    }

    if (isTouchSelectionMode && selectedMessageIds.length === 0) {
      if (longPressTriggeredRef.current) {
        longPressTriggeredRef.current = false;
      }
      return;
    }

    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }

    toggleMessageSelection(messageId);
  };

  /**
   * Copy the currently selected message body to the clipboard.
   *
   * @returns A promise that resolves after the copy attempt completes.
   */
  const handleCopySelectedMessage = async () => {
    if (selectedMessageIds.length !== 1) {
      return;
    }

    const selectedMessage = messages.find((message) => message.id === selectedMessageIds[0]);
    if (!selectedMessage) {
      return;
    }

    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(selectedMessage.body);
      } else {
        const helper = document.createElement("textarea");
        helper.value = selectedMessage.body;
        helper.setAttribute("readonly", "true");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        helper.style.pointerEvents = "none";
        document.body.appendChild(helper);
        helper.focus();
        helper.select();

        const copied = document.execCommand("copy");
        document.body.removeChild(helper);

        if (!copied) {
          throw new Error("copy_failed");
        }
      }

      setCopyFeedbackTone("success");
      setCopyFeedback(t("chat.copySuccess"));
    } catch {
      setCopyFeedbackTone("error");
      setCopyFeedback(t("chat.copyFailed"));
    }
  };

  const handleConfirmAction = () => {
    if (confirmDialog.kind === "conversation") {
      setConfirmDialog({ kind: null });
      void onClearConversation?.();
      return;
    }

    if (confirmDialog.kind === "messages") {
      const { messageIds } = confirmDialog;
      setConfirmDialog({ kind: null });
      void onClearMessages?.(messageIds);
    }
  };

  const confirmTitle =
    confirmDialog.kind === "conversation"
      ? t("chat.clearConversation")
      : t("chat.clearSelectedMessages");
  const confirmDescription =
    confirmDialog.kind === "conversation"
      ? t("chat.clearConfirm")
      : t("chat.clearMessageConfirm", {
          count: confirmDialog.kind === "messages" ? confirmDialog.messageIds.length : 0,
        });
  const confirmButtonLabel =
    confirmDialog.kind === "conversation"
      ? t("chat.clearConversation")
      : t("chat.clearSelectedMessages");
  const isConfirmSubmitting = clearing || clearingMessageIds.length > 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-0">
      <FloatingToast tone="success" message={success} durationMs={6500} />
      <FloatingToast tone="error" message={error} durationMs={6500} />
      <FloatingToast tone={copyFeedbackTone} message={copyFeedback} durationMs={5000} />

      <section className="overflow-hidden rounded-[24px] border border-[var(--theme-line)] bg-[var(--theme-surface)] shadow-[var(--theme-shadow-warm)]">
        <div className="border-b border-[var(--theme-line)] bg-[linear-gradient(135deg,rgba(212,233,197,0.42),rgba(255,255,255,0.92))] px-5 py-6 sm:px-7 sm:py-7">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--theme-muted)]">
            {t("chat.conversation")}
          </p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-medium leading-tight text-[var(--theme-ink)] sm:text-4xl">
                {title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--theme-muted-strong)] sm:text-base">
                {subtitle}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--theme-line)] bg-[rgba(255,255,255,0.85)] px-3 py-1.5 text-xs font-medium text-[var(--theme-muted-strong)]">
                <span
                  className={`h-2 w-2 rounded-full ${isRealtimeConnected ? "bg-green-500" : "bg-amber-400"}`}
                />
                {isRealtimeConnected ? t("common.connected") : t("common.updating")}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3">
              {onClearConversation ? (
                <button
                  type="button"
                  onClick={() => setConfirmDialog({ kind: "conversation" })}
                  disabled={clearing}
                  className="rounded-full border border-[var(--theme-line)] bg-[rgba(255,255,255,0.85)] px-4 py-2 text-sm font-medium text-[var(--theme-muted-strong)] transition hover:border-[var(--theme-line-strong)] hover:text-[var(--theme-ink)] disabled:opacity-50"
                >
                  {clearing ? t("chat.clearing") : t("chat.clearConversation")}
                </button>
              ) : null}
              <div className="rounded-full border border-[var(--theme-line)] bg-[rgba(255,255,255,0.85)] px-4 py-2 text-sm font-medium text-[var(--theme-ink)]">
                {counterpartLabel}
              </div>
            </div>
          </div>
        </div>

        <div className="flex min-h-[58vh] flex-col">
          <div
            id="live-chat-messages"
            className="flex-1 space-y-4 bg-[rgba(246,248,245,0.86)] px-4 py-5 sm:px-6 sm:py-6"
          >
            {selectedMessageIds.length > 0 && onClearMessages ? (
              <>
                <div className="h-[128px] sm:h-[118px] lg:h-[126px]" aria-hidden="true" />
                <div
                  className="fixed z-30 flex flex-col gap-3 rounded-2xl border border-[var(--theme-line)] bg-[rgba(255,255,255,0.96)] px-3 py-3 shadow-[0_16px_34px_-24px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-4"
                  style={{
                    top: `${selectionBarTop}px`,
                    left: `${selectionBarRect.left}px`,
                    width: `${selectionBarRect.width}px`,
                  }}
                >
                  <p className="text-center text-sm font-medium text-[var(--theme-ink)] sm:text-left">
                    {t("chat.messagesSelected", { count: selectedMessageIds.length })}
                  </p>
                  <div
                    className={`grid w-full gap-2 ${selectedMessageIds.length === 1 ? "grid-cols-3" : "grid-cols-2"} sm:flex sm:w-auto sm:flex-shrink-0 sm:items-center`}
                  >
                    {selectedMessageIds.length === 1 ? (
                      <button
                        type="button"
                        onClick={() => void handleCopySelectedMessage()}
                        className="rounded-full border border-[var(--theme-line)] bg-[var(--theme-surface)] px-3 py-2 text-xs font-medium text-[var(--theme-muted-strong)] transition hover:border-[var(--theme-line-strong)] hover:text-[var(--theme-ink)]"
                      >
                        {t("chat.copyMessage")}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setSelectedMessageIds([])}
                      className="rounded-full border border-[var(--theme-line)] bg-[var(--theme-surface)] px-3 py-2 text-xs font-medium text-[var(--theme-muted-strong)] transition hover:border-[var(--theme-line-strong)] hover:text-[var(--theme-ink)]"
                    >
                      {t("common.cancel")}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmDialog({ kind: "messages", messageIds: [...selectedMessageIds] })
                      }
                      disabled={clearingMessageIds.length > 0}
                      className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition hover:border-red-300 hover:bg-red-100 hover:text-red-800 disabled:opacity-50"
                    >
                      {clearingMessageIds.length > 0
                        ? t("chat.clearing")
                        : t("chat.clearSelectedMessages")}
                    </button>
                  </div>
                </div>
              </>
            ) : null}

            {messages.length === 0 ? (
              <div className="flex h-full min-h-[240px] items-center justify-center">
                <div className="rounded-2xl border border-dashed border-[var(--theme-line)] bg-[var(--theme-surface)] px-6 py-5 text-center">
                  <p className="text-sm font-medium text-[var(--theme-ink)]">
                    {wasCleared ? t("chat.cleared") : t("chat.noneYet")}
                  </p>
                  <p className="mt-2 text-sm text-[var(--theme-muted)]">
                    {wasCleared ? t("chat.clearedBody") : t("chat.noneYetBody")}
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => {
                if (message.sender === "system") {
                  return (
                    <div key={message.id} className="flex justify-center">
                      <div className="rounded-full border border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-2 text-xs font-medium text-[var(--theme-muted)]">
                        {message.body}
                      </div>
                    </div>
                  );
                }

                const isMine = message.sender === "me";

                return (
                  <div
                    key={message.id}
                    className={`-mx-2 rounded-2xl px-2 py-1.5 transition sm:-mx-3 sm:px-3 ${selectedMessageIds.includes(message.id) ? "bg-[rgba(82,100,72,0.08)]" : "bg-transparent"} ${isMine ? "flex justify-end" : "flex justify-start"}`}
                  >
                    <button
                      type="button"
                      onClick={() => handleMessageClick(message.id)}
                      onTouchStart={() => startLongPressSelection(message.id)}
                      onTouchEnd={clearLongPressSelection}
                      onTouchCancel={clearLongPressSelection}
                      onContextMenu={(event) => event.preventDefault()}
                      className={`relative max-w-[85%] text-left sm:max-w-[70%] ${onClearMessages ? "cursor-pointer" : "cursor-default"}`}
                    >
                      <div
                        className={`rounded-[20px] px-4 py-3 shadow-sm transition ${selectedMessageIds.includes(message.id) ? "ring-1 ring-[rgba(82,100,72,0.16)]" : ""} ${
                          isMine
                            ? "rounded-br-md bg-[var(--theme-primary)] text-white"
                            : "rounded-bl-md border border-[var(--theme-line)] bg-[var(--theme-surface)] text-[var(--theme-ink)]"
                        }`}
                      >
                        <p className="text-sm leading-6">{message.body}</p>
                        <div className="mt-2 flex items-center justify-between gap-3">
                          <p
                            className={`text-[11px] font-medium ${isMine ? "text-white/70" : "text-[var(--theme-muted)]"}`}
                          >
                            {formatLocaleTime(message.createdAt, undefined, t("common.now"))}
                          </p>
                          {onClearMessages ? (
                            <span
                              className={`text-[11px] font-medium ${selectedMessageIds.includes(message.id) ? (isMine ? "text-white/85" : "text-[var(--theme-ink)]") : isMine ? "text-white/60" : "text-[var(--theme-subtle)]"}`}
                            >
                              {selectedMessageIds.includes(message.id)
                                ? t("chat.selected")
                                : isTouchSelectionMode && selectedMessageIds.length === 0
                                  ? t("chat.longPressToSelect")
                                  : t("chat.tapToSelect")}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <form
            onSubmit={onSubmit}
            className="border-t border-[var(--theme-line)] bg-[var(--theme-surface)] p-4 sm:p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="flex-1">
                <span className="sr-only">{t("common.message")}</span>
                <textarea
                  value={draft}
                  onChange={(event) => onDraftChange(event.target.value)}
                  rows={3}
                  placeholder={t("chat.sendTo", { label: counterpartLabel.toLowerCase() })}
                  className="w-full resize-none rounded-2xl border border-[var(--theme-line)] bg-[rgba(246,248,245,0.86)] px-4 py-3 text-sm text-[var(--theme-ink)] outline-none transition placeholder:text-[var(--theme-subtle)] focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[rgba(82,100,72,0.12)]"
                />
              </label>
              <button
                type="submit"
                disabled={sending || draft.trim().length === 0}
                className="rounded-full bg-[var(--theme-primary)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--theme-primary-dim)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending ? t("common.sending") : t("common.send")}
              </button>
            </div>
          </form>
        </div>
      </section>

      {confirmDialog.kind !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.48)] px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-confirm-dialog-title"
          aria-describedby="chat-confirm-dialog-description"
          onClick={() => setConfirmDialog({ kind: null })}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-[rgba(255,255,255,0.6)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,248,245,0.96))] p-6 shadow-[0_28px_70px_-28px_rgba(15,23,42,0.55)] sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.16),transparent_70%)]"
              aria-hidden="true"
            />
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#fee2e2,#fecaca)] text-red-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M4 7h16" />
                  <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
                  <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
                </svg>
              </div>
              <h2
                id="chat-confirm-dialog-title"
                className="mt-5 text-2xl font-medium text-[var(--theme-ink)]"
              >
                {confirmTitle}
              </h2>
              <p
                id="chat-confirm-dialog-description"
                className="mt-3 text-sm leading-6 text-[var(--theme-muted-strong)] sm:text-[15px]"
              >
                {confirmDescription}
              </p>
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setConfirmDialog({ kind: null })}
                  className="rounded-full border border-[var(--theme-line)] bg-white/90 px-4 py-2.5 text-sm font-medium text-[var(--theme-muted-strong)] transition hover:border-[var(--theme-line-strong)] hover:text-[var(--theme-ink)]"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="button"
                  onClick={() => void handleConfirmAction()}
                  disabled={isConfirmSubmitting}
                  className="rounded-full bg-[linear-gradient(135deg,#dc2626,#b91c1c)] px-4 py-2.5 text-sm font-medium text-white shadow-[0_18px_34px_-18px_rgba(185,28,28,0.7)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isConfirmSubmitting ? t("chat.clearing") : confirmButtonLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
