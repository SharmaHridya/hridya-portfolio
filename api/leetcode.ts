import { json, memo } from './_shared.js'

const USER = 'hridyas_33'

// LeetCode's public GraphQL endpoint does not allow browser (CORS) requests,
// so the site reads it through this function.
const QUERY = `query profile($u: String!) {
  allQuestionsCount { difficulty count }
  matchedUser(username: $u) {
    profile { ranking }
    submitStatsGlobal { acSubmissionNum { difficulty count } }
    tagProblemCounts {
      advanced { tagName tagSlug problemsSolved }
      intermediate { tagName tagSlug problemsSolved }
      fundamental { tagName tagSlug problemsSolved }
    }
    languageProblemCount { languageName problemsSolved }
    userCalendar { streak totalActiveDays }
  }
  userContestRanking(username: $u) { rating attendedContestsCount globalRanking topPercentage }
  recentAcSubmissionList(username: $u, limit: 8) { title titleSlug timestamp }
}`

type Tag = { tagName: string; tagSlug: string; problemsSolved: number }

const load = memo(15 * 60_000, async () => {
  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Referer: 'https://leetcode.com',
      'User-Agent': 'hridya-portfolio',
    },
    body: JSON.stringify({ query: QUERY, variables: { u: USER } }),
  })
  if (!res.ok) throw new Error(`LeetCode → ${res.status}`)
  const { data } = (await res.json()) as { data: any }
  const user = data?.matchedUser
  if (!user) throw new Error('LeetCode user not found')

  const totals = Object.fromEntries(
    (data.allQuestionsCount as { difficulty: string; count: number }[]).map((d) => [d.difficulty, d.count]),
  )
  const solved = Object.fromEntries(
    (user.submitStatsGlobal.acSubmissionNum as { difficulty: string; count: number }[]).map((d) => [d.difficulty, d.count]),
  )
  const tagGroups = user.tagProblemCounts as Record<'advanced' | 'intermediate' | 'fundamental', Tag[]>
  const topics = (Object.entries(tagGroups) as [string, Tag[]][])
    .flatMap(([level, tags]) => tags.map((t) => ({ name: t.tagName, slug: t.tagSlug, solved: t.problemsSolved, level })))
    .filter((t) => t.solved > 0)
    .sort((a, b) => b.solved - a.solved)

  const contest = data.userContestRanking
  return {
    fetchedAt: new Date().toISOString(),
    username: USER,
    url: `https://leetcode.com/u/${USER}/`,
    ranking: user.profile.ranking as number,
    solved: {
      all: solved.All ?? 0,
      easy: solved.Easy ?? 0,
      medium: solved.Medium ?? 0,
      hard: solved.Hard ?? 0,
    },
    totals: { all: totals.All, easy: totals.Easy, medium: totals.Medium, hard: totals.Hard },
    contest: contest
      ? {
          rating: Math.round(contest.rating),
          attended: contest.attendedContestsCount,
          globalRanking: contest.globalRanking,
          topPercentage: contest.topPercentage,
        }
      : null,
    streak: user.userCalendar?.streak ?? 0,
    activeDays: user.userCalendar?.totalActiveDays ?? 0,
    languages: (user.languageProblemCount as { languageName: string; problemsSolved: number }[])
      .map((l) => ({ name: l.languageName, solved: l.problemsSolved }))
      .sort((a, b) => b.solved - a.solved),
    topics,
    recent: (data.recentAcSubmissionList as { title: string; titleSlug: string; timestamp: string }[]).map((s) => ({
      title: s.title,
      url: `https://leetcode.com/problems/${s.titleSlug}/`,
      date: new Date(Number(s.timestamp) * 1000).toISOString(),
    })),
  }
})

export async function GET(): Promise<Response> {
  try {
    return json(await load(), { maxAge: 900 })
  } catch (err) {
    return json({ error: 'Could not reach LeetCode right now.', detail: String(err) }, { status: 502 })
  }
}
