import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { Frame } from './Frame'

// Illustrative queries with real HSN headings; bar lengths are not model scores.
const QUERIES = [
  {
    q: 'stainless steel insulated water bottle',
    results: [
      { code: '9617', label: 'Vacuum flasks and other vacuum vessels', w: 0.92 },
      { code: '7323', label: 'Household articles of iron or steel', w: 0.78 },
      { code: '3924', label: 'Household articles of plastics', w: 0.41 },
    ],
    verdict: 'Top match is clear',
  },
  {
    q: 'cotton t-shirt, printed',
    results: [
      { code: '6109', label: 'T-shirts, singlets, knitted or crocheted', w: 0.9 },
      { code: '6205', label: 'Men’s shirts, not knitted', w: 0.55 },
      { code: '6206', label: 'Women’s blouses and shirts, not knitted', w: 0.5 },
    ],
    verdict: 'Top match is clear',
  },
  {
    q: 'thing for the kitchen',
    results: [
      { code: '—', label: 'Too vague to classify', w: 0.18 },
      { code: '', label: '', w: 0 },
      { code: '', label: '', w: 0 },
    ],
    verdict: 'Below threshold → unable to classify',
  },
]

export function HsnVisual() {
  const [i, setI] = useState(0)
  const current = QUERIES[i]

  return (
    <Frame title="hsn-matcher · classify" note="Illustrative">
      <div className="flex h-full flex-col bg-paper p-4">
        <button
          onClick={() => setI((v) => (v + 1) % QUERIES.length)}
          className="flex items-center gap-2 rounded-xl border border-line bg-card px-3 py-2.5 text-left text-[0.78rem] transition-colors hover:border-ink"
          aria-label="Try another example description"
        >
          <Search className="size-3.5 shrink-0 text-muted" aria-hidden />
          <motion.span key={current.q} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 truncate">
            {current.q}
          </motion.span>
          <span className="shrink-0 font-mono text-[0.58rem] text-muted">next ↻</span>
        </button>

        <div className="mt-3 flex items-center gap-2 font-mono text-[0.6rem] text-muted" aria-hidden>
          <span>embed</span>→<span>pgvector top-k</span>→<span>gate</span>→<span className="text-ink">LLM rerank</span>
        </div>

        <ol className="mt-4 flex-1 space-y-2.5">
          {current.results.map((r, k) => (
            <li key={`${i}-${k}`} className={`rounded-lg border border-line bg-card p-2.5 ${r.w === 0 ? 'opacity-0' : ''}`}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-[0.75rem] font-semibold">{r.code}</span>
                <span className="font-mono text-[0.58rem] text-muted">#{k + 1}</span>
              </div>
              <p className="truncate text-[0.68rem] text-ink/75">{r.label}</p>
              <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-line">
                <motion.span
                  className="block h-full rounded-full"
                  style={{ background: k === 0 ? '#3657D6' : '#B6A6D9' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${r.w * 100}%` }}
                  transition={{ duration: 0.7, delay: k * 0.08 }}
                />
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-3 font-mono text-[0.62rem] text-cobalt-deep" aria-live="polite">
          {current.verdict}
        </p>
      </div>
    </Frame>
  )
}
