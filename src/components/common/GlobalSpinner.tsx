import { useLoading } from "../../context/LoadingContext";

export default function GlobalSpinner() {
    const { isLoading } = useLoading();

    if (!isLoading) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center bg-black/20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-slate-700" />
            </div>
    );
}