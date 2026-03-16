import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cancelTripAsDriver, getTripById, getTripPassengers } from "../../features/trips/tripApi";
import type { Person } from "../../types/Person";
import type { Trip } from "../../types/Trip";
import {formatDateTimeRaw} from "../../helpers/FormatDateTime.ts";

export default function DriverTripDetailsPage() {
    const { tripId } = useParams();
    const navigate = useNavigate();

    const [trip, setTrip] = useState<Trip | null>(null);
    const [passengers, setPassengers] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setError(null);

                if (!tripId) {
                    throw new Error("Missing tripId");
                }

                const [tripData, passengerData] = await Promise.all([
                    getTripById(Number(tripId)),
                    getTripPassengers(Number(tripId)),
                ]);

                setTrip(tripData);
                setPassengers(passengerData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load trip details");
            } finally {
                setLoading(false);
            }
        }

        void load();
    }, [tripId]);

    async function handleCancelTrip() {
        if (!tripId) return;

        try {
            await cancelTripAsDriver(Number(tripId));
            navigate("/my-trips");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to cancel trip");
        }
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-600">{error}</p>;
    }

    if (!trip) {
        return <p>Trip not found.</p>;
    }

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Manage Trip</h1>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                    Trip #{trip.id}
                </span>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm space-y-6">
                <div>
                    <h2 className="text-lg font-semibold">Route</h2>
                    <p className="mt-1 text-base">
                        {trip.departure_address?.city?.name} → {trip.arrival_address?.city?.name}
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                        <h3 className="font-semibold">Trip information</h3>
                        <div className="mt-3 space-y-2 text-sm">
                            <p><span className="font-medium">Departure time:</span> {formatDateTimeRaw(trip.departure_time)}</p>
                            <p><span className="font-medium">Arrival time:</span> {formatDateTimeRaw(trip.arrival_time)}</p>
                            <p><span className="font-medium">Distance:</span> {trip.distance_km} km</p>
                            <p><span className="font-medium">Available seats:</span> {trip.available_seats}</p>
                            <p><span className="font-medium">Smoking allowed:</span> {trip.smoking_allowed ? "Yes" : "No"}</p>
                        </div>
                    </div>

                    <div className="rounded-lg border p-4">
                        <h3 className="font-semibold">Driver</h3>
                        <div className="mt-3 space-y-2 text-sm">
                            <p><span className="font-medium">First name:</span> {trip.driver?.first_name ?? "—"}</p>
                            <p><span className="font-medium">Last name:</span> {trip.driver?.last_name ?? "—"}</p>
                            <p><span className="font-medium">Pseudo:</span> {trip.driver?.pseudo ?? "—"}</p>
                            <p><span className="font-medium">Phone:</span> {trip.driver?.phone ?? "—"}</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                        <h3 className="font-semibold">Departure address</h3>
                        <div className="mt-3 space-y-2 text-sm">
                            <p>
                                <span className="font-medium">Address:</span>{" "}
                                {trip.departure_address?.street_number} {trip.departure_address?.street}
                            </p>
                            <p><span className="font-medium">Postal code:</span> {trip.departure_address?.city?.postal_code ?? "—"}</p>
                            <p><span className="font-medium">City:</span> {trip.departure_address?.city?.name ?
                                trip.departure_address?.city?.name + " " + trip.departure_address?.city?.postal_code :
                                "—"
                            }</p>
                        </div>
                    </div>

                    <div className="rounded-lg border p-4">
                        <h3 className="font-semibold">Arrival address</h3>
                        <div className="mt-3 space-y-2 text-sm">
                            <p>
                                <span className="font-medium">Address:</span>{" "}
                                {trip.arrival_address?.street_number} {trip.arrival_address?.street}
                            </p>
                            <p><span className="font-medium">Postal code:</span> {trip.arrival_address?.city?.postal_code ?? "—"}</p>
                            <p><span className="font-medium">City:</span> {trip.departure_address?.city?.name ?
                                trip.departure_address?.city?.name + " " + trip.departure_address?.city?.postal_code :
                                "—"
                            }</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border p-4">
                    <h3 className="font-semibold">Passengers</h3>
                    <p className="mt-2 text-sm text-slate-500">
                        Total passengers: {passengers.length}
                    </p>

                    <div className="mt-4 space-y-3">
                        {passengers.length === 0 ? (
                            <p className="text-sm text-slate-500">No passengers yet.</p>
                        ) : (
                            passengers.map((passenger) => (
                                <div
                                    key={passenger.id}
                                    className="flex items-center justify-between rounded-lg border px-3 py-3"
                                >
                                    <div className="text-sm">
                                        <p className="font-medium">
                                            {passenger.first_name} {passenger.last_name}
                                        </p>
                                        <p className="text-slate-500">
                                            Pseudo: {passenger.pseudo ?? "—"} | ID: {passenger.id}
                                        </p>
                                    </div>

                                    <Link
                                        to={`/my-trips/${trip.id}/contact-passenger/${passenger.id}`}
                                        className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white"
                                    >
                                        Contact
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleCancelTrip}
                        className="rounded-xl bg-red-600 px-4 py-3 text-white"
                    >
                        Cancel Trip
                    </button>
                </div>
            </div>
        </section>
    );
}