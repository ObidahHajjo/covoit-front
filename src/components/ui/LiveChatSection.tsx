import type { FormEvent } from "react";
import FloatingToast from "../common/FloatingToast";
import type { ChatMessage } from "../../types/Chat";
import { useI18n } from "../../i18n/I18nProvider";
import { formatLocaleTime } from "../../i18n/config";

type Props = {
  title: string;
  subtitle: string;
  counterpartLabel: string;
  messages: ChatMessage[];
  isRealtimeConnected?: boolean;
  draft: string;
  sending: boolean;
  success: string | null;
  error: string | null;
  onDraftChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

/**
 * Format chat timestamps for message bubbles.
 *
 * @param value - Raw date-time string for the message.
 * @returns A localized short time string, or `"Now"` when the value is invalid.
 */
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
 * @param props.success - Optional success message shown in a toast.
 * @param props.error - Optional error message shown in a toast.
 * @param props.onDraftChange - Callback fired when the draft changes.
 * @param props.onSubmit - Form submit handler for sending a message.
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
  success,
  error,
  onDraftChange,
  onSubmit,
}: Props) {
  const { t } = useI18n();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-0">
      <FloatingToast tone="success" message={success} durationMs={6500} />
      <FloatingToast tone="error" message={error} durationMs={6500} />

      <section className="overflow-hidden rounded-[24px] border border-[var(--theme-line)] bg-[var(--theme-surface)] shadow-[var(--theme-shadow-warm)]">
        <div className="border-b border-[var(--theme-line)] bg-[linear-gradient(135deg,rgba(212,233,197,0.42),rgba(255,255,255,0.92))] px-5 py-6 sm:px-7 sm:py-7">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--theme-muted)]">{t("chat.conversation")}</p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-medium leading-tight text-[var(--theme-ink)] sm:text-4xl">{title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--theme-muted-strong)] sm:text-base">{subtitle}</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--theme-line)] bg-[rgba(255,255,255,0.85)] px-3 py-1.5 text-xs font-medium text-[var(--theme-muted-strong)]">
                <span className={`h-2 w-2 rounded-full ${isRealtimeConnected ? "bg-green-500" : "bg-amber-400"}`} />
                {isRealtimeConnected ? t("common.connected") : t("common.updating")}
              </div>
            </div>
            <div className="rounded-full border border-[var(--theme-line)] bg-[rgba(255,255,255,0.85)] px-4 py-2 text-sm font-medium text-[var(--theme-ink)]">
              {counterpartLabel}
            </div>
          </div>
        </div>

        <div className="flex min-h-[58vh] flex-col">
            <div className="flex-1 space-y-4 bg-[rgba(246,248,245,0.86)] px-4 py-5 sm:px-6 sm:py-6">
              {messages.length === 0 ? (
                <div className="flex h-full min-h-[240px] items-center justify-center">
                  <div className="rounded-2xl border border-dashed border-[var(--theme-line)] bg-[var(--theme-surface)] px-6 py-5 text-center">
                    <p className="text-sm font-medium text-[var(--theme-ink)]">{t("chat.noneYet")}</p>
                    <p className="mt-2 text-sm text-[var(--theme-muted)]">{t("chat.noneYetBody")}</p>
                  </div>
                </div>
              ) : messages.map((message) => {
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
                  <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-[20px] px-4 py-3 shadow-sm sm:max-w-[70%] ${
                        isMine
                          ? "rounded-br-md bg-[var(--theme-primary)] text-white"
                          : "rounded-bl-md border border-[var(--theme-line)] bg-[var(--theme-surface)] text-[var(--theme-ink)]"
                      }`}
                    >
                      <p className="text-sm leading-6">{message.body}</p>
                      <p className={`mt-2 text-[11px] font-medium ${isMine ? "text-white/70" : "text-[var(--theme-muted)]"}`}>
                        {formatLocaleTime(message.createdAt, undefined, t("common.now"))}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={onSubmit} className="border-t border-[var(--theme-line)] bg-[var(--theme-surface)] p-4 sm:p-5">
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
    </div>
  );
}
