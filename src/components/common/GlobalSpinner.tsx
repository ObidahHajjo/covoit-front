import { useLoading } from "../../context/LoadingContext";

/**
 * Map the current route to a contextual loading title.
 *
 * @param pathname - Current browser pathname used to infer the loading context.
 * @returns A route-specific title for the global loading overlay.
 */
function getLoadingTitle(pathname: string) {
  if (pathname.startsWith("/home")) return "Loading your dashboard";
  if (pathname.startsWith("/bookings/")) return "Loading your booking details";
  if (pathname.startsWith("/bookings")) return "Loading your bookings";
  if (pathname.startsWith("/my-trips/")) return "Loading your trip";
  if (pathname.startsWith("/my-trips")) return "Loading your trips";
  if (pathname.startsWith("/my-account")) return "Loading your account";
  if (pathname.startsWith("/find-trip/results")) return "Loading your search results";
  if (pathname.startsWith("/find-trip")) return "Loading your search page";
  if (pathname.startsWith("/trips/")) return "Loading your trip details";
  if (pathname.startsWith("/login")) return "Loading your sign in page";
  return "Loading your page";
}

/**
 * Cover the app with a global loading overlay while navigation is pending.
 *
 * @returns The rendered loading overlay, or `null` when the app is not loading.
 */
export default function GlobalSpinner() {
  const { isLoading } = useLoading();

  if (!isLoading) {
    return null;
  }

  const title = getLoadingTitle(window.location.pathname);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(0,0,0,0.1)] px-4">
      <div className="serene-panel flex items-center gap-4 bg-[rgba(255,255,255,0.94)] px-5 py-4 backdrop-blur-xl">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--theme-line)] border-t-[var(--theme-primary)]" />
        <div>
          <p className="text-sm font-semibold text-[var(--theme-ink)]">{title}</p>
          <p className="text-sm text-[var(--theme-muted)]">Preparing your route.</p>
        </div>
      </div>
    </div>
  );
}
