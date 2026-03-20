import { PageIntro } from "./SerenePrimitives";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return <PageIntro eyebrow="Serene Path" title={title} description={subtitle} className="mb-6" />;
}
