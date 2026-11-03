// Personality cards (About) and the rabbit-hole scrapbook (Beyond Code).

export const personalityCards = [
  { n: '01', title: 'The Builder', body: 'I enjoy turning ideas into working applications.', accent: '#3657D6', glyph: '▲' },
  { n: '02', title: 'The Curious One', body: 'Always exploring new technologies and concepts.', accent: '#F28B54', glyph: '?' },
  { n: '03', title: 'The Speaker', body: 'I enjoy presenting ideas and communicating with people.', accent: '#B6A6D9', glyph: '“' },
  { n: '04', title: 'The Debater', body: 'I like questioning assumptions and exploring different perspectives.', accent: '#202124', glyph: '⇄' },
]

export type RabbitHole = {
  title: string
  description: string
  category: 'Technology' | 'Science' | 'Ideas' | 'Experiment' | 'Beyond engineering'
  date: string
  resource?: { label: string; url: string }
  // Entries seeded from project work; rewrite them in your own words or replace them.
  seeded?: boolean
  placeholder?: boolean
}

// Add an entry by appending an object. `date` is free text shown as written ("Oct 2026").
export const rabbitHoles: RabbitHole[] = [
  {
    title: 'Why the learning rate can blow everything up',
    description: 'On unscaled inputs, a step size that looks reasonable makes gradient descent overshoot further every iteration.',
    category: 'Experiment',
    date: 'Oct 2026',
    resource: { label: 'ML-fundamentals', url: 'https://github.com/SharmaHridya/ML-fundamentals' },
    seeded: true,
  },
  {
    title: 'Searching by meaning with pgvector',
    description: 'Storing embeddings inside PostgreSQL and asking for “nearest” instead of “equal”.',
    category: 'Technology',
    date: 'Aug 2026',
    resource: { label: 'pgvector', url: 'https://github.com/pgvector/pgvector' },
    seeded: true,
  },
  {
    title: 'Measuring a city’s temperature from orbit',
    description: 'Landsat’s thermal bands make it possible to estimate how hot a surface is from space, which is how heat islands become visible.',
    category: 'Science',
    date: 'Jul 2026',
    resource: { label: 'USGS: Landsat Surface Temperature', url: 'https://www.usgs.gov/landsat-missions/landsat-collection-2-surface-temperature' },
    seeded: true,
  },
  {
    title: 'What SELECT … FOR UPDATE actually locks',
    description: 'Row-level locks, and why “check stock, then decrement” is a race without them.',
    category: 'Technology',
    date: 'Jul 2026',
    resource: { label: 'PostgreSQL: explicit locking', url: 'https://www.postgresql.org/docs/current/explicit-locking.html' },
    seeded: true,
  },
  {
    title: 'Gossip protocols',
    description: 'How a cluster learns about every member when each node only talks to a few others.',
    category: 'Ideas',
    date: 'Nov 2026',
    seeded: true,
  },
]
