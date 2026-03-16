import { useError } from "../../app/ErrorContext";

export default function ErrorToastContainer() {
    const { errors, removeError } = useError();

    return (
        <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
            {errors.map((error) => (
                <div
                    key={error.id}
                    className="pointer-events-auto rounded-xl border border-red-200 bg-red-50 px-4 py-3 shadow-lg"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="font-semibold text-red-700">Error</p>
                            <p className="text-sm text-red-600">{error.message}</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => removeError(error.id)}
                            className="text-sm font-medium text-red-700 hover:text-red-900"
                        >
                            ×
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}