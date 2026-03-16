import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMyDriverTrips } from "../../features/person/personApi";
import type { Trip } from "../../types/Trip";
import { formatDateTimeRaw } from "../../helpers/FormatDateTime.ts";

type TripStatus = "past" | "current" | "incoming";

function getTripStatus(trip: Trip): TripStatus {
    const now = new Date();

    const departure = new Date(trip.departure_time);
    const arrival = trip.arrival_time ? new Date(trip.arrival_time) : null;

    if (
        !Number.isNaN(arrival?.getTime() ?? NaN) &&
        arrival !== null &&
        arrival < now
    ) {
        return "past";
    }

    if (
        !Number.isNaN(departure.getTime()) &&
        arrival !== null &&
        !Number.isNaN(arrival.getTime()) &&
        departure <= now &&
        now <= arrival
    ) {
        return "current";
    }

    return "incoming";
}

function getTripCardClass(status: TripStatus): string {
    switch (status) {
        case "past":
            return "border border-red-200 bg-red-50";
        case "current":
            return "border border-green-200 bg-green-50";
        case "incoming":
            return "border border-orange-200 bg-orange-50";
        default:
            return "bg-white";
    }
}

function Section({
                     title,
                     emptyMessage,
                     trips,
                     status,
                 }: {
    title: string;
    emptyMessage: string;
    trips: Trip[];
    status: TripStatus;
}) {
    return (
        <div className="space-y-3">
            <h2 className="text-xl font-semibold">{title}</h2>

            {trips.length === 0 ? (
                <p className="text-sm text-slate-500">{emptyMessage}</p>
            ) : (
                trips.map((trip) => (
                    <Link
                        key={trip.id}
                        to={`/my-trips/${trip.id}`}
                        className={`block rounded-xl p-4 shadow-sm ${getTripCardClass(status)}`}
                    >
                        <div className="flex items-center justify-between">
                            <p className="font-semibold">
                                {trip.departure_address?.city?.name} → {trip.arrival_address?.city?.name}
                            </p>

                            <span className="text-xs font-medium uppercase text-slate-700">
                                {status}
                            </span>
                        </div>

                        <div className="mt-2 space-y-1 text-sm text-slate-600">
                            <p>
                                <span className="font-medium">Departure:</span>{" "}
                                {formatDateTimeRaw(trip.departure_time)}
                            </p>
                            <p>
                                <span className="font-medium">Arrival:</span>{" "}
                                {formatDateTimeRaw(trip.arrival_time)}
                            </p>
                            <p>
                                <span className="font-medium">Seats:</span> {trip.available_seats}
                            </p>
                            <p>
                                <span className="font-medium">Distance:</span> {trip.distance_km} km
                            </p>
                        </div>
                    </Link>
                ))
            )}
        </div>
    );
}

export default function MyTripsPage() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setError(null);

                const data = await getMyDriverTrips();
                setTrips(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load my trips");
            } finally {
                setLoading(false);
            }
        }

        void load();
    }, []);

    const currentTrips = useMemo(
        () => trips.filter((trip) => getTripStatus(trip) === "current"),
        [trips]
    );

    const incomingTrips = useMemo(
        () => trips.filter((trip) => getTripStatus(trip) === "incoming"),
        [trips]
    );

    const pastTrips = useMemo(
        () => trips.filter((trip) => getTripStatus(trip) === "past"),
        [trips]
    );

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">My Trips</h1>
                <Link
                    to="/my-trips/new"
                    className="rounded-xl bg-slate-900 px-4 py-3 text-white"
                >
                    Publish Trip
                </Link>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && !error && (
                <>
                    <Section
                        title="Current trips"
                        emptyMessage="No current trips."
                        trips={currentTrips}
                        status="current"
                    />

                    <Section
                        title="Incoming trips"
                        emptyMessage="No incoming trips."
                        trips={incomingTrips}
                        status="incoming"
                    />

                    <Section
                        title="Past trips"
                        emptyMessage="No past trips."
                        trips={pastTrips}
                        status="past"
                    />
                </>
            )}
        </section>
    );
}