import { skillGroups } from '../../data/skills'
import { Reveal } from '../ui/Reveal'

export function Toolkit() {
  return (
    <Reveal className="mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink pb-4">
        <h3 className="text-3xl font-semibold md:text-4xl">The toolkit</h3>
        <p className="flex items-center gap-4 font-mono text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-ink" aria-hidden /> used in projects
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full border border-dashed border-ink" aria-hidden /> learning
          </span>
        </p>
      </div>
      <dl className="divide-y divide-line">
        {skillGroups.map((group) => (
          <div key={group.label} className="grid gap-3 py-5 md:grid-cols-12">
            <dt className="label pt-1.5 md:col-span-3">{group.label}</dt>
            <dd className="flex flex-wrap gap-2 md:col-span-9">
              {group.items.map((item) => (
                <span
                  key={item.name}
                  className={
                    item.status === 'using'
                      ? 'rounded-full border border-ink/15 bg-card px-3 py-1 text-sm transition-colors hover:border-ink'
                      : 'rounded-full border border-dashed border-ink/40 px-3 py-1 text-sm text-ink/75'
                  }
                >
                  {item.name}
                  {item.status === 'learning' && <span className="sr-only"> (learning)</span>}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Reveal>
  )
}
