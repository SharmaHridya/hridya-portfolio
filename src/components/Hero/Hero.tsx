import { motion } from 'framer-motion'
import { ArrowDown, FileText } from 'lucide-react'
import { easeOutExpo, fadeUp, lineReveal, stagger } from '../../animations/variants'
import { profile } from '../../data/profile'
import { useScrollTo } from '../../hooks/useScrollTo'
import { GitHubIcon, LinkedInIcon } from '../ui/BrandIcons'
import { Button } from '../ui/Button'
import { WordConstellation } from './WordConstellation'

const HEADLINE: { text: string; italic?: boolean; accent?: boolean }[][] = [
  [{ text: 'A mind full of ' }, { text: 'questions.', italic: true, accent: true }],
  [{ text: 'A keyboard full ' }],
  [{ text: 'of ' }, { text: 'possibilities.', italic: true }],
]

export function Hero() {
  const scrollTo = useScrollTo()

  return (
    <section id="home" aria-labelledby="hero-title" className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <motion.div className="lg:col-span-7" initial="hidden" animate="show" variants={stagger(0.09, 0.1)}>
          <motion.div variants={fadeUp} className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="label text-ink">{profile.name}</span>
            <span className="h-px w-8 bg-ink/30" aria-hidden />
            <span className="label">
              {profile.college} · {profile.degree.replace('B.Tech, ', '')}
            </span>
          </motion.div>

          <h1 id="hero-title" className="text-[clamp(2.7rem,7.4vw,6.4rem)] leading-[0.95] font-semibold tracking-[-0.035em]">
            {HEADLINE.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-[0.06em]">
                <motion.span className="block" variants={lineReveal}>
                  {line.map((part, j) => (
                    <span key={j} className={part.italic ? `serif-italic ${part.accent ? 'text-cobalt' : ''}` : undefined}>
                      {part.text}
                    </span>
                  ))}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p variants={fadeUp} className="mt-8 max-w-xl text-lg text-ink/80 md:text-xl">
            I’m an engineering student who loves building things, exploring ideas and understanding how technology works.
          </motion.p>

          <motion.ul variants={fadeUp} className="mt-6 flex flex-wrap gap-2" aria-label="Roles">
            {profile.roles.map((role, i) => (
              <li
                key={role}
                className="rounded-full border border-line bg-card px-3 py-1 font-mono text-xs text-ink/80"
                style={{ boxShadow: `inset 3px 0 0 ${['#3657D6', '#F28B54', '#B6A6D9'][i]}` }}
              >
                {role}
              </li>
            ))}
          </motion.ul>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-3">
            <Button onClick={() => scrollTo('projects')} icon={<ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden />}>
              Explore my work
            </Button>
            <Button variant="secondary" onClick={() => scrollTo('about')}>
              A little about me
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-2">
              <GitHubIcon /> GitHub
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-2">
              <LinkedInIcon /> LinkedIn
            </a>
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-2">
              <FileText className="size-4" aria-hidden /> Resume
            </a>
            <span className="inline-flex items-center gap-2 font-mono text-xs text-muted">
              <span className="pulse-dot size-1.5 rounded-full bg-cobalt" aria-hidden />
              Currently exploring → <span className="text-cobalt-deep">{profile.currentlyExploring}</span>
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.35, ease: easeOutExpo }}
        >
          <WordConstellation />
        </motion.div>
      </div>

      <button
        onClick={() => scrollTo('about')}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted md:flex"
        aria-label="Scroll to the about section"
      >
        <span className="label">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-ink" />
        </span>
      </button>
    </section>
  )
}
