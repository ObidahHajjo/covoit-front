import { Link } from "react-router-dom";
import type { ChatConversation } from "../../types/Chat";
import { getConversationUnread } from "../../features/chat/chatReadState";
import FloatingToast from "../common/FloatingToast";

type Props = {
  conversations: ChatConversation[];
  error: string | null;
  isRealtimeConnected: boolean;
};

function ChatRow({ conversation }: { conversation: ChatConversation }) {
  const preview = conversation.latestMessage?.body || conversation.tripLabel || "Open conversation";
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
                New
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {hasUnread ? <span className="h-2.5 w-2.5 rounded-full bg-[var(--theme-primary)]" /> : null}
            <p className="shrink-0 text-xs text-[var(--theme-muted)]">
              {new Date(conversation.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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

export function ChatInboxSection({ conversations, error, isRealtimeConnected }: Props) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-0">
      <FloatingToast tone="error" message={error} durationMs={6500} />

      <section className="overflow-hidden rounded-[28px] border border-[var(--theme-line)] bg-[var(--theme-surface)] shadow-[var(--theme-shadow-warm)]">
        <div className="border-b border-[var(--theme-line)] bg-[linear-gradient(135deg,rgba(212,233,197,0.4),rgba(255,255,255,0.9))] px-5 py-6 sm:px-7 sm:py-7">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--theme-muted)]">Messages</p>
          <h1 className="mt-3 text-3xl font-medium leading-tight text-[var(--theme-ink)] sm:text-4xl">Chats</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--theme-muted-strong)] sm:text-base">
            A real inbox view: people first, latest message second, trip context in the background.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--theme-line)] bg-[rgba(255,255,255,0.8)] px-3 py-1.5 text-xs font-medium text-[var(--theme-muted-strong)]">
            <span className={`h-2 w-2 rounded-full ${isRealtimeConnected ? "bg-green-500" : "bg-amber-400"}`} />
            {isRealtimeConnected ? "Live updates connected" : "Polling for new messages"}
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
            <p className="mt-4 text-lg font-medium text-[var(--theme-ink)]">No chats yet</p>
            <p className="mt-2 text-sm text-[var(--theme-muted)]">
              Start a conversation from a trip, booking, or passenger list and it will appear here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
