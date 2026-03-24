import { SupportSection } from "../components/ui/Support/SupportSection";
import { useSupportCenter } from "../hooks/Support/useSupportCenter";

export default function SupportPage() {
  const support = useSupportCenter();

  return (
    <SupportSection
      subject={support.subject}
      message={support.message}
      selectedFiles={support.selectedFiles}
      sending={support.sending}
      success={support.success}
      error={support.error}
      faqs={support.faqs}
      onSubjectChange={support.setSubject}
      onMessageChange={support.setMessage}
      onFilesChange={support.setSelectedFiles}
      onSubmit={support.handleSubmit}
    />
  );
}
