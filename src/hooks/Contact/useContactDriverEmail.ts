import { type FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { contactDriverByEmail } from "../../features/contact/contactEmailApi";
import { translate } from "../../i18n/config";

export function useContactDriverEmail() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(translate("contact.defaultDriverEmailSubject"));
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!tripId) return;
    if (!subject.trim() || (!message.trim() && selectedFiles.length === 0)) return;

    try {
      setError(null);
      setSuccess(null);
      setSending(true);
      const feedback = await contactDriverByEmail(Number(tripId), subject.trim(), message.trim(), selectedFiles);
      setSuccess(feedback);
      setMessage("");
      setSelectedFiles([]);
      window.setTimeout(() => navigate(-1), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : translate("contact.emailSendFailed"));
    } finally {
      setSending(false);
    }
  }

  return {
    subject,
    setSubject,
    message,
    setMessage,
    selectedFiles,
    setSelectedFiles,
    sending,
    success,
    error,
    handleSubmit,
  };
}
