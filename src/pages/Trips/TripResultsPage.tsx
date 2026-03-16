import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getTrips } from "../../features/trips/tripApi";
import type { Trip } from "../../types/Trip";
import {formatDateTimeRaw} from "../../helpers/FormatDateTime.ts";
import { useError } from "../../app/ErrorContext";

export default function TripResultsPage() {
    const [searchParams] = useSearchParams();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const { showError } = useError();

    const params = {
        startingcity: searchParams.get("startingcity") ?? undefined,
        arrivalcity: searchParams.get("arrivalcity") ?? undefined,
        tripdate: searchParams.get("tripdate") ?? undefined,
    };

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const data = await getTrips(params);
                setTrips(data);
            } catch (err) {
                showError(err instanceof Error ? err.message : "Failed to load trips");
            } finally {
                setLoading(false);
            }
        }

        void load();
    }, [searchParams]);

    return (
        <section className="space-y-4">
            <h1 className="text-2xl font-bold">Trip Results</h1>

            {loading && <p>Loading trips...</p>}

            {!loading && (
                <div className="space-y-3">
                    {trips.map((trip) => (
                        <Link key={trip.id} to={`/trips/${trip.id}`} className="block rounded-xl bg-white p-4 shadow-sm">
                            <p className="font-semibold">
                                {trip.departure_address?.city?.name ?? "Unknown"} → {trip.arrival_address?.city?.name ?? "Unknown"}
                            </p>
                            <p className="text-sm text-slate-500">{formatDateTimeRaw(trip.departure_time)}</p>
                            <p className="text-sm text-slate-500">Seats: {trip.available_seats}</p>
                        </Link>
                    ))}

                    {trips.length === 0 && <p>No trips found.</p>}
                </div>
            )}
        </section>
    );
}