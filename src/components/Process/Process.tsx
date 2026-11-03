import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { easeOutExpo } from '../../animations/variants'
import { processStages } from '../../data/process'
import { cn } from '../../utils/format'
import { SectionHeader } from '../ui/SectionHeader'

const GLYPHS = ['?', '⌕', '⚗', '▲', '“']

export function Process() {
  const [active, setActive] = useState(0)
  const stage = processStages[active]

  return (
    <section id="process" aria-labelledby="process-title" className="border-t border-line py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          id="process-title"
          number="05"
          label="How I think"
          title={
            <>
              From questions <span className="serif-italic text-cobalt">to creations.</span>
            </>
          }
          intro={<p>Five stages I keep coming back to, traced through one real project: the Urban Heat Mitigation Simulator.</p>}
        />

        {/* Stage selector: a horizontal track on desktop, a vertical list on mobile */}
        <div role="tablist" aria-label="Problem-solving stages" className="relative grid gap-2 md:grid-cols-5 md:gap-0">
          <span className="absolute top-[27px] right-[10%] left-[10%] hidden h-px bg-line md:block" aria-hidden />
          <motion.span
            className="absolute top-[27px] left-[10%] hidden h-px origin-left bg-ink md:block"
            animate={{ width: `${(active / (processStages.length - 1)) * 80}%` }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
            aria-hidden
          />
          {processStages.map((s, i) => {
            const on = i === active
            return (
              <button
                key={s.n}
                role="tab"
                id={`stage-tab-${i}`}
                aria-selected={on}
                aria-controls="stage-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
                  if (!dir) return
                  e.preventDefault()
                  const next = (i + dir + processStages.length) % processStages.length
                  setActive(next)
                  document.getElementById(`stage-tab-${next}`)?.focus()
                }}
                className="group relative z-10 flex items-center gap-4 rounded-2xl p-2 text-left md:flex-col md:gap-3 md:text-center"
              >
                <motion.span
                  className={cn(
                    'grid size-14 shrink-0 place-items-center rounded-full border font-display text-xl transition-colors duration-300',
                    on ? 'border-ink bg-ink text-paper' : i < active ? 'border-ink bg-paper text-ink' : 'border-line bg-paper text-muted group-hover:border-ink/40',
                  )}
                  animate={on ? { scale: 1.08, rotate: [0, -8, 0] } : { scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5 }}
                  aria-hidden
                >
                  {GLYPHS[i]}
                </motion.span>
                <span>
                  <span className="block font-mono text-[0.68rem] text-muted">{s.n}</span>
                  <span className={cn('font-display text-lg font-semibold tracking-tight uppercase', on ? 'text-ink' : 'text-ink/60')}>{s.name}</span>
                </span>
              </button>
            )
          })}
        </div>

        <div id="stage-panel" role="tabpanel" aria-labelledby={`stage-tab-${active}`} className="mt-10 overflow-hidden rounded-[24px] border border-line bg-card">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: easeOutExpo }}
              className="grid md:grid-cols-12"
            >
              <div className="border-b border-line p-6 md:col-span-5 md:border-r md:border-b-0 md:p-10">
                <p className="label">
                  Stage {stage.n} / 05
                </p>
                <h3 className="mt-3 text-4xl font-semibold md:text-5xl">{stage.name}</h3>
                <p className="mt-4 text-lg text-ink/80">{stage.summary}</p>
              </div>
              <div className="relative p-6 md:col-span-7 md:p-10">
                <p className="label flex items-center gap-2">
                  <span className="size-2 rounded-full bg-tangerine" aria-hidden /> In practice · Urban Heat Simulator
                </p>
                <p className="mt-4 font-display text-[clamp(1.2rem,2vw,1.6rem)] leading-snug font-medium tracking-tight">{stage.example}</p>
                <Link to="/projects/urban-heat-simulator" className="link-underline mt-8 inline-block text-sm text-cobalt-deep">
                  Read the full case study →
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
