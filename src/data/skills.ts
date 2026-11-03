// Toolkit from the resume. `status` keeps learning topics honest: nothing here claims expertise.

export type SkillStatus = 'using' | 'learning'

export type SkillGroup = { label: string; items: { name: string; status: SkillStatus }[] }

const using = (name: string) => ({ name, status: 'using' as const })
const learning = (name: string) => ({ name, status: 'learning' as const })

export const skillGroups: SkillGroup[] = [
  { label: 'Languages', items: [using('C++'), using('Python'), using('JavaScript'), using('C'), using('SQL')] },
  {
    label: 'Web',
    items: [using('React'), using('Vite'), using('Redux Toolkit'), using('Tailwind CSS'), using('HTML & CSS'), using('Node.js'), using('Express.js')],
  },
  {
    label: 'Backend & data',
    items: [
      using('FastAPI'),
      using('Django REST Framework'),
      using('JWT auth'),
      using('PostgreSQL'),
      using('pgvector'),
      using('SQLAlchemy'),
      using('Alembic'),
      using('MongoDB'),
      using('REST APIs'),
    ],
  },
  {
    label: 'Data & ML',
    items: [
      using('NumPy'),
      using('Pandas'),
      using('Matplotlib'),
      using('Streamlit'),
      using('Folium'),
      using('Google Earth Engine'),
      using('Vector embeddings'),
      using('LLM APIs'),
      learning('scikit-learn'),
      learning('OpenCV (basics)'),
    ],
  },
  {
    label: 'Tools',
    items: [using('Git & GitHub'), using('Docker'), using('Vercel'), using('Render'), using('Netlify'), using('Jupyter'), using('Appwrite'), using('Figma')],
  },
]
