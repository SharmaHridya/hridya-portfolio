// The click-through "pocket presentation" in Beyond Code → The speaker.
// Each click draws in the next item; after the last item, a click moves to the next slide.

export type Slide = { kicker: string; title: string; accent: string; items: { text: string; note?: string }[] }

export const slides: Slide[] = [
  {
    kicker: 'Slide 01',
    title: 'Things I’ve shipped',
    accent: '#3657D6',
    items: [
      { text: 'CartVerse', note: 'a store that can’t oversell' },
      { text: 'Inkwell', note: 'a blog with a rich-text editor' },
      { text: 'HSN Matcher', note: 'GST codes from plain English' },
      { text: 'Urban Heat Simulator', note: 'Delhi’s heat, seen from orbit' },
      { text: 'Minimol', note: 'storage that heals itself' },
    ],
  },
  {
    kicker: 'Slide 02',
    title: 'Currently on my desk',
    accent: '#F28B54',
    items: [
      { text: 'Logistic regression', note: 'from numbers to decisions' },
      { text: 'scikit-learn', note: 'after writing it by hand first' },
      { text: 'Distributed systems', note: 'what happens when laptops die' },
      { text: 'DSA in C++', note: 'one problem at a time' },
    ],
  },
  {
    kicker: 'Slide 03',
    title: 'Off the keyboard',
    accent: '#B6A6D9',
    items: [
      { text: 'Model United Nations', note: 'Honourable & Verbal Mentions' },
      { text: 'Inter-college debates', note: 'won a few' },
      { text: '180 Degrees Consulting', note: 'pro bono projects for NGOs' },
      { text: 'Rabbit holes', note: 'satellites, databases, gossip protocols' },
    ],
  },
  {
    kicker: 'Slide 04',
    title: 'My go-to stack',
    accent: '#202124',
    items: [
      { text: 'Python + FastAPI' },
      { text: 'React + Tailwind' },
      { text: 'PostgreSQL', note: '+ pgvector when meaning matters' },
      { text: 'C++', note: 'for problem solving' },
      { text: 'Git · Docker · Vercel' },
    ],
  },
]
