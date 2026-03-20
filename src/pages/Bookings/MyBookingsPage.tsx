import { useMyBookings } from "../../context/Booking/useMyBookings";
import { MyBookingsSection } from "../../components/ui/MyBookingsSection";

export default function MyBookingsPage() {
  const { bookings, loading, error } = useMyBookings();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-0">
      <div className="overflow-hidden rounded-2xl border border-[#eee] bg-[#fafafa] px-5 py-6 sm:px-7 sm:py-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-wide text-[#888]">My bookings</p>
          <h1 className="mt-3 text-2xl font-medium leading-tight text-[#222] sm:text-3xl">Every reserved seat, gathered into one clear ride journal.</h1>
          <p className="mt-4 text-sm leading-6 text-[#666] sm:text-base">Review your current plans and past trips without losing the data behind each booking.</p>
        </div>

        {error ? <div className="mb-6 rounded-xl border border-[#eee] bg-white px-4 py-3.5 text-sm font-medium text-[#666]">{error}</div> : null}

        {loading ? (
          <div className="flex min-h-[30vh] items-center justify-center rounded-xl border border-[#eee] bg-white">
            <div className="space-y-3 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#eee] border-t-[#888]" />
              <p className="text-sm text-[#888]">Loading your bookings...</p>
            </div>
          </div>
        ) : (
          <MyBookingsSection bookings={bookings} />
        )}
      </div>
    </div>
  );
}
