import type { MouseEvent } from 'react'
import type { Point } from '../../utils/regression'

const W = 640
const H = 380
const PAD = { l: 40, r: 16, t: 16, b: 32 }
const DOMAIN = 10

const sx = (x: number) => PAD.l + (x / DOMAIN) * (W - PAD.l - PAD.r)
const sy = (y: number) => H - PAD.b - (y / DOMAIN) * (H - PAD.t - PAD.b)
const clampY = (y: number) => Math.max(-50, Math.min(60, y)) // keep huge values drawable when diverging

type Props = {
  points: Point[]
  theta0: number
  theta1: number
  ols: { theta0: number; theta1: number }
  onAdd: (p: Point) => void
}

/** Scatter plot with the current hypothesis, its residuals and the least-squares target. Click to add a point. */
export function RegressionPlot({ points, theta0, theta1, ols, onAdd }: Props) {
  const finite = Number.isFinite(theta0) && Number.isFinite(theta1)
  const h = (x: number) => theta0 + theta1 * x

  const handleClick = (e: MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const local = pt.matrixTransform(svg.getScreenCTM()?.inverse())
    const x = ((local.x - PAD.l) / (W - PAD.l - PAD.r)) * DOMAIN
    const y = ((H - PAD.b - local.y) / (H - PAD.t - PAD.b)) * DOMAIN
    if (x < 0 || x > DOMAIN || y < 0 || y > DOMAIN) return
    onAdd({ x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 })
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full cursor-crosshair select-none"
      onClick={handleClick}
      role="img"
      aria-label={`Scatter plot of ${points.length} points with the current regression line y = ${theta0.toFixed(2)} + ${theta1.toFixed(2)}x. Click to add a point.`}
    >
      <defs>
        <clipPath id="plot-area">
          <rect x={PAD.l} y={PAD.t} width={W - PAD.l - PAD.r} height={H - PAD.t - PAD.b} />
        </clipPath>
      </defs>

      {Array.from({ length: DOMAIN + 1 }, (_, i) => (
        <g key={i}>
          <line x1={sx(i)} x2={sx(i)} y1={PAD.t} y2={H - PAD.b} stroke="#202124" strokeOpacity={i === 0 ? 0.5 : 0.06} />
          <line x1={PAD.l} x2={W - PAD.r} y1={sy(i)} y2={sy(i)} stroke="#202124" strokeOpacity={i === 0 ? 0.5 : 0.06} />
          {i % 2 === 0 && (
            <>
              <text x={sx(i)} y={H - PAD.b + 18} textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono Variable" fill="#6b6b6b">
                {i}
              </text>
              <text x={PAD.l - 10} y={sy(i) + 4} textAnchor="end" fontSize="11" fontFamily="JetBrains Mono Variable" fill="#6b6b6b">
                {i}
              </text>
            </>
          )}
        </g>
      ))}

      <g clipPath="url(#plot-area)">
        {/* Exact least-squares fit: where gradient descent should end up */}
        <line x1={sx(0)} y1={sy(ols.theta0)} x2={sx(DOMAIN)} y2={sy(ols.theta0 + ols.theta1 * DOMAIN)} stroke="#B6A6D9" strokeWidth={2} strokeDasharray="6 6" />

        {finite &&
          points.map((p, i) => (
            <line key={`res-${i}`} x1={sx(p.x)} y1={sy(p.y)} x2={sx(p.x)} y2={sy(clampY(h(p.x)))} stroke="#F28B54" strokeOpacity={0.55} strokeWidth={1} />
          ))}

        {finite && <line x1={sx(0)} y1={sy(clampY(h(0)))} x2={sx(DOMAIN)} y2={sy(clampY(h(DOMAIN)))} stroke="#3657D6" strokeWidth={2.5} />}
      </g>

      {points.map((p, i) => (
        <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={4.5} fill="#202124" stroke="#fff" strokeWidth={1.5} />
      ))}

      <g fontFamily="JetBrains Mono Variable" fontSize="11">
        <line x1={W - 210} x2={W - 190} y1={PAD.t + 12} y2={PAD.t + 12} stroke="#3657D6" strokeWidth={2.5} />
        <text x={W - 184} y={PAD.t + 16} fill="#202124">
          gradient descent
        </text>
        <line x1={W - 210} x2={W - 190} y1={PAD.t + 30} y2={PAD.t + 30} stroke="#B6A6D9" strokeWidth={2} strokeDasharray="4 4" />
        <text x={W - 184} y={PAD.t + 34} fill="#202124">
          least squares
        </text>
        <line x1={W - 200} x2={W - 200} y1={PAD.t + 42} y2={PAD.t + 54} stroke="#F28B54" />
        <text x={W - 184} y={PAD.t + 52} fill="#202124">
          residuals
        </text>
      </g>
    </svg>
  )
}
