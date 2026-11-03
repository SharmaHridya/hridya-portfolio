import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { easeOutExpo } from '../../animations/variants'
import type { Project } from '../../data/projects'
import { cn } from '../../utils/format'
import { GitHubIcon } from '../ui/BrandIcons'
import { Tag } from '../ui/Tag'
import { ProjectVisual } from './ProjectVisual'

export function ProjectCard({ project, flip }: { project: Project; flip: boolean }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, ease: easeOutExpo }}
      className="group grid gap-8 border-t border-line py-12 md:py-16 lg:grid-cols-12 lg:gap-12"
      aria-labelledby={`project-${project.slug}`}
    >
      <div className={cn('flex flex-col lg:col-span-5', flip && 'lg:order-2')}>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-ink">P—{project.index}</span>
          <span className="h-px w-6 bg-ink/30" aria-hidden />
          <span className="label">{project.kicker}</span>
        </div>

        <h3 id={`project-${project.slug}`} className="mt-5 text-[clamp(2.2rem,4.4vw,3.6rem)] font-semibold">
          <Link to={`/projects/${project.slug}`} className="transition-colors hover:text-cobalt">
            {project.title}
          </Link>
        </h3>
        {project.subtitle && <p className="mt-2 font-mono text-xs text-muted">{project.subtitle}</p>}

        <p className="mt-5 text-ink/80">{project.summary}</p>

        <ul className="mt-6 space-y-2.5 text-[0.95rem]">
          {project.highlights.map((h) => (
            <li key={h} className="flex gap-3">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full" style={{ background: project.accent }} aria-hidden />
              <span className="text-ink/85">{h}</span>
            </li>
          ))}
        </ul>

        {project.facts && (
          <div className="mt-6">
            <dl className="grid grid-cols-3 gap-3 border-y border-line py-4">
              {project.facts.map((f) => (
                <div key={f.label}>
                  <dt className="sr-only">{f.label}</dt>
                  <dd className="font-display text-2xl font-semibold">{f.value}</dd>
                  <dd className="text-xs leading-snug text-muted">{f.label}</dd>
                </div>
              ))}
            </dl>
            {project.factsSource && (
              <a href={project.factsSource.url} target="_blank" rel="noopener noreferrer" className="link-underline mt-2 inline-block font-mono text-[0.65rem] text-muted">
                {project.factsSource.label} ↗
              </a>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 lg:mt-auto lg:pt-8">
          <Link
            to={`/projects/${project.slug}`}
            className="group/cta inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-cobalt"
          >
            Read the case study
            <ArrowRight className="size-4 transition-transform group-hover/cta:translate-x-1" aria-hidden />
          </Link>
          {project.links.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline inline-flex items-center gap-1.5 text-sm"
            >
              {l.kind === 'github' && <GitHubIcon className="size-3.5" />}
              {l.kind === 'live' && <span className="size-1.5 rounded-full bg-[#3c9a5f]" aria-hidden />}
              {l.label}
              <span aria-hidden>↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
        </div>
      </div>

      <div className={cn('lg:col-span-7', flip && 'lg:order-1')}>
        <div className="h-[380px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 sm:h-[460px] lg:sticky lg:top-24">
          <ProjectVisual kind={project.visual} />
        </div>
      </div>
    </motion.article>
  )
}
