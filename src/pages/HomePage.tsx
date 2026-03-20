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
            <div className="flex min-h-[60vh] items-center justify-center rounded-[40px] bg-[linear-gradient(180deg,rgba(255,247,238,0.96),rgba(247,237,226,0.88))] px-4">
                <div className="space-y-3 text-center">
                    <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-[#eadfd2] border-t-[#f26f5a]" />
                    <p className="text-sm text-[#5d746b]">Loading your dashboard...</p>
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
