import { useLoading } from "../../context/LoadingContext";
import { useI18n } from "../../i18n/I18nProvider";

/**
 * Map the current route to a contextual loading title.
 *
 * @param pathname - Current browser pathname used to infer the loading context.
 * @returns A route-specific title for the global loading overlay.
 */
function getLoadingTitle(pathname: string) {
  if (pathname.startsWith("/home")) return "loading.dashboard";
  if (pathname.startsWith("/bookings/")) return "loading.bookingDetails";
  if (pathname.startsWith("/bookings")) return "loading.bookings";
  if (pathname.startsWith("/my-trips/")) return "loading.trip";
  if (pathname.startsWith("/my-trips")) return "loading.trips";
  if (pathname.startsWith("/my-account")) return "loading.account";
  if (pathname.startsWith("/find-trip/results")) return "loading.searchResults";
  if (pathname.startsWith("/find-trip")) return "loading.searchPage";
  if (pathname.startsWith("/trips/")) return "loading.tripDetails";
  if (pathname.startsWith("/login")) return "loading.signInPage";
  if (pathname.startsWith("/chat")) return "loading.chats";
  return "loading.routePage";
}

/**
 * Cover the app with a global loading overlay while navigation is pending.
 *
 * @returns The rendered loading overlay, or `null` when the app is not loading.
 */
export default function GlobalSpinner() {
  const { isLoading } = useLoading();
  const { t } = useI18n();

  if (!isLoading) {
    return null;
  }

  const title = t(getLoadingTitle(window.location.pathname));

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(0,0,0,0.1)] px-4">
      <div className="serene-panel flex items-center gap-4 bg-[rgba(255,255,255,0.94)] px-5 py-4 backdrop-blur-xl">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--theme-line)] border-t-[var(--theme-primary)]" />
        <div>
          <p className="text-sm font-semibold text-[var(--theme-ink)]">{title}</p>
          <p className="text-sm text-[var(--theme-muted)]">{t("app.preparingRoute")}</p>
        </div>
      </div>
    </div>
  );
}
