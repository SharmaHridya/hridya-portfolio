import { useMemo, useState } from 'react'
import { profile } from '../../data/profile'
import { GitHubIcon } from '../ui/BrandIcons'
import { DarkSkeleton, EmptyState } from './States'
import type { GitHubData } from './types'

const LEVELS = ['rgba(248,247,242,0.07)', '#2f3f86', '#3657D6', '#7d93ea', '#F28B54']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function ContributionGraph({ data, loading }: { data: GitHubData | null; loading: boolean }) {
  const [hover, setHover] = useState<{ date: string; count: number } | null>(null)

  const weeks = useMemo(() => {
    const days = data?.contributions.days ?? []
    if (!days.length) return []
    // Pad the first week so rows line up with weekdays (Sunday first, like GitHub).
    const pad = new Date(days[0].date + 'T00:00:00Z').getUTCDay()
    const cells: ({ date: string; count: number; level: number } | null)[] = [...Array(pad).fill(null), ...days]
    const out: (typeof cells)[] = []
    for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7))
    return out
  }, [data])

  const stats = data
    ? [
        { label: 'public repos', value: data.profile.publicRepos },
        { label: 'contributions, last year', value: data.partial ? '—' : data.contributions.total },
        { label: 'followers', value: data.profile.followers },
      ]
    : []

  return (
    <div className="h-full rounded-[22px] border border-paper/15 bg-paper/[0.03] p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3">
          <GitHubIcon className="size-6" />
          <span>
            <span className="block font-display text-xl font-semibold group-hover:text-lavender">@{profile.githubUser}</span>
            <span className="font-mono text-xs text-paper/55">github.com ↗</span>
          </span>
        </a>
        <dl className="flex gap-6">
          {loading && !data
            ? [0, 1, 2].map((i) => <DarkSkeleton key={i} className="h-12 w-20" />)
            : stats.map((s) => (
                <div key={s.label}>
                  <dd className="font-display text-3xl font-semibold tabular-nums">{s.value}</dd>
                  <dt className="font-mono text-[0.65rem] text-paper/55">{s.label}</dt>
                </div>
              ))}
        </dl>
      </div>

      <div className="mt-8">
        {loading && !data ? (
          <DarkSkeleton className="h-32" />
        ) : weeks.length ? (
          <>
            <div className="overflow-x-auto pb-2">
              <svg
                viewBox={`0 0 ${weeks.length * 13} ${7 * 13 + 14}`}
                className="min-w-[640px]"
                role="img"
                aria-label={`${data?.contributions.total} GitHub contributions in the last year`}
              >
                {weeks.map((week, w) => {
                  const first = week.find(Boolean)
                  const showMonth = first && new Date(first.date).getUTCDate() <= 7
                  return (
                    <g key={w} transform={`translate(${w * 13}, 14)`}>
                      {showMonth && (
                        <text y={-4} fontSize="8" fontFamily="JetBrains Mono Variable" fill="rgba(248,247,242,0.5)">
                          {MONTHS[new Date(first!.date).getUTCMonth()]}
                        </text>
                      )}
                      {week.map((d, i) =>
                        d ? (
                          <rect
                            key={d.date}
                            y={i * 13}
                            width={10}
                            height={10}
                            rx={2}
                            fill={LEVELS[d.level] ?? LEVELS[0]}
                            onPointerEnter={() => setHover(d)}
                            onPointerLeave={() => setHover(null)}
                          />
                        ) : null,
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 font-mono text-[0.68rem] text-paper/60">
              <span aria-live="polite">
                {hover
                  ? `${hover.count} contribution${hover.count === 1 ? '' : 's'} on ${new Date(hover.date + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}`
                  : 'Hover a day'}
              </span>
              <span className="flex items-center gap-1">
                less
                {LEVELS.map((c) => (
                  <span key={c} className="size-2.5 rounded-[2px]" style={{ background: c }} />
                ))}
                more
              </span>
            </div>
          </>
        ) : (
          <EmptyState dark>The contribution calendar isn’t available right now. Repositories and commits below are still live.</EmptyState>
        )}
      </div>
    </div>
  )
}
