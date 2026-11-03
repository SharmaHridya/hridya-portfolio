import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react'
import { bookPages, type BookPage } from '../../data/books'
import { cn } from '../../utils/format'

const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x']
const INTRO =
  'I’ve always been drawn to stories that make you question things — human nature, morality, identity, mythology and everything in between. Some books entertain you; others leave you with questions you didn’t know you had. This is a little collection of the words that stayed.'

type Turn = { index: number; from: number; dir: 1 | -1; id: number; turning: boolean }

/**
 * A small book of quotations you flip through. Turning forward lifts the current page off the spine
 * to reveal the next one underneath; turning back brings the previous page down over it.
 */
export function WordsThatStayed() {
  const reduced = useReducedMotion()
  const n = bookPages.length
  const [t, setT] = useState<Turn>({ index: 0, from: 0, dir: 1, id: 0, turning: false })
  const downX = useRef<number | null>(null)

  const go = (dir: 1 | -1) =>
    setT((s) => (s.turning ? s : { index: (s.index + dir + n) % n, from: s.index, dir, id: s.id + 1, turning: !reduced }))

  // Safety net: if the turn's completion callback never fires (e.g. the tab was hidden mid-turn), unlock anyway.
  useEffect(() => {
    if (!t.turning) return
    const timer = window.setTimeout(() => setT((s) => (s.id === t.id ? { ...s, turning: false } : s)), 1400)
    return () => window.clearTimeout(timer)
  }, [t.turning, t.id])

  // While a page is moving, the page underneath is the one being revealed (forward) or covered (back).
  const under = t.turning ? (t.dir === 1 ? t.index : t.from) : t.index
  const moving = t.dir === 1 ? t.from : t.index

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      go(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    }
  }
  const swiped = useRef(false)
  const onClick = (e: MouseEvent) => {
    if (swiped.current) {
      swiped.current = false
      return
    }
    if ((e.target as HTMLElement).closest('a, button')) return
    go(1)
  }
  // Swipe left/right on touch screens.
  const onPointerDown = (e: PointerEvent) => {
    downX.current = e.clientX
  }
  const onPointerUp = (e: PointerEvent) => {
    if (downX.current === null) return
    const dx = e.clientX - downX.current
    downX.current = null
    if (Math.abs(dx) > 50) {
      swiped.current = true
      go(dx < 0 ? 1 : -1)
    }
  }

  return (
    <div className="mb-14 overflow-hidden rounded-[22px] border border-beige bg-ivory p-6 text-espresso sm:p-10 md:p-12">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
        <div className="lg:col-span-5">
          <p className="flex items-center gap-2 text-[0.7rem] font-medium tracking-[0.18em] text-olive uppercase">
            <span className="size-2 rounded-full bg-[#7fa86b]" aria-hidden /> Beyond engineering
          </p>
          <h4 className="mt-4 font-serif text-[clamp(2.4rem,5vw,4rem)] leading-[0.95] font-medium">
            Words that <span className="italic">stayed.</span>
          </h4>
          <p className="mt-4 font-serif text-xl text-olive italic">Some books end. Their questions don’t.</p>
          <span className="mt-6 block h-px w-20 bg-gold" aria-hidden />
          <p className="mt-6 font-serif text-[1.12rem] leading-[1.6] text-espresso/90">{INTRO}</p>
        </div>

        <div className="lg:col-span-7">
          <div
            role="group"
            aria-roledescription="book"
            aria-label={`Words that stayed, page ${t.index + 1} of ${n}. Use the arrow keys to turn the page.`}
            tabIndex={0}
            onKeyDown={onKey}
            onClick={onClick}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            className="relative cursor-pointer select-none [perspective:1800px]"
          >
            {/* Edges of the pages still to come */}
            <span className="absolute inset-0 translate-x-2 translate-y-2 rounded-r-[12px] rounded-l-[3px] border border-beige bg-[#efe6d4]" aria-hidden />
            <span className="absolute inset-0 translate-x-1 translate-y-1 rounded-r-[11px] rounded-l-[3px] border border-beige bg-[#f3ecdf]" aria-hidden />

            <Page page={bookPages[under]} number={under} />

            <AnimatePresence>
              {t.turning && (
                <motion.div
                  key={t.id}
                  className="absolute inset-0"
                  style={{ transformOrigin: 'left center', backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
                  initial={{ rotateY: t.dir === 1 ? 0 : -180 }}
                  animate={{ rotateY: t.dir === 1 ? -180 : 0 }}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                  transition={{ duration: 0.85, ease: [0.45, 0.05, 0.25, 1] }}
                  onAnimationComplete={() => setT((s) => ({ ...s, turning: false }))}
                  aria-hidden
                >
                  <Page page={bookPages[moving]} number={moving} turning />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-7 flex items-center justify-between gap-4">
            <button
              onClick={() => go(-1)}
              className="inline-flex items-center gap-2 rounded-full border border-beige bg-parchment px-4 py-2 text-sm text-espresso transition-colors hover:border-espresso"
              aria-label="Previous page"
            >
              <ArrowLeft className="size-4" aria-hidden /> <span className="hidden sm:inline">Back</span>
            </button>
            <div className="flex items-center gap-1.5" aria-hidden>
              {bookPages.map((p, i) => (
                <span key={p.id} className={cn('h-1.5 rounded-full transition-all duration-500', i === t.index ? 'w-6 bg-espresso' : 'w-1.5 bg-sepia/30')} />
              ))}
            </div>
            <button
              onClick={() => go(1)}
              className="inline-flex items-center gap-2 rounded-full bg-espresso px-4 py-2 font-serif text-[1.02rem] whitespace-nowrap text-ivory transition-colors hover:bg-olive sm:px-5"
              aria-label={t.index === n - 1 ? 'Back to the first page' : 'Turn the page'}
            >
              {t.index === n - 1 ? 'Start again' : 'Turn the page'} <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
          <p className="sr-only" aria-live="polite">
            {`${bookPages[t.index].title}: ${bookPages[t.index].text}`}
          </p>
        </div>
      </div>
    </div>
  )
}

function Page({ page, number, turning }: { page: BookPage; number: number; turning?: boolean }) {
  return (
    <figure
      className={cn(
        'relative flex h-full min-h-[460px] flex-col rounded-r-[10px] rounded-l-[3px] border border-beige bg-parchment px-7 pt-7 pb-6 sm:min-h-[430px] sm:px-11 sm:pt-9',
        turning ? 'shadow-[18px_10px_40px_-20px_rgba(58,42,31,0.45)]' : 'shadow-[0_30px_60px_-42px_rgba(58,42,31,0.6)]',
      )}
    >
      {/* Shadow along the binding */}
      <span className="pointer-events-none absolute inset-y-0 left-0 w-10 rounded-l-[3px] bg-gradient-to-r from-[#3a2a1f]/12 to-transparent" aria-hidden />

      <figcaption className="relative flex items-center justify-between text-[0.68rem] tracking-[0.18em] text-sepia uppercase">
        <span>{page.theme}</span>
        <span className="font-serif text-sm tracking-normal text-gold normal-case italic">{ROMAN[number]}</span>
      </figcaption>

      <blockquote className="relative my-auto py-7">
        <span className="absolute -top-1 -left-2 font-serif text-6xl leading-none text-gold/45" aria-hidden>
          “
        </span>
        <p
          className={cn(
            'relative font-serif text-espresso',
            page.smallCaps ? 'text-[clamp(1.1rem,2vw,1.4rem)] leading-relaxed tracking-[0.12em] uppercase' : 'text-[clamp(1.4rem,2.6vw,2rem)] leading-[1.32]',
          )}
        >
          {page.text}
        </p>
      </blockquote>

      <div className="relative border-t border-beige pt-4">
        <p className="font-serif text-lg text-espresso italic">{page.title}</p>
        <p className="mt-0.5 text-[0.8rem] text-sepia">
          {page.author}
          {page.note && ` · ${page.note}`}
          {page.context && ` · ${page.context}`}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 text-[0.75rem]">
          <a href={page.source.url} target="_blank" rel="noopener noreferrer" className="text-sepia hover:text-espresso" tabIndex={turning ? -1 : 0}>
            {page.source.label}
            <span className="sr-only"> (source, opens in a new tab)</span>
          </a>
          <a
            href={page.rabbitHole.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-olive hover:text-espresso"
            tabIndex={turning ? -1 : 0}
          >
            Explore this rabbit hole ↗<span className="sr-only">: {page.rabbitHole.label} (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </figure>
  )
}
