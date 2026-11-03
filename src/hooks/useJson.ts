import { useCallback, useEffect, useRef, useState } from 'react'

export type JsonState<T> = {
  data: T | null
  error: string | null
  loading: boolean
  updatedAt: number | null
  reload: () => void
}

/**
 * Fetches JSON, optionally polling. Polling pauses while the tab is hidden and resumes
 * (with an immediate refresh) when it becomes visible again.
 */
export function useJson<T>(url: string | null, { pollMs, fallback }: { pollMs?: number; fallback?: () => Promise<T> } = {}): JsonState<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(!!url)
  const [updatedAt, setUpdatedAt] = useState<number | null>(null)
  const fallbackRef = useRef(fallback)
  fallbackRef.current = fallback

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!url) return
      try {
        const res = await fetch(url, { signal })
        const body = await res.json().catch(() => null)
        if (!res.ok) throw new Error(body?.error ?? `Request failed (${res.status})`)
        setData(body as T)
        setError(null)
      } catch (err) {
        if (signal?.aborted) return
        if (fallbackRef.current) {
          try {
            setData(await fallbackRef.current())
            setError(null)
            return
          } catch {
            /* fall through to the original error */
          }
        }
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        if (!signal?.aborted) {
          setLoading(false)
          setUpdatedAt(Date.now())
        }
      }
    },
    [url],
  )

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)
    if (!pollMs) return () => controller.abort()

    let timer = window.setInterval(() => document.visibilityState === 'visible' && load(), pollMs)
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return
      load()
      window.clearInterval(timer)
      timer = window.setInterval(() => document.visibilityState === 'visible' && load(), pollMs)
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      controller.abort()
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [load, pollMs])

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    load()
  }, [load])

  return { data, error, loading, updatedAt, reload }
}
