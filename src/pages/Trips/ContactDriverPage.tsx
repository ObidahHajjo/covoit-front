import { useContactDriver } from "../../context/Contact/useContactDriver";
import { LiveChatSection } from "../../components/ui/LiveChatSection";
import { useI18n } from "../../i18n/I18nProvider";

/**
 * Render the direct chat page a passenger uses to contact a driver about trip coordination.
 *
 * @returns The live chat section configured for passenger-to-driver messaging.
 */
export default function ContactDriverPage() {
  const { t } = useI18n();
  const {
    draft,
    setDraft,
    messages,
    sending,
    success,
    error,
    handleSubmit,
  } = useContactDriver();

  return (
    <LiveChatSection
      title={t("chat.contactDriverTitle")}
      subtitle={t("chat.contactDriverBody")}
      counterpartLabel={t("chat.driver")}
      messages={messages}
      draft={draft}
      sending={sending}
      success={success}
      error={error}
      onDraftChange={setDraft}
      onSubmit={handleSubmit}
    />
  );
}
