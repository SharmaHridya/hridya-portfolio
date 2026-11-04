import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ChevronLeft, ChevronRight, ListChecks, MousePointerClick } from 'lucide-react'
import { useReducer, useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { easeOutExpo } from '../../animations/variants'
import { slides } from '../../data/slides'
import { useScrollTo } from '../../hooks/useScrollTo'
import { cn } from '../../utils/format'
import { SlideDiagram } from './SlideDiagram'

const BOX = 'M4 5 C 9 3.6, 15 4.4, 20 5 C 21 10, 20.6 15, 20 20 C 14 21, 9 20.6, 4 20 C 3.2 15, 3.4 10, 4 5'
const TICK = 'M6.5 12.5 L 10.5 17 L 21 3.5'
const UNDERLINE = 'M2 8 C 40 3, 80 11, 120 6 S 200 3, 240 7 S 290 9, 298 5'

type Deck = { index: number; shown: number; dir: 1 | -1 }
type Action = { type: 'next' } | { type: 'prev' } | { type: 'goto'; index: number } | { type: 'all' }

// A reducer keeps rapid clicks and key repeats consistent: every step works from the latest state.
function deckReducer(state: Deck, action: Action): Deck {
  const count = slides[state.index].items.length
  switch (action.type) {
    case 'next':
      if (state.shown < count) return { ...state, shown: state.shown + 1 }
      return { index: (state.index + 1) % slides.length, shown: 0, dir: 1 }
    case 'prev': {
      if (state.shown > 0) return { ...state, shown: state.shown - 1 }
      const index = (state.index - 1 + slides.length) % slides.length
      return { index, shown: slides[index].items.length, dir: -1 }
    }
    case 'goto':
      return { index: action.index, shown: 0, dir: action.index > state.index ? 1 : -1 }
    case 'all':
      return { ...state, shown: count }
  }
}

/**
 * A pocket lecture on gradient descent: each click (or Space / →) draws the next point onto the
 * slide and advances its diagram. After the last point, the next click moves on to the next slide.
 */
export function SlideDeck() {
  const reduced = useReducedMotion()
  const [{ index, shown, dir }, dispatch] = useReducer(deckReducer, { index: 0, shown: 0, dir: 1 })
  const laser = useRef<HTMLSpanElement>(null)
  const scrollTo = useScrollTo()
  const slide = slides[index]
  const complete = shown >= slide.items.length
  const isLast = index === slides.length - 1

  const next = () => dispatch({ type: 'next' })
  const prev = () => dispatch({ type: 'prev' })

  const onKey = (e: KeyboardEvent) => {
    // Keys pressed on a button inside the slide belong to that button.
    if (e.target !== e.currentTarget && (e.target as HTMLElement).closest('button, a')) return
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      next()
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'Backspace') {
      e.preventDefault()
      prev()
    }
  }

  // A presenter's laser dot follows the mouse on the slide (not shown for touch).
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = laser.current
    if (!el || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    el.style.opacity = '1'
    el.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px)`
  }
  const hideLaser = () => {
    if (laser.current) laser.current.style.opacity = '0'
  }

  const hint = !complete ? 'Click to draw the next point' : isLast ? 'Click to start over' : 'Click for the next slide'

  return (
    <div className="mt-16">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label">Fig. — a pocket lecture</p>
          <h4 className="mt-1 text-2xl font-semibold md:text-3xl">How I’d explain gradient descent, in four slides.</h4>
        </div>
        <p className="flex items-center gap-1.5 font-mono text-[0.7rem] text-muted">
          <MousePointerClick className="size-3.5" aria-hidden /> click the slide · space / ← →
        </p>
      </div>

      <div
        role="group"
        aria-roledescription="slide deck"
        aria-label={`Pocket lecture, slide ${index + 1} of ${slides.length}: ${slide.title}. Press Space or the right arrow to draw the next point.`}
        tabIndex={0}
        onKeyDown={onKey}
        onClick={next}
        onPointerMove={onPointerMove}
        onPointerLeave={hideLaser}
        className="group relative flex min-h-[680px] cursor-pointer flex-col overflow-hidden rounded-[24px] border border-ink bg-card shadow-[0_40px_80px_-50px_rgba(32,33,36,0.5)] select-none lg:aspect-[2/1] lg:min-h-0 [@media(pointer:fine)]:cursor-none"
      >
        <span
          ref={laser}
          className="pointer-events-none absolute top-0 left-0 z-20 -mt-1.5 -ml-1.5 size-3 rounded-full bg-[#ff3b30] opacity-0 shadow-[0_0_12px_4px_rgba(255,59,48,0.55)] transition-opacity"
          aria-hidden
        />

        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={index}
            custom={dir}
            initial={{ opacity: 0, x: dir * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -60 }}
            transition={{ duration: 0.45, ease: easeOutExpo }}
            className="flex flex-1 flex-col p-6 sm:p-10 md:p-12"
          >
            <div className="flex items-center justify-between font-mono text-[0.7rem] tracking-wider text-muted uppercase">
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ background: slide.accent }} aria-hidden />
                {slide.kicker}
              </span>
              <span>
                {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </span>
            </div>

            <div className="mt-5 grid flex-1 gap-6 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-6">
                <h5 className="relative inline-block font-display text-[clamp(1.9rem,4vw,3.6rem)] leading-[1.02] font-semibold tracking-tight">
                  {slide.title}
                  <svg viewBox="0 0 300 12" preserveAspectRatio="none" className="absolute -bottom-3 left-0 h-3 w-full overflow-visible" aria-hidden>
                    <motion.path
                      d={UNDERLINE}
                      fill="none"
                      stroke={slide.accent === '#202124' ? '#F28B54' : slide.accent}
                      strokeWidth={3}
                      strokeLinecap="round"
                      initial={{ pathLength: reduced ? 1 : 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.7, delay: 0.25, ease: 'easeInOut' }}
                    />
                  </svg>
                </h5>

                <ul className="mt-10 space-y-2.5 sm:space-y-3">
                  <AnimatePresence initial={false}>
                    {slide.items.slice(0, shown).map((item) => (
                      <motion.li
                        key={item.text}
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -10, transition: { duration: 0.2 } }}
                        className="flex items-start gap-3"
                      >
                        <svg viewBox="0 0 24 24" className="mt-1 size-6 shrink-0 overflow-visible sm:size-7" aria-hidden>
                          <motion.path
                            d={BOX}
                            fill="none"
                            stroke="#202124"
                            strokeOpacity={0.55}
                            strokeWidth={1.6}
                            strokeLinecap="round"
                            initial={{ pathLength: reduced ? 1 : 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                          />
                          <motion.path
                            d={TICK}
                            fill="none"
                            stroke={slide.accent === '#202124' ? '#3657D6' : slide.accent}
                            strokeWidth={2.6}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: reduced ? 1 : 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.3, delay: 0.3, ease: 'easeOut' }}
                          />
                        </svg>
                        <span className="min-w-0">
                          <motion.span
                            className="block font-[family-name:var(--font-hand)] text-[clamp(1.45rem,2.6vw,2.1rem)] leading-tight font-semibold"
                            initial={{ clipPath: reduced ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
                            animate={{ clipPath: 'inset(0 0% 0 0)' }}
                            transition={{ duration: Math.min(1.1, 0.25 + item.text.length * 0.035), delay: 0.2, ease: 'linear' }}
                          >
                            {item.text}
                          </motion.span>
                          {item.action === 'playground' && (
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation()
                                scrollTo('ml-playground')
                              }}
                              className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-xs text-paper hover:bg-cobalt"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.6 }}
                            >
                              Open the ML playground <ArrowDown className="size-3" aria-hidden />
                            </motion.button>
                          )}
                          {item.note && (
                            <motion.span
                              className="block text-sm text-muted"
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: reduced ? 0 : 0.55 + Math.min(0.8, item.text.length * 0.03), duration: 0.35 }}
                            >
                              {item.note}
                            </motion.span>
                          )}
                        </span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>

              <div className="flex items-center justify-center rounded-2xl bg-paper/60 p-4 lg:col-span-6">
                <SlideDiagram kind={slide.diagram} shown={shown} accent={slide.accent} />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="font-mono text-[0.68rem] text-muted">
                {shown}/{slide.items.length} drawn
              </span>
              <span className={cn('flex items-center gap-1.5 font-mono text-[0.7rem]', complete ? 'text-cobalt-deep' : 'text-ink/70')}>
                <span className={cn('size-1.5 rounded-full', complete ? 'bg-cobalt' : 'animate-pulse bg-tangerine')} aria-hidden />
                {hint}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="sr-only" aria-live="polite">
        {shown > 0 ? `${slide.items[shown - 1].text}${slide.items[shown - 1].note ? `, ${slide.items[shown - 1].note}` : ''}` : slide.title}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5" role="group" aria-label="Choose a slide">
          {slides.map((s, i) => (
            <button
              key={s.title}
              onClick={() => dispatch({ type: 'goto', index: i })}
              aria-label={`Slide ${i + 1}: ${s.title}`}
              aria-current={i === index ? 'step' : undefined}
              className={cn('h-2 rounded-full transition-all duration-300', i === index ? 'w-8 bg-ink' : 'w-2 bg-ink/20 hover:bg-ink/40')}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch({ type: 'all' })}
            disabled={complete}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:text-ink disabled:opacity-40"
          >
            <ListChecks className="size-4" aria-hidden /> Draw all
          </button>
          <button onClick={prev} className="grid size-9 place-items-center rounded-full border border-line bg-card hover:border-ink" aria-label="Previous point or slide">
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button onClick={next} className="grid size-9 place-items-center rounded-full bg-ink text-paper hover:bg-cobalt" aria-label="Next point or slide">
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  )
}
