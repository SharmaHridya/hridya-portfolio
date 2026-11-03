import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { lineReveal, stagger } from '../../animations/variants'
import { cn } from '../../utils/format'

type Props = {
  number: string
  label: string
  title: ReactNode
  intro?: ReactNode
  className?: string
  id?: string
  align?: 'split' | 'stack'
}

/** Editorial section opener: "§ 03 — LABEL" rule, oversized heading, optional intro in a side column. */
export function SectionHeader({ number, label, title, intro, className, id, align = 'split' }: Props) {
  return (
    <header className={cn('mb-12 md:mb-16', className)}>
      <div className="mb-6 flex items-center gap-4">
        <span className="label text-ink">§ {number}</span>
        <span className="h-px flex-1 bg-line" aria-hidden />
        <span className="label">{label}</span>
      </div>
      <div className={cn('grid gap-6', align === 'split' && 'md:grid-cols-12 md:items-end')}>
        <motion.h2
          id={id}
          className={cn('text-[clamp(2.25rem,5.5vw,4.5rem)] font-semibold', align === 'split' && 'md:col-span-8')}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger(0.1)}
        >
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span className="block" variants={lineReveal}>
              {title}
            </motion.span>
          </span>
        </motion.h2>
        {intro && (
          <div className={cn('max-w-md text-muted', align === 'split' && 'md:col-span-4 md:justify-self-end')}>{intro}</div>
        )}
      </div>
    </header>
  )
}
