import { useDriverTripDetails } from "../../context/Driver/useDriverTripDetails";
import { DriverTripDetailsSection } from "../../components/ui/DriverTripDetailsSection";

export default function DriverTripDetailsPage() {
  const {
    trip,
    passengers,
    loading,
    error,
    cancelling,
    handleCancelTrip,
    getContactPassengerPath,
  } = useDriverTripDetails();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fafafa] px-4">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-2 border-[#eee] border-t-[#222]" />
          <p className="text-sm text-[#888]">Loading trip...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-0">
        <div className="rounded-2xl border border-dashed border-[#eee] bg-white px-6 py-14 text-center">
          <p className="text-4xl">🔍</p>
          <p className="mt-3 text-sm font-medium text-[#888]">
            {error ?? "Trip not found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <DriverTripDetailsSection
      trip={trip}
      passengers={passengers}
      error={error}
      cancelling={cancelling}
      onCancelTrip={handleCancelTrip}
      getContactPassengerPath={getContactPassengerPath}
    />
  );
}
