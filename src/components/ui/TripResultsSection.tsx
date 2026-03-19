import { Link } from "react-router-dom";
import { formatDateTimeRaw } from "../../helpers/FormatDateTime";
import type { Trip } from "../../types/Trip";

type Props = {
  trips: Trip[];
  loading: boolean;
};

export function TripResultsSection({ trips, loading }: Props) {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Trip Results</h1>

      {loading && <p>Loading trips...</p>}

      {!loading && (
        <div className="space-y-3">
          {trips.map((trip) => (
            <Link key={trip.id} to={`/trips/${trip.id}`} className="block rounded-xl bg-white p-4 shadow-sm">
              <p className="font-semibold">
                {trip.departure_address?.city?.name ?? "Unknown"} → {trip.arrival_address?.city?.name ?? "Unknown"}
              </p>
              <p className="text-sm text-slate-500">{formatDateTimeRaw(trip.departure_time)}</p>
              <p className="text-sm text-slate-500">Seats: {trip.available_seats}</p>
            </Link>
          ))}

          {trips.length === 0 && <p>No trips found.</p>}
        </div>
      )}
    </section>
  );
}
