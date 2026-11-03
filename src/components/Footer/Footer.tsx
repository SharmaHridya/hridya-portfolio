import { ArrowUp } from 'lucide-react'
import { navItems, profile } from '../../data/profile'
import { useScrollTo } from '../../hooks/useScrollTo'
import { GitHubIcon, LeetCodeIcon, LinkedInIcon } from '../ui/BrandIcons'

export function Footer() {
  const scrollTo = useScrollTo()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-paper-deep">
      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none font-bold tracking-tighter">
              {profile.name.split(' ')[0]}
              <span className="text-tangerine">.</span>
            </p>
            <p className="serif-italic mt-4 max-w-sm text-lg text-ink/80">Built with curiosity, caffeine and a questionable number of browser tabs.</p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <p className="label mb-3">Navigate</p>
            <ul className="space-y-1.5">
              {navItems.map((n) => (
                <li key={n.id}>
                  <a
                    href={n.id === 'home' ? '/' : `/#${n.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollTo(n.id)
                    }}
                    className="link-underline text-ink/80 hover:text-ink"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <p className="label mb-3">Elsewhere</p>
            <ul className="space-y-2">
              <li>
                <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-cobalt">
                  <GitHubIcon /> GitHub
                </a>
              </li>
              <li>
                <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-cobalt">
                  <LinkedInIcon /> LinkedIn
                </a>
              </li>
              <li>
                <a href={profile.links.leetcode} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-cobalt">
                  <LeetCodeIcon /> LeetCode
                </a>
              </li>
              <li>
                <a href={`mailto:${profile.email}`} className="break-all hover:text-cobalt">
                  {profile.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-6 font-mono text-xs text-muted">
          <p>
            © {year} {profile.name} · {profile.college}
          </p>
          <button onClick={() => scrollTo('home')} className="inline-flex items-center gap-1.5 hover:text-ink">
            Back to top <ArrowUp className="size-3.5" aria-hidden />
          </button>
        </div>
      </div>
    </footer>
  )
}
