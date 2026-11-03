import { motion } from 'framer-motion'
import { useState } from 'react'
import { rabbitHoles } from '../../data/interests'
import { cn } from '../../utils/format'
import { DraftBadge } from '../ui/Tag'
import { SubHeading } from './SubHeading'
import { WordsThatStayed } from './WordsThatStayed'

const CATEGORY_TINT: Record<string, string> = {
  Technology: '#3657D6',
  Science: '#F28B54',
  Ideas: '#B6A6D9',
  Experiment: '#202124',
  'Beyond engineering': '#7fa86b',
}

// Slight, fixed rotations give the scrapbook its pinned-paper feel without randomness between renders.
const TILT = [-1.2, 0.8, -0.4, 1.1, -0.9, 0.5]

export function RabbitHoles() {
  // "Beyond engineering" is the book of quotations below, not a scrapbook entry.
  const categories = ['All', ...new Set(rabbitHoles.map((r) => r.category)), 'Beyond engineering']
  const [cat, setCat] = useState('All')
  const list = cat === 'All' ? rabbitHoles : rabbitHoles.filter((r) => r.category === cat)

  return (
    <div>
      <SubHeading
        letter="C"
        kicker="The curious one"
        title={
          <>
            Things that send me down <span className="serif-italic">rabbit holes.</span>
          </>
        }
      />

      <div className="mb-8 flex flex-wrap gap-1.5" role="group" aria-label="Filter entries by category">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            aria-pressed={cat === c}
            className={cn('rounded-full border px-3 py-1 font-mono text-xs transition-colors', cat === c ? 'border-ink bg-ink text-paper' : 'border-ink/15 hover:border-ink/50')}
          >
            {c}
          </button>
        ))}
      </div>

      {(cat === 'All' || cat === 'Beyond engineering') && <WordsThatStayed />}

      <ul className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {list.map((r, i) => (
          <motion.li
            key={r.title}
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ rotate: 0, y: -3 }}
            style={{ rotate: TILT[i % TILT.length] }}
            className={cn(
              'mb-5 break-inside-avoid rounded-2xl border p-6',
              r.placeholder ? 'border-dashed border-ink/30 bg-transparent' : 'border-line bg-card shadow-[0_18px_40px_-30px_rgba(32,33,36,0.4)]',
            )}
          >
            <div className="flex items-center justify-between gap-3 font-mono text-[0.68rem]">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ background: CATEGORY_TINT[r.category] }} aria-hidden />
                {r.category}
              </span>
              <span className="text-muted">{r.date}</span>
            </div>
            <h4 className="mt-4 text-xl leading-snug font-semibold">{r.title}</h4>
            <p className="mt-2 text-sm text-ink/75">{r.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {r.resource && (
                <a href={r.resource.url} target="_blank" rel="noopener noreferrer" className="link-underline text-sm text-cobalt-deep">
                  {r.resource.label} ↗<span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
              {r.placeholder && <DraftBadge>Add an entry</DraftBadge>}
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
