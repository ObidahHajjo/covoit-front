import { ContactEmailSection } from "../../components/ui/Contact/ContactEmailSection";
import { useContactPassengerEmail } from "../../hooks/Contact/useContactPassengerEmail";
import { useI18n } from "../../i18n/I18nProvider";

export default function ContactPassengerEmailPage() {
  const { t } = useI18n();
  const contact = useContactPassengerEmail();

  return (
    <ContactEmailSection
      title={t("contact.passengerEmailTitle")}
      subtitle={t("contact.passengerEmailBody")}
      subject={contact.subject}
      message={contact.message}
      selectedFiles={contact.selectedFiles}
      sending={contact.sending}
      success={contact.success}
      error={contact.error}
      onSubjectChange={contact.setSubject}
      onMessageChange={contact.setMessage}
      onFilesChange={contact.setSelectedFiles}
      onSubmit={contact.handleSubmit}
    />
  );
}
