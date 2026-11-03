import { useEffect, useState } from 'react'

/** Returns the id of the section currently crossing the upper third of the viewport. */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    if (!elements.length) return
    const visible = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.boundingClientRect.top)
          else visible.delete(entry.target.id)
        }
        if (!visible.size) return
        // The visible section closest to the top wins.
        const [first] = [...visible.entries()].sort((a, b) => ids.indexOf(a[0]) - ids.indexOf(b[0]))
        setActive(first[0])
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}
