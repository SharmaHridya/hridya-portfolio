import { AlertTriangle, RefreshCw } from 'lucide-react'
import { cn } from '../../utils/format'

export function ErrorState({ message, onRetry, dark }: { message: string; onRetry: () => void; dark?: boolean }) {
  return (
    <div role="alert" className={cn('flex flex-col items-start gap-3 rounded-2xl border p-6', dark ? 'border-paper/15 bg-paper/5' : 'border-line bg-card')}>
      <p className="flex items-center gap-2 font-medium">
        <AlertTriangle className="size-4 text-tangerine" aria-hidden />
        Couldn’t load this right now.
      </p>
      <p className={cn('text-sm', dark ? 'text-paper/65' : 'text-muted')}>{message}</p>
      <button
        onClick={onRetry}
        className={cn('inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm', dark ? 'border-paper/30 hover:bg-paper hover:text-ink' : 'border-line hover:border-ink')}
      >
        <RefreshCw className="size-3.5" aria-hidden /> Try again
      </button>
    </div>
  )
}

export function EmptyState({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return <p className={cn('rounded-xl border border-dashed p-6 text-center text-sm', dark ? 'border-paper/20 text-paper/60' : 'border-line text-muted')}>{children}</p>
}

export function DarkSkeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-paper/10 ${className}`} aria-hidden />
}
