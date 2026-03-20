import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

type PageIntroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function PageIntro({
  eyebrow,
  title,
  description,
  actions,
  children,
  className,
}: PageIntroProps) {
  return (
    <section className={cx("serene-page-shell", className)}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow ? <p className="serene-kicker">{eyebrow}</p> : null}
          <h1 className="mt-3 serene-title">{title}</h1>
          {description ? <p className="mt-4 max-w-2xl serene-subtitle">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      {children ? <div className="mt-8">{children}</div> : null}
    </section>
  );
}

type SurfaceCardProps = HTMLAttributes<HTMLDivElement> & {
  hoverable?: boolean;
};

export function SurfaceCard({ className, hoverable = false, ...props }: SurfaceCardProps) {
  return <div className={cx("serene-card", hoverable && "serene-card-hover", className)} {...props} />;
}

type FieldProps = {
  label: string;
  error?: string | null;
  hint?: string | null;
  children: ReactNode;
  className?: string;
};

export function FormField({ label, error, hint, children, className }: FieldProps) {
  return (
    <div className={cx("space-y-2", className)}>
      <label className="serene-label block">{label}</label>
      {children}
      {error ? <p className="text-xs font-medium text-[var(--theme-coral)]">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-[var(--theme-subtle)]">{hint}</p> : null}
    </div>
  );
}

type ButtonVariant = "primary" | "secondary" | "ghost";

type SereneButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function SereneButton({ variant = "primary", className, type = "button", ...props }: SereneButtonProps) {
  const variantClass =
    variant === "primary"
      ? "serene-button-primary"
      : variant === "secondary"
        ? "serene-button-secondary"
        : "serene-button-ghost";

  return <button type={type} className={cx(variantClass, className)} {...props} />;
}

type NoticeProps = {
  children: ReactNode;
  tone?: "default" | "error" | "success";
  className?: string;
};

export function Notice({ children, tone = "default", className }: NoticeProps) {
  const toneClass =
    tone === "error"
      ? "border-[rgba(167,59,33,0.18)] bg-[rgba(167,59,33,0.08)]"
      : tone === "success"
        ? "border-[rgba(82,100,72,0.16)] bg-[rgba(212,233,197,0.38)]"
        : "";

  return <div className={cx("serene-alert", toneClass, className)}>{children}</div>;
}
