import { apiClient } from "../../app/apiClient";
import { extractApiErrorMessage } from "../../app/apiError";

function buildEmailPayload(subject: string, message: string, attachments: File[] = []): FormData {
  const payload = new FormData();
  payload.append("subject", subject);
  payload.append("message", message);
  attachments.forEach((file) => payload.append("attachments[]", file));
  return payload;
}

/**
 * Sends a contact email to the support team.
 *
 * @param subject - The email subject.
 * @param message - The email body content.
 * @param attachments - Optional files to attach to the email.
 * @returns A promise resolving to the success message from the API.
 */
export async function sendSupportEmail(subject: string, message: string, attachments: File[] = []): Promise<string> {
  try {
    const { data } = await apiClient.post<{ message: string }>(
      "/support/contact-email",
      buildEmailPayload(subject, message, attachments),
      { showGlobalLoader: false, headers: { "Content-Type": "multipart/form-data" } },
    );

    return data.message;
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

/**
 * Sends a contact email to a trip driver.
 *
 * @param tripId - The ID of the trip.
 * @param subject - The email subject.
 * @param message - The email body content.
 * @param attachments - Optional files to attach.
 * @returns A promise resolving to the API success message.
 */
export async function contactDriverByEmail(
  tripId: number,
  subject: string,
  message: string,
  attachments: File[] = [],
): Promise<string> {
  try {
    const { data } = await apiClient.post<{ message: string }>(
      `/trips/${tripId}/contact-driver-email`,
      buildEmailPayload(subject, message, attachments),
      { showGlobalLoader: false, headers: { "Content-Type": "multipart/form-data" } },
    );

    return data.message;
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

/**
 * Sends a contact email to a passenger of a trip.
 *
 * @param tripId - The ID of the trip.
 * @param passengerId - The ID of the passenger (person).
 * @param subject - The email subject.
 * @param message - The email body content.
 * @param attachments - Optional files to attach.
 * @returns A promise resolving to the API success message.
 */
export async function contactPassengerByEmail(
  tripId: number,
  passengerId: number,
  subject: string,
  message: string,
  attachments: File[] = [],
): Promise<string> {
  try {
    const { data } = await apiClient.post<{ message: string }>(
      `/my-trips/${tripId}/contact-passenger/${passengerId}/email`,
      buildEmailPayload(subject, message, attachments),
      { showGlobalLoader: false, headers: { "Content-Type": "multipart/form-data" } },
    );

    return data.message;
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}
