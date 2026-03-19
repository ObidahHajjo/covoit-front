import { usePublishTrip } from "../../context/Driver/usePublishTrip";
import { PublishTripForm } from "../../components/ui/PublishTripForm";

export default function PublishTripPage() {
    const trip = usePublishTrip();

    return (
        <div className="mx-auto max-w-lg space-y-6 px-4 py-6 sm:px-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Publish Trip</h1>
                <p className="mt-1 text-sm text-slate-400">Fill in the details to offer a ride</p>
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
    );
}