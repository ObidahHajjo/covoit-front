import { useBookingDetails } from "../../context/Booking/useBookingDetails";
import { BookingDetailsSection } from "../../components/ui/BookingDetailsSection";

export default function BookingDetailsPage() {
    const { trip, passengers, loading, error, cancelling, isTripEnded, handleCancel } =
        useBookingDetails();

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="space-y-3 text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-500" />
                    <p className="text-sm text-slate-400">Loading booking details…</p>
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
                        {error ?? "Booking not found."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <BookingDetailsSection
            trip={trip}
            passengers={passengers}
            isTripEnded={isTripEnded}
            cancelling={cancelling}
            error={error}
            onCancel={handleCancel}
        />
    );
}