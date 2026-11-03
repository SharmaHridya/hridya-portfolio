import { AnimatePresence, motion } from 'framer-motion'
import { GitCommitHorizontal } from 'lucide-react'
import { useNow } from '../../hooks/useNow'
import { timeAgo } from '../../utils/format'
import { DarkSkeleton, EmptyState } from './States'
import type { GitHubData } from './types'

type Props = { data: GitHubData | null; loading: boolean; updatedAt: number | null; error: string | null }

export function CommitFeed({ data, loading, updatedAt, error }: Props) {
  const now = useNow(5000)
  const commits = data?.commits ?? []

  return (
    <div className="flex h-full max-h-[420px] flex-col rounded-[22px] border border-paper/15 bg-paper/[0.03] lg:max-h-none">
      <div className="flex items-center justify-between border-b border-paper/10 px-5 py-4">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="relative flex size-2" aria-hidden>
            <span className="absolute inset-0 animate-ping rounded-full bg-tangerine opacity-70" />
            <span className="relative size-2 rounded-full bg-tangerine" />
          </span>
          Commit stream
        </h3>
        <span className="font-mono text-[0.65rem] text-paper/50" aria-live="off">
          {error && data ? 'reconnecting…' : updatedAt ? `synced ${timeAgo(new Date(updatedAt).toISOString(), now)}` : 'connecting…'}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3 lg:max-h-[340px]">
        {loading && !data ? (
          <div className="space-y-3 py-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <DarkSkeleton key={i} className="h-10" />
            ))}
          </div>
        ) : data?.partial ? (
          <EmptyState dark>Live commits need the site’s API route. The repositories below are still current.</EmptyState>
        ) : commits.length === 0 ? (
          <EmptyState dark>No public commits yet. Check back soon.</EmptyState>
        ) : (
          <ol className="relative space-y-1 before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-px before:bg-paper/15">
            <AnimatePresence initial={false}>
              {commits.map((c) => (
                <motion.li
                  key={c.repo + c.sha}
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative pl-6"
                >
                  <GitCommitHorizontal className="absolute top-2.5 left-0 size-4 rounded-full bg-ink text-lavender" aria-hidden />
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="block rounded-lg px-2 py-1.5 transition-colors hover:bg-paper/5">
                    <span className="line-clamp-2 text-sm">{c.message}</span>
                    <span className="mt-0.5 flex flex-wrap gap-x-2 font-mono text-[0.65rem] text-paper/50">
                      <span className="text-lavender">{c.repo.replace(/^SharmaHridya\//, '')}</span>
                      <span>{c.sha}</span>
                      <time dateTime={c.date}>{timeAgo(c.date, now)}</time>
                    </span>
                  </a>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        )}
      </div>
    </div>
  )
}
