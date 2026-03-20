import { Link } from "react-router-dom";
import type { Trip } from "../../types/Trip";

type Props = {
  bookings: Trip[];
  now?: number;
};

function TripCard({ trip, now }: { trip: Trip; now: number }) {
  const from = trip.departure_address?.city?.name ?? "-";
  const to = trip.arrival_address?.city?.name ?? "-";
  const date = trip.departure_time
    ? new Date(trip.departure_time).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;
  const isPast = trip.departure_time ? new Date(trip.departure_time).getTime() <= now : false;

  return (
    <Link
      to={`/bookings/${trip.id}`}
      className="group flex items-center gap-4 rounded-xl border border-[var(--theme-line)] bg-[var(--theme-surface)] p-4 text-[var(--theme-ink)] transition hover:border-[var(--theme-line-strong)] sm:p-5"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--theme-bg-soft)] text-lg text-[var(--theme-muted)]">
        🚗
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-medium leading-tight text-[var(--theme-ink)]">{from} - {to}</p>
        {date ? <p className="mt-2 text-sm text-[var(--theme-muted)]">{date}</p> : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${isPast ? "border-[var(--theme-line)] bg-[var(--theme-bg-soft)] text-[var(--theme-muted)]" : "border-[var(--theme-line-strong)] bg-[var(--theme-surface)] text-[var(--theme-muted-strong)]"}`}>
          {isPast ? "Completed" : "Booked"}
        </span>
      </div>
    </Link>
  );
}

const CURRENT_TIME = Date.now();

export function MyBookingsSection({ bookings, now = CURRENT_TIME }: Props) {
  return (
    <section className="rounded-xl border border-[var(--theme-line)] bg-[var(--theme-surface)] p-5 text-[var(--theme-ink)] sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">Booked routes</p>
          <h2 className="mt-2 text-xl font-medium leading-tight text-[var(--theme-ink)]">Your ride plans</h2>
        </div>
        <p className="text-sm text-[var(--theme-muted)]">{bookings.length} booking{bookings.length !== 1 ? "s" : ""} saved</p>
      </div>

      {bookings.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--theme-line)] bg-[var(--theme-bg-soft)] py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-lg bg-[var(--theme-surface)] text-3xl">🗓</span>
          <p className="text-xl font-medium text-[var(--theme-ink)]">No bookings yet.</p>
          <p className="text-sm text-[var(--theme-muted)]">Your upcoming trips will appear here as soon as you reserve a seat.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {bookings.map((trip) => (
            <TripCard key={trip.id} trip={trip} now={now} />
          ))}
        </div>
      )}
    </section>
  );
}
