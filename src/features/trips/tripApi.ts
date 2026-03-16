import { apiClient } from "../../app/apiClient";
import { extractApiErrorMessage } from "../../app/apiError";
import type { CreateTripPayload, Trip, TripSearchParams } from "../../types/Trip";
import type { ApiResponse } from "../../types/ApiResponse";
import type { Person } from "../../types/Person";

export async function getTrips(params?: TripSearchParams): Promise<Trip[]> {
    try {
        const { data } = await apiClient.get<ApiResponse<Trip[]>>("/trips", { params });
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

export async function getTripById(tripId: number): Promise<Trip> {
    try {
        const { data } = await apiClient.get<ApiResponse<Trip>>(`/trips/${tripId}`);
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

export async function getTripPassengers(tripId: number): Promise<Person[]> {
    try {
        const { data } = await apiClient.get<ApiResponse<Person[]>>(`/trips/${tripId}/person`);
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

export async function reserveTrip(tripId: number): Promise<void> {
    try {
        await apiClient.post(`/trips/${tripId}/person`);
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

export async function cancelTripAsDriver(tripId: number): Promise<void> {
    try {
        await apiClient.patch(`/trips/${tripId}/cancel`);
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

export async function cancelReservation(tripId: number): Promise<void> {
    try {
        await apiClient.delete(`/trips/${tripId}/reservations`);
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

export async function publishTrip(payload: CreateTripPayload): Promise<Trip> {
    try {
        const { data } = await apiClient.post<ApiResponse<Trip>>("/trips", payload);
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}