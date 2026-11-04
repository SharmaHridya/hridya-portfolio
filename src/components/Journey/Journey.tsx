import { motion, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { easeOutExpo } from '../../animations/variants'
import { milestones } from '../../data/timeline'
import { isExternal } from '../../utils/format'
import { SectionHeader } from '../ui/SectionHeader'

export function Journey() {
  const list = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 70%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <section id="journey" aria-labelledby="journey-title" className="border-t border-line py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          id="journey-title"
          number="07"
          label="My journey · a work in progress"
          title={
            <>
              Still figuring things out. Still{' '}
              <span className="relative inline-block">
                building.
                <svg viewBox="0 0 200 14" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full overflow-visible" aria-hidden>
                  <motion.path
                    d="M2 9 C 40 4, 80 12, 120 7 S 180 5, 198 8"
                    fill="none"
                    stroke="#3657D6"
                    strokeWidth={4}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 0.72 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, delay: 0.5, ease: 'easeInOut' }}
                  />
                </svg>
              </span>
            </>
          }
          intro={<p>Months are taken from GitHub history. The list grows as the work does.</p>}
        />

        <ol ref={list} className="relative mx-auto max-w-4xl">
          <span className="absolute top-0 bottom-0 left-[7px] w-px bg-line md:left-1/2" aria-hidden />
          <motion.span className="absolute top-0 bottom-0 left-[7px] w-px origin-top bg-ink md:left-1/2" style={{ scaleY: progress }} aria-hidden />

          {milestones.map((m, i) => {
            const right = i % 2 === 1
            return (
              <motion.li
                key={m.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -15% 0px' }}
                transition={{ duration: 0.7, ease: easeOutExpo }}
                className="relative grid pb-12 pl-10 md:grid-cols-2 md:pl-0"
              >
                <span className="absolute top-1.5 left-0 size-[15px] rounded-full border-2 border-ink bg-paper md:left-1/2 md:-translate-x-1/2" aria-hidden />
                <div className={right ? 'md:col-start-2 md:pl-12' : 'md:pr-12 md:text-right'}>
                  <p className="font-mono text-xs text-cobalt-deep">{m.when}</p>
                  <h3 className="mt-2 text-2xl font-semibold">{m.title}</h3>
                  <p className="mt-2 text-ink/75">{m.description}</p>
                  <div className={`mt-3 flex flex-wrap items-center gap-2 ${right ? '' : 'md:justify-end'}`}>
                    {m.tags.map((t) => (
                      <span key={t} className="rounded-full bg-ink/5 px-2.5 py-0.5 font-mono text-[0.68rem]">
                        {t}
                      </span>
                    ))}
                    {m.related &&
                      (isExternal(m.related.href) ? (
                        <a href={m.related.href} target="_blank" rel="noopener noreferrer" className="link-underline text-sm text-cobalt-deep">
                          {m.related.label} ↗
                        </a>
                      ) : (
                        <Link to={m.related.href} className="link-underline text-sm text-cobalt-deep">
                          {m.related.label} →
                        </Link>
                      ))}
                  </div>
                </div>
              </motion.li>
            )
          })}

          <li className="relative pl-10 md:pl-0 md:text-center">
            <span className="absolute top-1 left-0 size-[15px] rounded-full border-2 border-dashed border-ink/40 bg-paper md:left-1/2 md:-translate-x-1/2" aria-hidden />
            <p className="font-mono text-xs text-muted md:pt-8">Next milestone · loading…</p>
          </li>
        </ol>
      </div>
    </section>
  )
}
