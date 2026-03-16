import { type FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchAddress } from "../../features/geo/geoApi";
import { publishTrip } from "../../features/trips/tripApi";
import type { GeoPfFeature } from "../../types/GeoPfSearchResponse";

type SelectedAddress = {
    streetNumber: string;
    streetName: string;
    postalCode: string;
    cityName: string;
    label: string;
};

function parseAddressFeature(feature: GeoPfFeature): SelectedAddress {
    const properties = feature.properties;

    const streetNumber = properties.housenumber ?? "";
    const streetName = properties.street ?? properties.name ?? "";
    const postalCode = properties.postcode ?? "";
    const cityName = properties.city ?? "";
    const label = properties.label ?? "";

    return {
        streetNumber,
        streetName,
        postalCode,
        cityName,
        label,
    };
}

export default function PublishTripPage() {
    const navigate = useNavigate();

    const [tripDateTime, setTripDateTime] = useState("");
    const [availableSeats, setAvailableSeats] = useState("");
    const [smokingAllowed, setSmokingAllowed] = useState(false);

    const [startingAddressQuery, setStartingAddressQuery] = useState("");
    const [startingAddressResults, setStartingAddressResults] = useState<GeoPfFeature[]>([]);
    const [startingAddressOpen, setStartingAddressOpen] = useState(false);
    const [startingSelectedAddress, setStartingSelectedAddress] = useState<SelectedAddress | null>(
        null,
    );

    const [arrivalAddressQuery, setArrivalAddressQuery] = useState("");
    const [arrivalAddressResults, setArrivalAddressResults] = useState<GeoPfFeature[]>([]);
    const [arrivalAddressOpen, setArrivalAddressOpen] = useState(false);
    const [arrivalSelectedAddress, setArrivalSelectedAddress] = useState<SelectedAddress | null>(
        null,
    );

    const [error, setError] = useState<string | null>(null);

    const startingSearchTimeoutRef = useRef<number | null>(null);
    const arrivalSearchTimeoutRef = useRef<number | null>(null);

    function clearStartingSearchTimeout(): void {
        if (startingSearchTimeoutRef.current !== null) {
            window.clearTimeout(startingSearchTimeoutRef.current);
            startingSearchTimeoutRef.current = null;
        }
    }

    function clearArrivalSearchTimeout(): void {
        if (arrivalSearchTimeoutRef.current !== null) {
            window.clearTimeout(arrivalSearchTimeoutRef.current);
            arrivalSearchTimeoutRef.current = null;
        }
    }

    function fillStartingAddress(feature: GeoPfFeature): void {
        const parsed = parseAddressFeature(feature);

        setStartingSelectedAddress(parsed);
        setStartingAddressQuery(parsed.label);
        setStartingAddressResults([]);
        setStartingAddressOpen(false);
    }

    function fillArrivalAddress(feature: GeoPfFeature): void {
        const parsed = parseAddressFeature(feature);

        setArrivalSelectedAddress(parsed);
        setArrivalAddressQuery(parsed.label);
        setArrivalAddressResults([]);
        setArrivalAddressOpen(false);
    }

    function handleStartingAddressChange(value: string): void {
        setStartingAddressQuery(value);
        setStartingSelectedAddress(null);

        clearStartingSearchTimeout();

        const trimmedQuery = value.trim();

        if (trimmedQuery.length < 3) {
            setStartingAddressResults([]);
            setStartingAddressOpen(false);
            return;
        }

        setStartingAddressOpen(true);

        startingSearchTimeoutRef.current = window.setTimeout(async () => {
            try {
                const results = await searchAddress(trimmedQuery);
                setStartingAddressResults(results);
                setStartingAddressOpen(results.length > 0);
            } catch {
                setStartingAddressResults([]);
                setStartingAddressOpen(false);
            }
        }, 300);
    }

    function handleArrivalAddressChange(value: string): void {
        setArrivalAddressQuery(value);
        setArrivalSelectedAddress(null);

        clearArrivalSearchTimeout();

        const trimmedQuery = value.trim();

        if (trimmedQuery.length < 3) {
            setArrivalAddressResults([]);
            setArrivalAddressOpen(false);
            return;
        }

        setArrivalAddressOpen(true);

        arrivalSearchTimeoutRef.current = window.setTimeout(async () => {
            try {
                const results = await searchAddress(trimmedQuery);
                setArrivalAddressResults(results);
                setArrivalAddressOpen(results.length > 0);
            } catch {
                setArrivalAddressResults([]);
                setArrivalAddressOpen(false);
            }
        }, 300);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!startingSelectedAddress || !arrivalSelectedAddress) {
            setError("Please select both addresses from the suggestions.");
            return;
        }

        try {
            setError(null);

            await publishTrip({
                trip_datetime: tripDateTime,
                available_seats: Number(availableSeats),
                smoking_allowed: smokingAllowed,
                starting_address: {
                    street_number: startingSelectedAddress.streetNumber,
                    street_name: startingSelectedAddress.streetName,
                    postal_code: startingSelectedAddress.postalCode,
                    city_name: startingSelectedAddress.cityName,
                },
                arrival_address: {
                    street_number: arrivalSelectedAddress.streetNumber,
                    street_name: arrivalSelectedAddress.streetName,
                    postal_code: arrivalSelectedAddress.postalCode,
                    city_name: arrivalSelectedAddress.cityName,
                },
            });

            navigate("/my-trips");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to publish trip");
        }
    }

    const isSubmitDisabled =
        !tripDateTime ||
        !availableSeats ||
        !startingSelectedAddress ||
        !arrivalSelectedAddress;

    return (
        <section>
            <h1 className="mb-4 text-2xl font-bold">Publish Trip</h1>

            <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-4 shadow-sm">
                {error && <p className="text-red-600">{error}</p>}

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Trip information</h2>

                    <input
                        type="datetime-local"
                        value={tripDateTime}
                        onChange={(e) => setTripDateTime(e.target.value)}
                        className="w-full rounded-xl border px-4 py-3"
                    />

                    <input
                        type="number"
                        min="1"
                        max="9"
                        value={availableSeats}
                        onChange={(e) => setAvailableSeats(e.target.value)}
                        placeholder="Available seats"
                        className="w-full rounded-xl border px-4 py-3"
                    />

                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={smokingAllowed}
                            onChange={(e) => setSmokingAllowed(e.target.checked)}
                        />
                        <span>Smoking allowed</span>
                    </label>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Starting address</h2>

                    <div className="relative">
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Search address
                        </label>

                        <input
                            type="text"
                            value={startingAddressQuery}
                            onChange={(e) => handleStartingAddressChange(e.target.value)}
                            onFocus={() => {
                                if (startingAddressResults.length > 0) {
                                    setStartingAddressOpen(true);
                                }
                            }}
                            onBlur={() => {
                                window.setTimeout(() => setStartingAddressOpen(false), 150);
                            }}
                            placeholder="Search starting address"
                            className="w-full rounded-xl border px-4 py-3"
                            autoComplete="off"
                        />

                        {startingAddressOpen && startingAddressResults.length > 0 && (
                            <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border bg-white shadow-lg">
                                {startingAddressResults.map((feature) => {
                                    const key = feature.properties.banId ?? feature.properties.id;

                                    return (
                                        <li key={key}>
                                            <button
                                                type="button"
                                                className="w-full px-4 py-3 text-left hover:bg-slate-100"
                                                onMouseDown={() => fillStartingAddress(feature)}
                                            >
                                                {feature.properties.label}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    <input
                        type="text"
                        value={startingSelectedAddress?.streetNumber ?? ""}
                        readOnly
                        placeholder="Street number"
                        className="w-full rounded-xl border bg-slate-50 px-4 py-3"
                    />

                    <input
                        type="text"
                        value={startingSelectedAddress?.streetName ?? ""}
                        readOnly
                        placeholder="Street name"
                        className="w-full rounded-xl border bg-slate-50 px-4 py-3"
                    />

                    <input
                        type="text"
                        value={startingSelectedAddress?.postalCode ?? ""}
                        readOnly
                        placeholder="Postal code"
                        className="w-full rounded-xl border bg-slate-50 px-4 py-3"
                    />

                    <input
                        type="text"
                        value={startingSelectedAddress?.cityName ?? ""}
                        readOnly
                        placeholder="City name"
                        className="w-full rounded-xl border bg-slate-50 px-4 py-3"
                    />
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Arrival address</h2>

                    <div className="relative">
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Search address
                        </label>

                        <input
                            type="text"
                            value={arrivalAddressQuery}
                            onChange={(e) => handleArrivalAddressChange(e.target.value)}
                            onFocus={() => {
                                if (arrivalAddressResults.length > 0) {
                                    setArrivalAddressOpen(true);
                                }
                            }}
                            onBlur={() => {
                                window.setTimeout(() => setArrivalAddressOpen(false), 150);
                            }}
                            placeholder="Search arrival address"
                            className="w-full rounded-xl border px-4 py-3"
                            autoComplete="off"
                        />

                        {arrivalAddressOpen && arrivalAddressResults.length > 0 && (
                            <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border bg-white shadow-lg">
                                {arrivalAddressResults.map((feature) => {
                                    const key = feature.properties.banId ?? feature.properties.id;

                                    return (
                                        <li key={key}>
                                            <button
                                                type="button"
                                                className="w-full px-4 py-3 text-left hover:bg-slate-100"
                                                onMouseDown={() => fillArrivalAddress(feature)}
                                            >
                                                {feature.properties.label}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    <input
                        type="text"
                        value={arrivalSelectedAddress?.streetNumber ?? ""}
                        readOnly
                        placeholder="Street number"
                        className="w-full rounded-xl border bg-slate-50 px-4 py-3"
                    />

                    <input
                        type="text"
                        value={arrivalSelectedAddress?.streetName ?? ""}
                        readOnly
                        placeholder="Street name"
                        className="w-full rounded-xl border bg-slate-50 px-4 py-3"
                    />

                    <input
                        type="text"
                        value={arrivalSelectedAddress?.postalCode ?? ""}
                        readOnly
                        placeholder="Postal code"
                        className="w-full rounded-xl border bg-slate-50 px-4 py-3"
                    />

                    <input
                        type="text"
                        value={arrivalSelectedAddress?.cityName ?? ""}
                        readOnly
                        placeholder="City name"
                        className="w-full rounded-xl border bg-slate-50 px-4 py-3"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitDisabled}
                    className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Publish Trip
                </button>
            </form>
        </section>
    );
}