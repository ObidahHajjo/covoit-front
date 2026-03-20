import { useError } from "../../app/useError";
import { Notice, SereneButton } from "./SerenePrimitives";

export default function GlobalErrorAlert() {
  const { error, clearError } = useError();

  if (!error) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <Notice tone="error" className="mx-auto flex max-w-5xl items-start justify-between gap-4 px-5 py-4">
        <div>
          <p className="serene-kicker">Error</p>
          <p className="mt-1 text-sm text-[var(--theme-ink)] sm:text-base">{error.message}</p>
        </div>

        <SereneButton type="button" variant="secondary" onClick={clearError} className="min-h-0 px-4 py-2">
          Close
        </SereneButton>
      </Notice>
    </div>
  );
}
