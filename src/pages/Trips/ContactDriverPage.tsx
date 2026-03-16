import {type FormEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { contactDriver } from "../../features/contact/contactApi";

export default function ContactDriverPage() {
    const { tripId } = useParams();
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setError(null);
            setSuccess(null);
            await contactDriver(Number(tripId), { subject, message });
            setSuccess("Message sent successfully.");
            setSubject("");
            setMessage("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send message");
        }
    }

    return (
        <section>
            <h1 className="mb-4 text-2xl font-bold">Contact Driver</h1>
            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-4 shadow-sm">
                {success && <p className="text-green-600">{success}</p>}
                {error && <p className="text-red-600">{error}</p>}
                <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="w-full rounded-xl border px-4 py-3" />
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} placeholder="Your message" className="w-full rounded-xl border px-4 py-3" />
                <button type="submit" className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white">Send Message</button>
            </form>
        </section>
    );
}