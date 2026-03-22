import { type FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { contactPassenger } from "../../features/contact/contactApi";
import type { ChatMessage } from "../../types/Chat";

export function useContactPassenger() {
  const { tripId, personId } = useParams();
  const navigate = useNavigate();
  const [draft, setDraft] = useState("");
  const [messages] = useState<ChatMessage[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = draft.trim();
    if (!content) return;

    try {
      setError(null);
      setSuccess(null);
      setSending(true);
      const conversation = await contactPassenger(Number(tripId), Number(personId), { subject: "Chat message", message: content });
      setSuccess("Opening chat...");
      setDraft("");
      navigate(`/chat/${conversation.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
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
