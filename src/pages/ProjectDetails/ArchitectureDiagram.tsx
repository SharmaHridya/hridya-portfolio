import { motion } from 'framer-motion'
import { easeOutExpo } from '../../animations/variants'
import type { ArchitectureLane } from '../../data/projects'
import { cn } from '../../utils/format'

/** Left-to-right flow of layers (stacked top-to-bottom on small screens), drawn from data. */
export function ArchitectureDiagram({ caption, lanes, highlight }: { caption: string; lanes: ArchitectureLane[]; highlight?: number }) {
  return (
    <figure>
      <div className="grid-paper overflow-hidden rounded-[22px] border border-line bg-card p-5 md:p-8">
        <ol className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-0">
          {lanes.map((lane, i) => (
            <li key={lane.label} className="flex flex-col md:flex-1 md:flex-row md:items-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: easeOutExpo }}
                className={cn('flex-1 rounded-2xl border p-4', i === highlight ? 'border-cobalt bg-cobalt/[0.06] ring-4 ring-cobalt/10' : 'border-ink/15 bg-paper')}
              >
                <p className={cn('font-mono text-[0.68rem] tracking-wider uppercase', i === highlight ? 'text-cobalt-deep' : 'text-muted')}>{lane.label}</p>
                <ul className="mt-3 space-y-2">
                  {lane.nodes.map((n) => (
                    <li key={n} className="rounded-lg border border-line bg-card px-3 py-2 text-sm">
                      {n}
                    </li>
                  ))}
                </ul>
              </motion.div>
              {i < lanes.length - 1 && (
                <svg className="mx-auto my-1 h-6 w-6 shrink-0 rotate-90 text-ink/40 md:mx-1 md:my-0 md:rotate-0" viewBox="0 0 24 24" aria-hidden>
                  <path d="M3 12h16m-5-5 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" className="dash-flow" />
                </svg>
              )}
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="mt-4 font-mono text-xs text-muted">Fig. — {caption}</figcaption>
    </figure>
  )
}
