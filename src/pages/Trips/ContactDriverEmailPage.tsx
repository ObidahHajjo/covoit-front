import { ContactEmailSection } from "../../components/ui/Contact/ContactEmailSection";
import { useContactDriverEmail } from "../../hooks/Contact/useContactDriverEmail";
import { useI18n } from "../../i18n/I18nProvider";

export default function ContactDriverEmailPage() {
  const { t } = useI18n();
  const contact = useContactDriverEmail();

  return (
    <ContactEmailSection
      title={t("contact.driverEmailTitle")}
      subtitle={t("contact.driverEmailBody")}
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
