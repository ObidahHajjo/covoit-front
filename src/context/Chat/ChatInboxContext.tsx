import { createContext } from "react";
import type { ChatConversation } from "../../types/Chat";

/**
 * Describes the value exposed by the chat inbox context.
 */
export type ChatInboxContextValue = {
  conversations: ChatConversation[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  isRealtimeConnected: boolean;
  reload: (isSilent?: boolean) => Promise<void>;
};

/**
 * Stores the chat inbox context shared by inbox and conversation screens.
 */
export const ChatInboxContext = createContext<ChatInboxContextValue | undefined>(undefined);
