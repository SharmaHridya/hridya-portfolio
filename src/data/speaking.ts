// Speaking & communication. Summaries come from the resume; fields set to null are left for Hridya to fill in.
// To add a photo or video, put the file in /public and set `media`.

export type SpeakingEntry = {
  id: string
  kind: string
  title: string
  org: string
  summary: string
  details: string | null
  when: string | null
  media: { type: 'image' | 'video'; src: string; alt: string } | null
  placeholder?: boolean
}

export const speaking: SpeakingEntry[] = [
  {
    id: 'mun',
    kind: 'Model United Nations',
    title: 'Representing LADC at MUN conferences',
    org: 'Literary and Debating Club, NIT Jalandhar',
    summary: 'Represented the club at multiple Model United Nations conferences.',
    details: null,
    when: null,
    media: null,
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
  },
  {
    id: 'pitch',
    kind: 'Pitch',
    title: 'Pitch deck for Minimol Storage',
    org: 'Team project',
    summary: 'Wrote the 10-slide deck that explains the peer-to-peer storage system and every feature it ships.',
    details: null,
    when: 'Nov 2026',
    media: null,
  },
  {
    id: 'next',
    kind: 'Your next stage',
    title: 'Add a talk, event or leadership role',
    org: 'Placeholder',
    summary: 'Space for the next presentation, workshop or event, with a photo or video.',
    details: null,
    when: null,
    media: null,
    placeholder: true,
  },
]
