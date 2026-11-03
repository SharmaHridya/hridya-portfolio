import type { ReactNode } from 'react'
import { cn } from '../../../utils/format'

/** A quiet "app window" frame around each project visual. */
export function Frame({ title, children, className, note }: { title: string; children: ReactNode; className?: string; note?: string }) {
  return (
    <div className={cn('relative flex h-full flex-col overflow-hidden rounded-[20px] border border-line bg-card shadow-[0_1px_0_rgba(0,0,0,0.03),0_30px_60px_-30px_rgba(32,33,36,0.25)]', className)}>
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ef8a80]" aria-hidden />
        <span className="size-2.5 rounded-full bg-[#f1c35a]" aria-hidden />
        <span className="size-2.5 rounded-full bg-[#8fcf86]" aria-hidden />
        <span className="ml-3 truncate font-mono text-[0.68rem] text-muted">{title}</span>
        {note && <span className="ml-auto shrink-0 font-mono text-[0.6rem] tracking-wider text-muted uppercase">{note}</span>}
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  )
}
