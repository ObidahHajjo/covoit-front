import { type ChangeEvent, type FormEvent } from "react";
import { useI18n } from "../../../../i18n/I18nProvider";

type Props = {
  draft: string;
  selectedFiles: File[];
  sending: boolean;
  disabled?: boolean;
  onDraftChange: (value: string) => void;
  onSelectedFilesChange: (files: File[]) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onTyping: () => void;
};

export function AdminChatInput({
  draft,
  selectedFiles,
  sending,
  disabled,
  onDraftChange,
  onSelectedFilesChange,
  onSubmit,
  onTyping,
}: Props) {
  const { t } = useI18n();

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFiles = Array.from(event.target.files ?? []);
    if (nextFiles.length === 0) return;
    onSelectedFilesChange([...selectedFiles, ...nextFiles].slice(0, 5));
    event.target.value = "";
  };

  const removeSelectedFile = (index: number) => {
    onSelectedFilesChange(selectedFiles.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={onSubmit} className="border-t border-[var(--theme-line)] bg-white p-3">
      {selectedFiles.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {selectedFiles.map((file, index) => (
            <span
              key={`${file.name}-${file.size}-${index}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--theme-line)] bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700"
            >
              <span className="max-w-[8rem] truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeSelectedFile(index)}
                className="rounded-full text-gray-400 transition hover:text-gray-600"
              >
                x
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="sr-only">{t("common.message")}</label>
          <textarea
            value={draft}
            onChange={(event) => {
              onDraftChange(event.target.value);
              onTyping();
            }}
            rows={1}
            disabled={disabled}
            placeholder={t("admin.typeMessage")}
            className="w-full resize-none rounded-xl border border-[var(--theme-line)] bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[var(--theme-coral)] focus:ring-2 focus:ring-[rgba(232,90,79,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                if (draft.trim() || selectedFiles.length > 0) {
                  const form = event.currentTarget.form;
                  if (form) form.requestSubmit();
                }
              }
            }}
          />
        </div>
        <div className="flex gap-1.5">
          <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-[var(--theme-line)] bg-white p-2 transition hover:border-gray-300">
            <input type="file" multiple className="hidden" onChange={handleFileSelection} disabled={disabled} />
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.49" />
            </svg>
          </label>
          <button
            type="submit"
            disabled={disabled || sending || (draft.trim().length === 0 && selectedFiles.length === 0)}
            className="inline-flex items-center justify-center rounded-full bg-[var(--theme-coral)] p-2 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={t("common.send")}
          >
            {sending ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
