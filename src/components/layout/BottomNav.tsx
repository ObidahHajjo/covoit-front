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
        <nav className="fixed bottom-0 left-0 right-0 border-t bg-white">
            <div
                className="mx-auto grid max-w-md gap-1 px-2 py-3 text-center text-xs"
                style={{ gridTemplateColumns: `repeat(${visibleItems.length}, minmax(0, 1fr))` }}
            >
                {visibleItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `rounded-lg px-2 py-2 ${isActive ? "bg-slate-900 text-white" : "text-slate-600"}`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}