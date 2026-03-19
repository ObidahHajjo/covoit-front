import type { Trip } from "../../types/Trip";

type Props = {
  trip: Trip | null;
  loading: boolean;
  loadError: string | null;
  actionError: string | null;
  submitting: boolean;
  onReserve: () => void;
  onContactDriver: () => void;
};

export function TripDetailsSection({
  trip,
  loading,
  loadError,
  actionError,
  submitting,
  onReserve,
  onContactDriver,
}: Props) {
  if (loading) return <p>Loading...</p>;
  if (loadError) return <p>{loadError}</p>;
  if (!trip) return <p>Trip not found.</p>;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Trip Details</h1>

      {actionError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <p className="font-semibold">
          {trip.departure_address?.city?.name} → {trip.arrival_address?.city?.name}
        </p>
        <p className="text-sm text-slate-500">{trip.departure_time}</p>
        <p className="text-sm text-slate-500">Distance: {trip.distance_km} km</p>
        <p className="text-sm text-slate-500">Seats left: {trip.available_seats}</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={onReserve}
            disabled={submitting}
            className="rounded-xl bg-slate-900 px-4 py-3 text-white disabled:opacity-50"
          >
            {submitting ? "Booking..." : "Confirm Booking"}
          </button>

          <button
            onClick={onContactDriver}
            className="rounded-xl border px-4 py-3"
          >
            Send Email
          </button>
        </div>
      </div>
    </section>
  );
}
