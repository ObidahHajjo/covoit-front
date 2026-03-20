import { useMyTrips } from "../../context/Driver/useMyTrips";
import { MyTripsSection } from "../../components/ui/MyTripsSection";
import PageLoadingState from "../../components/common/PageLoadingState";

export default function MyTripsPage() {
  const { loading, error, currentTrips, incomingTrips, pastTrips } = useMyTrips();

  if (loading) {
    return <PageLoadingState title="Loading your trips" />;
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-0">
        <div className="rounded-2xl border border-[var(--theme-line)] bg-[var(--theme-surface)] px-6 py-14 text-center">
          <p className="text-4xl">⚠️</p>
          <p className="mt-3 text-sm font-medium text-[var(--theme-ink)]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <MyTripsSection
      currentTrips={currentTrips}
      incomingTrips={incomingTrips}
      pastTrips={pastTrips}
    />
  );
}
