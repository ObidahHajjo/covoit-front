import { useTripDetails } from "../../context/Trips/useTripDetails";
import { TripDetailsSection } from "../../components/ui/TripDetailsSection";

export default function TripDetailsPage() {
  const {
    trip,
    loading,
    loadError,
    actionError,
    submitting,
    handleReserve,
    navigateToContactDriver,
  } = useTripDetails();

  return (
    <TripDetailsSection
      trip={trip}
      loading={loading}
      loadError={loadError}
      actionError={actionError}
      submitting={submitting}
      onReserve={handleReserve}
      onContactDriver={navigateToContactDriver}
    />
  );
}