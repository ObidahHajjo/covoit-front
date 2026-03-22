import { Link } from "react-router-dom";
import { formatDateTimeRaw } from "../../helpers/FormatDateTime";
import type { Trip } from "../../types/Trip";
import type { TripStatus } from "../../context/Driver/useMyTrips";

const STATUS_CONFIG: Record<TripStatus, { label: string; badge: string }> = {
  current: {
    label: "On the road",
    badge: "border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] text-[var(--theme-ink)]",
  },
  incoming: {
    label: "Coming up",
    badge: "border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] text-[var(--theme-muted-strong)]",
  },
  past: {
    label: "Archive",
    badge: "border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] text-[var(--theme-muted)]",
  },
};

/**
 * Render a trip card inside the driver trip lists.
 *
 * @param props - Component props for the driver trip card.
 * @param props.trip - Trip shown in the card.
 * @param props.status - Driver-oriented status bucket for the trip.
 * @returns The rendered driver trip link.
 */
function TripCard({ trip, status }: { trip: Trip; status: TripStatus }) {
  const config = STATUS_CONFIG[status];
  const from = trip.departure_address?.city?.name ?? "Unknown";
  const to = trip.arrival_address?.city?.name ?? "Unknown";

  return (
    <Link
      to={`/my-trips/${trip.id}`}
      className="group flex min-w-0 flex-col gap-4 rounded-xl border border-[var(--theme-line)] bg-[var(--theme-surface)] p-4 text-[var(--theme-ink)] transition hover:border-[var(--theme-line-strong)] sm:flex-row sm:items-start sm:p-5"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] text-lg text-[var(--theme-ink)]">
        🚗
      </div>

      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row">
          <p className="min-w-0 text-lg font-medium text-[var(--theme-ink)] sm:truncate">{from} - {to}</p>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${config.badge}`}>
            {config.label}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-[var(--theme-muted)]">
          <span className="rounded-full border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-3 py-1">Departure {formatDateTimeRaw(trip.departure_time)}</span>
          <span className="rounded-full border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-3 py-1">Arrival {formatDateTimeRaw(trip.arrival_time)}</span>
          <span className="rounded-full border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-3 py-1">{trip.available_seats} seats</span>
          <span className="rounded-full border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-3 py-1">{trip.distance_km} km</span>
        </div>
      </div>
    </Link>
  );
}

/**
 * Group driver trips by status with shared framing.
 *
 * @param props - Component props configuring the trip group.
 * @param props.title - Group title.
 * @param props.icon - Icon shown next to the title.
 * @param props.trips - Trips rendered inside the group.
 * @param props.status - Status used to style each trip card.
 * @param props.emptyMessage - Message shown when the group has no trips.
 * @returns The rendered grouped trip section.
 */
function TripGroup({
  title,
  icon,
  trips,
  status,
  emptyMessage,
}: {
  title: string;
  icon: string;
  trips: Trip[];
  status: TripStatus;
  emptyMessage: string;
}) {
  return (
    <section className="min-w-0 rounded-xl border border-[var(--theme-line)] bg-[var(--theme-surface)] p-5 sm:p-6">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] text-base">{icon}</span>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--theme-muted)]">Trip lane</p>
            <h2 className="truncate text-xl font-medium text-[var(--theme-ink)]">{title}</h2>
          </div>
        </div>
        <span className="rounded-full border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-3 py-1 text-xs font-medium text-[var(--theme-muted-strong)]">
          {trips.length}
        </span>
      </div>

      {trips.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-6 py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)] text-xl">🗓</div>
          <p className="mt-4 text-lg font-medium text-[var(--theme-ink)]">No trips in this lane.</p>
          <p className="mt-1 text-sm text-[var(--theme-muted)]">{emptyMessage}</p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} status={status} />
          ))}
        </div>
      )}
    </section>
  );
}

type Props = {
  currentTrips: Trip[];
  incomingTrips: Trip[];
  pastTrips: Trip[];
};

/**
 * Organize the driver's trips into current, upcoming, and past lanes.
 *
 * @param props - Component props containing grouped driver trips.
 * @param props.currentTrips - Trips currently in progress.
 * @param props.incomingTrips - Upcoming trips scheduled for later.
 * @param props.pastTrips - Completed trips kept for history.
 * @returns The rendered driver trips dashboard.
 */
export function MyTripsSection({ currentTrips, incomingTrips, pastTrips }: Props) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-0">
      <div className="overflow-hidden rounded-2xl border border-[var(--theme-line)] bg-[var(--theme-surface)] px-5 py-6 sm:px-7 sm:py-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--theme-muted)]">Driver desk</p>
            <h1 className="mt-3 text-3xl font-medium leading-tight text-[var(--theme-ink)] sm:text-4xl">My Trips</h1>
            <p className="mt-4 text-sm leading-6 text-[var(--theme-muted-strong)] sm:text-base">Track what is active now, what is scheduled next, and what has already rolled through.</p>
          </div>
          <Link
            to="/my-trips/new"
            className="inline-flex w-full items-center justify-center rounded-lg border border-[var(--theme-primary)] bg-[var(--theme-primary)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#444] sm:w-auto"
          >
            Publish a new trip
          </Link>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <TripGroup
            title="Current trips"
            icon="🟢"
            trips={currentTrips}
            status="current"
            emptyMessage="Your active rides will appear here while they are in progress."
          />

          <TripGroup
            title="Incoming trips"
            icon="🕐"
            trips={incomingTrips}
            status="incoming"
            emptyMessage="Schedule another route and it will land here before departure."
          />

          <div className="xl:col-span-2">
            <TripGroup
              title="Past trips"
              icon="📁"
              trips={pastTrips}
              status="past"
              emptyMessage="Completed trips stay here as a simple archive."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
