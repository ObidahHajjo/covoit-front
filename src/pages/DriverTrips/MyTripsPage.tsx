import { useMyTrips } from "../../context/Driver/useMyTrips";
import { MyTripsSection } from "../../components/ui/MyTripsSection";

export default function MyTripsPage() {
    const { loading, error, currentTrips, incomingTrips, pastTrips } = useMyTrips();

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center rounded-[40px] bg-[linear-gradient(180deg,rgba(255,247,238,0.96),rgba(247,237,226,0.88))] px-4">
                <div className="space-y-3 text-center">
                    <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-[#eadfd2] border-t-[#f26f5a]" />
                    <p className="text-sm text-[#5d746b]">Loading your trips...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-0">
                <div className="rounded-[32px] border border-rose-200 bg-[linear-gradient(180deg,rgba(255,247,238,0.96),rgba(247,237,226,0.88))] px-6 py-14 text-center shadow-[0_28px_80px_-44px_rgba(24,53,45,0.35)]">
                    <p className="text-4xl">⚠️</p>
                    <p className="mt-3 text-sm font-medium text-rose-700">{error}</p>
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
