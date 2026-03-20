import { usePublishTrip } from "../../context/Driver/usePublishTrip";
import { PublishTripForm } from "../../components/ui/PublishTripForm";

export default function PublishTripPage() {
    const trip = usePublishTrip();

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-0">
            <div className="overflow-hidden rounded-[40px] border border-[#efe2d4] bg-[linear-gradient(180deg,rgba(255,247,238,0.96),rgba(247,237,226,0.88))] px-5 py-6 shadow-[0_36px_90px_-50px_rgba(24,53,45,0.45)] sm:px-7 sm:py-8">
                <div className="mb-8 max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b06f60]">Publish a trip</p>
                    <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.02] text-[#18352d] sm:text-5xl">Offer a ride with a softer, friendlier publishing flow.</h1>
                    <p className="mt-4 text-sm leading-6 text-[#4c655b] sm:text-base">Set timing, seats, and route details clearly so passengers understand the trip at a glance.</p>
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
