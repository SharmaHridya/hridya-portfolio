import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, AtSign, BookOpen, Briefcase, CornerDownLeft, FileText, FlaskConical, Home, Layers, MessageCircle, Search, Sparkles, User } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { easeOutExpo } from '../../animations/variants'
import { profile } from '../../data/profile'
import { projects } from '../../data/projects'
import { useScrollTo } from '../../hooks/useScrollTo'
import { cn } from '../../utils/format'
import { GitHubIcon, LeetCodeIcon, LinkedInIcon } from '../ui/BrandIcons'
import { PaletteContext } from './context'

type Command = { id: string; group: string; label: string; hint?: string; keywords?: string; icon: ReactNode; run: () => void }

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const value = useMemo(() => ({ open: () => setOpen(true) }), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <PaletteContext.Provider value={value}>
      {children}
      <AnimatePresence>{open && <Palette onClose={() => setOpen(false)} />}</AnimatePresence>
    </PaletteContext.Provider>
  )
}

function Palette({ onClose }: { onClose: () => void }) {
  const scrollTo = useScrollTo()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const external = (url: string) => () => window.open(url, '_blank', 'noopener,noreferrer')
  const section = (id: string) => () => scrollTo(id)

  const commands: Command[] = useMemo(
    () => [
      { id: 'home', group: 'Navigate', label: 'Go to Home', icon: <Home />, run: section('home') },
      { id: 'about', group: 'Navigate', label: 'Read About Me', keywords: 'bio person', icon: <User />, run: section('about') },
      { id: 'projects', group: 'Navigate', label: 'Explore Projects', keywords: 'work portfolio', icon: <Briefcase />, run: section('projects') },
      { id: 'lab', group: 'Navigate', label: 'Open Curiosity Lab', keywords: 'learning topics', icon: <FlaskConical />, run: section('lab') },
      { id: 'ml', group: 'Navigate', label: 'Try the ML Playground', keywords: 'gradient descent regression machine learning', icon: <Sparkles />, run: section('ml-playground') },
      { id: 'workspace', group: 'Navigate', label: 'Live GitHub & LeetCode', keywords: 'commits repos stats', icon: <Layers />, run: section('workspace') },
      { id: 'beyond', group: 'Navigate', label: 'Beyond Code', keywords: 'debate speaking mun rabbit holes books quotes words that stayed', icon: <MessageCircle />, run: section('beyond') },
      { id: 'journey', group: 'Navigate', label: 'My Journey', keywords: 'timeline milestones', icon: <BookOpen />, run: section('journey') },
      ...projects.map((p) => ({
        id: `p-${p.slug}`,
        group: 'Case studies',
        label: p.title,
        hint: p.kicker,
        keywords: p.stack.join(' '),
        icon: <ArrowRight />,
        run: () => navigate(`/projects/${p.slug}`),
      })),
      { id: 'contact', group: 'Connect', label: 'Contact Me', keywords: 'email message', icon: <AtSign />, run: section('contact') },
      { id: 'resume', group: 'Connect', label: 'Download Resume', hint: 'PDF', icon: <FileText />, run: external(profile.resume) },
      { id: 'github', group: 'Connect', label: 'Visit GitHub', hint: '@' + profile.githubUser, icon: <GitHubIcon />, run: external(profile.links.github) },
      { id: 'linkedin', group: 'Connect', label: 'Visit LinkedIn', icon: <LinkedInIcon />, run: external(profile.links.linkedin) },
      { id: 'leetcode', group: 'Connect', label: 'Visit LeetCode', icon: <LeetCodeIcon />, run: external(profile.links.leetcode) },
      {
        id: 'copy-email',
        group: 'Connect',
        label: 'Copy email address',
        hint: profile.email,
        icon: <AtSign />,
        run: () => navigator.clipboard?.writeText(profile.email),
      },
    ],
    [scrollTo, navigate],
  )

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    const terms = q.split(/\s+/)
    return commands.filter((c) => {
      const hay = `${c.label} ${c.hint ?? ''} ${c.keywords ?? ''} ${c.group}`.toLowerCase()
      return terms.every((t) => hay.includes(t))
    })
  }, [commands, query])

  useEffect(() => setIndex(0), [query])

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    input.current?.focus()
    return () => {
      document.body.style.overflow = overflow
      opener?.focus?.({ preventScroll: true })
    }
  }, [])

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${index}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [index])

  const select = useCallback(
    (c: Command | undefined) => {
      if (!c) return
      onClose()
      // Let the palette close before scrolling so focus restoration doesn't fight the scroll.
      requestAnimationFrame(() => c.run())
    },
    [onClose],
  )

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndex((i) => (results.length ? (i + 1) % results.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      select(results[index])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'Tab') {
      e.preventDefault() // keep focus in the search field; arrows move the selection
    }
  }

  let lastGroup = ''

  return (
    <motion.div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
      <div className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_40px_80px_-20px_rgba(32,33,36,0.45)]"
        initial={{ y: -12, scale: 0.97, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: -8, scale: 0.98, opacity: 0 }}
        transition={{ duration: 0.25, ease: easeOutExpo }}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="size-4 text-muted" aria-hidden />
          <input
            ref={input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search…"
            className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[index] ? `cmd-${results[index].id}` : undefined}
            aria-autocomplete="list"
            aria-label="Search commands"
          />
          <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[0.65rem] text-muted">ESC</kbd>
        </div>

        <ul ref={listRef} id="palette-list" role="listbox" aria-label="Commands" className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-10 text-center text-sm text-muted">No matches for “{query}”.</li>}
          {results.map((c, i) => {
            const header = c.group !== lastGroup ? c.group : null
            lastGroup = c.group
            return (
              <li key={c.id} role="presentation">
                {header && <p className="label px-3 pt-3 pb-1.5" role="presentation">{header}</p>}
                <div
                  id={`cmd-${c.id}`}
                  role="option"
                  aria-selected={i === index}
                  data-index={i}
                  onPointerMove={() => setIndex(i)}
                  onClick={() => select(c)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[0.95rem] transition-colors [&_svg]:size-4',
                    i === index ? 'bg-ink text-paper' : 'text-ink',
                  )}
                >
                  <span className={i === index ? 'text-paper' : 'text-muted'} aria-hidden>
                    {c.icon}
                  </span>
                  <span className="flex-1 truncate">{c.label}</span>
                  {c.hint && <span className={cn('truncate font-mono text-[0.68rem]', i === index ? 'text-paper/70' : 'text-muted')}>{c.hint}</span>}
                  {i === index && <CornerDownLeft className="opacity-70" aria-hidden />}
                </div>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 font-mono text-[0.65rem] text-muted">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
          <span className="ml-auto">{results.length} results</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
