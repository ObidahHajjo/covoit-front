import { useMyBookings } from "../../context/Booking/useMyBookings";
import { MyBookingsSection } from "../../components/ui/MyBookingsSection";

export default function MyBookingsPage() {
    const { bookings, loading, error } = useMyBookings();

    return (
        <div className="mx-auto max-w-lg space-y-6 px-4 py-6 sm:px-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Bookings</h1>
                <p className="mt-1 text-sm text-slate-400">Your upcoming and past trips</p>
            </div>

            {error && (
                <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white text-xs">!</span>
                    <p className="text-sm font-medium text-rose-700">{error}</p>
                </div>
            )}

            {loading ? (
                <div className="flex min-h-[30vh] items-center justify-center">
                    <div className="space-y-3 text-center">
                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-500" />
                        <p className="text-sm text-slate-400">Loading your bookings…</p>
                    </div>
                </div>
            ) : (
                <MyBookingsSection bookings={bookings} />
            )}
        </div>
    );
}