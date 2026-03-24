import { apiClient } from "../../app/apiClient";
import { extractApiErrorMessage } from "../../app/apiError";
import type { ApiResponse } from "../../types/ApiResponse";
import type { ChatAttachment, ChatConversation, ChatMessage } from "../../types/Chat";
import type { ContactPayload } from "../../types/Contact";
import { API_BASE_URL } from "../../app/apiClient";

type ChatAttachmentApi = {
  id: number;
  name: string;
  mime_type: string;
  size_bytes: number;
  url: string;
};

type ChatMessageApi = {
  id: number;
  body: string;
  sender: "me" | "other";
  sender_person_id: number;
  created_at: string;
  attachments?: ChatAttachmentApi[];
};

type ChatConversationApi = {
  id: number;
  participant: {
    id: number;
    name: string;
    pseudo?: string | null;
  } | null;
  trip: {
    id: number;
    from?: string | null;
    to?: string | null;
  } | null;
  last_message_at?: string | null;
  cleared_at?: string | null;
  latest_message?: ChatMessageApi | null;
  messages?: ChatMessageApi[];
};

type ClearConversationResponse = {
  message: string;
  data: ChatConversationApi;
};

type ClearMessageResponse = {
  message: string;
  data: ChatConversationApi;
};

type ClearMessagesResponse = {
  message: string;
  data: ChatConversationApi;
};

type ContactChatResponse = {
  message: ChatMessageApi | null;
  conversation: ChatConversationApi;
};

/**
 * Maps a raw chat message returned by the API to the UI-friendly chat message shape.
 *
 * @param message Raw chat message payload received from the backend.
 * @returns The normalized chat message consumed by the frontend.
 */
function mapMessage(message: ChatMessageApi): ChatMessage {
  return {
    id: message.id,
    body: message.body,
    sender: message.sender,
    senderPersonId: message.sender_person_id,
    createdAt: message.created_at,
    attachments: (message.attachments ?? []).map(mapAttachment),
  };
}

/**
 * Maps a raw attachment payload returned by the API to the UI shape.
 *
 * @param attachment Raw attachment payload received from the backend.
 * @returns The normalized attachment consumed by the frontend.
 */
function mapAttachment(attachment: ChatAttachmentApi): ChatAttachment {
  const isAbsolute = /^https?:\/\//.test(attachment.url);

  return {
    id: attachment.id,
    name: attachment.name,
    mimeType: attachment.mime_type,
    sizeBytes: attachment.size_bytes,
    url: isAbsolute ? attachment.url : `${API_BASE_URL}${attachment.url}`,
  };
}

/**
 * Builds a human-readable trip label for a conversation.
 *
 * @param trip Trip fragment attached to a conversation payload.
 * @returns A display label in the `from - to` format, or an empty string when no trip is linked.
 */
function mapTripLabel(trip: ChatConversationApi["trip"]): string {
  if (!trip) return "";

  const from = trip.from ?? "Unknown";
  const to = trip.to ?? "Unknown";

  return `${from} - ${to}`;
}

/**
 * Maps a raw conversation payload returned by the API to the UI conversation shape.
 *
 * @param conversation Raw conversation payload received from the backend.
 * @returns The normalized conversation used by chat screens.
 */
function mapConversation(conversation: ChatConversationApi): ChatConversation {
  const messages = Array.isArray(conversation.messages) ? conversation.messages : [];

  return {
    id: conversation.id,
    participantId: conversation.participant?.id ?? 0,
    participantName: conversation.participant?.name ?? "User",
    participantSubtitle: conversation.participant?.pseudo ? `@${conversation.participant.pseudo}` : "",
    tripId: conversation.trip?.id ?? 0,
    tripLabel: mapTripLabel(conversation.trip),
    updatedAt: conversation.last_message_at ?? conversation.latest_message?.created_at ?? new Date().toISOString(),
    clearedAt: conversation.cleared_at ?? null,
    latestMessage: conversation.latest_message ? mapMessage(conversation.latest_message) : null,
    messages: messages.map(mapMessage),
  };
}

/**
 * Lists all conversations for the currently authenticated user.
 *
 * @returns The normalized list of chat conversations available to the user.
 */
export async function listConversations(): Promise<ChatConversation[]> {
  try {
    const { data } = await apiClient.get<ApiResponse<ChatConversationApi[]>>("/conversations", {showGlobalLoader: false});
    return data.data.map(mapConversation);
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

/**
 * Fetches a single conversation together with its currently available messages.
 *
 * @param conversationId Identifier of the conversation to retrieve.
 * @returns The normalized conversation and message collection.
 */
export async function getConversation(conversationId: number): Promise<ChatConversation> {
  try {
    const { data } = await apiClient.get<ApiResponse<ChatConversationApi>>(`/conversations/${conversationId}`, {showGlobalLoader: false});
    return mapConversation(data.data);
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

/**
 * Sends a new message inside an existing conversation.
 *
 * @param conversationId Identifier of the target conversation.
 * @param message Plain-text message body to send.
 * @returns The newly created chat message returned by the API.
 */
export async function sendConversationMessage(
  conversationId: number,
  message: string,
  attachments: File[] = [],
): Promise<ChatMessage> {
  try {
    const payload = new FormData();
    payload.append("message", message);
    attachments.forEach((file) => payload.append("attachments[]", file));

    const { data } = await apiClient.post<ApiResponse<ChatMessageApi>>(
      `/conversations/${conversationId}/messages`,
      payload,
      { showGlobalLoader: false, headers: { "Content-Type": "multipart/form-data" } },
    );
    return mapMessage(data.data);
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

/**
 * Clears a conversation for the current user without deleting it for the other participant.
 *
 * @param conversationId Identifier of the conversation to clear locally.
 * @returns The updated normalized conversation and success message.
 */
export async function clearConversation(conversationId: number): Promise<{ message: string; conversation: ChatConversation }> {
  try {
    const { data } = await apiClient.post<ClearConversationResponse>(`/conversations/${conversationId}/clear`, {}, { showGlobalLoader: false });
    return {
      message: data.message,
      conversation: mapConversation(data.data),
    };
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

/**
 * Clears a single message for the current user without removing it for other participants.
 *
 * @param conversationId Identifier of the conversation containing the message.
 * @param messageId Identifier of the message to hide for the current user.
 * @returns The updated normalized conversation and success message.
 */
export async function clearConversationMessage(
  conversationId: number,
  messageId: number,
): Promise<{ message: string; conversation: ChatConversation }> {
  try {
    const { data } = await apiClient.post<ClearMessageResponse>(
      `/conversations/${conversationId}/messages/${messageId}/clear`,
      {},
      { showGlobalLoader: false },
    );

    return {
      message: data.message,
      conversation: mapConversation(data.data),
    };
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

/**
 * Clears multiple selected messages for the current user without affecting the other participant.
 *
 * @param conversationId Identifier of the conversation containing the messages.
 * @param messageIds Identifiers of the selected messages to hide for the current user.
 * @returns The updated normalized conversation and success message.
 */
export async function clearConversationMessages(
  conversationId: number,
  messageIds: number[],
): Promise<{ message: string; conversation: ChatConversation }> {
  try {
    const { data } = await apiClient.post<ClearMessagesResponse>(
      `/conversations/${conversationId}/messages/clear`,
      { message_ids: messageIds },
      { showGlobalLoader: false },
    );

    return {
      message: data.message,
      conversation: mapConversation(data.data),
    };
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

/**
 * Starts or resumes a conversation with the driver attached to a trip.
 *
 * @param tripId Identifier of the trip whose driver should be contacted.
 * @param payload Contact form payload used to seed the conversation.
 * @returns The normalized conversation resulting from the contact request.
 */
export async function contactDriver(tripId: number, payload: ContactPayload): Promise<ChatConversation> {
  try {
    const formData = new FormData();
    formData.append("subject", payload.subject);
    formData.append("message", payload.message);
    payload.attachments?.forEach((file) => formData.append("attachments[]", file));

    const { data } = await apiClient.post<ApiResponse<ContactChatResponse>>(
      `/trips/${tripId}/contact-driver`,
      formData,
      { showGlobalLoader: false, headers: { "Content-Type": "multipart/form-data" } },
    );
    return mapConversation({
      ...data.data.conversation,
      latest_message: data.data.message ?? data.data.conversation.latest_message ?? null,
    });
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

/**
 * Starts or resumes a conversation with a passenger attached to one of the user's trips.
 *
 * @param tripId Identifier of the trip linked to the conversation.
 * @param personId Identifier of the passenger to contact.
 * @param payload Contact form payload used to seed the conversation.
 * @returns The normalized conversation resulting from the contact request.
 */
export async function contactPassenger(tripId: number, personId: number, payload: ContactPayload): Promise<ChatConversation> {
  try {
    const formData = new FormData();
    formData.append("subject", payload.subject);
    formData.append("message", payload.message);
    payload.attachments?.forEach((file) => formData.append("attachments[]", file));

    const { data } = await apiClient.post<ApiResponse<ContactChatResponse>>(
      `/my-trips/${tripId}/contact-passenger/${personId}`,
      formData,
      { showGlobalLoader: false, headers: { "Content-Type": "multipart/form-data" } },
    );
    return mapConversation({
      ...data.data.conversation,
      latest_message: data.data.message ?? data.data.conversation.latest_message ?? null,
    });
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}
