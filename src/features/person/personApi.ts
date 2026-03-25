import { apiClient } from "../../app/apiClient";
import { extractApiErrorMessage } from "../../app/apiError";
import type { ApiResponse } from "../../types/ApiResponse";
import type { Person, UpdateMePayload } from "../../types/Person";
import type { Trip } from "../../types/Trip";

/**
 * Fetches the current person's profile.
 *
 * @param personId - The authenticated person's id.
 * @returns The person profile associated with the active session.
 */
export async function getPerson(personId: number): Promise<Person> {
    try {
        const { data } = await apiClient.get<ApiResponse<Person>>(`/persons/${personId}`);
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

/**
 * Updates the current person's profile.
 *
 * @param personId - The authenticated person's id.
 * @param payload - Profile fields to update for the authenticated person.
 * @returns The updated person profile returned by the API.
 */
export async function updateMe(personId: number, payload: UpdateMePayload): Promise<Person> {
    try {
        const { data } = await apiClient.patch<ApiResponse<Person>>(`/persons/${personId}`, payload);
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error) || "Profile update failed");
    }
}

/**
 * Returns trips created by the current user as driver.
 *
 * @param personId - The authenticated person's id.
 * @returns The list of trips published by the authenticated user.
 */
export async function getMyDriverTrips(personId: number): Promise<Trip[]> {
    try {
        const { data } = await apiClient.get<ApiResponse<Trip[]>>(`/persons/${personId}/trips-driver`);
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

/**
 * Returns trips booked by the current user as passenger.
 *
 * @param personId - The authenticated person's id.
 * @returns The list of trips reserved by the authenticated user.
 */
export async function getMyPassengerTrips(personId: number): Promise<Trip[]> {
    try {
        const { data } = await apiClient.get<ApiResponse<Trip[]>>(`/persons/${personId}/trips-passenger`);
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

/**
 * Deletes the current user's account.
 *
 * @param personId - The authenticated person's id.
 * @returns A promise that resolves when the account deletion request succeeds.
 */
export async function deleteMyAccount(personId: number): Promise<void> {
    try {
        await apiClient.delete(`/persons/${personId}`);
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}
