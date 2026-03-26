import { useEffect, useRef } from 'react'
import type { MutableRefObject } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../../../i18n/I18nProvider'
import type { CarState } from './CarModel'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  carState: MutableRefObject<CarState>
  primaryHref: string
  primaryLabel: string
  secondaryHref: string
  secondaryLabel: string
  bp: 'mobile' | 'tablet' | 'desktop'
}

export function ScrollSections({
  carState,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  bp,
}: Props) {
  const { t } = useI18n()
  const containerRef = useRef<HTMLDivElement>(null)
  const section2Ref = useRef<HTMLElement>(null)
  const section3Ref = useRef<HTMLElement>(null)
  const isCompact = bp !== 'desktop'

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        },
      })

      const driftX = isCompact ? 1.5 : 2.5
      const lookX2 = isCompact ? 3 : 5
      const exitX = isCompact ? 6 : 10
      const exitLookX = isCompact ? 5 : 8

      tl.to(carState.current, {
        camZDelta: isCompact ? 2 : 3.5,
        x: driftX,
        rotY: 0.8,
        camLookX: 0,
        ease: 'none',
        duration: 0.5,
      }, 0)

      tl.to(carState.current, {
        camZDelta: isCompact ? 0 : -0.5,
        rotY: -0.5,
        camLookX: lookX2,
        ease: 'none',
        duration: 0.5,
      }, 0.5)

      tl.to(carState.current, {
        x: exitX,
        rotY: -0.3,
        camLookX: exitLookX,
        camZDelta: 0,
        ease: 'none',
        duration: 1,
      }, 1)

      gsap.from('.s1-item', {
        y: 38,
        opacity: 0,
        duration: 0.9,
        stagger: 0.14,
        ease: 'power3.out',
        delay: 0.45,
      })

      gsap.from('.s2-item', {
        scrollTrigger: {
          trigger: section2Ref.current,
          start: 'top 65%',
        },
        x: -50,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power2.out',
      })

      gsap.from('.s3-item', {
        scrollTrigger: {
          trigger: section3Ref.current,
          start: 'top 70%',
        },
        y: 38,
        opacity: 0,
        duration: 0.75,
        stagger: 0.13,
        ease: 'power2.out',
      })

    }, containerRef)

    return () => ctx.revert()
  }, [carState, isCompact])

  const featureSteps = [
    { num: '01', title: t('landing.cardFindTitle'), body: t('landing.cardFindBody') },
    { num: '02', title: t('landing.cardOfferTitle'), body: t('landing.cardOfferBody') },
    { num: '03', title: t('landing.cardCoordinateTitle'), body: t('landing.cardCoordinateBody') },
  ]

  return (
    <div ref={containerRef} className="relative z-10">

      {/* ─── Section 1: on mobile/tablet text overlays the car, on desktop side-by-side ─── */}
      <section className="flex min-h-screen items-end pb-12 sm:items-center sm:pb-0 lg:grid lg:grid-cols-2">
        <div className="hidden lg:block" />
        <div className="flex flex-col justify-center px-6 pt-28 sm:px-8 sm:pt-32 lg:px-16 lg:pt-0">
          <div className="rounded-2xl bg-white/70 p-5 backdrop-blur-md sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
            <p className="s1-item serene-kicker mb-4 sm:mb-5">{t('landing.kicker')}</p>
            <h1
              className="s1-item mb-4 font-heading font-extrabold leading-[0.95] tracking-[-0.05em] text-[var(--theme-ink)] sm:mb-6"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 4.8rem)' }}
            >
              {t('landing.heroTitle')}
            </h1>
            <p className="s1-item mb-8 max-w-md text-sm leading-7 text-[var(--theme-muted-strong)] sm:mb-10 sm:text-base sm:leading-8">
              {t('landing.heroBody')}
            </p>
            <div className="s1-item flex flex-wrap gap-3">
              <Link to={primaryHref} className="serene-button-primary px-5 py-2.5 text-sm sm:px-7">
                {primaryLabel}
              </Link>
              <Link to={secondaryHref} className="serene-button-secondary px-5 py-2.5 text-sm sm:px-7">
                {secondaryLabel}
              </Link>
            </div>
            <p className="s1-item mt-8 text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--theme-muted)] sm:mt-10 sm:text-[11px]">
              ↓ &nbsp; Scroll to continue
            </p>
          </div>
        </div>
      </section>

      {/* ─── Section 2: text with glass card on mobile, side-by-side on desktop ─── */}
      <section ref={section2Ref} className="flex min-h-screen items-center lg:grid lg:grid-cols-2">
        <div className="w-full px-6 py-16 sm:px-8 lg:px-16 lg:py-0">
          <div className="rounded-2xl bg-white/70 p-5 backdrop-blur-md sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
            <p className="s2-item serene-kicker mb-4 sm:mb-5">{t('landing.flowTitle')}</p>
            <h2
              className="s2-item mb-6 font-heading font-extrabold leading-tight tracking-[-0.04em] text-[var(--theme-ink)] sm:mb-8"
              style={{ fontSize: 'clamp(1.6rem, 4vw, 3.4rem)' }}
            >
              {t('landing.flowHeading')}
            </h2>
            {featureSteps.map((step) => (
              <div key={step.num} className="s2-item mb-5 flex items-start gap-4 sm:mb-6 sm:gap-5">
                <span className="mt-0.5 w-7 shrink-0 text-lg font-extrabold leading-none text-[var(--theme-primary)] opacity-50 sm:text-xl">
                  {step.num}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--theme-ink)] sm:text-base">{step.title}</p>
                  <p className="mt-1 text-xs leading-5 text-[var(--theme-muted)] sm:text-sm sm:leading-6">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden lg:block" />
      </section>

      {/* ─── Section 3: centered CTA ─── */}
      <section ref={section3Ref} className="flex min-h-screen flex-col items-center justify-center px-6 text-center sm:px-8">
        <div className="rounded-2xl bg-white/70 p-6 backdrop-blur-md sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
          <p className="s3-item serene-kicker mb-4 sm:mb-5">{t('landing.finalKicker')}</p>
          <h2
            className="s3-item mb-4 font-heading font-extrabold tracking-[-0.04em] text-[var(--theme-ink)] sm:mb-5"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 3.6rem)' }}
          >
            {t('landing.finalTitle')}
          </h2>
          <p className="s3-item mb-8 max-w-lg text-sm leading-7 text-[var(--theme-muted-strong)] sm:mb-10 sm:text-base sm:leading-8">
            {t('landing.finalBody')}
          </p>
          <div className="s3-item flex flex-wrap justify-center gap-3">
            <Link to={primaryHref} className="serene-button-primary px-6 py-2.5 text-sm sm:px-8">
              {primaryLabel}
            </Link>
            <Link to={secondaryHref} className="serene-button-ghost border border-[var(--theme-line)] bg-white/40 px-6 py-2.5 text-sm sm:px-8">
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
