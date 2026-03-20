import { useError } from "../../app/useError";

export default function GlobalErrorAlert() {
    const { error, clearError } = useError();

    if (!error) {
        return null;
    }

    return (
        <div className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
            <div className="mx-auto flex max-w-5xl items-start justify-between gap-4 rounded-[1.75rem] border border-[rgba(235,90,54,0.2)] bg-[rgba(255,248,238,0.92)] px-5 py-4 shadow-warm backdrop-blur-xl">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--theme-coral-deep)]">Something went off route</p>
                    <p className="mt-1 text-sm text-[var(--theme-ink)] sm:text-base">{error.message}</p>
                </div>

                <button
                    type="button"
                    onClick={clearError}
                    className="rounded-full border border-[var(--theme-line)] px-3 py-1.5 text-sm font-semibold text-[var(--theme-ink)] transition hover:bg-white/70"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
