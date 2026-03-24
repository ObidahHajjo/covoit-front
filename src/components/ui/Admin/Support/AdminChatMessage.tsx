import { useI18n } from "../../../../i18n/I18nProvider";
import { formatLocaleTime } from "../../../../i18n/config";
import type { ChatMessage } from "../../../../types/Chat";

type Props = {
  message: ChatMessage;
};

function formatFileSize(sizeBytes: number): string {
  if (sizeBytes < 1024) return `${sizeBytes} B`;
  if (sizeBytes < 1024 * 1024) return `${(sizeBytes / 1024).toFixed(1)} KB`;
  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AdminChatMessage({ message }: Props) {
  const { t } = useI18n();
  const isMine = message.sender === "me";

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 shadow-sm ${isMine
            ? "rounded-br-md bg-[var(--theme-coral)] text-white"
            : "rounded-bl-md border border-[var(--theme-line)] bg-white text-gray-800"
          }`}
      >
        {message.body ? <p className="text-sm leading-5">{message.body}</p> : null}

        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 grid gap-1.5">
            {message.attachments.map((attachment) => (
              <a
                key={attachment.id}
                href={attachment.url}
                target="_blank"
                rel="noreferrer"
                className={`rounded-lg px-2 py-1.5 text-xs transition ${isMine
                    ? "border border-white/30 bg-white/10 text-white hover:bg-white/15"
                    : "border border-[var(--theme-line)] bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <span className="block truncate font-medium">{attachment.name}</span>
                <span className={`block text-[10px] ${isMine ? "text-white/70" : "text-gray-400"}`}>
                  {formatFileSize(attachment.sizeBytes)}
                </span>
              </a>
            ))}
          </div>
        )}

        <div className={`mt-1 flex items-center gap-1 text-[10px] font-medium ${isMine ? "text-white/70" : "text-gray-400"}`}>
          <span>{formatLocaleTime(message.createdAt, undefined, t("common.now"))}</span>
          {isMine && (
            <span>
              {message.attachments && message.attachments.length > 0 ? "✓✓" : "✓✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
