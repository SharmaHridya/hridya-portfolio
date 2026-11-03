# Hridya Sharma — The Curious Mind

A personal engineering studio: projects with playable miniatures, a curiosity lab with a live gradient-descent playground, live GitHub and LeetCode activity, a debate corner and a journal of rabbit holes.

**Stack:** React 19 · Vite · TypeScript · Tailwind CSS v4 · Framer Motion · React Router · Recharts · Lucide. Serverless functions in `api/` run on Vercel.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173 — the /api functions run inside the dev server too
npm run build      # type-check + production build into dist/
```

## Editing content

All content lives in `src/data/`. Components never need to change to update text.

| File | What it controls |
|---|---|
| `profile.ts` | Name, email, links, photo, "currently exploring", pinned repos, fallback repo descriptions |
| `projects.ts` | The five featured projects, their case studies, and "More from the workbench" |
| `skills.ts` | The toolkit (`using` vs `learning`) |
| `lab.ts` | Curiosity Lab topics, status labels, related experiments |
| `debates.ts` | Debate questions. Each is marked `sample: true` until you write your own take |
| `speaking.ts` | Speaking, MUN, debate and consulting cards. Fill `details`, `when` and `media` |
| `interests.ts` | Personality cards and the rabbit-hole scrapbook |
| `timeline.ts` | Journey milestones |
| `process.ts` | The five "How I think" stages |

Anything marked **✎ Draft** on the site is a placeholder waiting for first-hand detail. Nothing there is invented: replace the prompt text and remove `draft: true` / `sample: true` / `placeholder: true`.

**Photo:** put an image in `public/` (e.g. `public/profile.jpg`) and set `photo: '/profile.jpg'` in `profile.ts`.
**Resume:** replace `public/Hridya-Sharma-Resume.pdf`. Note that it currently includes your phone number, which becomes public once deployed.

## Live data

- `api/github.ts` — profile, repos, recent commits (including team repos you pushed to) and the contribution calendar for `SharmaHridya`. Cached for 90 s. The browser polls every minute while the tab is visible.
- `api/leetcode.ts` — solved counts, topics, languages, streak, contest rating and recent accepted problems for `hridyas_33`. Cached for 15 min. (LeetCode blocks direct browser requests, so this has to go through the server.)

No tokens are ever sent to the browser.

## Contact form

`api/contact.ts` validates the message and sends it with [Resend](https://resend.com). Until the keys below are set, the form shows a clear error with a mailto fallback.

## Deploy to Vercel

1. Push this folder to a GitHub repository and import it in Vercel (framework preset: Vite).
2. Add environment variables (Project → Settings → Environment Variables):
   - `RESEND_API_KEY` — from resend.com (free tier)
   - `CONTACT_TO_EMAIL` — where messages should arrive
   - `CONTACT_FROM_EMAIL` — optional; a sender on a domain you verified in Resend. The default `onboarding@resend.dev` only delivers to the email you signed up to Resend with.
   - `GITHUB_TOKEN` — optional; a token with no scopes raises GitHub's limit from 60 to 5,000 requests/hour
3. If your URL is not `hridya-sharma.vercel.app`, replace that domain in `index.html`, `public/robots.txt` and `public/sitemap.xml`.
