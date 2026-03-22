import { useDriverTripDetails } from "../../context/Driver/useDriverTripDetails";
import { DriverTripDetailsSection } from "../../components/ui/DriverTripDetailsSection";
import PageLoadingState from "../../components/common/PageLoadingState";
import { useI18n } from "../../i18n/I18nProvider";

/**
 * Render the details page for a driver's published trip with passenger management and cancellation actions.
 *
 * @returns The driver trip details view, a loading state, or a not-found fallback when the trip is unavailable.
 */
export default function DriverTripDetailsPage() {
  const { t } = useI18n();
  const {
    trip,
    passengers,
    loading,
    error,
    cancelling,
    handleCancelTrip,
    openPassengerChat,
  } = useDriverTripDetails();

  if (loading) {
    return <PageLoadingState title={t("loading.trip")} />;
  }

  if (!trip) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-0">
        <div className="rounded-2xl border border-dashed border-[var(--theme-line)] bg-[var(--theme-surface)] px-6 py-14 text-center">
          <p className="text-4xl">🔍</p>
          <p className="mt-3 text-sm font-medium text-[var(--theme-muted)]">
            {error ?? t("trip.notFound")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <DriverTripDetailsSection
      trip={trip}
      passengers={passengers}
      error={error}
      cancelling={cancelling}
      onCancelTrip={handleCancelTrip}
      onContactPassenger={openPassengerChat}
    />
  );
}
