import { useEffect, useState, type ReactNode } from "react";

type ToastTone = "success" | "error";

type FloatingToastProps = {
  message?: ReactNode | null;
  tone: ToastTone;
  durationMs?: number;
};

/**
 * Display a temporary floating toast when a message is present.
 *
 * @param props - Component props controlling the toast content and timing.
 * @param props.message - Content to show in the toast. When nullish, no toast is rendered.
 * @param props.tone - Visual tone applied to the toast styling.
 * @param props.durationMs - Time in milliseconds before the toast hides itself.
 * @returns The rendered toast container, or `null` when nothing should be shown.
 */
export default function FloatingToast({ message, tone, durationMs = 5000 }: FloatingToastProps) {
  const [displayedMessage, setDisplayedMessage] = useState<ReactNode | null>(null);
  const [visible, setVisible] = useState(false);
  const effectiveDurationMs = Math.min(durationMs, 5000);

  useEffect(() => {
    if (message == null) {
      return;
    }

    setDisplayedMessage(message);
    setVisible(true);

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, effectiveDurationMs);

    return () => window.clearTimeout(timer);
  }, [message, effectiveDurationMs]);

  if (!visible || displayedMessage == null) {
    return null;
  }

  const toneClass =
    tone === "success"
      ? "border-green-200 bg-green-50 text-green-700"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <div className="fixed right-4 top-4 z-[70] sm:right-6 sm:top-6">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setVisible(false)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setVisible(false);
          }
        }}
        className={`min-w-[260px] max-w-sm rounded-xl border px-4 py-3 text-sm font-medium shadow-[0_16px_40px_-24px_rgba(15,23,42,0.45)] backdrop-blur-sm ${toneClass}`}
      >
        {displayedMessage}
      </div>
    </div>
  );
}
