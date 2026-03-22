import { Link } from "react-router-dom";
import { formatDateTimeRaw } from "../../helpers/FormatDateTime";
import type { Person } from "../../types/Person";
import type { Trip } from "../../types/Trip";
import type { AuthUser } from "../../types/MeResponse";
import { useI18n } from "../../i18n/I18nProvider";

/**
 * Render a compact trip preview card for dashboard lists.
 *
 * @param props - Component props for the dashboard trip preview.
 * @param props.trip - Trip displayed in the card.
 * @param props.detailsPath - Route to the corresponding trip details page.
 * @returns The rendered trip preview link.
 */
function TripPreviewCard({ trip, detailsPath }: { trip: Trip; detailsPath: string }) {
  const { t } = useI18n();
  const from = trip.departure_address?.city?.name ?? t("common.unknown");
  const to = trip.arrival_address?.city?.name ?? t("common.unknown");

  return (
    <Link
      to={detailsPath}
      className="group flex flex-col gap-4 rounded-xl border border-[var(--theme-line)] bg-[var(--theme-surface)] p-4 transition hover:border-[var(--theme-line-strong)] sm:flex-row sm:items-center sm:p-5"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--theme-bg-soft)] text-lg">
        🚗
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium leading-none text-[var(--theme-ink)]">
          {from} - {to}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--theme-muted)]">
          <span>{formatDateTimeRaw(trip.departure_time)}</span>
          <span>{t("home.seatsOpen", { count: trip.available_seats })}</span>
          <span>{trip.distance_km} km</span>
        </div>
      </div>

      <span className="inline-flex w-fit shrink-0 rounded-full border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-3 py-1 text-xs font-medium text-[var(--theme-muted-strong)] sm:self-center">
        {t("common.open")}
      </span>
    </Link>
  );
}

/**
 * Group upcoming trips with a shared heading and empty state.
 *
 * @param props - Component props configuring the trip group.
 * @param props.title - Section title.
 * @param props.countLabel - Short summary label for the number of trips.
 * @param props.trips - Trips rendered in the section.
 * @param props.emptyMessage - Message shown when no trips are available.
 * @param props.allPath - Route to the full listing page.
 * @param props.detailsBasePath - Base path used to build detail links.
 * @returns The rendered dashboard trip section.
 */
function TripSection({
  title,
  countLabel,
  trips,
  emptyMessage,
  allPath,
  detailsBasePath,
}: {
  title: string;
  countLabel: string;
  trips: Trip[];
  emptyMessage: string;
  allPath: string;
  detailsBasePath: string;
}) {
  const { t } = useI18n();

  return (
    <section className="rounded-xl border border-[var(--theme-line)] bg-[var(--theme-surface)] p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-subtle)]">{t("home.atAGlance")}</p>
          <h2 className="mt-2 font-medium text-xl text-[var(--theme-ink)]">{title}</h2>
          <p className="mt-1 text-sm text-[var(--theme-muted)]">{countLabel}</p>
        </div>
        <Link
          to={allPath}
          className="w-fit shrink-0 rounded-full border border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-2 text-xs font-medium text-[var(--theme-muted-strong)] transition hover:border-[var(--theme-line-strong)] hover:text-[var(--theme-ink)]"
        >
          {t("common.seeAll")}
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-6 py-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--theme-surface)] text-2xl">🗓</div>
          <p className="mt-4 font-medium text-lg text-[var(--theme-ink)]">{t("home.nothingOnRoad")}</p>
          <p className="mt-1 text-sm text-[var(--theme-muted)]">{emptyMessage}</p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {trips.map((trip) => (
            <TripPreviewCard
              key={trip.id}
              trip={trip}
              detailsPath={`${detailsBasePath}/${trip.id}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

type Props = {
  person: Person | null;
  user: AuthUser | null;
  upcomingDriverTrips: Trip[];
  upcomingBookings: Trip[];
  upcomingDriverTripsCount: number;
  upcomingBookingsCount: number;
};

/**
 * Build the home dashboard for the signed-in user.
 *
 * @param props - Component props containing dashboard data.
 * @param props.person - Current person profile used for the greeting.
 * @param props.user - Authenticated user used for permission-based sections.
 * @param props.upcomingDriverTrips - Upcoming trips owned by the current driver.
 * @param props.upcomingBookings - Upcoming trips booked by the current rider.
 * @param props.upcomingDriverTripsCount - Total number of upcoming driver trips.
 * @param props.upcomingBookingsCount - Total number of upcoming bookings.
 * @returns The rendered home dashboard.
 */
export function HomeSection({
  person,
  user,
  upcomingDriverTrips,
  upcomingBookings,
  upcomingDriverTripsCount,
  upcomingBookingsCount,
}: Props) {
  const { t } = useI18n();
  const displayName = person?.pseudo ?? person?.first_name ?? "User";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-0">
      <div className="rounded-[1.75rem] border border-[var(--theme-line)] bg-[rgba(242,244,242,0.88)] px-4 py-5 shadow-[var(--theme-shadow-warm)] backdrop-blur-xl sm:px-6 sm:py-6 lg:px-7 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-start">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-subtle)]">{t("home.sharedRoutes")}</p>
            <h1 className="mt-3 max-w-3xl font-heading text-3xl font-extrabold leading-tight tracking-[-0.04em] text-[var(--theme-ink)] sm:text-4xl lg:text-5xl">
              {t("home.welcomeBack", { name: displayName })}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--theme-muted)] sm:text-base">
              {t("home.body")}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-[var(--theme-line)] bg-[var(--theme-surface)] p-5 shadow-[var(--theme-shadow-warm)]">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-subtle)]">{t("home.quickPulse")}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-lg bg-[var(--theme-bg-soft)] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-subtle)]">{t("home.driverTrips")}</p>
                <p className="mt-2 font-medium text-2xl text-[var(--theme-ink)]">{upcomingDriverTripsCount}</p>
              </div>
              <div className="rounded-lg bg-[var(--theme-bg-soft)] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-subtle)]">{t("home.bookings")}</p>
                <p className="mt-2 font-medium text-2xl text-[var(--theme-ink)]">{upcomingBookingsCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          {user?.permissions.can_manage_own_trips && (
            <TripSection
               title={t("home.myUpcomingDriverTrips")}
               countLabel={t("home.tripCount", { count: upcomingDriverTripsCount, suffix: upcomingDriverTripsCount !== 1 ? "s" : "" })}
               trips={upcomingDriverTrips}
               emptyMessage={t("home.emptyDriverTrips")}
              allPath="/my-trips"
              detailsBasePath="/my-trips"
            />
          )}

          {user?.permissions.can_view_bookings && (
            <TripSection
               title={t("home.myUpcomingBookings")}
               countLabel={t("home.bookingCount", { count: upcomingBookingsCount, suffix: upcomingBookingsCount !== 1 ? "s" : "" })}
               trips={upcomingBookings}
               emptyMessage={t("home.emptyBookings")}
              allPath="/bookings"
              detailsBasePath="/bookings"
            />
          )}
        </div>
      </div>
    </div>
  );
}
