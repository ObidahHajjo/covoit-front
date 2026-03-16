import { extractApiErrorMessage } from "../../app/apiError";
import { apiClient } from "../../app/apiClient";
import type { ContactPayload } from "../../types/Contact";

export async function contactDriver(tripId: number, payload: ContactPayload): Promise<void> {
    try {
        await apiClient.post(`/trips/${tripId}/contact-driver`, payload);
    } catch (error) {
        throw new Error(
            `Missing backend endpoint or request failed: ${extractApiErrorMessage(error)}`,
        );
    }
}

export async function contactPassenger(
    tripId: number,
    personId: number,
    payload: ContactPayload,
): Promise<void> {
    try {
        await apiClient.post(`/my-trips/${tripId}/contact-passenger/${personId}`, payload);
    } catch (error) {
        throw new Error(
            `Missing backend endpoint or request failed: ${extractApiErrorMessage(error)}`,
        );
    }
}