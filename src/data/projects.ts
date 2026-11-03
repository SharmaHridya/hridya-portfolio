// Project content. Facts come from each repository's README and the resume.
// Entries marked `draft: true` are prompts awaiting first-hand detail; they render with a "Draft" tag.

export type ProjectCategory = 'Frontend' | 'Backend' | 'AI/ML' | 'Systems'

export type ProjectVisualKind = 'cartverse' | 'inkwell' | 'heatmap' | 'hsn' | 'network'

export type Note = { title: string; body: string; draft?: boolean }

export type ArchitectureLane = { label: string; nodes: string[] }

export type Project = {
  slug: string
  index: string
  title: string
  subtitle?: string
  kicker: string
  categories: ProjectCategory[]
  period: string
  role: string
  summary: string
  stack: string[]
  highlights: string[]
  visual: ProjectVisualKind
  accent: string
  links: { label: string; url: string; kind: 'github' | 'live' | 'docs' }[]
  facts?: { value: string; label: string }[]
  factsSource?: { label: string; url: string }
  caseStudy: {
    overview: string[]
    problem: string[]
    architecture: { caption: string; lanes: ArchitectureLane[] }
    decisions: Note[]
    challenges: Note[]
    learnings: Note[]
  }
}

export const projectFilters: ('All' | ProjectCategory)[] = ['All', 'Frontend', 'Backend', 'AI/ML', 'Systems']

export const projects: Project[] = [
  {
    slug: 'cartverse',
    index: '01',
    title: 'CartVerse',
    kicker: 'Full-stack Development',
    categories: ['Backend', 'Frontend'],
    period: 'Jul 2026',
    role: 'Built and deployed end to end',
    summary:
      'A full-stack e-commerce app with a FastAPI and PostgreSQL backend and a React storefront: JWT accounts, a product catalogue, cart, checkout, reviews and an admin console, deployed across Vercel, Render and Neon.',
    stack: ['Python', 'FastAPI', 'SQLAlchemy', 'Alembic', 'PostgreSQL', 'JWT', 'bcrypt', 'React', 'Vite', 'Tailwind CSS', 'REST APIs'],
    highlights: [
      'Atomic checkout with SELECT … FOR UPDATE row locking, so two buyers can never take the last unit',
      'Idempotent mock payments and inventory management with low-stock alerts',
      'Reviews restricted to verified purchases; admin routes guarded by role',
    ],
    visual: 'cartverse',
    accent: '#3657D6',
    links: [
      { label: 'Live demo', url: 'https://ecommerce-delta-rouge-32.vercel.app', kind: 'live' },
      { label: 'Frontend', url: 'https://github.com/SharmaHridya/Ecommerce-frontend', kind: 'github' },
      { label: 'Backend', url: 'https://github.com/SharmaHridya/Ecommerce-backend', kind: 'github' },
    ],
    caseStudy: {
      overview: [
        'CartVerse is a complete shop: customers register, browse products, fill a cart, check out and track their orders; admins manage products, categories and stock, and see low-stock alerts and incoming orders.',
        'The backend is FastAPI with SQLAlchemy models, Pydantic schemas and Alembic migrations on PostgreSQL (hosted on Neon). The frontend is React with Vite, React Router, Context API and Axios, styled with Tailwind and an interactive Spline landing page. The API runs on Render and the storefront on Vercel.',
      ],
      problem: [
        'A shop is mostly a consistency problem. Money, stock and identity all have to stay correct even when requests overlap, fail halfway or get retried.',
        'Concretely: two people checking out the last unit at the same moment must not both succeed; a payment request that is retried must not charge twice; only someone who actually bought a product should be able to review it; and only admins should be able to touch inventory.',
      ],
      architecture: {
        caption: 'Request path from the storefront to the database. Every protected route resolves the user from the JWT first.',
        lanes: [
          { label: 'Client · Vercel', nodes: ['React + Vite', 'Context API (auth, cart)', 'Axios + JWT header'] },
          { label: 'API · Render', nodes: ['FastAPI routers', 'Pydantic schemas', 'Auth dependencies (user / admin)'] },
          { label: 'Domain', nodes: ['Catalogue & cart', 'Checkout transaction', 'Payments · reviews'] },
          { label: 'Data · Neon', nodes: ['SQLAlchemy models', 'Alembic migrations', 'PostgreSQL'] },
        ],
      },
      decisions: [
        {
          title: 'Row locks around checkout',
          body: 'Checkout reads the products in the order with SELECT … FOR UPDATE inside a single transaction. A second checkout for the same rows waits for the first to commit and then sees the reduced stock, so overselling is impossible rather than unlikely.',
        },
        {
          title: 'Idempotent payment step',
          body: 'The (mock) payment endpoint is idempotent, so a client retry after a timeout returns the original result instead of recording a second payment.',
        },
        {
          title: 'Stateless auth with a role check',
          body: 'Passwords are hashed with bcrypt and sessions are JWTs. Admin-only routes depend on a dependency that checks is_admin, so authorization lives in one place instead of in every handler.',
        },
        {
          title: 'Versioned schema',
          body: 'Schema changes go through Alembic migrations instead of create_all, so the deployed database can be upgraded step by step and matches the code that runs against it.',
        },
      ],
      challenges: [
        { title: 'Proving the checkout is race-free', body: 'How you reproduced or tested concurrent checkouts, and what you saw before and after row locking.', draft: true },
        { title: 'Three hosts, one app', body: 'What it took to get Vercel, Render and Neon talking: CORS, environment variables, cold starts, connection strings.', draft: true },
      ],
      learnings: [
        { title: 'What changed in how you design APIs', body: 'One or two things you would now do from day one on a backend.', draft: true },
      ],
    },
  },
  {
    slug: 'inkwell',
    index: '02',
    title: 'Inkwell',
    kicker: 'Frontend Development',
    categories: ['Frontend'],
    period: 'Jun – Jul 2026',
    role: 'React app + Appwrite integration',
    summary:
      'A blogging platform for writing and reading: rich-text posts with cover images, personal and community feeds, search and reading-time estimates, backed by Appwrite for auth, data and storage.',
    stack: ['React', 'Vite', 'Redux Toolkit', 'React Router', 'React Hook Form', 'Appwrite', 'TinyMCE', 'Tailwind CSS'],
    highlights: [
      'Persistent Appwrite sessions with protected routes for writing and editing',
      'Full CRUD with a TinyMCE editor and featured-image uploads to Appwrite Storage',
      'Separate "Your posts" and community feeds, title search, reading time and dark mode',
    ],
    visual: 'inkwell',
    accent: '#F28B54',
    links: [{ label: 'Source', url: 'https://github.com/SharmaHridya/BlogPost', kind: 'github' }],
    caseStudy: {
      overview: [
        'Inkwell lets people sign up, write posts in a rich-text editor with a cover image, edit or delete their own posts, and read everyone else’s. Posts show publication dates and an estimated reading time, and the feed can be searched by title.',
        'It is a React single-page app; Appwrite provides authentication, the posts collection and image storage, so the project concentrates on the frontend: state, routing, forms and the reading experience.',
      ],
      problem: [
        'A writing tool needs to feel safe and quick: drafts and images must not get lost, only the author may change a post, and the reading view should stay clean however a post was written.',
      ],
      architecture: {
        caption: 'Components talk to small service wrappers rather than to the Appwrite SDK directly.',
        lanes: [
          { label: 'Pages', nodes: ['Home · All posts', 'Add / Edit post', 'Post · Login · Signup'] },
          { label: 'State & forms', nodes: ['Redux Toolkit (auth slice)', 'React Hook Form', 'Protected route layout'] },
          { label: 'Services', nodes: ['Auth service', 'Database service', 'Storage service'] },
          { label: 'Appwrite', nodes: ['Accounts', 'Posts collection', 'Image bucket'] },
        ],
      },
      decisions: [
        { title: 'Service layer over the SDK', body: 'Appwrite calls live in one config module that exposes auth, database and storage methods, so pages never import the SDK and the backend could be swapped later.' },
        { title: 'Global auth state in Redux', body: 'Login status is needed by the header, the route guards and the post actions, so it sits in a Redux Toolkit slice instead of being passed through props.' },
        { title: 'One form for create and edit', body: 'React Hook Form drives a single post form that is pre-filled when editing; the TinyMCE editor is connected as a controlled field.' },
      ],
      challenges: [
        { title: 'Keeping images and posts in sync', body: 'What happens to the old cover when a post is edited or deleted, and how you handled it.', draft: true },
      ],
      learnings: [{ title: 'State management, in your words', body: 'When Redux helped and when it felt like too much.', draft: true }],
    },
  },
  {
    slug: 'urban-heat-simulator',
    index: '03',
    title: 'Urban Heat Mitigation Simulator',
    subtitle: 'ISRO BAH 2026 prototype',
    kicker: 'AI/ML & Geospatial Technology',
    categories: ['AI/ML'],
    period: 'Jun – Jul 2026',
    role: 'Hackathon prototype',
    summary:
      'A geospatial decision-support dashboard that maps land surface temperature over Delhi NCR from Landsat 8, overlays Sentinel-2 vegetation cover, flags heat hotspots and lets you test cooling strategies.',
    stack: ['Python', 'Google Earth Engine', 'Landsat 8', 'Sentinel-2', 'Streamlit', 'Folium', 'Geospatial data'],
    highlights: [
      'Land Surface Temperature from Landsat 8 thermal imagery, across several observation periods',
      'NDVI green-cover layer from Sentinel-2, switchable against the heat map',
      'Intervention sandbox: tree canopy, cool roofs and surface albedo, estimated with a simple physics-inspired model',
    ],
    visual: 'heatmap',
    accent: '#F28B54',
    links: [{ label: 'Source', url: 'https://github.com/SharmaHridya/BAH-DATA', kind: 'github' }],
    caseStudy: {
      overview: [
        'Built as a prototype for ISRO’s Bharatiya Antariksh Hackathon 2026. The dashboard pulls satellite-derived thermal observations through Google Earth Engine, maps them over Delhi NCR and highlights five monitored hotspots: Najafgarh, Bawana Industrial Area, Okhla Industrial Estate, Palam Airport Region and Badarpur.',
        'A vegetation layer (NDVI from Sentinel-2) sits beside the temperature layer, and an intervention sandbox estimates how much cooling extra tree canopy, cool roofs or higher surface albedo could bring.',
      ],
      problem: [
        'Built-up areas trap heat and end up noticeably hotter than their surroundings: urban heat islands. That raises energy use, worsens air quality and harms health.',
        'Planners need to see where the heat is, how it relates to green cover, and roughly what different interventions could achieve, before spending money on any of them.',
      ],
      architecture: {
        caption: 'Satellite data is processed in Earth Engine; only results reach the Streamlit app.',
        lanes: [
          { label: 'Satellites', nodes: ['Landsat 8 thermal bands', 'Sentinel-2 red / NIR'] },
          { label: 'Earth Engine', nodes: ['Filter by date & clouds', 'Land Surface Temperature', 'NDVI'] },
          { label: 'Analysis', nodes: ['Hotspot sampling', 'Intervention model'] },
          { label: 'App', nodes: ['Streamlit controls', 'Folium map layers', 'Hotspot markers'] },
        ],
      },
      decisions: [
        { title: 'Compute where the data lives', body: 'Google Earth Engine filters and reduces the imagery server-side, so the app never downloads full rasters and stays responsive.' },
        { title: 'A transparent model over a black box', body: 'The sandbox uses a simplified physics-inspired estimate, and the app presents its output as an estimate. For a planning aid, being explainable mattered more than looking precise.' },
        { title: 'Streamlit + Folium for speed', body: 'A hackathon timeline favours tools that turn Python analysis into an interactive map quickly.' },
      ],
      challenges: [
        { title: 'Clouds, dates and missing pixels', body: 'How you chose observation windows and handled cloud cover in the imagery.', draft: true },
        { title: 'Calibrating the intervention model', body: 'Where the coefficients came from and how you sanity-checked the estimates.', draft: true },
      ],
      learnings: [{ title: 'Remote sensing, first contact', body: 'What surprised you about working with satellite data.', draft: true }],
    },
  },
  {
    slug: 'hsn-matcher',
    index: '04',
    title: 'HSN Matcher',
    subtitle: 'HSN/SAC code classifier',
    kicker: 'AI/ML · Retrieval + LLM',
    categories: ['AI/ML', 'Backend'],
    period: 'Aug – Oct 2026',
    role: 'Built for a finance use case at 180 Degrees Consulting',
    summary:
      'Describe a product in plain English and get the most likely HSN/SAC code, its GST rate and a ranked shortlist with reasons. Vector search does the matching; an LLM only reranks and explains.',
    stack: ['Python', 'Django', 'PostgreSQL', 'pgvector', 'Jina embeddings', 'LLM reranking', 'React', 'Tailwind CSS'],
    highlights: [
      'Retrieval first: descriptions are embedded and matched against HSN/SAC entries in pgvector',
      'The LLM sees only the top candidates, so it reorders and explains but cannot invent codes',
      'Says “unable to classify” below a similarity threshold, and flags near-ties as ambiguous',
    ],
    visual: 'hsn',
    accent: '#B6A6D9',
    links: [
      { label: 'Live demo', url: 'https://hsnmatcher.netlify.app/', kind: 'live' },
      { label: 'Source', url: 'https://github.com/SharmaHridya/HSNMATCHER', kind: 'github' },
    ],
    caseStudy: {
      overview: [
        'Classifying goods and services under the right HSN/SAC code is a routine but error-prone step in Indian GST compliance. HSN Matcher takes an everyday description, “stainless steel insulated water bottle”, and returns the likely code, GST rate, a confidence-ranked shortlist and a short reason for each.',
      ],
      problem: [
        'The official code list is large and written in formal language, while people describe products casually. Keyword search misses; a bare LLM can confidently invent a code that does not exist. The tool has to bridge the language gap and admit when it is unsure.',
      ],
      architecture: {
        caption: 'Deterministic retrieval narrows the space; the LLM only works on what retrieval found.',
        lanes: [
          { label: 'Input', nodes: ['Product description', 'Validation'] },
          { label: 'Retrieve', nodes: ['Embed (Jina AI)', 'pgvector top-K search', 'Similarity gate'] },
          { label: 'Rerank', nodes: ['LLM reorders candidates', 'Writes reasoning'] },
          { label: 'Output', nodes: ['Code + GST rate', 'Confidence & ambiguity', 'React UI'] },
        ],
      },
      decisions: [
        { title: 'LLM as reranker, not oracle', body: 'Only codes returned by vector search are shown to the model. It can reorder and explain them, but it has no way to introduce a code that is not in the dataset.' },
        { title: 'Refuse instead of guess', body: 'A similarity threshold stops weak matches from reaching the LLM, and the response schema allows an explicit unranked verdict.' },
        { title: 'Score gap as a second signal', body: 'When the top two scores are close, the result is shown as ambiguous rather than as a single confident answer.' },
      ],
      challenges: [
        { title: 'Choosing the threshold', body: 'How you picked the similarity cut-off and what examples you tested it on.', draft: true },
      ],
      learnings: [{ title: 'Working with a real client', body: 'What building for a 180DC engagement taught you about requirements.', draft: true }],
    },
  },
  {
    slug: 'p2p-cloud-storage',
    index: '05',
    title: 'P2P Cloud Storage',
    subtitle: 'Minimol Storage · 4-person team',
    kicker: 'Distributed Systems',
    categories: ['Systems', 'Backend'],
    period: 'Nov 2026',
    role: 'P2 · Node & network layer',
    summary:
      'Peer-to-peer storage across the laptops you already have. Files are compressed and encrypted locally, split into chunks, kept as three copies on three machines, and repaired automatically when a laptop disappears. There is no central server.',
    stack: ['Python', 'FastAPI', 'httpx', 'cryptography', 'zstandard', 'zeroconf (mDNS)', 'React', 'TypeScript', 'Docker'],
    highlights: [
      'My part: chunk store, signed peer API, heartbeats, gossip and mDNS discovery, inventory',
      'Also mine: background scrubbing for bit rot, proof-of-storage audits, graceful drain, metrics and the cluster timeline',
      'Every peer request and response is HMAC-signed and accepted only within a ±30 s window',
    ],
    visual: 'network',
    accent: '#3657D6',
    facts: [
      { value: '~20 s', label: 'to detect a dead laptop' },
      { value: '0.85%', label: 'of a file re-sent after a 1% edit' },
      { value: '193', label: 'automated tests' },
    ],
    factsSource: { label: 'Measured by the team · RESULTS.md', url: 'https://github.com/guptakaran0720/Minimol-2026/blob/main/docs/RESULTS.md' },
    links: [{ label: 'Team repo', url: 'https://github.com/guptakaran0720/Minimol-2026', kind: 'github' }],
    caseStudy: {
      overview: [
        'Minimol Storage turns a handful of ordinary laptops into a storage cluster. Every node runs the same program: it stores chunks for others, uploads its own files, detects failures and repairs missing copies.',
        'Four people built it in parallel against frozen interfaces. I owned P2, the node and network layer: storing chunks on disk, carrying every signed message between laptops, tracking who is alive and who holds what, scrubbing disks for rot and recording the cluster timeline. I also made the pitch deck.',
      ],
      problem: [
        'Cloud storage usually means trusting one provider. Spare disk space on the laptops a team already owns is free, but laptops sleep, crash and get carried away, and a peer should never be able to read your files.',
        'So the system has to keep data private from the machines storing it, notice failures on its own, and restore redundancy without any coordinator.',
      ],
      architecture: {
        caption: 'Each node is equal. The highlighted layer (Peer API down to discovery) is the part I built.',
        lanes: [
          { label: 'Your laptop', nodes: ['React dashboard', 'User API', 'Pipeline: chunk → zstd → AES-256-GCM'] },
          { label: 'Placement', nodes: ['Routing (rendezvous)', 'Transfer & repair'] },
          { label: 'Node & network · P2', nodes: ['Signed peer API', 'Chunk store', 'Heartbeats & gossip', 'Scrub · audit · drain'] },
          { label: 'Other laptops', nodes: ['Same program', '3 copies per chunk'] },
        ],
      },
      decisions: [
        { title: 'Authenticate every message, both ways', body: 'Requests are signed with HMAC-SHA256 over method, path, node, timestamp and a hash of the body, and responses carry their own signature. Anything outside ±30 s is rejected, which blocks replays.' },
        { title: 'Content-addressed chunks', body: 'A chunk’s id is the SHA-256 of its encrypted bytes. The receiving node re-hashes on upload and rejects mismatches, so corruption in transit cannot be stored silently.' },
        { title: 'Prove storage, don’t trust it', body: 'Audits send a random nonce and expect HMAC(nonce, chunk bytes) back; a node that has lost or altered the chunk cannot answer correctly.' },
        { title: 'Discovery without a tracker', body: 'One seed address is enough: peers gossip their peer lists every few seconds, with optional mDNS on a local network.' },
      ],
      challenges: [
        { title: 'Building against frozen contracts', body: 'How working behind fixed interfaces with in-memory fakes went for the network layer.', draft: true },
        { title: 'Testing failure on purpose', body: 'What the chaos runs and laptop shut-off tests uncovered.', draft: true },
      ],
      learnings: [{ title: 'Distributed systems, in practice', body: 'The idea that only made sense once laptops were actually failing.', draft: true }],
    },
  },
]

export type MiniProject = { title: string; blurb: string; stack: string[]; links: { label: string; url: string }[] }

const gh = (repo: string) => `https://github.com/SharmaHridya/${repo}`

export const miniProjects: MiniProject[] = [
  {
    title: 'Notes App',
    blurb: 'Pinning, tags, categories, combined filters, soft-delete trash, undo/redo and localStorage persistence.',
    stack: ['React', 'Redux Toolkit', 'Tailwind'],
    links: [{ label: 'Repo', url: gh('Notes-app') }],
  },
  {
    title: 'Expense Analyzer',
    blurb: 'Cleans a messy expense CSV, summarises spending, flags budget overruns per category and saves a chart.',
    stack: ['Python', 'Pandas', 'Matplotlib'],
    links: [{ label: 'Repo', url: gh('expense_tracker_mini') }],
  },
  {
    title: 'ML Fundamentals',
    blurb: 'Notebooks working through regression with one and many variables, feature scaling, classification and scikit-learn.',
    stack: ['Python', 'NumPy', 'Jupyter'],
    links: [{ label: 'Repo', url: gh('ML-fundamentals') }],
  },
  {
    title: 'NumPy & Django notes',
    blurb: 'Practice notebooks for NumPy and a guided Django build, kept as reference.',
    stack: ['NumPy', 'Django'],
    links: [
      { label: 'NumPy', url: gh('numpy') },
      { label: 'Django', url: gh('django-tutorial') },
    ],
  },
  {
    title: 'First JavaScript sketches',
    blurb: 'Where it started: small browser games and tools built while learning the DOM.',
    stack: ['JavaScript', 'HTML', 'CSS'],
    links: [
      { label: 'Simon', url: gh('Simon_game') },
      { label: 'Drum kit', url: gh('drum_kit') },
      { label: 'Ludo', url: gh('ludo_game') },
      { label: 'QR code', url: gh('QR-code-generator') },
      { label: 'Currency', url: gh('currency_converter') },
      { label: 'Music app', url: gh('AI-Recognition-Music-App') },
    ],
  },
  {
    title: 'React foundations',
    blurb: 'Counters, routing and a to-do list: the exercises that came before Inkwell.',
    stack: ['React', 'React Router'],
    links: [
      { label: 'Router', url: gh('react-router-dom') },
      { label: 'To-do', url: gh('Todo-list') },
      { label: 'Password gen', url: gh('password_gen') },
    ],
  },
]
