import { Link } from "react-router-dom";
import { formatDateTimeRaw } from "../../helpers/FormatDateTime";
import type { Person } from "../../types/Person";
import type { Trip } from "../../types/Trip";
import type { AuthUser } from "../../types/MeResponse";

// ── TripPreviewCard ───────────────────────────────────────────────────────────

function TripPreviewCard({ trip, detailsPath }: { trip: Trip; detailsPath: string }) {
    return (
        <Link
            to={detailsPath}
            className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 transition hover:border-violet-200 hover:shadow-md sm:p-5"
        >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow">
                🚗
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-800">
                    {trip.departure_address?.city?.name ?? "Unknown"} →{" "}
                    {trip.arrival_address?.city?.name ?? "Unknown"}
                </p>
                <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-slate-400">
                    <span>{formatDateTimeRaw(trip.departure_time)}</span>
                    <span>{trip.available_seats} seats</span>
                    <span>{trip.distance_km} km</span>
                </div>
            </div>

            <span className="shrink-0 text-slate-300">›</span>
        </Link>
    );
}

// ── TripSection ───────────────────────────────────────────────────────────────

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
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 space-y-4 sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="font-semibold text-slate-800">{title}</h2>
                    <p className="mt-0.5 text-xs font-medium text-slate-400">{countLabel}</p>
                </div>
                <Link
                    to={allPath}
                    className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-violet-300 hover:text-violet-700"
                >
                    View all
                </Link>
            </div>

            {trips.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white py-8 text-center">
                    <span className="text-3xl">🗓</span>
                    <p className="text-sm text-slate-400">{emptyMessage}</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {trips.map((trip) => (
                        <TripPreviewCard
                            key={trip.id}
                            trip={trip}
                            detailsPath={`${detailsBasePath}/${trip.id}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// ── HomeSection ───────────────────────────────────────────────────────────────

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
        <div className="mx-auto max-w-lg space-y-6 px-4 py-6 sm:px-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Home</h1>
                    <p className="mt-0.5 text-sm text-slate-400">Welcome back, {displayName} 👋</p>
                </div>
                <button
                    onClick={onLogout}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-rose-200 hover:text-rose-600"
                >
                    Logout
                </button>
            </div>

            {/* Driver trips */}
            {user?.permissions.can_manage_own_trips && (
                <TripSection
                    title="My upcoming driver trips"
                    countLabel={`${upcomingDriverTripsCount} trip${upcomingDriverTripsCount !== 1 ? "s" : ""}`}
                    trips={upcomingDriverTrips}
                    emptyMessage="No upcoming driver trips."
                    allPath="/my-trips"
                    detailsBasePath="/my-trips"
                />
            )}

            {/* Bookings */}
            {user?.permissions.can_view_bookings && (
                <TripSection
                    title="My upcoming bookings"
                    countLabel={`${upcomingBookingsCount} booking${upcomingBookingsCount !== 1 ? "s" : ""}`}
                    trips={upcomingBookings}
                    emptyMessage="No upcoming bookings."
                    allPath="/bookings"
                    detailsBasePath="/bookings"
                />
            )}
        </div>
    );
}