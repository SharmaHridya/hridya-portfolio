import { motion, useReducedMotion } from 'framer-motion'
import type { SlideDiagramKind } from '../../data/slides'

// A cost curve J(x) drawn as a valley: y(x) = BOTTOM − K·(x − MID)² in SVG coordinates,
// so the "height" above the bottom is K·(x − MID)² and its slope is 2K·(x − MID).
const W = 320
const H = 220
const MID = 160
const BOTTOM = 185
const K = 0.0075
const y = (x: number) => BOTTOM - K * (x - MID) ** 2
const slope = (x: number) => -2 * K * (x - MID) // dy/dx in SVG space

const CURVE = Array.from({ length: 29 }, (_, i) => {
  const x = 20 + i * 10
  return `${i ? 'L' : 'M'}${x} ${y(x).toFixed(1)}`
}).join(' ')

/**
 * Real gradient descent on the drawn curve: x ← x − α·∂J/∂x, where ∂J/∂x = 2K(x − MID).
 * `rate` is α·2K, so each step multiplies the distance to the bottom by (1 − rate).
 */
function descend(start: number, rate: number, steps: number): { x: number; y: number }[] {
  const pts = [{ x: start, y: y(start) }]
  let x = start
  for (let i = 0; i < steps; i++) {
    x = x - rate * (x - MID)
    pts.push({ x, y: y(x) })
  }
  return pts
}
const toPath = (pts: { x: number; y: number }[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${(p.y - 6).toFixed(1)}`).join(' ')

/** A five-pointed star outline centred on (cx, cy). */
function star(cx: number, cy: number, r: number): string {
  return (
    Array.from({ length: 10 }, (_, i) => {
      const a = -Math.PI / 2 + (i * Math.PI) / 5
      const rr = i % 2 ? r * 0.45 : r
      return `${i ? 'L' : 'M'}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`
    }).join(' ') + ' Z'
  )
}

const INK = '#202124'
const MUTED = '#9a9a94'

type Props = { kind: SlideDiagramKind; shown: number; accent: string }

/** The hand-drawn diagram beside each slide; it advances one stage per revealed point. */
export function SlideDiagram({ kind, shown, accent }: Props) {
  const reduced = useReducedMotion()
  const draw = { initial: { pathLength: reduced ? 1 : 0 }, animate: { pathLength: 1 }, transition: { duration: 0.8, ease: 'easeInOut' as const } }
  const fade = { initial: { opacity: reduced ? 1 : 0 }, animate: { opacity: 1 }, transition: { duration: 0.4, delay: 0.2 } }
  const color = accent === INK ? '#3657D6' : accent

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full max-h-[300px] w-full overflow-visible" role="img" aria-label={describe(kind, shown)}>
      {/* Axes */}
      <path d={`M14 14 L14 ${H - 14} L${W - 8} ${H - 14}`} fill="none" stroke={INK} strokeOpacity={0.35} strokeWidth={1.2} strokeLinecap="round" />
      <text x={20} y={22} fontSize={11} fontFamily="Caveat Variable" fill={INK} fillOpacity={0.6}>
        cost J(θ)
      </text>
      <text x={W - 14} y={H - 20} fontSize={11} textAnchor="end" fontFamily="Caveat Variable" fill={INK} fillOpacity={0.6}>
        θ
      </text>

      {/* The valley is always there */}
      <motion.path d={CURVE} fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" {...draw} />

      {kind === 'valley' && <Valley shown={shown} color={color} fade={fade} />}
      {kind === 'slope' && <Slope shown={shown} color={color} fade={fade} />}
      {kind === 'stepsize' && <StepSize shown={shown} color={color} />}
      {kind === 'repeat' && <Repeat shown={shown} color={color} fade={fade} />}
    </svg>
  )
}

type Fade = { initial: { opacity: number }; animate: { opacity: number }; transition: object }

function Ball({ x, color }: { x: number; color: string }) {
  return (
    <motion.circle r={7} fill={color} stroke="#fff" strokeWidth={2} initial={false} animate={{ cx: x, cy: y(x) - 7 }} transition={{ type: 'spring', stiffness: 140, damping: 16 }} />
  )
}

function Valley({ shown, color, fade }: { shown: number; color: string; fade: Fade }) {
  const x = 52
  return (
    <g>
      {shown >= 1 && <Ball x={x} color={color} />}
      {shown >= 2 && (
        <motion.g {...fade}>
          <line x1={x} y1={y(x)} x2={x} y2={BOTTOM} stroke={color} strokeDasharray="4 4" strokeWidth={1.5} />
          <text x={x + 8} y={BOTTOM - 8} fontSize={14} fontFamily="Caveat Variable" fill={color}>
            how wrong
          </text>
        </motion.g>
      )}
      {shown >= 3 && (
        <motion.g {...fade}>
          <path d={star(MID, BOTTOM - 18, 10)} fill="none" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
          <text x={MID} y={BOTTOM - 36} textAnchor="middle" fontSize={14} fontFamily="Caveat Variable" fill={INK}>
            best θ
          </text>
        </motion.g>
      )}
    </g>
  )
}

function Slope({ shown, color, fade }: { shown: number; color: string; fade: Fade }) {
  const x0 = 50
  const x1 = x0 - 0.35 * (x0 - MID) // one gradient step
  const m = slope(x0)
  const len = 46
  const dx = len / Math.sqrt(1 + m * m)
  return (
    <g>
      {shown >= 1 && <Ball x={shown >= 3 ? x1 : x0} color={color} />}
      {shown >= 2 && (
        <motion.g {...fade}>
          <line x1={x0 - dx} y1={y(x0) - m * dx - 12} x2={x0 + dx} y2={y(x0) + m * dx - 12} stroke={INK} strokeWidth={1.4} strokeDasharray="5 4" />
          <text x={x0 + dx + 4} y={y(x0) + m * dx - 14} fontSize={14} fontFamily="Caveat Variable" fill={INK}>
            slope
          </text>
        </motion.g>
      )}
      {shown >= 3 && (
        <motion.path
          d={`M${x0 + 4} ${y(x0) - 26} Q ${(x0 + x1) / 2} ${y(x0) - 46}, ${x1 - 6} ${y(x1) - 22}`}
          fill="none"
          stroke={color}
          strokeWidth={1.8}
          markerEnd="url(#slide-arrow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6 }}
        />
      )}
      <defs>
        <marker id="slide-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 1 L8 5 L0 9" fill="none" stroke={color} strokeWidth={1.6} />
        </marker>
      </defs>
    </g>
  )
}

function Trail({ pts, color, delay = 0 }: { pts: { x: number; y: number }[]; color: string; delay?: number }) {
  return (
    <g>
      <motion.path
        d={toPath(pts)}
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, delay, ease: 'easeInOut' }}
      />
      {pts.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y - 6}
          r={i === pts.length - 1 ? 4.5 : 2.6}
          fill={color}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + (i / pts.length) * 1.1 }}
        />
      ))}
    </g>
  )
}

function StepSize({ shown, color }: { shown: number; color: string }) {
  const start = 40
  return (
    <g>
      {shown >= 1 && <Trail pts={descend(start, 0.06, 7)} color={MUTED} />}
      {shown >= 2 && <Trail pts={descend(start, 1.82, 6)} color="#F28B54" />}
      {shown >= 3 && <Trail pts={descend(start, 0.55, 5)} color={color === '#B6A6D9' ? '#3657D6' : color} />}
    </g>
  )
}

function Repeat({ shown, color, fade }: { shown: number; color: string; fade: Fade }) {
  const pts = descend(36, 0.33, 9)
  return (
    <g>
      {shown >= 1 && <Trail pts={pts.slice(0, 4)} color={color} />}
      {shown >= 2 && <Trail pts={pts.slice(3)} color={color} delay={0} />}
      {shown >= 3 && (
        <motion.text {...fade} x={MID} y={BOTTOM - 30} textAnchor="middle" fontSize={15} fontFamily="Caveat Variable" fill={INK}>
          learned ✓
        </motion.text>
      )}
    </g>
  )
}

function describe(kind: SlideDiagramKind, shown: number): string {
  const base = 'A U-shaped cost curve.'
  if (kind === 'valley') return `${base} ${shown >= 1 ? 'A ball sits high on the left side. ' : ''}${shown >= 3 ? 'The lowest point is marked as the best θ.' : ''}`
  if (kind === 'slope') return `${base} ${shown >= 2 ? 'A dashed tangent shows the slope at the ball. ' : ''}${shown >= 3 ? 'The ball has taken one step downhill.' : ''}`
  if (kind === 'stepsize') return `${base} Paths for a tiny step size that crawls, a large one that zigzags across the valley, and a well-chosen one that settles.`
  return `${base} A ball takes repeated steps down the curve; each step is shorter than the last until it stops at the bottom.`
}
