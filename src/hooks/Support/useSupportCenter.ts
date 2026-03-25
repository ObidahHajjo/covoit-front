import { type FormEvent, useMemo, useState } from "react";
import { sendSupportEmail } from "../../features/contact/contactEmailApi";
import { validateAttachments } from "../../features/contact/attachmentValidation";
import { useI18n } from "../../i18n/I18nProvider";

/**
 * Hook to manage the support center interface.
 * Provides FAQ data and handles support email submissions.
 *
 * @returns State and handlers for the support center.
 */
export function useSupportCenter() {
  const { t } = useI18n();
  const [subject, setSubject] = useState(t("support.defaultSubject"));
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const faqs = useMemo(
    () => [
      { question: t("support.faqAccountQuestion"), answer: t("support.faqAccountAnswer") },
      { question: t("support.faqBookingQuestion"), answer: t("support.faqBookingAnswer") },
      { question: t("support.faqChatQuestion"), answer: t("support.faqChatAnswer") },
      { question: t("support.faqFilesQuestion"), answer: t("support.faqFilesAnswer") },
    ],
    [t],
  );

  function handleFilesChange(files: File[]) {
    const validation = validateAttachments(files);

    if (!validation.isValid) {
      setError(
        validation.reason === "too_many_files"
          ? t("contact.attachmentsCountError", { count: validation.maxCount })
          : t("contact.attachmentTooLarge", {
              fileName: validation.fileName,
              maxSizeMb: validation.maxSizeMb,
            }),
      );
      return;
    }

    setError(null);
    setSelectedFiles(files);
  }

  /**
   * Handles the submission of the support contact form.
   *
   * @param event - The React form event.
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!subject.trim() || (!message.trim() && selectedFiles.length === 0)) return;

    try {
      setError(null);
      setSuccess(null);
      setSending(true);
      const feedback = await sendSupportEmail(subject.trim(), message.trim(), selectedFiles);
      setSuccess(feedback);
      setMessage("");
      setSelectedFiles([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("support.emailFailed"));
    } finally {
      setSending(false);
    }
  }

  return {
    subject,
    setSubject,
    message,
    setMessage,
    selectedFiles,
    handleFilesChange,
    sending,
    success,
    error,
    faqs,
    handleSubmit,
  };
}
