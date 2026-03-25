import { useEffect, useState } from "react";
import { getMyPassengerTrips } from "../../features/person/personApi.ts";
import { useAuth } from "../Auth/useAuth.ts";
import type { Trip } from "../../types/Trip.ts";
import { translate } from "../../i18n/config.ts";

/**
 * Loads the authenticated passenger's bookings list.
 *
 * @returns Booking list state for the current passenger.
 */
export function useMyBookings() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        /**
         * Fetches the authenticated passenger's booked trips.
         *
         * @returns A promise that resolves once bookings have been loaded.
         */
        async function load() {
            const personId = user?.person?.id;
            if (!personId) return;
            try {
                setLoading(true);
                setError(null);
                const data = await getMyPassengerTrips(personId);
                setBookings(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : translate("bookings.loadFailed"));
            } finally {
                setLoading(false);
            }
        }
        void load();
    }, [user]);

    return { bookings, loading, error };
}
