import { useMyTrips } from "../../context/Driver/useMyTrips";
import { MyTripsSection } from "../../components/ui/MyTripsSection";

export default function MyTripsPage() {
  const { loading, error, currentTrips, incomingTrips, pastTrips } = useMyTrips();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fafafa] px-4">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-2 border-[#eee] border-t-[#222]" />
          <p className="text-sm text-[#888]">Loading your trips...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-0">
        <div className="rounded-2xl border border-[#eee] bg-white px-6 py-14 text-center">
          <p className="text-4xl">⚠️</p>
          <p className="mt-3 text-sm font-medium text-[#222]">{error}</p>
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
