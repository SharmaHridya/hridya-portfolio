import type { ReactNode } from 'react'
import { cn } from '../../utils/format'

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-full border border-line bg-card px-2.5 py-0.5 font-mono text-[0.7rem] text-ink/80', className)}>
      {children}
    </span>
  )
}

/** Marks content that is a placeholder or sample, so nothing unverified reads as fact. */
export function DraftBadge({ children = 'Draft · to be written', className }: { children?: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-sm border border-dashed border-tangerine px-1.5 py-px font-mono text-[0.62rem] uppercase tracking-wider text-[#a2491a]',
        className,
      )}
    >
      ✎ {children}
    </span>
  )
}

const STATUS_STYLES: Record<string, string> = {
  LEARNING: 'bg-cobalt/10 text-cobalt-deep',
  EXPERIMENTING: 'bg-tangerine/15 text-[#a2491a]',
  EXPLORING: 'bg-lavender/30 text-[#4d3d7a]',
}

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={cn('rounded-full px-2 py-0.5 font-mono text-[0.62rem] tracking-wider', STATUS_STYLES[status] ?? 'bg-line')}>
      {status}
    </span>
  )
}
