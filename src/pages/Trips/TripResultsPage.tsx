import { useTripResults } from "../../context/Trips/useTripResults";
import { TripResultsSection } from "../../components/ui/TripResultsSection";

export default function TripResultsPage() {
  const { trips, loading } = useTripResults();

  return <TripResultsSection trips={trips} loading={loading} />;
}