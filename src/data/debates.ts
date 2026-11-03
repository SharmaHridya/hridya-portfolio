// Debate corner. Every entry starts as a labelled SAMPLE so no opinion is attributed to Hridya
// until she writes it. Replace the text and set `sample: false` to publish your own take.

export type Debate = {
  id: string
  question: string
  sample: boolean
  position: string
  supporting: string[]
  counter: string[]
  further: string[]
}

export const debates: Debate[] = [
  {
    id: 'ai-creativity',
    question: 'Will AI replace creativity or amplify it?',
    sample: true,
    position: 'A possible position: AI amplifies people who already have something to say, and makes it harder to stand out for those who do not.',
    supporting: [
      'Tools have repeatedly lowered the cost of making things (cameras, synthesisers, desktop publishing) without ending the craft.',
      'Generating options is cheap now; choosing well, which is taste, becomes the scarce skill.',
    ],
    counter: [
      'Entry-level creative work is where people learn. If it disappears, fewer people get good.',
      'Models trained on existing work may pull everything towards the average.',
    ],
    further: ['Is curation a form of creativity?', 'Who owns a style?'],
  },
  {
    id: 'efficiency',
    question: 'Should technology always prioritise efficiency?',
    sample: true,
    position: 'A possible position: efficiency is a means, not a goal; it should be traded away when it costs resilience, privacy or understanding.',
    supporting: [
      'Systems tuned for peak efficiency often have no slack when something breaks.',
      'Redundancy, like three copies of every chunk, is deliberate inefficiency that buys safety.',
    ],
    counter: ['Inefficiency has real costs: energy, money and people’s time.', '“Resilience” can become an excuse for bloat.'],
    further: ['Efficient for whom?', 'How would you measure the cost of fragility?'],
  },
  {
    id: 'open-source',
    question: 'Is open-source software the future?',
    sample: true,
    position: 'A possible position: open source is already the foundation; the open question is who pays to maintain it.',
    supporting: ['Most modern stacks, from Linux to Python to React, are open source.', 'Open code can be audited, which matters for security and trust.'],
    counter: ['Maintainers burn out while companies profit.', 'Some of the most capable AI models are closed.'],
    further: ['Should companies that depend on open source be required to fund it?'],
  },
  {
    id: 'machines-understand',
    question: 'Can machines truly understand human creativity?',
    sample: true,
    position: 'A possible position: it depends on what “understand” means, and the debate is mostly about that definition.',
    supporting: ['Models can explain why a joke works or why a chord progression resolves.', 'Understanding in people is also inferred from behaviour.'],
    counter: ['Predicting patterns is not the same as having the experience behind them.', 'Creativity often comes from intention, which machines arguably lack.'],
    further: ['Would we accept a test for understanding that some humans would fail?'],
  },
  {
    id: 'how-vs-use',
    question: 'Does knowing how something works matter more than knowing how to use it?',
    sample: true,
    position: 'A possible position: using comes first; knowing how it works is what lets you go further when it breaks.',
    supporting: [
      'Debugging is mostly the gap between what you think a system does and what it does.',
      'Building a regression from scratch makes library calls far less mysterious.',
    ],
    counter: ['Nobody can understand every layer; abstraction exists so we do not have to.', 'Shipping something useful beats understanding something unused.'],
    further: ['How deep is deep enough?', 'Which abstractions are safe to trust blindly?'],
  },
]
