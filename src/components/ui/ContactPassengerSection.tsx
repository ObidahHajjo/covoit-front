import type { FormEvent } from "react";

type Props = {
  subject: string;
  onSubjectChange: (value: string) => void;
  message: string;
  onMessageChange: (value: string) => void;
  success: string | null;
  error: string | null;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export function ContactPassengerSection({
  subject,
  onSubjectChange,
  message,
  onMessageChange,
  success,
  error,
  onSubmit,
}: Props) {
  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Contact Passenger</h1>
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-white p-4 shadow-sm">
        {success && <p className="text-green-600">{success}</p>}
        {error && <p className="text-red-600">{error}</p>}
        <input
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          placeholder="Subject"
          className="w-full rounded-xl border px-4 py-3"
        />
        <textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          rows={6}
          placeholder="Your message"
          className="w-full rounded-xl border px-4 py-3"
        />
        <button type="submit" className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white">
          Send Message
        </button>
      </form>
    </section>
  );
}
