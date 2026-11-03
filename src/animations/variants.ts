import type { Transition, Variants } from 'framer-motion'

export const easeOutExpo: Transition['ease'] = [0.16, 1, 0.3, 1]

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOutExpo } },
}

export const stagger = (gap = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
})

/** Line-by-line text reveal: each line slides up from behind a mask. */
export const lineReveal: Variants = {
  hidden: { y: '105%' },
  show: { y: '0%', transition: { duration: 0.9, ease: easeOutExpo } },
}
