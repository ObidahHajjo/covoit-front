import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyDriverTrips, getMyPassengerTrips, getPerson } from "../../features/person/personApi";
import { logout } from "../../features/auth/authApi";
import { useAuth } from "../useAuth.ts";
import type { Person } from "../../types/Person";
import type { Trip } from "../../types/Trip";

function isUpcomingTrip(trip: Trip): boolean {
    const departure = new Date(trip.departure_time);
    if (Number.isNaN(departure.getTime())) return false;
    return departure >= new Date();
}

function sortAndSlice(trips: Trip[], limit = 3): Trip[] {
    return trips
        .filter(isUpcomingTrip)
        .sort((a, b) => new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime())
        .slice(0, limit);
}

export function useHome() {
    const navigate = useNavigate();
    const { logoutLocal, user } = useAuth();

    const [person, setPerson] = useState<Person | null>(null);
    const [driverTrips, setDriverTrips] = useState<Trip[]>([]);
    const [bookings, setBookings] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const [me, myDriverTrips, myBookings] = await Promise.all([
                    getPerson(),
                    getMyDriverTrips(),
                    getMyPassengerTrips(),
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

    async function handleLogout() {
        try {
            await logout();
        } finally {
            logoutLocal();
            localStorage.removeItem("refresh_token");
            sessionStorage.removeItem("personId");
            navigate("/login", { replace: true });
        }
    }

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
        handleLogout,
    };
}