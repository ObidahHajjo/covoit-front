import { useI18n } from "../../../../i18n/I18nProvider";
import { formatLocaleTime } from "../../../../i18n/config";
import type { AdminSupportSession } from "../../../../features/admin/useAdminSupportChatApi";

type Props = {
  session: AdminSupportSession;
  onJoin?: (sessionId: number) => void;
  onSelect?: (sessionId: number) => void;
};

export function AdminSupportSessionCard({ session, onJoin, onSelect }: Props) {
  const { t } = useI18n();

  const userName = session.user?.name ?? session.user?.email ?? t("admin.unknownUser");
  const timeAgo = formatLocaleTime(session.createdAt, undefined, t("common.now"));
  const lastMessage = session.lastMessage?.body ?? t("admin.noMessagesYet");

  const statusColors: Record<string, string> = {
    waiting: "bg-amber-100 text-amber-700 border-amber-200",
    active: "bg-green-100 text-green-700 border-green-200",
    closed: "bg-gray-100 text-gray-600 border-gray-200",
  };

  const statusColor = statusColors[session.status] ?? statusColors.waiting;

  return (
    <div
      className="flex items-center gap-4 rounded-xl border border-[var(--theme-line)] bg-white p-4 shadow-sm transition hover:shadow-md cursor-pointer"
      onClick={() => onSelect?.(session.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.(session.id);
        }
      }}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--theme-coral)] text-white font-semibold text-sm">
        {userName.charAt(0).toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-gray-800">{userName}</span>
          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusColor}`}>
            {session.status}
          </span>
        </div>
        {session.subject && (
          <p className="truncate text-xs font-medium text-gray-500">{session.subject}</p>
        )}
        <p className="truncate text-xs text-gray-400">{lastMessage}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="text-[10px] text-gray-400">{timeAgo}</span>
        {session.status === "waiting" && onJoin && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onJoin(session.id);
            }}
            className="rounded-lg bg-[var(--theme-coral)] px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
          >
            {t("admin.joinSession")}
          </button>
        )}
        {session.status === "active" && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(session.id);
            }}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200"
          >
            {t("admin.viewSession")}
          </button>
        )}
      </div>
    </div>
  );
}
