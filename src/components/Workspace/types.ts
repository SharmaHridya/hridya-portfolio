export type Repo = {
  name: string
  fullName: string
  url: string
  description: string | null
  language: string | null
  stars: number
  forks: number
  fork: boolean
  homepage: string | null
  pushedAt: string
}

export type Commit = { sha: string; repo: string; message: string; date: string; url: string }

export type GitHubData = {
  fetchedAt: string
  profile: { login: string; url: string; avatar: string; publicRepos: number; followers: number; joined: string }
  repos: Repo[]
  commits: Commit[]
  contributions: { total: number; days: { date: string; count: number; level: number }[] }
  /** Set when the data came from the browser fallback instead of /api/github. */
  partial?: boolean
}

export type LeetCodeData = {
  fetchedAt: string
  username: string
  url: string
  ranking: number
  solved: { all: number; easy: number; medium: number; hard: number }
  totals: { all: number; easy: number; medium: number; hard: number }
  contest: { rating: number; attended: number; globalRanking: number; topPercentage: number } | null
  streak: number
  activeDays: number
  languages: { name: string; solved: number }[]
  topics: { name: string; slug: string; solved: number; level: string }[]
  recent: { title: string; url: string; date: string }[]
}
