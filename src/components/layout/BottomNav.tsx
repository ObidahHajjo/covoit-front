import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import type { AuthUser } from "../../types/MeResponse.ts";
import { useAuth } from "../../context/useAuth.ts";
import { useChatInbox } from "../../context/Chat/useChatInbox.ts";
import { getConversationUnread, getConversationUnreadCount } from "../../features/chat/chatReadState.ts";

type NavItem = {
  to: string;
  label: string;
  icon: string;
  visible: (user: AuthUser | null) => boolean;
};

const items: NavItem[] = [
  {
    to: "/home",
    label: "Home",
    icon: "home",
    visible: () => true,
  },
  {
    to: "/my-trips",
    label: "My Trips",
    icon: "trips",
    visible: (user) => user?.permissions.can_manage_own_trips ?? false,
  },
  {
    to: "/find-trip",
    label: "Find",
    icon: "find",
    visible: () => true,
  },
  {
    to: "/chat",
    label: "Chat",
    icon: "chat",
    visible: () => true,
  },
  {
    to: "/bookings",
    label: "Bookings",
    icon: "bookings",
    visible: (user) => user?.permissions.can_view_bookings ?? false,
  },
  {
    to: "/my-account",
    label: "Account",
    icon: "account",
    visible: (user) => user?.permissions.can_edit_profile ?? false,
  },
];

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
  const { user } = useAuth();
  const { unreadCount, conversations } = useChatInbox();
  const seenMapRef = useRef<Record<number, string>>({});
  const [incomingAlert, setIncomingAlert] = useState<{ id: number; name: string; body: string } | null>(null);

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
              ? `${unreadCountForConversation} unread messages`
              : (conversation.latestMessage?.body ?? "New message"),
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

  const visibleItems = items.filter((item) => item.visible(user));

  return (
    <>
      {incomingAlert ? (
        <button
          type="button"
          onClick={() => navigate(`/chat/${incomingAlert.id}`)}
          className="fixed right-4 top-4 z-[80] max-w-sm rounded-2xl border border-[var(--theme-line)] bg-[rgba(255,255,255,0.96)] px-4 py-3 text-left shadow-[0_18px_40px_-24px_rgba(15,23,42,0.4)] backdrop-blur-xl transition hover:scale-[1.01] sm:right-6 sm:top-6"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-muted)]">New Message</p>
          <p className="mt-1 text-sm font-semibold text-[var(--theme-ink)]">{incomingAlert.name}</p>
          <p className="mt-1 line-clamp-2 text-sm text-[var(--theme-muted)]">{incomingAlert.body}</p>
        </button>
      ) : null}

      <nav className="serene-nav fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--theme-line)] shadow-[0_-10px_30px_-24px_rgba(46,52,50,0.45)]">
        <div
          className="mx-auto grid max-w-6xl gap-2 px-3 pb-6 pt-3 text-center"
          style={{ gridTemplateColumns: `repeat(${visibleItems.length}, minmax(0, 1fr))` }}
        >
          {visibleItems.map((item) => (
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
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
