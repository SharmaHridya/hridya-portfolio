import type { ReactNode } from 'react'

export function SubHeading({ letter, kicker, title }: { letter: string; kicker: string; title: ReactNode }) {
  return (
    <div className="mb-10 flex items-end gap-5 border-b border-ink pb-5">
      <span className="font-display text-[4.5rem] leading-[0.8] font-bold text-ink/10 md:text-[6rem]" aria-hidden>
        {letter}
      </span>
      <div>
        <p className="label">{kicker}</p>
        <h3 className="mt-1 text-3xl font-semibold md:text-5xl">{title}</h3>
      </div>
    </div>
  )
}
