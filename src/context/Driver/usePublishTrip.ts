import { type FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchAddress } from "../../features/geo/geoApi";
import { publishTrip } from "../../features/trips/tripApi";
import type { GeoPfFeature } from "../../types/GeoPfSearchResponse";
import { translate } from "../../i18n/config";

/**
 * Describes the normalized address fields used by the trip publishing form.
 */
export type SelectedAddress = {
    streetNumber: string;
    streetName: string;
    postalCode: string;
    cityName: string;
    label: string;
};

/**
 * Maps a Geo API feature into the address shape expected by the publish-trip form.
 *
 * @param feature - Address feature returned by the geocoding API.
 * @returns A normalized address object ready for local form state.
 */
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

/**
 * Describes the state tracked for each address autocomplete input.
 */
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

/**
 * Manages the trip publishing form, including debounced address autocompletion.
 *
 * @returns Publish-trip form state and handlers.
 */
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

    // The returned handler captures the matching setter and timer so both address inputs reuse one debounced flow.
    /**
     * Builds a debounced change handler for an address autocomplete field.
     *
     * @param setter - State setter for the target address field.
     * @param timerRef - Mutable timer reference used to debounce remote searches.
     * @returns A change handler that updates query state and fetches suggestions.
     */
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

    /**
     * Applies a selected departure address suggestion to the form state.
     *
     * @param feature - Address suggestion chosen for the starting point.
     * @returns Nothing.
     */
    function selectStarting(feature: GeoPfFeature) {
        const parsed = parseAddressFeature(feature);
        setStarting({ query: parsed.label, results: [], open: false, selected: parsed });
    }

    /**
     * Applies a selected arrival address suggestion to the form state.
     *
     * @param feature - Address suggestion chosen for the destination.
     * @returns Nothing.
     */
    function selectArrival(feature: GeoPfFeature) {
        const parsed = parseAddressFeature(feature);
        setArrival({ query: parsed.label, results: [], open: false, selected: parsed });
    }

    /**
     * Reopens the departure suggestions dropdown when results are available.
     *
     * @returns Nothing.
     */
    function openStartingDropdown() {
        if (starting.results.length > 0) setStarting((p) => ({ ...p, open: true }));
    }

    /**
     * Closes the departure suggestions dropdown after a short blur delay.
     *
     * @returns Nothing.
     */
    function closeStartingDropdown() {
        window.setTimeout(() => setStarting((p) => ({ ...p, open: false })), 150);
    }

    /**
     * Reopens the arrival suggestions dropdown when results are available.
     *
     * @returns Nothing.
     */
    function openArrivalDropdown() {
        if (arrival.results.length > 0) setArrival((p) => ({ ...p, open: true }));
    }

    /**
     * Closes the arrival suggestions dropdown after a short blur delay.
     *
     * @returns Nothing.
     */
    function closeArrivalDropdown() {
        window.setTimeout(() => setArrival((p) => ({ ...p, open: false })), 150);
    }

    /**
     * Publishes a new trip from the current form state.
     *
     * @param event - Form submission event from the publish-trip form.
     * @returns A promise that resolves once the publish flow completes.
     */
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!starting.selected || !arrival.selected) {
            setError(translate("driverTrips.selectSuggestedAddresses"));
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

            navigate("/my-trips", {
                state: {
                    toast: {
                        tone: "success",
                        message: translate("driverTrips.publishedSuccess"),
                    },
                },
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : translate("driverTrips.publishFailed"));
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
