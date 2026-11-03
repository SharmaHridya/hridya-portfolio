// Batch gradient descent for single-variable linear regression.
//   hypothesis  h(x) = θ0 + θ1·x
//   cost        J(θ) = 1/(2m) · Σ (h(xᵢ) − yᵢ)²
//   gradients   ∂J/∂θ0 = 1/m · Σ (h(xᵢ) − yᵢ)
//               ∂J/∂θ1 = 1/m · Σ (h(xᵢ) − yᵢ)·xᵢ
//   update      θj := θj − α·∂J/∂θj   (both parameters updated simultaneously)

export type Point = { x: number; y: number }

export type Step = { iter: number; theta0: number; theta1: number; cost: number }

export type RunOptions = { learningRate: number; iterations: number; scale: boolean }

export type RunResult = { steps: Step[]; diverged: boolean }

export function cost(points: Point[], theta0: number, theta1: number): number {
  const m = points.length
  let sum = 0
  for (const p of points) {
    const e = theta0 + theta1 * p.x - p.y
    sum += e * e
  }
  return sum / (2 * m)
}

/**
 * Runs gradient descent and records every iteration. Parameters and cost are always
 * reported in the original units, even when training on z-score scaled x.
 */
export function gradientDescent(points: Point[], { learningRate, iterations, scale }: RunOptions): RunResult {
  const m = points.length
  if (m === 0) return { steps: [], diverged: false }

  const mean = points.reduce((s, p) => s + p.x, 0) / m
  const std = Math.sqrt(points.reduce((s, p) => s + (p.x - mean) ** 2, 0) / m) || 1
  const xs = points.map((p) => (scale ? (p.x - mean) / std : p.x))
  const ys = points.map((p) => p.y)

  // Convert parameters learned on scaled x back to the original x axis:
  // θ0' + θ1'·(x − μ)/σ  =  (θ0' − θ1'·μ/σ) + (θ1'/σ)·x
  const toOriginal = (t0: number, t1: number): [number, number] => (scale ? [t0 - (t1 * mean) / std, t1 / std] : [t0, t1])

  let t0 = 0
  let t1 = 0
  const steps: Step[] = [{ iter: 0, theta0: 0, theta1: 0, cost: cost(points, 0, 0) }]

  for (let i = 1; i <= iterations; i++) {
    let g0 = 0
    let g1 = 0
    for (let k = 0; k < m; k++) {
      const e = t0 + t1 * xs[k] - ys[k]
      g0 += e
      g1 += e * xs[k]
    }
    t0 -= (learningRate * g0) / m
    t1 -= (learningRate * g1) / m

    const [o0, o1] = toOriginal(t0, t1)
    const c = cost(points, o0, o1)
    if (!Number.isFinite(c) || c > 1e12) {
      steps.push({ iter: i, theta0: o0, theta1: o1, cost: Number.POSITIVE_INFINITY })
      return { steps, diverged: true }
    }
    steps.push({ iter: i, theta0: o0, theta1: o1, cost: c })
  }
  return { steps, diverged: false }
}

/** Closed-form least-squares fit, drawn as the target gradient descent should approach. */
export function leastSquares(points: Point[]): { theta0: number; theta1: number } {
  const m = points.length
  const mx = points.reduce((s, p) => s + p.x, 0) / m
  const my = points.reduce((s, p) => s + p.y, 0) / m
  let sxy = 0
  let sxx = 0
  for (const p of points) {
    sxy += (p.x - mx) * (p.y - my)
    sxx += (p.x - mx) ** 2
  }
  const theta1 = sxx === 0 ? 0 : sxy / sxx
  return { theta0: my - theta1 * mx, theta1 }
}

/** Deterministic pseudo-random generator so the sample datasets are stable between visits. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type DatasetId = 'gentle' | 'noisy' | 'steep'

export const datasets: Record<DatasetId, { label: string; make: () => Point[] }> = {
  gentle: { label: 'Gentle slope', make: () => sample(1, 18, 1.5, 0.6, 0.6) },
  noisy: { label: 'Noisy', make: () => sample(7, 24, 2.5, 0.45, 1.6) },
  steep: { label: 'Steep', make: () => sample(3, 16, 0.5, 0.9, 0.5) },
}

function sample(seed: number, n: number, intercept: number, slope: number, noise: number): Point[] {
  const rand = mulberry32(seed)
  return Array.from({ length: n }, () => {
    const x = 0.5 + rand() * 9
    const gaussian = Math.sqrt(-2 * Math.log(rand() || 1e-9)) * Math.cos(2 * Math.PI * rand())
    return { x: round(x), y: round(Math.max(0, Math.min(10, intercept + slope * x + gaussian * noise))) }
  })
}

const round = (v: number) => Math.round(v * 100) / 100
