/**
 * Chat domain models used by the messaging UI.
 */

/** Message model used by the chat UI. */
export type ChatMessage = {
  id: number;
  body: string;
  sender: "me" | "other" | "system";
  senderPersonId: number;
  createdAt: string;
};

/** Conversation model used by the chat UI. */
export type ChatConversation = {
  id: number;
  participantId: number;
  participantName: string;
  participantSubtitle: string;
  tripId: number;
  tripLabel: string;
  updatedAt: string;
  latestMessage?: ChatMessage | null;
  messages: ChatMessage[];
};
