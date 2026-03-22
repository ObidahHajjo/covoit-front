const STORAGE_KEY = "covoit.chat.last-read";
export const CHAT_READ_EVENT = "covoit:chat-read-changed";

type ReadMap = Record<string, string>;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readState(): ReadMap {
  if (!canUseStorage()) return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ReadMap) : {};
  } catch {
    return {};
  }
}

function writeState(value: ReadMap) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(CHAT_READ_EVENT));
}

export function getConversationReadAt(conversationId: number) {
  return readState()[String(conversationId)] ?? null;
}

export function markConversationRead(conversationId: number, timestamp: string) {
  const next = readState();
  next[String(conversationId)] = timestamp;
  writeState(next);
}

export function getConversationUnread(conversationId: number, updatedAt: string, latestSender?: "me" | "other" | "system" | null) {
  if (latestSender !== "other") return false;

  const readAt = getConversationReadAt(conversationId);
  if (!readAt) return true;

  return new Date(updatedAt).getTime() > new Date(readAt).getTime();
}
