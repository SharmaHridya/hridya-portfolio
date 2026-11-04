import { useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { processStages } from '../../data/process'
import { openProcessStage } from '../../hooks/useProcessStage'
import { useScrollTo } from '../../hooks/useScrollTo'

type Word = { id: string; text: string; size: number; depth: number; caption: string; color: string }

// The same five stages as "How I think" (src/data/process.ts); only the typography lives here.
const LOOK = [
  { size: 46, depth: 1.0, color: '#202124' },
  { size: 36, depth: 0.6, color: '#3657D6' },
  { size: 27, depth: 1.3, color: '#202124' },
  { size: 52, depth: 0.8, color: '#202124' },
  { size: 38, depth: 1.1, color: '#202124' },
]

const WORDS: Word[] = processStages.map((s, i) => ({
  id: s.name.toLowerCase(),
  text: s.name.toUpperCase(),
  caption: s.summary,
  ...LOOK[i % LOOK.length],
}))

const C = 300 // centre of the 600×600 canvas
const R = 200

// Pentagon layout, starting at the top and going clockwise: the loop reads as a cycle.
const BASE = WORDS.map((_, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / WORDS.length
  return { x: C + R * Math.cos(a), y: C + R * Math.sin(a) + 8 }
})

export function WordConstellation() {
  const reduced = useReducedMotion()
  const scrollTo = useScrollTo()
  const openStage = (i: number) => {
    scrollTo('process')
    openProcessStage(i)
  }
  const box = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (reduced) return
    let raf = 0
    let current = { x: 0, y: 0 }
    // The loop only runs while the words are still catching up with the pointer.
    const tick = () => {
      const dx = target.current.x - current.x
      const dy = target.current.y - current.y
      if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
        raf = 0
        return
      }
      current = { x: current.x + dx * 0.08, y: current.y + dy * 0.08 }
      setOffset(current)
      raf = requestAnimationFrame(tick)
    }
    const onMove = (e: PointerEvent) => {
      const rect = box.current?.getBoundingClientRect()
      if (!rect) return
      target.current = {
        x: Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1)),
        y: Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1)),
      }
      if (!raf) raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  // Words drift against the pointer by their depth; the centre barely moves.
  const pos = BASE.map((p, i) => ({ x: p.x - offset.x * 22 * WORDS[i].depth, y: p.y - offset.y * 22 * WORDS[i].depth }))
  const centre = { x: C - offset.x * 6, y: C - offset.y * 6 }
  const activeIndex = WORDS.findIndex((w) => w.id === active)
  const caption = activeIndex >= 0 ? WORDS[activeIndex] : null

  const curve = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const mx = (a.x + b.x) / 2
    const my = (a.y + b.y) / 2
    // Bow each edge outward, away from the centre.
    const nx = mx - C
    const ny = my - C
    const len = Math.hypot(nx, ny) || 1
    return `M ${a.x} ${a.y} Q ${mx + (nx / len) * 46} ${my + (ny / len) * 46} ${b.x} ${b.y}`
  }

  return (
    <div ref={box} className="relative aspect-square w-full overflow-hidden rounded-[28px] border border-line bg-card/60 grid-paper">
      <div className="pointer-events-none absolute inset-x-5 top-4 flex justify-between font-mono text-[0.65rem] tracking-wider text-muted uppercase">
        <span>Fig. 01 — How I work</span>
        <span aria-hidden>
          x {offset.x.toFixed(2)} · y {offset.y.toFixed(2)}
        </span>
      </div>

      <svg viewBox="0 0 600 600" className="absolute inset-0 size-full" role="group" aria-label={`My process as a loop: ${WORDS.map((w) => w.text.toLowerCase()).join(', ')}. Select a stage to read about it.`}>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </marker>
        </defs>

        {/* Spokes to the centre */}
        {pos.map((p, i) => (
          <line
            key={`spoke-${i}`}
            x1={centre.x}
            y1={centre.y}
            x2={p.x}
            y2={p.y}
            stroke={activeIndex === i ? '#3657D6' : '#202124'}
            strokeOpacity={activeIndex === i ? 0.6 : 0.12}
            strokeDasharray="2 5"
          />
        ))}

        {/* The cycle */}
        {pos.map((p, i) => {
          const next = pos[(i + 1) % pos.length]
          const lit = activeIndex === i || activeIndex === (i + 1) % pos.length
          return (
            <path
              key={`edge-${i}`}
              d={curve(p, next)}
              fill="none"
              className={lit ? 'dash-flow' : undefined}
              stroke={lit ? '#F28B54' : '#202124'}
              strokeOpacity={lit ? 0.95 : 0.22}
              strokeWidth={lit ? 1.6 : 1}
              style={{ color: lit ? '#F28B54' : 'rgba(32,33,36,0.35)' }}
              markerEnd="url(#arrow)"
            />
          )
        })}

        <circle cx={centre.x} cy={centre.y} r={30} fill="#3657D6" />
        <circle cx={centre.x} cy={centre.y} r={44} fill="none" stroke="#3657D6" strokeOpacity={0.25} />
        <text x={centre.x} y={centre.y + 10} textAnchor="middle" fill="#F8F7F2" fontFamily="Space Grotesk Variable" fontSize="30" fontWeight="600" aria-hidden>
          ?
        </text>

        {WORDS.map((w, i) => {
          const p = pos[i]
          const isActive = activeIndex === i
          return (
            <g
              key={w.id}
              role="button"
              tabIndex={0}
              aria-label={`${w.text.toLowerCase()}: ${w.caption}`}
              className="cursor-pointer outline-none"
              onPointerEnter={() => setActive(w.id)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(w.id)}
              onBlur={() => setActive(null)}
              onClick={() => openStage(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openStage(i)
                }
              }}
            >
              <rect
                x={p.x - w.text.length * w.size * 0.33 - 14}
                y={p.y - w.size * 0.62}
                width={w.text.length * w.size * 0.66 + 28}
                height={w.size * 1.05}
                rx={w.size * 0.52}
                fill={isActive ? '#202124' : '#F8F7F2'}
                stroke={isActive ? '#202124' : 'transparent'}
                style={{ transition: 'fill 0.3s' }}
              />
              <text
                x={p.x}
                y={p.y + w.size * 0.3 - w.size * 0.1}
                textAnchor="middle"
                fontFamily="Space Grotesk Variable"
                fontWeight={600}
                fontSize={w.size}
                letterSpacing="-0.02em"
                fill={isActive ? '#F8F7F2' : w.color}
                style={{ transition: 'fill 0.3s' }}
              >
                {w.text}
              </text>
              <text x={p.x} y={p.y + w.size * 0.62 + 14} textAnchor="middle" fontFamily="JetBrains Mono Variable" fontSize="11" fill="#6b6b6b" aria-hidden>
                0{i + 1}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="pointer-events-none absolute inset-x-5 bottom-4 flex min-h-5 items-end justify-between gap-4 font-mono text-[0.7rem] text-ink/75" aria-live="polite">
        <span>{caption ? `${caption.text} → ${caption.caption}` : 'My process in five words. Click one.'}</span>
      </div>
    </div>
  )
}
