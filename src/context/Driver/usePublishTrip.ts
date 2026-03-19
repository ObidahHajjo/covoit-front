import { type FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchAddress } from "../../features/geo/geoApi";
import { publishTrip } from "../../features/trips/tripApi";
import type { GeoPfFeature } from "../../types/GeoPfSearchResponse";

export type SelectedAddress = {
    streetNumber: string;
    streetName: string;
    postalCode: string;
    cityName: string;
    label: string;
};

export function parseAddressFeature(feature: GeoPfFeature): SelectedAddress {
    const p = feature.properties;
    return {
        streetNumber: p.housenumber ?? "",
        streetName: p.street ?? p.name ?? "",
        postalCode: p.postcode ?? "",
        cityName: p.city ?? "",
        label: p.label ?? "",
    };
}

export type AddressFieldState = {
    query: string;
    results: GeoPfFeature[];
    open: boolean;
    selected: SelectedAddress | null;
};

const EMPTY_ADDRESS_FIELD: AddressFieldState = {
    query: "",
    results: [],
    open: false,
    selected: null,
};

export function usePublishTrip() {
    const navigate = useNavigate();

    const [tripDateTime, setTripDateTime] = useState("");
    const [availableSeats, setAvailableSeats] = useState("");
    const [smokingAllowed, setSmokingAllowed] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [starting, setStarting] = useState<AddressFieldState>(EMPTY_ADDRESS_FIELD);
    const [arrival, setArrival] = useState<AddressFieldState>(EMPTY_ADDRESS_FIELD);

    const startingTimerRef = useRef<number | null>(null);
    const arrivalTimerRef = useRef<number | null>(null);

    // ── Generic address search handler ────────────────────────────────────────
    function makeAddressChangeHandler(
        setter: React.Dispatch<React.SetStateAction<AddressFieldState>>,
        timerRef: React.MutableRefObject<number | null>,
    ) {
        return function handleChange(value: string) {
            setter((prev) => ({ ...prev, query: value, selected: null }));

            if (timerRef.current !== null) window.clearTimeout(timerRef.current);

            const q = value.trim();
            if (q.length < 3) {
                setter((prev) => ({ ...prev, results: [], open: false }));
                return;
            }

            setter((prev) => ({ ...prev, open: true }));

            timerRef.current = window.setTimeout(async () => {
                try {
                    const results = await searchAddress(q);
                    setter((prev) => ({ ...prev, results, open: results.length > 0 }));
                } catch {
                    setter((prev) => ({ ...prev, results: [], open: false }));
                }
            }, 300);
        };
    }

    const handleStartingChange = makeAddressChangeHandler(setStarting, startingTimerRef);
    const handleArrivalChange = makeAddressChangeHandler(setArrival, arrivalTimerRef);

    function selectStarting(feature: GeoPfFeature) {
        const parsed = parseAddressFeature(feature);
        setStarting({ query: parsed.label, results: [], open: false, selected: parsed });
    }

    function selectArrival(feature: GeoPfFeature) {
        const parsed = parseAddressFeature(feature);
        setArrival({ query: parsed.label, results: [], open: false, selected: parsed });
    }

    function openStartingDropdown() {
        if (starting.results.length > 0) setStarting((p) => ({ ...p, open: true }));
    }

    function closeStartingDropdown() {
        window.setTimeout(() => setStarting((p) => ({ ...p, open: false })), 150);
    }

    function openArrivalDropdown() {
        if (arrival.results.length > 0) setArrival((p) => ({ ...p, open: true }));
    }

    function closeArrivalDropdown() {
        window.setTimeout(() => setArrival((p) => ({ ...p, open: false })), 150);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!starting.selected || !arrival.selected) {
            setError("Please select both addresses from the suggestions.");
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            await publishTrip({
                trip_datetime: tripDateTime,
                available_seats: Number(availableSeats),
                smoking_allowed: smokingAllowed,
                starting_address: {
                    street_number: starting.selected.streetNumber,
                    street_name: starting.selected.streetName,
                    postal_code: starting.selected.postalCode,
                    city_name: starting.selected.cityName,
                },
                arrival_address: {
                    street_number: arrival.selected.streetNumber,
                    street_name: arrival.selected.streetName,
                    postal_code: arrival.selected.postalCode,
                    city_name: arrival.selected.cityName,
                },
            });

            navigate("/my-trips");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to publish trip");
        } finally {
            setSubmitting(false);
        }
    }

    const isSubmitDisabled =
        !tripDateTime || !availableSeats || !starting.selected || !arrival.selected || submitting;

    return {
        tripDateTime, setTripDateTime,
        availableSeats, setAvailableSeats,
        smokingAllowed, setSmokingAllowed,
        error,
        submitting,
        isSubmitDisabled,
        starting,
        arrival,
        handleStartingChange,
        handleArrivalChange,
        selectStarting,
        selectArrival,
        openStartingDropdown,
        closeStartingDropdown,
        openArrivalDropdown,
        closeArrivalDropdown,
        handleSubmit,
    };
}