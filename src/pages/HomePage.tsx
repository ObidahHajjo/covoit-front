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
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fafafa] px-4">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-2 border-[#eee] border-t-[#222]" />
          <p className="text-sm text-[#888]">Loading your dashboard...</p>
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
