import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyDriverTrips, getMyPassengerTrips, getPerson } from "../../features/person/personApi.ts";
import { useAuth } from "../Auth/useAuth.ts";
import type { Person } from "../../types/Person.ts";
import type { Trip } from "../../types/Trip.ts";

/**
 * Returns whether a trip is still upcoming.
 *
 * @param trip - Trip to evaluate.
 * @returns `true` when the trip departure is in the future.
 */
function isUpcomingTrip(trip: Trip): boolean {
    const departure = new Date(trip.departure_time);
    if (Number.isNaN(departure.getTime())) return false;
    return departure >= new Date();
}

/**
 * Sorts upcoming trips by departure time and limits the returned list size.
 *
 * @param trips - Trips to filter and sort.
 * @param limit - Maximum number of upcoming trips to keep.
 * @returns The earliest upcoming trips up to the requested limit.
 */
function sortAndSlice(trips: Trip[], limit = 3): Trip[] {
    return trips
        .filter(isUpcomingTrip)
        .sort((a, b) => new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime())
        .slice(0, limit);
}

/**
 * Loads dashboard data for the authenticated home page.
 *
 * @returns Home dashboard state, counts, and upcoming-trip collections.
 */
export function useHome() {
    const navigate = useNavigate();
    const { logoutLocal, user } = useAuth();

    const [person, setPerson] = useState<Person | null>(null);
    const [driverTrips, setDriverTrips] = useState<Trip[]>([]);
    const [bookings, setBookings] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        /**
         * Fetches the dashboard profile snapshot and trip collections.
         *
         * @returns A promise that resolves once home data has been loaded.
         */
        async function load() {
            try {
                setLoading(true);
                const personId = user?.person?.id;
                if (!personId) return;
                const [me, myDriverTrips, myBookings] = await Promise.all([
                    getPerson(personId),
                    getMyDriverTrips(personId),
                    getMyPassengerTrips(personId),
                ]);
                setPerson(me);
                setDriverTrips(myDriverTrips);
                setBookings(myBookings);
            } catch {
                logoutLocal();
                navigate("/login", { replace: true });
            } finally {
                setLoading(false);
            }
        }
        void load();
    }, [logoutLocal, navigate]);

    const upcomingDriverTrips = useMemo(() => sortAndSlice(driverTrips), [driverTrips]);
    const upcomingBookings = useMemo(() => sortAndSlice(bookings), [bookings]);

    const upcomingDriverTripsCount = useMemo(
        () => driverTrips.filter(isUpcomingTrip).length,
        [driverTrips],
    );
    const upcomingBookingsCount = useMemo(
        () => bookings.filter(isUpcomingTrip).length,
        [bookings],
    );

    return {
        person,
        user,
        loading,
        upcomingDriverTrips,
        upcomingBookings,
        upcomingDriverTripsCount,
        upcomingBookingsCount,
    };
}
