import { Check, Copy, FileText, Mail } from 'lucide-react'
import { useState } from 'react'
import { profile } from '../../data/profile'
import { GitHubIcon, LeetCodeIcon, LinkedInIcon } from '../ui/BrandIcons'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'
import { ContactForm } from './ContactForm'

export function Contact() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  const channels = [
    { label: 'LinkedIn', value: 'hridya-sharma', href: profile.links.linkedin, icon: <LinkedInIcon className="size-5" /> },
    { label: 'GitHub', value: `@${profile.githubUser}`, href: profile.links.github, icon: <GitHubIcon className="size-5" /> },
    { label: 'LeetCode', value: profile.leetcodeUser, href: profile.links.leetcode, icon: <LeetCodeIcon className="size-5" /> },
    { label: 'Resume', value: 'PDF', href: profile.resume, icon: <FileText className="size-5" aria-hidden /> },
  ]

  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-line py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          id="contact-title"
          number="08"
          label="Contact"
          title={
            <>
              Have something <span className="serif-italic text-cobalt">interesting</span> in mind?
            </>
          }
        />

        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="text-lg text-ink/80">
              Whether it’s an interesting project, a collaboration, a technical discussion or simply an exchange of ideas, I’d love to connect.
            </p>

            <div className="mt-10 rounded-2xl border border-ink bg-card p-6">
              <p className="label">Email</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <a href={`mailto:${profile.email}`} className="link-underline font-display text-xl font-semibold break-all md:text-2xl">
                  {profile.email}
                </a>
                <button
                  onClick={copy}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 font-mono text-xs transition-colors hover:border-ink"
                  aria-live="polite"
                >
                  {copied ? <Check className="size-3.5 text-[#3c9a5f]" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <a href={`mailto:${profile.email}`} className="mt-4 inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
                <Mail className="size-4" aria-hidden /> Open in your mail app
              </a>
            </div>

            <ul className="mt-6 divide-y divide-line border-y border-line">
              {channels.map((c) => (
                <li key={c.label}>
                  <a href={c.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 py-4">
                    <span className="text-ink/70 group-hover:text-cobalt">{c.icon}</span>
                    <span className="flex-1 font-medium">{c.label}</span>
                    <span className="font-mono text-xs text-muted">{c.value}</span>
                    <span aria-hidden className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5">
                      ↗
                    </span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
