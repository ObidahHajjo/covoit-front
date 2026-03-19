import { Link } from "react-router-dom";
import type { Trip } from "../../types/Trip";

type Props = {
  bookings: Trip[];
  now?: number;
};

function TripCard({ trip, now }: { trip: Trip; now: number }) {
  const from = trip.departure_address?.city?.name ?? "—";
  const to = trip.arrival_address?.city?.name ?? "—";
  const date = trip.departure_time
    ? new Date(trip.departure_time).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;
  const isPast = trip.departure_time
    ? new Date(trip.departure_time).getTime() <= now
    : false;

  return (
    <Link
      to={`/bookings/${trip.id}`}
      className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-violet-200 hover:shadow-md sm:p-5"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow">
        🚗
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-800">
          {from} → {to}
        </p>
        {date && (
          <p className="mt-0.5 text-xs text-slate-400">{date}</p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {isPast && (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-400">
            Ended
          </span>
        )}
        <span className="text-slate-300">›</span>
      </div>
    </Link>
  );
}

const CURRENT_TIME = Date.now();

export function MyBookingsSection({ bookings, now = CURRENT_TIME }: Props) {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
        <span className="text-4xl">🗓</span>
        <p className="text-sm font-medium text-slate-500">No bookings yet.</p>
        <p className="text-xs text-slate-400">Your upcoming trips will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookings.map((trip) => (
        <TripCard key={trip.id} trip={trip} now={now} />
      ))}
    </div>
  );
}