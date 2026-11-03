import { useMemo, useState } from 'react'
import { Frame } from './Frame'

// Approximate positions of the five hotspots the simulator monitors (lon, lat).
const HOTSPOTS = [
  { name: 'Bawana', lon: 77.04, lat: 28.8 },
  { name: 'Najafgarh', lon: 76.98, lat: 28.61 },
  { name: 'Palam', lon: 77.09, lat: 28.57 },
  { name: 'Okhla', lon: 77.27, lat: 28.53 },
  { name: 'Badarpur', lon: 77.3, lat: 28.5 },
]
const BOUNDS = { lon: [76.9, 77.38], lat: [28.44, 28.86] }
const COLS = 24
const ROWS = 18

const toXY = (lon: number, lat: number) => ({
  x: ((lon - BOUNDS.lon[0]) / (BOUNDS.lon[1] - BOUNDS.lon[0])) * COLS,
  y: ((BOUNDS.lat[1] - lat) / (BOUNDS.lat[1] - BOUNDS.lat[0])) * ROWS,
})

const HEAT = ['#fbe9d9', '#f7c9a5', '#f2a578', '#F28B54', '#e0603a', '#b8402a']
const GREEN = ['#f2f1ea', '#dfe8cf', '#c3d9a8', '#9fc480', '#78ab5c', '#4f8a3e']

/**
 * A stylised field, not satellite data: temperature rises near each hotspot and
 * vegetation is roughly its inverse, so switching layers shows the relationship.
 */
export function HeatmapVisual() {
  const [layer, setLayer] = useState<'lst' | 'ndvi'>('lst')
  const [hover, setHover] = useState<string | null>(null)

  const field = useMemo(() => {
    const spots = HOTSPOTS.map((h) => toXY(h.lon, h.lat))
    return Array.from({ length: ROWS * COLS }, (_, i) => {
      const x = (i % COLS) + 0.5
      const y = Math.floor(i / COLS) + 0.5
      let v = 0.18 + 0.08 * Math.sin(x * 0.7) * Math.cos(y * 0.9)
      for (const s of spots) v += 0.75 * Math.exp(-((x - s.x) ** 2 + (y - s.y) ** 2) / 9)
      return Math.max(0, Math.min(0.999, v))
    })
  }, [])

  const palette = layer === 'lst' ? HEAT : GREEN

  return (
    <Frame title="uhi-simulator · delhi ncr" note="Illustrative">
      <div className="flex h-full flex-col bg-paper p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex gap-1 rounded-full bg-line/60 p-0.5 font-mono text-[0.62rem]" role="radiogroup" aria-label="Map layer">
            {(
              [
                ['lst', 'Land surface temp'],
                ['ndvi', 'NDVI green cover'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                role="radio"
                aria-checked={layer === id}
                onClick={() => setLayer(id)}
                className={`rounded-full px-2.5 py-1 transition-colors ${layer === id ? 'bg-card text-ink shadow-sm' : 'text-muted'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="hidden font-mono text-[0.6rem] text-muted sm:block">{hover ?? 'hover a hotspot'}</span>
        </div>
        <svg viewBox={`0 0 ${COLS} ${ROWS}`} className="min-h-0 w-full flex-1 rounded-lg" preserveAspectRatio="xMidYMid meet" role="img" aria-label={`Stylised ${layer === 'lst' ? 'temperature' : 'vegetation'} map of Delhi NCR with five hotspots`}>
          {field.map((v, i) => {
            const shade = layer === 'lst' ? v : 1 - v
            return (
              <rect
                key={i}
                x={i % COLS}
                y={Math.floor(i / COLS)}
                width={0.94}
                height={0.94}
                rx={0.12}
                fill={palette[Math.min(palette.length - 1, Math.floor(shade * palette.length))]}
                style={{ transition: 'fill 0.5s' }}
              />
            )
          })}
          {HOTSPOTS.map((h) => {
            const { x, y } = toXY(h.lon, h.lat)
            const on = hover === h.name
            return (
              <g key={h.name} onPointerEnter={() => setHover(h.name)} onPointerLeave={() => setHover(null)} className="cursor-pointer">
                <circle cx={x} cy={y} r={on ? 1.6 : 1.1} fill="none" stroke="#202124" strokeWidth={0.12} style={{ transition: 'r 0.3s' }} />
                <circle cx={x} cy={y} r={0.35} fill="#202124" />
                {on && (
                  <text x={x + 1.8} y={y + 0.35} fontSize={1} fontFamily="JetBrains Mono Variable" fill="#202124">
                    {h.name}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
        <div className="mt-2 flex items-center gap-2 font-mono text-[0.58rem] text-muted">
          <span>{layer === 'lst' ? 'cooler' : 'sparse'}</span>
          <span className="flex h-1.5 flex-1 overflow-hidden rounded-full">
            {palette.map((c) => (
              <span key={c} className="flex-1" style={{ background: c }} />
            ))}
          </span>
          <span>{layer === 'lst' ? 'hotter' : 'dense'}</span>
        </div>
      </div>
    </Frame>
  )
}
