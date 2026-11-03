import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { fadeUp, stagger } from '../../animations/variants'

type Props = { children: ReactNode; className?: string; delay?: number; as?: 'div' | 'li' | 'article' }

/** Fades content up once when it scrolls into view. Reduced motion is handled by MotionConfig. */
export function Reveal({ children, className, delay = 0, as = 'div' }: Props) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      variants={fadeUp}
      transition={{ delay }}
    >
      {children}
    </Tag>
  )
}

export function RevealGroup({ children, className, gap = 0.08 }: { children: ReactNode; className?: string; gap?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      variants={stagger(gap)}
    >
      {children}
    </motion.div>
  )
}

export const RevealItem = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div className={className} variants={fadeUp}>
    {children}
  </motion.div>
)
