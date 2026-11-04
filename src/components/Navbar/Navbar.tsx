import { AnimatePresence, motion } from 'framer-motion'
import { Command, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { easeOutExpo } from '../../animations/variants'
import { navItems, profile } from '../../data/profile'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useScrollTo } from '../../hooks/useScrollTo'
import { cn } from '../../utils/format'
import { usePalette } from '../CommandPalette/context'

const SECTION_IDS = navItems.map((n) => n.id)

export function Navbar() {
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  const active = useActiveSection(onHome ? SECTION_IDS : [])
  const scrollTo = useScrollTo()
  const palette = usePalette()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const go = (id: string) => {
    setMenuOpen(false)
    scrollTo(id)
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[90] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300',
          scrolled || menuOpen ? 'border-b border-line bg-paper/95 backdrop-blur-md' : 'border-b border-transparent',
        )}
      >
        <nav className="container-x flex h-16 items-center justify-between gap-4" aria-label="Primary">
          <Link
            to="/"
            onClick={(e) => {
              if (onHome) {
                e.preventDefault()
                go('home')
              }
            }}
            className="group flex items-center gap-3"
            aria-label={`${profile.name}, home`}
          >
            <span className="relative grid size-9 place-items-center rounded-[10px] bg-ink font-display text-[15px] font-bold text-paper transition-transform duration-500 group-hover:-rotate-6">
              {profile.initials}
              <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full border-2 border-paper bg-tangerine" />
            </span>
            <span className="hidden font-display text-[15px] font-semibold tracking-tight sm:block">{profile.name}</span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const isActive = onHome && active === item.id
              return (
                <a
                  key={item.id}
                  href={item.id === 'home' ? '/' : `/#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    go(item.id)
                  }}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative rounded-full px-3.5 py-1.5 text-[0.9rem] transition-colors duration-300',
                    isActive ? 'text-paper' : 'text-ink/70 hover:text-ink',
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-ink"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {item.label}
                </a>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={palette.open}
              className="flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 font-mono text-[0.72rem] text-ink/75 transition-colors hover:border-ink hover:text-ink"
              aria-label="Open command palette"
              aria-keyshortcuts="Control+K Meta+K"
            >
              <Command className="size-3.5 sm:hidden" aria-hidden />
              <span className="hidden sm:inline">{isMac ? '⌘ K' : 'Ctrl K'}</span>
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="grid size-9 place-items-center rounded-full border border-line bg-card lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-paper px-6 pt-24 pb-10 lg:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: easeOutExpo }}
          >
            <ul className="flex flex-col">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.4, ease: easeOutExpo }}
                  className="border-b border-line"
                >
                  <a
                    href={item.id === 'home' ? '/' : `/#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      go(item.id)
                    }}
                    className="flex items-baseline justify-between py-4 font-display text-3xl font-semibold"
                  >
                    {item.label}
                    <span className="label">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <p className="mt-auto flex items-center gap-2 font-mono text-xs text-muted">
              <span className="pulse-dot size-1.5 rounded-full bg-cobalt" aria-hidden />
              Currently exploring → <span className="text-cobalt-deep">{profile.currentlyExploring}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
