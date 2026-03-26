/**
 * Trip domain types shared across search, booking, and publishing flows.
 */

import type { Person } from "./Person";
import type { Address } from "./Address";

/** Trip entity returned by trip endpoints. */
export interface Trip {
    id: number;
    departure_time: string;
    arrival_time: string | null;
    distance_km: number | string;
    available_seats: number;
    smoking_allowed: boolean;
    departure_address_id: number;
    arrival_address_id: number;
    person_id: number;
    driver?: Person;
    departure_address?: Address;
    arrival_address?: Address;
}

/** Query parameters supported by trip search. */
export interface TripSearchParams  {
    startingcity?: string;
    arrivalcity?: string;
    tripdate?: string;
    triptime?: string;
}

/** Payload used to create a new trip. */
export interface CreateTripPayload {
    trip_datetime: string,
    available_seats: number,
    smoking_allowed: boolean,
    starting_address: {
        street_number: string,
        street_name: string,
        postal_code: string,
        city_name: string,
    },
    arrival_address: {
        street_number: string,
        street_name: string,
        postal_code: string,
        city_name: string,
    },
}
