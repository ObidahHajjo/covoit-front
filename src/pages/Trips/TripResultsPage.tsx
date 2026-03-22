import { useTripResults } from "../../context/Trips/useTripResults";
import { TripResultsSection } from "../../components/ui/TripResultsSection";

/**
 * Render the trip results page showing rides that match the active search criteria.
 *
 * @returns The trip results section with loading feedback while matches are being retrieved.
 */
export default function TripResultsPage() {
  const { trips, loading } = useTripResults();

  return <TripResultsSection trips={trips} loading={loading} />;
}
