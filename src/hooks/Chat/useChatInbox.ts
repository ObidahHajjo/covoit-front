import { useContext } from "react";
import { ChatInboxContext } from "../../context/ChatInboxContext.tsx";

/**
 * Returns the chat inbox context value.
 *
 * @returns The shared chat inbox context API.
 * @throws Error When the hook is used outside `ChatInboxProvider`.
 */
export function useChatInbox() {
  const context = useContext(ChatInboxContext);

  if (!context) {
    throw new Error("useChatInbox must be used inside ChatInboxProvider");
  }

  return context;
}
