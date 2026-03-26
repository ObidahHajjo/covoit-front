import { useBookingDetails } from "../../hooks/Booking/useBookingDetails";
import { BookingDetailsSection } from "../../components/ui/Booking/BookingDetailsSection.tsx";
import PageLoadingState from "../../components/common/PageLoadingState";
import { useI18n } from "../../i18n/I18nProvider";

/**
 * Render the details page for a single booking, including passengers, trip status, and available rider actions.
 *
 * @returns The booking details view, a loading state, or a not-found fallback when no booking is available.
 */
export default function BookingDetailsPage() {
  const { t } = useI18n();
  const { trip, passengers, loading, error, cancelling, isTripEnded, handleCancel, navigateToContactDriver, navigateToContactDriverEmail } =
    useBookingDetails();

  if (loading) {
    return <PageLoadingState title={t("loading.bookingDetails")} />;
  }

  if (!trip) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-0">
        <div className="rounded-xl border border-dashed border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-6 py-14 text-center text-[var(--theme-ink)]">
          <p className="text-4xl">🔍</p>
          <p className="mt-3 text-sm font-medium text-[var(--theme-muted)]">
            {error ?? t("bookings.notFound")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <BookingDetailsSection
      trip={trip}
      passengers={passengers}
      isTripEnded={isTripEnded}
      cancelling={cancelling}
      error={error}
      onCancel={handleCancel}
      onContactDriver={navigateToContactDriver}
      onContactDriverEmail={navigateToContactDriverEmail}
    />
  );
}
