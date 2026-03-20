import { Link } from "react-router-dom";
import { formatDateTimeRaw } from "../../helpers/FormatDateTime";
import type { Person } from "../../types/Person";
import type { Trip } from "../../types/Trip";
import type { AuthUser } from "../../types/MeResponse";

function TripPreviewCard({ trip, detailsPath }: { trip: Trip; detailsPath: string }) {
  const from = trip.departure_address?.city?.name ?? "Unknown";
  const to = trip.arrival_address?.city?.name ?? "Unknown";

  return (
    <Link
      to={detailsPath}
      className="group flex items-center gap-4 rounded-xl border border-[#eee] bg-white p-4 transition hover:border-[#ccc] sm:p-5"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#fafafa] text-lg">
        🚗
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium leading-none text-[#222]">
          {from} - {to}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#888]">
          <span>{formatDateTimeRaw(trip.departure_time)}</span>
          <span>{trip.available_seats} seats open</span>
          <span>{trip.distance_km} km</span>
        </div>
      </div>

      <span className="shrink-0 rounded-full border border-[#eee] bg-[#fafafa] px-3 py-1 text-xs font-medium text-[#666]">
        Open
      </span>
    </Link>
  );
}

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
  return (
    <section className="rounded-xl border border-[#eee] bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#999]">At a glance</p>
          <h2 className="mt-2 font-medium text-xl text-[#222]">{title}</h2>
          <p className="mt-1 text-sm text-[#888]">{countLabel}</p>
        </div>
        <Link
          to={allPath}
          className="shrink-0 rounded-full border border-[#eee] bg-white px-4 py-2 text-xs font-medium text-[#666] transition hover:border-[#ccc] hover:text-[#222]"
        >
          See all
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-[#eee] bg-[#fafafa] px-6 py-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl">🗓</div>
          <p className="mt-4 font-medium text-lg text-[#222]">Nothing on the road yet.</p>
          <p className="mt-1 text-sm text-[#888]">{emptyMessage}</p>
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
  onLogout: () => void;
};

export function HomeSection({
  person,
  user,
  upcomingDriverTrips,
  upcomingBookings,
  upcomingDriverTripsCount,
  upcomingBookingsCount,
  onLogout,
}: Props) {
  const displayName = person?.pseudo ?? person?.first_name ?? "User";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-0">
      <div className="rounded-xl border border-[#eee] bg-[#fafafa] px-5 py-6 sm:px-7 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(290px,0.8fr)] lg:items-start">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#999]">Shared routes</p>
            <h1 className="mt-3 max-w-3xl font-medium text-3xl leading-tight text-[#222] sm:text-4xl">
              Welcome back, {displayName}.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#888] sm:text-base">
              Keep an eye on departures, seat availability, and your latest bookings.
            </p>
          </div>

          <div className="rounded-xl border border-[#eee] bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-[#999]">Quick pulse</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-lg bg-[#fafafa] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[#999]">Driver trips</p>
                <p className="mt-2 font-medium text-2xl text-[#222]">{upcomingDriverTripsCount}</p>
              </div>
              <div className="rounded-lg bg-[#fafafa] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[#999]">Bookings</p>
                <p className="mt-2 font-medium text-2xl text-[#222]">{upcomingBookingsCount}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="mt-4 w-full rounded-full border border-[#222] bg-[#222] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#444]"
            >
              Log out
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          {user?.permissions.can_manage_own_trips && (
            <TripSection
              title="My upcoming driver trips"
              countLabel={`${upcomingDriverTripsCount} trip${upcomingDriverTripsCount !== 1 ? "s" : ""} in your lane`}
              trips={upcomingDriverTrips}
              emptyMessage="Publish your next route and it will show up here."
              allPath="/my-trips"
              detailsBasePath="/my-trips"
            />
          )}

          {user?.permissions.can_view_bookings && (
            <TripSection
              title="My upcoming bookings"
              countLabel={`${upcomingBookingsCount} booking${upcomingBookingsCount !== 1 ? "s" : ""} confirmed`}
              trips={upcomingBookings}
              emptyMessage="Once you reserve a seat, the trip will land here."
              allPath="/bookings"
              detailsBasePath="/bookings"
            />
          )}
        </div>
      </div>
    </div>
  );
}
