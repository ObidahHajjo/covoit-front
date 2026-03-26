import { Link } from "react-router-dom";
import { formatDateTimeRaw } from "../../../helpers/FormatDateTime.ts";
import type { Trip } from "../../../types/Trip.ts";
import type { TripStatus } from "../../../hooks/Driver/useMyTrips.ts";
import { useI18n } from "../../../i18n/I18nProvider.tsx";

const STATUS_CONFIG: Record<TripStatus, { labelKey: string; badge: string }> = {
  current: {
    labelKey: "driverTrips.onRoad",
    badge: "border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] text-[var(--theme-ink)]",
  },
  incoming: {
    labelKey: "driverTrips.comingUp",
    badge: "border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] text-[var(--theme-muted-strong)]",
  },
  past: {
    labelKey: "driverTrips.archive",
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
  const { t } = useI18n();
  const config = STATUS_CONFIG[status];
  const from = trip.departure_address?.city?.name ?? t("common.unknown");
  const to = trip.arrival_address?.city?.name ?? t("common.unknown");

  return (
    <Link
      to={`/my-trips/${trip.id}`}
      className="group flex min-w-0 gap-3 rounded-xl border border-[var(--theme-line)] bg-[var(--theme-surface)] p-4 text-[var(--theme-ink)] transition hover:border-[var(--theme-line-strong)] sm:gap-4 sm:p-5"
    >
      {/* Timeline left rail */}
      <div className="flex flex-col items-center pt-0.5">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-[var(--theme-primary)] bg-[var(--theme-surface)]" />
        <span className="min-h-4 w-px flex-1 bg-[var(--theme-line-strong)]" />
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--theme-primary)]" />
      </div>

      {/* Content right of timeline */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold leading-tight text-[var(--theme-ink)]">{from}</p>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${config.badge}`}>
            {t(config.labelKey)}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--theme-muted)]">
          <span className="rounded-md bg-[var(--theme-bg-soft)] px-2 py-1">📅 {t("driverTrips.departureTag", { value: formatDateTimeRaw(trip.departure_time) })}</span>
          <span className="rounded-md bg-[var(--theme-bg-soft)] px-2 py-1">🏁 {t("driverTrips.arrivalTag", { value: formatDateTimeRaw(trip.arrival_time) })}</span>
          <span className="rounded-md bg-[var(--theme-bg-soft)] px-2 py-1">💺 {t("driverTrips.seatsTag", { count: trip.available_seats })}</span>
          <span className="rounded-md bg-[var(--theme-bg-soft)] px-2 py-1">📍 {trip.distance_km} km</span>
        </div>

        <p className="mt-2 text-sm font-semibold leading-tight text-[var(--theme-ink)]">{to}</p>
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
  const { t } = useI18n();

  return (
    <section className="min-w-0 rounded-xl border border-[var(--theme-line)] bg-[var(--theme-surface)] p-5 sm:p-6">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] text-base">{icon}</span>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--theme-muted)]">{t("driverTrips.tripLane")}</p>
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
          <p className="mt-4 text-lg font-medium text-[var(--theme-ink)]">{t("driverTrips.noTripsLane")}</p>
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
  const { t } = useI18n();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-0">
      <div className="overflow-hidden rounded-2xl border border-[var(--theme-line)] bg-[var(--theme-surface)] px-5 py-6 sm:px-7 sm:py-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--theme-muted)]">{t("driverTrips.driverDesk")}</p>
            <h1 className="mt-3 text-3xl font-medium leading-tight text-[var(--theme-ink)] sm:text-4xl">{t("driverTrips.heading")}</h1>
            <p className="mt-4 text-sm leading-6 text-[var(--theme-muted-strong)] sm:text-base">{t("driverTrips.body")}</p>
          </div>
          <Link
            to="/my-trips/new"
            className="inline-flex w-full items-center justify-center rounded-lg border border-[var(--theme-primary)] bg-[var(--theme-primary)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#444] sm:w-auto"
          >
            {t("driverTrips.publishNew")}
          </Link>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <TripGroup
            title={t("driverTrips.currentTrips")}
            icon="🟢"
            trips={currentTrips}
            status="current"
            emptyMessage={t("driverTrips.currentEmpty")}
          />

          <TripGroup
            title={t("driverTrips.incomingTrips")}
            icon="🕐"
            trips={incomingTrips}
            status="incoming"
            emptyMessage={t("driverTrips.incomingEmpty")}
          />

          <div className="xl:col-span-2">
            <TripGroup
              title={t("driverTrips.pastTrips")}
              icon="📁"
              trips={pastTrips}
              status="past"
              emptyMessage={t("driverTrips.pastEmpty")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
