import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useState } from 'react'
import { projectFilters, projects, type ProjectCategory } from '../../data/projects'
import { cn } from '../../utils/format'
import { SectionHeader } from '../ui/SectionHeader'
import { MoreProjects } from './MoreProjects'
import { ProjectCard } from './ProjectCard'

export function Projects() {
  const [filter, setFilter] = useState<'All' | ProjectCategory>('All')
  const visible = filter === 'All' ? projects : projects.filter((p) => p.categories.includes(filter))

  return (
    <section id="projects" aria-labelledby="projects-title" className="border-t border-line bg-card/40 py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          id="projects-title"
          number="02"
          label="Selected work"
          title={
            <>
              Things I’ve brought <span className="serif-italic text-cobalt">to life.</span>
            </>
          }
          intro={<p>Five projects, each with a live miniature you can play with. Open a case study for the architecture and the decisions behind it.</p>}
        />

        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter projects by category">
            {projectFilters.map((f) => {
              const count = f === 'All' ? projects.length : projects.filter((p) => p.categories.includes(f)).length
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className={cn(
                    'relative rounded-full border px-4 py-1.5 text-sm transition-colors',
                    filter === f ? 'border-ink text-paper' : 'border-line bg-card text-ink/75 hover:border-ink/40 hover:text-ink',
                  )}
                >
                  {filter === f && <motion.span layoutId="filter-pill" className="absolute inset-0 -z-10 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                  {f}
                  <sup className="ml-1 font-mono text-[0.6rem] opacity-70">{count}</sup>
                </button>
              )
            })}
          </div>
          <p className="font-mono text-xs text-muted" aria-live="polite">
            Showing {visible.length} of {projects.length}
          </p>
        </div>

        <LayoutGroup>
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p, i) => (
              <ProjectCard key={p.slug} project={p} flip={i % 2 === 1} />
            ))}
          </AnimatePresence>
        </LayoutGroup>

        <MoreProjects />
      </div>
    </section>
  )
}
