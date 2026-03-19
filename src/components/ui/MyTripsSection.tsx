import { Link } from "react-router-dom";
import { formatDateTimeRaw } from "../../helpers/FormatDateTime";
import type { Trip } from "../../types/Trip";
import type { TripStatus } from "../../context/Driver/useMyTrips";

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
    TripStatus,
    { label: string; icon: string; badge: string; card: string }
> = {
    current: {
        label: "Current",
        icon: "🟢",
        badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
        card: "border-emerald-200 hover:border-emerald-300",
    },
    incoming: {
        label: "Incoming",
        icon: "🕐",
        badge: "border-orange-200 bg-orange-50 text-orange-700",
        card: "border-slate-200 hover:border-violet-200",
    },
    past: {
        label: "Past",
        icon: "✓",
        badge: "border-slate-200 bg-slate-100 text-slate-500",
        card: "border-slate-200 opacity-75 hover:border-slate-300",
    },
};

// ── TripCard ──────────────────────────────────────────────────────────────────

function TripCard({ trip, status }: { trip: Trip; status: TripStatus }) {
    const { label, badge, card } = STATUS_CONFIG[status];
    const from = trip.departure_address?.city?.name ?? "Unknown";
    const to = trip.arrival_address?.city?.name ?? "Unknown";

    return (
        <Link
            to={`/my-trips/${trip.id}`}
            className={`flex items-start gap-4 rounded-3xl border bg-white p-4 transition hover:shadow-md sm:p-5 ${card}`}
        >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow">
                🚗
            </div>

            <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                    <p className="truncate font-semibold text-slate-800">{from} → {to}</p>
                    <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badge}`}>
                        {label}
                    </span>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span>🕐 {formatDateTimeRaw(trip.departure_time)}</span>
                    <span>🏁 {formatDateTimeRaw(trip.arrival_time)}</span>
                    <span>💺 {trip.available_seats} seats</span>
                    <span>📍 {trip.distance_km} km</span>
                </div>
            </div>

            <span className="shrink-0 self-center text-slate-300">›</span>
        </Link>
    );
}

// ── TripGroup ─────────────────────────────────────────────────────────────────

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
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 space-y-4 sm:p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span>{icon}</span>
                    <h2 className="font-semibold text-slate-800">{title}</h2>
                </div>
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-500">
                    {trips.length}
                </span>
            </div>

            {trips.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white py-8 text-center">
                    <span className="text-3xl">🗓</span>
                    <p className="text-sm text-slate-400">{emptyMessage}</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {trips.map((trip) => (
                        <TripCard key={trip.id} trip={trip} status={status} />
                    ))}
                </div>
            )}
        </div>
    );
}

// ── MyTripsSection ────────────────────────────────────────────────────────────

type Props = {
    currentTrips: Trip[];
    incomingTrips: Trip[];
    pastTrips: Trip[];
};

export function MyTripsSection({ currentTrips, incomingTrips, pastTrips }: Props) {
    return (
        <div className="mx-auto max-w-lg space-y-6 px-4 py-6 sm:px-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Trips</h1>
                    <p className="mt-1 text-sm text-slate-400">Manage your driver trips</p>
                </div>
                <Link
                    to="/my-trips/new"
                    className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:from-violet-700 hover:to-indigo-700"
                >
                    + Publish
                </Link>
            </div>

            <TripGroup
                title="Current trips"
                icon="🟢"
                trips={currentTrips}
                status="current"
                emptyMessage="No current trips."
            />

            <TripGroup
                title="Incoming trips"
                icon="🕐"
                trips={incomingTrips}
                status="incoming"
                emptyMessage="No incoming trips."
            />

            <TripGroup
                title="Past trips"
                icon="📁"
                trips={pastTrips}
                status="past"
                emptyMessage="No past trips."
            />
        </div>
    );
}