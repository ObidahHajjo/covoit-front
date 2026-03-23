import { useContactPassenger } from "../../context/Contact/useContactPassenger";
import { LiveChatSection } from "../../components/ui/Chat/LiveChatSection.tsx";
import { useI18n } from "../../i18n/I18nProvider";

/**
 * Render the direct chat page a driver uses to coordinate details with a passenger.
 *
 * @returns The live chat section configured for driver-to-passenger messaging.
 */
export default function ContactPassengerPage() {
  const { t } = useI18n();
  const {
    draft,
    setDraft,
    messages,
    sending,
    success,
    error,
    handleSubmit,
  } = useContactPassenger();

  return (
    <LiveChatSection
      title={t("chat.contactPassengerTitle")}
      subtitle={t("chat.contactPassengerBody")}
      counterpartLabel={t("chat.passenger")}
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
