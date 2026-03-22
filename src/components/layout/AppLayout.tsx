import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authApi";
import { useAuth } from "../../context/useAuth";
import BottomNav from "./BottomNav";

function getPageLabel(pathname: string): string {
  if (pathname === "/home") return "Dashboard";
  if (pathname === "/find-trip") return "Find Trips";
  if (pathname === "/chat") return "Chats";
  if (pathname.startsWith("/chat/")) return "Chat";
  if (pathname.startsWith("/find-trip/results")) return "Trip Results";
  if (pathname.startsWith("/trips/") && pathname.endsWith("/contact-driver")) return "Driver Chat";
  if (pathname.startsWith("/trips/")) return "Trip Details";
  if (pathname === "/my-trips") return "My Trips";
  if (pathname === "/my-trips/new") return "Publish Trip";
  if (pathname.includes("/contact-passenger/")) return "Passenger Chat";
  if (pathname.startsWith("/my-trips/")) return "Trip Details";
  if (pathname === "/bookings") return "Bookings";
  if (pathname.startsWith("/bookings/")) return "Booking Details";
  if (pathname === "/my-account") return "Account";
  if (pathname === "/complete-profile") return "Complete Profile";

  return "Dashboard";
}

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutLocal, user } = useAuth();
  const pageLabel = getPageLabel(location.pathname);

  async function handleLogout() {
    try {
      await logout();
    } finally {
      logoutLocal();
      localStorage.removeItem("refresh_token");
      sessionStorage.removeItem("personId");
      navigate("/login", { replace: true });
    }
  }

  return (
    <div className="relative min-h-screen bg-[transparent] text-[var(--theme-ink)]">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-56 bg-[radial-gradient(circle_at_top,rgba(212,233,197,0.5),transparent_70%)]" />
      <header className="relative z-20 border-b border-[var(--theme-line)] bg-[rgba(255,255,255,0.72)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--theme-subtle)]">Covoit</p>
            <p className="text-sm font-medium text-[var(--theme-ink)]">{pageLabel}</p>
          </div>

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-[var(--theme-line-strong)] bg-[var(--theme-surface)] px-4 py-2 text-sm font-medium text-[var(--theme-muted-strong)] transition hover:border-[var(--theme-primary)] hover:text-[var(--theme-ink)]"
            >
              Log out
            </button>
          ) : null}
        </div>
      </header>
      <main className="relative z-10 mx-auto min-h-screen w-full max-w-6xl px-4 py-6 pb-32 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
