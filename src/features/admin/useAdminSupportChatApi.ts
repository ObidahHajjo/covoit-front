import { apiClient } from "../../app/apiClient";
import { extractApiErrorMessage } from "../../app/apiError";
import { API_BASE_URL } from "../../app/apiClient";
import type { ChatAttachment, ChatMessage } from "../../types/Chat";

type SupportChatSenderApi = {
  id: number;
  email: string;
  name: string | null;
};

type SupportChatAttachmentApi = {
  id: number;
  original_name: string;
  mime_type: string;
  size_bytes: number;
};

type SupportChatMessageApi = {
  id: number;
  session_id: number;
  sender?: SupportChatSenderApi;
  is_from_admin: boolean;
  body: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  attachments?: SupportChatAttachmentApi[];
};

export type AdminSupportSession = {
  id: number;
  user: { id: number; email: string; name: string | null } | null;
  admin: { id: number; email: string; name: string | null } | null;
  status: string;
  subject: string | null;
  lastMessageAt: string | null;
  createdAt: string;
  closedAt: string | null;
  lastMessage: { body: string; createdAt: string } | null;
};

type SupportChatSessionApi = {
  id: number;
  user?: SupportChatSenderApi;
  admin?: SupportChatSenderApi | null;
  status: string;
  subject: string | null;
  last_message_at: string | null;
  created_at: string;
  closed_at: string | null;
  last_message?: {
    body: string;
    created_at: string;
  } | null;
};

function mapSession(session: SupportChatSessionApi): AdminSupportSession {
  return {
    id: session.id,
    user: session.user ?? null,
    admin: session.admin ?? null,
    status: session.status,
    subject: session.subject,
    lastMessageAt: session.last_message_at,
    createdAt: session.created_at,
    closedAt: session.closed_at,
    lastMessage: session.last_message
      ? { body: session.last_message.body, createdAt: session.last_message.created_at }
      : null,
  };
}

function mapAttachment(attachment: SupportChatAttachmentApi, sessionId: number): ChatAttachment {
  return {
    id: attachment.id,
    name: attachment.original_name,
    mimeType: attachment.mime_type,
    sizeBytes: attachment.size_bytes,
    url: `${API_BASE_URL}/support-chat/sessions/${sessionId}/attachments/${attachment.id}`,
  };
}

function mapMessage(message: SupportChatMessageApi): ChatMessage {
  return {
    id: message.id,
    body: message.body,
    sender: message.is_from_admin ? "me" : "other",
    senderPersonId: message.is_from_admin ? 0 : -1,
    createdAt: message.created_at,
    attachments: (message.attachments ?? []).map((a) => mapAttachment(a, message.session_id)),
  };
}

/**
 * Fetches the list of support sessions currently waiting for an admin to join.
 *
 * @returns A promise resolving to an array of waiting support sessions.
 */
export async function fetchWaitingSessions(): Promise<AdminSupportSession[]> {
  try {
    const { data } = await apiClient.get<{ data: SupportChatSessionApi[] }>(
      "/support-chat/sessions/waiting",
      { showGlobalLoader: false }
    );
    return data.data.map(mapSession);
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

/**
 * Fetches the list of support sessions currently being handled by admins.
 *
 * @returns A promise resolving to an array of active support sessions.
 */
export async function fetchActiveAdminSessions(): Promise<AdminSupportSession[]> {
  try {
    const { data } = await apiClient.get<{ data: SupportChatSessionApi[] }>(
      "/support-chat/sessions",
      { showGlobalLoader: false }
    );
    return data.data.map(mapSession);
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

/**
 * Fetches the full details of a specific support session.
 *
 * @param sessionId - The ID of the session to retrieve.
 * @returns A promise resolving to the session details.
 */
export async function fetchAdminSession(sessionId: number): Promise<AdminSupportSession> {
  try {
    const { data } = await apiClient.get<{ data: SupportChatSessionApi }>(
      `/support-chat/sessions/${sessionId}`,
      { showGlobalLoader: false }
    );
    return mapSession(data.data);
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

/**
 * Retrieves the message history for a specific support session.
 *
 * @param sessionId - The ID of the session.
 * @returns A promise resolving to an array of chat messages.
 */
export async function getAdminMessages(sessionId: number): Promise<ChatMessage[]> {
  try {
    const { data } = await apiClient.get<{ data: SupportChatMessageApi[] }>(
      `/support-chat/sessions/${sessionId}/messages`,
      { showGlobalLoader: false }
    );
    return data.data.map(mapMessage).reverse();
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

/**
 * Sends a message from the admin to a support session.
 * Supports optional file attachments.
 *
 * @param sessionId - The ID of the session.
 * @param message - The text body of the message.
 * @param attachments - Optional array of files to attach.
 * @returns A promise resolving to the created chat message.
 */
export async function adminSendMessage(
  sessionId: number,
  message: string,
  attachments: File[] = []
): Promise<ChatMessage> {
  try {
    const payload = new FormData();
    payload.append("body", message);
    attachments.forEach((file) => payload.append("attachments[]", file));

    const { data } = await apiClient.post<SupportChatMessageApi>(
      `/support-chat/sessions/${sessionId}/messages`,
      payload,
      { showGlobalLoader: false, headers: { "Content-Type": "multipart/form-data" } }
    );
    return mapMessage(data);
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

/**
 * Joins a waiting support session as an admin.
 *
 * @param sessionId - The ID of the session to join.
 * @returns A promise resolving to the updated session details.
 */
export async function adminJoinSession(sessionId: number): Promise<AdminSupportSession> {
  try {
    const { data } = await apiClient.post<{ data: SupportChatSessionApi }>(
      `/support-chat/sessions/${sessionId}/join`,
      {},
      { showGlobalLoader: false }
    );
    return mapSession(data.data);
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

/**
 * Closes an active support session.
 *
 * @param sessionId - The ID of the session to close.
 */
export async function adminCloseSession(sessionId: number): Promise<void> {
  try {
    await apiClient.post(
      `/support-chat/sessions/${sessionId}/close`,
      {},
      { showGlobalLoader: false }
    );
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

/**
 * Marks all messages in a session as read by the admin.
 *
 * @param sessionId - The ID of the session.
 */
export async function adminMarkAsRead(sessionId: number): Promise<void> {
  try {
    await apiClient.post(
      `/support-chat/sessions/${sessionId}/read`,
      {},
      { showGlobalLoader: false }
    );
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

/**
 * Updates the typing status of the admin in a session.
 *
 * @param sessionId - The ID of the session.
 * @param isTyping - Whether the admin is currently typing.
 */
export async function adminSetTyping(sessionId: number, isTyping: boolean): Promise<void> {
  try {
    await apiClient.post(
      `/support-chat/sessions/${sessionId}/typing`,
      { is_typing: isTyping },
      { showGlobalLoader: false }
    );
  } catch {
    // Silently ignore typing errors
  }
}
