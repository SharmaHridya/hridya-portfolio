// "Words that stayed": one page per book in the rabbit-hole scrapbook, each the best line for one theme.
//
// Every quotation was checked word for word against the source in `source`:
//   • Animal Farm: full text (Project Gutenberg Australia, eBook 0100011), Chapter X
//   • The Metamorphosis: David Wyllie's English translation (Project Gutenberg #5200), Part I
//   • The Perks of Being a Wallflower: Wikiquote (p. 24), cross-checked with other quotation sources
//   • The Palace of Illusions: the Chapter 1 excerpt on the author's official website
//   • The Last Queen: the author's official book page
// Before changing a quotation, verify the exact wording the same way. If it can't be verified, leave it out.

export type BookPage = {
  id: string
  theme: string
  title: string
  author: string
  note?: string // translation used
  text: string
  context?: string // who says it, or where in the book
  smallCaps?: boolean // shown in capitals, as the line appears in the text
  source: { label: string; url: string }
  rabbitHole: { label: string; url: string }
}

const wiki = (page: string) => `https://en.wikipedia.org/wiki/${page}`

export const bookPages: BookPage[] = [
  {
    id: 'animal-farm',
    theme: 'Power & Society',
    title: 'Animal Farm',
    author: 'George Orwell',
    text: 'All animals are equal but some animals are more equal than others',
    context: 'The single commandment left on the barn wall',
    smallCaps: true,
    source: { label: 'Chapter X', url: 'https://gutenberg.net.au/ebooks01/0100011.txt' },
    rabbitHole: { label: 'Animal Farm', url: wiki('Animal_Farm') },
  },
  {
    id: 'metamorphosis',
    theme: 'Identity & Belonging',
    title: 'The Metamorphosis',
    author: 'Franz Kafka',
    note: 'trans. David Wyllie',
    text: 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin.',
    context: 'The opening line',
    source: { label: 'Part I', url: 'https://www.gutenberg.org/ebooks/5200' },
    rabbitHole: { label: 'The Metamorphosis', url: wiki('The_Metamorphosis') },
  },
  {
    id: 'perks',
    theme: 'Love & Friendship',
    title: 'The Perks of Being a Wallflower',
    author: 'Stephen Chbosky',
    text: 'We accept the love we think we deserve.',
    context: 'Bill, to Charlie',
    source: { label: 'p. 24, as cited on Wikiquote', url: 'https://en.wikiquote.org/wiki/The_Perks_of_Being_a_Wallflower' },
    rabbitHole: { label: 'Coming-of-age stories', url: wiki('Coming-of-age_story') },
  },
  {
    id: 'palace-of-illusions',
    theme: 'Mythology',
    title: 'The Palace of Illusions',
    author: 'Chitra Banerjee Divakaruni',
    text: 'Behold, we give you this girl, a gift beyond what you asked for. Take good care of her, for she will change the course of history.',
    context: 'The voices in the sacrificial smoke, at Draupadi’s birth',
    source: { label: 'Chapter 1 · Fire', url: 'https://www.chitradivakaruni.com/palace-of-illusions-excerpt' },
    rabbitHole: { label: 'Draupadi', url: wiki('Draupadi') },
  },
  {
    id: 'last-queen',
    theme: 'Womanhood & Empowerment',
    title: 'The Last Queen',
    author: 'Chitra Banerjee Divakaruni',
    text: 'I am Rani Jindan, Mother of the Khalsa. That is my identity. That is my fate.',
    context: 'Jindan',
    source: { label: 'As quoted on the author’s official page', url: 'https://www.chitradivakaruni.com/the-last-queen' },
    rabbitHole: { label: 'Maharani Jind Kaur', url: wiki('Jind_Kaur') },
  },
]
