import { NavLink } from "react-router-dom";
import type { AuthUser } from "../../types/MeResponse.ts";
import { useAuth } from "../../context/useAuth.ts";

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

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

export default function BottomNav() {
  const { user } = useAuth();

  const visibleItems = items.filter((item) => item.visible(user));

  return (
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
            <span aria-hidden="true"><NavGlyph icon={item.icon} /></span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
