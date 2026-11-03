import { miniProjects } from '../../data/projects'
import { RevealGroup, RevealItem } from '../ui/Reveal'

export function MoreProjects() {
  return (
    <div className="mt-20 border-t border-ink pt-10">
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-2xl font-semibold md:text-3xl">More from the workbench</h3>
        <p className="font-mono text-xs text-muted">Smaller builds, notebooks and early experiments</p>
      </div>
      <RevealGroup className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3" gap={0.05}>
        {miniProjects.map((m) => (
          <RevealItem key={m.title} className="flex flex-col bg-card p-6 transition-colors hover:bg-paper">
            <h4 className="text-lg font-semibold">{m.title}</h4>
            <p className="mt-2 flex-1 text-sm text-ink/75">{m.blurb}</p>
            <p className="mt-4 font-mono text-[0.68rem] text-muted">{m.stack.join(' · ')}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
              {m.links.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="link-underline text-sm text-cobalt-deep">
                  {l.label} ↗<span className="sr-only"> (GitHub, opens in a new tab)</span>
                </a>
              ))}
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  )
}
