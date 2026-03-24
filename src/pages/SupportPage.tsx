import { SupportSection } from "../components/ui/Support/SupportSection";
import { useSupportCenter } from "../hooks/Support/useSupportCenter";
import { useSupportChat } from "../hooks/Support/useSupportChat";

export default function SupportPage() {
  const support = useSupportCenter();
  const supportChat = useSupportChat();

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
      isOpen={supportChat.isOpen}
      messages={supportChat.conversation?.messages ?? []}
      draft={supportChat.draft}
      selectedChatFiles={supportChat.selectedFiles}
      sendingChat={supportChat.sending}
      connectionStatus={supportChat.connectionStatus}
      isAdminTyping={supportChat.isAdminTyping}
      chatSuccess={supportChat.success}
      chatError={supportChat.error}
      onDraftChange={supportChat.setDraft}
      onChatFilesChange={supportChat.setSelectedFiles}
      onChatSubmit={supportChat.handleSubmit}
      onOpenChat={supportChat.openChat}
      onCloseChat={supportChat.closeChat}
    />
  );
}
