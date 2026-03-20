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
    <div className="rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)] p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">{label}</p>
      <p className="mt-2 text-sm font-medium leading-6 text-[var(--theme-ink)]">{value}</p>
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
      <section className="overflow-hidden rounded-2xl border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-5 py-6 text-[var(--theme-ink)] sm:px-7 sm:py-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">Booking details</p>
        <h1 className="mt-3 text-2xl font-medium leading-tight text-[var(--theme-ink)] sm:text-3xl">{from} - {to}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--theme-muted-strong)] sm:text-base">Keep departure notes, passenger count, and cancellation actions together in one calm view.</p>

        {error ? (
          <div className="mt-6 rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-3 text-sm font-medium text-[var(--theme-muted-strong)]">
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

        <div className="mt-8 rounded-xl border border-[var(--theme-line)] bg-[var(--theme-surface)] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">Reservation status</p>
              <h2 className="mt-2 text-xl font-medium text-[var(--theme-ink)]">{isTripEnded ? "This ride has already wrapped up." : "Your seat is currently reserved."}</h2>
            </div>
            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${isTripEnded ? "border-[var(--theme-line)] bg-[var(--theme-bg-soft)] text-[var(--theme-muted)]" : "border-[var(--theme-line-strong)] bg-[var(--theme-surface)] text-[var(--theme-muted-strong)]"}`}>
              {isTripEnded ? "Ended" : "Active"}
            </span>
          </div>

          {!isTripEnded ? (
            <button
              onClick={onCancel}
              disabled={cancelling}
              className="mt-5 w-full rounded-lg bg-[var(--theme-primary)] px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[var(--theme-primary-dim)] disabled:opacity-40"
            >
              {cancelling ? "Cancelling..." : "Cancel reservation"}
            </button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
