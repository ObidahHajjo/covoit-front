import { Link } from "react-router-dom";
import FloatingToast from "../../common/FloatingToast";
import { ContactEmailSection } from "../Contact/ContactEmailSection";
import type { FormEvent } from "react";
import { useI18n } from "../../../i18n/I18nProvider";

type FaqItem = {
  question: string;
  answer: string;
};

type Props = {
  subject: string;
  message: string;
  selectedFiles: File[];
  sending: boolean;
  success: string | null;
  error: string | null;
  faqs: FaqItem[];
  onSubjectChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onFilesChange: (files: File[]) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function SupportSection(props: Props) {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <FloatingToast tone="success" message={props.success} durationMs={6500} />
      <FloatingToast tone="error" message={props.error} durationMs={6500} />

      <section className="overflow-hidden rounded-[30px] border border-[var(--theme-line)] bg-[linear-gradient(135deg,rgba(212,233,197,0.34),rgba(212,229,239,0.32),rgba(255,255,255,0.94))] px-5 py-6 shadow-[var(--theme-shadow-warm)] sm:px-7 sm:py-8">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--theme-muted)]">{t("support.kicker")}</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-medium leading-tight text-[var(--theme-ink)] sm:text-4xl">{t("support.title")}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--theme-muted-strong)] sm:text-base">{t("support.body")}</p>
          </div>

          <div className="rounded-[1.6rem] border border-[var(--theme-line)] bg-white/80 p-5 backdrop-blur-sm">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--theme-muted)]">{t("support.liveHelp")}</p>
            <h2 className="mt-2 text-xl font-medium text-[var(--theme-ink)]">{t("support.liveHelpTitle")}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--theme-muted)]">{t("support.liveHelpBody")}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/chat" className="rounded-full bg-[var(--theme-primary)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--theme-primary-dim)]">
                {t("support.openChat")}
              </Link>
              <Link to="/find-trip" className="rounded-full border border-[var(--theme-line)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--theme-ink)] transition hover:border-[var(--theme-line-strong)]">
                {t("support.findTrip")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[28px] border border-[var(--theme-line)] bg-[var(--theme-surface)] p-5 shadow-[var(--theme-shadow-warm)] sm:p-7">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--theme-muted)]">{t("support.faq")}</p>
          <h2 className="mt-3 text-2xl font-medium text-[var(--theme-ink)]">{t("support.faqTitle")}</h2>
          <div className="mt-5 space-y-3">
            {props.faqs.map((item) => (
              <details key={item.question} className="group rounded-2xl border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] p-4">
                <summary className="cursor-pointer list-none text-sm font-medium text-[var(--theme-ink)]">{item.question}</summary>
                <p className="mt-3 text-sm leading-6 text-[var(--theme-muted)]">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>

        <ContactEmailSection
          title={t("support.emailTitle")}
          subtitle={t("support.emailBody")}
          subject={props.subject}
          message={props.message}
          selectedFiles={props.selectedFiles}
          sending={props.sending}
          success={null}
          error={null}
          onSubjectChange={props.onSubjectChange}
          onMessageChange={props.onMessageChange}
          onFilesChange={props.onFilesChange}
          onSubmit={props.onSubmit}
          compact
        />
      </section>
    </div>
  );
}
