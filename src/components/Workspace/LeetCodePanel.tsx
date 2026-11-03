import { profile } from '../../data/profile'
import { useJson } from '../../hooks/useJson'
import { timeAgo } from '../../utils/format'
import { LeetCodeIcon } from '../ui/BrandIcons'
import { DarkSkeleton, ErrorState } from './States'
import type { LeetCodeData } from './types'

const DIFFICULTY = [
  { key: 'easy', label: 'Easy', color: '#7fc8a9' },
  { key: 'medium', label: 'Medium', color: '#F28B54' },
  { key: 'hard', label: 'Hard', color: '#e2607a' },
] as const

export function LeetCodePanel() {
  const { data, error, loading, reload } = useJson<LeetCodeData>('/api/leetcode', { pollMs: 10 * 60_000 })

  if (error && !data) return <ErrorState message={error} onRetry={reload} dark />

  return (
    <div className="rounded-[22px] border border-paper/15 bg-paper/[0.03] p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <a href={profile.links.leetcode} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3">
          <LeetCodeIcon className="size-6 text-tangerine" />
          <span>
            <span className="block font-display text-xl font-semibold group-hover:text-tangerine">Problem-solving log</span>
            <span className="font-mono text-xs text-paper/55">leetcode.com/u/{profile.leetcodeUser} ↗</span>
          </span>
        </a>
        <p className="font-mono text-[0.65rem] text-paper/50">live · refreshed every 10 min</p>
      </div>

      {loading && !data ? (
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <DarkSkeleton className="h-44" />
          <DarkSkeleton className="h-44" />
          <DarkSkeleton className="h-44" />
        </div>
      ) : data ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="flex items-center gap-6 lg:col-span-4">
            <Donut data={data} />
            <ul className="flex-1 space-y-3">
              {DIFFICULTY.map((d) => (
                <li key={d.key}>
                  <div className="flex items-baseline justify-between font-mono text-xs">
                    <span style={{ color: d.color }}>{d.label}</span>
                    <span className="text-paper/70">
                      <span className="text-paper">{data.solved[d.key]}</span> / {data.totals[d.key]}
                    </span>
                  </div>
                  <span className="mt-1 block h-1 overflow-hidden rounded-full bg-paper/10">
                    <span className="block h-full rounded-full" style={{ width: `${(data.solved[d.key] / data.totals[d.key]) * 100}%`, background: d.color }} />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <dl className="grid grid-cols-2 gap-4 lg:col-span-3">
            <Stat label="contest rating" value={data.contest ? data.contest.rating.toLocaleString() : 'Unrated'} hint={data.contest ? `${data.contest.attended} contests · top ${data.contest.topPercentage}%` : 'no rated contests yet'} />
            <Stat label="global rank" value={`#${data.ranking.toLocaleString()}`} />
            <Stat label="current streak" value={`${data.streak}d`} />
            <Stat label="active days" value={data.activeDays} hint="this year" />
            <div className="col-span-2">
              <dt className="font-mono text-[0.65rem] text-paper/55">languages</dt>
              <dd className="mt-1 font-mono text-xs text-paper/85">{data.languages.map((l) => `${l.name} ${l.solved}`).join(' · ')}</dd>
            </div>
          </dl>

          <div className="lg:col-span-5">
            <p className="font-mono text-[0.65rem] text-paper/55">topics covered · problems solved</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {data.topics.slice(0, 22).map((t) => (
                <li key={t.slug}>
                  <a
                    href={`https://leetcode.com/tag/${t.slug}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-paper/15 px-2.5 py-1 text-xs transition-colors hover:border-paper/50"
                    style={{ background: `rgba(54,87,214,${Math.min(0.55, 0.06 + t.solved / 250)})` }}
                  >
                    {t.name}
                    <span className="font-mono text-[0.62rem] text-paper/60">{t.solved}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-12">
            <p className="font-mono text-[0.65rem] text-paper/55">recently accepted</p>
            <ul className="mt-2 grid gap-px overflow-hidden rounded-xl border border-paper/10 bg-paper/10 sm:grid-cols-2 lg:grid-cols-4">
              {data.recent.slice(0, 4).map((r) => (
                <li key={r.url + r.date} className="bg-ink">
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="block h-full px-4 py-3 transition-colors hover:bg-paper/5">
                    <span className="line-clamp-1 text-sm">{r.title}</span>
                    <time dateTime={r.date} className="font-mono text-[0.62rem] text-paper/50">
                      {timeAgo(r.date)}
                    </time>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div>
      <dt className="font-mono text-[0.65rem] text-paper/55">{label}</dt>
      <dd className="font-display text-2xl font-semibold tabular-nums">{value}</dd>
      {hint && <dd className="font-mono text-[0.6rem] text-paper/45">{hint}</dd>}
    </div>
  )
}

function Donut({ data }: { data: LeetCodeData }) {
  const r = 46
  const c = 2 * Math.PI * r
  let offset = 0
  return (
    <svg viewBox="0 0 120 120" className="size-32 shrink-0" role="img" aria-label={`${data.solved.all} of ${data.totals.all} problems solved`}>
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(248,247,242,0.1)" strokeWidth="8" />
      {DIFFICULTY.map((d) => {
        const len = (data.solved[d.key] / data.totals.all) * c
        const el = (
          <circle
            key={d.key}
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={d.color}
            strokeWidth="8"
            strokeDasharray={`${len} ${c - len}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 60 60)"
          />
        )
        offset += len
        return el
      })}
      <text x="60" y="60" textAnchor="middle" fill="#F8F7F2" fontFamily="Space Grotesk Variable" fontSize="26" fontWeight="600">
        {data.solved.all}
      </text>
      <text x="60" y="76" textAnchor="middle" fill="rgba(248,247,242,0.55)" fontFamily="JetBrains Mono Variable" fontSize="8">
        solved
      </text>
    </svg>
  )
}
