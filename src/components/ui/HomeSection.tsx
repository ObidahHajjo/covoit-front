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
            className="group flex items-center gap-4 rounded-[28px] border border-white/70 bg-white/75 p-4 text-[#18352d] shadow-[0_22px_60px_-34px_rgba(24,53,45,0.35)] backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:border-[#f3b8ab] hover:bg-white/90 sm:p-5"
        >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#f26f5a] to-[#de8f62] text-lg text-white shadow-[0_16px_34px_-18px_rgba(242,111,90,0.75)]">
                🚗
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-lg font-semibold leading-none text-[#18352d]">
                    {from} - {to}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-[#5d746b]">
                    <span>{formatDateTimeRaw(trip.departure_time)}</span>
                    <span>{trip.available_seats} seats open</span>
                    <span>{trip.distance_km} km</span>
                </div>
            </div>

            <span className="shrink-0 rounded-full bg-[#f7ede2] px-3 py-1 text-xs font-semibold text-[#8c4d3f] transition group-hover:bg-[#fce3db]">
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
        <section className="rounded-[32px] border border-white/65 bg-white/55 p-5 text-[#18352d] shadow-[0_28px_80px_-44px_rgba(24,53,45,0.42)] backdrop-blur-xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#b06f60]">At a glance</p>
                    <h2 className="mt-2 font-serif text-[1.7rem] font-semibold leading-tight text-[#18352d]">{title}</h2>
                    <p className="mt-1 text-sm text-[#5d746b]">{countLabel}</p>
                </div>
                <Link
                    to={allPath}
                    className="shrink-0 rounded-full border border-[#d8cfc2] bg-[#fff9f4] px-4 py-2 text-xs font-semibold text-[#335246] transition hover:border-[#f3b8ab] hover:text-[#8c4d3f]"
                >
                    See all
                </Link>
            </div>

            {trips.length === 0 ? (
                <div className="mt-5 rounded-[28px] border border-dashed border-[#d8cfc2] bg-[#fffaf6]/90 px-6 py-10 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f7ede2] text-2xl">🗓</div>
                    <p className="mt-4 font-serif text-xl text-[#18352d]">Nothing on the road yet.</p>
                    <p className="mt-1 text-sm text-[#5d746b]">{emptyMessage}</p>
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
            <div className="overflow-hidden rounded-[40px] border border-[#efe2d4] bg-[linear-gradient(180deg,rgba(255,247,238,0.96),rgba(247,237,226,0.88))] px-5 py-6 shadow-[0_36px_90px_-50px_rgba(24,53,45,0.45)] sm:px-7 sm:py-8">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(290px,0.8fr)] lg:items-start">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b06f60]">Shared routes</p>
                        <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold leading-[1.02] text-[#18352d] sm:text-5xl">
                            Welcome back, {displayName}. Your ride board feels ready for a softer, warmer day.
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#4c655b] sm:text-base">
                            Keep an eye on departures, seat availability, and your latest bookings from one calm editorial dashboard.
                        </p>
                    </div>

                    <div className="rounded-[32px] border border-white/70 bg-white/60 p-5 backdrop-blur-xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#b06f60]">Quick pulse</p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                            <div className="rounded-[24px] bg-[#fffaf6] p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a8f86]">Driver trips</p>
                                <p className="mt-2 font-serif text-3xl text-[#18352d]">{upcomingDriverTripsCount}</p>
                            </div>
                            <div className="rounded-[24px] bg-[#fffaf6] p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a8f86]">Bookings</p>
                                <p className="mt-2 font-serif text-3xl text-[#18352d]">{upcomingBookingsCount}</p>
                            </div>
                        </div>
                        <button
                            onClick={onLogout}
                            className="mt-4 w-full rounded-full border border-[#f3b8ab] bg-[#f26f5a] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_-18px_rgba(242,111,90,0.75)] transition hover:bg-[#e4604b]"
                        >
                            Log out for now
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
