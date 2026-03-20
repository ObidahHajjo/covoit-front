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
    "w-full rounded-[20px] border border-[#e5d8c8] bg-white px-4 py-3.5 text-sm text-[#18352d] outline-none transition placeholder:text-[#8ea198] focus:border-[#f3b8ab] focus:ring-4 focus:ring-[#f7d7cf]";

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
            <section className="overflow-hidden rounded-[40px] border border-[#efe2d4] bg-[linear-gradient(180deg,rgba(255,247,238,0.96),rgba(247,237,226,0.88))] px-5 py-6 text-[#18352d] shadow-[0_36px_90px_-50px_rgba(24,53,45,0.45)] sm:px-7 sm:py-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b06f60]">Passenger message</p>
                <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.02] text-[#18352d] sm:text-5xl">Reach out with trip details that feel easy to follow.</h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-[#4c655b] sm:text-base">
                    Confirm timing, pickup notes, or anything your passenger should know before the ride begins.
                </p>

                <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-[32px] border border-white/70 bg-white/65 p-5 shadow-[0_28px_80px_-44px_rgba(24,53,45,0.38)] backdrop-blur-xl sm:p-6">
                    {success ? (
                        <div className="rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                            {success}
                        </div>
                    ) : null}
                    {error ? (
                        <div className="rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                            {error}
                        </div>
                    ) : null}

                    <div className="space-y-2">
                        <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-[#b06f60]">Subject line</label>
                        <input
                            value={subject}
                            onChange={(e) => onSubjectChange(e.target.value)}
                            placeholder="Pickup point, trip reminder, or update"
                            className={inputClass}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-[#b06f60]">Your message</label>
                        <textarea
                            value={message}
                            onChange={(e) => onMessageChange(e.target.value)}
                            rows={7}
                            placeholder="Hello, here is a quick note about where to meet and what to expect..."
                            className={`${inputClass} resize-y`}
                        />
                    </div>

                    <button type="submit" className="w-full rounded-full bg-[#f26f5a] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_18px_38px_-20px_rgba(242,111,90,0.75)] transition hover:bg-[#e4604b]">
                        Send message
                    </button>
                </form>
            </section>
        </div>
    );
}
