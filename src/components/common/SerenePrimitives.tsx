import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

/**
 * Join optional class names into a single string.
 *
 * @param values - Class-name fragments that may include falsy values.
 * @returns A space-delimited class-name string containing only truthy entries.
 */
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

/**
 * Provide the shared page intro shell with title, copy, and actions.
 *
 * @param props - Component props used to build the page introduction layout.
 * @param props.eyebrow - Optional short label shown above the title.
 * @param props.title - Main page title.
 * @param props.description - Optional descriptive copy shown below the title.
 * @param props.actions - Optional action area rendered beside the text content.
 * @param props.children - Optional content rendered beneath the intro header.
 * @param props.className - Optional extra classes applied to the outer section.
 * @returns The rendered page intro section.
 */
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

/**
 * Wrap content in the shared serene card surface.
 *
 * @param props - Standard div props plus serene-card configuration.
 * @param props.className - Optional extra classes applied to the card.
 * @param props.hoverable - Whether hover styling should be enabled.
 * @returns The rendered card wrapper.
 */
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

/**
 * Pair a form control with its label and helper text.
 *
 * @param props - Component props describing the field wrapper content.
 * @param props.label - Visible field label.
 * @param props.error - Optional validation message shown with error styling.
 * @param props.hint - Optional helper copy shown when no error is present.
 * @param props.children - Form control rendered inside the field wrapper.
 * @param props.className - Optional extra classes applied to the wrapper.
 * @returns The rendered field container.
 */
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

/**
 * Render a button using the shared visual variants.
 *
 * @param props - Standard button props plus variant selection.
 * @param props.variant - Shared visual variant applied to the button.
 * @param props.className - Optional extra classes applied to the button.
 * @param props.type - Native button type. Defaults to `"button"`.
 * @returns The rendered button element.
 */
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

/**
 * Display a styled inline notice with an optional tone.
 *
 * @param props - Component props describing the notice content and styling.
 * @param props.children - Notice content.
 * @param props.tone - Optional semantic tone controlling the notice colors.
 * @param props.className - Optional extra classes applied to the notice.
 * @returns The rendered notice container.
 */
export function Notice({ children, tone = "default", className }: NoticeProps) {
  const toneClass =
    tone === "error"
      ? "border border-red-200 bg-red-50 text-red-700"
      : tone === "success"
        ? "border border-green-200 bg-green-50 text-green-700"
        : "";

  return <div className={cx("serene-alert", toneClass, className)}>{children}</div>;
}
