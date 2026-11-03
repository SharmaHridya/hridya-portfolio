// Curiosity Lab topics. Add a topic by appending to a group's `topics`; add a group by appending to `labGroups`.

export type LabStatus = 'LEARNING' | 'EXPERIMENTING' | 'EXPLORING'

export type LabTopic = {
  name: string
  status: LabStatus
  explanation: string
  why: string
  experiments?: { label: string; url: string }[]
  related?: { label: string; href: string }[]
}

export type LabGroup = { id: string; label: string; accent: string; topics: LabTopic[] }

const nb = (path: string) => `https://github.com/SharmaHridya/ML-fundamentals/tree/main/${encodeURI(path)}`

export const labGroups: LabGroup[] = [
  {
    id: 'ml',
    label: 'Machine Learning',
    accent: '#3657D6',
    topics: [
      {
        name: 'Linear Regression',
        status: 'EXPERIMENTING',
        explanation: 'Fit a straight line ŷ = θ₀ + θ₁x to data by choosing the parameters that minimise the mean squared error between predictions and real values.',
        why: 'It is the smallest model where every moving part of machine learning is visible: a hypothesis, a cost, and an optimiser.',
        experiments: [
          { label: 'Single-variable notebook', url: nb('single variable') },
          { label: 'Multiple-variable notebook', url: nb('multiple variables') },
        ],
        related: [{ label: 'Try the playground ↓', href: '#ml-playground' }],
      },
      {
        name: 'Gradient Descent',
        status: 'EXPERIMENTING',
        explanation: 'Repeatedly nudge each parameter against the slope of the cost: θ := θ − α·∂J/∂θ. The learning rate α sets the step size.',
        why: 'Too small and it crawls, too large and it explodes. Watching that happen builds more intuition than any formula.',
        related: [{ label: 'Change α in the playground ↓', href: '#ml-playground' }],
      },
      {
        name: 'Feature Scaling',
        status: 'EXPERIMENTING',
        explanation: 'Rescale inputs (for example z-score: subtract the mean, divide by the standard deviation) so every feature has a similar range.',
        why: 'The same learning rate that diverges on raw inputs converges quickly once they are scaled. The playground has a toggle for exactly this.',
        experiments: [{ label: 'Feature-scaling notebook', url: nb('feature-scaling') }],
      },
      {
        name: 'Logistic Regression',
        status: 'LEARNING',
        explanation: 'Pass a linear combination through the sigmoid σ(z) = 1/(1+e^(−z)) to get a probability, and train with log-loss instead of squared error.',
        why: 'It is the bridge from predicting numbers to making decisions.',
        experiments: [{ label: 'Classification notebook', url: nb('classification') }],
      },
      {
        name: 'Classification',
        status: 'LEARNING',
        explanation: 'Predicting a category rather than a quantity, with a decision boundary separating classes in feature space.',
        why: 'Most real questions are yes/no or which-one questions.',
        experiments: [{ label: 'scikit-learn notebook', url: nb('scikit learn') }],
      },
      {
        name: 'Model Evaluation',
        status: 'LEARNING',
        explanation: 'Train/test splits, and metrics such as accuracy, precision, recall and MSE that measure a model on data it has not seen.',
        why: 'A model that only looks good on its training data has not learned anything useful.',
      },
    ],
  },
  {
    id: 'swe',
    label: 'Software Engineering',
    accent: '#F28B54',
    topics: [
      {
        name: 'Backend Architecture',
        status: 'EXPERIMENTING',
        explanation: 'Splitting a server into routers, schemas, models and dependencies so each concern has one home.',
        why: 'The difference between an app that grows and one that has to be rewritten.',
        related: [{ label: 'CartVerse', href: '/projects/cartverse' }],
      },
      {
        name: 'API Design',
        status: 'EXPERIMENTING',
        explanation: 'Resource-shaped REST routes, clear status codes, validation at the edge, and idempotency for operations that may be retried.',
        why: 'An API is a promise to everyone who calls it.',
        related: [{ label: 'CartVerse', href: '/projects/cartverse' }],
      },
      {
        name: 'Database Systems',
        status: 'LEARNING',
        explanation: 'Relational modelling, transactions, row-level locks, migrations, and vector indexes for similarity search.',
        why: 'Correctness under concurrency lives here, not in the application code.',
        related: [
          { label: 'CartVerse', href: '/projects/cartverse' },
          { label: 'HSN Matcher', href: '/projects/hsn-matcher' },
        ],
      },
      {
        name: 'Authentication',
        status: 'EXPERIMENTING',
        explanation: 'Password hashing (bcrypt), JWT sessions, role checks, and signed messages between machines (HMAC).',
        why: 'The same idea, proving who sent something, shows up from login forms to peer-to-peer networks.',
        related: [
          { label: 'CartVerse', href: '/projects/cartverse' },
          { label: 'P2P Storage', href: '/projects/p2p-cloud-storage' },
        ],
      },
      {
        name: 'Distributed Systems',
        status: 'EXPLORING',
        explanation: 'Failure detection, replication, gossip, content addressing and repair when machines come and go.',
        why: 'Everything that is easy on one machine becomes interesting on three.',
        related: [{ label: 'P2P Storage', href: '/projects/p2p-cloud-storage' }],
      },
    ],
  },
  {
    id: 'prog',
    label: 'Programming',
    accent: '#B6A6D9',
    topics: [
      {
        name: 'Data Structures & Algorithms',
        status: 'LEARNING',
        explanation: 'Arrays, hashing, binary search, sliding windows, trees, recursion and dynamic programming, practised on LeetCode.',
        why: 'It trains the habit of asking “can this be done with less?”',
        related: [{ label: 'Live LeetCode stats ↓', href: '#workspace' }],
      },
      {
        name: 'C++',
        status: 'LEARNING',
        explanation: 'The language most of my problem solving happens in: STL containers, references, and thinking about cost.',
        why: 'It makes the machine visible.',
      },
      {
        name: 'Python',
        status: 'EXPERIMENTING',
        explanation: 'Backends with FastAPI, data work with NumPy and Pandas, geospatial analysis and ML notebooks.',
        why: 'The fastest path from an idea to something that runs.',
      },
      {
        name: 'Problem Solving',
        status: 'LEARNING',
        explanation: 'Breaking a problem into invariants and edge cases before writing code.',
        why: 'The same muscle as debating: find the assumption, then test it.',
      },
    ],
  },
  {
    id: 'next',
    label: 'Exploring Next',
    accent: '#202124',
    topics: [
      {
        name: 'Neural Networks',
        status: 'EXPLORING',
        explanation: 'Stacks of linear layers and non-linearities trained by backpropagation, which is gradient descent with the chain rule.',
        why: 'The natural next step after logistic regression.',
      },
      {
        name: 'Retrieval-augmented systems',
        status: 'EXPLORING',
        explanation: 'Grounding language models in a searchable store of facts, the pattern behind HSN Matcher.',
        why: 'It makes LLM output checkable.',
        related: [{ label: 'HSN Matcher', href: '/projects/hsn-matcher' }],
      },
    ],
  },
]
