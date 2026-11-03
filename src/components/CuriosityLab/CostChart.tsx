import { useMemo } from 'react'
import { CartesianGrid, Line, LineChart, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Step } from '../../utils/regression'

const MAX_POINTS = 240

/** Cost J(θ) per iteration (down-sampled for long runs), with a marker at the iteration being shown. */
export function CostChart({ steps, current }: { steps: Step[]; current: number }) {
  const data = useMemo(() => {
    const finite = steps.filter((s) => Number.isFinite(s.cost))
    const every = Math.max(1, Math.ceil(finite.length / MAX_POINTS))
    return finite.filter((_, i) => i % every === 0 || i === finite.length - 1).map((s) => ({ iter: s.iter, cost: s.cost }))
  }, [steps])

  const marker = steps[current]
  return (
    <div className="h-48 w-full" role="img" aria-label={`Cost falls from ${steps[0]?.cost.toFixed(2)} to ${data.at(-1)?.cost.toFixed(4)} over ${steps.length - 1} iterations.`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
          <CartesianGrid stroke="#202124" strokeOpacity={0.06} vertical={false} />
          <XAxis dataKey="iter" type="number" domain={[0, 'dataMax']} tick={{ fontSize: 11, fontFamily: 'JetBrains Mono Variable', fill: '#6b6b6b' }} tickLine={false} axisLine={{ stroke: '#E5E5E0' }} />
          <YAxis
            width={52}
            tick={{ fontSize: 11, fontFamily: 'JetBrains Mono Variable', fill: '#6b6b6b' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => (v >= 1000 ? v.toExponential(0) : v.toFixed(v < 1 ? 2 : 1))}
          />
          <Tooltip
            formatter={(v) => [Number(v).toFixed(4), 'J(θ)']}
            labelFormatter={(l) => `iteration ${l}`}
            contentStyle={{ fontFamily: 'JetBrains Mono Variable', fontSize: 12, borderRadius: 10, border: '1px solid #E5E5E0' }}
          />
          <Line type="monotone" dataKey="cost" stroke="#202124" strokeWidth={2} dot={false} isAnimationActive={false} />
          {marker && Number.isFinite(marker.cost) && <ReferenceDot x={marker.iter} y={marker.cost} r={5} fill="#F28B54" stroke="#fff" strokeWidth={2} />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
