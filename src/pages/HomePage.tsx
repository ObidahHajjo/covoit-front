import PageLoadingState from "../components/common/PageLoadingState";
import { HomeSection } from "../components/ui/HomeSection";
import { useHome } from "../context/Home/useHome";

export default function HomePage() {
  const {
    person,
    user,
    loading,
    upcomingDriverTrips,
    upcomingBookings,
    upcomingDriverTripsCount,
    upcomingBookingsCount,
  } = useHome();

  if (loading) {
    return <PageLoadingState title="Loading your dashboard" />;
  }

  return (
    <HomeSection
      person={person}
      user={user}
      upcomingDriverTrips={upcomingDriverTrips}
      upcomingBookings={upcomingBookings}
      upcomingDriverTripsCount={upcomingDriverTripsCount}
      upcomingBookingsCount={upcomingBookingsCount}
    />
  );
}
