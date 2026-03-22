import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMyBookings } from "../../context/Booking/useMyBookings";
import { MyBookingsSection } from "../../components/ui/MyBookingsSection";
import FloatingToast from "../../components/common/FloatingToast";
import PageLoadingState from "../../components/common/PageLoadingState";
import { useI18n } from "../../i18n/I18nProvider";

/**
 * Render the bookings overview page with the user's current reservations, past bookings, and transient feedback toast.
 *
 * @returns The bookings page content with loading, error, and toast states.
 */
export default function MyBookingsPage() {
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const { bookings, loading, error } = useMyBookings();
  const toast = (location.state as { toast?: { tone: "success" | "error"; message: string } } | null)?.toast;

  useEffect(() => {
    if (!toast) return;

    // Clear router-passed toast state after display so refreshes do not replay the same notification.
    const timer = window.setTimeout(() => {
      navigate(location.pathname, { replace: true, state: null });
    }, 7000);

    return () => window.clearTimeout(timer);
  }, [toast, navigate, location.pathname]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-0">
      {toast ? <FloatingToast tone={toast.tone} message={toast.message} durationMs={6500} /> : null}
      <div className="overflow-hidden rounded-2xl border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-5 py-6 sm:px-7 sm:py-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">{t("bookings.title")}</p>
          <h1 className="mt-3 text-2xl font-medium leading-tight text-[var(--theme-ink)] sm:text-3xl">{t("bookings.heading")}</h1>
          <p className="mt-4 text-sm leading-6 text-[var(--theme-muted-strong)] sm:text-base">{t("bookings.body")}</p>
        </div>

        {error ? <div className="mb-6 rounded-xl border border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-3.5 text-sm font-medium text-[var(--theme-muted-strong)]">{error}</div> : null}

        {loading ? (
          <PageLoadingState title={t("loading.bookings")} compact />
        ) : (
          <MyBookingsSection bookings={bookings} />
        )}
      </div>
    </div>
  );
}
