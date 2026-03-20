import { Link } from "react-router-dom";
import { formatDateTimeRaw } from "../../helpers/FormatDateTime";
import type { Trip } from "../../types/Trip";
import type { TripStatus } from "../../context/Driver/useMyTrips";

const STATUS_CONFIG: Record<TripStatus, { label: string; badge: string; accent: string }> = {
    current: {
        label: "On the road",
        badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
        accent: "from-[#dff3e8] to-[#fff9f4]",
    },
    incoming: {
        label: "Coming up",
        badge: "border-[#f3b8ab] bg-[#fce3db] text-[#8c4d3f]",
        accent: "from-[#fff3ec] to-[#fffaf6]",
    },
    past: {
        label: "Archive",
        badge: "border-[#d8cfc2] bg-[#f7f1ea] text-[#5d746b]",
        accent: "from-[#f7f1ea] to-[#fffaf6]",
    },
};

function TripCard({ trip, status }: { trip: Trip; status: TripStatus }) {
    const config = STATUS_CONFIG[status];
    const from = trip.departure_address?.city?.name ?? "Unknown";
    const to = trip.arrival_address?.city?.name ?? "Unknown";

    return (
        <Link
            to={`/my-trips/${trip.id}`}
            className={`group flex min-w-0 flex-col gap-4 rounded-[28px] border border-white/70 bg-gradient-to-br ${config.accent} p-4 text-[#18352d] shadow-[0_20px_55px_-36px_rgba(24,53,45,0.35)] transition hover:-translate-y-0.5 hover:border-[#f3b8ab] sm:flex-row sm:items-start sm:p-5`}
        >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#f26f5a] to-[#de8f62] text-lg text-white shadow-[0_16px_34px_-18px_rgba(242,111,90,0.75)]">
                🚗
            </div>

            <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-col items-start justify-between gap-2 sm:flex-row">
                    <p className="min-w-0 font-serif text-xl leading-tight text-[#18352d] sm:truncate">{from} - {to}</p>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${config.badge}`}>
                        {config.label}
                    </span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-medium text-[#5d746b]">
                    <span className="rounded-full bg-white/75 px-3 py-1">Departure {formatDateTimeRaw(trip.departure_time)}</span>
                    <span className="rounded-full bg-white/75 px-3 py-1">Arrival {formatDateTimeRaw(trip.arrival_time)}</span>
                    <span className="rounded-full bg-white/75 px-3 py-1">{trip.available_seats} seats</span>
                    <span className="rounded-full bg-white/75 px-3 py-1">{trip.distance_km} km</span>
                </div>
            </div>
        </Link>
    );
}

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
        <section className="min-w-0 rounded-[32px] border border-white/65 bg-white/55 p-5 text-[#18352d] shadow-[0_28px_80px_-44px_rgba(24,53,45,0.42)] backdrop-blur-xl sm:p-6">
            <div className="flex min-w-0 items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f7ede2] text-lg">{icon}</span>
                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b06f60]">Trip lane</p>
                        <h2 className="truncate font-serif text-2xl leading-tight text-[#18352d]">{title}</h2>
                    </div>
                </div>
                <span className="rounded-full border border-[#d8cfc2] bg-[#fff9f4] px-3 py-1 text-xs font-semibold text-[#335246]">
                    {trips.length}
                </span>
            </div>

            {trips.length === 0 ? (
                <div className="mt-5 rounded-[28px] border border-dashed border-[#d8cfc2] bg-[#fffaf6]/90 px-6 py-10 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f7ede2] text-2xl">🗓</div>
                    <p className="mt-4 font-serif text-xl text-[#18352d]">No trips in this lane.</p>
                    <p className="mt-1 text-sm text-[#5d746b]">{emptyMessage}</p>
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

export function MyTripsSection({ currentTrips, incomingTrips, pastTrips }: Props) {
    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-0">
            <div className="overflow-hidden rounded-[40px] border border-[#efe2d4] bg-[linear-gradient(180deg,rgba(255,247,238,0.96),rgba(247,237,226,0.88))] px-5 py-6 shadow-[0_36px_90px_-50px_rgba(24,53,45,0.45)] sm:px-7 sm:py-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b06f60]">Driver desk</p>
                        <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.02] text-[#18352d] sm:text-5xl">Shape every published ride with the same warm, easy rhythm.</h1>
                        <p className="mt-4 text-sm leading-6 text-[#4c655b] sm:text-base">Track what is active now, what is scheduled next, and what has already rolled through.</p>
                    </div>
                    <Link
                        to="/my-trips/new"
                        className="inline-flex w-full items-center justify-center rounded-full bg-[#f26f5a] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_38px_-20px_rgba(242,111,90,0.75)] transition hover:bg-[#e4604b] sm:w-auto"
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
