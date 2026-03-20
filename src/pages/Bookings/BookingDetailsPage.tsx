import { useBookingDetails } from "../../context/Booking/useBookingDetails";
import { BookingDetailsSection } from "../../components/ui/BookingDetailsSection";

export default function BookingDetailsPage() {
  const { trip, passengers, loading, error, cancelling, isTripEnded, handleCancel } =
    useBookingDetails();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-2xl bg-[#fafafa] px-4">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#eee] border-t-[#888]" />
          <p className="text-sm text-[#888]">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-0">
        <div className="rounded-xl border border-dashed border-[#eee] bg-[#fafafa] px-6 py-14 text-center text-[#222]">
          <p className="text-4xl">🔍</p>
          <p className="mt-3 text-sm font-medium text-[#888]">
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
