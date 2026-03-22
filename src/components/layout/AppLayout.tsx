import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authApi";
import { useAuth } from "../../context/useAuth";
import BottomNav from "./BottomNav";
import { useI18n } from "../../i18n/I18nProvider";
import LanguageSwitcher from "../common/LanguageSwitcher";

/**
 * Resolve the current route to the header label.
 *
 * @param pathname - Current browser pathname.
 * @returns The header label associated with the route.
 */
function getPageLabel(pathname: string): string {
  if (pathname === "/home") return "shell.dashboard";
  if (pathname === "/find-trip") return "shell.findTrips";
  if (pathname === "/chat") return "shell.chats";
  if (pathname.startsWith("/chat/")) return "shell.chat";
  if (pathname.startsWith("/find-trip/results")) return "shell.tripResults";
  if (pathname.startsWith("/trips/") && pathname.endsWith("/contact-driver")) return "shell.driverChat";
  if (pathname.startsWith("/trips/")) return "shell.tripDetails";
  if (pathname === "/my-trips") return "shell.myTrips";
  if (pathname === "/my-trips/new") return "shell.publishTrip";
  if (pathname.includes("/contact-passenger/")) return "shell.passengerChat";
  if (pathname.startsWith("/my-trips/")) return "shell.tripDetails";
  if (pathname === "/bookings") return "shell.bookings";
  if (pathname.startsWith("/bookings/")) return "shell.bookingDetails";
  if (pathname === "/my-account") return "shell.account";
  if (pathname === "/complete-profile") return "shell.completeProfile";

  return "shell.dashboard";
}

/**
 * Provide the authenticated app shell with header and bottom navigation.
 *
 * @returns The rendered authenticated application layout.
 */
export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutLocal, user } = useAuth();
  const { t } = useI18n();
  const pageLabel = t(getPageLabel(location.pathname));

  /**
   * Log the user out locally even if the remote logout request fails.
   *
   * @returns A promise that settles after local cleanup and navigation complete.
   */
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
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--theme-subtle)]">{t("app.name")}</p>
              <p className="text-sm font-medium text-[var(--theme-ink)]">{pageLabel}</p>
            </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher compact />
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-[var(--theme-line-strong)] bg-[var(--theme-surface)] px-4 py-2 text-sm font-medium text-[var(--theme-muted-strong)] transition hover:border-[var(--theme-primary)] hover:text-[var(--theme-ink)]"
              >
                {t("shell.logOut")}
              </button>
            ) : null}
          </div>
        </div>
      </header>
      <main className="relative z-10 mx-auto min-h-screen w-full max-w-6xl px-4 py-6 pb-32 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
