import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authApi";
import { useAuth } from "../../hooks/Auth/useAuth.ts";
import BottomNav, { navItems } from "./BottomNav";
import Footer from "./Footer";
import { useI18n } from "../../i18n/I18nProvider";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { NavLink } from "react-router-dom";
import { useChatInbox } from "../../hooks/Chat/useChatInbox";

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
  if (pathname === "/support") return "shell.support";
  if (pathname.startsWith("/find-trip/results")) return "shell.tripResults";
  if (pathname.startsWith("/trips/") && pathname.endsWith("/contact-driver"))
    return "shell.driverChat";
  if (pathname.startsWith("/trips/") && pathname.endsWith("/contact-driver-email"))
    return "shell.driverEmail";
  if (pathname.startsWith("/trips/")) return "shell.tripDetails";
  if (pathname === "/my-trips") return "shell.myTrips";
  if (pathname === "/my-trips/new") return "shell.publishTrip";
  if (pathname.includes("/contact-passenger/") && pathname.endsWith("/email")) return "shell.passengerEmail";
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
  const { unreadCount } = useChatInbox();
  const { t } = useI18n();
  const pageLabel = t(getPageLabel(location.pathname));
  const visibleItems = navItems.filter((item) => item.visible(user));

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
    <div className="relative flex min-h-screen flex-col bg-[transparent] text-[var(--theme-ink)]">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-56 bg-[radial-gradient(circle_at_top,rgba(212,233,197,0.5),transparent_70%)]" />
      <header
        id="app-shell-header"
        className="relative z-20 border-b border-[var(--theme-line)] bg-[rgba(255,255,255,0.72)] backdrop-blur-xl"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--theme-subtle)]">
              {t("app.name")}
            </p>
            <p className="text-sm font-medium text-[var(--theme-ink)]">{pageLabel}</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher compact hideLabelOnMobile />
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-[var(--theme-line-strong)] bg-[var(--theme-surface)] px-3 py-2 text-sm font-medium text-[var(--theme-muted-strong)] transition hover:border-[var(--theme-primary)] hover:text-[var(--theme-ink)] sm:px-4"
              >
                {t("shell.logOut")}
              </button>
            ) : null}
          </div>
        </div>

        <div className="mx-auto hidden w-full max-w-6xl px-6 pb-4 lg:block lg:px-8">
          <nav className="flex flex-wrap items-center gap-2">
            {visibleItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-[var(--theme-primary)] text-white shadow-[0_12px_28px_-18px_rgba(82,100,72,0.85)]"
                      : "border border-[var(--theme-line)] bg-[rgba(255,255,255,0.78)] text-[var(--theme-muted-strong)] hover:border-[var(--theme-line-strong)] hover:text-[var(--theme-ink)]",
                  ].join(" ")
                }
              >
                <span className="relative inline-flex items-center">
                  {t(item.labelKey)}
                  {item.to === "/chat" && unreadCount > 0 ? (
                    <span className="ml-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold leading-none text-white shadow-[0_8px_18px_-10px_rgba(239,68,68,0.95)]">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  ) : null}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-5 pb-20 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <Outlet />
      </main>
      <Footer />

      <BottomNav />
    </div>
  );
}
