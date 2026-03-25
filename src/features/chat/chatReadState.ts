/**
 * Browser event emitted whenever persisted chat read state changes.
 */
export const CHAT_READ_EVENT = "covoit:chat-read-changed";

const CHAT_READ_STATE_KEY = "covoit.chat.read-state";

function getStorageKey() {
  return CHAT_READ_STATE_KEY;
}

/**
 * Stored read-state metadata for a single conversation.
 */
type ConversationReadState = {
  /** Last timestamp the conversation was marked as read. */
  readAt: string | null;
  /** Latest read message identifier, when known. */
  readMessageId: number | null;
  /** Persisted unread counter for the conversation. */
  unreadCount: number;
};

/**
 * Map of persisted conversation read-state entries indexed by conversation id.
 */
type ReadMap = Record<string, ConversationReadState>;

/**
 * Checks whether browser storage APIs are available in the current runtime.
 *
 * @returns `true` when local storage can be used safely, otherwise `false`.
 */
function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/**
 * Reads the persisted chat read-state map from local storage.
 *
 * @returns The parsed read-state map, or an empty object when no valid state is available.
 */
function readState(): ReadMap {
  if (!canUseStorage()) return {};

  try {
    const raw = window.localStorage.getItem(getStorageKey());
    return raw ? (JSON.parse(raw) as ReadMap) : {};
  } catch {
    return {};
  }
}

/**
 * Persists the full chat read-state map and notifies listeners about the change.
 *
 * @param value Complete read-state map to store.
 * @returns Nothing.
 */
function writeState(value: ReadMap) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(getStorageKey(), JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(CHAT_READ_EVENT));
}

/**
 * Returns the last read timestamp stored for a conversation.
 *
 * @param conversationId Identifier of the conversation to inspect.
 * @returns The stored read timestamp, or `null` when the conversation has no persisted read state.
 */
export function getConversationReadAt(conversationId: number) {
  return readState()[String(conversationId)]?.readAt ?? null;
}

/**
 * Returns the last read message identifier stored for a conversation.
 *
 * @param conversationId Identifier of the conversation to inspect.
 * @returns The stored read message id, or `null` when none has been persisted.
 */
export function getConversationReadMessageId(conversationId: number) {
  return readState()[String(conversationId)]?.readMessageId ?? null;
}

/**
 * Returns the persisted unread-count value for a conversation.
 *
 * @param conversationId Identifier of the conversation to inspect.
 * @returns The unread counter stored for the conversation.
 */
export function getConversationUnreadCount(conversationId: number) {
  return readState()[String(conversationId)]?.unreadCount ?? 0;
}

/**
 * Marks a conversation as fully read and optionally records the latest read message id.
 *
 * @param conversationId Identifier of the conversation to update.
 * @param timestamp Timestamp representing the moment the conversation was read.
 * @param messageId Latest read message identifier when one is known.
 * @returns Nothing.
 */
export function markConversationRead(conversationId: number, timestamp: string, messageId?: number | null) {
  const next = readState();
  next[String(conversationId)] = {
    readAt: timestamp,
    readMessageId: messageId ?? next[String(conversationId)]?.readMessageId ?? null,
    unreadCount: 0,
  };
  writeState(next);
}

/**
 * Increments the unread counter for a conversation while preserving its existing read markers.
 *
 * @param conversationId Identifier of the conversation to update.
 * @returns Nothing.
 */
export function incrementConversationUnread(conversationId: number) {
  const next = readState();
  const current = next[String(conversationId)] ?? { readAt: null, readMessageId: null, unreadCount: 0 };

  next[String(conversationId)] = {
    ...current,
    unreadCount: current.unreadCount + 1,
  };

  writeState(next);
}

/**
 * Synchronizes persisted unread state with the latest known message metadata.
 *
 * @param conversationId Identifier of the conversation to update.
 * @param updatedAt Timestamp of the latest conversation activity.
 * @param latestMessageId Identifier of the latest message when available.
 * @param latestSender Sender role for the latest message.
 * @returns Nothing.
 */
export function syncConversationUnread(
  conversationId: number,
  updatedAt: string,
  latestMessageId?: number | null,
  latestSender?: "me" | "other" | "system" | null,
) {
  const next = readState();
  const current = next[String(conversationId)] ?? { readAt: null, readMessageId: null, unreadCount: 0 };
  const readAt = current.readAt;
  const readMessageId = current.readMessageId;
  // Prefer message ids when present because they remain reliable even if timestamps are equal or slightly skewed.
  const isNewerThanReadMessage = latestMessageId != null && readMessageId != null
    ? latestMessageId > readMessageId
    : !readAt || new Date(updatedAt).getTime() > new Date(readAt).getTime();
  const isUnread = latestSender === "other" && isNewerThanReadMessage;

  next[String(conversationId)] = {
    readAt,
    readMessageId,
    unreadCount: isUnread ? Math.max(current.unreadCount, 1) : 0,
  };

  writeState(next);
}

/**
 * Returns whether a conversation should currently be considered unread.
 *
 * @param conversationId Identifier of the conversation to inspect.
 * @param updatedAt Timestamp of the latest conversation activity.
 * @param latestMessageId Identifier of the latest message when available.
 * @param latestSender Sender role for the latest message.
 * @returns `true` when the conversation should be shown as unread, otherwise `false`.
 */
export function getConversationUnread(
  conversationId: number,
  updatedAt: string,
  latestMessageId?: number | null,
  latestSender?: "me" | "other" | "system" | null,
) {
  return getConversationUnreadCount(conversationId) > 0
    || (latestSender === "other" && (() => {
      const readMessageId = getConversationReadMessageId(conversationId);
      if (latestMessageId != null && readMessageId != null) {
        return latestMessageId > readMessageId;
      }

      const readAt = getConversationReadAt(conversationId);
      if (!readAt) return true;
      return new Date(updatedAt).getTime() > new Date(readAt).getTime();
    })());
}
