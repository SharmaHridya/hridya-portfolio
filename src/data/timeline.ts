// Journey milestones. Months come from GitHub repository history; add new milestones at the end.

export type Milestone = {
  when: string
  year: string
  title: string
  description: string
  related?: { label: string; href: string }
  tags: string[]
}

export const milestones: Milestone[] = [
  {
    when: '2025',
    year: '2025',
    title: 'Beginning the engineering journey',
    description: 'Started a B.Tech in Instrumentation & Control Engineering at NIT Jalandhar.',
    tags: ['NIT Jalandhar'],
  },
  {
    when: '2025 →',
    year: '2025',
    title: 'C++ and programming fundamentals',
    description: 'Learning C and C++, then practising data structures and algorithms on LeetCode, mostly in C++.',
    related: { label: 'LeetCode', href: 'https://leetcode.com/u/hridyas_33/' },
    tags: ['C', 'C++', 'DSA'],
  },
  {
    when: 'Mar 2026',
    year: '2026',
    title: 'First things in the browser',
    description: 'A burst of small JavaScript builds: Ludo, a drum kit, Simon, a QR-code generator, a currency converter.',
    related: { label: 'js_mini_projects', href: 'https://github.com/SharmaHridya/js_mini_projects' },
    tags: ['JavaScript', 'DOM'],
  },
  {
    when: 'Mar – Jun 2026',
    year: '2026',
    title: 'Exploring frontend development',
    description: 'React, routing and Redux Toolkit through counters, a to-do list and a full notes app.',
    related: { label: 'Notes App', href: 'https://github.com/SharmaHridya/Notes-app' },
    tags: ['React', 'Redux'],
  },
  {
    when: 'Jun – Jul 2026',
    year: '2026',
    title: 'Building Inkwell',
    description: 'A blogging platform with auth, rich text, image storage and protected routes.',
    related: { label: 'Inkwell', href: '/projects/inkwell' },
    tags: ['Appwrite', 'Redux Toolkit'],
  },
  {
    when: 'Jun – Jul 2026',
    year: '2026',
    title: 'ISRO Bharatiya Antariksh Hackathon',
    description: 'Prototyped the Urban Heat Mitigation Simulator with satellite data and Earth Engine.',
    related: { label: 'Urban Heat Simulator', href: '/projects/urban-heat-simulator' },
    tags: ['Hackathon', 'Geospatial'],
  },
  {
    when: 'Jul 2026',
    year: '2026',
    title: 'Moving into backend engineering, building CartVerse',
    description: 'FastAPI, PostgreSQL, migrations, auth and transactions, deployed across three providers.',
    related: { label: 'CartVerse', href: '/projects/cartverse' },
    tags: ['FastAPI', 'PostgreSQL'],
  },
  {
    when: 'Aug – Oct 2026',
    year: '2026',
    title: 'Retrieval + LLMs at 180 Degrees Consulting',
    description: 'Built HSN Matcher: vector search in pgvector with an LLM reranker.',
    related: { label: 'HSN Matcher', href: '/projects/hsn-matcher' },
    tags: ['pgvector', 'LLM'],
  },
  {
    when: 'Oct 2026',
    year: '2026',
    title: 'Exploring AI and Machine Learning',
    description: 'NumPy and Pandas, then regression, feature scaling and classification from first principles.',
    related: { label: 'ML-fundamentals', href: 'https://github.com/SharmaHridya/ML-fundamentals' },
    tags: ['NumPy', 'scikit-learn'],
  },
  {
    when: 'Nov 2026',
    year: '2026',
    title: 'Exploring distributed systems',
    description: 'Built the node and network layer of a four-person peer-to-peer storage system.',
    related: { label: 'P2P Storage', href: '/projects/p2p-cloud-storage' },
    tags: ['P2P', 'Python'],
  },
]
