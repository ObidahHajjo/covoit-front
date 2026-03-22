import { useTripDetails } from "../../context/Trips/useTripDetails";
import { TripDetailsSection } from "../../components/ui/TripDetailsSection";

/**
 * Render the passenger-facing trip details page with reservation and driver contact actions.
 *
 * @returns The trip details section populated with loading and action state from the trip details workflow.
 */
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
