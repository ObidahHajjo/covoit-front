import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FloatingToast from "../../components/common/FloatingToast";
import { useMyTrips } from "../../context/Driver/useMyTrips";
import { MyTripsSection } from "../../components/ui/MyTripsSection";
import PageLoadingState from "../../components/common/PageLoadingState";

/**
 * Render the driver's trip management page with current, upcoming, and completed trip groupings.
 *
 * @returns The trips dashboard, a loading state, an error state, and optional transient toast feedback.
 */
export default function MyTripsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, error, currentTrips, incomingTrips, pastTrips } = useMyTrips();
  const toast = (location.state as { toast?: { tone: "success" | "error"; message: string } } | null)?.toast;

  useEffect(() => {
    if (!toast) return;

    // Remove the navigation state after the toast window closes to avoid showing stale feedback on revisit.
    const timer = window.setTimeout(() => {
      navigate(location.pathname, { replace: true, state: null });
    }, 7000);

    return () => window.clearTimeout(timer);
  }, [toast, navigate, location.pathname]);

  if (loading) {
    return <PageLoadingState title="Loading your trips" />;
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-0">
        <div className="rounded-2xl border border-[var(--theme-line)] bg-[var(--theme-surface)] px-6 py-14 text-center">
          <p className="text-4xl">⚠️</p>
          <p className="mt-3 text-sm font-medium text-[var(--theme-ink)]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {toast ? <FloatingToast tone={toast.tone} message={toast.message} durationMs={6500} /> : null}
      <MyTripsSection
        currentTrips={currentTrips}
        incomingTrips={incomingTrips}
        pastTrips={pastTrips}
      />
    </>
  );
}
