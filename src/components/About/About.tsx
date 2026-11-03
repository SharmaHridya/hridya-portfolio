import { motion } from 'framer-motion'
import { personalityCards } from '../../data/interests'
import { profile } from '../../data/profile'
import { Reveal, RevealGroup, RevealItem } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'
import { DoodleBoard } from './DoodleBoard'
import { Toolkit } from './Toolkit'

const BIO = [
  'I’m an engineering student who enjoys exploring the intersection of technology, creativity and ideas.',
  'From developing web applications and experimenting with backend systems to exploring machine learning, I enjoy understanding how things work and finding ways to make them better.',
  'I’m equally interested in communicating ideas, public speaking and debating different perspectives.',
  'I like learning things beyond my immediate field, asking questions and occasionally going down fascinating rabbit holes.',
]

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="border-t border-line py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          id="about-title"
          number="01"
          label="About"
          title={
            <>
              A little about the person <span className="serif-italic text-cobalt">behind the pixels.</span>
            </>
          }
        />

        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <Portrait />
          </Reveal>

          <div className="lg:col-span-8 lg:pl-8">
            <Reveal>
              <p className="font-display text-[clamp(1.4rem,2.4vw,2rem)] leading-snug font-medium tracking-tight">{BIO[0]}</p>
            </Reveal>
            <div className="mt-8 grid gap-6 text-ink/80 md:grid-cols-2">
              {BIO.slice(1).map((p, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <p>{p}</p>
                </Reveal>
              ))}
              <Reveal delay={0.15}>
                <p className="serif-italic text-xl text-ink">I don’t have everything figured out, and that’s probably the fun part.</p>
              </Reveal>
            </div>

            <DoodleBoard />

            <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2" gap={0.07}>
              {personalityCards.map((card) => (
                <RevealItem key={card.n}>
                  <motion.article
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="group relative h-full overflow-hidden rounded-2xl border border-line bg-card p-6"
                  >
                    <span
                      className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                      style={{ background: card.accent }}
                      aria-hidden
                    />
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-xs text-muted">{card.n}</span>
                      <span
                        className="grid size-10 place-items-center rounded-full font-display text-lg font-semibold transition-transform duration-500 group-hover:rotate-[360deg]"
                        style={{ background: `${card.accent}22`, color: card.accent === '#B6A6D9' ? '#5b4a8f' : card.accent }}
                        aria-hidden
                      >
                        {card.glyph}
                      </span>
                    </div>
                    <h3 className="mt-6 text-2xl font-semibold">{card.title}</h3>
                    <p className="mt-2 text-ink/75">{card.body}</p>
                  </motion.article>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>

        <Toolkit />
      </div>
    </section>
  )
}

function Portrait() {
  return (
    <figure className="sticky top-24">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] border border-line bg-paper-deep">
        {profile.photo ? (
          <img
            src={profile.photo}
            alt={`${profile.name} leaning on a boulder by a mountain river, smiling, in a yellow dress`}
            className="size-full object-cover object-[62%_45%] transition-transform duration-700 hover:scale-[1.02]"
            loading="lazy"
            width={1250}
            height={1666}
          />
        ) : (
          <div className="grid-paper flex size-full flex-col justify-between p-6">
            <span className="label">Portrait · placeholder</span>
            <span className="font-display text-[7rem] leading-none font-bold tracking-tighter text-ink/90">
              h<span className="text-cobalt">s</span>
              <span className="text-tangerine">.</span>
            </span>
            <span className="font-mono text-[0.7rem] text-muted">Add a photo: set profile.photo in src/data/profile.ts</span>
          </div>
        )}
      </div>
      <figcaption className="mt-4 grid grid-cols-2 gap-y-3 border-t border-line pt-4 font-mono text-xs">
        <span className="text-muted">Based at</span>
        <span>{profile.college}</span>
        <span className="text-muted">Studying</span>
        <span>Instrumentation & Control</span>
        <span className="text-muted">Year</span>
        <span>{profile.year}</span>
        <span className="text-muted">Also</span>
        <span>LADC · 180DC</span>
      </figcaption>
    </figure>
  )
}
