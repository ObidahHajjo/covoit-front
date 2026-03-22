import { useEffect, useState } from "react";
import { getMyPassengerTrips } from "../../features/person/personApi";
import type { Trip } from "../../types/Trip";

/**
 * Loads the authenticated passenger's bookings list.
 *
 * @returns Booking list state for the current passenger.
 */
export function useMyBookings() {
    const [bookings, setBookings] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setError(null);
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

    return { bookings, loading, error };
}
