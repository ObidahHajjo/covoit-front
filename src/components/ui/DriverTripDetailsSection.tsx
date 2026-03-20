import { Link } from "react-router-dom";
import { formatDateTimeRaw } from "../../helpers/FormatDateTime";
import type { Person } from "../../types/Person";
import type { Trip } from "../../types/Trip";

function InfoCard({ icon, title, rows }: {
  icon: string;
  title: string;
  rows: { label: string; value: string | number | undefined | null }[];
}) {
  return (
    <div className="rounded-xl border border-[var(--theme-line)] bg-[var(--theme-surface)] p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] text-sm">{icon}</span>
        <h3 className="text-base font-medium text-[var(--theme-ink)]">{title}</h3>
      </div>
      <div className="mt-4 space-y-2">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-start justify-between gap-4 rounded-lg border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-3 py-2">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--theme-muted)]">{label}</span>
            <span className="text-right text-sm text-[var(--theme-ink)]">{value ?? "-"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PassengerRow({ passenger, contactPath }: { passenger: Person; contactPath: string }) {
  const name = [passenger.first_name, passenger.last_name].filter(Boolean).join(" ") || "Passenger";

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-4 sm:flex-row sm:items-center">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] text-sm font-medium text-[var(--theme-ink)]">
        {(passenger.first_name?.[0] ?? passenger.pseudo?.[0] ?? "?").toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-[var(--theme-ink)]">{name}</p>
        <p className="text-xs text-[var(--theme-muted)]">{passenger.pseudo ? `@${passenger.pseudo}` : `#${passenger.id}`}</p>
      </div>
      <Link
        to={contactPath}
        className="inline-flex shrink-0 items-center justify-center rounded-lg border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-4 py-2 text-xs font-medium text-[var(--theme-ink)] transition hover:border-[var(--theme-line-strong)] hover:bg-[var(--theme-surface)]"
      >
        Contact passenger
      </Link>
    </div>
  );
}

type Props = {
  trip: Trip;
  passengers: Person[];
  error: string | null;
  cancelling: boolean;
  onCancelTrip: () => void;
  getContactPassengerPath: (passengerId: number) => string;
};

export function DriverTripDetailsSection({
  trip,
  passengers,
  error,
  cancelling,
  onCancelTrip,
  getContactPassengerPath,
}: Props) {
  const from = trip.departure_address?.city?.name ?? "-";
  const to = trip.arrival_address?.city?.name ?? "-";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-0">
      <section className="overflow-hidden rounded-2xl border border-[var(--theme-line)] bg-[var(--theme-surface)] px-5 py-6 sm:px-7 sm:py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--theme-muted)]">Driver trip desk</p>
            <h1 className="mt-3 text-3xl font-medium leading-tight text-[var(--theme-ink)] sm:text-4xl">{from} - {to}</h1>
            <p className="mt-4 text-sm leading-6 text-[var(--theme-muted-strong)] sm:text-base">Manage route details, passenger outreach, and cancellation from one composed view.</p>
          </div>
          <span className="inline-flex rounded-lg border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-4 py-2 text-sm font-medium text-[var(--theme-muted-strong)]">Trip #{trip.id}</span>
        </div>

        {error ? (
          <div className="mt-6 rounded-lg border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-4 py-3 text-sm font-medium text-[var(--theme-ink)]">
            {error}
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InfoCard
            icon="🕐"
            title="Trip timing"
            rows={[
              { label: "Departure", value: formatDateTimeRaw(trip.departure_time) },
              { label: "Arrival", value: formatDateTimeRaw(trip.arrival_time) },
              { label: "Distance", value: `${trip.distance_km} km` },
              { label: "Seats left", value: trip.available_seats },
              { label: "Smoking", value: trip.smoking_allowed ? "Allowed" : "Not allowed" },
            ]}
          />

          <InfoCard
            icon="👤"
            title="Driver"
            rows={[
              { label: "First name", value: trip.driver?.first_name },
              { label: "Last name", value: trip.driver?.last_name },
              { label: "Pseudo", value: trip.driver?.pseudo },
              { label: "Phone", value: trip.driver?.phone },
            ]}
          />

          <InfoCard
            icon="📍"
            title="Departure point"
            rows={[
              { label: "Street", value: [trip.departure_address?.street_number, trip.departure_address?.street].filter(Boolean).join(" ") },
              { label: "Postal", value: trip.departure_address?.city?.postal_code },
              { label: "City", value: trip.departure_address?.city?.name },
            ]}
          />

          <InfoCard
            icon="🏁"
            title="Arrival point"
            rows={[
              { label: "Street", value: [trip.arrival_address?.street_number, trip.arrival_address?.street].filter(Boolean).join(" ") },
              { label: "Postal", value: trip.arrival_address?.city?.postal_code },
              { label: "City", value: trip.arrival_address?.city?.name },
            ]}
          />
        </div>

        <div className="mt-8 rounded-xl border border-[var(--theme-line)] bg-[var(--theme-surface)] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--theme-muted)]">Passenger list</p>
              <h2 className="mt-2 text-lg font-medium text-[var(--theme-ink)]">Traveling with you</h2>
            </div>
            <span className="rounded-lg border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-3 py-1 text-xs font-medium text-[var(--theme-muted-strong)]">{passengers.length}</span>
          </div>

          {passengers.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-6 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)] text-xl">👤</div>
              <p className="mt-4 text-lg font-medium text-[var(--theme-ink)]">No passengers yet.</p>
              <p className="mt-1 text-sm text-[var(--theme-muted)]">New reservations will appear here as they come in.</p>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {passengers.map((passenger) => (
                <PassengerRow
                  key={passenger.id}
                  passenger={passenger}
                  contactPath={getContactPassengerPath(passenger.id)}
                />
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onCancelTrip}
          disabled={cancelling}
          className="mt-8 w-full rounded-lg border border-[var(--theme-primary)] bg-[var(--theme-primary)] px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[#444] disabled:opacity-40"
        >
          {cancelling ? "Cancelling..." : "Cancel this trip"}
        </button>
      </section>
    </div>
  );
}
