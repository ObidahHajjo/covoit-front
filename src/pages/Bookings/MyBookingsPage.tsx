import { MyBookingsPageSection } from "../../components/ui/Booking/MyBookingsPageSection";
import { useMyBookingsPage } from "../../hooks/Booking/useMyBookingsPage";

/**
 * Render the bookings overview page with the user's current reservations, past bookings, and transient feedback toast.
 *
 * @returns The bookings page content with loading, error, and toast states.
 */
export default function MyBookingsPage() {
  const { bookings, loading, error, toast } = useMyBookingsPage();

  return (
    <MyBookingsPageSection bookings={bookings} loading={loading} error={error} toast={toast} />
  );
}
