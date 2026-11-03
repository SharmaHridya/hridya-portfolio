import { motion } from 'framer-motion'
import { useState } from 'react'
import { Frame } from './Frame'

const POSTS = [
  { title: 'Notes on state management', mins: 4, tint: '#F28B54' },
  { title: 'A week with Appwrite', mins: 6, tint: '#3657D6' },
  { title: 'Writing for the web', mins: 3, tint: '#B6A6D9' },
]

/** A miniature Inkwell: switch feeds, pick a post, and the reading pane follows. */
export function InkwellVisual() {
  const [feed, setFeed] = useState<'community' | 'yours'>('community')
  const [selected, setSelected] = useState(0)
  const posts = feed === 'community' ? POSTS : POSTS.slice(1, 2)

  return (
    <Frame title="inkwell · read & write" note="Try it">
      <div className="grid h-full grid-cols-5 bg-paper">
        <div className="col-span-2 border-r border-line p-3">
          <div className="mb-3 flex gap-1 rounded-full bg-line/60 p-0.5 font-mono text-[0.6rem]" role="tablist" aria-label="Feed">
            {(['community', 'yours'] as const).map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={feed === f}
                onClick={() => {
                  setFeed(f)
                  setSelected(0)
                }}
                className={`flex-1 rounded-full px-2 py-1 capitalize transition-colors ${feed === f ? 'bg-card text-ink shadow-sm' : 'text-muted'}`}
              >
                {f === 'yours' ? 'Your posts' : 'Community'}
              </button>
            ))}
          </div>
          <ul className="space-y-2">
            {posts.map((p, i) => (
              <li key={p.title}>
                <button
                  onClick={() => setSelected(i)}
                  className={`w-full rounded-lg border p-2 text-left transition-all ${selected === i ? 'border-ink bg-card' : 'border-line bg-card/60 hover:border-ink/40'}`}
                >
                  <span className="mb-1.5 block h-8 rounded" style={{ background: `${p.tint}33` }} aria-hidden />
                  <span className="block text-[0.68rem] leading-tight font-medium">{p.title}</span>
                  <span className="font-mono text-[0.58rem] text-muted">{p.mins} min read</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <motion.article key={`${feed}-${selected}`} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="col-span-3 p-4">
          <span className="mb-3 block h-16 rounded-lg" style={{ background: `${posts[selected].tint}2e` }} aria-hidden />
          <h4 className="font-display text-base leading-tight font-semibold">{posts[selected].title}</h4>
          <p className="mt-1 font-mono text-[0.6rem] text-muted">{posts[selected].mins} min read · rich text</p>
          <div className="mt-3 space-y-1.5" aria-hidden>
            {[92, 100, 84, 96, 60].map((w, i) => (
              <span key={i} className="block h-1.5 rounded-full bg-ink/10" style={{ width: `${w}%` }} />
            ))}
          </div>
          <div className="mt-4 flex items-center gap-1 font-mono text-[0.62rem] text-ink/70">
            <span>Draft</span>
            <span className="h-3 w-px animate-pulse bg-ink" aria-hidden />
          </div>
        </motion.article>
      </div>
    </Frame>
  )
}
