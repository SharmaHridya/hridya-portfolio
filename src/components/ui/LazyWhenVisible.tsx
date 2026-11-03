import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react'

/** Mounts children (typically a React.lazy component) only once the placeholder nears the viewport. */
export function LazyWhenVisible({ children, fallback, minHeight = 400 }: { children: ReactNode; fallback: ReactNode; minHeight?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '600px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ minHeight: visible ? undefined : minHeight }}>
      {visible ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </div>
  )
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-ink/[0.06] ${className}`} aria-hidden />
}
