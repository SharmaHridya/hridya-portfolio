// Speaking & communication. Summaries come from the resume; fields set to null are left for Hridya to fill in.
// To add a photo or video, put the file in /public and set `media`. Set `mediaSlot: false` for a text-only card.

export type SpeakingMedia =
  | { type: 'image'; src: string; alt: string }
  | { type: 'video'; src: string; poster: string; alt: string }

export type SpeakingEntry = {
  id: string
  kind: string
  title: string
  org: string
  summary: string
  details: string | null
  when: string | null
  media: SpeakingMedia | null
  mediaSlot?: boolean
}

export const speaking: SpeakingEntry[] = [
  {
    id: 'mun',
    kind: 'Model United Nations',
    title: 'Representing LADC at MUN conferences',
    org: 'Literary and Debating Club, NIT Jalandhar',
    summary: 'Represented the club at multiple Model United Nations conferences, winning an Honourable Mention and Verbal Mentions.',
    details: null,
    when: '2026',
    media: {
      type: 'image',
      src: '/media/mun-unsc-india.webp',
      alt: 'Delegate desk at a Model United Nations conference: an India placard for the UN Security Council beside a laptop, pen and conference folder',
    },
  },
  {
    id: 'debate',
    kind: 'Debate',
    title: 'Inter-school and inter-college debates',
    org: 'Competitive debating',
    summary: 'Won multiple inter-school and inter-college debate competitions, speaking and thinking quickly under pressure.',
    details: null,
    when: null,
    media: null,
  },
  {
    id: '180dc',
    kind: 'Consulting',
    title: 'Member, 180 Degrees Consulting',
    org: '180DC, NIT Jalandhar',
    summary: 'Part of the student consulting chapter that delivers pro bono strategy and analytics projects for NGOs and social enterprises. HSN Matcher was built for a finance use case here.',
    details: null,
    when: null,
    media: null,
    mediaSlot: false,
  },
  {
    id: 'pitch',
    kind: 'Pitch',
    title: 'Pitch deck and demo film for Minimol Storage',
    org: 'Team project',
    summary: 'Wrote the 10-slide deck that explains the peer-to-peer storage system and every feature it ships. The demo film shows the real dashboard on a live cluster.',
    details: null,
    when: 'Nov 2026',
    media: {
      type: 'video',
      src: '/media/minimol-demo.mp4',
      poster: '/media/minimol-demo-poster.jpg',
      alt: 'Demo film of the Minimol (Chunky) peer-to-peer storage dashboard',
    },
  },
]
