import { apiClient } from "../../app/apiClient";
import { extractApiErrorMessage } from "../../app/apiError";
import type { ApiResponse } from "../../types/ApiResponse";
import type { Person, UpdateMePayload } from "../../types/Person";
import type { Trip } from "../../types/Trip";

function getSessionPersonId(): number {
    const personId = Number(sessionStorage.getItem("personId"));

    if (!personId || Number.isNaN(personId)) {
        throw new Error("Missing personId in session");
    }

    return personId;
}

export async function getPerson(): Promise<Person> {
    try {
        const personId = getSessionPersonId();
        const { data } = await apiClient.get<ApiResponse<Person>>(`/persons/${personId}`);
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

export async function updateMe(payload: UpdateMePayload): Promise<Person> {
    try {
        const personId = getSessionPersonId();
        const { data } = await apiClient.patch<ApiResponse<Person>>(`/persons/${personId}`, payload);
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error) || "Profile update failed");
    }
}

export async function getMyDriverTrips(): Promise<Trip[]> {
    try {
        const personId = getSessionPersonId();
        const { data } = await apiClient.get<ApiResponse<Trip[]>>(`/persons/${personId}/trips-driver`);
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

export async function getMyPassengerTrips(): Promise<Trip[]> {
    try {
        const personId = getSessionPersonId();
        const { data } = await apiClient.get<ApiResponse<Trip[]>>(`/persons/${personId}/trips-passenger`);
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

export async function deleteMyAccount(): Promise<void> {
    try {
        const personId = getSessionPersonId();
        await apiClient.delete(`/persons/${personId}`);
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}