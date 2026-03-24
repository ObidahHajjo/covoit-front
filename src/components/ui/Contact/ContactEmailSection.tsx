import type { FormEvent } from "react";
import FloatingToast from "../../common/FloatingToast";
import { useI18n } from "../../../i18n/I18nProvider";

type Props = {
  title: string;
  subtitle: string;
  subject: string;
  message: string;
  selectedFiles: File[];
  sending: boolean;
  success: string | null;
  error: string | null;
  onSubjectChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onFilesChange: (files: File[]) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  compact?: boolean;
};

export function ContactEmailSection({
  title,
  subtitle,
  subject,
  message,
  selectedFiles,
  sending,
  success,
  error,
  onSubjectChange,
  onMessageChange,
  onFilesChange,
  onSubmit,
  compact = false,
}: Props) {
  const { t } = useI18n();

  return (
    <div className={compact ? "w-full" : "mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-0"}>
      <FloatingToast tone="success" message={success} durationMs={6500} />
      <FloatingToast tone="error" message={error} durationMs={6500} />

      <section className="overflow-hidden rounded-[28px] border border-[var(--theme-line)] bg-[var(--theme-surface)] shadow-[var(--theme-shadow-warm)]">
        <div className="border-b border-[var(--theme-line)] bg-[linear-gradient(135deg,rgba(212,229,239,0.42),rgba(255,255,255,0.94))] px-5 py-6 sm:px-7 sm:py-7">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--theme-muted)]">{t("contact.emailChannel")}</p>
          <h1 className="mt-3 text-3xl font-medium leading-tight text-[var(--theme-ink)] sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--theme-muted-strong)] sm:text-base">{subtitle}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 p-5 sm:p-7">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[var(--theme-ink)]">{t("contact.subject")}</span>
            <input
              value={subject}
              onChange={(event) => onSubjectChange(event.target.value)}
              className="w-full rounded-2xl border border-[var(--theme-line)] bg-[rgba(246,248,245,0.86)] px-4 py-3 text-sm text-[var(--theme-ink)] outline-none transition focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[rgba(82,100,72,0.12)]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[var(--theme-ink)]">{t("contact.message")}</span>
            <textarea
              value={message}
              onChange={(event) => onMessageChange(event.target.value)}
              rows={7}
              placeholder={t("contact.messagePlaceholder")}
              className="w-full resize-y rounded-2xl border border-[var(--theme-line)] bg-[rgba(246,248,245,0.86)] px-4 py-3 text-sm text-[var(--theme-ink)] outline-none transition placeholder:text-[var(--theme-subtle)] focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[rgba(82,100,72,0.12)]"
            />
          </label>

          <div className="rounded-2xl border border-dashed border-[var(--theme-line)] bg-[var(--theme-bg-soft)] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--theme-ink)]">{t("contact.attachments")}</p>
                <p className="mt-1 text-xs text-[var(--theme-muted)]">{t("contact.attachmentsBody")}</p>
              </div>
              <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-[var(--theme-line)] bg-white px-4 py-2 text-sm font-medium text-[var(--theme-ink)] transition hover:border-[var(--theme-line-strong)]">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    const nextFiles = Array.from(event.target.files ?? []);
                    if (nextFiles.length > 0) {
                      onFilesChange([...selectedFiles, ...nextFiles].slice(0, 5));
                    }
                    event.target.value = "";
                  }}
                />
                {t("contact.addFiles")}
              </label>
            </div>

            {selectedFiles.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <span
                    key={`${file.name}-${file.size}-${index}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--theme-line)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--theme-ink)]"
                  >
                    <span className="max-w-[12rem] truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => onFilesChange(selectedFiles.filter((_, fileIndex) => fileIndex !== index))}
                      className="text-[var(--theme-muted)] transition hover:text-[var(--theme-ink)]"
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={sending || !subject.trim() || (!message.trim() && selectedFiles.length === 0)}
              className="rounded-full bg-[var(--theme-primary)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--theme-primary-dim)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? t("common.sending") : t("contact.sendEmail")}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
