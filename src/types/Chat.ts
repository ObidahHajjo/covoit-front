export type ChatMessage = {
  id: number;
  body: string;
  sender: "me" | "other" | "system";
  senderPersonId: number;
  createdAt: string;
};

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
