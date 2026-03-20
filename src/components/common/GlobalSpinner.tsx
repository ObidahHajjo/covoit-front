import { useLoading } from "../../context/LoadingContext";

export default function GlobalSpinner() {
  const { isLoading } = useLoading();

  if (!isLoading) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(0,0,0,0.1)] px-4">
      <div className="flex items-center gap-4 rounded-xl border border-[#eee] bg-white px-5 py-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#eee] border-t-[#222]" />
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#666]">Loading</p>
          <p className="text-sm text-[#888]">Preparing your route...</p>
        </div>
      </div>
    </div>
  );
}
