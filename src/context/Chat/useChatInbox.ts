import { useContext } from "react";
import { ChatInboxContext } from "./ChatInboxContext";

export function useChatInbox() {
  const context = useContext(ChatInboxContext);

  if (!context) {
    throw new Error("useChatInbox must be used inside ChatInboxProvider");
  }

  return context;
}
