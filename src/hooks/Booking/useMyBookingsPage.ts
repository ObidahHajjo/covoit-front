import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMyBookings } from "./useMyBookings";

type BookingsToast = { tone: "success" | "error"; message: string };

/**
 * Coordinates bookings-page data with router-driven toast feedback.
 *
 * @returns Bookings state plus the transient toast payload.
 */
export function useMyBookingsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookings, loading, error } = useMyBookings();
  const toast = (location.state as { toast?: BookingsToast } | null)?.toast;

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      navigate(location.pathname, { replace: true, state: null });
    }, 7000);

    return () => window.clearTimeout(timer);
  }, [toast, navigate, location.pathname]);

  return {
    bookings,
    loading,
    error,
    toast,
  };
}
