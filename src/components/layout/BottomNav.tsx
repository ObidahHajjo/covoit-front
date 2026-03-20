import { NavLink } from "react-router-dom";
import type { AuthUser } from "../../types/MeResponse.ts";
import { useAuth } from "../../context/useAuth.ts";

type NavItem = {
  to: string;
  label: string;
  visible: (user: AuthUser | null) => boolean;
};

const items: NavItem[] = [
  {
    to: "/home",
    label: "Home",
    visible: () => true,
  },
  {
    to: "/my-trips",
    label: "My Trips",
    visible: (user) => user?.permissions.can_manage_own_trips ?? false,
  },
  {
    to: "/find-trip",
    label: "Find",
    visible: () => true,
  },
  {
    to: "/bookings",
    label: "Bookings",
    visible: (user) => user?.permissions.can_view_bookings ?? false,
  },
  {
    to: "/my-account",
    label: "Account",
    visible: (user) => user?.permissions.can_edit_profile ?? false,
  },
];

export default function BottomNav() {
  const { user } = useAuth();

  const visibleItems = items.filter((item) => item.visible(user));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#eee] bg-white">
      <div
        className="mx-auto grid max-w-2xl gap-1 p-2 text-center text-sm"
        style={{ gridTemplateColumns: `repeat(${visibleItems.length}, minmax(0, 1fr))` }}
      >
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => {
              const base = "py-3 transition-colors";
              return isActive
                ? `${base} text-[#222] font-medium`
                : `${base} text-[#999] hover:text-[#666]`;
            }}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
