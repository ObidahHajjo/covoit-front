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

const inputClass =
  "w-full rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-3 text-sm text-[var(--theme-ink)] outline-none transition placeholder:text-[var(--theme-subtle)] focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[rgba(82,100,72,0.16)]";

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
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-0">
      <section className="overflow-hidden rounded-2xl border border-[var(--theme-line)] bg-[var(--theme-surface)] px-5 py-6 sm:px-7 sm:py-8">
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--theme-muted)]">Passenger message</p>
        <h1 className="mt-3 text-3xl font-medium leading-tight text-[var(--theme-ink)] sm:text-4xl">Contact Passenger</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--theme-muted-strong)] sm:text-base">
          Confirm timing, pickup notes, or anything your passenger should know before the ride begins.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-xl border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] p-5 sm:p-6">
          {success ? (
            <div className="rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-3 text-sm font-medium text-[var(--theme-ink)]">
              {success}
            </div>
          ) : null}
          {error ? (
            <div className="rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-3 text-sm font-medium text-[var(--theme-ink)]">
              {error}
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-[var(--theme-muted-strong)]">Subject line</label>
            <input
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
              placeholder="Pickup point, trip reminder, or update"
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-[var(--theme-muted-strong)]">Your message</label>
            <textarea
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              rows={7}
              placeholder="Hello, here is a quick note about where to meet and what to expect..."
              className={`${inputClass} resize-y`}
            />
          </div>

          <button type="submit" className="w-full rounded-lg border border-[var(--theme-primary)] bg-[var(--theme-primary)] px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[#444]">
            Send message
          </button>
        </form>
      </section>
    </div>
  );
}
