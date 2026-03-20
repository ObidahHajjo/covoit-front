import type { Person } from "../../types/Person";
import type { Trip } from "../../types/Trip";

type Props = {
  trip: Trip;
  passengers: Person[];
  isTripEnded: boolean;
  cancelling: boolean;
  error: string | null;
  onCancel: () => void;
};

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#eee] bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-[#888]">{label}</p>
      <p className="mt-2 text-sm font-medium leading-6 text-[#222]">{value}</p>
    </div>
  );
}

export function BookingDetailsSection({
  trip,
  passengers,
  isTripEnded,
  cancelling,
  error,
  onCancel,
}: Props) {
  const from = trip.departure_address?.city?.name ?? "-";
  const to = trip.arrival_address?.city?.name ?? "-";
  const departurePoint = [trip.departure_address?.street_number, trip.departure_address?.street, trip.departure_address?.city?.postal_code, trip.departure_address?.city?.name]
    .filter(Boolean)
    .join(" ");
  const arrivalPoint = [trip.arrival_address?.street_number, trip.arrival_address?.street, trip.arrival_address?.city?.postal_code, trip.arrival_address?.city?.name]
    .filter(Boolean)
    .join(" ");
  const departureDate = trip.departure_time
    ? new Date(trip.departure_time).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Date unavailable";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-0">
      <section className="overflow-hidden rounded-2xl border border-[#eee] bg-[#fafafa] px-5 py-6 text-[#222] sm:px-7 sm:py-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[#888]">Booking details</p>
        <h1 className="mt-3 text-2xl font-medium leading-tight text-[#222] sm:text-3xl">{from} - {to}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#666] sm:text-base">Keep departure notes, passenger count, and cancellation actions together in one calm view.</p>

        {error ? (
          <div className="mt-6 rounded-lg border border-[#eee] bg-white px-4 py-3 text-sm font-medium text-[#666]">
            {error}
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <DetailCard label="Departure" value={departureDate} />
          <DetailCard label="Passengers" value={`${passengers.length} ${passengers.length === 1 ? "person" : "people"}`} />
          <DetailCard label="Departure address" value={departurePoint || "Address unavailable"} />
          <DetailCard label="Arrival address" value={arrivalPoint || "Address unavailable"} />
          <DetailCard label="Distance" value={`${trip.distance_km} km`} />
          <DetailCard label="Ride style" value={trip.smoking_allowed ? "Smoking allowed" : "Non-smoking ride"} />
        </div>

        <div className="mt-8 rounded-xl border border-[#eee] bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#888]">Reservation status</p>
              <h2 className="mt-2 text-xl font-medium text-[#222]">{isTripEnded ? "This ride has already wrapped up." : "Your seat is currently reserved."}</h2>
            </div>
            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${isTripEnded ? "border-[#eee] bg-[#fafafa] text-[#888]" : "border-[#ddd] bg-white text-[#666]"}`}>
              {isTripEnded ? "Ended" : "Active"}
            </span>
          </div>

          {!isTripEnded ? (
            <button
              onClick={onCancel}
              disabled={cancelling}
              className="mt-5 w-full rounded-lg bg-[#222] px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[#333] disabled:opacity-40"
            >
              {cancelling ? "Cancelling..." : "Cancel reservation"}
            </button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
