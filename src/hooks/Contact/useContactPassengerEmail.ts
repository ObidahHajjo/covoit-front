import { type FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { contactPassengerByEmail } from "../../features/contact/contactEmailApi";
import { translate } from "../../i18n/config";

export function useContactPassengerEmail() {
  const { tripId, passengerId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(translate("contact.defaultPassengerEmailSubject"));
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!tripId || !passengerId) return;
    if (!subject.trim() || (!message.trim() && selectedFiles.length === 0)) return;

    try {
      setError(null);
      setSuccess(null);
      setSending(true);
      const feedback = await contactPassengerByEmail(Number(tripId), Number(passengerId), subject.trim(), message.trim(), selectedFiles);
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
