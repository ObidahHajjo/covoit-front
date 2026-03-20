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
      className="group flex items-center gap-4 rounded-xl border border-[#eee] bg-white p-4 text-[#222] transition hover:border-[#ccc] sm:p-5"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#fafafa] text-lg text-[#888]">
        🚗
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-medium leading-tight text-[#222]">{from} - {to}</p>
        {date ? <p className="mt-2 text-sm text-[#888]">{date}</p> : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${isPast ? "border-[#eee] bg-[#fafafa] text-[#888]" : "border-[#ddd] bg-white text-[#666]"}`}>
          {isPast ? "Completed" : "Booked"}
        </span>
      </div>
    </Link>
  );
}

const CURRENT_TIME = Date.now();

export function MyBookingsSection({ bookings, now = CURRENT_TIME }: Props) {
  return (
    <section className="rounded-xl border border-[#eee] bg-white p-5 text-[#222] sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#888]">Booked routes</p>
          <h2 className="mt-2 text-xl font-medium leading-tight text-[#222]">Your ride plans</h2>
        </div>
        <p className="text-sm text-[#888]">{bookings.length} booking{bookings.length !== 1 ? "s" : ""} saved</p>
      </div>

      {bookings.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#eee] bg-[#fafafa] py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-lg bg-white text-3xl">🗓</span>
          <p className="text-xl font-medium text-[#222]">No bookings yet.</p>
          <p className="text-sm text-[#888]">Your upcoming trips will appear here as soon as you reserve a seat.</p>
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
