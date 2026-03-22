import { PageIntro } from "./SerenePrimitives";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

/**
 * Wrap page titles in the shared intro layout.
 *
 * @param props - Component props for the page heading content.
 * @param props.title - Main page title.
 * @param props.subtitle - Optional supporting subtitle shown below the title.
 * @returns The rendered shared page intro.
 */
export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return <PageIntro eyebrow="Serene Path" title={title} description={subtitle} className="mb-6" />;
}
