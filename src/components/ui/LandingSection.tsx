import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { AuthUser } from "../../types/MeResponse";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { useI18n } from "../../i18n/I18nProvider";

type Props = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
};

/**
 * Render the public landing page for the carpooling app.
 *
 * @param props - Component props describing the current session state.
 * @returns The landing page hero, highlights, and calls to action.
 */
export function LandingSection({ user, isAuthenticated, isProfileComplete }: Props) {
  const { t } = useI18n();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let frameId = 0;

    const updateProgress = () => {
      frameId = 0;
      const maxScroll = Math.max(window.innerHeight * 0.9, 1);
      setScrollProgress(Math.min(window.scrollY / maxScroll, 1));
    };

    const queueUpdate = () => {
      if (frameId === 0) {
        frameId = window.requestAnimationFrame(updateProgress);
      }
    };

    queueUpdate();
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);

    return () => {
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  const primaryHref = isAuthenticated
    ? isProfileComplete
      ? "/home"
      : "/complete-profile"
    : "/register";
  const primaryLabel = isAuthenticated
    ? isProfileComplete
      ? t("landing.primaryAuthenticated")
      : t("landing.completeProfile")
    : t("landing.primaryGuest");
  const secondaryHref = isAuthenticated ? "/find-trip" : "/login";
  const secondaryLabel = isAuthenticated ? t("landing.secondaryAuthenticated") : t("auth.signIn");
  const displayName =
    user?.person?.first_name || user?.person?.pseudo || user?.email || t("app.name");

  const highlights = [
    t("landing.highlightSearch"),
    t("landing.highlightChat"),
    t("landing.highlightBookings"),
  ];

  const featureCards = [
    {
      title: t("landing.cardFindTitle"),
      body: t("landing.cardFindBody"),
      accent: "from-[rgba(212,233,197,0.9)] to-[rgba(255,255,255,0.7)]",
    },
    {
      title: t("landing.cardOfferTitle"),
      body: t("landing.cardOfferBody"),
      accent: "from-[rgba(212,229,239,0.92)] to-[rgba(255,255,255,0.7)]",
    },
    {
      title: t("landing.cardCoordinateTitle"),
      body: t("landing.cardCoordinateBody"),
      accent: "from-[rgba(232,253,216,0.92)] to-[rgba(255,255,255,0.72)]",
    },
  ];
  const carPosition = 10 + scrollProgress * 76;
  const carRotation = -2 + scrollProgress * 4;
  const carBounce = Math.sin(scrollProgress * Math.PI * 3) * 3;

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(circle_at_top_left,rgba(212,233,197,0.8),transparent_34%),radial-gradient(circle_at_top_right,rgba(212,229,239,0.7),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.88),rgba(249,250,248,0.3))]" />
      <div className="pointer-events-none absolute left-[-8rem] top-28 h-72 w-72 rounded-full bg-[rgba(82,100,72,0.08)] blur-3xl" />
      <div className="pointer-events-none absolute right-[-5rem] top-56 h-64 w-64 rounded-full bg-[rgba(103,96,41,0.12)] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="flex flex-col gap-4 rounded-[1.75rem] border border-[var(--theme-line)] bg-[rgba(255,255,255,0.78)] px-4 py-4 shadow-[var(--theme-shadow-warm)] backdrop-blur-xl sm:px-6 sm:py-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:rounded-full">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(145deg,var(--theme-primary),var(--theme-primary-dim))] text-sm font-semibold uppercase tracking-[0.18em] text-[var(--theme-on-primary)] shadow-[0_18px_30px_-18px_rgba(82,100,72,0.9)]">
              CV
            </div>
            <div className="min-w-0">
              <p className="serene-kicker">{t("app.name")}</p>
              <p className="text-sm font-medium leading-6 text-[var(--theme-ink)] sm:truncate">
                {t("landing.headerLine")}
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:w-auto lg:justify-end">
            <LanguageSwitcher compact hideLabelOnMobile />
            <Link
              to={secondaryHref}
              className="serene-button-ghost w-full border border-[var(--theme-line)] bg-white/40 sm:w-auto"
            >
              {secondaryLabel}
            </Link>
            <Link
              to={primaryHref}
              className="serene-button-primary min-h-0 w-full px-5 py-3 text-sm sm:w-auto"
            >
              {primaryLabel}
            </Link>
          </div>
        </header>

        <section className="grid gap-8 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-10 lg:pt-16">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--theme-line)] bg-[rgba(255,255,255,0.82)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--theme-muted-strong)] shadow-[var(--theme-shadow-warm)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--theme-primary)]" />
              {t("landing.kicker")}
            </div>

            <div className="space-y-5">
              <h1 className="font-heading text-[clamp(3.2rem,7vw,6.4rem)] font-extrabold leading-[0.9] tracking-[-0.06em] text-[var(--theme-ink)]">
                {t("landing.heroTitle")}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[var(--theme-muted-strong)] sm:text-lg">
                {t("landing.heroBody")}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {highlights.map((item) => (
                <span
                  key={item}
                  className="inline-flex min-w-0 items-center gap-2 rounded-full bg-[rgba(255,255,255,0.8)] px-4 py-2 text-sm font-medium text-[var(--theme-muted-strong)] shadow-[var(--theme-shadow-warm)]"
                >
                  <span className="h-2 w-2 rounded-full bg-[var(--theme-primary)]" />
                  <span className="min-w-0 break-words">{item}</span>
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Link to={primaryHref} className="serene-button-primary w-full px-7 sm:w-auto">
                {primaryLabel}
              </Link>
              <Link to="/find-trip" className="serene-button-secondary w-full px-7 sm:w-auto">
                {t("shell.findTrips")}
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="serene-card bg-[rgba(255,255,255,0.78)] p-4">
                <p className="text-3xl font-heading font-extrabold text-[var(--theme-ink)]">01</p>
                <p className="mt-2 text-sm leading-6 text-[var(--theme-muted)]">
                  {t("landing.metricOne")}
                </p>
              </div>
              <div className="serene-card bg-[rgba(255,255,255,0.78)] p-4">
                <p className="text-3xl font-heading font-extrabold text-[var(--theme-ink)]">02</p>
                <p className="mt-2 text-sm leading-6 text-[var(--theme-muted)]">
                  {t("landing.metricTwo")}
                </p>
              </div>
              <div className="serene-card bg-[rgba(255,255,255,0.78)] p-4">
                <p className="text-3xl font-heading font-extrabold text-[var(--theme-ink)]">03</p>
                <p className="mt-2 text-sm leading-6 text-[var(--theme-muted)]">
                  {t("landing.metricThree")}
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-10 top-5 h-28 rounded-full bg-[rgba(82,100,72,0.12)] blur-3xl" />
            <div className="serene-panel relative overflow-hidden p-5 sm:p-6">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(242,244,242,0.94))]" />
              <div className="relative grid gap-5">
                <div className="overflow-hidden rounded-[1.6rem] border border-[var(--theme-line)] bg-[linear-gradient(135deg,rgba(246,249,245,0.96),rgba(255,255,255,0.85))] px-4 py-4 shadow-[0_18px_30px_-24px_rgba(46,52,50,0.28)]">
                  <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--theme-muted)]">
                    <span>01</span>
                    <span>03</span>
                  </div>
                  <div className="relative mt-3 h-16" aria-hidden="true">
                    <div className="absolute left-[10%] right-[10%] top-1/2 h-px -translate-y-1/2 border-t border-dashed border-[rgba(82,100,72,0.3)]" />
                    <div className="absolute left-[10%] top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--theme-primary)] shadow-[0_0_0_6px_rgba(82,100,72,0.09)]" />
                    <div className="absolute right-[10%] top-1/2 h-3.5 w-3.5 translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(82,100,72,0.22)] shadow-[0_0_0_6px_rgba(82,100,72,0.05)]" />
                    <div
                      className="absolute top-1/2 h-8 w-14 rounded-[1.1rem] bg-[linear-gradient(145deg,var(--theme-primary),var(--theme-primary-dim))] shadow-[0_14px_24px_-18px_rgba(82,100,72,0.9)] transition-transform duration-150 will-change-transform"
                      style={{
                        left: `calc(${carPosition}% - 1.75rem)`,
                        transform: `translateY(calc(-50% + ${carBounce}px)) rotate(${carRotation}deg)`,
                      }}
                    >
                      <div className="absolute left-2.5 right-2.5 top-1.5 h-3 rounded-full bg-white/30" />
                      <div className="absolute bottom-[-0.35rem] left-2 h-3.5 w-3.5 rounded-full border-2 border-white/45 bg-[var(--theme-ink)]" />
                      <div className="absolute bottom-[-0.35rem] right-2 h-3.5 w-3.5 rounded-full border-2 border-white/45 bg-[var(--theme-ink)]" />
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-[var(--theme-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(233,239,236,0.9))] p-5 shadow-[var(--theme-shadow-warm)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="serene-kicker">{t("landing.flowTitle")}</p>
                      <h2 className="mt-2 text-2xl font-bold text-[var(--theme-ink)]">
                        {t("landing.flowHeading")}
                      </h2>
                    </div>
                    <div className="rounded-full bg-[var(--theme-primary-soft)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--theme-primary)]">
                      {t("landing.liveBadge")}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {featureCards.map((card, index) => (
                      <article
                        key={card.title}
                        className={`rounded-[1.35rem] border border-[var(--theme-line)] bg-gradient-to-br ${card.accent} p-4 shadow-[0_18px_30px_-24px_rgba(46,52,50,0.35)]`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[rgba(255,255,255,0.78)] text-sm font-semibold text-[var(--theme-primary)]">
                            0{index + 1}
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-[var(--theme-ink)]">
                              {card.title}
                            </h3>
                            <p className="mt-1 text-sm leading-6 text-[var(--theme-muted)]">
                              {card.body}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-[var(--theme-line)] bg-[rgba(255,255,255,0.9)] p-4 shadow-[var(--theme-shadow-warm)]">
                    <p className="serene-kicker">{t("landing.accountCardTitle")}</p>
                    <p className="mt-3 text-lg font-semibold text-[var(--theme-ink)]">
                      {displayName}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--theme-muted)]">
                      {t("landing.accountCardBody")}
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-[var(--theme-line)] bg-[rgba(255,255,255,0.9)] p-4 shadow-[var(--theme-shadow-warm)]">
                    <p className="serene-kicker">{t("landing.routeCardTitle")}</p>
                    <p className="mt-3 text-lg font-semibold text-[var(--theme-ink)]">
                      {t("landing.routeCardHeading")}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--theme-muted)]">
                      {t("landing.routeCardBody")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 py-12 lg:grid-cols-3 lg:py-16">
          <article className="serene-card serene-card-hover p-6">
            <p className="serene-kicker">{t("landing.sectionOneKicker")}</p>
            <h2 className="mt-3 text-2xl font-bold text-[var(--theme-ink)]">
              {t("landing.sectionOneTitle")}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--theme-muted)]">
              {t("landing.sectionOneBody")}
            </p>
          </article>
          <article className="serene-card serene-card-hover p-6">
            <p className="serene-kicker">{t("landing.sectionTwoKicker")}</p>
            <h2 className="mt-3 text-2xl font-bold text-[var(--theme-ink)]">
              {t("landing.sectionTwoTitle")}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--theme-muted)]">
              {t("landing.sectionTwoBody")}
            </p>
          </article>
          <article className="serene-card serene-card-hover p-6">
            <p className="serene-kicker">{t("landing.sectionThreeKicker")}</p>
            <h2 className="mt-3 text-2xl font-bold text-[var(--theme-ink)]">
              {t("landing.sectionThreeTitle")}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--theme-muted)]">
              {t("landing.sectionThreeBody")}
            </p>
          </article>
        </section>

        <section className="rounded-[2.25rem] border border-[var(--theme-line)] bg-[linear-gradient(135deg,rgba(82,100,72,0.98),rgba(71,88,61,0.96))] px-6 py-8 text-[var(--theme-on-primary)] shadow-[0_34px_54px_-34px_rgba(46,52,50,0.45)] sm:px-8 lg:flex lg:items-center lg:justify-between lg:gap-8 lg:py-10">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
              {t("landing.finalKicker")}
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.05em] text-white sm:text-4xl">
              {t("landing.finalTitle")}
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/78 sm:text-base">
              {t("landing.finalBody")}
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:mt-0 lg:justify-end">
            <Link
              to={primaryHref}
              className="inline-flex min-h-[3.25rem] w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--theme-primary)] transition hover:translate-y-[-1px] sm:w-auto"
            >
              {primaryLabel}
            </Link>
            <Link
              to={secondaryHref}
              className="inline-flex min-h-[3.25rem] w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/16 sm:w-auto"
            >
              {secondaryLabel}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
