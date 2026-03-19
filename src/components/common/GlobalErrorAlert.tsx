import { useError } from "../../app/useError";

export default function GlobalErrorAlert() {
    const { error, clearError } = useError();

    if (!error) {
        return null;
    }

    return (
        <div className="sticky top-0 z-50 px-4 pt-4">
            <div className="mx-auto flex max-w-5xl items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 shadow-sm">
                <div>
                    <p className="font-semibold text-red-700">Error</p>
                    <p className="text-sm text-red-600">{error.message}</p>
                </div>

                <button
                    type="button"
                    onClick={clearError}
                    className="rounded-md px-2 py-1 text-sm font-medium text-red-700 hover:bg-red-100"
                >
                    Close
                </button>
            </div>
        </div>
    );
}