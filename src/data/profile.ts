// Personal details used across the site. Edit here; components read from this file.

export const profile = {
  name: 'Hridya Sharma',
  initials: 'hs',
  college: 'NIT Jalandhar',
  collegeFull: 'Dr. B. R. Ambedkar National Institute of Technology, Jalandhar',
  degree: 'B.Tech, Instrumentation & Control Engineering',
  year: '2nd year',
  roles: ['Software Developer', 'AI/ML Explorer', 'Curious Thinker'],
  currentlyExploring: 'Machine Learning & AI',
  email: 'hridyas.ic.25@nitj.ac.in',
  resume: '/Hridya-Sharma-Resume.pdf',
  // Set to an image in /public (e.g. '/profile.jpg') to replace the placeholder portrait.
  photo: null as string | null,
  links: {
    github: 'https://github.com/SharmaHridya',
    linkedin: 'https://www.linkedin.com/in/hridya-sharma-572b1b394/',
    leetcode: 'https://leetcode.com/u/hridyas_33/',
  },
  githubUser: 'SharmaHridya',
  leetcodeUser: 'hridyas_33',
}

export type NavItem = { id: string; label: string }

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'lab', label: 'Curiosity Lab' },
  { id: 'beyond', label: 'Beyond Code' },
  { id: 'contact', label: 'Contact' },
]

/** Repos shown under "Selected" in the open-workspace section. */
export const pinnedRepos = ['Ecommerce-frontend', 'HSNMATCHER', 'BAH-DATA', 'BlogPost', 'ML-fundamentals', 'expense_tracker_mini']

/**
 * Shown when a repository has no description on GitHub. Adding a description on GitHub
 * itself takes priority over these.
 */
export const repoBlurbs: Record<string, string> = {
  'Ecommerce-frontend': 'CartVerse storefront: React, Vite, Tailwind, JWT auth and an admin console.',
  'Ecommerce-backend': 'CartVerse API: FastAPI, SQLAlchemy, Alembic and PostgreSQL with row-locked checkout.',
  HSNMATCHER: 'Plain-English product → HSN/SAC code, via pgvector retrieval and LLM reranking.',
  'hsn-ollama': 'Supporting service for HSN Matcher’s LLM reranking.',
  'BAH-DATA': 'Urban Heat Mitigation Simulator: Earth Engine, Landsat 8 LST, Sentinel-2 NDVI, Streamlit.',
  BlogPost: 'Inkwell: a blogging platform with Appwrite, Redux Toolkit and a rich-text editor.',
  'ML-fundamentals': 'Notebooks on regression, feature scaling, classification and scikit-learn.',
  numpy: 'NumPy practice notebooks.',
  expense_tracker_mini: 'Pandas script that cleans expense CSVs, flags budget overruns and charts spending.',
  'django-tutorial': 'Working through Django, step by step.',
  'Notes-app': 'Notes with tags, filters, trash, undo/redo and local persistence (React + Redux Toolkit).',
  'Todo-list': 'A React to-do list.',
  SharmaHridya: 'My GitHub profile README.',
  js_mini_projects: 'A collection of small JavaScript exercises.',
  'react-router-dom': 'Learning client-side routing in React.',
  currency_converter: 'Currency converter in vanilla JavaScript.',
  password_gen: 'Password generator.',
  react_project: 'Early React practice.',
  counter_react_project: 'A first React counter.',
  'QR-code-generator': 'Generate QR codes in the browser.',
  'AI-Recognition-Music-App': 'A browser music-player experiment in vanilla JavaScript.',
  Simon_game: 'The Simon memory game.',
  drum_kit: 'A keyboard-playable drum kit.',
  ludo_game: 'Ludo in the browser.',
  'bmi-calc': 'BMI calculator.',
}
