import { useEffect, useMemo, useState } from "react";
import { getMyDriverTrips } from "../../features/person/personApi";
import type { Trip } from "../../types/Trip";

export type TripStatus = "past" | "current" | "incoming";

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

export function useMyTrips() {
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

    const currentTrips = useMemo(() => trips.filter((t) => getTripStatus(t) === "current"), [trips]);
    const incomingTrips = useMemo(() => trips.filter((t) => getTripStatus(t) === "incoming"), [trips]);
    const pastTrips = useMemo(() => trips.filter((t) => getTripStatus(t) === "past"), [trips]);

    return { loading, error, currentTrips, incomingTrips, pastTrips };
}