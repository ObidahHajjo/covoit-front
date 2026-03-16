import {useEffect, useMemo, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {getMyDriverTrips, getMyPassengerTrips, getPerson} from "../features/person/personApi";
import type {Person} from "../types/Person";
import type {Trip} from "../types/Trip";
import {formatDateTimeRaw} from "../helpers/FormatDateTime";
import {logout} from "../features/auth/authApi";
import {useAuth} from "../context/useAuth";


function isUpcomingTrip(trip: Trip): boolean {
    const departure = new Date(trip.departure_time);

    if (Number.isNaN(departure.getTime())) {
        return false;
    }

    return departure >= new Date();
}

function TripPreviewCard({
                             trip,
                             detailsPath,
                         }: {
    trip: Trip;
    detailsPath: string;
}) {
    return (
        <Link
            to={detailsPath}
            className="block rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 transition hover:bg-slate-100"
        >
            <p className="font-medium">
                {trip.departure_address?.city?.name ?? "Unknown"} → {trip.arrival_address?.city?.name ?? "Unknown"}
            </p>

            <div className="mt-1 text-sm text-slate-600">
                <p>
                    <span className="font-medium">Departure:</span> {formatDateTimeRaw(trip.departure_time)}
                </p>
                <p>
                    <span className="font-medium">Seats:</span> {trip.available_seats}
                </p>
                <p>
                    <span className="font-medium">Distance:</span> {trip.distance_km} km
                </p>
            </div>
        </Link>
    );
}

function TripSection({
                         title,
                         countLabel,
                         trips,
                         emptyMessage,
                         allPath,
                         detailsBasePath,
                     }: {
    title: string;
    countLabel: string;
    trips: Trip[];
    emptyMessage: string;
    allPath: string;
    detailsBasePath: string;
}) {
    return (
        <div className="rounded-xl bg-white p-4 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="font-semibold">{title}</h2>
                    <p className="mt-1 text-sm text-slate-600">{countLabel}</p>
                </div>

                <Link
                    to={allPath}
                    className="text-sm font-medium text-slate-700 underline underline-offset-4"
                >
                    View all
                </Link>
            </div>

            {trips.length === 0 ? (
                <p className="text-sm text-slate-500">{emptyMessage}</p>
            ) : (
                <div className="space-y-3">
                    {trips.map((trip) => (
                        <TripPreviewCard
                            key={trip.id}
                            trip={trip}
                            detailsPath={`${detailsBasePath}/${trip.id}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function HomePage() {
    const navigate = useNavigate();
    const [person, setPerson] = useState<Person | null>(null);
    const [driverTrips, setDriverTrips] = useState<Trip[]>([]);
    const [bookings, setBookings] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const {logoutLocal, user} = useAuth();

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setError(null);

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
            navigate("/login", {replace: true});
        }
    }

    const upcomingDriverTrips = useMemo(() => {
        return driverTrips
            .filter(isUpcomingTrip)
            .sort((a, b) => new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime())
            .slice(0, 3);
    }, [driverTrips]);

    const upcomingBookings = useMemo(() => {
        return bookings
            .filter(isUpcomingTrip)
            .sort((a, b) => new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime())
            .slice(0, 3);
    }, [bookings]);

    const upcomingDriverTripsCount = useMemo(() => {
        return driverTrips.filter(isUpcomingTrip).length;
    }, [driverTrips]);

    const upcomingBookingsCount = useMemo(() => {
        return bookings.filter(isUpcomingTrip).length;
    }, [bookings]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <section className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Home</h1>
                    <p className="text-sm text-slate-500">
                        Welcome {person?.pseudo ?? person?.first_name ?? "User"}
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    className="rounded-xl bg-slate-900 px-4 py-3 text-white"
                >
                    Logout
                </button>
            </div>

            {user?.permissions.can_manage_own_trips && (
                <TripSection
                    title="My upcoming driver trips"
                    countLabel={`${upcomingDriverTripsCount} trip(s)`}
                    trips={upcomingDriverTrips}
                    emptyMessage="No upcoming driver trips."
                    allPath="/my-trips"
                    detailsBasePath="/my-trips"
                />
            )}
            {user?.permissions.can_view_bookings && (
                <TripSection
                    title="My upcoming bookings"
                    countLabel={`${upcomingBookingsCount} booking(s)`}
                    trips={upcomingBookings}
                    emptyMessage="No upcoming bookings."
                    allPath="/bookings"
                    detailsBasePath="/bookings"
                />
            )}
        </section>
    );
}