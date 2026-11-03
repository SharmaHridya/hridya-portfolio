import { useReducedMotion } from 'framer-motion'
import { Pause, Play, RotateCcw, StepForward } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { cost, datasets, gradientDescent, leastSquares, type DatasetId, type Point } from '../../utils/regression'
import { cn } from '../../utils/format'
import { CostChart } from './CostChart'
import { RegressionPlot } from './RegressionPlot'

const LR_MIN = -3 // 10^-3
const LR_MAX = 0 // 10^0

export default function MLPlayground() {
  const reduced = useReducedMotion()
  const [datasetId, setDatasetId] = useState<DatasetId>('gentle')
  const [points, setPoints] = useState<Point[]>(() => datasets.gentle.make())
  const [lrExp, setLrExp] = useState(-1.7) // α ≈ 0.02
  const [iterations, setIterations] = useState(300)
  const [scale, setScale] = useState(false)
  const [frame, setFrame] = useState(Number.POSITIVE_INFINITY)
  const [playing, setPlaying] = useState(false)
  const raf = useRef(0)

  const learningRate = Number((10 ** lrExp).toPrecision(2))
  const run = useMemo(() => gradientDescent(points, { learningRate, iterations, scale }), [points, learningRate, iterations, scale])
  const ols = useMemo(() => leastSquares(points), [points])
  const last = run.steps.length - 1
  const shown = Math.min(frame, last)
  const step = run.steps[shown]

  // Any parameter change shows the end result immediately; "Animate" replays the descent.
  useEffect(() => {
    setFrame(Number.POSITIVE_INFINITY)
    setPlaying(false)
  }, [points, learningRate, iterations, scale])

  useEffect(() => {
    if (!playing) return
    if (reduced) {
      setFrame(last)
      setPlaying(false)
      return
    }
    const duration = Math.min(4000, 600 + last * 6)
    const start = performance.now()
    const tick = (now: number) => {
      // Ease-out so early iterations, where most of the change happens, get more time.
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      setFrame(Math.round(eased * last))
      if (t < 1) raf.current = requestAnimationFrame(tick)
      else setPlaying(false)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [playing, last, reduced])

  const chooseDataset = (id: DatasetId) => {
    setDatasetId(id)
    setPoints(datasets[id].make())
  }

  const fmt = (v: number, d = 3) => (Number.isFinite(v) ? v.toFixed(d) : '∞')

  return (
    <article aria-labelledby="ml-title" className="overflow-hidden rounded-[28px] border border-ink bg-card">
      <header className="grid gap-6 border-b border-line p-6 md:grid-cols-12 md:p-10">
        <div className="md:col-span-7">
          <p className="label mb-3">Lab experiment 01 · interactive</p>
          <h3 id="ml-title" className="text-[clamp(1.8rem,3.6vw,3rem)] font-semibold">
            Linear regression, <span className="serif-italic text-cobalt">one step at a time.</span>
          </h3>
        </div>
        <p className="text-ink/75 md:col-span-5 md:self-end">
          Gradient descent starts from θ = (0, 0) and walks downhill on the cost. Change the learning rate and iterations, toggle feature scaling, or click the
          plot to add points. The dashed line is the exact least-squares answer it should reach.
        </p>
      </header>

      <div className="grid lg:grid-cols-12">
        {/* Controls */}
        <div className="space-y-7 border-b border-line p-6 md:p-8 lg:col-span-4 lg:border-r lg:border-b-0">
          <fieldset>
            <legend className="label mb-2">Dataset</legend>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(datasets) as DatasetId[]).map((id) => (
                <button
                  key={id}
                  onClick={() => chooseDataset(id)}
                  aria-pressed={datasetId === id}
                  className={cn(
                    'rounded-full border px-3 py-1 text-sm transition-colors',
                    datasetId === id ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink/40',
                  )}
                >
                  {datasets[id].label}
                </button>
              ))}
            </div>
            <p className="mt-2 font-mono text-[0.68rem] text-muted">{points.length} points · click the plot to add more</p>
          </fieldset>

          <div>
            <label htmlFor="lr" className="flex items-baseline justify-between">
              <span className="label">Learning rate α</span>
              <span className="font-mono text-sm">{learningRate}</span>
            </label>
            <input
              id="lr"
              type="range"
              min={LR_MIN}
              max={LR_MAX}
              step={0.05}
              value={lrExp}
              onChange={(e) => setLrExp(Number(e.target.value))}
              aria-valuetext={`${learningRate}`}
              className="mt-2 w-full accent-cobalt"
            />
            <div className="flex justify-between font-mono text-[0.62rem] text-muted">
              <span>0.001</span>
              <span>log scale</span>
              <span>1</span>
            </div>
          </div>

          <div>
            <label htmlFor="iters" className="flex items-baseline justify-between">
              <span className="label">Iterations</span>
              <span className="font-mono text-sm">{iterations}</span>
            </label>
            <input
              id="iters"
              type="range"
              min={1}
              max={1000}
              step={1}
              value={iterations}
              onChange={(e) => setIterations(Number(e.target.value))}
              className="mt-2 w-full accent-cobalt"
            />
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" checked={scale} onChange={(e) => setScale(e.target.checked)} className="mt-1 size-4 accent-cobalt" />
            <span>
              <span className="font-medium">Feature scaling</span>
              <span className="block text-sm text-muted">Train on z-scored x, then convert θ back to the original units.</span>
            </span>
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                if (playing) {
                  setPlaying(false)
                  return
                }
                setFrame(0)
                setPlaying(true)
              }}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm text-paper transition-colors hover:bg-cobalt"
            >
              {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
              {playing ? 'Pause' : 'Animate descent'}
            </button>
            <button
              onClick={() => {
                setPlaying(false)
                setFrame((f) => (Math.min(f, last) >= last ? 0 : Math.min(f, last) + 1))
              }}
              className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 text-sm hover:border-ink"
              aria-label="Step one iteration"
            >
              <StepForward className="size-4" aria-hidden /> Step
            </button>
            <button
              onClick={() => chooseDataset(datasetId)}
              className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 text-sm hover:border-ink"
              aria-label="Reset the data points"
            >
              <RotateCcw className="size-4" aria-hidden /> Reset
            </button>
          </div>

          <div>
            <label htmlFor="scrub" className="flex items-baseline justify-between">
              <span className="label">Scrub through iterations</span>
              <span className="font-mono text-sm">
                {step.iter}/{last}
              </span>
            </label>
            <input
              id="scrub"
              type="range"
              min={0}
              max={last}
              value={shown}
              onChange={(e) => {
                setPlaying(false)
                setFrame(Number(e.target.value))
              }}
              className="mt-2 w-full accent-tangerine"
            />
          </div>
        </div>

        {/* Plots */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-2 gap-px border-b border-line bg-line sm:grid-cols-4" aria-live="polite">
            {[
              ['Iteration', `${step.iter}`],
              ['θ₀ (intercept)', fmt(step.theta0)],
              ['θ₁ (slope)', fmt(step.theta1)],
              ['Cost J(θ)', fmt(step.cost, 4)],
            ].map(([k, v]) => (
              <div key={k} className="bg-card px-5 py-4">
                <p className="label">{k}</p>
                <p className="mt-1 font-mono text-lg tabular-nums">{v}</p>
              </div>
            ))}
          </div>

          {run.diverged && (
            <p role="alert" className="border-b border-tangerine/40 bg-tangerine/10 px-6 py-3 text-sm text-[#7a3412]">
              <strong>Diverged.</strong> With α = {learningRate}
              {scale ? '' : ' on unscaled x'}, every step overshoots further and the cost explodes after {last} iterations.{' '}
              {scale ? 'Lower α.' : 'Turn on feature scaling or lower α.'}
            </p>
          )}

          <div className="p-4 md:p-6">
            <RegressionPlot
              points={points}
              theta0={step.theta0}
              theta1={step.theta1}
              ols={ols}
              onAdd={(p) => setPoints((ps) => (ps.length >= 80 ? ps : [...ps, p]))}
            />
          </div>

          <div className="border-t border-line p-4 md:p-6">
            <div className="mb-2 flex items-baseline justify-between">
              <p className="label">Cost over iterations</p>
              <p className="font-mono text-[0.68rem] text-muted">
                least-squares minimum J = {fmt(cost(points, ols.theta0, ols.theta1), 4)}
              </p>
            </div>
            <CostChart steps={run.steps} current={shown} />
          </div>

          <div className="grid gap-4 border-t border-line p-6 font-mono text-[0.75rem] text-ink/80 md:grid-cols-3">
            <p>
              <span className="text-muted">hypothesis</span>
              <br />
              h(x) = θ₀ + θ₁·x
            </p>
            <p>
              <span className="text-muted">cost</span>
              <br />
              J = 1/(2m) · Σ (h(xᵢ) − yᵢ)²
            </p>
            <p>
              <span className="text-muted">update (simultaneous)</span>
              <br />
              θⱼ := θⱼ − α · ∂J/∂θⱼ
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}

