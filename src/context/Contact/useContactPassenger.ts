import { type FormEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { contactPassenger } from "../../features/contact/contactApi";

export function useContactPassenger() {
  const { tripId, personId } = useParams();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setError(null);
      setSuccess(null);
      await contactPassenger(Number(tripId), Number(personId), { subject, message });
      setSuccess("Message sent successfully.");
      setSubject("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    }
  }

  return {
    subject,
    setSubject,
    message,
    setMessage,
    success,
    error,
    handleSubmit,
  };
}
