import { useMyBookings } from "../../context/Booking/useMyBookings";
import { MyBookingsSection } from "../../components/ui/MyBookingsSection";
import PageLoadingState from "../../components/common/PageLoadingState";

export default function MyBookingsPage() {
  const { bookings, loading, error } = useMyBookings();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-0">
      <div className="overflow-hidden rounded-2xl border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-5 py-6 sm:px-7 sm:py-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">My bookings</p>
          <h1 className="mt-3 text-2xl font-medium leading-tight text-[var(--theme-ink)] sm:text-3xl">Every reserved seat, gathered into one clear ride journal.</h1>
          <p className="mt-4 text-sm leading-6 text-[var(--theme-muted-strong)] sm:text-base">Review your current plans and past trips without losing the data behind each booking.</p>
        </div>

        {error ? <div className="mb-6 rounded-xl border border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-3.5 text-sm font-medium text-[var(--theme-muted-strong)]">{error}</div> : null}

        {loading ? (
          <PageLoadingState title="Loading your bookings" compact />
        ) : (
          <MyBookingsSection bookings={bookings} />
        )}
      </div>
    </div>
  );
}
