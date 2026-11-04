import { useInView, useReducedMotion } from 'framer-motion'
import { Eraser, PenLine, RotateCcw, Undo2 } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState, type PointerEvent } from 'react'
import { doodleSteps } from '../../data/doodle'
import { cn } from '../../utils/format'

const W = 800
const H = 440
const MS_PER_TEXT_PX = 3.4 // writing speed
const MS_PER_PATH_PX = 2.2 // doodling is a little faster
const LIFT_MS = 260 // pen lifted between strokes
const ENTER_MS = 700 // pen sliding in and out of the board
const OFFSCREEN = { x: 900, y: 540 }

type Pt = { x: number; y: number }
type Stroke = { color: string; width: number; pts: Pt[] }

// Visitor inks: the site's accents, plus a wide translucent highlighter.
const INKS = [
  { name: 'Cobalt pen', color: '#3657D6', width: 3 },
  { name: 'Tangerine pen', color: '#F28B54', width: 3 },
  { name: 'Ink pen', color: '#202124', width: 2.5 },
  { name: 'Highlighter', color: 'rgba(242, 201, 76, 0.55)', width: 16 },
]
type Seg = { kind: 'move'; start: number; dur: number; from: Pt; to: Pt } | { kind: 'draw'; start: number; dur: number; step: number }

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const easeInOut = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2)

/**
 * A notebook page where a pencil slides in and writes a short note, then doodles around it.
 * When it's done, visitors can draw on the page themselves.
 */
export function DoodleBoard() {
  const reduced = useReducedMotion()
  const box = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const inView = useInView(box, { once: true, margin: '0px 0px -25% 0px' })
  const textRefs = useRef<(SVGTextElement | null)[]>([])
  const pathRefs = useRef<(SVGPathElement | null)[]>([])
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')

  // Width of each text step / length of each path step, measured once the font has loaded.
  const [sizes, setSizes] = useState<number[] | null>(null)
  const [t, setT] = useState(0)
  const [run, setRun] = useState(0)
  const [drawMode, setDrawMode] = useState(false)
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [ink, setInk] = useState(0)
  const live = useRef<Pt[] | null>(null)

  useEffect(() => {
    let cancelled = false
    document.fonts
      .load('40px "Caveat Variable"')
      .catch(() => undefined)
      .finally(() => {
        if (cancelled) return
        setSizes(
          doodleSteps.map((s, i) =>
            s.kind === 'text' ? (textRefs.current[i]?.getComputedTextLength() ?? 0) : (pathRefs.current[i]?.getTotalLength() ?? 0),
          ),
        )
      })
    return () => {
      cancelled = true
    }
  }, [])

  const endpoints = (i: number, size: number): [Pt, Pt] => {
    const s = doodleSteps[i]
    if (s.kind === 'text') {
      const y = s.y - s.size * 0.28
      return [
        { x: s.x, y },
        { x: s.x + size, y },
      ]
    }
    const p = pathRefs.current[i]
    if (!p) return [OFFSCREEN, OFFSCREEN]
    const a = p.getPointAtLength(0)
    const b = p.getPointAtLength(size)
    return [
      { x: a.x, y: a.y },
      { x: b.x, y: b.y },
    ]
  }

  const timeline = useMemo(() => {
    if (!sizes) return null
    const segs: Seg[] = []
    let clock = 0
    let at: Pt = OFFSCREEN
    doodleSteps.forEach((s, i) => {
      const [from, to] = endpoints(i, sizes[i])
      const moveDur = i === 0 ? ENTER_MS : LIFT_MS
      segs.push({ kind: 'move', start: clock, dur: moveDur, from: at, to: from })
      clock += moveDur
      const dur = s.kind === 'text' ? Math.max(450, sizes[i] * MS_PER_TEXT_PX) : Math.max(320, sizes[i] * MS_PER_PATH_PX)
      segs.push({ kind: 'draw', start: clock, dur, step: i })
      clock += dur
      at = to
    })
    segs.push({ kind: 'move', start: clock, dur: ENTER_MS, from: at, to: OFFSCREEN })
    clock += ENTER_MS
    return { segs, total: clock }
    // `endpoints` only reads refs, which are settled once `sizes` has been measured.
  }, [sizes])

  // Play the timeline once the board scrolls into view (and again on replay).
  useEffect(() => {
    if (!timeline || !inView) return
    if (reduced) {
      setT(timeline.total)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      setT(Math.min(elapsed, timeline.total))
      if (elapsed < timeline.total) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [timeline, inView, run, reduced])

  const done = !!timeline && t >= timeline.total
  const progress = (i: number) => {
    if (!timeline) return 0
    const seg = timeline.segs.find((s) => s.kind === 'draw' && s.step === i)
    return seg ? clamp01((t - seg.start) / seg.dur) : 0
  }

  const pen = (() => {
    if (!timeline || !sizes || done || reduced) return null
    const seg = timeline.segs.find((s) => t < s.start + s.dur)
    if (!seg) return null
    const k = clamp01((t - seg.start) / seg.dur)
    if (seg.kind === 'move') {
      const e = easeInOut(k)
      return { x: seg.from.x + (seg.to.x - seg.from.x) * e, y: seg.from.y + (seg.to.y - seg.from.y) * e, lifted: true }
    }
    const s = doodleSteps[seg.step]
    if (s.kind === 'text') {
      const w = sizes[seg.step]
      // A small up-and-down wobble reads as handwriting rather than a sliding cursor.
      return { x: s.x + k * w, y: s.y - s.size * 0.28 + Math.sin((k * w) / 6) * s.size * 0.14, lifted: false }
    }
    const pt = pathRefs.current[seg.step]?.getPointAtLength(k * sizes[seg.step])
    return pt ? { x: pt.x, y: pt.y, lifted: false } : null
  })()

  const toBoard = (e: PointerEvent<SVGSVGElement>): Pt => {
    const svg = svgRef.current!
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const local = pt.matrixTransform(svg.getScreenCTM()?.inverse())
    return { x: local.x, y: local.y }
  }

  const onDown = (e: PointerEvent<SVGSVGElement>) => {
    if (!drawMode) return
    e.currentTarget.setPointerCapture(e.pointerId)
    live.current = [toBoard(e)]
    const { color, width } = INKS[ink]
    setStrokes((s) => [...s, { color, width, pts: live.current! }])
  }
  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!drawMode || !live.current) return
    live.current = [...live.current, toBoard(e)]
    const pts = live.current
    setStrokes((s) => [...s.slice(0, -1), { ...s[s.length - 1], pts }])
  }
  const onUp = () => {
    live.current = null
  }

  const note = doodleSteps.flatMap((s) => (s.kind === 'text' ? [s.text] : [])).join(' ')

  return (
    <figure ref={box} className="mt-12">
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="label">Fig. 02 — a note, written live</span>
        <span className="font-mono text-[0.68rem] text-muted" aria-live="polite">
          {drawMode ? 'Your turn: draw anywhere on the page' : done ? 'Done. Want to add something?' : sizes && inView ? 'writing…' : ''}
        </span>
      </div>

      <div className="relative overflow-hidden rounded-[22px] border border-line bg-[#fffdf7] shadow-[0_30px_60px_-40px_rgba(32,33,36,0.35)]">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className={cn('block w-full select-none', drawMode && 'cursor-crosshair')}
          style={{ touchAction: drawMode ? 'none' : 'auto' }}
          role="img"
          aria-label={`Handwritten note: ${note}`}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          {/* Ruled notebook paper */}
          {Array.from({ length: 7 }, (_, i) => (
            <line key={i} x1={0} x2={W} y1={40 + i * 60} y2={40 + i * 60} stroke="#3657D6" strokeOpacity={0.12} />
          ))}
          <line x1={46} x2={46} y1={0} y2={H} stroke="#F28B54" strokeOpacity={0.45} />
          {[90, 220, 350].map((y) => (
            <circle key={y} cx={20} cy={y} r={7} fill="#F0EEE6" stroke="#E5E5E0" />
          ))}

          <defs>
            {doodleSteps.map((s, i) =>
              s.kind === 'text' ? (
                <clipPath key={i} id={`${uid}-clip-${i}`}>
                  <rect x={s.x - 4} y={s.y - s.size} height={s.size * 1.5} width={sizes ? sizes[i] * (reduced ? 1 : progress(i)) + 6 : 0} />
                </clipPath>
              ) : null,
            )}
          </defs>

          {doodleSteps.map((s, i) => {
            const k = reduced ? 1 : progress(i)
            if (s.kind === 'text') {
              return (
                <text
                  key={i}
                  ref={(el) => {
                    textRefs.current[i] = el
                  }}
                  x={s.x}
                  y={s.y}
                  fontSize={s.size}
                  fill={s.color}
                  fontFamily="'Caveat Variable', cursive"
                  fontWeight={500}
                  clipPath={`url(#${uid}-clip-${i})`}
                  aria-hidden
                >
                  {s.text}
                </text>
              )
            }
            const len = sizes?.[i] ?? 0
            return (
              <path
                key={i}
                ref={(el) => {
                  pathRefs.current[i] = el
                }}
                d={s.d}
                fill="none"
                stroke={s.color}
                strokeWidth={s.width ?? 2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={len || undefined}
                strokeDashoffset={len * (1 - k)}
                opacity={sizes ? 1 : 0}
              />
            )
          })}

          {strokes.map((st, i) => (
            <path
              key={`u-${i}`}
              d={st.pts.map((p, j) => `${j ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')}
              fill="none"
              stroke={st.color}
              strokeWidth={st.width}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {pen && <Pencil x={pen.x} y={pen.y} lifted={pen.lifted} />}
        </svg>
      </div>

      <figcaption className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            setDrawMode(false)
            setStrokes([])
            setT(0)
            setRun((r) => r + 1)
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-1.5 text-sm transition-colors hover:border-ink"
        >
          <RotateCcw className="size-3.5" aria-hidden /> Replay
        </button>
        <button
          onClick={() => setDrawMode((d) => !d)}
          aria-pressed={drawMode}
          disabled={!done}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm transition-colors disabled:opacity-40',
            drawMode ? 'bg-cobalt text-paper' : 'bg-ink text-paper hover:bg-cobalt',
          )}
        >
          <PenLine className="size-3.5" aria-hidden /> {drawMode ? 'Done drawing' : 'Your turn: doodle'}
        </button>
        {drawMode && (
          <div className="flex items-center gap-1.5 rounded-full border border-line bg-card px-2 py-1" role="radiogroup" aria-label="Ink">
            {INKS.map((k, i) => (
              <button
                key={k.name}
                role="radio"
                aria-checked={ink === i}
                aria-label={k.name}
                title={k.name}
                onClick={() => setInk(i)}
                className={cn('grid size-6 place-items-center rounded-full transition-transform', ink === i ? 'scale-110 ring-2 ring-ink ring-offset-1' : 'hover:scale-110')}
              >
                <span className={cn('block rounded-full', i === 3 ? 'h-2 w-4' : 'size-3.5')} style={{ background: k.color }} />
              </button>
            ))}
          </div>
        )}
        {strokes.length > 0 && (
          <>
            <button
              onClick={() => setStrokes((s) => s.slice(0, -1))}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted hover:text-ink"
            >
              <Undo2 className="size-3.5" aria-hidden /> Undo
            </button>
            <button onClick={() => setStrokes([])} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted hover:text-ink">
              <Eraser className="size-3.5" aria-hidden /> Clear my doodles
            </button>
          </>
        )}
      </figcaption>
    </figure>
  )
}

/** A pencil whose graphite tip sits at (x, y). Lifted between strokes, so it rises and its shadow softens. */
function Pencil({ x, y, lifted }: Pt & { lifted: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`} pointerEvents="none" aria-hidden>
      <ellipse cx={lifted ? 16 : 7} cy={lifted ? 10 : 4} rx={10} ry={3.5} fill="#202124" opacity={lifted ? 0.07 : 0.16} />
      <g transform={`rotate(32) translate(0 ${lifted ? -8 : 0})`}>
        <path d="M0 0 L-5.5 -17 L5.5 -17 Z" fill="#E9C9A2" />
        <path d="M0 0 L-1.9 -5.8 L1.9 -5.8 Z" fill="#202124" />
        <rect x={-5.5} y={-98} width={11} height={81} fill="#3657D6" />
        <rect x={-5.5} y={-98} width={3.5} height={81} fill="#fff" opacity={0.2} />
        <rect x={-6} y={-109} width={12} height={11} fill="#c9c9c4" />
        <rect x={-6} y={-120} width={12} height={12} rx={3.5} fill="#F28B54" />
      </g>
    </g>
  )
}
