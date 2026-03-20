import { NavLink } from "react-router-dom";
import type {AuthUser} from "../../types/MeResponse.ts";
import {useAuth} from "../../context/useAuth.ts";

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
        label: "Find a Trip",
        visible: () => true,
    },
    {
        to: "/bookings",
        label: "My Bookings",
        visible: (user) => user?.permissions.can_view_bookings ?? false,
    },
    {
        to: "/my-account",
        label: "My Account",
        visible: (user) => user?.permissions.can_edit_profile ?? false,
    },
];

export default function BottomNav() {
    const { user } = useAuth();

    const visibleItems = items.filter((item) => item.visible(user));

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 px-2 pb-2 pt-2 sm:px-4 md:bottom-5 md:px-6">
            <div
                className="mx-auto grid max-w-4xl gap-2 rounded-[1.75rem] border border-[var(--theme-line)] bg-[rgba(255,248,238,0.88)] p-2 text-center text-[0.72rem] shadow-warm backdrop-blur-xl sm:text-xs md:text-sm"
                style={{ gridTemplateColumns: `repeat(${visibleItems.length}, minmax(0, 1fr))` }}
            >
                {visibleItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => {
                            const base = "flex min-h-[3.5rem] items-center justify-center rounded-full px-2 py-3 font-semibold tracking-[0.08em] transition duration-200";
                            return isActive
                                ? `${base} bg-[linear-gradient(135deg,var(--theme-coral),var(--theme-coral-deep))] text-[var(--theme-cream-strong)] shadow-[0_14px_28px_rgba(235,90,54,0.26)]`
                                : `${base} text-[var(--theme-muted)] hover:bg-white/70 hover:text-[var(--theme-ink)]`;
                        }}
                    >
                        {item.label}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
