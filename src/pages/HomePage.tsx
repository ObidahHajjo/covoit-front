import PageLoadingState from "../components/common/PageLoadingState";
import { HomeSection } from "../components/ui/HomeSection";
import { useHome } from "../context/Home/useHome";
import { useI18n } from "../i18n/I18nProvider";

/**
 * Display the authenticated user's home dashboard with their profile snapshot and upcoming trip activity.
 *
 * @returns The home dashboard content or a loading state while dashboard data is being prepared.
 */
export default function HomePage() {
  const { t } = useI18n();
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
    return <PageLoadingState title={t("loading.dashboard")} />;
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
