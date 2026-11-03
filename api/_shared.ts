// Helpers shared by the /api functions. Files starting with "_" are not routes on Vercel.

export function json(data: unknown, init: { status?: number; maxAge?: number } = {}): Response {
  const { status = 200, maxAge = 0 } = init
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': maxAge
        ? `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 5}`
        : 'no-store',
    },
  })
}

/** A tiny per-instance cache so warm serverless instances don't refetch on every hit. */
export function memo<T>(ttlMs: number, load: () => Promise<T>): () => Promise<T> {
  let value: T | undefined
  let expires = 0
  let inflight: Promise<T> | undefined
  return async () => {
    if (value !== undefined && Date.now() < expires) return value
    inflight ??= load()
      .then((v) => {
        value = v
        expires = Date.now() + ttlMs
        return v
      })
      .finally(() => {
        inflight = undefined
      })
    return inflight
  }
}
