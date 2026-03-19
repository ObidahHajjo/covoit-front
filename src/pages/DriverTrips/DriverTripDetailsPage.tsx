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
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="space-y-3 text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-500" />
                    <p className="text-sm text-slate-400">Loading trip…</p>
                </div>
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="space-y-2 text-center">
                    <p className="text-4xl">🔍</p>
                    <p className="text-sm font-medium text-slate-500">
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