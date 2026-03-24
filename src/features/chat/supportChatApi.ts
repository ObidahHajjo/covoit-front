import { apiClient } from "../../app/apiClient";
import { extractApiErrorMessage } from "../../app/apiError";
import type { ApiResponse } from "../../types/ApiResponse";
import type { ChatAttachment, ChatMessage } from "../../types/Chat";
import { API_BASE_URL } from "../../app/apiClient";

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
    sender: message.is_from_admin ? "other" : "me",
    senderPersonId: message.is_from_admin ? -1 : 0,
    createdAt: message.created_at,
    attachments: (message.attachments ?? []).map((a) => mapAttachment(a, message.session_id)),
  };
}

export type SupportConversation = {
  id: number;
  status: string;
  createdAt: string;
  messages: ChatMessage[];
};

export async function getOrCreateSupportConversation(): Promise<SupportConversation> {
  try {
    const { data } = await apiClient.post<ApiResponse<SupportChatSessionApi>>("/support-chat/sessions", {}, { showGlobalLoader: false });
    return {
      id: data.data.id,
      status: data.data.status,
      createdAt: data.data.created_at,
      messages: [],
    };
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

export async function getMessages(sessionId: number): Promise<ChatMessage[]> {
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

export async function sendSupportMessage(sessionId: number, message: string, attachments: File[] = []): Promise<ChatMessage> {
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

export async function closeSupportConversation(sessionId: number): Promise<void> {
  try {
    await apiClient.post(`/support-chat/sessions/${sessionId}/close`, {}, { showGlobalLoader: false });
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}
