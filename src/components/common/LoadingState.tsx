export default function LoadingState() {
  return (
    <div className="serene-alert flex flex-col items-center justify-center gap-3 p-6 text-center text-sm text-[var(--theme-muted)]">
      <div className="serene-spinner h-8 w-8" />
      <span>Loading...</span>
    </div>
  );
}
