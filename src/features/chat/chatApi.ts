import { apiClient } from "../../app/apiClient";
import { extractApiErrorMessage } from "../../app/apiError";
import type { ApiResponse } from "../../types/ApiResponse";
import type { ChatConversation, ChatMessage } from "../../types/Chat";
import type { ContactPayload } from "../../types/Contact";

type ChatMessageApi = {
  id: number;
  body: string;
  sender: "me" | "other";
  sender_person_id: number;
  created_at: string;
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
  latest_message?: ChatMessageApi | null;
  messages?: ChatMessageApi[];
};

type ContactChatResponse = {
  message: ChatMessageApi | null;
  conversation: ChatConversationApi;
};

function mapMessage(message: ChatMessageApi): ChatMessage {
  return {
    id: message.id,
    body: message.body,
    sender: message.sender,
    senderPersonId: message.sender_person_id,
    createdAt: message.created_at,
  };
}

function mapTripLabel(trip: ChatConversationApi["trip"]): string {
  if (!trip) return "";

  const from = trip.from ?? "Unknown";
  const to = trip.to ?? "Unknown";

  return `${from} - ${to}`;
}

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
    latestMessage: conversation.latest_message ? mapMessage(conversation.latest_message) : null,
    messages: messages.map(mapMessage),
  };
}

export async function listConversations(): Promise<ChatConversation[]> {
  try {
    const { data } = await apiClient.get<ApiResponse<ChatConversationApi[]>>("/conversations", {showGlobalLoader: false});
    return data.data.map(mapConversation);
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

export async function getConversation(conversationId: number): Promise<ChatConversation> {
  try {
    const { data } = await apiClient.get<ApiResponse<ChatConversationApi>>(`/conversations/${conversationId}`, {showGlobalLoader: false});
    return mapConversation(data.data);
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

export async function sendConversationMessage(conversationId: number, message: string): Promise<ChatMessage> {
  try {
    const { data } = await apiClient.post<ApiResponse<ChatMessageApi>>(`/conversations/${conversationId}/messages`, {
      message,
    }, {showGlobalLoader: false});
    return mapMessage(data.data);
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

export async function contactDriver(tripId: number, payload: ContactPayload): Promise<ChatConversation> {
  try {
    const { data } = await apiClient.post<ApiResponse<ContactChatResponse>>(`/trips/${tripId}/contact-driver`, payload,{showGlobalLoader: false});
    return mapConversation({
      ...data.data.conversation,
      latest_message: data.data.message ?? data.data.conversation.latest_message ?? null,
    });
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

export async function contactPassenger(tripId: number, personId: number, payload: ContactPayload): Promise<ChatConversation> {
  try {
    const { data } = await apiClient.post<ApiResponse<ContactChatResponse>>(`/my-trips/${tripId}/contact-passenger/${personId}`, payload, {showGlobalLoader: false});
    return mapConversation({
      ...data.data.conversation,
      latest_message: data.data.message ?? data.data.conversation.latest_message ?? null,
    });
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}
