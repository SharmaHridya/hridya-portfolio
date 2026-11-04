import { useEffect } from 'react'

// The hero loop and "How I think" are the same five stages. Clicking a word in the hero
// scrolls to the section and opens that stage, via this small window event.
const EVENT = 'process:open-stage'

export function openProcessStage(index: number) {
  window.dispatchEvent(new CustomEvent<number>(EVENT, { detail: index }))
}

export function useProcessStageRequests(onOpen: (index: number) => void) {
  useEffect(() => {
    const handler = (e: Event) => onOpen((e as CustomEvent<number>).detail)
    window.addEventListener(EVENT, handler)
    return () => window.removeEventListener(EVENT, handler)
  }, [onOpen])
}
