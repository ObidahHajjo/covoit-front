/**
 * Chat domain models used by the messaging UI.
 */

/** Message model used by the chat UI. */
export type ChatAttachment = {
  id: number;
  name: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
};

/** Message model used by the chat UI. */
export type ChatMessage = {
  id: number;
  body: string;
  sender: "me" | "other" | "system";
  senderPersonId: number;
  createdAt: string;
  attachments: ChatAttachment[];
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
  clearedAt: string | null;
  latestMessage?: ChatMessage | null;
  messages: ChatMessage[];
};
