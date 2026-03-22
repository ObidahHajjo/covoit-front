import { apiClient } from "../../app/apiClient";
import { extractApiErrorMessage } from "../../app/apiError";
import type { CreateTripPayload, Trip, TripSearchParams } from "../../types/Trip";
import type { ApiResponse } from "../../types/ApiResponse";
import type { Person } from "../../types/Person";

/**
 * Lists trips that match the provided optional search filters.
 *
 * @param params Optional query parameters used to filter available trips.
 * @returns The list of trips returned by the API.
 */
export async function getTrips(params?: TripSearchParams): Promise<Trip[]> {
    try {
        const { data } = await apiClient.get<ApiResponse<Trip[]>>("/trips", { params });
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

/**
 * Fetches a single trip by its unique identifier.
 *
 * @param tripId Identifier of the trip to retrieve.
 * @returns The trip returned by the API.
 */
export async function getTripById(tripId: number): Promise<Trip> {
    try {
        const { data } = await apiClient.get<ApiResponse<Trip>>(`/trips/${tripId}`);
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

/**
 * Lists passengers currently booked on a trip.
 *
 * @param tripId Identifier of the trip whose passengers should be fetched.
 * @returns The list of passenger profiles attached to the trip.
 */
export async function getTripPassengers(tripId: number): Promise<Person[]> {
    try {
        const { data } = await apiClient.get<ApiResponse<Person[]>>(`/trips/${tripId}/person`);
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

/**
 * Books the current user onto a trip.
 *
 * @param tripId Identifier of the trip to reserve.
 * @returns A promise that resolves when the reservation succeeds.
 */
export async function reserveTrip(tripId: number): Promise<void> {
    try {
        await apiClient.post(`/trips/${tripId}/person`);
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

/**
 * Cancels a trip as its driver.
 *
 * @param tripId Identifier of the trip to cancel.
 * @returns A promise that resolves when the cancellation succeeds.
 */
export async function cancelTripAsDriver(tripId: number): Promise<void> {
    try {
        await apiClient.patch(`/trips/${tripId}/cancel`);
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

/**
 * Cancels the current user's reservation on a trip.
 *
 * @param tripId Identifier of the trip whose reservation should be removed.
 * @returns A promise that resolves when the reservation cancellation succeeds.
 */
export async function cancelReservation(tripId: number): Promise<void> {
    try {
        await apiClient.delete(`/trips/${tripId}/reservations`);
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

/**
 * Publishes a new trip.
 *
 * @param payload Trip creation data submitted by the user.
 * @returns The newly created trip returned by the API.
 */
export async function publishTrip(payload: CreateTripPayload): Promise<Trip> {
    try {
        const { data } = await apiClient.post<ApiResponse<Trip>>("/trips", payload);
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}
