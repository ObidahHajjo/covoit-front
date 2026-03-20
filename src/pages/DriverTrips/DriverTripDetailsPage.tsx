import { useDriverTripDetails } from "../../context/Driver/useDriverTripDetails";
import { DriverTripDetailsSection } from "../../components/ui/DriverTripDetailsSection";
import PageLoadingState from "../../components/common/PageLoadingState";

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
    return <PageLoadingState title="Loading your trip" />;
  }

  if (!trip) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-0">
        <div className="rounded-2xl border border-dashed border-[var(--theme-line)] bg-[var(--theme-surface)] px-6 py-14 text-center">
          <p className="text-4xl">🔍</p>
          <p className="mt-3 text-sm font-medium text-[var(--theme-muted)]">
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
