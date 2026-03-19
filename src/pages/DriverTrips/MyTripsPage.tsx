import { useMyTrips } from "../../context/Driver/useMyTrips";
import { MyTripsSection } from "../../components/ui/MyTripsSection";

export default function MyTripsPage() {
    const { loading, error, currentTrips, incomingTrips, pastTrips } = useMyTrips();

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="space-y-3 text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-500" />
                    <p className="text-sm text-slate-400">Loading your trips…</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="space-y-2 text-center">
                    <p className="text-4xl">⚠️</p>
                    <p className="text-sm font-medium text-slate-500">{error}</p>
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