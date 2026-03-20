import { useLoading } from "../../context/LoadingContext";

export default function GlobalSpinner() {
    const { isLoading } = useLoading();

    if (!isLoading) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(23,48,31,0.16)] px-4 backdrop-blur-sm">
            <div className="flex items-center gap-4 rounded-full border border-[var(--theme-line)] bg-[rgba(255,248,238,0.92)] px-5 py-4 shadow-warm">
                <div className="h-11 w-11 animate-spin rounded-full border-4 border-[rgba(255,122,89,0.2)] border-t-[var(--theme-coral-deep)]" />
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--theme-coral-deep)]">Loading</p>
                    <p className="text-sm text-[var(--theme-muted)]">Preparing your route...</p>
                </div>
            </div>
        </div>
    );
}
