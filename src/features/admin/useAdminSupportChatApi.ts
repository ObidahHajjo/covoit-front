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
