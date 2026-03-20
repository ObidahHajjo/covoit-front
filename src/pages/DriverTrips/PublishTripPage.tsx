import { usePublishTrip } from "../../context/Driver/usePublishTrip";
import { PublishTripForm } from "../../components/ui/PublishTripForm";

export default function PublishTripPage() {
  const trip = usePublishTrip();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-0">
      <div className="overflow-hidden rounded-2xl border border-[var(--theme-line)] bg-[var(--theme-surface)] px-5 py-6 sm:px-7 sm:py-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--theme-muted)]">Publish a trip</p>
          <h1 className="mt-3 text-3xl font-medium leading-tight text-[var(--theme-ink)] sm:text-4xl">Offer a ride</h1>
          <p className="mt-4 text-sm leading-6 text-[var(--theme-muted-strong)] sm:text-base">Set timing, seats, and route details clearly so passengers understand the trip at a glance.</p>
        </div>

        <PublishTripForm
          tripDateTime={trip.tripDateTime}
          availableSeats={trip.availableSeats}
          smokingAllowed={trip.smokingAllowed}
          error={trip.error}
          submitting={trip.submitting}
          isSubmitDisabled={trip.isSubmitDisabled}
          starting={trip.starting}
          arrival={trip.arrival}
          onTripDateTimeChange={trip.setTripDateTime}
          onAvailableSeatsChange={trip.setAvailableSeats}
          onSmokingAllowedChange={trip.setSmokingAllowed}
          onStartingChange={trip.handleStartingChange}
          onArrivalChange={trip.handleArrivalChange}
          onStartingFocus={trip.openStartingDropdown}
          onStartingBlur={trip.closeStartingDropdown}
          onArrivalFocus={trip.openArrivalDropdown}
          onArrivalBlur={trip.closeArrivalDropdown}
          onSelectStarting={trip.selectStarting}
          onSelectArrival={trip.selectArrival}
          onSubmit={trip.handleSubmit}
        />
      </div>
    </div>
  );
}
