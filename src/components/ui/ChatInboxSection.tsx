import { Link } from "react-router-dom";
import type { ChatConversation } from "../../types/Chat";
import { getConversationUnread } from "../../features/chat/chatReadState";
import FloatingToast from "../common/FloatingToast";
import { useI18n } from "../../i18n/I18nProvider";
import { formatLocaleTime } from "../../i18n/config";

type Props = {
  conversations: ChatConversation[];
  error: string | null;
  isRealtimeConnected: boolean;
};

/**
 * Render a single conversation preview in the inbox.
 *
 * @param props - Component props for the conversation row.
 * @param props.conversation - Conversation data displayed in the row.
 * @returns The rendered conversation preview link.
 */
function ChatRow({ conversation }: { conversation: ChatConversation }) {
  const { t } = useI18n();
  const preview = conversation.latestMessage?.body
    || (conversation.clearedAt ? t("chat.cleared") : conversation.tripLabel)
    || t("chat.openConversation");
  const hasUnread = getConversationUnread(
    conversation.id,
    conversation.updatedAt,
    conversation.latestMessage?.id,
    conversation.latestMessage?.sender,
  );

  return (
    <Link
      to={`/chat/${conversation.id}`}
      className="group flex items-center gap-4 border-b border-[var(--theme-line)] px-5 py-4 transition hover:bg-[rgba(246,248,245,0.72)] sm:px-6"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(145deg,rgba(82,100,72,0.14),rgba(212,233,197,0.48))] text-sm font-semibold text-[var(--theme-ink)]">
        {(conversation.participantName[0] ?? "?").toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate text-sm font-semibold text-[var(--theme-ink)] sm:text-base">{conversation.participantName}</p>
            {hasUnread ? (
              <span className="shrink-0 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                {t("common.new")}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {hasUnread ? <span className="h-2.5 w-2.5 rounded-full bg-[var(--theme-primary)]" /> : null}
            <p className="shrink-0 text-xs text-[var(--theme-muted)]">
              {formatLocaleTime(conversation.updatedAt)}
            </p>
          </div>
        </div>
        <p className="mt-1 truncate text-sm text-[var(--theme-muted)]">{preview}</p>
        {conversation.tripLabel ? (
          <p className="mt-1 truncate text-xs uppercase tracking-[0.14em] text-[var(--theme-subtle)]">{conversation.tripLabel}</p>
        ) : null}
      </div>
    </Link>
  );
}

/**
 * List chat conversations with live-connection status.
 *
 * @param props - Component props for the inbox view.
 * @param props.conversations - Conversations to display in the inbox.
 * @param props.error - Optional error message shown in a toast.
 * @param props.isRealtimeConnected - Whether the realtime chat connection is active.
 * @returns The rendered chat inbox section.
 */
export function ChatInboxSection({ conversations, error, isRealtimeConnected }: Props) {
  const { t } = useI18n();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-0">
      <FloatingToast tone="error" message={error} durationMs={6500} />

      <section className="overflow-hidden rounded-[28px] border border-[var(--theme-line)] bg-[var(--theme-surface)] shadow-[var(--theme-shadow-warm)]">
        <div className="border-b border-[var(--theme-line)] bg-[linear-gradient(135deg,rgba(212,233,197,0.4),rgba(255,255,255,0.9))] px-5 py-6 sm:px-7 sm:py-7">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--theme-muted)]">{t("chat.messages")}</p>
          <h1 className="mt-3 text-3xl font-medium leading-tight text-[var(--theme-ink)] sm:text-4xl">{t("chat.chats")}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--theme-muted-strong)] sm:text-base">
            {t("chat.inboxBody")}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--theme-line)] bg-[rgba(255,255,255,0.8)] px-3 py-1.5 text-xs font-medium text-[var(--theme-muted-strong)]">
            <span className={`h-2 w-2 rounded-full ${isRealtimeConnected ? "bg-green-500" : "bg-amber-400"}`} />
            {isRealtimeConnected ? t("common.connected") : t("common.updating")}
          </div>
        </div>

        {conversations.length > 0 ? (
          <div>
            {conversations.map((conversation) => (
              <ChatRow key={conversation.id} conversation={conversation} />
            ))}
          </div>
        ) : (
          <div className="px-5 py-12 text-center sm:px-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--theme-bg-soft)] text-xl">💬</div>
            <p className="mt-4 text-lg font-medium text-[var(--theme-ink)]">{t("chat.none")}</p>
            <p className="mt-2 text-sm text-[var(--theme-muted)]">
              {t("chat.noneBody")}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
