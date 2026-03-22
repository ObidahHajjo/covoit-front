import { createContext } from "react";
import type { ChatConversation } from "../../types/Chat";

export type ChatInboxContextValue = {
  conversations: ChatConversation[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  isRealtimeConnected: boolean;
  reload: (isSilent?: boolean) => Promise<void>;
};

export const ChatInboxContext = createContext<ChatInboxContextValue | undefined>(undefined);
