import { motion } from 'framer-motion'
import { ArrowUpRight, ImageIcon, Play } from 'lucide-react'
import { useState } from 'react'
import { speaking, type SpeakingEntry } from '../../data/speaking'
import { cn } from '../../utils/format'
import { Modal } from '../ui/Modal'
import { RevealGroup, RevealItem } from '../ui/Reveal'
import { DraftBadge } from '../ui/Tag'
import { SubHeading } from './SubHeading'

const TINTS = ['#3657D6', '#F28B54', '#B6A6D9', '#202124', '#b9b9b2']

// Grid placement on large screens: the first card is tall, a video card spans two columns.
const span = (s: SpeakingEntry, i: number) => cn(i === 0 && 'lg:row-span-2', s.media?.type === 'video' && 'lg:col-span-2')

export function Speaker() {
  const [open, setOpen] = useState<SpeakingEntry | null>(null)

  return (
    <div className="mb-28">
      <SubHeading
        letter="A"
        kicker="The speaker"
        title={
          <>
            Ideas are meant to be <span className="serif-italic">shared.</span>
          </>
        }
      />
      <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" gap={0.06}>
        {speaking.map((s, i) => (
          <RevealItem key={s.id} className={span(s, i)}>
            <motion.button
              onClick={() => setOpen(s)}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className={cn(
                'group flex h-full w-full flex-col overflow-hidden rounded-2xl border text-left',
                'border-line bg-card',
              )}
              aria-haspopup="dialog"
            >
              {s.mediaSlot === false ? (
                <div className="px-5 pt-5">
                  <span className="rounded-full bg-paper px-2.5 py-0.5 font-mono text-[0.65rem]">{s.kind}</span>
                </div>
              ) : (
              <div
                className={cn('relative w-full overflow-hidden', i === 0 ? 'aspect-[4/3] lg:flex-1' : s.media?.type === 'video' ? 'aspect-[16/9] lg:aspect-[21/8]' : 'aspect-[16/9]')}
                style={{ background: `${TINTS[i % TINTS.length]}1f` }}
              >
                {s.media?.type === 'image' ? (
                  <img src={s.media.src} alt={s.media.alt} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                ) : s.media?.type === 'video' ? (
                  <>
                    <img src={s.media.poster} alt="" loading="lazy" className="size-full object-cover" />
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid size-14 place-items-center rounded-full bg-paper/90 text-ink shadow-lg transition-transform duration-300 group-hover:scale-110">
                        <Play className="ml-0.5 size-5 fill-current" aria-hidden />
                      </span>
                    </span>
                    <span className="absolute right-3 bottom-3 rounded-full bg-ink/80 px-2.5 py-0.5 font-mono text-[0.65rem] text-paper">Watch · 2:13</span>
                  </>
                ) : (
                  <div className="flex size-full flex-col items-center justify-center gap-2 text-ink/40">
                    <ImageIcon className="size-6" aria-hidden />
                    <span className="font-mono text-[0.62rem] tracking-wider uppercase">Photo / video slot</span>
                  </div>
                )}
                <span className="absolute top-3 left-3 rounded-full bg-paper px-2.5 py-0.5 font-mono text-[0.65rem]">{s.kind}</span>
              </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <h4 className="text-xl font-semibold group-hover:text-cobalt">{s.title}</h4>
                <p className="mt-1 font-mono text-[0.7rem] text-muted">
                  {s.org}
                  {s.when && ` · ${s.when}`}
                </p>
                <p className={cn('mt-3 text-sm text-ink/75', s.mediaSlot !== false && 'line-clamp-3')}>{s.summary}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium">
                  Open <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                </span>
              </div>
            </motion.button>
          </RevealItem>
        ))}
      </RevealGroup>

      <Modal open={!!open} onClose={() => setOpen(null)} labelledBy="speaking-title" wide={open?.media?.type === 'video'}>
        {open && (
          <div>
            <p className="label">{open.kind}</p>
            <h3 id="speaking-title" className="mt-2 pr-8 text-3xl font-semibold">
              {open.title}
            </h3>
            <p className="mt-1 font-mono text-xs text-muted">{open.org}</p>
            {open.mediaSlot !== false && (
              <div className={cn('mt-6 grid aspect-video place-items-center overflow-hidden rounded-xl bg-paper-deep', !open.media && 'border border-dashed border-ink/25')}>
                {open.media?.type === 'video' ? (
                  <video src={open.media.src} poster={open.media.poster} controls autoPlay playsInline preload="metadata" className="size-full bg-ink" aria-label={open.media.alt} />
                ) : open.media?.type === 'image' ? (
                  <img src={open.media.src} alt={open.media.alt} className="size-full object-cover" />
                ) : (
                  <span className="font-mono text-xs text-muted">Photo or video to be added</span>
                )}
              </div>
            )}
            <p className="mt-6 text-ink/85">{open.summary}</p>
            <dl className="mt-6 grid grid-cols-[7rem_1fr] gap-y-3 border-t border-line pt-5 text-sm">
              <dt className="label pt-0.5">When</dt>
              <dd>{open.when ?? <DraftBadge>Add dates</DraftBadge>}</dd>
              <dt className="label pt-0.5">Details</dt>
              <dd>{open.details ?? <DraftBadge>Add conferences, committees, motions or results</DraftBadge>}</dd>
            </dl>
          </div>
        )}
      </Modal>
    </div>
  )
}
