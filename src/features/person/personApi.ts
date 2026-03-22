import { apiClient } from "../../app/apiClient";
import { extractApiErrorMessage } from "../../app/apiError";
import type { ApiResponse } from "../../types/ApiResponse";
import type { Person, UpdateMePayload } from "../../types/Person";
import type { Trip } from "../../types/Trip";

/**
 * Reads the authenticated person id from session storage.
 *
 * @returns The numeric person identifier stored for the active session.
 */
function getSessionPersonId(): number {
    const personId = Number(sessionStorage.getItem("personId"));

    if (!personId || Number.isNaN(personId)) {
        throw new Error("Missing personId in session");
    }

    return personId;
}

/**
 * Fetches the current person's profile.
 *
 * @returns The person profile associated with the active session.
 */
export async function getPerson(): Promise<Person> {
    try {
        const personId = getSessionPersonId();
        const { data } = await apiClient.get<ApiResponse<Person>>(`/persons/${personId}`);
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

/**
 * Updates the current person's profile.
 *
 * @param payload Profile fields to update for the authenticated person.
 * @returns The updated person profile returned by the API.
 */
export async function updateMe(payload: UpdateMePayload): Promise<Person> {
    try {
        const personId = getSessionPersonId();
        const { data } = await apiClient.patch<ApiResponse<Person>>(`/persons/${personId}`, payload);
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error) || "Profile update failed");
    }
}

/**
 * Returns trips created by the current user as driver.
 *
 * @returns The list of trips published by the authenticated user.
 */
export async function getMyDriverTrips(): Promise<Trip[]> {
    try {
        const personId = getSessionPersonId();
        const { data } = await apiClient.get<ApiResponse<Trip[]>>(`/persons/${personId}/trips-driver`);
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

/**
 * Returns trips booked by the current user as passenger.
 *
 * @returns The list of trips reserved by the authenticated user.
 */
export async function getMyPassengerTrips(): Promise<Trip[]> {
    try {
        const personId = getSessionPersonId();
        const { data } = await apiClient.get<ApiResponse<Trip[]>>(`/persons/${personId}/trips-passenger`);
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

/**
 * Deletes the current user's account.
 *
 * @returns A promise that resolves when the account deletion request succeeds.
 */
export async function deleteMyAccount(): Promise<void> {
    try {
        const personId = getSessionPersonId();
        await apiClient.delete(`/persons/${personId}`);
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}
