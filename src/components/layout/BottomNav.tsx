import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import type { AuthUser } from "../../types/MeResponse.ts";
import { useAuth } from "../../hooks/Auth/useAuth.ts";
import { useChatInbox } from "../../hooks/Chat/useChatInbox.ts";
import { getConversationUnread, getConversationUnreadCount } from "../../features/chat/chatReadState.ts";
import { useI18n } from "../../i18n/I18nProvider.tsx";

export type NavItem = {
  to: string;
  labelKey: string;
  icon: string;
  visible: (user: AuthUser | null) => boolean;
  mobileVisible?: (user: AuthUser | null) => boolean;
};

/**
 * Shared navigation definitions used by the app shell and mobile nav.
 */
export const navItems: NavItem[] = [
  {
    to: "/home",
    labelKey: "nav.home",
    icon: "home",
    visible: () => true,
    mobileVisible: () => true,
  },
  {
    to: "/my-trips",
    labelKey: "nav.myTrips",
    icon: "trips",
    visible: (user) => user?.permissions.can_manage_own_trips ?? false,
    mobileVisible: () => false,
  },
  {
    to: "/find-trip",
    labelKey: "nav.find",
    icon: "find",
    visible: () => true,
    mobileVisible: () => true,
  },
  {
    to: "/chat",
    labelKey: "nav.chat",
    icon: "chat",
    visible: () => true,
    mobileVisible: () => true,
  },
  {
    to: "/bookings",
    labelKey: "nav.bookings",
    icon: "bookings",
    visible: (user) => user?.permissions.can_view_bookings ?? false,
    mobileVisible: (user) => user?.permissions.can_view_bookings ?? false,
  },
  {
    to: "/my-account",
    labelKey: "nav.account",
    icon: "account",
    visible: (user) => user?.permissions.can_edit_profile ?? false,
    mobileVisible: () => false,
  },
  {
    to: "/support",
    labelKey: "nav.support",
    icon: "support",
    visible: () => true,
    mobileVisible: () => false,
  },
];

const mobileMoreItem: NavItem = {
  to: "/more",
  labelKey: "nav.more",
  icon: "more",
  visible: () => true,
  mobileVisible: () => true,
};

/**
 * Render the icon used by each bottom-navigation item.
 *
 * @param props - Component props describing the icon to render.
 * @param props.icon - Icon identifier for the matching navigation glyph.
 * @returns The rendered SVG icon.
 */
function NavGlyph({ icon }: { icon: string }) {
  if (icon === "home") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5.5 9.5V20h13V9.5" />
      </svg>
    );
  }

  if (icon === "trips") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 17h16" />
        <path d="M6 17V8l6-3 6 3v9" />
        <path d="M9 12h6" />
      </svg>
    );
  }

  if (icon === "find") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
      </svg>
    );
  }

  if (icon === "bookings") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="5" width="16" height="15" rx="2.5" />
        <path d="M8 3v4M16 3v4M4 10h16" />
      </svg>
    );
  }

  if (icon === "chat") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 10h10" />
        <path d="M7 14h6" />
        <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.2 0-2.34-.25-3.37-.7L3 21l1.88-5.07A8.46 8.46 0 0 1 4 11.5 8.5 8.5 0 1 1 21 11.5Z" />
      </svg>
    );
  }

  if (icon === "more") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (icon === "support") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
        <path d="M9.6 9.6a2.5 2.5 0 1 1 4.1 2c-.86.7-1.45 1.21-1.45 2.3" />
        <path d="M12 17h.01" />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

/**
 * Show the mobile-first bottom navigation and chat alerts.
 *
 * @returns The rendered bottom navigation and optional incoming-message alert.
 */
export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { unreadCount, conversations } = useChatInbox();
  const { t } = useI18n();
  const seenMapRef = useRef<Record<number, string>>({});
  const [incomingAlert, setIncomingAlert] = useState<{ id: number; name: string; body: string } | null>(null);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  useEffect(() => {
    const nextSeenMap: Record<number, string> = {};
    let newestIncoming: { id: number; name: string; body: string; updatedAt: string } | null = null;

    // Track the last seen update timestamp per conversation so only newly changed unread threads trigger alerts.
    for (const conversation of conversations) {
      const currentUpdatedAt = conversation.updatedAt;
      const previousUpdatedAt = seenMapRef.current[conversation.id];
      const isUnread = getConversationUnread(
        conversation.id,
        conversation.updatedAt,
        conversation.latestMessage?.id,
        conversation.latestMessage?.sender,
      );
      const unreadCountForConversation = getConversationUnreadCount(conversation.id);

      if (previousUpdatedAt && currentUpdatedAt !== previousUpdatedAt && isUnread) {
        if (!newestIncoming || new Date(currentUpdatedAt).getTime() > new Date(newestIncoming.updatedAt).getTime()) {
          newestIncoming = {
            id: conversation.id,
            name: conversation.participantName,
            body: unreadCountForConversation > 1
              ? t("nav.unreadMessages", { count: unreadCountForConversation })
              : (conversation.latestMessage?.body ?? t("nav.newMessageFallback")),
            updatedAt: currentUpdatedAt,
          };
        }
      }

      nextSeenMap[conversation.id] = currentUpdatedAt;
    }

    seenMapRef.current = nextSeenMap;

    if (newestIncoming) {
      setIncomingAlert({ id: newestIncoming.id, name: newestIncoming.name, body: newestIncoming.body });

      const timer = window.setTimeout(() => {
        setIncomingAlert((current) => (current?.id === newestIncoming?.id ? null : current));
      }, 5000);

      return () => window.clearTimeout(timer);
    }
  }, [conversations]);

  useEffect(() => {
    setIsMoreOpen(false);
  }, [location.pathname]);

  const primaryItems = navItems.filter((item) => (item.mobileVisible ?? item.visible)(user));
  const overflowItems = navItems.filter((item) => item.visible(user) && !(item.mobileVisible ?? item.visible)(user));
  const visibleItems = overflowItems.length > 0 ? [...primaryItems, mobileMoreItem] : primaryItems;

  return (
    <>
      {incomingAlert ? (
        <button
          type="button"
          onClick={() => navigate(`/chat/${incomingAlert.id}`)}
          className="fixed right-4 top-4 z-[80] max-w-sm rounded-2xl border border-[var(--theme-line)] bg-[rgba(255,255,255,0.96)] px-4 py-3 text-left shadow-[0_18px_40px_-24px_rgba(15,23,42,0.4)] backdrop-blur-xl transition hover:scale-[1.01] sm:right-6 sm:top-6"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-muted)]">{t("nav.newMessage")}</p>
          <p className="mt-1 text-sm font-semibold text-[var(--theme-ink)]">{incomingAlert.name}</p>
          <p className="mt-1 line-clamp-2 text-sm text-[var(--theme-muted)]">{incomingAlert.body}</p>
        </button>
      ) : null}

      {isMoreOpen ? (
        <>
          <button
            type="button"
            aria-label={t("common.close")}
            className="fixed inset-0 z-40 bg-[rgba(16,24,40,0.28)] backdrop-blur-[1px] lg:hidden"
            onClick={() => setIsMoreOpen(false)}
          />
          <div className="fixed inset-x-4 bottom-24 z-50 rounded-[1.75rem] border border-[var(--theme-line)] bg-[rgba(255,255,255,0.98)] p-4 shadow-[0_24px_50px_-28px_rgba(15,23,42,0.5)] backdrop-blur-xl lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[var(--theme-ink)]">{t("nav.more")}</p>
              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="rounded-full border border-[var(--theme-line)] px-3 py-1.5 text-xs font-medium text-[var(--theme-muted-strong)] transition hover:border-[var(--theme-line-strong)] hover:text-[var(--theme-ink)]"
              >
                {t("common.close")}
              </button>
            </div>

            <div className="mt-4 grid gap-2">
              {overflowItems.map((item) => (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => {
                    setIsMoreOpen(false);
                    navigate(item.to);
                  }}
                  className="flex items-center gap-3 rounded-2xl border border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-3 text-left text-sm font-medium text-[var(--theme-ink)] transition hover:border-[var(--theme-line-strong)]"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--theme-bg-soft)] text-[var(--theme-muted-strong)]">
                    <NavGlyph icon={item.icon} />
                  </span>
                  <span>{t(item.labelKey)}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : null}

      <nav className="serene-nav fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--theme-line)] shadow-[0_-10px_30px_-24px_rgba(46,52,50,0.45)] lg:hidden">
        <div
          className="mx-auto grid max-w-6xl gap-2 px-3 pb-6 pt-3 text-center"
          style={{ gridTemplateColumns: `repeat(${visibleItems.length}, minmax(0, 1fr))` }}
        >
          {visibleItems.map((item) => (
            item.to === mobileMoreItem.to ? (
              <button
                key={item.to}
                type="button"
                onClick={() => setIsMoreOpen((current) => !current)}
                className={`serene-nav-link ${isMoreOpen || overflowItems.some((overflowItem) => location.pathname.startsWith(overflowItem.to)) ? "serene-nav-link-active" : "hover:bg-[var(--theme-surface)]/70"}`}
              >
                <span aria-hidden="true" className="relative inline-flex overflow-visible">
                  <NavGlyph icon={item.icon} />
                </span>
                <span className="max-[360px]:hidden">{t(item.labelKey)}</span>
              </button>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => {
                  const base = "serene-nav-link";
                  return isActive ? `${base} serene-nav-link-active` : `${base} hover:bg-[var(--theme-surface)]/70`;
                }}
              >
                <span aria-hidden="true" className="relative inline-flex overflow-visible">
                  <NavGlyph icon={item.icon} />
                  {item.to === "/chat" && unreadCount > 0 ? (
                    <span className="absolute -right-3 -top-3 flex min-h-5 min-w-5 animate-pulse items-center justify-center rounded-full border-2 border-[rgba(249,250,248,0.95)] bg-red-500 px-1 text-[10px] font-semibold text-white shadow-[0_8px_18px_-10px_rgba(239,68,68,0.95)]">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  ) : null}
                </span>
                <span className="max-[360px]:hidden">{t(item.labelKey)}</span>
              </NavLink>
            )
          ))}
        </div>
      </nav>
    </>
  );
}
