import { useHome } from "../context/Home/useHome";
import { HomeSection } from "../components/ui/HomeSection";

export default function HomePage() {
    const {
        person,
        user,
        loading,
        upcomingDriverTrips,
        upcomingBookings,
        upcomingDriverTripsCount,
        upcomingBookingsCount,
        handleLogout,
    } = useHome();

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="space-y-3 text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-500" />
                    <p className="text-sm text-slate-400">Loading…</p>
                </div>
            </div>
        );
    }

    return (
        <HomeSection
            person={person}
            user={user}
            upcomingDriverTrips={upcomingDriverTrips}
            upcomingBookings={upcomingBookings}
            upcomingDriverTripsCount={upcomingDriverTripsCount}
            upcomingBookingsCount={upcomingBookingsCount}
            onLogout={handleLogout}
        />
    );
}