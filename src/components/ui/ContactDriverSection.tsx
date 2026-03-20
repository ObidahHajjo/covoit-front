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
	"w-full rounded-[12px] border border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-3.5 text-sm text-[var(--theme-ink)] outline-none transition placeholder:text-[var(--theme-subtle)] focus:border-[var(--theme-primary)]";

export function ContactDriverSection({
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
		<section className="overflow-hidden rounded-[24px] border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-5 py-6 text-[var(--theme-ink)] sm:px-7 sm:py-8">
		<p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--theme-muted)]">Driver message</p>
		<h1 className="mt-3 text-4xl font-medium leading-[1.1] text-[var(--theme-ink)] sm:text-5xl">Send a clear, friendly note to the driver.</h1>
		<p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--theme-muted-strong)] sm:text-base">
		Share pickup context, timing questions, or quick coordination details before the trip starts.
		</p>

		<form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-[16px] border border-[var(--theme-line)] bg-[var(--theme-surface)] p-5 sm:p-6">
		{success ? (
			<div className="rounded-[12px] border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-4 py-3 text-sm font-medium text-[var(--theme-ink)]">
			{success}
			</div>
		) : null}
		{error ? (
			<div className="rounded-[12px] border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-4 py-3 text-sm font-medium text-[var(--theme-ink)]">
			{error}
			</div>
		) : null}

		<div className="space-y-2">
			<label className="block text-xs font-medium uppercase tracking-[0.15em] text-[var(--theme-muted)]">Subject line</label>
			<input
			value={subject}
			onChange={(e) => onSubjectChange(e.target.value)}
			placeholder="Pickup update, arrival time, or a quick hello"
			className={inputClass}
			/>
		</div>

		<div className="space-y-2">
			<label className="block text-xs font-medium uppercase tracking-[0.15em] text-[var(--theme-muted)]">Your message</label>
			<textarea
			value={message}
			onChange={(e) => onMessageChange(e.target.value)}
			rows={7}
			placeholder="Hi, I just wanted to confirm the meeting spot and let you know..."
			className={`${inputClass} resize-y`}
			/>
		</div>

		<button type="submit" className="w-full rounded-full bg-[var(--theme-primary)] px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[var(--theme-primary-dim)]">
			Send message
		</button>
		</form>
		</section>
	</div>
	);
}
