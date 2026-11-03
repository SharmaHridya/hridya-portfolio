import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProjectVisual } from '../../components/Projects/ProjectVisual'
import { GitHubIcon } from '../../components/ui/BrandIcons'
import { DraftBadge, Tag } from '../../components/ui/Tag'
import { easeOutExpo, fadeUp, stagger } from '../../animations/variants'
import { projects, type Note } from '../../data/projects'
import { cn } from '../../utils/format'
import NotFound from '../NotFound'
import { ArchitectureDiagram } from './ArchitectureDiagram'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'Problem Statement' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'decisions', label: 'Technical Decisions' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'learnings', label: 'Learnings' },
] as const

type TabId = (typeof TABS)[number]['id']

export default function ProjectDetails() {
  const { slug } = useParams()
  const index = projects.findIndex((p) => p.slug === slug)
  const project = projects[index]
  const [tab, setTab] = useState<TabId>('overview')

  useEffect(() => {
    setTab('overview')
    window.scrollTo(0, 0)
    if (project) document.title = `${project.title} — case study · Hridya Sharma`
  }, [project])

  if (!project) return <NotFound />
  const next = projects[(index + 1) % projects.length]
  const prev = projects[(index - 1 + projects.length) % projects.length]
  const cs = project.caseStudy

  return (
    <article className="pt-28 pb-24 md:pt-32" aria-labelledby="case-title">
      <div className="container-x">
        <Link to="/#projects" className="group inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-ink">
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" aria-hidden /> All projects
        </Link>

        <motion.header className="mt-8 grid gap-10 lg:grid-cols-12" initial="hidden" animate="show" variants={stagger(0.08)}>
          <div className="lg:col-span-7">
            <motion.p variants={fadeUp} className="label">
              Case study · P—{project.index} · {project.kicker}
            </motion.p>
            <motion.h1 variants={fadeUp} id="case-title" className="mt-4 text-[clamp(2.8rem,7vw,6rem)] leading-[0.95] font-semibold">
              {project.title}
            </motion.h1>
            {project.subtitle && (
              <motion.p variants={fadeUp} className="mt-3 font-mono text-sm text-muted">
                {project.subtitle}
              </motion.p>
            )}
            <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg text-ink/80">
              {project.summary}
            </motion.p>
          </div>
          <motion.dl variants={fadeUp} className="grid content-start gap-x-6 gap-y-4 border-t border-ink pt-6 text-sm sm:grid-cols-2 lg:col-span-5">
            <div>
              <dt className="label">Role</dt>
              <dd className="mt-1">{project.role}</dd>
            </div>
            <div>
              <dt className="label">When</dt>
              <dd className="mt-1">{project.period}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="label">Stack</dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">
                {project.stack.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="label">Links</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {project.links.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 transition-colors',
                      l.kind === 'live' ? 'bg-ink text-paper hover:bg-cobalt' : 'border border-line hover:border-ink',
                    )}
                  >
                    {l.kind === 'github' && <GitHubIcon className="size-3.5" />}
                    {l.label} ↗<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ))}
              </dd>
            </div>
          </motion.dl>
        </motion.header>

        <motion.div className="mt-14 h-[420px] md:h-[520px]" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: easeOutExpo }}>
          <ProjectVisual kind={project.visual} />
        </motion.div>

        <div className="sticky top-16 z-20 -mx-[clamp(1.25rem,4vw,3rem)] mt-16 border-y border-line bg-paper/90 px-[clamp(1.25rem,4vw,3rem)] backdrop-blur-md">
          <div role="tablist" aria-label="Case study sections" className="flex gap-1 overflow-x-auto py-2">
            {TABS.map((t, i) => (
              <button
                key={t.id}
                id={`tab-${t.id}`}
                role="tab"
                aria-selected={tab === t.id}
                aria-controls={`panel-${t.id}`}
                tabIndex={tab === t.id ? 0 : -1}
                onClick={() => setTab(t.id)}
                onKeyDown={(e) => {
                  const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
                  if (!dir) return
                  e.preventDefault()
                  const nextTab = TABS[(i + dir + TABS.length) % TABS.length]
                  setTab(nextTab.id)
                  document.getElementById(`tab-${nextTab.id}`)?.focus()
                }}
                className={cn('relative shrink-0 rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors', tab === t.id ? 'text-paper' : 'text-ink/65 hover:text-ink')}
              >
                {tab === t.id && <motion.span layoutId="case-tab" className="absolute inset-0 -z-10 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <span className="mr-1.5 font-mono text-[0.65rem] opacity-60">0{i + 1}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              id={`panel-${tab}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab}`}
              tabIndex={0}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: easeOutExpo }}
              className="outline-none"
            >
              {tab === 'overview' && <Prose paragraphs={cs.overview} />}
              {tab === 'problem' && <Prose paragraphs={cs.problem} large />}
              {tab === 'architecture' && <ArchitectureDiagram caption={cs.architecture.caption} lanes={cs.architecture.lanes} highlight={project.slug === 'p2p-cloud-storage' ? 2 : undefined} />}
              {tab === 'decisions' && <Notes notes={cs.decisions} numbered />}
              {tab === 'challenges' && <Notes notes={cs.challenges} />}
              {tab === 'learnings' && <Notes notes={cs.learnings} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <nav aria-label="More case studies" className="mt-24 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          <Link to={`/projects/${prev.slug}`} className="group bg-card p-6 transition-colors hover:bg-paper md:p-8">
            <span className="label flex items-center gap-2">
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" aria-hidden /> Previous
            </span>
            <span className="mt-2 block font-display text-2xl font-semibold">{prev.title}</span>
          </Link>
          <Link to={`/projects/${next.slug}`} className="group bg-card p-6 text-right transition-colors hover:bg-paper md:p-8">
            <span className="label flex items-center justify-end gap-2">
              Next <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
            </span>
            <span className="mt-2 block font-display text-2xl font-semibold">{next.title}</span>
          </Link>
        </nav>
      </div>
    </article>
  )
}

function Prose({ paragraphs, large }: { paragraphs: string[]; large?: boolean }) {
  return (
    <div className="space-y-6">
      {paragraphs.map((p, i) => (
        <p key={i} className={cn(i === 0 || large ? 'font-display text-[clamp(1.25rem,2.2vw,1.7rem)] leading-snug font-medium tracking-tight' : 'text-lg text-ink/80')}>
          {p}
        </p>
      ))}
    </div>
  )
}

function Notes({ notes, numbered }: { notes: Note[]; numbered?: boolean }) {
  return (
    <ol className="divide-y divide-line border-y border-line">
      {notes.map((n, i) => (
        <li key={n.title} className="grid gap-3 py-8 md:grid-cols-12">
          <span className="font-mono text-sm text-muted md:col-span-1">{numbered ? `0${i + 1}` : '—'}</span>
          <div className="md:col-span-11">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold">{n.title}</h2>
              {n.draft && <DraftBadge />}
            </div>
            <p className={cn('mt-3 text-lg', n.draft ? 'text-muted italic' : 'text-ink/80')}>{n.body}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
