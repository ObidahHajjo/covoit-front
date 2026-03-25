import { useEffect, useMemo, useState } from "react";
import { getMyDriverTrips } from "../../features/person/personApi.ts";
import { useAuth } from "../Auth/useAuth.ts";
import type { Trip } from "../../types/Trip.ts";
import { translate } from "../../i18n/config.ts";

/**
 * Lists the trip timing buckets used to organize driver trips in the UI.
 */
export type TripStatus = "past" | "current" | "incoming";

/**
 * Classifies a trip based on its departure and arrival times.
 *
 * @param trip - Trip to classify.
 * @returns The computed timing bucket for the provided trip.
 */
export function getTripStatus(trip: Trip): TripStatus {
    const now = new Date();
    const departure = new Date(trip.departure_time);
    const arrival = trip.arrival_time ? new Date(trip.arrival_time) : null;

    if (arrival !== null && !Number.isNaN(arrival.getTime()) && arrival < now) {
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

/**
 * Loads the authenticated driver's trips and groups them by status.
 *
 * @returns Driver trip collections grouped into current, incoming, and past buckets.
 */
export function useMyTrips() {
    const { user } = useAuth();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        /**
         * Fetches the authenticated driver's trips.
         *
         * @returns A promise that resolves once trip data has been loaded.
         */
        async function load() {
            const personId = user?.person?.id;
            if (!personId) return;
            try {
                setLoading(true);
                setError(null);
                const data = await getMyDriverTrips(personId);
                setTrips(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : translate("driverTrips.loadFailed"));
            } finally {
                setLoading(false);
            }
        }
        void load();
    }, [user]);

    const currentTrips = useMemo(() => trips.filter((t) => getTripStatus(t) === "current"), [trips]);
    const incomingTrips = useMemo(() => trips.filter((t) => getTripStatus(t) === "incoming"), [trips]);
    const pastTrips = useMemo(() => trips.filter((t) => getTripStatus(t) === "past"), [trips]);

    return { loading, error, currentTrips, incomingTrips, pastTrips };
}
