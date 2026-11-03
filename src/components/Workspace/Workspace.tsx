import { profile } from '../../data/profile'
import { useJson } from '../../hooks/useJson'
import { SectionHeader } from '../ui/SectionHeader'
import { CommitFeed } from './CommitFeed'
import { ContributionGraph } from './ContributionGraph'
import { LeetCodePanel } from './LeetCodePanel'
import { RepoGrid } from './RepoGrid'
import { ErrorState } from './States'
import type { GitHubData } from './types'

/**
 * If the serverless endpoint is unavailable (e.g. a static preview), read public data straight
 * from the GitHub REST API. No token is ever used in the browser.
 */
async function browserFallback(): Promise<GitHubData> {
  const base = `https://api.github.com/users/${profile.githubUser}`
  const [user, repos] = await Promise.all([fetch(base).then((r) => r.json()), fetch(`${base}/repos?per_page=100&sort=pushed`).then((r) => r.json())])
  if (!Array.isArray(repos)) throw new Error('GitHub rate limit reached')
  return {
    fetchedAt: new Date().toISOString(),
    partial: true,
    profile: { login: user.login, url: user.html_url, avatar: user.avatar_url, publicRepos: user.public_repos, followers: user.followers, joined: user.created_at },
    repos: repos.map((r: Record<string, any>) => ({
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
    commits: [],
    contributions: { total: 0, days: [] },
  }
}

export function Workspace() {
  const github = useJson<GitHubData>('/api/github', { pollMs: 60_000, fallback: browserFallback })

  return (
    <section id="workspace" aria-labelledby="workspace-title" className="border-t border-line bg-ink py-24 text-paper md:py-32">
      <div className="container-x">
        <div className="[&_.label]:text-paper/60 [&_.bg-line]:bg-paper/15">
          <SectionHeader
            id="workspace-title"
            number="04"
            label="The open workspace"
            title={
              <>
                Code, experiments and <span className="serif-italic text-lavender">everything in between.</span>
              </>
            }
            intro={<p className="text-paper/70">Pulled live from GitHub and LeetCode. Commits refresh every minute while this tab is open.</p>}
          />
        </div>

        {github.error && !github.data ? (
          <ErrorState message={github.error} onRetry={github.reload} dark />
        ) : (
          <div className="grid gap-5 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-8">
              <ContributionGraph data={github.data} loading={github.loading} />
            </div>
            <div className="min-w-0 lg:col-span-4">
              <CommitFeed data={github.data} loading={github.loading} updatedAt={github.updatedAt} error={github.error} />
            </div>
          </div>
        )}

        <div className="mt-5">
          <LeetCodePanel />
        </div>

        <div className="mt-16">
          <RepoGrid data={github.data} loading={github.loading} />
        </div>
      </div>
    </section>
  )
}
