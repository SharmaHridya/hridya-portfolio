import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { easeOutExpo } from '../../animations/variants'
import { debates } from '../../data/debates'
import { cn } from '../../utils/format'
import { DraftBadge } from '../ui/Tag'
import { SubHeading } from './SubHeading'

export function Debater() {
  const [active, setActive] = useState(0)
  const d = debates[active]

  return (
    <div className="mb-28">
      <SubHeading
        letter="B"
        kicker="The debater"
        title={
          <>
            Questions worth <span className="serif-italic">arguing about.</span>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <ol className="lg:col-span-5" aria-label="Debate questions">
          {debates.map((q, i) => (
            <li key={q.id} className="border-b border-ink/15 first:border-t">
              <button
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                aria-controls="debate-sheet"
                className={cn('group flex w-full items-start gap-4 py-5 text-left transition-colors', active === i ? 'text-ink' : 'text-ink/55 hover:text-ink')}
              >
                <span className="pt-1 font-mono text-xs">Q{i + 1}</span>
                <span className="flex-1 font-display text-xl leading-snug font-medium tracking-tight md:text-2xl">{q.question}</span>
                <span
                  className={cn('mt-2 size-2.5 shrink-0 rounded-full transition-all', active === i ? 'scale-100 bg-tangerine' : 'scale-50 bg-ink/20 group-hover:scale-75')}
                  aria-hidden
                />
              </button>
            </li>
          ))}
        </ol>

        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.article
              id="debate-sheet"
              key={d.id}
              initial={{ opacity: 0, rotate: -0.6, y: 14 }}
              animate={{ opacity: 1, rotate: 0, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: easeOutExpo }}
              className="relative rounded-[22px] border border-line bg-card p-6 shadow-[0_30px_60px_-40px_rgba(32,33,36,0.35)] md:p-10"
              aria-live="polite"
            >
              {/* Journal margin line */}
              <span className="absolute top-0 bottom-0 left-12 hidden w-px bg-tangerine/30 md:block" aria-hidden />
              <div className="md:pl-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="label">Discussion journal · Q{active + 1}</p>
                  {d.sample && <DraftBadge>Sample content · awaiting my own take</DraftBadge>}
                </div>
                <h4 className="mt-4 text-2xl font-semibold md:text-3xl">{d.question}</h4>

                <div className="mt-6 rounded-xl bg-paper p-5">
                  <p className="label mb-2">{d.sample ? 'A position to argue' : 'My perspective'}</p>
                  <p className="serif-italic text-lg text-ink">{d.position}</p>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <Column title="For" mark="+" color="#3657D6" items={d.supporting} />
                  <Column title="Against" mark="−" color="#F28B54" items={d.counter} />
                </div>

                <div className="mt-6 border-t border-dashed border-line pt-5">
                  <p className="label mb-2">Further questions</p>
                  <ul className="flex flex-wrap gap-2">
                    {d.further.map((f) => (
                      <li key={f} className="rounded-full border border-lavender bg-lavender/15 px-3 py-1 text-sm">
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function Column({ title, mark, color, items }: { title: string; mark: string; color: string; items: string[] }) {
  return (
    <div>
      <p className="mb-3 flex items-center gap-2 font-display font-semibold">
        <span className="grid size-6 place-items-center rounded-full text-paper" style={{ background: color }} aria-hidden>
          {mark}
        </span>
        {title}
      </p>
      <ul className="space-y-3 text-[0.95rem] text-ink/80">
        {items.map((it) => (
          <li key={it} className="border-l-2 pl-3" style={{ borderColor: `${color}55` }}>
            {it}
          </li>
        ))}
      </ul>
    </div>
  )
}
