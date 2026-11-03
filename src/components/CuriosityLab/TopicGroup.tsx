import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { easeOutExpo } from '../../animations/variants'
import type { LabGroup, LabTopic } from '../../data/lab'
import { useScrollTo } from '../../hooks/useScrollTo'
import { cn, isExternal } from '../../utils/format'
import { StatusPill } from '../ui/Tag'

export function TopicGroup({ group, index }: { group: LabGroup; index: number }) {
  const [open, setOpen] = useState<string | null>(null)
  const isNext = group.id === 'next'

  return (
    <div className={cn('h-full rounded-[22px] border bg-card p-6 md:p-8', isNext ? 'border-dashed border-ink/25 bg-transparent' : 'border-line')}>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="flex items-center gap-3 text-2xl font-semibold">
          <span className="size-3 rounded-full" style={{ background: group.accent }} aria-hidden />
          {group.label}
        </h3>
        <span className="font-mono text-xs text-muted">
          0{index + 1} · {group.topics.length} topics
        </span>
      </div>
      <ul className="divide-y divide-line border-y border-line">
        {group.topics.map((t) => (
          <TopicRow key={t.name} topic={t} accent={group.accent} open={open === t.name} onToggle={() => setOpen(open === t.name ? null : t.name)} />
        ))}
        {isNext && (
          <li className="flex items-center gap-3 py-4 text-sm text-muted">
            <span className="grid size-6 place-items-center rounded-full border border-dashed border-ink/30" aria-hidden>
              +
            </span>
            Room for the next rabbit hole
          </li>
        )}
      </ul>
    </div>
  )
}

function TopicRow({ topic, accent, open, onToggle }: { topic: LabTopic; accent: string; open: boolean; onToggle: () => void }) {
  const panelId = useId()
  const scrollTo = useScrollTo()

  return (
    <li>
      <button onClick={onToggle} aria-expanded={open} aria-controls={panelId} className="group flex w-full items-center gap-3 py-4 text-left">
        <span className="flex-1 font-medium transition-colors group-hover:text-cobalt">{topic.name}</span>
        <StatusPill status={topic.status} />
        <Plus className={cn('size-4 shrink-0 text-muted transition-transform duration-300', open && 'rotate-45 text-ink')} aria-hidden />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
            className="overflow-hidden"
          >
            <div className="mb-5 border-l-2 pl-4 text-[0.95rem]" style={{ borderColor: accent }}>
              <p className="text-ink/85">{topic.explanation}</p>
              <p className="mt-3">
                <span className="label mr-2">Why it’s interesting</span>
                <span className="serif-italic text-ink">{topic.why}</span>
              </p>
              {!!(topic.experiments?.length || topic.related?.length) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {topic.experiments?.map((e) => (
                    <a
                      key={e.url}
                      href={e.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-line bg-paper px-3 py-1 font-mono text-[0.7rem] transition-colors hover:border-ink"
                    >
                      ⚗ {e.label} ↗
                    </a>
                  ))}
                  {topic.related?.map((r) =>
                    r.href.startsWith('#') ? (
                      <button
                        key={r.href + r.label}
                        onClick={() => scrollTo(r.href.slice(1))}
                        className="rounded-full bg-ink px-3 py-1 font-mono text-[0.7rem] text-paper transition-colors hover:bg-cobalt"
                      >
                        {r.label}
                      </button>
                    ) : isExternal(r.href) ? (
                      <a key={r.href} href={r.href} target="_blank" rel="noopener noreferrer" className="rounded-full bg-ink px-3 py-1 font-mono text-[0.7rem] text-paper hover:bg-cobalt">
                        {r.label} ↗
                      </a>
                    ) : (
                      <Link key={r.href} to={r.href} className="rounded-full bg-ink px-3 py-1 font-mono text-[0.7rem] text-paper transition-colors hover:bg-cobalt">
                        → {r.label}
                      </Link>
                    ),
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}
