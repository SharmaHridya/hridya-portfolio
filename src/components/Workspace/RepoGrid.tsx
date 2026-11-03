import { Star } from 'lucide-react'
import { useState } from 'react'
import { pinnedRepos, repoBlurbs } from '../../data/profile'
import { LANGUAGE_COLORS, cn, shortDate, timeAgo } from '../../utils/format'
import { DarkSkeleton, EmptyState } from './States'
import type { GitHubData } from './types'

type View = 'selected' | 'recent' | 'all'

export function RepoGrid({ data, loading }: { data: GitHubData | null; loading: boolean }) {
  const [view, setView] = useState<View>('selected')
  const repos = data?.repos ?? []

  const list =
    view === 'selected'
      ? pinnedRepos.map((name) => repos.find((r) => r.name === name)).filter((r): r is NonNullable<typeof r> => !!r)
      : view === 'recent'
        ? repos.slice(0, 6)
        : repos

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h3 className="font-display text-2xl font-semibold md:text-3xl">Repositories</h3>
        <div className="flex gap-1 rounded-full border border-paper/15 p-1" role="group" aria-label="Repository view">
          {(['selected', 'recent', 'all'] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={cn('rounded-full px-3.5 py-1 text-sm capitalize transition-colors', view === v ? 'bg-paper text-ink' : 'text-paper/70 hover:text-paper')}
            >
              {v === 'all' ? `All ${repos.length || ''}` : v}
            </button>
          ))}
        </div>
      </div>

      {loading && !data ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <DarkSkeleton key={i} className="h-36" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <EmptyState dark>No public repositories to show yet.</EmptyState>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((r) => (
            <li key={r.fullName}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-2xl border border-paper/12 bg-paper/[0.03] p-5 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-paper/40 hover:bg-paper/[0.06]"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="font-mono text-sm font-medium break-all group-hover:text-lavender">{r.name}</span>
                  <span aria-hidden className="text-paper/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </span>
                <span className="mt-2 line-clamp-2 flex-1 text-sm text-paper/65">{r.description ?? repoBlurbs[r.name] ?? (r.fork ? 'Forked repository' : 'No description yet')}</span>
                <span className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.68rem] text-paper/60">
                  {r.language && (
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full" style={{ background: LANGUAGE_COLORS[r.language] ?? '#B6A6D9' }} aria-hidden />
                      {r.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star className="size-3" aria-hidden />
                    <span className="sr-only">Stars:</span>
                    {r.stars}
                  </span>
                  <time dateTime={r.pushedAt} title={shortDate(r.pushedAt)}>
                    updated {timeAgo(r.pushedAt)}
                  </time>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
