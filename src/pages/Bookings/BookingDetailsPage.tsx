import { useBookingDetails } from "../../context/Booking/useBookingDetails";
import { BookingDetailsSection } from "../../components/ui/BookingDetailsSection";

export default function BookingDetailsPage() {
    const { trip, passengers, loading, error, cancelling, isTripEnded, handleCancel } =
        useBookingDetails();

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center rounded-[40px] bg-[linear-gradient(180deg,rgba(255,247,238,0.96),rgba(247,237,226,0.88))] px-4">
                <div className="space-y-3 text-center">
                    <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-[#eadfd2] border-t-[#f26f5a]" />
                    <p className="text-sm text-[#5d746b]">Loading booking details...</p>
                </div>
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-0">
                <div className="rounded-[32px] border border-dashed border-[#d8cfc2] bg-[linear-gradient(180deg,rgba(255,247,238,0.96),rgba(247,237,226,0.88))] px-6 py-14 text-center text-[#18352d] shadow-[0_28px_80px_-44px_rgba(24,53,45,0.35)]">
                    <p className="text-4xl">🔍</p>
                    <p className="mt-3 text-sm font-medium text-[#5d746b]">
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
