import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyPassengerTrips } from "../../features/person/personApi";
import type { Trip } from "../../types/Trip";

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const data = await getMyPassengerTrips();
                setBookings(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load bookings");
            } finally {
                setLoading(false);
            }
        }

        void load();
    }, []);

    return (
        <section className="space-y-4">
            <h1 className="text-2xl font-bold">My Bookings</h1>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && bookings.map((trip) => (
                <Link key={trip.id} to={`/bookings/${trip.id}`} className="block rounded-xl bg-white p-4 shadow-sm">
                    <p className="font-semibold">
                        {trip.departure_address?.city?.name} → {trip.arrival_address?.city?.name}
                    </p>
                    <p className="text-sm text-slate-500">{trip.departure_time}</p>
                </Link>
            ))}
            {!loading && !error && bookings.length === 0 && <p>No bookings found.</p>}
        </section>
    );
}