import { type FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { contactDriver } from "../../features/contact/contactApi.ts";
import type { ChatMessage } from "../../types/Chat.ts";
import { translate } from "../../i18n/config.ts";

/**
 * Manages the form used to open or resume a chat with a trip driver.
 *
 * @returns Contact form state and submit handler for the driver conversation flow.
 */
export function useContactDriver() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [draft, setDraft] = useState("");
  const [messages] = useState<ChatMessage[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  /**
   * Creates or reuses the driver conversation, then redirects to chat.
   *
   * @param event - Form submission event from the contact form.
   * @returns A promise that resolves once the chat-open flow completes.
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = draft.trim();
    if (!content) return;

    try {
      setError(null);
      setSuccess(null);
      setSending(true);
      const conversation = await contactDriver(Number(tripId), { subject: translate("common.message"), message: content });
      setSuccess(translate("chat.opening"));
      setDraft("");
      navigate(`/chat/${conversation.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : translate("chat.sendFailed"));
    } finally {
      setSending(false);
    }
  }

  return {
    draft,
    setDraft,
    messages,
    sending,
    success,
    error,
    handleSubmit,
  };
}
