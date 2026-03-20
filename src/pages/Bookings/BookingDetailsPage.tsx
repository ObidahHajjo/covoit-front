import { useBookingDetails } from "../../context/Booking/useBookingDetails";
import { BookingDetailsSection } from "../../components/ui/BookingDetailsSection";
import PageLoadingState from "../../components/common/PageLoadingState";

export default function BookingDetailsPage() {
  const { trip, passengers, loading, error, cancelling, isTripEnded, handleCancel } =
    useBookingDetails();

  if (loading) {
    return <PageLoadingState title="Loading your booking details" />;
  }

  if (!trip) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-0">
        <div className="rounded-xl border border-dashed border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-6 py-14 text-center text-[var(--theme-ink)]">
          <p className="text-4xl">🔍</p>
          <p className="mt-3 text-sm font-medium text-[var(--theme-muted)]">
            {error ?? "Booking not found."}
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
    />
  );
}
