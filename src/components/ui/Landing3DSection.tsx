import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { AuthUser } from '../../types/MeResponse'
import { useI18n } from '../../i18n/I18nProvider'
import LanguageSwitcher from '../common/LanguageSwitcher'
import { Scene } from './Landing3D/Scene'
import { ScrollSections } from './Landing3D/ScrollSections'

type Props = {
  user: AuthUser | null
  isAuthenticated: boolean
  isProfileComplete: boolean
}

function useBreakpoint() {
  const [bp, setBp] = useState<'mobile' | 'tablet' | 'desktop'>(() => {
    const w = window.innerWidth
    return w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop'
  })

  useEffect(() => {
    function update() {
      const w = window.innerWidth
      setBp(w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop')
    }
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return bp
}

export function Landing3DSection({ isAuthenticated, isProfileComplete }: Props) {
  const { t } = useI18n()
  const bp = useBreakpoint()
  const isMobile = bp === 'mobile'
  const carState = useRef({ x: -2.5, rotY: 0.3, camLookX: -1.5, camZDelta: 0 })

  const primaryHref = isAuthenticated
    ? isProfileComplete
      ? '/home'
      : '/complete-profile'
    : '/register'

  const primaryLabel = isAuthenticated
    ? isProfileComplete
      ? t('landing.primaryAuthenticated')
      : t('landing.completeProfile')
    : t('landing.primaryGuest')

  const secondaryHref = isAuthenticated ? '/find-trip' : '/login'
  const secondaryLabel = isAuthenticated ? t('landing.secondaryAuthenticated') : t('auth.signIn')

  return (
    <div className="relative overflow-x-hidden">
      <header className="fixed left-3 right-3 top-3 z-50 flex flex-col gap-2 rounded-2xl border border-[var(--theme-line)] bg-[rgba(255,255,255,0.88)] px-3 py-2.5 shadow-[var(--theme-shadow-warm)] backdrop-blur-xl sm:left-4 sm:right-4 sm:top-4 sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:px-6 sm:py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(145deg,var(--theme-primary),var(--theme-primary-dim))] text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--theme-on-primary)] shadow-[0_14px_24px_-14px_rgba(82,100,72,0.7)] sm:h-9 sm:w-9 sm:text-[10px]">
            CV
          </div>
          <div className="min-w-0">
            <p className="serene-kicker">{t('app.name')}</p>
            <p className="hidden truncate text-sm font-medium leading-5 text-[var(--theme-ink)] sm:block">
              {t('landing.headerLine')}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <LanguageSwitcher compact hideLabelOnMobile />
          <Link
            to={secondaryHref}
            className="serene-button-ghost border border-[var(--theme-line)] bg-white/40 px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm"
          >
            {secondaryLabel}
          </Link>
          <Link to={primaryHref} className="serene-button-primary min-h-0 px-4 py-1.5 text-xs sm:px-5 sm:py-2 sm:text-sm">
            {primaryLabel}
          </Link>
        </div>
      </header>

      <Scene carState={carState} isMobile={isMobile} bp={bp} />

      <ScrollSections
        carState={carState}
        primaryHref={primaryHref}
        primaryLabel={primaryLabel}
        secondaryHref={secondaryHref}
        secondaryLabel={secondaryLabel}
        bp={bp}
      />
    </div>
  )
}
