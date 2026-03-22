export const CHAT_READ_EVENT = "covoit:chat-read-changed";

function getStorageKey() {
  if (typeof window === "undefined") {
    return "covoit.chat.read-state";
  }

  const personId = window.sessionStorage.getItem("personId");
  return personId ? `covoit.chat.read-state.${personId}` : "covoit.chat.read-state";
}

type ConversationReadState = {
  readAt: string | null;
  readMessageId: number | null;
  unreadCount: number;
};

type ReadMap = Record<string, ConversationReadState>;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readState(): ReadMap {
  if (!canUseStorage()) return {};

  try {
    const raw = window.localStorage.getItem(getStorageKey());
    return raw ? (JSON.parse(raw) as ReadMap) : {};
  } catch {
    return {};
  }
}

function writeState(value: ReadMap) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(getStorageKey(), JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(CHAT_READ_EVENT));
}

export function getConversationReadAt(conversationId: number) {
  return readState()[String(conversationId)]?.readAt ?? null;
}

export function getConversationReadMessageId(conversationId: number) {
  return readState()[String(conversationId)]?.readMessageId ?? null;
}

export function getConversationUnreadCount(conversationId: number) {
  return readState()[String(conversationId)]?.unreadCount ?? 0;
}

export function markConversationRead(conversationId: number, timestamp: string, messageId?: number | null) {
  const next = readState();
  next[String(conversationId)] = {
    readAt: timestamp,
    readMessageId: messageId ?? next[String(conversationId)]?.readMessageId ?? null,
    unreadCount: 0,
  };
  writeState(next);
}

export function incrementConversationUnread(conversationId: number) {
  const next = readState();
  const current = next[String(conversationId)] ?? { readAt: null, readMessageId: null, unreadCount: 0 };

  next[String(conversationId)] = {
    ...current,
    unreadCount: current.unreadCount + 1,
  };

  writeState(next);
}

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
