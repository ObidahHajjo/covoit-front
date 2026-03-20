import { useMyBookings } from "../../context/Booking/useMyBookings";
import { MyBookingsSection } from "../../components/ui/MyBookingsSection";

export default function MyBookingsPage() {
    const { bookings, loading, error } = useMyBookings();

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-0">
            <div className="overflow-hidden rounded-[40px] border border-[#efe2d4] bg-[linear-gradient(180deg,rgba(255,247,238,0.96),rgba(247,237,226,0.88))] px-5 py-6 shadow-[0_36px_90px_-50px_rgba(24,53,45,0.45)] sm:px-7 sm:py-8">
                <div className="mb-8 max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b06f60]">My bookings</p>
                    <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.02] text-[#18352d] sm:text-5xl">Every reserved seat, gathered into one clear ride journal.</h1>
                    <p className="mt-4 text-sm leading-6 text-[#4c655b] sm:text-base">Review your current plans and past trips without losing the data behind each booking.</p>
                </div>

                {error ? <div className="mb-6 rounded-[24px] border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm font-medium text-rose-700">{error}</div> : null}

                {loading ? (
                    <div className="flex min-h-[30vh] items-center justify-center rounded-[32px] border border-white/70 bg-white/55 backdrop-blur-xl">
                        <div className="space-y-3 text-center">
                            <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-[#eadfd2] border-t-[#f26f5a]" />
                            <p className="text-sm text-[#5d746b]">Loading your bookings...</p>
                        </div>
                    </div>
                ) : (
                    <MyBookingsSection bookings={bookings} />
                )}
            </div>
        </div>
    );
}
