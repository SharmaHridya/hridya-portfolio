import { ArrowUpRight } from 'lucide-react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn, isExternal } from '../../utils/format'

type Variant = 'primary' | 'secondary' | 'ghost'

const base =
  'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium transition-[color,background-color,border-color,transform] duration-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary: 'bg-ink px-6 py-3 text-paper hover:bg-cobalt',
  secondary: 'border border-ink/20 bg-transparent px-6 py-3 text-ink hover:border-ink hover:bg-ink hover:text-paper',
  ghost: 'px-1 py-1 text-ink hover:text-cobalt',
}

type ButtonProps = ComponentPropsWithoutRef<'button'> & { variant?: Variant; icon?: ReactNode }

export function Button({ variant = 'primary', className, children, icon, ...rest }: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      {children}
      {icon}
    </button>
  )
}

type LinkButtonProps = {
  href: string
  variant?: Variant
  className?: string
  children: ReactNode
  icon?: ReactNode
  download?: boolean
  onClick?: () => void
}

/** Renders an external <a> (new tab), a router <Link>, or an in-page anchor, depending on href. */
export function LinkButton({ href, variant = 'primary', className, children, icon, download, onClick }: LinkButtonProps) {
  const classes = cn(base, variants[variant], className)
  if (isExternal(href) || download || href.endsWith('.pdf')) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" download={download || undefined} onClick={onClick}>
        {children}
        {icon ?? <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    )
  }
  if (href.startsWith('/')) {
    return (
      <Link to={href} className={classes} onClick={onClick}>
        {children}
        {icon}
      </Link>
    )
  }
  return (
    <a href={href} className={classes} onClick={onClick}>
      {children}
      {icon}
    </a>
  )
}
