import { apiClient } from "../../app/apiClient";
import { extractApiErrorMessage } from "../../app/apiError";

function buildEmailPayload(subject: string, message: string, attachments: File[] = []): FormData {
  const payload = new FormData();
  payload.append("subject", subject);
  payload.append("message", message);
  attachments.forEach((file) => payload.append("attachments[]", file));
  return payload;
}

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
