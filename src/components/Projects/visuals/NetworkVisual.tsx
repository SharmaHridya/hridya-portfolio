import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Frame } from './Frame'

const NODES = [
  { id: 'L1', x: 150, y: 60 },
  { id: 'L2', x: 250, y: 120 },
  { id: 'L3', x: 220, y: 230 },
  { id: 'L4', x: 85, y: 230 },
  { id: 'L5', x: 50, y: 120 },
]
const CHUNKS = [
  { id: 'A', color: '#3657D6', home: [0, 1, 2] },
  { id: 'B', color: '#F28B54', home: [1, 3, 4] },
  { id: 'C', color: '#B6A6D9', home: [0, 2, 4] },
]

/**
 * Click a laptop to switch it off. Every chunk it held is copied from a survivor to a
 * live laptop that doesn't have it yet, so each chunk stays at three copies.
 */
export function NetworkVisual() {
  const [down, setDown] = useState<number[]>([])

  const { holders, repairs } = useMemo(() => {
    const repairs: { from: number; to: number; color: string }[] = []
    const holders = CHUNKS.map((c) => {
      const alive = c.home.filter((n) => !down.includes(n))
      const result = [...alive]
      for (let n = 0; n < NODES.length && result.length < 3; n++) {
        if (!down.includes(n) && !result.includes(n)) {
          repairs.push({ from: alive[0], to: n, color: c.color })
          result.push(n)
        }
      }
      return result
    })
    return { holders, repairs }
  }, [down])

  const toggle = (i: number) =>
    setDown((d) => (d.includes(i) ? d.filter((n) => n !== i) : d.length >= 2 ? d : [...d, i]))

  const status = down.length === 0 ? 'All laptops up · 3 copies each' : `${down.map((n) => NODES[n].id).join(', ')} off · copies repaired on survivors`

  return (
    <Frame title="minimol · 5-node cluster" note="Click a laptop">
      <div className="flex h-full flex-col bg-paper p-3">
        <svg viewBox="0 0 300 290" className="min-h-0 w-full flex-1" role="group" aria-label="Peer-to-peer cluster. Switch laptops off to see chunks repaired.">
          {NODES.flatMap((a, i) =>
            NODES.slice(i + 1).map((b, k) => {
              const j = i + 1 + k
              const dead = down.includes(i) || down.includes(j)
              return (
                <line
                  key={`${i}-${j}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="#202124"
                  strokeOpacity={dead ? 0.05 : 0.14}
                  strokeDasharray={dead ? '2 4' : undefined}
                />
              )
            }),
          )}
          {repairs.map((r, k) => (
            <motion.line
              key={`r-${k}-${r.to}`}
              x1={NODES[r.from].x}
              y1={NODES[r.from].y}
              x2={NODES[r.to].x}
              y2={NODES[r.to].y}
              stroke={r.color}
              strokeWidth={2}
              className="dash-flow"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6 }}
            />
          ))}
          {NODES.map((n, i) => {
            const off = down.includes(i)
            const held = CHUNKS.filter((_, c) => holders[c].includes(i))
            return (
              <g
                key={n.id}
                role="button"
                tabIndex={0}
                aria-pressed={off}
                aria-label={`Laptop ${n.id}, ${off ? 'off' : 'on'}. Holds chunks ${held.map((c) => c.id).join(', ') || 'none'}.`}
                onClick={() => toggle(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    toggle(i)
                  }
                }}
                className="cursor-pointer outline-none"
              >
                <rect
                  x={n.x - 26}
                  y={n.y - 17}
                  width={52}
                  height={34}
                  rx={7}
                  fill={off ? '#F0EEE6' : '#FFFFFF'}
                  stroke={off ? '#b9b9b2' : '#202124'}
                  strokeDasharray={off ? '3 3' : undefined}
                />
                <text x={n.x} y={n.y - 2} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono Variable" fill={off ? '#9a9a94' : '#202124'}>
                  {n.id}
                </text>
                <g transform={`translate(${n.x - 15}, ${n.y + 4})`}>
                  {held.map((c, k) => (
                    <motion.rect key={c.id} layout x={k * 11} width={8} height={8} rx={1.5} fill={c.color} initial={{ scale: 0 }} animate={{ scale: 1 }} />
                  ))}
                </g>
              </g>
            )
          })}
        </svg>
        <div className="flex items-center justify-between gap-2 px-1 font-mono text-[0.62rem]">
          <span className="text-ink/75" aria-live="polite">
            {status}
          </span>
          {down.length > 0 && (
            <button onClick={() => setDown([])} className="shrink-0 rounded-full border border-line px-2 py-0.5 hover:border-ink">
              Reset
            </button>
          )}
        </div>
      </div>
    </Frame>
  )
}
