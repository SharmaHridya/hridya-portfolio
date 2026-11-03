import { json, memo } from './_shared.js'

const USER = 'SharmaHridya'
const API = 'https://api.github.com'

type RawRepo = {
  name: string
  full_name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  fork: boolean
  homepage: string | null
  pushed_at: string
  updated_at: string
  topics?: string[]
}

type RawCommit = {
  sha: string
  html_url: string
  commit: { message: string; author: { date: string } | null }
}

type RawEvent = { type: string; repo: { name: string }; created_at: string }

async function gh<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'hridya-portfolio',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  const res = await fetch(`${API}${path}`, { headers })
  if (!res.ok) throw new Error(`GitHub ${path} → ${res.status}`)
  return res.json() as Promise<T>
}

/** Parses the public contribution calendar (the same HTML github.com renders on a profile). */
async function contributions(): Promise<{ date: string; count: number; level: number }[]> {
  const res = await fetch(`https://github.com/users/${USER}/contributions`, {
    headers: { 'User-Agent': 'hridya-portfolio' },
  })
  if (!res.ok) return []
  const html = await res.text()
  const counts = new Map<string, number>()
  for (const m of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const n = m[2].match(/^(\d+) contribution/)
    counts.set(m[1], n ? Number(n[1]) : 0)
  }
  const days: { date: string; count: number; level: number }[] = []
  for (const m of html.matchAll(/<td[^>]*data-date="([\d-]+)"[^>]*id="([^"]+)"[^>]*data-level="(\d)"/g)) {
    days.push({ date: m[1], count: counts.get(m[2]) ?? 0, level: Number(m[3]) })
  }
  return days.sort((a, b) => a.date.localeCompare(b.date))
}

const load = memo(90_000, async () => {
  const [user, repos, events] = await Promise.all([
    gh<{ public_repos: number; followers: number; avatar_url: string; html_url: string; created_at: string }>(`/users/${USER}`),
    gh<RawRepo[]>(`/users/${USER}/repos?per_page=100&sort=pushed`),
    gh<RawEvent[]>(`/users/${USER}/events/public?per_page=50`).catch(() => [] as RawEvent[]),
  ])

  // Repos with recent pushes, including team repos owned by someone else.
  const recent = new Set<string>()
  for (const e of events) if (e.type === 'PushEvent') recent.add(e.repo.name)
  for (const r of repos) if (!r.fork) recent.add(r.full_name)
  const targets = [...recent].slice(0, 6)

  const commitLists = await Promise.all(
    targets.map((repo) =>
      gh<RawCommit[]>(`/repos/${repo}/commits?author=${USER}&per_page=8`)
        .then((list) =>
          list.map((c) => ({
            sha: c.sha.slice(0, 7),
            repo,
            message: c.commit.message.split('\n')[0],
            date: c.commit.author?.date ?? '',
            url: c.html_url,
          })),
        )
        .catch(() => []),
    ),
  )
  const commits = commitLists
    .flat()
    .filter((c) => c.date)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 24)

  const calendar = await contributions().catch(() => [])

  return {
    fetchedAt: new Date().toISOString(),
    profile: {
      login: USER,
      url: user.html_url,
      avatar: user.avatar_url,
      publicRepos: user.public_repos,
      followers: user.followers,
      joined: user.created_at,
    },
    repos: repos.map((r) => ({
      name: r.name,
      fullName: r.full_name,
      url: r.html_url,
      description: r.description,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      fork: r.fork,
      homepage: r.homepage || null,
      pushedAt: r.pushed_at,
    })),
    commits,
    contributions: {
      total: calendar.reduce((sum, d) => sum + d.count, 0),
      days: calendar,
    },
  }
})

export async function GET(): Promise<Response> {
  try {
    return json(await load(), { maxAge: 90 })
  } catch (err) {
    return json({ error: 'Could not reach GitHub right now.', detail: String(err) }, { status: 502 })
  }
}
