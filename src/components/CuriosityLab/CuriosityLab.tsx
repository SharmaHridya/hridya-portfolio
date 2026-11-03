import { lazy } from 'react'
import { labGroups } from '../../data/lab'
import { LazyWhenVisible, Skeleton } from '../ui/LazyWhenVisible'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'
import { TopicGroup } from './TopicGroup'

const MLPlayground = lazy(() => import('./MLPlayground'))

export function CuriosityLab() {
  return (
    <section id="lab" aria-labelledby="lab-title" className="border-t border-line py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          id="lab-title"
          number="03"
          label="The curiosity lab"
          title={
            <>
              Currently <span className="serif-italic text-cobalt">curious</span> about…
            </>
          }
          intro={
            <p>
              A working journal, not a list of expertise. Each topic is marked{' '}
              <span className="font-mono text-xs text-ink">LEARNING</span>, <span className="font-mono text-xs text-ink">EXPERIMENTING</span> or{' '}
              <span className="font-mono text-xs text-ink">EXPLORING</span>. Open one for the idea, why it’s interesting and where I’ve tried it.
            </p>
          }
        />

        <div className="grid gap-5 md:grid-cols-2">
          {labGroups.map((group, i) => (
            <Reveal key={group.id} delay={i * 0.05}>
              <TopicGroup group={group} index={i} />
            </Reveal>
          ))}
        </div>

        <div id="ml-playground" className="mt-24 scroll-mt-24">
          <LazyWhenVisible minHeight={720} fallback={<Skeleton className="h-[720px]" />}>
            <MLPlayground />
          </LazyWhenVisible>
        </div>
      </div>
    </section>
  )
}
