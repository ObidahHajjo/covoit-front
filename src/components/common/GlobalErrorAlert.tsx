import { useError } from "../../app/useError";

export default function GlobalErrorAlert() {
  const { error, clearError } = useError();

  if (!error) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-start justify-between gap-4 rounded-xl border border-[#eee] bg-white px-5 py-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#999]">Error</p>
          <p className="mt-1 text-sm text-[#222] sm:text-base">{error.message}</p>
        </div>

        <button
          type="button"
          onClick={clearError}
          className="rounded-full border border-[#eee] px-3 py-1.5 text-sm font-medium text-[#666] transition hover:border-[#ccc] hover:text-[#222]"
        >
          Close
        </button>
      </div>
    </div>
  );
}
